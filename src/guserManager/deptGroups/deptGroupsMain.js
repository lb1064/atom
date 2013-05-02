new (function(){
	var me = this;
	var parentUuid = '';
	var groupsTree;
	this.mod = new Gframe.module.RemoteModule({});
	
	this.mod.defaultView = function(params){
		parentUuid = params.uuid;
		me.mod.main.open({
			key:'groupOrUserList'+new Date().getTime(),
			id:'groupOrUserList'+parentUuid,
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			usePage:true,
			acts:{
				track:[
				],
				clip:[
				],
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.look,exp:'person'},
					{name:'打开',value:'打开',imgCls:'openfolder_btn',handler:me.open,exp:'group'},
					{name:'查看详情',value:'查看详情',imgCls:'editfile_btn',handler:me.lookMessage,exp:'group'},
					{name:'编辑角色',value:'编辑角色',imgCls:'configuration_btn',handler:me.editRole,exp:'group'}
					
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
				service :$sl.guserManager_deptGroups_deptGroupsMain_getChildrenListByDept.service,
				method :$sl.guserManager_deptGroups_deptGroupsMain_getChildrenListByDept.method+'$_'+params.uuid,
				params:{
					groupUuid:parentUuid
				},
				success:function(data,mod){
					if (data.path) {
						var path = data.path;
						var sendPath = [	
											{name:'用户管理',cursor:'false'},
											{name:'部门分组',cursor:'false'}
										];
						if (path.length > 0) {
							path.each(function(i, n) {
										sendPath.push({name : n.name,value : n.value,
													handler : function() {
														me.mod.defaultView({uuid:n.value});
													}
												});
										filePath = path[path.length - 1].value;
									});
						}
						me.mod.main.historyMgr.reloadTrack(sendPath);
					}
				}
			},
			colnums:[
					{header:'名称',textAlign:'left',width:'max',mapping:'name',handler:me.open,renderer:me.setCur },
					{header:'职务',width:120,mapping:'job'},
					{header:'电话',width:180,mapping:'phone'},
					{header:'角色',width:250,mapping:'roles',renderer:me.changeRole},
					{header:'类型',width:150,textAlign:'left',mapping:'type',renderer:me.changeType},
					{header:'提示',mapping:'remark',type:'tips'}
				],
			initMethod:function(mod){
				parentUuid = params.parentUuid;
			}
		});
	};
	
	//编辑角色
	this.editRole = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/deptGroups/editDeptRole.js',
			params:{
				rowData:o.get('data')
			}
		});
	}
	
	this.setCur = function(v,record,o){
		if(o.type != '0'){
			record.setCursor('pointer');
		}
		return v;
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
	//格式化角色
	this.changeRole = function(v,record,o){
		var roleName = '';
		o.roles.each(function(i,n){
			roleName = roleName+n.roleName+';'
		});
		return roleName;
	}
	
	//查看详情
	this.lookMessage = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/deptGroups/lookDeptMsg.js',
			params:{
				uuid:o.get('data').uuid
			}
		})
	}
	
	//查看
	this.look = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/groupsGrid/lookUser.js',
			params:{
				uuid:o.get('data').uuid
			}
		})
	}
	
	//打开
	this.open = function(e,o){
		if(o.get){
			var params = {uuid:o.get('data').uuid};
			me.mod.defaultView(params);
		}else{
			if(o.type!='0'){
				var params = {uuid:o.uuid}
				me.mod.defaultView(params);
			}
		}
	}
});