new (function(){
	var me = this;
	  
	this.mod = new Gframe.module.RemoteModule();
	
	this.mod.defaultView = function(params){
			var data = params.data;
			me.mod.main.open({
			id:'viewImportPeopleDetailInfo_Infoid',
			xtype:'form',
			mode:'pop',
			width:600,
			height:240,
			fields:[
				{height:30,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'left',textCls:'title_font',value:'联系人信息',width:100},
						{xtype:'blank',width:'max'}				
				]},
				{height:36,cols:[//165
					{xtype:'blank',width:20},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'姓名：',width:80},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',name:'name',width:'max'},
					{xtype:'blank',width:10},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'电话：',width:80},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',name:'phone',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[//165
					{xtype:'blank',width:20},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'E-mail：',width:80},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',name:'email',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[//165
					{xtype:'blank',width:20},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'备注：',width:80},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',name:'remark',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:50,cols:[//165
					{xtype:'blank',width:'max'},
					{xtype:'button',value:'关闭',width:100,handler:function(){
						me.mod.main.popMgr.close('viewImportPeopleDetailInfo_Infoid');
					}},	
					{xtype:'blank',width:'max'}					
				]}
			],
			initMethod:function(mod){
				var form = me.mod.main.get('viewImportPeopleDetailInfo_Infoid');
				mc.fireEvent(form.get('id'),'loadForm',{data:data});
			}
			
			});
			
	}	
});