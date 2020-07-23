$("#browseNav").addClass("active");
//点击字母筛选基因
$(".geneFilter").click(function () {
    var geneType = $(this).text();
    $(".geneFilter").removeClass("active");
    $(this).addClass("active");
    createGeneTable(geneType);
});
createGeneTable("A");
//gene table
function createGeneTable(queryItem) {
    if ($("#geneTable").bootstrapTable()) {
        //若存在则销毁表格，否则影响表格的翻页
        $("#geneTable").bootstrapTable("destroy");
    }
    $("#geneTable").bootstrapTable({
        columns: [{
            field: 'gene_symbol',
            title: 'Gene symbol',
            formatter: function (value, row, index) {
                return "<a href=" + baseUrl + "/getGeneAnnotation/" + row.gene_id + ">" + value + "</a>";
            }
        }, {
            field: 'organism',
            title: 'Organism'
        }, {
            field: "download",
            title: "Download",
            formatter: function () {
                return '<i class="fa fa-download" aria-hidden="true"></i>';
            },
            align: "right"
        }],
        //sidePagination: "server",
        url: baseUrl + "/browsePaging",
        queryParams: function (params) {
            params["geneTerm"] = queryItem;
            return params;
        },
        onClickCell: function (field, value, row, ele) {
            if ("download" == field) {
                var genesymbol = row.gene_symbol;
                var url = baseUrl + "/geneDownload/" + genesymbol;
                window.open(url);
            }
        },
        pageSize: 50,
        pageList: [50, 100, 200]
    });
}