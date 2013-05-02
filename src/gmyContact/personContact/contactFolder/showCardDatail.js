/**
 *单击名片发送人的展开，该页面会递归显示
 *@author tianjun
 *2012.6.20
 */
new (function(){
	
	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var rcvUuid;//接收到的uuid
	var rcvData;//得到的行数据
	
	var sendPerson;//发送名片的人
	var personUuid;//发送名片的人的uuid
	var groupUuid;//名片组的uuid
	this.mod.defaultView = function(params){
		//打开页面
		rcvUuid = params.uuid;
		rcvData  = params.data;
	
		sendPerson = params.sendPerson;
		personUuid = params.personUuid;
		groupUuid = params.groupUuid;
		me.openPage(params);
	}
		
	this.openPage = function(params){
		var track = [
//			{name:'我的通讯录',handler:me.openLastPage},
			{name:'我的通讯录',cursor:'false'},
			{name:'收到的名片',handler:me.openLastPageT},
			{name:'来自'+sendPerson+'的名片',handler:me.openCardDetailLastPage}
		];
		if(rcvData && rcvData.cardName){
			track.push({
				name:rcvData.cardName,
				handler:undefined
			});
		}
		me.mod.main.open({
			id:'recvCardsDetail_id'+new Date().getTime(),
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			usePage:false,
			track:track,
			actFilter:function(data,purview){
				purview['all'] = true;
				if(data.cardType==='1'){
					purview['showC'] = true;
				}else{
					purview['showC'] = false;
				}
				return purview;
			},
			store:{
				service :$sl.gmyContact_contactFolder_showCardDatail_viewCardDetailInfo.service,
				method :$sl.gmyContact_contactFolder_showCardDatail_viewCardDetailInfo.method+'$_'+rcvUuid,
				params:{
					uuid:rcvUuid
				},
				success:function(data,mod){
					
				}
			},
			colnums:[
				{header:'名称',width:100,cursor:'pointer',mapping:'cardName',handler:me.showInfoAgain},
				{header:'备注',mapping:'remark',type:'tips'}
			],
			acts:{
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.showInfo,exp:'showC'},
					{name:'拒绝',value:'拒绝',imgCls:'delete_btn',handler:me.refuseCardsClipTwo,exp:'all'},
					{name:'另存为',value:'另存为',imgCls:'reset_btn',handler:me.storeT,exp:'all'}
				],
				clip:[
					{name:'另存为',value:'另存为',handler:me.storeToOthers},
					{name:'拒绝',value:'拒绝',handler:me.refuseCardsTwo}
				]
			}
			
		});
	}
	
	this.openLastPage = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/allPersonGrid.js',//个人通讯录的我的全部联系人
			params:{
				option:{
					nodeTag:'all'
				}
			}
		});
	}
	
	//打开上一个页面
	this.openCardDetailLastPage = function(){
		var pam = {
			uuid:personUuid,
			//lastData:lastData,
			sendPerson:sendPerson,
			groupUuid:groupUuid
		};
		me.mod.defaultView(pam);
	}
	
	//打开上一个页面
	this.openLastPageT = function(){
		if(groupUuid){
			me.mod.main.remoteOpen({
				url : 'modules/gmyContact/personContact/contactFolder/recvCards.js',
				params:{
					data:{uuid:groupUuid}
				}
			});
		}
	}
	
	this.showInfoAgain = function(e,o){
		//递归查看操作
		var pam  = {uuid:o.uuid,data:o,sendPerson:sendPerson,personUuid:personUuid,groupUuid:groupUuid};
		if(o.cardType==='1'){
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/personContact/contactFolder/showCardDatail.js',
				params:pam
			});
		}
	}
	
	//点击查看
	this.showInfo = function(e,o){
		//递归查看操作
		var pam = {uuid:o.get('data').uuid,data:o.get('data'),sendPerson:sendPerson,personUuid:personUuid,groupUuid:groupUuid};
		if(o.get('data').cardType==='1'){
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/personContact/contactFolder/showCardDatail.js',
				params:pam
			});
		}
	}
	
	//另存为
	var storedUuid;
	this.storeT = function(e,o){
		storedUuid = o.get('data').uuid;
		me.mod.main.open({
			id:'storeToOtherT_id',
			xtype:'form',
			width:550,
			height:150,
			mode:'pop',
			fields:[
				{
					height:36,
					cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'添加到组：',width:100},
						{xtype:'blank',width:5},
						{xtype:'combo',itemId:'storeGroup_idrel',displayField:'text',displayValue:'value',name:'toUuid',width:'max',
//							store:{
//								service:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.service,
//								method:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.method
//							},
							onclick:me.checkGroupT
						},
						{xtype:'blank',width:20}					
					]
				},
				{
					height:36,
					cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'新建分组：',width:100,itemId:'tipLabel'},
						{xtype:'blank',width:5},
						{xtype:'text',name:'title',itemId:'title',leftHidden:true,width:'max',name:'createGroupName',itemId:'createGroupName'},
						{xtype:'blank',width:20}					
					]
				},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',itemId:'saveBtn_id',value:'确定',width:100,handler:me.storeToT},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.main.get('storeToOtherT_id');
						addcaontactform.reset();
						me.mod.main.popMgr.close('storeToOtherT_id');
					}},
					{xtype:'blank',width:'max'}	
				]}
				
			],
			initMethod:function(mod){
				var form = me.mod.main.get('storeToOtherT_id');	
				var btn = form.getByItemId('saveBtn_id');
				btn.setEnabled(true);
				var storeGroup_idrel = form.getByItemId('storeGroup_idrel');
				//刷新目标分组的数据
				form.getByItemId('tipLabel').setValue('');
				form.getByItemId('createGroupName').setVisible(false);
				mc.send({
					service:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.service,
					method:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.method,
					params:{},
					success:function(response){
						var data = util.parseJson(response.responseText);
						data.data.push({value:'0',text:'自定义'});
						storeGroup_idrel.removeData();
						mc.fireEvent(storeGroup_idrel.get('id'),'loadData',data);
					}
				})
			}
		});
	}
	
	//提交另存为
	this.storeToT = function(e,btn){
		//将确定按钮变为灰色
		var formName = 'storeToOtherT_id';
		btn.setEnabled(false);
		var form = me.mod.main.get('storeToOtherT_id');
		var o = form.serializeForm();
		var uuids = [storedUuid];
		uuids.push();
		if(form.getByItemId('createGroupName').getVisible()){
			mc.send({
				service:$sl.gmyContact_contactFolder_contactMain_quedingAddnewBuildGroup.service,
				method:$sl.gmyContact_contactFolder_contactMain_quedingAddnewBuildGroup.method,
				params:{
					name:form.getByItemId('createGroupName').getValue(),
					remark:''
				},
				success:function(response){
					var data = util.parseJson(response.responseText);
					if(data.success){
						me.submit(uuids,data.groupUuid,btn,form,formName);
					}
				}
			})
		}else{
			me.submit(uuids,o.toUuid,btn,form,formName);
		}
	},
	
	
	//批量另存为
	this.storeToOthers = function(){
		//打开页面
		me.mod.main.open({
			id:'storeToOtherAllT_id',
			xtype:'form',
			width:550,
			height:150,
			mode:'pop',
			fields:[
				{
					height:36,
					cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'添加到组：',width:100},
						{xtype:'blank',width:5},
						{xtype:'combo',itemId:'storeGroup_idrel',displayField:'text',displayValue:'value',name:'toUuid',width:'max',
//							store:{
//								service:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.service,
//								method:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.method
//							},
							onclick:me.checkGroup
						},
						{xtype:'blank',width:20}					
					]
				},
				{
					height:36,
					cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'新建分组：',width:100,itemId:'tipLabel'},
						{xtype:'blank',width:5},
						{xtype:'text',name:'title',itemId:'title',leftHidden:true,width:'max',name:'createGroupName',itemId:'createGroupName'},
						{xtype:'blank',width:20}					
					]
				},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',itemId:'saveAsBtn_id',value:'确定',width:100,handler:me.submitSaves},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.main.get('storeToOtherAllT_id');
						addcaontactform.reset();
						me.mod.main.popMgr.close('storeToOtherAllT_id');
					}},
					{xtype:'blank',width:'max'}	
				]}
				
			],
			initMethod:function(mod){
				var form = me.mod.main.get('storeToOtherAllT_id');	
				var bt = form.getByItemId('saveAsBtn_id');
				bt.setEnabled(true);
				var storeGroup_idrel = form.getByItemId('storeGroup_idrel');
				//刷新目标分组的数据
				form.getByItemId('tipLabel').setValue('');
				mc.send({
					service:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.service,
					method:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.method,
					params:{},
					success:function(response){
						var data = util.parseJson(response.responseText);
						data.data.push({value:'0',text:'自定义'});
						storeGroup_idrel.removeData();
						mc.fireEvent(storeGroup_idrel.get('id'),'loadData',data);
					}
				})
				form.getByItemId('createGroupName').setVisible(false);
			}
		});
	}
	
	this.checkGroup = function(e){
		var form = me.mod.main.get('storeToOtherAllT_id');
		if(e.getValue() == '0'){
			form.getByItemId('tipLabel').setValue('新建分组：');
			form.getByItemId('createGroupName').setVisible(true);
		}else{
			form.getByItemId('tipLabel').setValue('');
			form.getByItemId('createGroupName').setVisible(false);
		}
	}
	
	this.checkGroupT = function(e){
		var form = me.mod.main.get('storeToOtherT_id');
		if(e.getValue() == '0'){
			form.getByItemId('tipLabel').setValue('新建分组：');
			form.getByItemId('createGroupName').setVisible(true);
		}else{
			form.getByItemId('tipLabel').setValue('');
			form.getByItemId('createGroupName').setVisible(false);
		}
	}
	
	//保存批量另存为的操作
	this.submitSaves  = function(e,btn){
		var formName = 'storeToOtherAllT_id';
		btn.setEnabled(false);
		var form = me.mod.main.get('storeToOtherAllT_id');
		var o = form.serializeForm();
		var uuids = [];
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		fromuuids.each(function(i,n){
			uuids.push(n.uuid);
		});
		if(form.getByItemId('createGroupName').getVisible()){
			mc.send({
				service:$sl.gmyContact_contactFolder_contactMain_quedingAddnewBuildGroup.service,
				method:$sl.gmyContact_contactFolder_contactMain_quedingAddnewBuildGroup.method,
				params:{
					name:form.getByItemId('createGroupName').getValue(),
					remark:''
				},
				success:function(response){
					var data = util.parseJson(response.responseText);
					if(data.success){
						me.submit(uuids,data.groupUuid,btn,form,formName);
					}
				}
			})
		}else{
			me.submit(uuids,o.toUuid,btn,form,formName);
		}	
	}
	this.submit = function(uuids,toUuid,btn,form,formName){
		form.submit({
			service:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__saveCardToOtherPlace.service,
			method:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__saveCardToOtherPlace.method,
			params:{
				uuids:util.json2str(uuids),
				toUuid:toUuid
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				btn.setEnabled(true);
				if(data.success){
//					me.mod.main.alert({
//						text:data.msg,
//						level:'info',
//						delay:2000
//					});
					form.reset();
					me.mod.main.popMgr.close(formName);
					me.mod.main.clipboardMgr.remove(uuids);//清空剪切板
					me.refreshCardViewGrid();	
				}
			}
		});
	}
	//拒绝接受名片,批量操作
	this.refuseCardsTwo = function(){
		var uuids = [];
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		fromuuids.each(function(i,n){
			uuids.push(n.uuid);
		});
		me.mod.main.confirm({
			text:'确认拒绝接收此名片吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
						service:$sl.gmyContact_contactFolder_showCardDatail_refuseCardServ.service,
						method:$sl.gmyContact_contactFolder_showCardDatail_refuseCardServ.method,
						params:{
							uuids:util.json2str(uuids)
						},
						success:function(response){
							var data = util.parseJson(response.responseText);
							if(data.success){
								me.mod.main.alert({
									text:data.msg,
									level:'info',
									delay:2000
								});
								//刷新列表
								me.mod.main.clipboardMgr.remove(uuids);//清空剪切板	
								me.refreshCardViewGrid();
							}
						}
					});
				}
			}
		});
	}
	
	//拒绝接受名片,单个操作
	this.refuseCardsClipTwo = function(e,o){
		var uuids = [];
		uuids.push(o.get('data').uuid);		
		me.mod.main.confirm({
			text:'确认拒绝接收此名片吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
						service:$sl.gmyContact_contactFolder_showCardDatail_refuseCardServ.service,
						method:$sl.gmyContact_contactFolder_showCardDatail_refuseCardServ.method,
						params:{
							uuids:util.json2str(uuids)
						},
						success:function(response){
							var data = util.parseJson(response.responseText);
							if(data.success){
								me.mod.main.alert({
									text:data.msg,
									level:'info',
									delay:2000
								});
								me.mod.main.clipboardMgr.remove(uuids);//清空剪切板
								me.refreshCardViewGrid();	//刷新当前的列表
							}
						}
					});
				}
			}
		});
	}
	
	
	//刷新当前的列表
	this.refreshCardViewGrid = function(){
		var view = me.mod.main.getCentralView();
		view.dynamic.load();
	}
});
