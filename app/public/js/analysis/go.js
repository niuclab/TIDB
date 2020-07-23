function openLayer() {
    $(".layerContainer").css("display", "flex");
}
function closeLayer() {
    $(".layerContainer").css("display", "none");
}
var socket = io('/task_socket', {
    transports: ['websocket'],
    query: {
        taskId: flag
    }
});
socket.on('reconnect_attempt', function () {
    socket.io.opts.transports = ['polling', 'websocket'];
});
$(".parmaForm").on("submit", function (e) {
    openLayer();
    e.preventDefault();
    $(".goImage").hide();
    $(".resultExportBtn").hide();
    var tempData = $(this).serializeArray();
    var submitData = { flag: flag, taskType: 'go' };
    tempData.forEach(function (item) {
        submitData[item.name] = item.value;
    })
    console.log(111, submitData)
    //sendData(submitData);
    socket.emit('submitTask', submitData);
})
function sendData(submitData) {
    $.ajax({
        url: baseUrl + '/goAnalysis',
        data: submitData,
        success: function (data) {
            closeLayer();
            if (data.status === 'success') {
                $(".resultExportBtn").show();
                renderTable(data.tableDatas)
                $(".chartFormGroup").show();
                //加载图片
                $(".goImage").show().attr("src", baseUrl + "/getImage/go/" + flag)
            }
        },
        error: function () {
            closeLayer();
            alert("未得到分析结果");
        }
    })
}

function renderTable(tableData) {
    $("#table").bootstrapTable("destroy")
    $("#table").bootstrapTable({
        data: tableData,
        columns: [{
            field: 'ID',
            title: 'GO ID',
            formatter: function (value, row, index) {
                return `<a href="http://amigo.geneontology.org/amigo/term/${value}" target="_blank">${value}</a>`
            }
        }, {
            field: 'Description',
            title: 'GO description'
        }, {
            field: 'GeneRatio',
            title: 'GeneRatio'
        }, {
            field: 'pvalue',
            title: 'pvalue'
        }, {
            field: 'qvalue',
            title: 'qvalue'
        }, {
            field: 'geneID',
            title: 'geneID'
        }, {
            field: 'Count',
            title: 'Count'
        }],
        pagination: true,
        pageList: [10, 25, 50, 100, 200, 500]
    })
}

$(".submitUpdate").on('click', function () {
    var featuresNumber = $("#featuresNumber").val();
    var chartType = $("#chartType").val();
    if (Number(featuresNumber) > 0) {
        openLayer();
        socket.emit('submitTask', {flag:flag, featuresNumber:featuresNumber, chartType:chartType, taskType:"goRedraw"});
        // $.ajax({
        //     url: baseUrl + "/redrawGoChart/" + flag + "/" + featuresNumber + "/" + chartType,
        //     success: function (data) {
        //         closeLayer()
        //         if (data.status === 'success') {
        //             $(".goImage").show().attr("src", baseUrl + "/getImage/go/" + flag + "?token=" + Date.now())
        //         } else {
        //             alert("未得到分析结果");
        //         }
        //     },
        //     error: function () {
        //         closeLayer();
        //         alert("未得到分析结果");
        //     }
        // })
    } else {
        alert("请输入正确的值");
    }
})

socket.on('taskOver', function (resData) {
    console.log(22, resData)
    closeLayer();
    if(resData.status === "error") {
        alert("未得到分析结果");
    }else if(resData.status === "success"){
        if(resData.taskType === "go"){
            $(".resultExportBtn").show();
            renderTable(resData.tableDatas)
            $(".chartFormGroup").show();
            //加载图片
            $(".goImage").show().attr("src", baseUrl + "/getImage/go/" + flag)
        }else if(resData.taskType === "goRedraw"){
            $(".goImage").show().attr("src", baseUrl + "/getImage/go/" + flag + "?token=" + Date.now())
        }
        
    }
})
