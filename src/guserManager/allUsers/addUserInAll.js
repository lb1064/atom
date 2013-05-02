new (function(){
	var me = this;
	var roleTree,userGroupTree;
	var refreshFn;//刷新方法
	var clearId;//时间锁
	var emailYes = false;//email的验证是否通过
	var userYes = false;//用户名的验证是否通过
	var authData=[{value:'0',text:'本地认证'}];//认证方式的集合
	this.mod = new Gframe.module.RemoteModule({
		tabTitle:'新增人员',
		expandView : {
			'changeRoleViewPresson1':{
				title : '选择角色',
				active:true,
				create : function(params){
					roleTree = new Treebar({serviceType:true});	
					roleTree.handler = function(node){
						var store={
							uuid:node.options.uuid,
							name:node.options.name 
						}
						var f=me.mod.main.get('addUserView_id');
						var tplus=f.getByItemId('uuids');
						tplus.addRecord(store);
						tplus.update()
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
			'selectUserGroupTree1':{
				title : '选择用户组',
				active:true,
				create : function(params){
					userGroupTree = new Treebar({serviceType:true});	
					userGroupTree.handler = function(node){
						var store={
							uuid:node.options.uuid,
							name:node.options.name 
						}
						var f=me.mod.main.get('addUserView_id');
						var tplus=f.getByItemId('groups_id');
						tplus.addRecord(store);
						tplus.update()
					};
					//todo 人员的图标先只做2种区分
                    userGroupTree.renderer = function (tObj) {
                        var iconType = tObj.xtype;
                        if (iconType=='contact') {
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
						service:$sl.guserManager_allUsers_getSelectUserGroupTree.service,
						method:$sl.guserManager_allUsers_getSelectUserGroupTree.method,
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
	
	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'addUserView_id',
			xtype:'form',
			mode:'loop',
			beforeGoback:function(){
					var form = me.mod.main.get('addUserView_id');
					form.reset();
					if(clearId){
						clearTimeout(clearId);
					}
					me.mod.main.closeExpandView('changeRoleViewPresson1');
					me.mod.main.closeExpandView('selectUserGroupTree1');
					//me.mod.main.goback();
			},
			track:[
				{name:'用户管理'},
				{name:'全部'},
				{name:'新增用户'}
			],
			acts:{
				track:[
					{name:'保存',value:'保存',itemId:'submitBtn',handler:me.submit},
					{name:'取消',value:'取消',handler:function(){
							var form = me.mod.main.get('addUserView_id');
							form.reset();
							if(clearId){
								clearTimeout(clearId);
							}
							form.getByItemId('tipMessage').setValue(' ');
							//me.mod.main.popMgr.close('addUserView_id');
							me.mod.main.closeExpandView('changeRoleViewPresson1');
							me.mod.main.closeExpandView('selectUserGroupTree1');
							me.mod.main.goback();
					}}
				]
			},
			fields:[
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'登录名：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'loginName',itemId:'userName',leftHidden:true,width:'max',onTextChange:me.provingUserName},
						{xtype:'blank',width:5},
						{xtype:'label',itemId:'tipMessage',textAlign:'left',width:'max'},
						{xtype:'blank',width:150}
					]
				},
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'姓名：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'name',itemId:'name',leftHidden:true,width:'max'},
						{xtype:'blank',width:150}
					]
				},
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'手机：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'mobile',itemId:'phone',leftHidden:true,width:'max'},
						{xtype:'blank',width:150}
					]
				},
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'邮箱：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'email',itemId:'email',onTextChange:function(e,o){
								var value = o.getValue();
								var form = me.mod.main.get('addUserView_id');
								//var createBtn = form.getByItemId('submitBtn');
								var myreg = /^([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
								if(value != ''&&myreg.test(value)){
									emailYes = true;
								}else{
									emailYes = false;
								}
//								if(emailYes&&userYes){
//									createBtn.setEnabled(true);
//								}else{
//									createBtn.setEnabled(false);
//								}
							},leftHidden:true,width:'max'},
						{xtype:'blank',width:150}
					]
				},
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'认证方式：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'combo',data:authData,displayField:'text',displayValue:'value',width:'max',itemId:'authrizedId',width:'max'},
						{xtype:'blank',width:150}
					]
				},
				{
				    height:40,
				    align:'left',
				    itemId:'textGroupCol',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加个人群组：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'gsoftGroups',width:'max',selectOnly:true,itemId:'groups_id',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('selectUserGroupTree1');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('addUserView_id');
										var textCol = form.getByItemId('textGroupCol');
										textCol.set('height',height+10);
										form.resize();
									}
								}),defaultField:'name',fields:['uuid','name'],width:'max'},
						{xtype:'blank',width:150}
					]
				},
				{
				    height:40,
				    align:'left',
				    itemId:'textCol',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加个人角色：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'gsoftRoles',width:'max',selectOnly:true,itemId:'uuids',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('changeRoleViewPresson1');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('addUserView_id');
										var textCol = form.getByItemId('textCol');
										textCol.set('height',height+10);
										form.resize();
									}
								}),defaultField:'name',fields:['uuid','name'],width:'max'},
						{xtype:'blank',width:150}
					]
				}
			],
			hiddens:[
//				{name:'parentUuid',itemId:'parentUuid'},
//				{name:'groupType',value:'0'}
				
			],
			initMethod:function(mod){
				emailYes = false;
				userYes = false;
				//回填数据
				var form = me.mod.main.get('addUserView_id');
				form.reset();
				//form.getByItemId('parentUuid').setValue(params.parentUuid);
				refreshFn = params.refreshFn;
				form.getByItemId('tipMessage').setValue(' ');
				//form.getByItemId('submitBtn').setEnabled(false);
				form.getByItemId('authrizedId').setEnabled(false);
			}
		});
	}
	
	//提交表单
	this.submit = function(e,btn){
		var form = me.mod.main.get('addUserView_id');
		var data = form.serializeForm();
		var user = form.getByItemId('userName');	
		var userName = user.getValue();	
		if(userYes){
//			if(emailYes){
				btn.setEnabled(false);
				form.submit({
					service:$sl.guserManager_userGroups_userGroups_addUser.service,
					method:$sl.guserManager_userGroups_userGroups_addUser.method,
					params:data,
					success : function(response){
						var d = util.parseJson(response.responseText);
						if (d.success) {
							if(clearId){
								clearTimeout(clearId);
							}
							me.mod.main.alert({
										text : d.msg,
										level : 'info',
										delay : 3000
									});
							form.reset();
							//me.mod.main.popMgr.close('addUserView_id');
							form.getByItemId('tipMessage').setValue(' ');
							me.mod.main.closeExpandView('changeRoleViewPresson1');
							me.mod.main.goback();
							btn.setEnabled(true);
						}
					},
					failure:function(responseObject){
						var d = util.parseJson(responseObject.responseText);
						me.mod.main.alert({
							text : d.msg,
							level : 'error',
							delay : 3000
						});
						btn.setEnabled(true);
						//此处需要弹出一个后台异常！
					}
				});
//			}else{
//				me.mod.main.alert({
//					text:'邮箱格式错误！',
//					level:'error',
//					delay:3000
//				});
//			}
		}else if(!userName){
			me.mod.main.alert({
				text:'登录名不能够为空',
				level:'error',
				delay:3000
			});
		}else{
			me.mod.main.alert({
				text:'登录名已经存在!',
				level:'error',
				delay:3000
			});
		}
	}
	//验证用户名是否已被使用
	this.provingUserName = function(){
		var form = me.mod.main.get('addUserView_id');
		var tipLabel = form.getByItemId('tipMessage');
		var user = form.getByItemId('userName');	
		var userName = user.getValue();	
		if(clearId){
			clearTimeout(clearId);
		}
		clearId = setTimeout(function(){
			if(!userName){
				userYes = false;
				userName = ' ';
				//form.getByItemId('submitBtn').setEnabled(false);
				tipLabel.setValue('<span class="deletemail_btn" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>'+'用户名不能为空');
				return;
			}
			mc.send({
				service :$sl.guserManager_userGroups_addPerson_checkUserName.service,
				method :$sl.guserManager_userGroups_addPerson_checkUserName.method,
				params:{
					loginName:userName
				},
				success:function(response){
					var d = util.parseJson(response.responseText);
					var imageStr;
					if(d.flag){
						userYes = true;
						tipLabel.set('useLimit',false);
						imageStr = '<span class="checkOk_btn" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
						tipLabel.setValue(imageStr+'登录名可用');
//						if(userYes&&emailYes){
//							form.getByItemId('submitBtn').setEnabled(true);
//						}else{
//							form.getByItemId('submitBtn').setEnabled(false);
//						}
					}else{
						userYes = false;
						tipLabel.set('useLimit',false);
						//form.getByItemId('userName').setValue('');
						imageStr = '<span class="deletemail_btn" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
						tipLabel.setValue(imageStr+'登录名不可用!');
					}
					
				},
				failure:function(){
					userYes = false;
					tipLabel.set('useLimit',false);
					imageStr = '<span class="deletemail_btn" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
					tipLabel.setValue(imageStr+'登录名不可用!');
					//form.getByItemId('submitBtn').setEnabled(false);
				}
			});
		},1000);
	}
})