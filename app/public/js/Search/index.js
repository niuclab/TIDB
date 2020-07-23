/**
 * Created by lihl on 2016/5/6.
 */
$("#geneSymbol").autocomplete({
    source:baseUrl+"/Home/Search/searchHelp",
    delay: 500
})
$("#diseaseTerm").autocomplete({
    source:baseUrl+"/Home/Search/searchDisease",
    delay: 500
});
$("#geneTooltip").tooltip({
    title:"please input gene symbol",
    placement:"right"
})
$("#termTooltip").tooltip({
    title:"please input disease term",
    placement:"right"
});
//表单提交
$(".btn-submit").click(function (e) {
    e.preventDefault();
    var diseaseValue = $("#diseaseTerm").val();
    var geneVale = $("#geneSymbol").val();
    //用户没有输入任何内容
    if($.trim(geneVale)=="" && $.trim(diseaseValue)==""){
        alert("You must input a gene symbol or disease term!");
        return;
    }
    var submitFlag = true;
    //用户输入疾病的值，未选择提示框内容
    if($.trim(diseaseValue)!=""){
        $.ajax({
            url:baseUrl+"/Home/Search/getDiseaseidByName/diseasename/"+diseaseValue,
            type:"get",
            async:false,
            success:function(data){
                if(data!="null"){
                    var returnData = JSON.parse(data);
                    var newPostVal = returnData.id;
                    //$("#diseaseTerm").val(newPostVal);
                    $("[name='diseaseTerm']").val(newPostVal);
                }else{
                    alert("No matched disease, please input another one!");
                    submitFlag = false;
                }
            }
        })
    }
    if($.trim(diseaseValue)==""){
        $("[name='diseaseTerm']").val("");
    }
    if(submitFlag) $("#searchForm").submit();

})
