/**
 * @author tianjun
 * 生成通讯录
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({
		expandView:{
			'rolesTree':{
				title:'请选择人员',
				create:function(params){
					personTree = new Treebar({});	
					personTree.handler = function(node){
								var record = {
									name:node.options.name,
									uuid:node.options.uuid
								};
								var form = me.mod.main.get('createContact_id');
								var textplus = form.getByItemId('roleText_id');
								textplus.setValue(record);
								textplus.update();
					};
					return personTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_allUsers_getSelectDeptsTree.service,
						method:$sl.guserManager_allUsers_getSelectDeptsTree.method,
						params:{
						},
						success:function(response){
							mc.fireEvent(personTree.get('id'),'loadData',{obj:response.responseText});
						}
					});
				}
			}
		}
	});
	
	var obj;
	this.mod.defaultView = function(params){
		obj = params.obj;
		me.mod.main.open({
			id:'createContact_id',
			xtype:'form',
			mode:'pop',
			width:550,
			height:310,
			title:'生成通讯录',
			fields:[
				{
				    height:36,
					cols:[
						{xtype:'label',textAlign:'right',value:'名称：',width:100},
						{xtype:'blank',width:5},
						{xtype:'text',leftHidden:true,name:'name',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
					cols:[
						{xtype:'label',textAlign:'right',value:'生成范围：',width:100},
						{xtype:'blank',width:5},
						{xtype : 'textplus',width : 'max',name:'members',itemId:'roleText_id',listeners : ({
												'click' : function() {
													me.mod.main.showExpandView('rolesTree');
												}
											}),
						defaultField : 'name',
						fields : ['uuid','name']
						},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
					cols:[
						{xtype:'label',textAlign:'right',value:'排序：',width:100},
						{xtype:'blank',width:5},
						{xtype:'text',leftHidden:true,name:'sort',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:25,
					cols:[
						{xtype:'blank',width:105},
						{xtype:'label',textAlign:'left',value:'*数字越大，越靠前',width:'max'}
					]
				},
				{
				    height:80,
					cols:[
						{xtype:'label',textAlign:'right',value:'备注：',width:100},
						{xtype:'blank',width:5},
						{xtype:'textarea',height:80,name:'remark',leftHidden:true,width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
					cols:[
						{xtype:'blank',width:'max'},
						{xtype:'button',value:'确定',width:100,handler:me.confirmEdit},
						{xtype:'blank',width:20},
						{xtype:'button',value:'取消',width:100,handler:function(){
							var form = me.mod.main.get('createContact_id');
							form.reset();
							me.mod.main.popMgr.close('createContact_id');
							me.mod.main.closeExpandView('rolesTree');
						}},
						{xtype:'blank',width:'max'}
					]
				}
			]
		});
	}
	
	this.confirmEdit = function(){
		var form = me.mod.main.get('createContact_id');
		var da = form.serializeForm();
		var text = form.getByItemId('roleText_id');
		if(!da.parentUuid){
			var puuids = util.parseJson(text.getValue());
			//console.log('puuids:',puuids);
			if(puuids.length){
				da.parentUuid = puuids[0].uuid;
			}
		}
		delete da['members'];
		form.submit({
			service:$sl.gcontact_personContact_contactFolder_createContactFromDept.service,
			method:$sl.gcontact_personContact_contactFolder_createContactFromDept.method,
			params:da,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					me.mod.main.popMgr.close('createContact_id');
					form.reset();
					me.mod.main.getNavigation().initMethod({type:'2'});
					obj.refreshGrid();
				}
			}
		});
	}

});
