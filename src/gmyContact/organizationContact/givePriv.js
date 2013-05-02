/**
 * 授权
 */
new (function(){
	var me = this;
	var systemUserTree;
	this.mod = new Gframe.module.RemoteModule({
		expandView:{
				'systemUserTreeForPers':{
				title:'请选择授权对象',
				create:function(params){
					systemUserTree = new Treebar({serviceType:true});	
					systemUserTree.handler = function(node){
						if(node.options.authObj){
								if(!node.options.realName){
									node.options.realName=node.options.name;
								}
								//var type=node.options.isGroup==true?'2':'1';
								var record = {
										loginName : node.options.realId,
										name : node.options.realName,
										type : node.options.type,
										uuid:node.options.realId
								}
								var form = me.mod.main.get('givePriv_id');
								var textplus = form.getByItemId('zhidingDuixiangTextId2');
								textplus.addRecord(record);
								textplus.update();
						}
					};
					return systemUserTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.gappManager_buildAppShortCut_getSystemUsers.service,
						method:$sl.gappManager_buildAppShortCut_getSystemUsers.method,
						//params:{},
						success:function(response){
							mc.fireEvent(systemUserTree.get('id'),'loadData',{obj:response.responseText});
						}
					});
				}
			}
		}
	});
	
	var lineData;//行数据
	var tag;//连续操作的标识
	this.mod.defaultView = function(params){
		lineData = params.lineData;
		var track = [
			{name:'我的通讯录',cursor:'false'},
			{name:'行政通讯录',handler:function(){
				me.mod.main.goback();
			}},
			{name:lineData.name,handler:me.openChild},
			{name:'授权'}
		];
		me.mod.main.open({
			id:'givePriv_id',
			xtype:'form',
			mode:'loop',
			track:track,
			beforeGoback:function(){
				me.mod.main.closeExpandView('systemUserTreeForPers');
			},
			acts:{
				track:[
					{value:'保存',handler:me.saveGivePersionToUser2},
					{value:'取消',handler:function(){
						var form = me.mod.main.get('givePriv_id');
						form.reset();
						me.mod.main.closeExpandView('systemUserTreeForPers');
						me.mod.main.goback();
					}}
				],
				clip:[],
				grid:[]
			},
			fields:[
				{height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'路径：',width:100},
					{xtype:'blank',width:8},
					{xtype:'label',textAlign:'left',itemId:'pathStrlabel',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{itemId:'resize_colbar',height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',top:4,textAlign:'right',textCls:'title_font',value:'授权对象：',width:100},
					{xtype:'blank',width:5},
					{xtype:'radiogroup',width:180,name:'',itemId:'everyOneGivePermissionson',cursor:'pointer',radios:[
							{displayValue:'所有对象',checked:true,value:'everyone',width:100,on:{'click':me.opentonghandlerradiogroup2}},
							{displayValue:'指定对象',value:'2',width:80,on:{'click':me.opentonghandlerradiogroup1}}
					]},
					//{xtype:'text',itemId:'zhidingDuixiangTextId2',leftHidden:true,name:'',width:250},
					{xtype : 'textplus',width : 310,selectOnly:true,name :'member',itemId:'zhidingDuixiangTextId2',listeners : ({
												'click' : function() {
													me.mod.main.showExpandView('systemUserTreeForPers');
												},
												'afterRecalsize':function(height){
													var form = me.mod.main.get('givePriv_id');
													var colbar = form.getByItemId('resize_colbar');
													colbar.set('height',height+10);
													form.update();
												}
											}),
						defaultField : 'name',
						fields : ['loginName', 'type','name','uuid']
						},
		            {xtype:'blank',width:20}
				]},
				{height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',top:4,textAlign:'right',textCls:'title_font',value:'授权操作：',width:100},
					{xtype:'blank',width:5},
					{xtype:'radiogroup',width:'max',cursor:'pointer',itemId:'privRadioGroup_id',name:'roleType',radios:[
							{displayValue:'允许',checked:true,value:'1',width:100},
							{displayValue:'拒绝',value:'2',itemId:'refuseBtn',width:80}
					]},
					{xtype:'blank',width:20}
				]},
					{height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',top:4,textAlign:'right',textCls:'title_font',value:'授予权限：',width:100},
					{xtype:'blank',width:5},
					{xtype:'checkbox',name:'roleList',textAlign:'left',itemId:'showCheckbox',value:'show',displayValue:'可见',checked:true,width:100},
					{xtype:'blank',width:'max'}
					]
				},
				{height:36,cols:[
					{xtype:'blank',width:30},
					{xtype:'label',top:4,textAlign:'left',textCls:'title_font',value:'已存在的权限列表：',width:200},
					{xtype:'blank',width:'max'}
				]}
			],
			initMethod:function(mod){
				var form = me.mod.main.get('givePriv_id');
				var pathLabel = form.getByItemId('pathStrlabel');
				pathStr = '行政通讯录/'+lineData.name;
				pathLabel.setValue(pathStr);
				me.createAddContactQuanxianGrid2();//创建权限列表
				me.opentonghandlerradiogroup();	
				//拒绝按钮变成灰色的
				var radiogoup = form.getByItemId('privRadioGroup_id');
				refuseBtn = radiogoup.getByItemId('refuseBtn');
				refuseBtn.setEnabled(false);
			}
		});	
	}
	
	this.opentonghandlerradiogroup1 = function(){
		//me.mod.main.showExpandView('systemUserTreeForPers');
		var form = me.mod.main.get('givePriv_id');
		var textForSend = form.getByItemId('zhidingDuixiangTextId2');
		textForSend.setEnabled(true);
		//拒绝按钮可以使用
		var radiogoup = form.getByItemId('privRadioGroup_id');
		refuseBtn = radiogoup.getByItemId('refuseBtn');
		refuseBtn.setEnabled(true);
	}
	
	this.opentonghandlerradiogroup2 = function(){
		//me.mod.main.showExpandView('systemUserTreeForPers');
		var form = me.mod.main.get('givePriv_id');
		var textForSend = form.getByItemId('zhidingDuixiangTextId2');
		me.mod.main.closeExpandView('systemUserTreeForPers');
		textForSend.setEnabled(false);
		//拒绝按钮变灰色
		var radiogoup = form.getByItemId('privRadioGroup_id');
		refuseBtn = radiogoup.getByItemId('refuseBtn');
		refuseBtn.setEnabled(false);
	}
	
	var addnewQuanxiangrid2;
	this.createAddContactQuanxianGrid2 = function(){//右侧区域的授权权限列表
		var form = me.mod.main.get('givePriv_id');
		addnewQuanxiangrid2 = new Gframe.controls.GridPanel({
			checkbox:false,
			borderHidden:true,
			colnums:[//path
				{header:'',width:25,textAlign:'left'},
				{header:'授权对象',width:150,textAlign:'left',mapping:'showName'},
				{header:'授权',width:100,textAlign:'left',renderer:me.getShouquanAtRender22,mapping:'roleType'},
				{header:'路径',width:'max',textAlign:'left',mapping:'showPath'},
				{header:'权限',width:'max',textAlign:'left',renderer:me.changeRoleTYpeNow,mapping:'roles'},
				{
				header:'操作',
						type:'act',
						mapping:'allowDel',
						renderer:me.createbts2
				}
			]			
		},{id:'newCreateContaPerviwGridId2',width:'max',height:350,border:0});	
		mc.send({
			service:$sl.gcontact_organizationContact_getPrivList.service,
			method:$sl.gcontact_organizationContact_getPrivList.method,
			params:{
				uuid:lineData.uuid
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data){
						addnewQuanxiangrid2.setData(data);
						mc.fireEvent(addnewQuanxiangrid2.get('id'),'load');
				}
			}
		});
		var colbar1 = new Colbar({cols:[],align:'left'},{width:'max',height:350});
		colbar1.addItem(addnewQuanxiangrid2);
		form.addItem(10,colbar1);
		form.update();
	
	}
	
	this.opentonghandlerradiogroup = function(){
		//关闭左侧，同时输入框变灰色
		me.mod.main.closeExpandView('systemUserTreeForPers');
		var form = me.mod.main.get('givePriv_id');
		var textForSend = form.getByItemId('zhidingDuixiangTextId2');
		textForSend.setEnabled(false);
		textForSend.removeData();
		//members = [];
		
	}
	
	this.getShouquanAtRender22 = function(v,record,o){
		record.set('useLimit',false);
		if(v == '1'){
			return '允许';
		}
		if(v == '2'){
			return '拒绝';
		}
		return v;
	}
	
	this.changeRoleTYpeNow = function(v,record,o){
//		var str = util.parseJson(v);
		var str = '';
		if(v && v.contain('show'))str+='可见 ';
		return str;
	}
	
	this.createbts2 = function(v,record,o){
		if(o.allowDel == true){
			return [
				{name:'删除',imgCls:'delete_btn',handler:function(){
					me.mod.main.confirm({
					text:'确定删除该权限吗？',
					handler:function(confirm){
						if(confirm){
							mc.send({
							service:$sl.gcontact_organizationContact_deletePriv.service,
							method:$sl.gcontact_organizationContact_deletePriv.method,
							params:{
								nodeUuid:lineData.uuid,
								loginName:o.loginName,
								roleType:o.roleType,
								type:o.type
							},
							success:function(response){
								var data = util.parseJson(response.responseText);
								if(data.success){
									me.mod.main.alert({
										text:data.msg,
										level:'info',
										delay:2000
									});
									me.reloadContactPersionGrid2();
								}
							}
							});
						}
					}
				});
				},value:'删除'}
			]
		}
	}
	
	this.saveGivePersionToUser2 = function(){//保存授权操作
		var form = me.mod.main.get('givePriv_id');
		var o = form.serializeForm();
		var	alltext = form.getByItemId('everyOneGivePermissionson');
		var t = form.getByItemId('zhidingDuixiangTextId2');
		var cbx = form.getByItemId('showCheckbox');
		if(!cbx.getChecked()){
			me.mod.main.alert({
				text:'权限不能够为空！',
				level:'error',
				delay:3000
			});
			return ;
		}else{
			o.roleList = '[{show:"true"}]';
		};
		if(alltext.getValue() == 'everyone'){
			o.member = '[{loginName:"everyone",type:"0"}]';
		}else{
			if(o.member){
				var member = '';
				var members = util.parseJson(o.member);
				members.each(function(i,n){
					//member+='{loginName:"'+n.loginName+'",type:"'+n.type+'"'+',uuid:"'+n.uuid+'"},';
					member+='{loginName:"'+n.loginName+'",type:"'+n.type+'"},';
				});
				member = member.substring(o,member.length-1);
				member = '['+member+']';
				o.member = member;
			}
		}
		form.submit({
			service:$sl.gcontact_organizationContact_addPrivew.service,
			method:$sl.gcontact_organizationContact_addPrivew.method,
			params:{
				uuid:lineData.uuid,
				member:o.member,
				roleType:o.roleType,
				roleList:o.roleList
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					})
					form.reset();
					t.setEnabled(false);
					//刷新当前的通讯录下面的权限列表
					me.reloadContactPersionGrid2();
					//关闭左侧面板
					me.mod.main.closeExpandView('systemUserTreeForPers');
					//是否有联动的操作
					if(tag==='auto'){
						me.mod.main.remoteOpen({
				 			url:'modules/gappManager/buildAppShortCut.js',
				 			params:{
				 				sendPath:sendPath,
				 				mod:mod,
				 				tag:tag,
				 				lineData:lineData
				 			}
						});
					}
				}
			
			}
		});
	}
	
	//路径上面的打开通讯录
	this.openChild = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/groupAndPersonGrid.js',
			params:{
				uuid:lineData.uuid
			}
		});
	
	}
	
	
	this.reloadContactPersionGrid2 = function(){
		mc.send({
			service:$sl.gcontact_organizationContact_getPrivList.service,
			method:$sl.gcontact_organizationContact_getPrivList.method,
			params:{
				uuid:lineData.uuid
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data){
						addnewQuanxiangrid2.setData(data);
						mc.fireEvent(addnewQuanxiangrid2.get('id'),'load');
				}
			}
		});
		
	}
	
});