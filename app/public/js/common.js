/**
 * Created by lihon on 2016/5/23.
 */
//改变字符串首字母为大写
String.prototype.capitalizeFirstLetter=function () {
    return this.charAt(0).toUpperCase()+this.slice(1);
};
var formModal = "login"
$('#userModal a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
    formModal = $(this).attr("form-model");
  })
//登录表单验证
$.getScript("/TIDBStatic/widgets/validate/jquery.validate.js", function (data, textStatus, jqxhr) {
    $("#loginForm").submit(function (e) {
        e.preventDefault();
    }).validate({
        rules: {
            userEmail: {
                required: true,
                email: true
            },
            password: {
                required: true
            }
        },
        errorClass: "error",
        success: 'valid',
        unhighlight: function (element, errorClass, validClass) { //验证通过
            $(element).parent().removeClass("has-error");
            $(element).tooltip('destroy').removeClass(errorClass);
            return;
        },
        errorPlacement: function (label, element) {
            $(element).tooltip('destroy'); /*必需*/
            $(element).parent().addClass("has-error");
            $(element).attr('title', $(label).text()).tooltip({placement: "bottom"});
            $(element).tooltip('show');
        },
        submitHandler: function (form) {
            loginCheck();
        }
    });
});
var loginCheck = function () {
    var userEmail = $("#userEmail").val();
    var password = $("#password").val();
    let url = formModal === "login"? baseUrl+"/login":baseUrl+"/register"
    $.ajax({
        url: url,
        data: {
            "email": userEmail,
            "password": password
        },
        success: function (data) {
            console.log(data);
            if(data.status === 1) {
                if(formModal === "login"){
                    alert("Login success");
                    location.reload();
                }else{
                    alert("Register success");
                    $("#loginModal").modal("hide");
                    //location.reload();
                    //跳转到登录表单
                    document.getElementById("loginForm").reset();
                    $("#userModal a:first").tab("show")
                    formModal = "login"
                }
            }else {
                if(formModal === "login"){
                    alert("Email or password error!")
                }else if(formModal === "register"){
                    alert("Email has been registered")
                }
            }
        }
    })
};