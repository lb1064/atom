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
						var f=me.mod.main.get('addUserView');
						var tplus=f.getByItemId('uuids');
						tplus.addRecord(store);
						tplus.update()
					};
					return roleTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_userGroups_addGroups_getRoleTree.service,
						method:$sl.guserManager_userGroups_addGroups_getRoleTree.method,
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
						var f=me.mod.main.get('addUserView');
						var tplus=f.getByItemId('groups_id');
						tplus.addRecord(store);
						tplus.update()
					};
					return userGroupTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_userGroups_addGroups_getRoleTree.service,
						method:$sl.guserManager_userGroups_addGroups_getRoleTree.method,
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
			id:'addUserView',
			xtype:'form',
			mode:'loop',
			track:[
				{name:'用户管理'},
				{name:'全部'},
				{name:'新增用户'}
			],
			acts:{
				track:[
					{name:'保存',value:'保存',handler:me.submit},
					{name:'取消',value:'取消',handler:function(){
							var form = me.mod.main.get('addUserView');
							form.reset();
							if(clearId){
								clearTimeout(clearId);
							}
							form.getByItemId('tipMessage').setValue(' ');
							//me.mod.main.popMgr.close('addUserView');
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
						{xtype:'text',name:'userName',itemId:'userName',leftHidden:true,width:'max',onTextChange:me.provingUserName},
						{xtype:'blank',width:5},
						{xtype:'label',itemId:'tipMessage',textAlign:'left',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'姓名：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'name',itemId:'name',leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'手机：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',name:'phone',itemId:'phone',leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
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
								var form = me.mod.main.get('addUserView');
								var createBtn = form.getByItemId('submitBtn');
								var myreg = /^([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
								if(value != ''&&myreg.test(value)){
									emailYes = true;
								}else{
									emailYes = false;
								}
								if(emailYes&&userYes){
									createBtn.setEnabled(true);
								}else{
									createBtn.setEnabled(false);
								}
							},leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:40,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'认证方式：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'combo',data:authData,displayField:'text',displayValue:'value',width:'max',itemId:'authrizedId',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:40,
				    align:'left',
				    itemId:'textGroupCol',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加个人群组：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'uuids',width:'max',selectOnly:true,itemId:'groups_id',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('selectUserGroupTree');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('addUserView');
										var textCol = form.getByItemId('textGroupCol');
										textCol.set('height',height+10);
										form.resize();
									}
								}),defaultField:'name',fields:['uuid','name'],width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:40,
				    align:'left',
				    itemId:'textCol',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'添加个人角色：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'uuids',width:'max',selectOnly:true,itemId:'uuids',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('changeRoleViewPresson');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('addUserView');
										var textCol = form.getByItemId('textCol');
										textCol.set('height',height+10);
										form.resize();
									}
								}),defaultField:'name',fields:['uuid','name'],width:'max'},
						{xtype:'blank',width:20}
					]
				}
			],
			hiddens:[
				{name:'parentUuid',itemId:'parentUuid'},
				{name:'groupType',value:'0'}
				
			],
			initMethod:function(mod){
				emailYes = false;
				userYes = false;
				//回填数据
				var form = me.mod.main.get('addUserView');
				form.reset();
				form.getByItemId('parentUuid').setValue(params.parentUuid);
				refreshFn = params.refreshFn;
				form.getByItemId('tipMessage').setValue(' ');
				//form.getByItemId('submitBtn').setEnabled(false);
				form.getByItemId('authrizedId').setEnabled(false);
			}
		});
	}
	
	//提交表单
	this.submit = function(){
		var form = me.mod.main.get('addUserView');
		var data = form.serializeForm();
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
					//me.mod.main.popMgr.close('addUserView');
					form.getByItemId('tipMessage').setValue(' ');
					me.mod.main.closeExpandView('changeRoleViewPresson');
					refreshFn();
				}
			}
		})
	}
	//验证用户名是否已被使用
	this.provingUserName = function(){
		var form = me.mod.main.get('addUserView');
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
				form.getByItemId('submitBtn').setEnabled(false);
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
						if(userYes&&emailYes){
							form.getByItemId('submitBtn').setEnabled(true);
						}else{
							form.getByItemId('submitBtn').setEnabled(false);
						}
					}
					
				},
				failure:function(){
					userYes = false;
					tipLabel.set('useLimit',false);
					imageStr = '<span class="deletemail_btn" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
					tipLabel.setValue(imageStr+'登录名不可用');
					form.getByItemId('submitBtn').setEnabled(false);
				}
			});
		},1000);
	}
})