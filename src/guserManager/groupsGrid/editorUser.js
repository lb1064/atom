new (function(){
	var me = this;
	var roleTree;
	var refreshFn;//刷新方法
	var authData=[{value:0,text:'本地认证'}];//认证方式的集合
	this.mod = new Gframe.module.RemoteModule({
		tabTitle:'新增人员',
		expandView : {
			'changeRoleViewEditPreson':{
				title : '选择角色',
				active:true,
				create : function(params){
					roleTree = new Treebar({serviceType:true});	
					roleTree.handler = function(node){
						var store={
							uuid:node.options.uuid,
							name:node.options.name 
						}
						var f=me.mod.main.get('editorUserView');
						var tplus=f.getByItemId('uuids');
						tplus.addRecord(store);
						tplus.update()
					};
					return roleTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_userGroups_addGroups_getRoleTree.service,
						method:$sl.guserManager_userGroups_addGroups_getRoleTree.method,
						params:{
						},
						success:function(response){
							mc.fireEvent(roleTree.get('id'),'loadData',{obj:response.responseText});
						}
					});
				}
			}
		}
	})
	
	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'editorUserView',
			xtype:'form',
			mode:'pop',
			width:540,
			height:325,
			fields:[
//				{
//				    height:25,
//				    align:'left',
//					cols:[
//					   	{xtype:'label',textCls:'title_font',textAlign:'left',value:'编辑用户',width:70}
//					]
//				},
//				'-',
				{
				    height:10,
				    align:'left',
					cols:[
					   	{xtype:'blank'}
					]
				}
				,
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'登录名：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',width:5,textAlign:'left',itemId:'userName',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'姓名：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'personName',itemId:'personName',leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'手机：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'phone',itemId:'phone',leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'邮箱：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'email',itemId:'email',onTextChange:function(e,o){
								var value = o.getValue();
								var form = me.mod.main.get('editorUserView');
								var createBtn = form.getByItemId('submitBtn');
								var myreg = /^([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
								if(value != ''&&myreg.test(value)){
									createBtn.setEnabled(true);
								}else{
									createBtn.setEnabled(false);
								}
							},leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'认证方式：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'combo',data:authData,displayField:'text',displayValue:'value',name:'authUuid',width:150,itemId:'authUuid',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:50,
				    align:'left',
				    itemId:'textCol',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'设置个人角色：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'roles',width:300,selectOnly:true,itemId:'uuids',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('changeRoleViewEditPreson');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('editorUserView');
										var textCol = form.getByItemId('textCol');
										textCol.set('height',height+10);
										form.resize();
									}	
								}),defaultField:'name',fields:['uuid','name'],width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:5,
				    align:'left',
					cols:[
						{xtype:'blank',width:'max'}
					]
				},
				{
				    height:30,
				    align:'center',
					cols:[
					    {xtype:'button',value:'确  定',itemId:'submitBtn',width:100,handler:me.submit },
					    {xtype:'blank',width:10},
						{xtype:'button',value:'取  消',width:100,handler:function(){
								var form = me.mod.main.get('editorUserView');
								form.reset();
								me.mod.main.popMgr.close('editorUserView');
								if(params.isPresonCreateUser){
									form.getByItemId('personName').setEnabled(true);
								}else{
									form.getByItemId('personName').setEnabled(params.isBindPerson);
								}
								me.mod.main.closeExpandView('changeRoleViewEditPreson');
							}
						}
					]
				}
			],
			hiddens:[
				{name:'userUuid',itemId:'userUuid'}
			],
			initMethod:function(mod){
				//回填数据
				var form = me.mod.main.get('editorUserView');
				refreshFn = params.refreshFn;
				mc.send({
					service:$sl.guserManager_userGroups_editorUser_getUserInfo.service,
					method:$sl.guserManager_userGroups_editorUser_getUserInfo.method,
					params:{
						userUuid:params.uuid
					},
					success : function(response){
						var data = util.parseJson(response.responseText);
						if(data){
							form.getByItemId('userUuid').setValue(params.uuid);
							form.getByItemId('userName').setValue(data.userName);
							form.getByItemId('personName').setValue(data.personName);
							form.getByItemId('phone').setValue(data.phone);
							form.getByItemId('email').setValue(data.email);
							var myreg = /^([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
							if(value != ''&&myreg.test(data.email)){
								form.getByItemId('submitBtn').setEnabled(true);
							}else{
								form.getByItemId('submitBtn').setEnabled(false);
							}
							var tt = form.getByItemId('uuids');
							data.ownRoleNames.each(function(i,n){
								tt.addRecord(n);
							});
							tt.update();
							
						}
					}
				})
				form.getByItemId('personName').setEnabled(!params.isBindPerson);
			}
		});
	}
	
	//提交表单
	this.submit = function(){
		var form = me.mod.main.get('editorUserView');
		var data = form.serializeForm();
		form.submit({
			service:$sl.guserManager_userGroups_editorUser_modifyUser.service,
			method:$sl.guserManager_userGroups_editorUser_modifyUser.method,
			params:data,
			success : function(response){
				var d = util.parseJson(response.responseText);
				if (d.success) {
					me.mod.main.alert({
								text : d.msg,
								level : 'info',
								delay : 3000
							});
					form.reset();
					me.mod.main.popMgr.close('editorUserView');
					me.mod.main.closeExpandView('changeRoleViewEditPreson');
					refreshFn();
				}
			}
		})
	}

})