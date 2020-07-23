/**
 * Created by lihon on 2016/5/23.
 */
/**
 * Created by lihon on 2016/5/23.
 */
$("#logNav").addClass("active");
//登录表单验证
$.getScript(publicUrl + "/widgets/validate/jquery.validate.js", function (data, textStatus, jqxhr) {
    $("#registerForm").submit(function (e) {
        e.preventDefault();
    }).validate({
        rules: {
            userEmail: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength:6
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
            $(element).tooltip('destroy'); /!*必需*!/
            $(element).parent().addClass("has-error");
            $(element).attr('title', $(label).text()).tooltip({placement: "bottom"});
            $(element).tooltip('show');
        },
        submitHandler: function (form) {
            registerCheck();
        }
    });
});
var registerCheck = function () {
    var userEmail = $("#userEmail").val();
    var password = $("#password").val();
    $.ajax({
        url: baseUrl + "/Home/Login/registerCheck",
        type: "post",
        data: {
            "uerEmail": userEmail,
            "password": password
        },
        success: function (data) {
            if ("success" == data) {
                location.href= redirectUrl;
            } else {
                $(".registerTip").show();
            }
        }
    })
}
