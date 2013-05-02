new (function(){
	var me = this;
	var roleTree;
	var refreshFn;//刷新方法
	var reloadExpendView;
	//var clickChange = false;//判断是否切换了扩展面板
	this.mod = new Gframe.module.RemoteModule({
		tabTitle:'新增分组',
		expandView : {
			'changeAddRoleView':{
				title : '选择角色',
				active:true,
				create : function(params){
					roleTree = new Treebar({serviceType:true});	
					roleTree.handler = function(node){
						var store={
							uuid:node.options.uuid,
							name:node.options.name 
						}
						var f=me.mod.main.get('addGroupsView');
						var tplus=f.getByItemId('roleUuids');
						tplus.addRecord(store);
						tplus.update()
					};
					return roleTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_allUsers_getSelectRolesTree.service,
						method:$sl.guserManager_allUsers_getSelectRolesTree.method,
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
		reloadExpendView = params.reloadExpendView;
		me.mod.main.open({
			id:'addGroupsView',
			xtype:'form',
			mode:'pop',
			width:540,
			height:355,
			fields:[
//				{
//				    height:25,
//				    align:'left',
//					cols:[
//					   	{xtype:'label',textCls:'title_font',textAlign:'left',value:'新建分组',width:70}
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
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'分组名称：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'groupName',itemId:'groupName',leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
				    itemId:'textCol',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'设置群组角色：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'roles',width:'max',selectOnly:true,itemId:'roleUuids',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('changeAddRoleView');
											//clickChange = true;
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('addGroupsView');
										var textCol = form.getByItemId('textCol');
										textCol.set('height',height+10);
										form.resize();
									}	
								}),defaultField:'name',fields:['uuid','name']},
						{xtype:'blank',width:20}
					]
				}
				,
				{
				    height:33,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'排序：',width:120},
						{xtype:'blank',width:5},
						{xtype:'textarea',name:'remark',itemId:'remark',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:30,
				    align:'left',
					cols:[
						{xtype:'blank',width:125},
						{xtype:'label',textAlign:'left',value:'*数字越大排序越靠前',width:'max'},
						{xtype:'blank',width:20}
					]
				},
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
				    height:50,
				    align:'center',
					cols:[
					    {xtype:'button',value:'确  定',width:100,handler:me.submit },
					    {xtype:'blank',width:10},
						{xtype:'button',value:'取  消',width:100,handler:function(){
								var mailform = me.mod.main.get('addGroupsView');
								mailform.reset();
								me.mod.main.popMgr.close('addGroupsView');
								me.mod.main.closeExpandView('changeAddRoleView');
							}
						}
					]
				}
			],
			hiddens:[
				{name:'parentUuid',itemId:'parentUuid'},
				{name:'groupType',value:'0'}
				
			],
			initMethod:function(mod){
				//回填数据
				var mailform = me.mod.main.get('addGroupsView');
				mailform.getByItemId('parentUuid').setValue(params.parentUuid);
				refreshFn = params.refreshFn;
			}
		});
	}
	
	//提交表单
	this.submit = function(){
		var form = me.mod.main.get('addGroupsView');
		var data = form.serializeForm();
		form.submit({
			service:$sl.guserManager_userGroups_addGroups_addUserGroup.service,
			method:$sl.guserManager_userGroups_addGroups_addUserGroup.method,
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
					me.mod.main.popMgr.close('addGroupsView');
					me.mod.main.closeExpandView('changeAddRoleView');
					//if(!clickChange){
					//reloadExpendView();
					//}
					refreshFn();
				}
			}
		})
	}
})