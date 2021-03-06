/**
 * 编辑通讯录,新建通讯录
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var uuid;
	var lineData;
	var obj;
	var tag;
	this.mod.defaultView = function(params){
		uuid = params.uuid || '';
		lineData = params.lineData || undefined;
		obj = params.obj || undefined;
		tag = params.tag || '';
		var title;
		if(tag==='build'){
			title = '新建行政通讯录';
			uuid = '';
		}else{
			title = '重命名';
		};
		me.mod.main.open({
			id:'renameContact_id',
			xtype:'form',
			mode:'pop',
			width:550,
			height:260,
			title:title,
			fields:[
				{height:40,cols:[
					{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'名称：',width:70},
					{xtype:'blank',width:5},
					{xtype:'text',top:5,textAlign:'left',itemId:'name_id',leftHidden:true,name:'name',width:'max'},
					{xtype:'blank',width:20}				
				]},
				{height:40,cols:[
					{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'排序：',width:70},
					{xtype:'blank',width:5},
					{xtype:'text',top:5,textAlign:'left',itemId:'sort_id',leftHidden:true,name:'sort',width:'max'},
					{xtype:'blank',width:20}				
				]},
				{height:90,cols:[
					{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'备注：',width:70},
					{xtype:'blank',width:5},
					{xtype:'textarea',top:5,textAlign:'left',height:70,itemId:'remark_id',leftHidden:true,name:'remark',width:'max'},
					{xtype:'blank',width:20}				
				]},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',value:'确定',width:100,handler:me.confirmUpdate},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.main.get('renameContact_id');
						addcaontactform.reset();
						me.mod.main.popMgr.close('renameContact_id');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			initMethod:function(mod){
				var form = me.mod.main.get('renameContact_id');	
				var name = form.getByItemId('name_id');
				var sort = form.getByItemId('sort_id');
				var remark = form.getByItemId('remark_id');
				var newTitle;
				if(tag==='build'){
					newTitle = '新建行政通讯录';
				}else{
					newTitle = '重命名';
				};
				me.mod.main.popMgr.get('renameContact_id').setTitle(newTitle);
				if(lineData){
					name.setValue(lineData.name);
					sort.setValue(lineData.sort);
					remark.setValue(lineData.remark);
				}
			}
		});
	}
	
	//提交
	this.confirmUpdate = function(){
		var form = me.mod.main.get('renameContact_id');
		var o = form.serializeForm();
		if(!o.uuid){
			o.uuid = uuid;
		}
		form.submit({
			service:$sl.gcontact_organizationContact_editContact_confirmUpdate.service,
			method:$sl.gcontact_organizationContact_editContact_confirmUpdate.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					me.mod.main.popMgr.close('renameContact_id');
					form.reset();
					me.mod.main.getNavigation().initMethod({type:'2'});
					obj.refreshGrid();
				}
			}
		});
	}

});