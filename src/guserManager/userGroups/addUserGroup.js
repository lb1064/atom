new (function(){
	var me = this;
	var roleTree;
	var refreshFn;//刷新方法
	var reloadExpendView;
	var clickChange = false;//判断是否切换了扩展面板
	var trackPath;
	var oldGsoftRoles,oldGsoftUsers;
	var parentUuid;
	this.mod = new Gframe.module.RemoteModule({
		tabTitle:'新增分组',
		expandView : {
			'changeEditorRoleView':{
				title : '选择角色',
				active:true,
				create : function(params){
					roleTree = new Treebar({serviceType:true});	
					roleTree.handler = function(node){
						var store={
							uuid:node.options.realId,
							name:node.options.name 
						}
						var f=me.mod.main.get('addGroupsView');
						var tplus=f.getByItemId('gsoftRoles');
						tplus.addRecord(store);
						tplus.update();
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
			},
			'selectUserGroupTree':{
				title : '选择用户组',
				active:true,
				create : function(params){
					userGroupTree = new Treebar({serviceType:true});	
					userGroupTree.handler = function(node){
						var store={
							uuid:node.options.realId,
							name:node.options.name 
						}
						var f=me.mod.main.get('addGroupsView');
						var tplus=f.getByItemId('gsoftUsers');
						tplus.addRecord(store);
						tplus.update()
					};
					//todo 人员的图标先只做2种区分
                    userGroupTree.renderer = function (tObj) {
                        var iconType = tObj.user;
                        if (iconType) {
                            tObj.img = 'resources/tree/user/person.png';
                        } else {
                            tObj.img = 'resources/tree/user/group.png';
                        }
                        return tObj;
                    };
					return userGroupTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_allUsers_getSelectRelatedUserTree.service,
						method:$sl.guserManager_allUsers_getSelectRelatedUserTree.method,
						params:{
						},
						success:function(response){
							mc.fireEvent(userGroupTree.get('id'),'loadData',{obj:response.responseText});
						}
					});
				}
			}
		}
	})
	
	var rowData;
	this.mod.defaultView = function(params){
		rowData = params.rowData || null;
		trackPath = params.trackPath || null;
		parentUuid = params.parentUuid || '';
		me.mod.main.open({
			id:'addGroupsView',
			xtype:'form',
			mode:'loop',
			acts:{
				track:[
					{name:'保存',value:'保存',handler:me.saveInfo},
					{name:'取消',value:'取消',handler:function(){
						var form = me.mod.main.get('addGroupsView');
						form.reset();
						me.mod.main.closeExpandView('changeEditorRoleView');
						me.mod.main.closeExpandView('selectUserGroupTree');
						me.mod.main.goback();
					}}
				]
			},
			fields:[
//				{
//				    height:25,
//				    align:'left',
//					cols:[
//					   	{xtype:'label',textCls:'title_font',textAlign:'left',value:'编辑分组',width:70}
//					]
//				},
//				'-',
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'群组名称：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'name',itemId:'groupName',leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'排序：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'orderNum',itemId:'orderNum',leftHidden:true,width:'max'},
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
				    height:30,
				    align:'left',
				    itemId:'textCol_id',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加子用户：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'gsoftUsers',width:'max',selectOnly:true,itemId:'gsoftUsers',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('selectUserGroupTree');
											clickChange = true;
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('addGroupsView');
										var textCol = form.getByItemId('textCol_id');
										textCol.set('height',height+10);
										form.resize();
									}	
								}),defaultField:'name',fields:['uuid','name']},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:30,
				    align:'left',
				    itemId:'textCol',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加关联角色：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'gsoftRoles',width:'max',selectOnly:true,itemId:'gsoftRoles',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('changeEditorRoleView');
											clickChange = true;
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
//				{
//				    height:30,
//				    align:'left',
//					cols:[
//						{xtype:'blank',width:125},
//						{xtype:'label',textAlign:'left',color:'#C0C0C0',value:'*修改父群组角色会影响子群组角色',width:300},
//						{xtype:'blank',width:20}
//					]
//				},
//				{
//				    height:50,
//				    align:'center',
//					cols:[
//					    {xtype:'button',value:'确  定',width:100,handler:me.submit },
//					    {xtype:'blank',width:10},
//						{xtype:'button',value:'取  消',width:100,handler:function(){
//								var mailform = me.mod.main.get('addGroupsView');
//								mailform.reset();
//								me.mod.main.popMgr.close('addGroupsView');
//								me.mod.main.closeExpandView('changeEditorRoleView');
//							}
//						}
//					]
//				}
			],
			hiddens:[
				//{name:'groupUuid',itemId:'groupUuid'}
				
			],
			initMethod:function(mod){
				//回填数据
				if(params.trackPath.length){
					params.trackPath.push({
						name:'新增群组'
					});
				}
				//console.log('/////trackPath::',trackPath);
				me.mod.main.reloadTrack(trackPath);
				refreshFn = params.refreshFn;
			}
		});
	}
	
	//提交表单
	this.saveInfo = function(){
		var form = me.mod.main.get('addGroupsView');
		var data = form.serializeForm();		
		if(!data.parentUuid){
			data.parentUuid = parentUuid;
		}
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
					me.mod.main.closeExpandView('changeEditorRoleView');
					me.mod.main.closeExpandView('selectUserGroupTree');
					me.mod.main.goback();
//					if(!clickChange){
//						reloadExpendView();
//					}
					refreshFn();
				}
			}
		})
	}
})