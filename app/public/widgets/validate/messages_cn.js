/***************************************************
// Title: messages_cn.js
// Package: common/jquery/validate
// Description: TODO
// Author: 李季
// Date: 2016年1月7日
// Time: 下午4:25:50
// Copyright: 云科凯创@2016
***************************************************/

jQuery.extend(jQuery.validator.messages, {
    required: "必选字段",
	remote: "请修正该字段",
	email: "请输入正确格式的电子邮件",
	url: "请输入合法的网址",
	date: "请输入合法的日期",
	dateISO: "请输入合法的日期 (ISO).",
	number: "请输入合法的数字",
	digits: "只能输入整数",
	creditcard: "请输入合法的信用卡号",
	equalTo: "请再次输入相同的值",
	accept: "请输入拥有合法后缀名的字符串",
	maxlength: jQuery.validator.format("您输入的信息过长，上限是 {0}"),
	minlength: jQuery.validator.format("您输入的信息过短，下限是{0}"),
	rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
	range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
	max: jQuery.validator.format("请输入一个最大为{0} 的值"),
	min: jQuery.validator.format("请输入一个最小为{0} 的值"),
	isZipCode: "只能包括中文字、英文字母、数字和下划线"
});