/**
 * 编辑用户密码
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var getData;
	this.mod.defaultView = function(params){
		getData = params.sendData;
		me.mod.main.open({
			id:'editUserInfoPwd_id',
			xtype:'form',
			mode:'pop',
			width:580,
			height:200,
			title:'修改密码',
			fields:[
				{height:40,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'原密码：',width:120},
						{xtype:'password',leftHidden:true,itemId:'oldPwd_id',name:'oldPwd',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{height:40,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'新密码：',width:120},
						{xtype:'password',leftHidden:true,itemId:'newPwd_id',name:'newPwd',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{height:40,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'确认 新密码：',width:120},
						{xtype:'password',leftHidden:true,itemId:'cnewPwd_id',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{
					height:40,
					cols:[
						{xtype:'blank',width:'max'},
						{
							xtype:'button',
							width:100,
							value:'确认修改',
							handler:me.submitFoem					
						},
						{xtype:'blank',width:20},
						{xtype:'button',width:100,value:'取消',handler:function(){
							var form = me.mod.main.get('editUserInfoPwd_id');
							form.reset();
							me.mod.main.popMgr.close('editUserInfoPwd_id');
						}},					
						{xtype:'blank',width:'max'}
					]
				}
			],
			initMethod:function(mod){
				
			}
		});
	}
	
	
	this.submitFoem = function(){
		var form = me.mod.main.get('editUserInfoPwd_id');
		var newPwd = form.getByItemId('newPwd_id');
		var cnewPwd = form.getByItemId('cnewPwd_id');
		if(newPwd.getValue()!=cnewPwd.getValue()){
			me.mod.main.alert({
				text:'两次输入的密码不一致!',
				delay:2000,
				level:'error'
			});
		}else{
			var o = form.serializeForm();
			form.submit({
				service:$sl.guserManager_systemUserInfo_viewUserInfo_editUsrPwd.service,
				method:$sl.guserManager_systemUserInfo_viewUserInfo_editUsrPwd.method,
				params:o,
				success:function(response){
					var data = util.parseJson(response.responseText);
					if(data.success){
						me.mod.main.alert({
							text:data.msg,
							level:'info',
							delay:2000
						});
						util.setCookie('GSOFTTK','');
						util.setCookie('GSOFTUN','');
						form.reset();
						me.mod.main.popMgr.close('editUserInfoPwd_id');
					}
				}
			});
		}
	}
});