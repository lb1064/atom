/**
 * 从消息推打开名片,主页
 */
new (function(){

	var me = this;

	this.mod = new Gframe.module.Module({
		tabTitle:'通讯录',
		key:'openCardFromMsg_clipboardKey',
		colnums:[
			{header:'名称',width:200,mapping:'name'}
		]	
	});
	
	this.mod.defaultView = function(params){
		//alert(1);
		me.mod.remoteOpen({
			url:'modules/gmyContact/personContact/contactFolder/openCardForm.js',
			params:{
				uuid:params.uuid
			}
		});
	}
});