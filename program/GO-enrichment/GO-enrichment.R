# Rscript --vanilla GO-enrichment.R example_genes  "Mus musculus" "biological process" 0.01 TRUE 10 dot table.csv plot.png enrich_res.rda
# 共10个参数，
#   1: 是基因列表文件: 在检索结果中选择的要进行后续分析的基因名称
#   2: 物种，分析界面选择指定的物种，三个选项Homo sapiens，Mus musculus，Rattus norvegicus
#   3,4,5,6:对应GO分析界面中的四个参数，之前写了三个参数，现在新增一个参数指定可视化图中条目数：
#     3：GO分类，四个选项biological process, molecular function, celluar compenent, all
#     4：pvalue cutoff, 默认为0.05
#     5：fdr_adjust,选中为TRUE，默认为选中
#     6：Number of features to visualization，默认为10
#   7: plot 类型 dot 或者 bar，默认为dot
#   8,9:resulsts table（csv）和visualization（png）文件位置，计算完后加载到前端展示即可
#   10:保存富集分析结果到文件，供后续可视化分析


# library(patchwork)
library(enrichplot)
library(org.Hs.eg.db)

# 三个物种的注释数据库hsa:org.Hs.eg.db, mouse:org.Mm.eg.db, rat: org.Rn.eg.db
species_db <- c(
  `Homo sapiens` = "org.Hs.eg.db", 
  `Mus musculus` = "org.Mm.eg.db", 
  `Rattus norvegicus` = "org.Rn.eg.db"
)

# ontology 四个选项
onts <- c(
  `biological process` = "BP",
  `molecular function` = "MF",
  `celluar compenent`  = "CC",
  all = "ALL"
)

# for (db in species_db) {
#   if (!requireNamespace(db, quietly = TRUE))
#     BiocManager::install(db)
# }

## 基因列表例子, 以小鼠基因为例
# genes_info <- readr::read_csv("output/data/ti_paper.csv")
# mmu_genes <- dplyr::distinct(genes_info, gene_id, .keep_all = TRUE) %>% 
#   filter(organism == "Mus musculus")
# sample_genes <- unique(mmu_genes$gene_symbol)[1:10]
# readr::write_csv(data.frame(sample_genes), "output/data/example_genes", col_names = FALSE)

#' extract enrich go table
#' @references https://github.com/YuLab-SMU/DOSE/blob/5be8e21c56242d58b5576c20412b3457bc61dae7/R/enricher_internal.R#L180-L201
extract_enrich_go <- function(object) {
  Over <- object@result
  
  pvalueCutoff <- object@pvalueCutoff
  if (length(pvalueCutoff) != 0) {
    ## if groupGO result, numeric(0)
    Over <- Over[ Over$pvalue <= pvalueCutoff, ]
    Over <- Over[ Over$p.adjust <= pvalueCutoff, ]
  }
  
  qvalueCutoff <- object@qvalueCutoff
  if (length(qvalueCutoff) != 0) {
    if (! any(is.na(Over$qvalue))) {
      if (length(qvalueCutoff) > 0)
        Over <- Over[ Over$qvalue <= qvalueCutoff, ]
    }
  }
  
  
  return(Over)
}

#' keep five digits
round5 <- function(x) {
  ifelse(
    x <= 1e-5,
    as.numeric(formatC(x, format = "g", digits = 5)),
    as.numeric(formatC(x, format = "f", digits = 5))
  )
}

#' GO enrichment analysis
#' 
#' @param genes character vector, gene symbols
#' @param species organism ,
#' for full list see http://bioconductor.org/packages/release/BiocViews.html#___OrgDb
#' @param ont One of "BP", "MF", and "CC" subontologies, or "ALL" for all three.
#' @param pvalue_cutoff cutoff of p value, default "0.05"
#' @param fdr_adjust whether adjust the pvalue using fdr method, default "TRUE"
enrich_go <- function(genes, 
                      species = c("Homo sapiens", "Mus musculus", "Rattus norvegicus"), 
                      ont = c("biological process", "molecular function", "celluar compenent", "all"),
                      pvalue_cutoff = 0.05,
                      fdr_adjust = TRUE,
                      file = "enrich_res.csv") {
  
  species <- match.arg(species, c("Homo sapiens", "Mus musculus", "Rattus norvegicus"))
  db <- species_db[species]
  ont <- match.arg(
    ont,
    c("biological process", "molecular function", "celluar compenent", "all")
  )
  ont <- onts[ont] 
  
  genes_id <- clusterProfiler::bitr(
    genes, 
    fromType = "SYMBOL", 
    toType = "ENTREZID", 
    OrgDb = db
  )
  padjust_method <- ifelse(fdr_adjust, "fdr", "none")
  res <- clusterProfiler::enrichGO(
    genes_id$ENTREZID, 
    OrgDb = db, 
    ont = ont,
    pvalueCutoff = pvalue_cutoff,
    pAdjustMethod = padjust_method,
    qvalueCutoff = 0.05
  )
  
  # save the enrichment res
  res_table <- extract_enrich_go(res)
  res_table$pvalue <- round5(res_table$pvalue)
  res_table$p.adjust <- round5(res_table$p.adjust)
  res_table$qvalue <- round5(res_table$qvalue)
  readr::write_csv(res_table, path = file)
  
  res
}

#' Height of enrich go plot
get_plot_height <- function(top_features = 10) {
  if(top_features < 5 ){
    h <- 4;
  } else if (top_features < 10){
    h <- top_features/1.5;
  } else if (top_features < 15){
    h <- top_features/2;
  } else if (top_features < 20){
    h <- top_features/2.2;
  } else if (top_features < 25){
    h <- top_features/2.6;
  } else if (top_features < 30){
    h <- top_features/2.8;
  } else if (top_features < 40){
    h <- top_features/3;
  } else {
    h <- top_features/4;
  }
  
  h
}

plot_go_res <- function(enrich_res, 
                        type = "dot", 
                        top_features = 10, 
                        file = "enrich_plot.png") {
  if (type == "dot") {
    p <- enrichplot::dotplot(enrich_res, showCategory = top_features, font.size = 8)
  }
  if (type =="bar") {
    p <- barplot(enrich_res, showCategory = top_features, font.size = 8)
  }
  
  ggplot2::ggsave(p, filename = file, dpi = 300, width = 9, height = get_plot_height(top_features))
}

arguments <- commandArgs(trailingOnly = TRUE)

genes <- readr::read_csv(arguments[1], col_names = FALSE)[[1]]
species <- arguments[2]
ont <- arguments[3]
pvalue_cutoff <- as.numeric(arguments[4])
fdr_adjust <- as.logical(arguments[5])
top_features <- as.numeric(arguments[6])
type <- arguments[7]
out_table_file <- arguments[8]
out_plot_file <- arguments[9]
enrich_res_file <- arguments[10]

enrich_res <- enrich_go(
  genes, 
  species = species,
  ont = ont,
  pvalue_cutoff = pvalue_cutoff,
  fdr_adjust = fdr_adjust,
  file = out_table_file
)
# 保存以供后续可视化展示
save(enrich_res, file = enrich_res_file)

plot_go_res(enrich_res, type = type, top_features = top_features, file = out_plot_file)


