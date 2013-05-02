new (function(){
	var me = this;
	var userTree,groupTree,deptTree;
	var refreshFn;//刷新方法
	var authData=[{value:0,text:'本地认证'}];//认证方式的集合
	var reloadExpendView;
	var mainView;
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
							var f=me.mod.main.get(editRolesFormId);
							var tplus=f.getByItemId('gsoftUsers');
							tplus.addRecord(store);
							tplus.update()
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
						var f=me.mod.main.get(editRolesFormId);
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
						var f=me.mod.main.get(editRolesFormId);
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
	
	var trackPath,rowData,editRolesFormId;
	var gsoftGroups,gsoftDeps,gsoftUsers,getData;
	this.mod.defaultView = function(params){
		reloadExpendView = params.reloadExpendView;
		mainView = params.mainView;
		rowData = params.rowData || {};
//		editRolesFormId = 'editRolesForm'+rowData.uuid;
		me.mod.main.open({
			id:'editRolesForm'+rowData.uuid,
			xtype:'form',
			mode:'loop',
			acts:{
				track:[
					{name:'保存',value:'保存',handler:me.saveInfo},
					{name:'取消',value:'取消',handler:function(){
						var form = me.mod.main.get(editRolesFormId);
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
						{xtype:'text',width:5,leftHidden:true,name:'name',itemId:'roleName',width:'max'},
						{xtype:'blank',width:20}
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
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'角色类型：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',width:5,textAlign:'left',itemId:'roleType',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'角色来源：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',width:5,textAlign:'left',itemId:'roleFrom',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'创建时间：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',width:5,textAlign:'left',itemId:'time_id',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'创建人：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',width:5,textAlign:'left',itemId:'man_id',width:'max'},
						{xtype:'blank',width:20}
					]
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
										var form = me.mod.main.get(editRolesFormId);
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
										var form = me.mod.main.get(editRolesFormId);
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
										var form = me.mod.main.get(editRolesFormId);
										var textCol = form.getByItemId('textCol3');
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
				}
//				{
//				    height:30,
//				    align:'center',
//					cols:[
//					    {xtype:'button',value:'确  定',itemId:'submitBtn',width:100,handler:me.submit },
//					    {xtype:'blank',width:10},
//						{xtype:'button',value:'取  消',width:100,handler:function(){
//								var form = me.mod.main.get(editRolesFormId);
//								form.reset();
//								me.mod.main.popMgr.close(editRolesFormId);
//								if(params.isPresonCreateUser){
//									form.getByItemId('personName').setEnabled(true);
//								}else{
//									form.getByItemId('personName').setEnabled(params.isBindPerson);
//								}
//								me.mod.main.closeExpandView('changeRoleViewEditPreson');
//							}
//						}
//					]
//				}
			],
			hiddens:[
				//{name:'userUuid',itemId:'userUuid'}
			],
			initMethod:function(mod){
				rowData = params.rowData || {};
				editRolesFormId = 'editRolesForm'+rowData.uuid;
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
					{name:'编辑'+rowData.name}
				];
				me.mod.main.reloadTrack(trackPath);
				var form = me.mod.main.get(editRolesFormId);
				refreshFn = params.refreshFn;
				mc.send({
					service:$sl.guserManager_allUsers_getRolesInfomationByuuid.service,
					method:$sl.guserManager_allUsers_getRolesInfomationByuuid.method,
					params:{
						uuid:rowData.uuid
					},
					success : function(response){
						var data = util.parseJson(response.responseText);
						if(data){
							getData = data;
							gsoftGroups = data.gsoftGroups.slice(0);
							gsoftDeps = data.gsoftDeps.slice(0);
							gsoftUsers = data.gsoftUsers.slice(0);
							form.getByItemId('roleName').setValue(data.name);
							form.getByItemId('remark').setValue(data.remark);
							if(data.sys){
								form.getByItemId('roleName').setEnabled(false);
								form.getByItemId('roleType').setValue('系统角色');
							}else{
								form.getByItemId('roleName').setEnabled(true);
								form.getByItemId('roleType').setValue('自定义角色');
							}
							form.getByItemId('roleFrom').setValue(data.appId);//角色来源
							form.getByItemId('time_id').setValue(data.createdTime);//创建时间
							form.getByItemId('man_id').setValue(data.createdBy);//创建人
							form.getByItemId('gsoftGroups').setValue(data.gsoftGroups);
							form.getByItemId('gsoftDeps').setValue(data.gsoftDeps);
							form.getByItemId('gsoftUsers').setValue(data.gsoftUsers);
							var myreg = /^([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
//							if(value != ''&&myreg.test(data.email)){
//								form.getByItemId('submitBtn').setEnabled(true);
//							}else{
//								form.getByItemId('submitBtn').setEnabled(false);
//							}
//							var tt = form.getByItemId('uuids');
//							data.ownRoleNames.each(function(i,n){
//								tt.addRecord(n);
//							});
//							tt.update();
							
						}
					}
				})
				//form.getByItemId('personName').setEnabled(!params.isBindPerson);
			}
		});
	}
	
	
	//提交表单
	this.saveInfo = function(){
		var form = me.mod.main.get(editRolesFormId);
		var data = form.serializeForm();
		if(!data.oldGsoftGroups){
			if(gsoftGroups.length){
				data.oldGsoftGroups = util.json2str(gsoftGroups);
			}else{
				data.oldGsoftGroups = '[]';
			}
		}
		if(!data.oldGsoftDeps){
			if(gsoftDeps.length){
				data.oldGsoftDeps = util.json2str(gsoftDeps);
			}else{
				data.oldGsoftDeps = '[]';
			}
		}
		if(!data.oldGsoftUsers){
			if(gsoftUsers.length){
				data.oldGsoftUsers = util.json2str(gsoftUsers);
			}else{
				data.oldGsoftUsers = '[]';
			}
		}
		data.uuid = rowData.uuid;
		if(!data.name){
			data.name = rowData.name;
		}
		if(!data.orderNum){
			data.orderNum = parseInt(getData.orderNum);
		}
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
					me.mod.main.closeExpandView('selectUsers');
					me.mod.main.closeExpandView('selectGroupsTree');
					me.mod.main.closeExpandView('selectDeptsTree');
					if(refreshFn){
						refreshFn();
					}
					me.mod.main.goback();
				}
			}
		})
	}

})