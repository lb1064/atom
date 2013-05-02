/**
 * 获取所有的团队
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	

	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'teamds_id',
			xtype:'grid',
			mode:'loop',
			key:'myAllTeams_key',
			checkbox:true,
			currentPage:1,
			usePage:false,
			track:[
				{name:'我的群'}
			],
			actFilter:function(data,purview){
				return purview;
			},
			acts:{//gcontact_organizationContact_getAllMyteamS
				track:[
					{name:'新建群',value:'新建群',handler:me.buildTeam}
				],
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.showPersonDetail}
				]
			},
			store:{
				service:$sl.gcontact_organizationContact_getAllMyteamS.service,
				method:$sl.gcontact_organizationContact_getAllMyteamS.method,
				params:{
					
				},
				success:function(data,mod){
			
				}
			},
			colnums:[
				{header:'名称',width:'max',cursor:'pointer',handler:me.showPersonDetailToo,mapping:'name',textAlign:'left'},
				//{header:'主题',width:'max',mapping:'subject'},
				{header:'备注',type:'tips',width:'max',mapping:'remark'}
			]
			
		});
	}
	
	
	this.showPersonDetail = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/team/teamGrid.js',
			params:{
				uuid:o.get('data').uuid,
				name:o.get('data').name,
				priv:o.get('data').privMap
			}
		})
	}
	
	this.showPersonDetailToo = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/team/teamGrid.js',
			params:{
				uuid:o.uuid,
				name:o.name,
				priv:o.privMap
			}
		})
	}
	
	this.buildTeam = function(){
		me.mod.main.open({
			id:'createNewTeam',
			xtype:'form',
			mode:'pop',
			width:600,
			height:160,
			fields:[
				{height:25,cols:[
					{xtype:'blank',width:10},
					{xtype:'label',textAlign:'left',value:'新建群',textCls:'title_font',width:100},
					{xtype:'blank',width:'max'}
				]},
				'-',
				{height:40,cols:[
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'群名称：',width:100},
						{xtype:'blank',width:5},
						{xtype:'text',top:5,textAlign:'left',leftHidden:true,name:'subject',width:'max'},
						{xtype:'blank',width:20}					
				]},
//				{height:100,cols:[
//					{xtype:'label',textAlign:'right',textCls:'title_font',value:'团队简介：',width:100},
//					{xtype:'blank',width:5},
//					{xtype:'textarea',width:'max',name:'remark'},
//					{xtype:'blank',width:20}					
//				]},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',value:'确定',width:100,handler:me.quedingAddTeam},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.main.get('createNewTeam');
						addcaontactform.reset();
						me.mod.main.popMgr.close('createNewTeam');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			hiddens:[
	
			],
			initMethod:function(mod){
				
			}
		});
	}
	
	//新建团队
	this.quedingAddTeam = function(){
		var form = me.mod.main.get('createNewTeam');
		var o  = form.serializeForm(); 
		form.submit({
			service:$sl.gcontact_organizationContact_addNewTeam.service,
			method:$sl.gcontact_organizationContact_addNewTeam.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					form.reset();
					me.mod.main.popMgr.close('createNewTeam');
					//me.refreshThisGird();
					//TODO 刷新固定导航中团队的树teamTree
					me.reloadDangqianGridFunc();
					me.mod.main.getNavigation().initMethod({type:'3'});
				}
			}
		});
	}
	
	
		
	this.reloadDangqianGridFunc = function(){
		var view = me.mod.main.getCentralView();
		if(view && view.dynamic && view.dynamic.load){
			view.dynamic.load();
		}
	}
});