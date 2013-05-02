new (function(){
	var me = this;
	var roleTree;
	var refreshFn;//刷新方法
	var authData=[{value:0,text:'本地认证'}];//认证方式的集合
	this.mod = new Gframe.module.RemoteModule({
		tabTitle:'新增人员',
		expandView : {
			'changeRoleViewEditPreson':{
				title : '设置关联角色',
				active:true,
				create : function(params){
					roleTree = new Treebar({serviceType:true});	
					roleTree.handler = function(node){
						var store={
							uuid:node.options.uuid,
							name:node.options.name 
						}
						var f=me.mod.main.get('editDeptView');
						var tplus=f.getByItemId('gsoftRoles');
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
			}
		}
	})
	
	var trackPath,rowData;
	var oldGsoftRoles;
	this.mod.defaultView = function(params){
		trackPath = params.trackPath || null;
		rowData = params.rowData || null;
		me.mod.main.open({
			id:'editDeptView',
			xtype:'form',
			mode:'loop',
			acts:{
				track:[
					{name:'保存',value:'保存',handler:me.saveInfo},
					{name:'取消',value:'取消',handler:function(){
						var form = me.mod.main.get('editDeptView');
						form.reset();
						me.mod.main.goback();
						me.mod.main.closeExpandView('changeRoleViewEditPreson');
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
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'部门名称：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',width:5,textAlign:'left',itemId:'deptName',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:80,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'备注：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textarea',name:'remark',itemId:'remark',enabled:false,leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'子用户：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',name:'phone',textAlign:'left',itemId:'gsoftUsers',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:50,
				    align:'left',
				    itemId:'textCol',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'设置关联角色：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'textplus',name:'gsoftRoles',width:300,selectOnly:true,itemId:'gsoftRoles',listeners:({
									'click' : function() {
											me.mod.main.showExpandView('changeRoleViewEditPreson');
										},
									afterRecalsize:function(height){
										var form = me.mod.main.get('editDeptView');
										var textCol = form.getByItemId('textCol');
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
//								var form = me.mod.main.get('editDeptView');
//								form.reset();
//								me.mod.main.popMgr.close('editDeptView');
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
				//回填数据
				if(trackPath.length>=1){
					trackPath[trackPath.length-1].name = trackPath[trackPath.length-1].name;
				}else{
					trackPath = [];
				}
                var realPath = [];
                realPath = realPath.concat(trackPath,[{name:'编辑'+rowData.name}]);
				me.mod.main.reloadTrack(realPath);
				var form = me.mod.main.get('editDeptView');
				refreshFn = params.refreshFn;
				mc.send({
					service:$sl.guserManager_allUsers_getDepartmentInfoDetail.service,
					method:$sl.guserManager_allUsers_getDepartmentInfoDetail.method,
					params:{
						uuid:rowData.uuid
					},
					success : function(response){
						var data = util.parseJson(response.responseText);
						if(data){
							oldGsoftRoles = data.gsoftRoles;
							form.getByItemId('deptName').setValue(data.name);
							form.getByItemId('remark').setValue(data.remark);
							var usersstr = '';
							data.gsoftUsers.each(function(index,col){
									usersstr+=col.name+'; '
							});
							form.getByItemId('gsoftUsers').setValue(usersstr);
							form.getByItemId('gsoftRoles').setValue(data.gsoftRoles);
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
		var form = me.mod.main.get('editDeptView');
		var data = form.serializeForm();
		if(!data.uuid){
			data.uuid = rowData.uuid;			
		}
		if(!data.oldGsoftRoles){
			data.oldGsoftRoles = util.json2str(oldGsoftRoles);
		}
		form.submit({
			service:$sl.guserManager_allUsersGrid_groupACtion_editDept.service,
			method:$sl.guserManager_allUsersGrid_groupACtion_editDept.method,
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
					me.mod.main.popMgr.close('editDeptView');
					me.mod.main.closeExpandView('changeRoleViewEditPreson');
					refreshFn();
					me.mod.main.goback();
				}
			}
		})
	}

})