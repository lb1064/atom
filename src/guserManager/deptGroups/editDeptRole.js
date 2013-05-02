/**
 * @author tianjun
 * 编辑部门角色
 */
new (function(){

	var me = this;
	
	var personTree;
	this.mod = new Gframe.module.RemoteModule({
		expandView:{
			'rolesTree':{
				title:'请选择角色',
				create:function(params){
					personTree = new Treebar({});	
					personTree.handler = function(node){
								var record = {
									name:node.options.name,
									uuid:node.options.uuid
								};
								var form = me.mod.main.get('editDeptRole_id');
								var textplus = form.getByItemId('roleText_id');
								textplus.addRecord(record);
								textplus.update();
					};
					return personTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_userGroups_addGroups_getRoleTree.service,
						method:$sl.guserManager_userGroups_addGroups_getRoleTree.method,
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
	
	var rowData;
	this.mod.defaultView=function(params){
		rowData = params.rowData || null;
		me.mod.main.open({
			id:'editDeptRole_id',
			xtype:'form',
			mode:'pop',
			title:'编辑角色',
			width:550,
			height:120,
			fields:[
				{
				    height:36,
					cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'right',value:'编辑角色：',width:120},
						{xtype:'blank',width:5},
						{xtype : 'textplus',width : 'max',name :'members',itemId:'roleText_id',listeners : ({
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
						{xtype:'blank',width:'max'},
						{xtype:'button',value:'确定',width:100,handler:me.confirmEdit},
						{xtype:'blank',width:20},
						{xtype:'button',value:'取消',width:100,handler:function(){
							var form = me.mod.main.get('editDeptRole_id');
							form.reset();
							me.mod.main.popMgr.close('editDeptRole_id');
							me.mod.main.closeExpandView('rolesTree');
						}},
						{xtype:'blank',width:'max'}
					]
				}
			]
		
		});
	
	}
	
	this.confirmEdit = function(){
		var form = me.mod.main.get('editDeptRole_id');
		
	}

});
