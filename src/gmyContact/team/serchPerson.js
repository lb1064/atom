/**
 * 高级搜索
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var groupUuid;
	var type,teamName,mod;
	this.mod.defaultView = function(params){
		groupUuid = params.uuid;
		type = params.type || '';
		teamName = params.teamName;
		teamUuid = groupUuid;
		mod = params.mod;
		//alert('groupUuid:'+groupUuid);
		me.mod.main.open({
			id:'serchPerson_idTeam',
			xtype:'form',
			mode:'pop',
			title:'搜索',
			width:550,
			height:140,
			fields:[
				{height:40,cols:[
					{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'搜索条件：',width:120},
					{xtype:'blank',width:5},
					{xtype:'text',top:5,textAlign:'left',itemId:'name_id',leftHidden:true,name:'key',width:'max'},
					{xtype:'blank',width:20}				
				]},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',value:'确定',width:100,handler:me.confirmSerch},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.main.get('serchPerson_idTeam');
						addcaontactform.reset();
						me.mod.main.popMgr.close('serchPerson_idTeam');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			initMethod:function(mod){
				var form = me.mod.main.get('serchPerson_idTeam');
				var name = form.getByItemId('name_id');
				name.setValue('姓名(全简拼),公司,职位,电话,邮箱,等全文搜索');
				name.onclick = function(){
					if(name.getValue()==='姓名(全简拼),公司,职位,电话,邮箱,等全文搜索'){
						name.setValue('');
					}
				}
			}
		});
	}
	
	//提交查询
	this.confirmSerch = function(){
		
		var form = me.mod.main.get('serchPerson_idTeam');
		var o = form.serializeForm();
		if(!o.groupUuid){
			o.groupUuid = groupUuid;
		}
		o.teamName = teamName;
		o.teamUuid = teamUuid;
		o.mod = mod;
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/team/serchPersonResult.js',
			params:{
				data:o
			}
		});
	}

});