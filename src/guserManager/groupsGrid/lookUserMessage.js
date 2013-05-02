new (function(){
	var me = this;
	var puuid;//人员ID
	var deptName;//部门名称
	this.mod = new Gframe.module.RemoteModule({
	})
	
	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'lookUserMessageView',
			xtype:'form',
			mode:'pop',
			width:540,
			height:336,
			fields:[
//				{
//				    height:25,
//				    align:'left',
//					cols:[
//					   	{xtype:'label',textCls:'title_font',textAlign:'left',value:'查看用户详情',width:120}
//					]
//				},
//				'-',
				{
				    height:10,
				    align:'left',
					cols:[
					   	{xtype:'blank'}
					]
				}
				,
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'登录名：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',width:5,textAlign:'left',itemId:'userName',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'部门：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',width:5,textAlign:'left',itemId:'deptName',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'手机：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',name:'phone',textAlign:'left',itemId:'phone',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'邮箱：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',name:'email',textAlign:'left',itemId:'email',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'个人角色：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',name:'ownRoleNames',textAlign:'left',itemId:'ownRoleNames',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'群组角色：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'label',name:'inheritRoleNames',textAlign:'left',itemId:'inheritRoleNames',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:5,
				    align:'left',
					cols:[
						{xtype:'blank',width:'max'}
					]
				},
				{
				    height:30,
				    align:'center',
					cols:[
						{xtype:'button',value:'查看详情',width:100,handler:me.lookMessage },
					    {xtype:'blank',width:10},
						{xtype:'button',value:'取  消',width:100,handler:function(){
								var form = me.mod.main.get('lookUserMessageView');
								form.reset();
								me.mod.main.popMgr.close('lookUserMessageView');
							}
						}
					]
				}
			],
			hiddens:[
				{name:'userUuid',itemId:'userUuid'}
			],
			initMethod:function(mod){
				//回填数据
				var form = me.mod.main.get('lookUserMessageView');
				refreshFn = params.refreshFn;
				mc.send({
					service:$sl.guserManager_userGroups_editorUser_getUserInfo.service,
					method:$sl.guserManager_userGroups_editorUser_getUserInfo.method,
					params:{
						userUuid:params.uuid
					},
					success : function(response){
						var data = util.parseJson(response.responseText);
						if(data){
							puuid = params.uuid;
							deptName = params.deptName;
							form.getByItemId('userUuid').setValue(params.uuid);
							form.getByItemId('userName').setValue(data.userName);
							form.getByItemId('deptName').setValue(params.deptName);
							form.getByItemId('phone').setValue(data.phone);
							form.getByItemId('email').setValue(data.email);
							var ownRoleNames='';
							data.ownRoleNames.each(function(i,n){
								ownRoleNames = ownRoleNames+n.name+';';
							});
							form.getByItemId('ownRoleNames').setValue(ownRoleNames);
							var inheritRoleNames= '';
							data.inheritRoleNames.each(function(i,n){
								inheritRoleNames = inheritRoleNames+n.name+';';
							});
							form.getByItemId('inheritRoleNames').setValue(inheritRoleNames);
						}
					}
				})
			}
		});
	}
	this.lookMessage = function(){
		mc.loadModule({
			url:'modules/gpersonManager/personManager/personMain.js',
			params:{
			userManager:true,
			sid:puuid,
			departmentName:deptName
			}
		}); 

	}
})