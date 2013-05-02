new (function(){
	var me = this;
	this.mod = new Gframe.module.RemoteModule({
		tabTitle:'详情'
	})
	
	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'lookMessage',
			xtype:'form',
			mode:'pop',
			width:540,
//			height:361,
			height:300,
			fields:[
//				{
//				    height:25,
//				    align:'left',
//					cols:[
//					   	{xtype:'label',textCls:'title_font',textAlign:'left',value:'分组详情',width:70}
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
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'分组名称：',width:100},
					    {xtype:'blank',width:5},
						{xtype:'label',name:'name',itemId:'name',width:'max',textAlign:'left'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'部门角色：',width:100},
					    {xtype:'blank',width:5},
					     {xtype:'label',textAlign:'left',name:'roleNames',itemId:'roleNames',width:'max'},
						{xtype:'blank',width:20}
					]
				}
				,
				{
				    height:100,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'备注：',width:100},
						{xtype:'blank',width:5},
						{xtype:'textarea',name:'remark',itemId:'remark',width:'max',enabled:false},
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
						{xtype:'button',value:'关闭',width:100,handler:function(){
								var form = me.mod.main.get('lookMessage');
								form.reset();
								me.mod.main.popMgr.close('lookMessage');
							}
						}
					]
				}
			],
			hiddens:[
			],
			initMethod:function(mod){
				//回填数据
				var form = me.mod.main.get('lookMessage');
				mc.send({
					service : $sl.guserManager_userGroups_editorGroups_getGroupInfo.service,
					method : $sl.guserManager_userGroups_editorGroups_getGroupInfo.method,
					params:{
						groupUuid : params.uuid
					},
					success : function(response){
						var data = util.parseJson(response.responseText);
						if(data){
							form.getByItemId('name').setValue(data.name);
							form.getByItemId('remark').setValue(data.remark);
							var roleName = '';
							data.roles.each(function(i,n){
								roleName = roleName+n.name+';'
							});
							form.getByItemId('roleNames').setValue(roleName);;
						}
					}
				})
			}
		});
	}
})