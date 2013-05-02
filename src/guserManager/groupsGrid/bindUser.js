new (function(){
	var me = this;
	var data = null;//传递过来的data对象
	var presonTree = null;//人员树
	var newBindListGrid = null;//grid对象
	var refreshFn;//刷新方法
	var userUuid;//用户的UUID
	this.mod = new Gframe.module.RemoteModule({
		tabTitle:'新增人员',
		expandView : {
			'presonTreeView':{
				title : '选择绑定人员',
				active:true,
				create : function(params){
					presonTree = new Treebar({serviceType:true});	
					presonTree.handler = function(node){
						if(node.options.person){
							var store={
								uuid:node.options.uuid,
								name:node.options.name 
							}
							var f=me.mod.main.get('bindUserView');
							var tplus=f.getByItemId('uuids');
							f.getByItemId('submitBtn').setEnabled(true);
							tplus.setValue(store);
							tplus.update()
						}
						
					};

                    //todo 人员的图标先只做2种区分
                    presonTree.renderer = function (tObj) {
                        var iconType = tObj.person;
                        if (iconType) {
                            tObj.img = 'resources/tree/user/person.png';
                        } else {
                            tObj.img = 'resources/tree/user/group.png';
                        }
                        return tObj;
                    };

					return presonTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.guserManager_userGroups_bindUser_getPersonTree.service,
						method:$sl.guserManager_userGroups_bindUser_getPersonTree.method,
						params:{
						},
						success:function(response){
							mc.fireEvent(presonTree.get('id'),'loadData',{obj:response.responseText});
						}
					});
				}
			}
		}
	})
	
	
	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'bindUserView',
			xtype:'form',
			mode:'pop',
			title:'绑定人员',
			width:540,
			height:400,
			fields:[
				{
				    height:25,
				    align:'left',
					cols:[
					   	{xtype:'label',textCls:'title_font',textAlign:'left',value:'系统自动匹配绑定人员：',width:200}
					]
				},
				'-',
				{
				    height:30,
				    align:'left',
					cols:[
					    {xtype:'blank',width:5},
					    {xtype:'checkbox',name:'checkYesOrNo',itemId:'checkYesOrNo',displayValue:'以上都不是',
									on:{'click':me.changeTeam},value:true,width:120
						},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:50,
				    align:'center',
					cols:[
						{xtype:'label',textCls:'title_font',textAlign:'center',value:'请选择绑定人员：',width:130,itemId:'tipMessage'},
					    {xtype:'blank',width:5},
					    {xtype:'textplus',name:'uuids',width:300,itemId:'uuids',selectOnly:true,listeners:({
								'clearAll':function(){
									var form = me.mod.main.get('bindUserView');
									form.getByItemId('submitBtn').setEnabled(false);
								},
					    		'click' : function() {
											me.mod.main.showExpandView('presonTreeView');
										}
								}),defaultField:'name',fields:['uuid','name'],width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:50,
				    align:'center',
					cols:[
					    {xtype:'button',value:'确  定',itemId:'submitBtn',width:100,handler:me.submit },
					    {xtype:'blank',width:10},
						{xtype:'button',value:'取  消',width:100,handler:function(){
								var form = me.mod.main.get('bindUserView');
								me.mod.main.popMgr.close('bindUserView');
								form.reset();
								me.mod.main.closeExpandView('presonTreeView');
								form.getByItemId('submitBtn').setEnabled(false);
							}
						}
					]
				}
			],
			initMethod:function(mod){
				//回填数据
				var form = me.mod.main.get('bindUserView');
				refreshFn = params.refreshFn;
				data = params.data;
				userUuid = data.uuid;
				if(!newBindListGrid){
					me.showBindList(data);
				}else{
					me.refresh(data);
				}
				form.getByItemId('checkYesOrNo').setChecked(false);
				form.getByItemId('uuids').setVisible(false);
				form.getByItemId('tipMessage').setValue(''); 
				form.getByItemId('submitBtn').setEnabled(false);
				isOpenTree=false;
			}
		});
	}
	
	this.showBindList = function(){
		var mainForm = me.mod.main.get('bindUserView');
		newBindListGrid = new Gframe.controls.GridPanel({
					checked : false,
					borderHidden : true,
					colnums : [{header : '姓名',textAlign : 'left',width : 'max',mapping : 'name'},
							   {header : '电话',textAlign : 'left',width : 'max',mapping : 'mobile'},
							   {header : '邮箱',textAlign : 'left',width : 'max',mapping : 'email'}, 
							   {header : '部门',textAlign : 'left',width : 'max',mapping : 'depName'}
							   ]
					}, 
					{id : 'newCreateContaPerviwGridId',width : 'max',height : 185,border : 0}
				);
		newBindListGrid.onRowSelect = function(){
			var form = me.mod.main.get('bindUserView')
			form.getByItemId('checkYesOrNo').setChecked(false);
			me.changeTeam();
			if(newBindListGrid.isSelected()){
				form.getByItemId('submitBtn').setEnabled(true);
			}else{
				form.getByItemId('submitBtn').setEnabled(false);
			}
		}
		me.refresh(data);
		var colbar1 = new Colbar({
					cols : [],
					align : 'left'
				}, {
					width : 'max',
					height : 190
				});
		colbar1.addItem(newBindListGrid);
//		mainForm.addItem(3, colbar1);
		mainForm.addItem(2, colbar1);
		mainForm.update();
	}
	
	//刷新数据
	this.refresh = function(data){
		mc.send({
			service : $sl.guserManager_userGroups_openGroupsGrid_getAuthMatchPersonList.service,
			method : $sl.guserManager_userGroups_openGroupsGrid_getAuthMatchPersonList.method,
			params : {
				name : data.name,
				mobile : data.mobile,
				email : data.email
			},
			success : function(response) {
				var data = util.parseJson(response.responseText);
				if (data) {
					newBindListGrid.setData(data);
					mc.fireEvent(newBindListGrid.get('id'), 'load');
				}
			}
		});
	}
	
	//点击选择框
	this.changeTeam = function(){
		var f = me.mod.main.get('bindUserView');
		var b = f.getByItemId('checkYesOrNo').getChecked();
		f.getByItemId('uuids').setVisible(b);
		var d = f.getByItemId('uuids').getValue(true).length>0;
		if(b){
			newBindListGrid.clearRowSelect();
			f.getByItemId('tipMessage').setValue('请选择绑定人员：');
			if(d){
				f.getByItemId('submitBtn').setEnabled(true);		
			}else{
				f.getByItemId('submitBtn').setEnabled(false);
			}
		}else{
			f.getByItemId('submitBtn').setEnabled(false);
			f.getByItemId('tipMessage').setValue('');
		}
	}
	//提交
	this.submit = function(){
		var form = me.mod.main.get('bindUserView');
		var data = form.serializeForm();
		var per = null;
		if(form.getByItemId('checkYesOrNo').getChecked()&&form.getByItemId('uuids').getValue(true)){
			per = form.getByItemId('uuids').getValue(true)[0].uuid
		}else{
			if(newBindListGrid.getSelected()){
				per = newBindListGrid.getSelected().uuid
			}
		}
		if(!per){
			me.mod.main.alert({
					text : '匹配失败!请选择一种匹配方式',
					level : 'error',
					delay : 3000
				});
			return ;
		}
		mc.send({
			service : $sl.guserManager_userGroups_bindUser_bindPerson.service,
			method : $sl.guserManager_userGroups_bindUser_bindPerson.method,
			params : {
				userUuid:userUuid,
				personUuid:per
			},
			success : function(response){
				var d = util.parseJson(response.responseText);
				if (d.success) {
					me.mod.main.alert({
								text : d.msg,
								level : 'info',
								delay : 3000
							});
					form.reset();
					me.mod.main.popMgr.close('bindUserView');
					me.mod.main.closeExpandView('presonTreeView');
					refreshFn();
				}
			}
		})
	}
})