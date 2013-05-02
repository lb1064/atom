new (function(){
	var me = this;
	var refreshFn;//刷新方法
	this.mod = new Gframe.module.RemoteModule({
	})
	
	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'addRoleView',
			xtype:'form',
			mode:'pop',
			width:540,
			height:300,
			fields:[
//				{
//				    height:25,
//				    align:'left',
//					cols:[
//					   	{xtype:'label',textCls:'title_font',textAlign:'left',value:'新建角色',width:70}
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
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'角色名称：',width:120},
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
								var mailform = me.mod.main.get('addRoleView');
								mailform.reset();
								me.mod.main.popMgr.close('addRoleView');
							}
						}
					]
				}
			],
			hiddens:[
			],
			initMethod:function(mod){
				//回填数据
				var mailform = me.mod.main.get('addRoleView');
				refreshFn = params.refreshFn;
			}
		});
	}
	
	//提交表单
	this.submit = function(){
		var form = me.mod.main.get('addRoleView');
		var data = form.serializeForm();
		form.submit({
			service:$sl.guserManager_roles_addRole_addRole.service,
			method:$sl.guserManager_roles_addRole_addRole.method,
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
					me.mod.main.popMgr.close('addRoleView');
					refreshFn();
				}
			}
		})
	}
})