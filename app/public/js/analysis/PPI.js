var networkChart, requestTimes = 0;
function openLayer() {
    $(".layerContainer").css("display","flex");
}
function closeLayer() {
    $(".layerContainer").css("display","none");
}
$(".close").on("click", function(){
    $(".alert").hide();
})
$(".alert").width($("#visualization").width()-52);
$(".exportDataBtn").hide();
$(".parmaForm").on("submit", function (e) {
    openLayer();
    e.preventDefault();
    var tempData = $(this).serializeArray();
    var submitData = { flag: flag };
    tempData.forEach(function (item) {
        submitData[item.name] = item.value;
    })
    $(".alert").hide();
    if(networkChart) {
        networkChart.destroy();
    }
    sendData(submitData);
})
function setAlert(tipCode, missGenes){
    if(tipCode !== 1){
        var warningContent = "";
        if(tipCode === 2) {
            let isOrAre = missGenes.indexOf(",")!==-1?"are":"is"
            warningContent = "gene "+ missGenes + " " + isOrAre + "  not in the original PPI network from IntAct database.";
        }else{
            warningContent = "all the genes are not in the original PPI network from IntAct database，can’t reconstruct the PPI network.";
        }
        $(".warningContent").text(warningContent);
        $(".alert").show();
    }
}
function sendData(submitData) {
    requestTimes = 0;
    $.ajax({
        url: baseUrl + '/PPIAnalysis',
        data: submitData,
        success: function (data) {
            checkTaskStatus();
        },
        error:function() {
            closeLayer();
            alert("No analysis results!");
            $(".exportDataBtn").hide();
        }
    })
}
function checkTaskStatus() {
    requestTimes ++;
    let status = "success";
    $.ajax({
        url: baseUrl + "/checkTaskStatus",
        async: false,
        data: {
            taskType: "PPI",
            flag: flag
        },
        success:function(data){
            status = data.status;
        },
        error: function(){
            status = "requestError"
        }
    })
    if(status === "success"){
        closeLayer();
        getResult();
    }else if(status === "error"){
        closeLayer();
        alert("No analysis results!");
        $(".exportDataBtn").hide();
    } else if(status === "running"){
        if(requestTimes > 5){
            closeLayer();
            alert("Task timeout, please resubmit!");
            $(".exportDataBtn").hide();
        }else {
            setTimeout(function(){
                checkTaskStatus();
            },30000);
        }
    }
}
function getResult() {
    $.ajax({
        url: baseUrl+"/getPPIResult",
        data:{
            flag:flag
        },
        success:function(data){
            var tipCode = data.tipCode;
            setAlert(tipCode, data.missGenes);
            if(data.tipCode !== 3){
                renderNetwork(data.elements, data.nodeNumber)
                $("#exportNetwork").show();
                $(".exportDataBtn").show();
            }else{
                $(".exportDataBtn").hide();
            }
        }
    })
}

function renderNetwork(elements, nodeNumber) {
    var temp = Math.round(600*5/nodeNumber);
    var nodeSize = 0;
    if(temp>10) {
        nodeSize = 10;
    }else if(temp <2){
        nodeSize = 2;
    }else{
        nodeSize = temp;
    }
    for(var i=0;i<nodeNumber;i++){
        var node = elements[i];
        var nodeName = node["data"]["id"];
        if(userSelectGenes.includes(nodeName)){
            node["classes"] = ['userSelected'];
        }
    }
    networkChart = cytoscape({
        container: $('#networkContainer'),
        elements: elements,
        layout:{
            name: "cola",
            randomize: true,
            avoidOverlap: true
        },
        zoom: 1,
        style:[{
            selector: 'node',
            style: {
                'background-color': '#82b9e8',
                'width': nodeSize,
                'height': nodeSize,
                'label': 'data(id)',
                'font-size': nodeSize
            }
        }, {
            selector: 'node.userSelected',
            style: {
                'background-color': '#f00',
                'label': 'data(id)',
                'width': nodeSize,
                'height': nodeSize
            }
        }, {
            selector: 'edge',
            style: {
                'line-color': '#82b9e8',
                'width': 1
            }
        }]
    });
    networkChart.panzoom({});

}
$("#exportNetwork").on('click', function() {
    if(networkChart){
        var svgContent = networkChart.svg({scale: 1, full: true});
        var blob = new Blob([svgContent], {type:"image/svg+xml;charset=utf-8"});
        saveAs(blob, "network.svg");
    }
});