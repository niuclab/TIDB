#!/bin/sh
# 共8个参数，
# 第1个是基因列表文件: 在检索结果中选择的要进行后续分析的基因名称
# 第2个是物种，分析界面选择指定的物种，三个选项Homo sapiens，Mus musculus，Rattus norvegicus
# 第3、4、5、6对应GO分析界面中的四个参数，之前写了三个参数，现在新增一个参数指定可视化图中条目数：
#   3：GO分类，四个选项biological process, molecular function, celluar compenent, all
#   4：pvalue cutoff, 默认为0.05
#   5：fdr_adjust,选中为TRUE，默认为选中
#   6：Number of features to visualization，默认为10
# 第7、8分别指定resulsts table（csv）和visualization（png）文件位置，计算完后加载到前端展示即可
Rscript --vanilla GO-enrichment.R example_genes  "Mus musculus" "biological process" 0.01 TRUE 10 table.csv plot.png
