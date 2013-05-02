/**
 * 生成团队
 */
new (function(){

	var me = this;
	
	var systemUserTree;
	
	this.mod = new Gframe.module.RemoteModule({
		expandView:{
			'systemUserTreeForCreate':{
				title:'请选择授权对象',
				create:function(params){
					systemUserTree = new Treebar({serviceType:true});	
					systemUserTree.handler = function(node){
							if(!node.options.realName){
								node.options.realName=node.options.name;
							}
							//var type=node.options.isGroup==true?'2':'1';
							var record = {
									loginName : node.options.name,
									name : node.options.realName,
									type : node.options.type,
									uuid:node.options.name
							}
							var form = me.mod.main.get('createTeam_id');
							var textplus = form.getByItemId('zhidingDuixiang_id');
							textplus.addRecord(record);
							textplus.update();
					}
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
	
	var members;//剪切板中的数据
	var targetFlag;//入口，个人是1，组织是2，团队是3
	this.mod.defaultView = function(params){
		members = params.members;
		targetFlag = params.targetFlag;
		me.mod.main.open({
			id:'createTeam_id',
			xtype:'form',
			mode:'pop',
			width:550,
			height:130,
			title:'生成群',
			fields:[
				{height:40,cols:[
					{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'群名称：',width:100},
					{xtype:'blank',width:5},
					{xtype:'text',top:5,textAlign:'left',itemId:'name_id',leftHidden:true,name:'teamName',width:'max'},
					{xtype:'blank',width:20}				
				]},
//				{height:40,itemId:'targetColbar_id',cols:[
//					{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'共享授权：',width:100},
//					{xtype:'blank',width:5},
//					{xtype:'radiogroup',name:'shareType',cursor:'pointer',width:220,radios:[
//							{xtype:'radio',checked:true,displayValue:'全部联系人',itemId:'everyOne',value:'1',width:110,on:{'click':me.clickEveyone}},
//							{xtype:'radio',displayValue:'选择联系人',itemId:'targetOne',value:'2',width:110,on:{'click':me.clickTarget}}
//					]},
//					{xtype:'blank',width:20},
//					{xtype : 'textplus',top:6,width:'max',itemId:'zhidingDuixiang_id',listeners : ({
//												'click' : function() {
//													me.mod.main.showExpandView('systemUserTreeForCreate');
//												},
//												'afterRecalsize':function(height){
//													var form = me.mod.main.get('createTeam_id');
//													var colbar = form.getByItemId('targetColbar_id');
//													colbar.set('height',height+10);
//													form.resize();
//												}
//											}),
//						defaultField : 'loginName',
//						fields : ['loginName','uuid']
//						},
//					{xtype:'blank',width:20}				
//				]},
				{height:40,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',value:'确定',width:100,handler:me.confirmCreate},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.main.get('createTeam_id');
						addcaontactform.reset();
						me.mod.main.closeExpandView('systemUserTreeForCreate');
						me.mod.main.popMgr.close('createTeam_id');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			initMethod:function(mod){
				//me.clickEveyone();
			}
		});
	}
	
	this.clickTarget = function(){
		var form = me.mod.main.get('createTeam_id');
		var textplus = form.getByItemId('zhidingDuixiang_id');
		var radio1 = form.getByItemId('everyOne');
		textplus.setEnabled(true);
		//me.mod.main.showExpandView('systemUserTreeForCreate');
		if(radio1.getChecked()){
			radio1.unchecked();
		}
	}
	
	//点击了所有的人
	this.clickEveyone = function(){
		var form = me.mod.main.get('createTeam_id');
		var textplus = form.getByItemId('zhidingDuixiang_id');
		var radio2 = form.getByItemId('targetOne');
		textplus.setEnabled(false);
		me.mod.main.closeExpandView('systemUserTreeForCreate');
		if(radio2.getChecked()){			
			radio2.unchecked();
		}
	}
	
	//创建团队
	this.confirmCreate = function(){
		var form = me.mod.main.get('createTeam_id');
		var o = form.serializeForm();
//		var textplus = form.getByItemId('zhidingDuixiang_id');
//		var radio2 = form.getByItemId('targetOne');
//		if(o.shareType==='2'){//指定共享对象
//			o.sharePer = textplus.getValue();
//		}else{
//			o.sharePer = '[{uuid:"",loginName:""}]';
//		};
//		if(!o.flag){
//			o.flag = targetFlag;
//		}
		var clipdata = me.mod.main.clipboardMgr.getChecked();
		var uuids = [];
		var sumitUuid = [];
		clipdata.each(function(i,n){
			var obj = {};
			obj.uuid = n.uuid;
			obj.type = n.memberType;
			sumitUuid.push(obj);
			uuids.push(n.uuid);
			
		});
		if(!o.members){		
			o.members = util.json2str(sumitUuid);
		}
	
		form.submit({
			service:$sl.gcontact_organizationContact_createTeam.service,
			method:$sl.gcontact_organizationContact_createTeam.method,
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
					me.mod.main.clipboardMgr.remove(uuids);
					me.mod.main.closeExpandView('systemUserTreeForCreate');
					me.mod.main.popMgr.close('createTeam_id');
				}
			}
		});
	}

});