/**
 * 所有的用户列表
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	var reloadExpendView;
	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'allUserList_id',
			key:'allUserList',
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			usePage:true,
			searchConfig:{
				useSearch:true,
				handler:function(e,obj){
					me.mod.main.remoteOpen({
						url:'modules/guserManager/allUsers/userSerachResult.js',
						params:{
							value:obj.getValue()
						}
					});
				}
			},
			track:[
				{name:'用户管理'},
				{name:'全部用户'}
			],
			actFilter:function(data,purview){
				purview['all'] = true;
				if(data.bindedPerson){
					purview['bind'] = true;
					purview['notbind'] = false;
				}else{
					purview['bind'] = false;
					purview['notbind'] = true;
				}
				if(data.sys){
					purview['del'] = false;
				}else{
					purview['del'] = true;
				}
				return purview;
			},
			acts:{
				track:[
					{value:'新增用户',handler:me.addUser,exp:'all'},
					{value:'导入',handler:me.importUser,exp:'all'}
				],
				clip:[
					{name:'删除',value:'删除',handler:me.delUser,exp:'del'}
				],
				grid:[
					{name:'重置密码',value:'重置密码',imgCls:'reset_btn',handler:me.resetPassWord,exp:'all'},
					{name:'绑定人员',value:'绑定人员',imgCls:'enable_btn',handler:me.bindingPerson,exp:'notbind'},
					{name:'解除绑定',value:'解除绑定',imgCls:'unlock_btn',handler:me.unbindPerson,exp:'bind'},
					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.edit,exp:'del'}
				]
			},
			store:{
				service :$sl.guserManager_allUsers_getAllusersList.service,
				method :$sl.guserManager_allUsers_getAllusersList.method,
				params:{
					//groupUuid:parentUuid
				},
				success:function(data,mod){
				
				}
			}, 
			colnums:[
					{header:'图标',textHidden:true,renderer:me.changeFileImg,width:25,textAlign:'right'},
					{header:'登录名',textAlign:'left',width:100,mapping:'loginName',cursor:'pointer',handler:me.openEditPage,renderer:me.setCur },
					{header:'姓名',textAlign:'left',width:130,mapping:'name',renderer:me.setCur },
					{header:'电话',width:'max',mapping:'mobile'},
					{header:'用户组',width:'max',mapping:'gsoftGroups',renderer:me.changeUsers},
					{header:'部门',width:'max',mapping:'depName'},
					{header:'角色',width:'max',textAlign:'left',mapping:'gsoftRoles',renderer:me.changeRoles},
					{header:'备注',type:'tips',width:'max',mapping:'remark'}
				],
			initMethod:function(mod){
				reloadExpendView = params.reloadExpendView;
				parentUuid = params.parentUuid;
			}
		});
	}
	
	//搜索用户
	this.serchUser = function(){
		me.mod.main.open({
			id:'serchUser_id',
			xtype:'form',
			mode:'pop',
			title:'搜索',
			width:550,
			height:120,
			fields:[
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'包含内容：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',width:'max',leftHidden:true,itemId:'authrizedId',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'blank',width:'max'},
					    {xtype:'button',value:'搜索',width:100,handler:me.submitSearch},
					     {xtype:'blank',width:20},
					 	{xtype:'button',value:'取消',width:100,handler:function(){
					 		var form = me.mod.main.get('serchUser_id');
					 		form.reset();
					 		me.mod.main.popMgr.close('serchUser_id');
					 	}},
						{xtype:'blank',width:'max'}
					]
				}
			],
			initMethod:function(mod){
				var form = me.mod.main.get('serchUser_id');
				var text = form.getByItemId('authrizedId');
				text.setValue('登录名，姓名，电话等');
				text.onclick = function(e,obj){
					if(obj.getValue()==='登录名，姓名，电话等'){
						obj.setValue('');
					}
				}
			}
		});
	}
	
	//提交高级搜
	this.submitSearch = function(){
		var form = me.mod.main.get('serchUser_id');
		var text = form.getByItemId('authrizedId');
		me.mod.main.remoteOpen({
			url:'modules/guserManager/allUsers/userSerachResult.js',
			params:{
				value:text.getValue()
			}
		});
	};


        this.importUser = function(){
            me.mod.main.remoteOpen({
                url:'modules/guserManager/allUsers/importUser.js',
                params:{
                    refreshFn: me.reloadDangqianGridFunc,
                    reloadExpendView:reloadExpendView
                }
            });
        };
	
	//解除绑定
	this.unbindPerson = function(e,o){
		me.mod.main.confirm({
				text : '是否确定解除绑定？',
				handler : function(confirm) {
					if (confirm) {
						mc.send({
							service:$sl.guserManager_allUsers_setUnBindPerson.service,
							method:$sl.guserManager_allUsers_setUnBindPerson.method,
							params:{
								uuid:o.get('data').uuid
							},
							success : function(response){
								var d = util.parseJson(response.responseText);
								if (d.success) {
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
	
	this.delUser = function(){
		me.mod.main.confirm({
				text : '是否确定删除所选用户？',
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
							service:$sl.guserManager_userGroups_openGroupsGrid_delUsersByUuid.service,
							method:$sl.guserManager_userGroups_openGroupsGrid_delUsersByUuid.method,
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
	
	//打开新增用户的界面
	this.addUser = function(){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/allUsers/addUserInAll.js',
			params:{
				refreshFn:me.reloadDangqianGridFunc,
				reloadExpendView:reloadExpendView
			}
		})
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
								uuid:o.get('data').uuid
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
	
	this.edit = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/allUsers/editUserInAll.js',
			params:{
				//refreshFn:me.reloadDangqianGridFunc,
				rowData:o.get('data')
			}
		});
	}
	
	this.openEditPage = function(e,data){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/allUsers/editUserInAll.js',
			params:{
				//refreshFn:me.reloadDangqianGridFunc,
				rowData:data
			}
		});
	}
	
	this.changeUsers = function(v,record,o){
		record.set('useLimit',false);
		var str = '';
		if(v && v.length){//如果存在图片ID，则显示图片
			str = v[0].name
		}
		return str;
	}
	
	this.changeRoles = function(v,record,o){
		record.set('useLimit',false);
		var str = '';
		if(v && v.length){//如果存在图片ID，则显示图片
			str = v[0].name
		}
		return str;
	}
	
	this.changeFileImg = function(v,record,o){
		record.set('useLimit',false);
		if(o.bindedPerson){
			record.set('title','人员绑定');
			return '<span class="people_img" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
		}else{
			return '';
		}
	}
	
	//绑定人员
	this.bindingPerson = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/guserManager/groupsGrid/bindUser.js',
			params:{
				refreshFn:me.reloadDangqianGridFunc,
				data:o.get('data')
			}
		})
	}
	
	//刷新面板
	this.reloadDangqianGridFunc = function() {
		var view = me.mod.main.getCentralView();
		if (view && view.dynamic && view.dynamic.load) {
			view.dynamic.load();
		}
	}


});