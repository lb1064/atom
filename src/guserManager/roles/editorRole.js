new (function(){
	var me = this;
	var refreshFn;//刷新方法
	this.mod = new Gframe.module.RemoteModule({
	})
	
	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'editorRoleView',
			xtype:'form',
			mode:'pop',
			width:540,
			height:300,
			fields:[
//				{
//				    height:25,
//				    align:'left',
//					cols:[
//					   	{xtype:'label',textCls:'title_font',textAlign:'left',value:'编辑角色',width:70}
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
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'角色名：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'groupName',itemId:'roleName',leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
					]
				}
				,
				{
				    height:100,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'备注：',width:120},
						{xtype:'blank',width:5},
						{xtype:'textarea',name:'remark',itemId:'remark',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:20,
				    align:'left',
					cols:[
						{xtype:'blank',width:'max'}
					]
				},
				{
				    height:30,
				    align:'center',
					cols:[
					    {xtype:'button',value:'确  定',width:100,handler:me.submit },
					    {xtype:'blank',width:10},
						{xtype:'button',value:'取  消',width:100,handler:function(){
								var form = me.mod.main.get('editorRoleView');
								form.reset();
								me.mod.main.popMgr.close('editorRoleView');
							}
						}
					]
				}
			],
			hiddens:[
				{name:'groupUuid',itemId:'uuid'}
			],
			initMethod:function(mod){
				//回填数据
				var form = me.mod.main.get('editorRoleView');
				refreshFn = params.refreshFn;
				var roleData = params.roleData;
				form.getByItemId('roleName').setValue(roleData.name);
				form.getByItemId('remark').setValue(roleData.remark);
				form.getByItemId('uuid').setValue(roleData.uuid);
			}
		});
	}
	
	//提交表单
	this.submit = function(){
		var form = me.mod.main.get('editorRoleView');
		var data = form.serializeForm();
		form.submit({
			service:$sl.guserManager_roles_editorRole_modifyRole.service,
			method:$sl.guserManager_roles_editorRole_modifyRole.method,
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
					me.mod.main.popMgr.close('editorRoleView');
					refreshFn();
				}
			}
		})
	}
})