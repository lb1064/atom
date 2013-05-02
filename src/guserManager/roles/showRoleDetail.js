/**
 * @author tianjun
 * 角色查看详情
 */
new (function(){

	var me = this;
	
	var personTree,roleTree;
	this.mod = new Gframe.module.RemoteModule({
			expandView:{
				'rolesTree':{
					title:'请选择群组',
					create:function(params){
						personTree = new Treebar({});	
						personTree.handler = function(node){
									var record = {
										name:node.options.name,
										uuid:node.options.uuid
									};
									var form = me.mod.main.get('showUsersRole_id');
									var textplus = form.getByItemId('roleRelatived_id');
									textplus.addRecord(record);
									textplus.update();
						};
						return personTree;
					},
					initMethod:function(params){
						mc.send({
							service:$sl.guserManager_userGroups_addGroups_getRoleTree.service,
							method:$sl.guserManager_userGroups_addGroups_getRoleTree.method,
							params:{
							},
							success:function(response){
								mc.fireEvent(personTree.get('id'),'loadData',{obj:response.responseText});
							}
						});
					}
				},
				'showPersonTree':{
					title:'请选择用户',
					create:function(params){
						roleTree = new Treebar({});	
						roleTree.handler = function(node){
									var record = {
										name:node.options.name,
										uuid:node.options.uuid
									};
									var form = me.mod.main.get('showUsersRole_id');
									var textplus = form.getByItemId('relativeUser_id');
									textplus.addRecord(record);
									textplus.update();
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
	});
	
	var rowData;
	this.mod.defaultView = function(params){
		rowData = params.rowData || null;
		var roleName = rowData.name || '';
		me.mod.main.open({
			id:'showUsersRole_id',
			xtype:'form',
			mode:'loop',
			track:[
				{name:'用户管理'},
				{name:roleName}
			],
			acts:{
				track:[
					{name:'保存',value:'保存',handler:me.saveInfo},
					{name:'取消',value:'取消',handler:me.cancelBack}
				]			
			},
			fields:[
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'角色名称：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',itemId:'roleName_id',textAlign:'left',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'备注：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',itemId:'remark_id',textAlign:'left',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'角色类型：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',itemId:'roleType_id',textAlign:'left',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'角色来源：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',itemId:'roleFrom_id',textAlign:'left',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'创建时间：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',itemId:'createdTime_id',textAlign:'left',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加关联群组：',width:120},
					    {xtype:'blank',width:5},
						{xtype : 'textplus',width : 'max',itemId:'roleRelatived_id',listeners : ({
												'click' : function() {
													me.mod.main.showExpandView('rolesTree');
												}
											}),
						defaultField : 'name',
						fields : ['uuid','name']
						},
						{xtype:'blank',width:100}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加关联用户：',width:120},
					    {xtype:'blank',width:5},
						{xtype : 'textplus',width : 'max',itemId:'relativeUser_id',listeners : ({
												'click' : function() {
													me.mod.main.showExpandView('showPersonTree');
												}
											}),
						defaultField : 'name',
						fields : ['uuid','name']
						},
						{xtype:'blank',width:100}
					]
				}
			]
		
		});
	
	}
	
	this.saveInfo = function(){
		
	}
	
	this.cancelBack = function(){
		var form = me.mod.main.get('showUsersRole_id');
		me.mod.main.closeExpandView('showPersonTree');
		me.mod.main.closeExpandView('rolesTree');
		me.mod.main.popMgr.close('showUsersRole_id');
		me.mod.main.goback();
	}

});
