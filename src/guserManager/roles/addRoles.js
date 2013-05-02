new (function(){
	var me = this;
	var userTree,groupTree,deptTree;
	var refreshFn;//刷新方法
	var authData=[{value:0,text:'本地认证'}];//认证方式的集合
	this.mod = new Gframe.module.RemoteModule({
		tabTitle:'新增人员',
		expandView : {
			'selectUsers':{//selectUsers selectGroupsTree selectDeptsTree
				title : '设置关联用户',
				active:true,
				create : function(params){
					userTree = new Treebar({serviceType:true});	
					userTree.handler = function(node){
						if(node.options.user){
							var store={
								uuid:node.options.realId,
								name:node.options.name 
							}
							var f=me.mod.main.get('addRolesForm');
							var tplus=f.getByItemId('gsoftUsers');
							tplus.addRecord(store);
							tplus.update();
						}
					};
					//todo 人员的图标先只做2种区分
                    userTree.renderer = function (tObj) {
                        var iconType = tObj.user;
                        if (iconType) {
                            tObj.img = 'resources/tree/user/person.png';
                        } else {
                            tObj.img = 'resources/tree/user/group.png';
                        }
                        return tObj;
                    };
					return userTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_allUsers_getSelectRelatedUserTree.service,
						method:$sl.guserManager_allUsers_getSelectRelatedUserTree.method,
						params:{
						},
						success:function(response){
							mc.fireEvent(userTree.get('id'),'loadData',{obj:response.responseText});
						}
					});
				}
			},
			'selectGroupsTree':{
				title : '设置关联群组',
				active:true,
				create : function(params){
					groupTree = new Treebar({serviceType:true});	
					groupTree.handler = function(node){
						var store={
							uuid:node.options.uuid,
							name:node.options.name 
						}
						var f=me.mod.main.get('addRolesForm');
						var tplus=f.getByItemId('gsoftGroups');
						tplus.addRecord(store);
						tplus.update()
					};
					//todo 人员的图标先只做2种区分
                    groupTree.renderer = function (tObj) {
                        var iconType = tObj.xtype;
                        if (iconType=='contact') {
                            tObj.img = 'resources/tree/user/person.png';
                        } else {
                            tObj.img = 'resources/tree/user/group.png';
                        }
                        return tObj;
                    };
					return groupTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_allUsers_getSelectUserGroupTree.service,
						method:$sl.guserManager_allUsers_getSelectUserGroupTree.method,
						params:{
						},
						success:function(response){
							mc.fireEvent(groupTree.get('id'),'loadData',{obj:response.responseText});
						}
					});
				}
			},
			'selectDeptsTree':{
				title : '设置关联部门',
				active:true,
				create : function(params){
					deptTree = new Treebar({serviceType:true});	
					deptTree.handler = function(node){
						var store={
							uuid:node.options.uuid,
							name:node.options.name 
						}
						var f=me.mod.main.get('addRolesForm');
						var tplus=f.getByItemId('gsoftDeps');
						tplus.addRecord(store);
						tplus.update()
					};
					return deptTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_allUsers_getSelectDeptsTree.service,
						method:$sl.guserManager_allUsers_getSelectDeptsTree.method,
						params:{
						},
						success:function(response){
							mc.fireEvent(deptTree.get('id'),'loadData',{obj:response.responseText});
						}
					});
				}
			}
		}
	})
	
	var trackPath,rowData;
	var gsoftGroups,gsoftDeps,gsoftUsers;
	var reloadExpendView,mainView;
	this.mod.defaultView = function(params){
		reloadExpendView = params.reloadExpendView;
		mainView = params.mainView;
		me.mod.main.open({
			id:'addRolesForm',
			xtype:'form',
			mode:'loop',
			acts:{
				track:[
					{name:'保存',value:'保存',handler:me.saveInfo},
					{name:'取消',value:'取消',handler:function(){
						var form = me.mod.main.get('addRolesForm');
						form.reset();
						me.mod.main.goback();
						me.mod.main.closeExpandView('selectUsers');
						me.mod.main.closeExpandView('selectGroupsTree');
						me.mod.main.closeExpandView('selectDeptsTree');
					}}
				]
			},
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
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'角色名称：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',width:5,textAlign:'left',name:'name',leftHidden:true,itemId:'roleName',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'排序：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'orderNum',leftHidden:true,width:5,textAlign:'left',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:20,
				    align:'left',
					cols:[
					 	{xtype:'blank',width:125},
					    {xtype:'label',textAlign:'left',value:'*数字越大排序越靠前',width:'max'}
					]
				},
				{
				    height:80,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'备注：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textarea',name:'remark',itemId:'remark',leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
					height:8,
					cols:[]
				},
				{
				    height:36,
				    align:'left',
				    itemId:'textCol1',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加关联用户：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'gsoftUsers',width:300,selectOnly:true,itemId:'gsoftUsers',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('selectUsers');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('addRolesForm');
										var textCol = form.getByItemId('textCol1');
										textCol.set('height',height+10);
										form.resize();
									}	
								}),defaultField:'name',fields:['uuid','name'],width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
				    itemId:'textCol2',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加关联群组：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'gsoftGroups',width:300,selectOnly:true,itemId:'gsoftGroups',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('selectGroupsTree');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('addRolesForm');
										var textCol = form.getByItemId('textCol2');
										textCol.set('height',height+10);
										form.resize();
									}	
								}),defaultField:'name',fields:['uuid','name'],width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
				    itemId:'textCol3',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加关联部门：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'gsoftDeps',width:300,selectOnly:true,itemId:'gsoftDeps',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('selectDeptsTree');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('addRolesForm');
										var textCol = form.getByItemId('textCol3');
										textCol.set('height',height+10);
										form.resize();
									}	
								}),defaultField:'name',fields:['uuid','name'],width:'max'},
						{xtype:'blank',width:20}
					]
				}
			],
			hiddens:[
				//{name:'userUuid',itemId:'userUuid'}
			],
			initMethod:function(mod){
				//回填数据
				trackPath = [
					{name:'用户管理'},
					{name:'角色',handler:function(){
						me.mod.main.remoteOpen({
							url:'modules/guserManager/roles/roleList.js',
							params:{
								reloadExpendView:reloadExpendView,
								mainView:mainView
							}
						});
					}},
					{name:'新增角色'}
				];
				me.mod.main.reloadTrack(trackPath);
				refreshFn = params.refreshFn;
				//form.getByItemId('personName').setEnabled(!params.isBindPerson);
			}
		});
	}
	
	
	//提交表单
	this.saveInfo = function(){
		var form = me.mod.main.get('addRolesForm');
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
					me.mod.main.closeExpandView('selectUsers');
					me.mod.main.closeExpandView('selectGroupsTree');
					me.mod.main.closeExpandView('selectDeptsTree');
					refreshFn();
					me.mod.main.goback();
				}
			}
		})
	}

})