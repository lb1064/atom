/**
 *我的名片的展开
 *@author tianjun
 *2012.6.20
 */
new (function(){
	
	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var recvData;
	var groupUuid;
	this.mod.defaultView = function(params){
		recvData = params.data;
		me.mod.main.open({
			id:'recvCards_id',
			xtype:'grid',
			mode:'loop',
			key:'receivecards_id',
			checkbox:true,
			usePage:false,
			track:[
//				{name:'我的通讯录',handler:me.openLastPage},
				{name:'我的通讯录',cursor:'false'},
				{name:'收到的名片'}
			],
			store:{
				service :$sl.gmyContact_contactFolder_contactFolder_recvCards__defaultView.service,
				method :$sl.gmyContact_contactFolder_contactFolder_recvCards__defaultView.method,
				params:{
					uuid:recvData.uuid
				},
				success:function(data,mod){
					
				}
			},
			colnums:[
				{header:'发送人',width:90,cursor:'pointer',mapping:'sendPerson',handler:me.showCardsByPersonTwo},
				{header:'发送时间',width:'max',mapping:'sendTime'},
				{header:'备注',mapping:'remark',type:'tips'}
			],
			acts:{
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.showCardsByPerson},
					{name:'拒绝',value:'拒绝',imgCls:'delete_btn',handler:me.refuseCards},
					{name:'另存为',value:'另存为',imgCls:'reset_btn',handler:me.storeToOther}
				],
				clip:[
					{name:'另存为',value:'另存为',handler:me.storeToOthers},
					{name:'拒绝',value:'拒绝',handler:me.refuseCardsClip}
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
	
	//根据人去查询该人发送给我的所有的card
	this.showCardsByPerson = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/contactFolder/showCardDatail.js',
			params:{
				//lastData:recvData,
				sendPerson:o.get('data').sendPerson,//发送人的名字
				personUuid:o.get('data').uuid,//人的uuid
				groupUuid:recvData.uuid,//组的uuid
				data:o.get('data'),//行数据
				uuid:o.get('data').uuid
			}
		});
	}
	
	//根据名片的发送人无查看这个人发送给我的具体的名片
	this.showCardsByPersonTwo = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/contactFolder/showCardDatail.js',
			params:{
				//lastData:recvData,
				sendPerson:o.sendPerson,//发送人的名字
				groupUuid:recvData.uuid,//组的uuid
				personUuid:o.uuid,
				data:o,
				uuid:o.uuid//发送人的uuid
			}
		});
	}
	
	//另存为
	var storedUuid;
	this.storeToOther = function(e,o){
		storedUuid = o.get('data').uuid;
		me.mod.main.open({
			id:'storeToOther_id',
			xtype:'form',
			width:550,
			height:120,
			mode:'pop',
			fields:[
				{
					height:36,
					cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'添加到组：',width:100},
						{xtype:'blank',width:5},
						{xtype:'combo',itemId:'storeGroup_idrel',displayField:'text',displayValue:'value',name:'toUuid',width:'max',
							store:{
								service:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.service,
								method:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.method
							}
						},
						{xtype:'blank',width:20}					
					]
				},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',itemId:'storeToBtn_id',value:'确定',width:100,handler:me.storeTo},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.main.get('storeToOther_id');
					
						addcaontactform.reset();
						me.mod.main.popMgr.close('storeToOther_id');
					}},
					{xtype:'blank',width:'max'}	
				]}
				
			],
			initMethod:function(mod){
				var form = me.mod.main.get('storeToOther_id');	
				var storeGroup_idrel = form.getByItemId('storeGroup_idrel');
				//刷新目标分组的数据
				var btn = form.getByItemId('storeToBtn_id');
				btn.setEnabled(true);
				mc.fireEvent(storeGroup_idrel.get('id'),'reload',{});
			}
		});
	}
	
	//提交另存为
	this.storeTo = function(e,btn){
		btn.setEnabled(false);
		var form = me.mod.main.get('storeToOther_id');
		var o = form.serializeForm();
	
		var uuids = [storedUuid];
		uuids.push();
		form.submit({
			service:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__saveCardToOtherPlace.service,
			method:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__saveCardToOtherPlace.method,
			params:{
				uuids:util.json2str(uuids),
				toUuid:o.toUuid
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				btn.setEnabled(true);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					form.reset();
					me.mod.main.popMgr.close('storeToOther_id');
					//刷新列表
					me.refreshCardGrid();
				}
			}
		});
	},
	
	//批量另存为
	this.storeToOthers = function(){
		//打开页面
		me.mod.main.open({
			id:'storeToOtherAll_id',
			xtype:'form',
			width:550,
			height:120,
			mode:'pop',
			fields:[
				{
					height:36,
					cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'添加到组：',width:100},
						{xtype:'blank',width:5},
						{xtype:'combo',itemId:'storeGroup_idrel',displayField:'text',displayValue:'value',name:'toUuid',width:'max',
							store:{
								service:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.service,
								method:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.method
							}
						},
						{xtype:'blank',width:20}					
					]
				},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',itemId:'save_id',value:'确定',width:100,handler:me.submitSaves},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.main.get('storeToOtherAll_id');
						addcaontactform.reset();
						me.mod.main.popMgr.close('storeToOtherAll_id');
					}},
					{xtype:'blank',width:'max'}	
				]}
				
			],
			initMethod:function(mod){
				var form = me.mod.main.get('storeToOtherAll_id');	
				var storeGroup_idrel = form.getByItemId('storeGroup_idrel');
				var btn = form.getByItemId('save_id');
				btn.setEnabled(true);
				//刷新目标分组的数据
				mc.fireEvent(storeGroup_idrel.get('id'),'reload',{});
			}
		});
	}
	
	//保存批量另存为的操作
	this.submitSaves  = function(e,btn){
		btn.setEnabled(false);
		var form = me.mod.main.get('storeToOtherAll_id');
		var o = form.serializeForm();
		var uuids = [];
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		fromuuids.each(function(i,n){
			uuids.push(n.uuid);
		});
		form.submit({
			service:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__saveCardToOtherPlace.service,
			method:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__saveCardToOtherPlace.method,
			params:{
				uuids:util.json2str(uuids),
				toUuid:o.toUuid
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				btn.setEnabled(true);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					form.reset();
					me.mod.main.popMgr.close('storeToOtherAll_id');
					me.mod.main.clipboardMgr.remove(uuids);//清空剪切板	
				}
			}
		});
	}
	
	//拒绝接受名片,批量操作
	this.refuseCardsClip = function(){
		var uuids = [];
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		fromuuids.each(function(i,n){
			uuids.push(n.uuid);
		});
		me.mod.main.confirm({
			text:'是否确定拒收所选名片？',
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
								me.refreshCardGrid();
							}
						}
					});
				}
			}
		});
	}
	
	//拒绝接受名片,单个操作
	this.refuseCards= function(e,o){
		var uuids = [];
		uuids.push(o.get('data').uuid);		
		me.mod.main.confirm({
			text:'是否确定拒收所选名片？',
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
								me.refreshCardGrid();	//刷新当前的列表
							}
						}
					});
				}
			}
		});
	}
	
	//刷新当前的列表
	this.refreshCardGrid = function(){
		var view = me.mod.main.getCentralView();
		view.dynamic.load();
	}
	
})
