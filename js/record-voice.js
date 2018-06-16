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
		        'translateVoice',
		        'startRecord',
		        'stopRecord',
		        'onVoiceRecordEnd',
		        'playVoice',
		        'onVoicePlayEnd',
		        'pauseVoice',
		        'stopVoice',
		        'uploadVoice',
		        'downloadVoice'
		    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});

	    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		wx.ready(function(){

			var voice_localId;
			var voice_serverId = '';
			if (!localStorage.rainAllowRecord) {
				localStorage.rainAllowRecord = '';
			}
			
			//按下开始录音
			$('#talk_btn').on('touchstart', function(event){
			    event.preventDefault();
			    START = new Date().getTime();

			    recordTimer = setTimeout(function(){
			        wx.startRecord({
			            success: function(){
			                localStorage.rainAllowRecord = 'true';
			            },
			            cancel: function () {
			                alert('用户拒绝授权录音');
			            }
			        });
			    },300);
			});

			//松手结束录音
			$('#talk_btn').on('touchend', function(event){
			    event.preventDefault();
			    END = new Date().getTime();
			    
			    if((END - START) < 300){
			        END = 0;
			        START = 0;
			        //小于300ms，不录音
			        clearTimeout(recordTimer);
			    }else{
			        wx.stopRecord({
			          success: function (res) {
			            voice_localId = res.localId;
			            alert('录音成功');
			            // uploadVoice();
			          },
			          fail: function (res) {
			            alert(JSON.stringify(res));
			          }
			        });
			    }
			});

			$('#playVoice').click(function(){
            	playVoice();
            });

            $('#stopVoice').click(function(){
            	stopVoice();
            });

            $('#uploadVoice').click(function(){
            	uploadVoice();
            });

            $('#downloadVoice').click(function(){
            	if(voice_serverId == ''){
            		alert('录音尚未上传,无法下载！');
            	}else{
            		downloadVoice();
            	}
            });

			// 播放语音
			function playVoice(){
				wx.playVoice({
				    localId: voice_localId // 需要播放的音频的本地ID，由stopRecord接口获得
				});
			}

			// 停止播放语音
			function stopVoice(){
				wx.stopVoice({
				    localId: voice_localId // 需要停止的音频的本地ID，由stopRecord接口获得
				});
			}
			
			// 监听语音播放完毕
			wx.onVoicePlayEnd({
			    success: function (res) {
			        voice_localId = res.localId; // 返回音频的本地ID
			        alert('播放完毕，是否需要上传？');
			    }
			});

			//上传录音
			function uploadVoice(){
			    //调用微信的上传录音接口把本地录音先上传到微信的服务器
			    //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
			    wx.uploadVoice({
			        localId: voice_localId, // 需要上传的音频的本地ID，由stopRecord接口获得
			        isShowProgressTips: 1, // 默认为1，显示进度提示
			        success: function (res) {
			        	alert('录音已上传到微信服务器，保留3天。serverId是：'+voice_serverId);
			        	voice_serverId = res.serverId;
			        	
			            //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
			            // $.ajax({
			            //     url: '后端处理上传录音的接口',
			            //     type: 'post',
			            //     data: JSON.stringify(res),
			            //     dataType: "json",
			            //     success: function (data) {
			            //         alert('文件已经保存到自己的服务器');
			            //     },
			            //     error: function (xhr, errorType, error) {
			            //         console.log(error);
			            //     }
			            // });
			        }
			    });
			}

			// 下载录音
			function downloadVoice(){
				wx.downloadVoice({
				    serverId: voice_serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
				    isShowProgressTips: 1, // 默认为1，显示进度提示
				    success: function (res) {
				        localId = res.localId; // 返回音频的本地ID
				    }
				});
			}
			

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
