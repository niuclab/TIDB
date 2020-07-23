/**
 * Created by lihl on 2016/5/6.
 */
$("#homeNav").addClass("active");
String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
//table
function createTable(geneSymbol) {
  $("#resultTable").bootstrapTable({
    filterControl: true,
    columns: [{
      checkbox: true
    }, {
      field: '_id',
      title: 'Gene',
      sortable: true,
      filterControl: "select",
      formatter: function (value, row, index) {
        //return "<a href="+ baseUrl +"/Home/Search/gene/geneid/"+ value +">"+value.toUpperCase()+"</a>";
        return `<a href="${baseUrl}/getGeneAnnotation/${row.gene_id}" target="_blank">${value}</a>`;
      }
    }, {
      field: 'organism',
      title: 'Organism',
      sortable: true,
      filterControl: "select"
    }, {
      field: 'countPmid',
      title: 'Pubmed abstracts',
      sortable: true,
      //filterControl:"input",
      formatter: function (value, row, index) {
        return `<a href="${baseUrl}/searchDetail/${row.gene_id}" target="_blank">${value}</a>`
      }
    }],
    pagination: true,
    queryParams: function (params) {
      params["geneSymbol"] = geneSymbol;
      return params;
    },
    url: baseUrl + "/searchPaging",
    pageList: [10, 25, 50, 100, 200, 500]
  })
}

createTable(searchItem);
$('[data-toggle="tooltip"]').tooltip();

(function () {
  function getUserSelectGene(isAnalysis) {
    var selectedRowArr = $("#resultTable").bootstrapTable("getSelections");
    var selectedGeneArr = [];
    if (selectedRowArr.length) {
      if (isAnalysis) {
        var organism = selectedRowArr[0]["organism"];
        for (var i = 0; i < selectedRowArr.length; i++) {
          var geneSymbol = selectedRowArr[i]["_id"];
          if(organism !== selectedRowArr[i]["organism"]){
            alert("please select genes from the same organism");
            return "";
          }
          if (selectedGeneArr.indexOf(geneSymbol) === -1) {
            selectedGeneArr.push(geneSymbol);
          }
        }
      } else {
        for (var i = 0; i < selectedRowArr.length; i++) {
          var id = selectedRowArr[i]["id"];
          selectedGeneArr.push(id);
        }
      }

    } else {
      if (isAnalysis) {
        alert("Must select a piece of data for analysis！")
      }/* else {
        alert("必须选择一条数据进行下载！")
      }*/

    }
    return selectedGeneArr.join(",");
  }

  /*$("#expressionBtn").on("click", function () {
    var userSelectGene = getUserSelectGene(true);
    if (userSelectGene) {
      $('[name="userSelectGene"]').val(userSelectGene);
      $("#analysisForm").attr("action", baseUrl + "/analysis").submit();
    }
  });*/
  $("#reactomeBtn").on("click", function () {
    $(".goForm").hide();
    var userSelectGene = getUserSelectGene(true);
    if (userSelectGene) {
      $('[name="userSelectGene"]').val(userSelectGene);
      $('[name="analysisType"]').val("reactome");
      $("#analysisForm").submit();
    }
  });
  $("#goBtn").on("click", function () {
    var userSelectGene = getUserSelectGene(true);
    if (userSelectGene) {
      $('[name="userSelectGene"]').val(userSelectGene);
      $('[name="analysisType"]').val("go");
      $("#analysisForm").submit();
    }
  });
  $("#ppiBtn").on("click", function () {
    var userSelectGene = getUserSelectGene(true);
    if (userSelectGene) {
      $('[name="userSelectGene"]').val(userSelectGene);
      $('[name="analysisType"]').val("PPI");
      $("#analysisForm").submit();
    }
  })
  /*//数据下载
  $("#downloadBtn").on("click", function () {
    var id = getUserSelectGene(false);
    if (id) {
      var url = baseUrl + "/Home/Download/searchDownload?id=" + id + "&geneType=" + geneType;
      window.open(url);
    }

  })*/
}());
