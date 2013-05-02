new (function(){
	var me = this;
	var updatePwdPop;
	var updatePwdForm;
	
	var target = Atom.getComp(mc.viewer);
	this.init = function(config){
		var content = {
			title:'修改密码',
//			layout:'block',//round圆角,block方角
			popBtn:[
				{xtype:'button',value:'确认',width:100,handler:function(){
						var o = updatePwdForm.serializeForm();
						
						var flag = updatePwdForm.validate();
						if(flag == true){
							//验证新密码和确认新密码输入是否一致
							var newPwd = updatePwdForm.getByItemId('newPwd').getValue();
							var conNewPwd = updatePwdForm.getByItemId('confirmNewPwd').getValue();
							if(newPwd != conNewPwd){
								var messageinfo = new Gframe.controls.NewMessage({parent:mc.viewer,
										infoLevel:'error',colseNum:5000,infoText:'两次输入密码不一致，请重新输入！'},{anim:'middle'});
								messageinfo.show();
							}else{
								var store = {
									service:$sl.guserManager_sysUserInfoManage_updatePwd.service,
									method:$sl.guserManager_sysUserInfoManage_updatePwd.method,
									params:{
										loginName:mc.username,
										oldPwd:o.oldPwd,
										newPwd:o.newPwd
									},
									success:function(data,mod){
										var d = util.parseJson(data.responseText);
										updatePwdForm.reset();
										updatePwdPop.close();
										if(Atom.isFunction(target.closeShade)){
											target.closeShade();
										}
										var messageinfo = new Gframe.controls.NewMessage({parent:mc.viewer,
												infoLevel:'info',colseNum:5000,infoText:d.msg},{anim:'middle'});
										messageinfo.show();
									}
								}
								mc.send(store);
							}
							
						}else{
							var messageinfo = new Gframe.controls.NewMessage({parent:mc.viewer,
									infoLevel:'error',colseNum:5000,infoText:flag},{anim:'middle'});
							messageinfo.show();
						}
						
					}
				},
				{xtype:'button',value:'取消',width:100,handler:function(){
						if(Atom.isFunction(target.closeShade)){
							target.closeShade();
						}
						updatePwdForm.reset();
						updatePwdPop.close();
					}
				}
			],
			withClose:function(){
				if(Atom.isFunction(target.closeShade)){
					target.closeShade();
				}
			},
			anim:'middle',
			close:'hidden',
			target:target
		};
		
		var options = {
			id:'guserManager_updatePwd',
			width: 440,
			height: 200
		};
		
		var formFields = [{
					height:5,
					cols:[
						{xtype:'blank'}
					]
				},{
					cols:[
						{xtype:'label',value:'原密码：',textAlign:'right',width:90},
						{xtype:'blank',width:10},
						{xtype:'password',name:'oldPwd',itemId:'oldPwd',leftHidden:true,width:'max',vtype:'vblank',errorMsg:'请输入原密码！'},
						{xtype:'blank',width:40}
					]
				},{
					cols:[
						{xtype:'label',value:'新密码：',textAlign:'right',width:90},
						{xtype:'blank',width:10},
						{xtype:'password',name:'newPwd',itemId:'newPwd',leftHidden:true,textAlign:'left',width:'max',vtype:'vblank',errorMsg:'请输入新密码！'},
						{xtype:'blank',width:40}
					]
				},{
					cols:[
						{xtype:'label',value:'确认新密码：',textAlign:'right',width:90},
						{xtype:'blank',width:10},
						{xtype:'password',name:'confirmNewPwd',itemId:'confirmNewPwd',leftHidden:true,width:'max',vtype:'vblank',errorMsg:'请输入确认新密码！'},
						{xtype:'blank',width:40}
					]
				}];
		
		var formHiddens = [];
		
		updatePwdForm = Atom.create('Atom.panel.form.FormPanelAdapt',{
			fields:formFields,
			hiddens:formHiddens
		});
		
		updatePwdPop = new Gframe.controls.NewPopup(content,options);
		updatePwdPop.addItem(updatePwdForm);
		
		return updatePwdPop;
	};	
	
	this.initData = function(){
		if(Atom.isFunction(target.showShade)){
			target.showShade();
		}
		updatePwdPop.show();
	};
	
});