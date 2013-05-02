/**
 * 高级搜索
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'serchContact_id',
			xtype:'form',
			mode:'pop',
			title:'搜索',
			width:550,
			height:160,
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
						var addcaontactform = me.mod.main.get('serchContact_id');
						addcaontactform.reset();
						me.mod.main.popMgr.close('serchContact_id');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			initMethod:function(mod){
				var form = me.mod.main.get('serchContact_id');
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
		var form = me.mod.main.get('serchContact_id');
		var o = form.serializeForm();
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/serchContactResult.js',
			params:{
				data:o
			}
		});
	}

});