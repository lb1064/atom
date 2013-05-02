new (function(){
	var me = this;
	var roleTree;
	var refreshFn;//刷新方法
	this.mod = new Gframe.module.RemoteModule({
		tabTitle:'添加用户群组',
		expandView : {
			'changeAddPersonOrGroupsView':{
				title : '选择用户群组',
				active:true,
				create : function(params){
					roleTree = new Treebar({serviceType:true});	
					roleTree.handler = function(node){
						if(node.options.canClick){
							var store={
								uuid:node.options.uuid,
								type:node.options.type,
								name:node.options.name
							}
							var f=me.mod.main.get('addUsersView');
							var tplus=f.getByItemId('roleUuids');
							tplus.addRecord(store);
							tplus.update()
						}
					};
					return roleTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_roles_addRole_getUserGroupTree.service,
						method:$sl.guserManager_roles_addRole_getUserGroupTree.method,
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
			id:'addUsersView',
			xtype:'form',
			mode:'pop',
			width:540,
//			height:200,
			height:175,
			fields:[
//				{
//				    height:25,
//				    align:'left',
//					cols:[
//					   	{xtype:'label',textCls:'title_font',textAlign:'left',value:'添加用户群组',width:130}
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
				    itemId:'textCol',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加用户(组)：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'uuids',width:'max',selectOnly:true,itemId:'roleUuids',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('changeAddPersonOrGroupsView');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('addUsersView');
										var textCol = form.getByItemId('textCol');
										textCol.set('height',height+10);
										form.resize();
									}	
								}),defaultField:'name',fields:['uuid','type']},
						{xtype:'blank',width:20}
					]
				}
				,
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
								var mailform = me.mod.main.get('addUsersView');
								mailform.reset();
								me.mod.main.popMgr.close('addUsersView');
								me.mod.main.closeExpandView('changeAddPersonOrGroupsView');
							}
						}
					]
				}
			],
			hiddens:[
				{name:'groupUuid',itemId:'parentUuid'}
				
			],
			initMethod:function(mod){
				//回填数据
				var mailform = me.mod.main.get('addUsersView');
				mailform.getByItemId('parentUuid').setValue(params.uuid);
				refreshFn = params.refreshFn;
			}
		});
	}
	
	//提交表单
	this.submit = function(){
		var form = me.mod.main.get('addUsersView');
		var data = form.serializeForm();
		form.submit({
			service:$sl.guserManager_roles_roleRoleGroups_grantRoleToUserOrGroup.service,
			method:$sl.guserManager_roles_roleRoleGroups_grantRoleToUserOrGroup.method,
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
					me.mod.main.popMgr.close('addUsersView');
					me.mod.main.closeExpandView('changeAddPersonOrGroupsView');
					isOpenTree = false;
					refreshFn();
				}
			}
		})
	}
	
})