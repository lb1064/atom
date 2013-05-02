new (function(){
	var me = this;
	var parentUuid = '';
	var groupsTree;
	var reloadExpendView;//刷新扩展面板
	var fn;
	this.mod = new Gframe.module.RemoteModule({
		key : 'groupOrUser'
	});
	
	var groupUuid,trackPath;
	this.mod.defaultView = function(params){
		groupUuid = params.uuid || '';
		reloadExpendView = params.reloadExpendView,
		fn = params.fn;
		//groupUuid = params.parentUuid;
		me.mod.main.open({
			key:'groupOrUserList',
			id:'groupOrUserList'+groupUuid,
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			usePage:true,
			acts:{
				track:[
					{value:'新增分组',handler:me.addGroup}
				],
				clip:[
					//{value:'移出本组',handler:me.moveOut,exp:'show'},
					//{value:'复制到此',handler:me.copy},
					{value:'移动到此',handler:me.move},
					{value:'删除',handler:me.del}
				],
				grid:[
//					{name:'排序',value:'排序',imgCls:'continuesend_btn',handler:me.sortPerson,exp:'person'},
//					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.look,exp:'person'},
					{name:'打开',value:'打开',imgCls:'openfolder_btn',handler:me.open},
					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.edit}
//					{name:'绑定人员',value:'绑定人员',imgCls:'incident_btn',handler:me.bindingPerson,exp:'person&&bp'},
//					{name:'重置密码',value:'重置密码',imgCls:'reset_btn',handler:me.resetPassWord,exp:'person'},
//					{name:'查看详情',value:'查看详情',imgCls:'editfile_btn',handler:me.lookMessage,exp:'group'}
				]
			},
			actFilter:function(data,purview){
//				if(data.type == '1'){
//					purview['group'] = true;
//				}
//				if(data.type == '0'){
//					purview['person'] = true;
//				}
//				if(!data.isBindPerson){
//					purview['bp'] = true;
//				}
//				if(params.name != '未分组'){
//					purview['show'] = true;
//				}
				return purview;
			},
			store:{
				service :$sl.guserManager_userGroups_userGroups_getChildrenListByUserGroup.service,
				method :$sl.guserManager_userGroups_userGroups_getChildrenListByUserGroup.method+'$_'+groupUuid,
				params:{
					uuid:groupUuid
				},
				success:function(data,mod){
					if (data.path) {
						var path = data.path;
						var sendPath = [	
											{name:'用户管理',cursor:'false'},
											{name:'用户组',handler : function() {
												me.mod.defaultView({uuid:'',reloadExpendView:reloadExpendView})
											}}
										];
						if (path.length > 0) {
							path.each(function(i, n) {
										sendPath.push({name : n.name,value : n.value,
													handler : function() {
															me.mod.defaultView({uuid:n.value,reloadExpendView:reloadExpendView});
													}
												});
										filePath = path[path.length - 1].value;
									});
						}
						me.mod.main.historyMgr.reloadTrack(sendPath);
						trackPath = sendPath.splice(0);
					}
				}
			},
			colnums:[
					{header:'名称',textAlign:'left',width:200,cursor:'pointer',mapping:'name',handler:me.openGroup},
					{header:'角色',width:'max',mapping:'gsoftRoles',renderer:me.changeRole},
					{header:'备注',type:'tips',textAlign:'left',mapping:'remark'}
				],
			initMethod:function(mod){
				parentUuid = params.parentUuid;
			}
		});
	};
	
	this.openEditPage = function(e,o){
		var d = o;
		if(!d.sys){
			me.mod.main.remoteOpen({
				url:'modules/guserManager/userGroups/editorGroups.js',
				params:{
					refreshFn:me.reloadDangqianGridFunc,
					rowData:d,
					trackPath:trackPath
				}
			});
		}
	}
	
	this.setCur = function(v,record,o){
		if(o.type != '0'){
			record.setCursor('pointer');
		}
		return v;
	}
	
	this.sortPerson = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/groupsGrid/giveSort.js',
			params:{
				uuid:o.get('data').uuid,
				lineData:o.get('data'),
				obj:me
			}
		});
	}
	
	//打开一个页面
	this.open = function(e,o){
		if(!o.get('data').sys){//不是系统组才可以查看
			var params = {uuid:o.get('data').uuid,reloadExpendView:reloadExpendView};
			me.mod.defaultView(params);
		}
	}
	
	//打开一个页面
	this.openGroup = function(e,data){
		if(!data.sys){//不是系统组才可以查看
			var params = {uuid:data.uuid,reloadExpendView:reloadExpendView};
			me.mod.defaultView(params);
		}
	}
	
	//判断是否添加图片
	this.showImage = function(v,record,o){
		record.set('useLimit',false);
		record.set('title',' ');
		if(v){
			return '<span class="meetingman_img" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
		}else{
			return ' '
		}
	};
	//格式化类型
	this.changeType = function(v,record,o){
		if(v == '0'){
			return '用户';
		}else if(v == '1'){
			return '群组';
		}
		return v;
	};
	//格式化角色
	this.changeRole = function(v,record,o){
		record.set('useLimit',false);
		var str = '';
		if(v){//如果存在图片ID，则显示图片
			if(v.length===1){
				str = v[0].name
			}else if(v.length===2){
				str = v[0].name+';'+v[1].name;
			}else if(v.length>2){
				str = v[0].name+';'+v[1].name+'......';
			}
		}
		return str;
	}
	//打开新增分组的界面
	this.addGroup = function(){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/userGroups/addUserGroup.js',
			params:{
				refreshFn:me.reloadDangqianGridFunc,
				//reloadExpendView:reloadExpendView,
				parentUuid:groupUuid,
				trackPath:trackPath
			}
		})
	}
	//打开新增用户的界面
	this.addUser = function(){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/groupsGrid/addUserInAll.js',
			params:{
				refreshFn:me.reloadDangqianGridFunc,
				parentUuid:parentUuid
			}
		})
	}
	//打开编辑的界面
	this.edit = function(e,o){
		var d = o.get('data');
		me.mod.main.remoteOpen({
			url:'modules/guserManager/userGroups/editorGroups.js',
			params:{
				refreshFn:me.reloadDangqianGridFunc,
				rowData:o.get('data'),
				trackPath:trackPath
			}
		});
		
	}
	
	//重置密码
	this.resetPassWord = function(e,o){
		me.mod.main.confirm({
				text : '是否确定重置密码？',
				handler : function(confirm) {
					if (confirm) {
						mc.send({
							service:$sl.guserManager_userGroups_userGroups_resetUserPwd.service,
							method:$sl.guserManager_userGroups_userGroups_resetUserPwd.method,
							params:{
								userUuid:o.get('data').uuid
							},
							success : function(response){
								var d = util.parseJson(response.responseText);
								if (d.success) {
									me.mod.main.alert({
										text : d.msg,
										level : 'info',
										delay : 3000
									});
								}
							}
						})							
					}
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
						var uuids = [],clearUuids = [];
						data.each(function(i,n){
							if(!n.sys){
								uuids.push(n.uuid);
							}
							clearUuids.push(n.uuid);
						});
						mc.send({
							service:$sl.guserManager_userGroups_openGroupsGrid_delUserOrUserGroup.service,
							method:$sl.guserManager_userGroups_openGroupsGrid_delUserOrUserGroup.method,
							params:{
								uuids:util.json2str(uuids)
							},
							success : function(response){
								var d = util.parseJson(response.responseText);
								if (d.success) {
									me.mod.main.clipboardMgr.remove(clearUuids);
									me.mod.main.alert({
												text : d.msg,
												level : 'info',
												delay : 3000
											});
									me.reloadDangqianGridFunc();
									//reloadExpendView();
								}
							}
						})							
					}
				}
			})
	}
	
	//移动到此
	this.move = function(){
		me.mod.main.confirm({
				text : '是否确定将所选用户(组)移动到此？',
				handler : function(confirm) {
					if (confirm) {
						var data = me.mod.main.clipboardMgr.getChecked();
						var uuids = [],clearUuids = [];
						data.each(function(i,n){
							if(!n.sys){
								uuids.push(n.uuid);
							}
							clearUuids.push(n.uuid);
						})
						mc.send({
							service:$sl.guserManager_userGroups_userManagerMain_moveUserOrUserGroup.service,
							method:$sl.guserManager_userGroups_userManagerMain_moveUserOrUserGroup.method,
							params:{
								uuids:util.json2str(uuids),
								toUuid:groupUuid
							},
							success : function(response){
								var d = util.parseJson(response.responseText);
								if (d.success) {
									me.mod.main.clipboardMgr.remove(clearUuids);
									me.mod.main.alert({
												text : d.msg,
												level : 'info',
												delay : 3000
											});
									me.reloadDangqianGridFunc();
									//reloadExpendView();
								}
							}
						})							
					}
				}
			})
	}
	//复制到此
	this.copy = function(){
		me.mod.main.confirm({
				text : '是否确定将所选用户(组)复制到此？',
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
							service:$sl.guserManager_userGroups_openGroupsGrid_copyUserOrUserGroup.service,
							method:$sl.guserManager_userGroups_openGroupsGrid_copyUserOrUserGroup.method,
							params:{
								targetGroupUuid:parentUuid,
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
									//reloadExpendView();
								}
							}
						})							
					}
				}
			})
	}
	//移出本组
	this.moveOut = function(){
		me.mod.main.confirm({
				text : '是否确定将所选用户(组)移出本组？',
				handler : function(confirm) {
					if (confirm) {
						var data = me.mod.main.clipboardMgr.getChecked();
						var uuids = [];
						var removeUuids = [];
						data.each(function(i,n){
							uuids.push(n.relationUuid);
							removeUuids.push(n.uuid);
						})
						mc.send({
							service:$sl.guserManager_userGroups_openGroupsGrid_removeUserFromGroup.service,
							method:$sl.guserManager_userGroups_openGroupsGrid_removeUserFromGroup.method,
							params:{
								relationUuids:util.json2str(uuids)
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
									//reloadExpendView();
								}
							}
						})							
					}
				}
			})
	}
	
	//查看详情
	this.lookMessage = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/userGroups/lookMessage.js',
			params:{
				uuid:o.get('data').uuid
			}
		})
	}
	
	//查看
	this.look = function(e,o){
		var url = '';
		if(o.get('data').isBindPerson){
			url = 'modules/guserManager/groupsGrid/lookUserMessage.js'
		}else{
			url = 'modules/guserManager/groupsGrid/lookUser.js'
		}
		me.mod.main.remoteOpen({
			url:url,
			params:{
				uuid:o.get('data').uuid,
				deptName:o.get('data').department
			}
		})
	}
	
	//刷新面板
	this.reloadDangqianGridFunc = function() {
		var view = me.mod.main.getCentralView();
		if (view && view.dynamic && view.dynamic.load) {
			view.dynamic.load();
		}
		reloadExpendView();
	}
});