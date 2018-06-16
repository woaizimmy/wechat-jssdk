$(function(){
	var timestamp = Date.parse(new Date())/1000,
		noncestr = randomString(16),
		url = window.location.href;
	console.log('timestamp:'+timestamp+', noncestr:'+noncestr+', url:'+url);

	$.post("http://m.ciyigou.com/tool/jssdksig/", { timestamp: timestamp, noncestr: noncestr, url: url }, function(data){
    	console.log(data);
    	var signt = data["signature"];

    	wx.config({
		    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: 'xxx', // 必填，公众号的唯一标识
		    timestamp: timestamp, // 必填，生成签名的时间戳
		    nonceStr: noncestr, // 必填，生成签名的随机串
		    signature: signt,// 必填，签名，见附录1
		    jsApiList: [
		    	'hideMenuItems'
		    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});

		wx.ready(function(){
			wx.hideMenuItems({
			    menuList: [
			    	'menuItem:share:appMessage',
			    	'menuItem:share:timeline',
			    	'menuItem:share:qq',
			    	'menuItem:share:weiboApp',
			    	'menuItem:share:facebook',
			    	'menuItem:share:QZone',
			    	'menuItem:copyUrl',
			    	'menuItem:openWithQQBrowser',
			    	'menuItem:openWithSafari',
			    	'menuItem:share:email'
			    ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
			});
		});

		wx.error(function(res){
			console.log(res);
		});

  	}, "json");


  	
});

function randomString(len){
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';	/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	var maxPos = $chars.length;
	var pwd = '';
	for(i = 0; i < len; i++){
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}
