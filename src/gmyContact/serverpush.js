new (function(){
	msgbox.on({
		event:'contact.notification',
		delay:-1,
		execute:function(data){
			mc.send({
				service :$sl.gmc_messageList_consumeMsg.service,
				method :$sl.gmc_messageList_consumeMsg.method,
				params:{
					uuid:data.messageUuid
				},
				success:function(){
					
				}
			});
			mc.loadModule({
				url:'modules/gmc/messageList.js',
				img:'adapter/testimg/xiaoxiguanli.png',
				params:{
					url:'modules/gmc/personContact/openCardFromMsg.js',
					uuid:data.uuid,
					title:data.title
				}
			});
		},
		createMsg:function(data){
			data.title = '联系人通知';
			data.content = '您收到了来自'+data.showName+'发送的联系人信息';
			return data;
		}
	});
});