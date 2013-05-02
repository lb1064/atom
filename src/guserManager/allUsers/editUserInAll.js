new (function(){
	var me = this;
	var roleTree,userGroupTree;
	var refreshFn;//刷新方法
	var clearId;//时间锁
	var emailYes = false;//email的验证是否通过
	var userYes = false;//用户名的验证是否通过
	var authData=[{value:'0',text:'本地认证'}];//认证方式的集合
	var oldGsoftGroups,oldGsoftRoles;
	this.mod = new Gframe.module.RemoteModule({
		tabTitle:'新增人员',
		expandView : {
			'changeRoleViewPresson':{
				title : '选择角色',
				active:true,
				create : function(params){
					roleTree = new Treebar({serviceType:true});	
					roleTree.handler = function(node){
						var store={
							uuid:node.options.uuid,
							name:node.options.name 
						}
						var f=me.mod.main.get('editUserView');
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
			'selectUserGroupTree':{
				title : '选择用户组',
				active:true,
				create : function(params){
					userGroupTree = new Treebar({serviceType:true});	
					userGroupTree.handler = function(node){
						var store={
							uuid:node.options.uuid,
							name:node.options.name 
						}
						var f=me.mod.main.get('editUserView');
						var tplus2=f.getByItemId('groups_id');
						tplus2.addRecord(store);
						tplus2.update();
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
	
	var rowData;
	this.mod.defaultView = function(params){
		rowData = params.rowData || null;
		me.mod.main.open({
			id:'editUserView',
			xtype:'form',
			mode:'loop',
			beforeGoback:function(){
					var form = me.mod.main.get('editUserView');
					form.reset();
					if(clearId){
						clearTimeout(clearId);
					}
					me.mod.main.closeExpandView('changeRoleViewPresson');
					me.mod.main.closeExpandView('selectUserGroupTree');
					//me.mod.main.goback();
			},
			acts:{
				track:[
					{name:'保存',value:'保存',handler:me.submit},
					{name:'取消',value:'取消',handler:function(){
							var form = me.mod.main.get('editUserView');
							form.reset();
							if(clearId){
								clearTimeout(clearId);
							}
							me.mod.main.closeExpandView('changeRoleViewPresson');
							me.mod.main.closeExpandView('selectUserGroupTree');
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
						{xtype:'label',itemId:'loginName',textAlign:'left',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'姓名：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',itemId:'userName',name:'name',leftHidden:true,textAlign:'left',width:'max'},
						{xtype:'blank',width:150}
					]
				},
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'手机：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'mobile',itemId:'mobile',leftHidden:true,width:'max'},
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
								var form = me.mod.main.get('editUserView');
//								var createBtn = form.getByItemId('submitBtn');
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
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'部门：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',textAlign:'left',itemId:'dept_id',width:'max'},
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
											me.mod.main.showExpandView('selectUserGroupTree');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('editUserView');
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
											me.mod.main.showExpandView('changeRoleViewPresson');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('editUserView');
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
				//请求后台服务查询：
				var track = [
					{name:'用户管理'},
					{name:'全部用户'}
				];
				if(rowData){
					var obj = {name:'编辑'+rowData.name};
					track.push(obj);
					me.mod.main.reloadTrack(track);
				}
				mc.send({
					service:$sl.guserManager_allUsers_getPersonInfoDetail.service,
					method:$sl.guserManager_allUsers_getPersonInfoDetail.method,
					params:{
						uuid:rowData.uuid
					},
					success:function(response){
						var da = util.parseJson(response.responseText);
						oldGsoftGroups = da.gsoftGroups.slice(0);
						oldGsoftRoles = da.gsoftRoles.slice(0);
						//数据回填操作
						form.getByItemId('loginName').setValue(da.loginName);
						form.getByItemId('userName').setValue(da.name);
						if(rowData.bindedPerson){
							form.getByItemId('userName').setEnabled(false);
						}
						form.getByItemId('mobile').setValue(da.mobile);
						form.getByItemId('email').setValue(da.email);
						form.getByItemId('dept_id').setValue(da.depName);
						form.getByItemId('groups_id').setValue(da.gsoftGroups);
						form.getByItemId('uuids').setValue(da.gsoftRoles);
					}
					
				});
				emailYes = false;
				userYes = false;
				//回填数据
				var form = me.mod.main.get('editUserView');
				form.reset();
				form.getByItemId('authrizedId').setEnabled(false);
			}
		});
	}
	
	//提交表单
	this.submit = function(){
		var form = me.mod.main.get('editUserView');
		var data = form.serializeForm();
		if(!data.oldGsoftRoles){
			if(oldGsoftRoles.length){
				data.oldGsoftRoles = util.json2str(oldGsoftRoles);
			}else{
				data.oldGsoftRoles = '[]';
			}
		}
		if(!data.oldGsoftGroups){
			if(oldGsoftGroups.length){
				data.oldGsoftGroups = util.json2str(oldGsoftGroups);
			}else{
				data.oldGsoftGroups = '[]';
			}
		}
		if(!data.uuid){
			data.uuid = rowData.uuid;
		}
		if(rowData.bindedPerson){
			data.name = rowData.name;
		}
		form.submit({
			service:$sl.guserManager_userGroups_editorUser_modifyUser.service,
			method:$sl.guserManager_userGroups_editorUser_modifyUser.method,
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
					me.mod.main.closeExpandView('changeRoleViewPresson');
					me.mod.main.goback();
				}
			}
		})
	}
	//验证用户名是否已被使用
	this.provingUserName = function(){
		var form = me.mod.main.get('editUserView');
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
//				form.getByItemId('submitBtn').setEnabled(false);
				tipLabel.setValue('<span class="deletemail_btn" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>'+'用户名不能为空');
				return;
			}
			mc.send({
				service :$sl.guserManager_userGroups_addPerson_checkUserName.service,
				method :$sl.guserManager_userGroups_addPerson_checkUserName.method,
				params:{
					userName:userName
				},
				success:function(response){
					var d = util.parseJson(response.responseText);
					var imageStr;
					if(d.success){
						userYes = true;
						tipLabel.set('useLimit',false);
						imageStr = '<span class="checkOk_btn" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
						tipLabel.setValue(imageStr+'登录名可用');
//						if(userYes&&emailYes){
//							form.getByItemId('submitBtn').setEnabled(true);
//						}else{
//							form.getByItemId('submitBtn').setEnabled(false);
//						}
					}
					
				},
				failure:function(){
					userYes = false;
					tipLabel.set('useLimit',false);
					imageStr = '<span class="deletemail_btn" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
					tipLabel.setValue(imageStr+'登录名不可用');
//					form.getByItemId('submitBtn').setEnabled(false);
				}
			});
		},1000);
	}
})