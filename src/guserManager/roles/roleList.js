new (function(){
	var me = this;
	var reloadExpendView;//刷新主扩展面版
	var mainView;
	this.mod = new Gframe.module.RemoteModule({
	});
	
	this.mod.defaultView = function(params){
		mainView=params.mainView;
		reloadExpendView = params.reloadExpendView;
		me.mod.main.open({
			key:'roleList',
			id:'roleList',
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			usePage:true,
			track:[
					{name:'用户管理',cursor:'false'},
					{name:'角色',cursor:'false'}
				],
			actFilter:function(data,purview){
//				if(data.roleType == '1'){
//					purview['editor'] = true;
//				}
				return purview;
			},
			acts:{
				track:[
					{value:'新增角色',handler:me.addRole}
				],
				clip:[
					{value:'删除',handler:me.del}
				],
				grid:[
					//{name:'打开',value:'打开',imgCls:'openfolder_btn',handler:me.opener,renderer:me.setCur},
					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editor}
					//{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.showDetail,exp:'editor'}
				]
			},
			store:{
				service :$sl.guserManager_roles_roleList_getRoleList.service,
				method :$sl.guserManager_roles_roleList_getRoleList.method,
				params:{
				},
				success:function(data,mod){
				}
			},
			colnums:[
				{header:'角色名称',textAlign:'left',textAlign:'left',width:'max',mapping:'name',handler:me.opener,renderer:me.setCur},
				{header:'角色类型',textAlign:'left',textAlign:'left',width:'max',mapping:'sys',renderer:me.setType},
				{header:'角色来源',textAlign:'left',textAlign:'left',width:'max',mapping:'appId'},
				{header : '',type : 'tips',mapping : 'remark'}
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
	this.setType = function(v,record,o){
		if(v){
			return '系统角色'
		}else{
			return '自定义角色'
		}
	}
	//打开
	this.opener = function(e,da){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/roles/editorRoles.js',
			params:{
				refreshFn:me.reloadDangqianGridFunc,
				reloadExpendView:me.reloadExpendView,
				mainView:me.mod.defaultView,
				rowData:da
			}
		});
	}
	//新建角色
	this.addRole = function(){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/roles/addRoles.js',
			params:{
				refreshFn:me.reloadDangqianGridFunc,
				reloadExpendView:reloadExpendView,
				mainView:mainView
			}
		})
	}
	//编辑
	this.editor = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/roles/editorRoles.js',
			params:{
				refreshFn:me.reloadDangqianGridFunc,
				rowData:o.get('data'),
				reloadExpendView:me.reloadExpendView,
				mainView:me.mod.defaultView
			}
		})
	}
	//删除
	this.del = function(e,o){
		me.mod.main.confirm({
				text : '是否确定删除所选角色？',
				handler : function(confirm) {
					if (confirm) {
						var data = me.mod.main.clipboardMgr.getChecked();
						var uuids = [];
						var removeUuids = [];
						data.each(function(i,n){
							uuids.push(n.uuid);
							removeUuids.push(n.uuid);
						})
						uuids = util.json2str(uuids);
						mc.send({
							service:$sl.guserManager_roles_roleList_delRole.service,
							method:$sl.guserManager_roles_roleList_delRole.method,
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
	
	this.showDetail = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/roles/showRoleDetail.js',
			params:{
				rowData:o.get('data')
			}
		});
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