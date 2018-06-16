// 微信jssdk自定义功能测试
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
		    	'checkJsApi',
		        'onMenuShareTimeline',
		        'onMenuShareAppMessage',
		        'onMenuShareQQ',
		        'onMenuShareWeibo',
		        'onMenuShareQZone',
		        'hideMenuItems',
		        'showMenuItems',
		        'hideAllNonBaseMenuItem',
		        'showAllNonBaseMenuItem',
		        'translateVoice',
		        'startRecord',
		        'stopRecord',
		        'onVoiceRecordEnd',
		        'playVoice',
		        'onVoicePlayEnd',
		        'pauseVoice',
		        'stopVoice',
		        'uploadVoice',
		        'downloadVoice',
		        'chooseImage',
		        'previewImage',
		        'uploadImage',
		        'downloadImage',
		        'getNetworkType',
		        'openLocation',
		        'getLocation',
		        'hideOptionMenu',
		        'showOptionMenu',
		        'closeWindow',
		        'scanQRCode',
		        'chooseWXPay',
		        'openProductSpecificView',
		        'addCard',
		        'chooseCard',
		        'openCard'
		    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});

	    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		wx.ready(function(){
			wx.onMenuShareAppMessage({
			    title: '微信jssdk自定义分享测试', // 分享标题
			    desc: '这是个自定义描述', // 分享描述
			    link: '', // 分享链接
			    imgUrl: '', // 分享图标
			    type: '', // 分享类型,music、video或link，不填默认为link
			    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			    success: function () { 
			        // 用户确认分享后执行的回调函数
			        alert('分享成功！');
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			        alert('分享已取消');
			    }
			});
		});

	    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
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
