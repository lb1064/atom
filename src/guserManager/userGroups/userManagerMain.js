new (function(){
	var me = this;
	var groupsTree;
	//var reloadExpendView;
	this.mod= new Gframe.module.Module({
		key : 'groupOrUser',
		colnums : [
			{header:'名称',width:200,mapping:'name'},
			{header:'类型',width:'max',mapping:'type',
				renderer:function(v, record, o){
					switch(v){
						case '0':
							return '用户';
							break;
						case '1':
							return '群组';
							break;
						case '2':
							return '部门';
							break;
						default:
							return '角色';
							break;
					}
				}
			}
		],
		navigation:{
			title : '用户管理',
			autoOpen:true,
			active:true,
			create : function(params){
				groupsTree = new Treebar({serviceType:true});	
				groupsTree.handler = function(node){
					switch(node.options.nodeType){
						case '0':
							me.openUserGroup(node.options);
							break;
						case '1':
							me.openUserGroup(node.options);
							break;
						case '2':
							me.openDeptGroupsView(node.options.uuid);
							break;
						case '3':
							me.openDeptGroupsView(node.options.uuid);
							break;
						case '4':
							me.openRoleView();
							break;
						case '5':
							me.openRoleGroups(node.options.uuid,node.options.name);
							break;
						case '6'://全部用户
							me.mod.defaultView();
							break;
						default:
							break;
							
					}
				};
				return groupsTree;
			},
			initMethod:function(params){
				mc.send({
					service:$sl.guserManager_userGroups_userManagerMain_getAllTree.service,
					method:$sl.guserManager_userGroups_userManagerMain_getAllTree.method,
					params:{},
					success:function(response){
						mc.fireEvent(groupsTree.get('id'),'loadData',{obj:response.responseText});
					}
				});
			}
		}
	})
	//创建用户组列表
	this.mod.defaultView=function(params){
		me.mod.remoteOpen({
			url:'modules/guserManager/allUsers/allUserGrid.js',
			params:{
				reloadExpendView:me.reloadExpendView
			}
		});
	}
	this.setCur = function(v,record,o){
		if(o.type != '0'){
			record.setCursor('pointer');
		}
		return v;
	}	
	//类型转译
	this.formatType = function(v, record, o){
		if(o.type == '1'){
			return '群组'
		}else{
			return '部门'
		}
	}
	
	//新增分组
	this.createGroups = function(){
		me.mod.remoteOpen({
			url:'modules/guserManager/userGroups/addGroups.js',
			params:{
				refreshFn:me.reloadDangqianGridFunc,
				reloadExpendView:me.reloadExpendView,
				parentUuid:''
			}
		})
	}
	
	//打开
	this.openUserGroup = function(obj){
		var uuid = obj.uuid || '';
		var name = obj.name || '';
//		if(!o.uuid){
//			uuid = o.get('data').uuid
//			name = o.get('data').name
//		}else{
//			uuid = o.uuid;
//			name = o.name;
//			if(o.type == '0'){
//				return ;
//			}
//		}
		me.mod.remoteOpen({
			url:'modules/guserManager/groupsGrid/openGroupsGrid.js',
			params:{
				uuid:uuid,
				//parentUuid:uuid,
				name:name,
				reloadExpendView:me.reloadExpendView
				//fn:me.mod.defaultView
			}
		})
	}
	
	//编辑
	this.editor = function(e,o){
		me.mod.remoteOpen({
			url:'modules/guserManager/userGroups/editorGroups.js',
			params:{
				refreshFn:me.reloadDangqianGridFunc,
				reloadExpendView:me.reloadExpendView,
				uuid:o.get('data').uuid
			}
		})
	}
	
	//查看详情
	this.lookMessage = function(e,o){
		me.mod.remoteOpen({
			url:'modules/guserManager/userGroups/lookMessage.js',
			params:{
				uuid:o.get('data').uuid
			}
		})
	}
	
	//移动到此
	this.moveOn = function(){
		me.mod.confirm({
				text : '是否确定将所选用户组移动到此？',
				handler : function(confirm) {
					if (confirm) {
						var data = me.mod.clipboardMgr.getChecked();
						var uuids = [];
						var removeUuids = [];
						data.each(function(i,n){
							var u = {
								uuid:n.uuid,
								type:n.type,
								parentUuid:n.parentUuid
							};
							uuids.push(u);
							removeUuids.push(n.uuid);
						})
						uuids = util.json2str(uuids);
						mc.send({
							service:$sl.guserManager_userGroups_userManagerMain_moveUserOrUserGroup.service,
							method:$sl.guserManager_userGroups_userManagerMain_moveUserOrUserGroup.method,
							params:{
								targetGroupUuid:'',
								uuids:uuids
							},
							success : function(response){
								var d = util.parseJson(response.responseText);
								if (d.success) {
									me.mod.clipboardMgr.remove(removeUuids);
									me.mod.alert({
												text : d.msg,
												level : 'info',
												delay : 3000
											});
									me.reloadDangqianGridFunc();
								}
							}
						})							
					}
				}
			})
	}
	
	//删除
	this.deleteGroups = function(){
		me.mod.confirm({
				text : '是否确定删除所选用户组？',
				handler : function(confirm) {
					if (confirm) {
						var data = me.mod.clipboardMgr.getChecked();
						var uuids = [];
						var removeUuids = [];
						data.each(function(i,n){
							var u = {
								uuid:n.uuid,
								type:n.type
							};
							uuids.push(u);
							removeUuids.push(n.uuid);
						})
						uuids = util.json2str(uuids);
						mc.send({
							service:$sl.guserManager_userGroups_userManagerMain_delUserOrUserGroup.service,
							method:$sl.guserManager_userGroups_userManagerMain_delUserOrUserGroup.method,
							params:{
								uuids:uuids
							},
							success : function(response){
								var d = util.parseJson(response.responseText);
								if (d.success) {
									me.mod.clipboardMgr.remove(removeUuids);
									me.mod.alert({
												text : d.msg,
												level : 'info',
												delay : 3000
											});
									me.reloadDangqianGridFunc();
								}
							}
						})							
					}
				}
			})
	}
	//刷新面板
	this.reloadDangqianGridFunc = function() {
		var view = me.mod.getCentralView();
		if (view && view.dynamic && view.dynamic.load) {
			view.dynamic.load();
		}
		me.reloadExpendView();
	}
	
	//打开部门分组
	this.openDeptGroupsView = function(uuid){
		me.mod.remoteOpen({
			url:'modules/guserManager/departments/openDeptsGrid.js',
			params:{
				uuid:uuid,
				reloadExpendView:me.reloadExpendView
			}
		})
	}
	//打开角色列表
	this.openRoleView = function(){
		me.mod.remoteOpen({
			url:'modules/guserManager/roles/roleList.js',
			params:{
				reloadExpendView:me.reloadExpendView,
				mainView:me.mod.defaultView
			}
		})
	}
	
	//打开角色下面的群组部门列表
	this.openRoleGroups = function(uuid,name){
		me.mod.remoteOpen({
			url:'modules/guserManager/roles/editorRoles.js',
			params:{
				rowData:{name:name,uuid:uuid},
				reloadExpendView:me.reloadExpendView,
				mainView:me.mod.defaultView
			}
		})
	}
	
	this.openUserGroups = function(){
		me.mod.open({
			key:'groupOrUserList',
			id:'userGroups',
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			usePage:true,
			track:[
					{name:'用户管理',cursor:'false'},
					{name:'用户组',cursor:'false'}
				],
			store:{
				service:$sl.guserManager_userGroups_userManagerMain_getFirstLevelUserGroupList.service,
				method:$sl.guserManager_userGroups_userManagerMain_getFirstLevelUserGroupList.method,
				params:{},
				success:function(response){
				}
			},
			actFilter:function(data,purview){
				if(!data.isNonGroup){
					purview['notGroup']=true;
				}
				return purview;
			},
			acts:{
				track:[
					{value:'新增分组',handler:me.createGroups}
				],
				clip:[
					{value:'移动到此',handler:me.moveOn,exp:'notGroup'},
					{value:'删除',handler:me.deleteGroups,exp:'notGroup'}
				],
				grid:[
					{name:'打开',value:'打开',imgCls:'openfolder_btn',handler:me.open},
					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editor,exp:'notGroup'},
					{name:'查看详情',value:'查看详情',imgCls:'editfile_btn',handler:me.lookMessage,exp:'notGroup'}
				]
			},
			colnums:[
				{header:'名称',mapping:'name',width:'max',textAlign:'left',renderer:me.changeCursor,handler:me.open,renderer:me.setCur},
				{header:'类型',mapping:'type',renderer:me.formatType,textAlign:'left',width:'max'},
				{header:'提示',mapping:'remark',type:'tips'}
			],
			initMethod : function(){
//				me.mod.showExpandView('userGroupsMassageView');
			}
		})
	}
	
	//刷新树方法
	this.reloadExpendView = function(){
		mc.send({
			service:$sl.guserManager_userGroups_userManagerMain_getAllTree.service,
			method:$sl.guserManager_userGroups_userManagerMain_getAllTree.method,
			params:{},
			success:function(response){
				mc.fireEvent(groupsTree.get('id'),'loadData',{obj:response.responseText});
			}
		});
	}
})