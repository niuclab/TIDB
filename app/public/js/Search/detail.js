/**
 * Created by lihl on 2016/5/6.
 */
$("#homeNav").addClass("active");

//table
function createTable(geneId, isLogin) {
  var colums = [{
    field: 'gene_name',
    title: 'Gene name',
    width: "120px",
    sortable: true,
    filterControl: "select",
  }, {
    field: 'gene_symbol',
    title: 'Gene symbol',
    width: "120px",
    sortable: true,
    filterControl: "select",
    formatter: function (value, row, index) {
      return "<a href=" + baseUrl + "/getGeneAnnotation/" + row.gene_id + ">" + value + "</a>";
    }
  }, {
    field: 'organism',
    title: 'Organism',
  }, {
    field: 'pmid',
    title: 'PubMed ID',
    formatter: function (value, row, index) {
      return "<a href='https://www.ncbi.nlm.nih.gov/pubmed/" + value + "' target='_blank'>" + value + "</a>";
    }
  }, {
    field: 'sentence',
    title: 'Evidence',
    formatter: function (value, row, index) {
      return "......" + value + "......</span>";
    }
  }, {
    width: "10%",
    title: "Manual validation",
    formatter: function (value, row, index) {
      return '<div class="btn-group btn-group-xs" role="group" aria-label="..."><button type="button" class="btn btn-success btn-operate" data-sentid="' + row._id + '" data-value="yes">Yes(' + row.yes + ')</button><button type="button" class="btn btn-danger btn-operate" data-sentid="' + row._id + '" data-value="no">No(' + row.no + ')</button></div>';
    }
  }];

  $("#resultTable").bootstrapTable({
    filterControl: true,
    columns: colums,
    pagination: true,
    url: baseUrl + "/detailPaging",
    queryParams: function (params) {
      params["geneId"] = geneId;
      return params;
    },
    onClickCell: function (field, value, row, ele) {
      if ("sentence" === field) {
        getSentences(row.pmid, row.sentence_pos, row.gene_id);
      }
    },
    onLoadSuccess: function (data) {
      $(".btn-operate").click(function () {
        //var sign = window.confirm(" ");
        var sign = true;
        if (sign) {
          var operateVal = $(this).attr("data-value");
          var sentid = $(this).attr("data-sentid");
          //var geneid = $(this).attr("data-geneid");
          sendOperate(operateVal, sentid);
        }
      })
    }
  })
}

//发送用户鉴定结果
function sendOperate(operateVal, sentId) {
  $.ajax({
    url: baseUrl + "/validateGeneSent",
    type: "get",
    data: {
      "gene_sent_id": sentId,
      "result": operateVal
    },
    success: function (data) {
      console.log(111, data);
      if (-1 === data.status) {
        alert("You must log in!");
      } else if (2 === data.status) {
        //相同操作
        alert("You have selected it!")//已经进行过操作
      } else if (3 === data.status) {
        //值非法
        alert("Please enter the correct value!")//已经进行过操作
      } else if (1 === data.status) {
        alert("success");
        //refresh table
        $("#resultTable").bootstrapTable("refresh", { silent: true });
      }
    }
  })
}

function sentIdSort(a, b) {
  var aSentId = a["id"];
  var bSentId = b["id"];
  var aNum = aSentId.split("_")[1];
  var bNum = bSentId.split("_")[1];
  return Number(aNum) - Number(bNum);
}

function getSentences(pmid, sentence_pos, gene_id) {
  $.ajax({
    url: baseUrl + "/getSentence",
    data: {
      pmid: pmid,
      sentence_pos: sentence_pos,
      gene_id: gene_id
    },
    async: false,
    success: function (data) {
      //var returnObjArr = JSON.parse(data);
      var returnObjArr = data;
      //returnObjArr.sort(sentIdSort);
      var sentenceId = pmid + "_" + sentence_pos;
      var paraStr = "";
      var matchedFlag = true;
      for (var i = 0; i < returnObjArr.length; i++) {
        var sentence = returnObjArr[i]["sentence"];
        if (matchedFlag && sentenceId === returnObjArr[i]["id"]) {
          paraStr = paraStr + "<p class='text-info matchedSent'>" + sentence + "</p>";
          matchedFlag = false;
        } else {
          paraStr = paraStr + "<p class='text-info'>" + sentence + "</p>";
        }
      }
      $(".highlightPara").empty().append(paraStr);
      $("#showModal").modal("show");
    }
  })
}

//返回highlight表格数据
function getHighlightData(highlightDataObj) {
  var tableData = [];
  for (var key in highlightDataObj) {
    tableData.push({ "highlight": key, "color": "#f00", "highlightClass": highlightDataObj[key] });
  }
  return tableData;
}

//字段匹配，返回highlight表格数据对象
function mathcedPart(matchedArr, sentence) {
  var sentenceArr = sentence.split(" ");
  if (!!matchedArr) {
    for (var j = 0; j < matchedArr.length; j++) {
      var highlightItem = matchedArr[j];
      for (var k = 0; k < sentenceArr.length; k++) {
        var compareValue = sentenceArr[k].replace(".", "");
        if (compareValue === highlightItem && k < sentenceArr.length - 1) {
          sentenceArr[k] = "<span class='highlightItem'>" + highlightItem + "</span>";
          /*tempObj[highlightItem] = highlightItem;*/
        } else if (compareValue === highlightItem && k === sentenceArr.length - 1) {
          sentenceArr[k] = "<span class='highlightItem'>" + highlightItem + "</span>.";
          //tempObj[highlightItem] = highlightItem;
        }
      }
    }
  }
  return { sentence: sentenceArr.join(" ") };
}

$(".btnSent").click(function () {
  if ($(this).hasClass("active")) {
    clearColor("matchedSent");
    $(this).removeClass("active");
  } else {
    addColor("matchedSent", "#DCDCDC");
    $(this).addClass("active");
  }
});
$(".btnTerm").click(function () {
  if ($(this).hasClass("active")) {
    clearColor("match");
    $(this).removeClass("active");
  } else {
    addColor("match", "yellow");
    $(this).addClass("active");
  }
});

//去除着色
function clearColor(className) {
  $(".highlightPara" + " ." + className).css("background-color", "transparent");
  /*if($("."+className).hasClass("active")){
      $("."+className).removeClass("active")
  }*/
}

//着色
function addColor(className, color) {
  $(".highlightPara" + " ." + className).css("background-color", color);
  /*if(!$("."+className).hasClass("active")){
      $("."+className).addClass("active")
  }*/
}