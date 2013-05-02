new (function(){
	var me = this;
	var parentUuid = '';
	var mainView;//打开主页面的方法
	var fn;//打开角色列表的页面
	this.mod = new Gframe.module.RemoteModule({
	});
	
	this.mod.defaultView = function(params){
		parentUuid = params.roleUuid;
		var roleName = params.roleName;
		mainView = params.mainView;
		fn = params.fn;
		me.mod.main.open({
			key:'groupOrUserListRole',
			id:'groupOrUserListRole'+parentUuid,
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			usePage:true,
			track:[
					{name:'用户管理',cursor:'false'},
					{name:'角色',handler:fn},
					{name:roleName}
				],
			acts:{
				track:[
					{value:'添加',handler:me.addUser}
				],
				clip:[
					{value:'解除关联',handler:me.remove },
					{value:'关联此角色',handler:me.related},
					{value:'删除',handler:me.del}
				],
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.look,exp:'person'},
					{name:'打开',value:'打开',imgCls:'openfolder_btn',handler:me.opener,exp:'group'}
					
				]
			},
			actFilter:function(data,purview){
				if(data.type == '0'){
					purview['person'] = true;
				}else{
					purview['group'] = true;
				}
				return purview;
			},
			store:{
				service :$sl.guserManager_roles_lookRoleGroups_getChildrenListByRole.service,
				method :$sl.guserManager_roles_lookRoleGroups_getChildrenListByRole.method,
				params:{
					groupUuid:params.roleUuid
				},
				success:function(data,mod){
				}
			},
			colnums:[
				{header:'名称',textAlign:'left',width:'max',mapping:'name',handler:me.opener,renderer:me.setCur},
				{header:'电话',width:180,mapping:'phone'},
				{header:'部门',width:120,mapping:'department'},
				{header:'群组',width:250,mapping:'groups',renderer:me.changeName},
				{header:'类型',width:150,textAlign:'left',mapping:'type',renderer:me.changeType}
			],
			initMethod:function(mod){
			}
		});
	};
	this.setCur = function(v,record,o){
		if(o.type != '0'){
			record.setCursor('pointer');
		}
		return v;
	}
	//格式化名称
	this.changeName = function(v,record,o){
		if(v){
			var groupsName = ' ';
			v.each(function(i,n){
				groupsName = groupsName+n.name+';'
			})
			return groupsName
		}else{
			return ' '
		}
	}
	
	//格式化类型
	this.changeType = function(v,record,o){
		var str;
		switch(v){
			case '0':
				str = '用户';
				break;
			case '1':
				str = '群组';
				break;
			case '2':
				str = '部门';
				break;
			default:
				break;
		}
		return str;
	};
	
	//查看
	this.look = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/groupsGrid/lookUser.js',
			params:{
				uuid:o.get('data').uuid
			}
		})
	}
	
	//添加
	this.addUser = function(){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/roles/addUser.js',
			params:{
				uuid:parentUuid,
				refreshFn : me.reloadDangqianGridFunc
				
			}
		})
	}
	
	//打开
	this.opener = function(e,o){
		var u;
		if(o.get){
			u = o.get('data').uuid;
		}else{
			u = o.uuid;
			if(o.type == '0'){
				return ;
			}
		}
		me.mod.main.remoteOpen({
			url:'modules/guserManager/groupsGrid/openGroupsGrid.js',
			params:{
				parentUuid:u,
				fn:mainView
			}
		})
	}
	
	//删除
	this.del = function(){
		me.mod.main.confirm({
				text : '是否确定删除所选用户(组)？',
				handler : function(confirm) {
					if (confirm) {
						var data = me.mod.main.clipboardMgr.getChecked();
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
							service:$sl.guserManager_userGroups_openGroupsGrid_delUserOrUserGroup.service,
							method:$sl.guserManager_userGroups_openGroupsGrid_delUserOrUserGroup.method,
							params:{
								uuids:uuids
							},
							success : function(response){
								var d = util.parseJson(response.responseText);
								if (d.success) {
									me.mod.main.clipboardMgr.remove(removeUuids);
									me.mod.main.alert({
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
	//关联
	this.related = function(){
		me.mod.main.confirm({
				text : '是否确定将所选用户(组)关联到此角色？',
				handler : function(confirm) {
					if (confirm) {
						var data = me.mod.main.clipboardMgr.getChecked();
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
							service:$sl.guserManager_roles_roleRoleGroups_grantRoleToUserOrGroup.service,
							method:$sl.guserManager_roles_roleRoleGroups_grantRoleToUserOrGroup.method,
							params:{
								uuids:uuids,
								groupUuid:parentUuid
							},
							success : function(response){
								var d = util.parseJson(response.responseText);
								if (d.success) {
									me.mod.main.clipboardMgr.remove(removeUuids);
									me.mod.main.alert({
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
	//解除角色关联
	this.remove = function(){
		me.mod.main.confirm({
				text : '是否确定解除所选用户(组)与当前角色的关系？',
				handler : function(confirm) {
					if (confirm) {
						var data = me.mod.main.clipboardMgr.getChecked();
						var uuids = [];
						var removeUuids = [];
						data.each(function(i,n){
							uuids.push(n.relationUuid);
							removeUuids.push(n.uuid);
						})
						uuids = util.json2str(uuids);
						mc.send({
							service:$sl.guserManager_roles_roleRoleGroups_removeRelation.service,
							method:$sl.guserManager_roles_roleRoleGroups_removeRelation.method,
							params:{
								relationUuids:uuids
							},
							success : function(response){
								var d = util.parseJson(response.responseText);
								if (d.success) {
									me.mod.main.clipboardMgr.remove(removeUuids);
									me.mod.main.alert({
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
	//
	//刷新面板
	this.reloadDangqianGridFunc = function() {
		var view = me.mod.main.getCentralView();
		if (view && view.dynamic && view.dynamic.load) {
			view.dynamic.load();
		}
	}
	
});