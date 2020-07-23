# Rscript --vanilla GO-visualization.R enrich_res.rda  dot 10 plot.png
# 共4个参数，
# 第1个是GO-enrichment的最后一个参数指定的保存富集分析结果的文件
# 第2个是指定图形类型 dot 或者 bar，默认为 dot
# 第3个是重新设置的top feature
# 第4个是产生的新图片文件名
# library(patchwork)
library(enrichplot)

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
enrich_res_file <- arguments[1]
load(enrich_res_file)
type = arguments[2]
top_features <- as.numeric(arguments[3])
out_plot_file <- arguments[4]

plot_go_res(enrich_res, type = type, top_features = top_features, file = out_plot_file)
