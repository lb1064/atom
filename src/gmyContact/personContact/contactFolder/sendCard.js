/**
 * @author 田军
 * 发送名片
 */
new (function(){
	var me = this;
	var sysUserTree;
	this.mod = new Gframe.module.RemoteModule({
		expandView:{
			'sysUserTree':{
				title:'指定名片接收人',
					create:function(params){
						sysUserTree = new Treebar({serviceType:true});	
						sysUserTree.handler = function(node){
							if(node.options.user){
							    var form = me.mod.main.get('sendCard_id');
								var text = form.getByItemId('selectMobanKet_id');
								if(!node.options.realName){
									node.options.realName=node.options.name;
								}
								var record = {
										uuid : node.options.realId,
										type:node.options.type,
										name : node.options.realName
								};
								text.addRecord(record);
								text.update();
							}
									
						};
						return sysUserTree;
					},
					initMethod:function(params){
						mc.send({
							service:$sl.gdocCenter_personalAndOrgFolder_personAndOrgFolder_getSendCardUserSelectTree.service,
							method:$sl.gdocCenter_personalAndOrgFolder_personAndOrgFolder_getSendCardUserSelectTree.method,
							//params:{},
							success:function(response){
								mc.fireEvent(sysUserTree.get('id'),'loadData',{obj:response.responseText});
								}
						});
					}
			}
		}
		
	});
	
	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'sendCard_id',
			xtype:'form',
			title:'发送名片',
			mode:'pop',
			width:550,
			height:160,
			fields:[
//				{height:20,cols:[
//						{xtype:'blank',width:20},
//						{xtype:'label',textAlign:'left',textCls:'title_font',value:'发送名片',width:100},
//						{xtype:'blank',width:'max'}				
//				]},
//				'-',
//				{height:10,cols:[]},
				{height:36,itemId:'textCol_id',cols:[//165
					{xtype:'blank',width:20},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'接收人：',width:100},
					{xtype:'blank',width:5},
					{xtype : 'textplus',width:'max',disabled:false,name :'',itemId:'selectMobanKet_id',listeners : ({
											'click' : function() {
	//											me.mod.main.showExpandView('sysUserTree');
										
												me.mod.main.showUserPanel({leftHidden:true,fileMode:0,selectMode:3,type:2,submit:function(data){
														var form = me.mod.main.get('sendCard_id');
														var toText = form.getByItemId('selectMobanKet_id');
														data.each(function(i,d){
															var record = {
																type:d.memberType,
																name:d.name,
																uuid:d.uuid
															}
															toText.addRecord(record);
															toText.update();
														});
													}
												});
											
											
											},
											'afterRecalsize':function(height){
													var form = me.mod.main.get('sendCard_id');
													var textCol = form.getByItemId('textCol_id');
													textCol.set('height',height+10);
													form.resize();
											}
										}),
					defaultField : 'name',
					fields : ['type','uuid','name']
					},
					{xtype:'blank',width:20}					
				]}
//				,{height:36,	cols:[
//						{xtype:'blank',width:'max'},
//						{xtype:'button',itemId:'sendCard_btn',value:'确定',width:100,handler:me.sendInfoCard},
//						{xtype:'blank',width:10},
//						{xtype:'button',value:'取消',width:100,handler:function(){
//							 var form = me.mod.main.get('sendCard_id');
//							 var sendcardButton = form.getByItemId('sendCard_btn');
//							 sendcardButton.setEnabled(true);
//							 form.reset();
//							 me.mod.main.closeExpandView('sysUserTree');
//							 me.mod.main.popMgr.close('sendCard_id');							
//						}},
//						{xtype:'blank',width:'max'}
//					]
//				}
			],
			popBtn:[
			        {xtype:'button',itemId:'sendCard_btn',value:'确定',width:100,handler:me.sendInfoCard},
			        {xtype:'button',value:'取消',width:100,handler:function(){
						 var form = me.mod.main.get('sendCard_id');
//						 var sendcardButton = form.getByItemId('sendCard_btn');
//						 sendcardButton.setEnabled(true);
						 form.reset();
						 me.mod.main.closeExpandView('sysUserTree');
						 me.mod.main.popMgr.close('sendCard_id');							
					}}
			]
			
		});
	}
	
	this.sendInfoCard = function(e,btn){
		 btn.setEnabled(false);
		 var form = me.mod.main.get('sendCard_id');
		 var textto = form.getByItemId('selectMobanKet_id');
		 if(textto.getValue(true).length==0){
		 	me.mod.main.alert({
				text:'请选择收件人!',
				level:'info',
				delay:2000
			});
			btn.setEnabled(true);
			return;
		 }
		 var clipUuids = me.mod.main.clipboardMgr.getChecked();
		 var uuids = [];
		 var toUuids = [];
		 var clipuuid = [];
		 util.parseJson(textto.getValue()).each(function(index,col){
		 		var obj = {};
		 		obj.type = col.type;
		 		obj.uuid = col.uuid;
		 		toUuids.push(obj);
		 })
		 clipUuids.each(function(index,col){
		 	var obk = {
		 		uuid:col.uuid,
		 		type:col.memberType
		 	};
		 	uuids.push(obk);
		 	clipuuid.push(col.uuid);
		 });
		mc.send({
			service:$sl.gmyContact_contactFolder_contactMain_sendCard.service,
			method:$sl.gmyContact_contactFolder_contactMain_sendCard.method,
			params:{
				uuids:util.json2str(uuids),
				toUuids:util.json2str(toUuids)
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				btn.setEnabled(true);
				if(data.success){
					form.reset();
					me.mod.main.closeExpandView('sysUserTree');
					me.mod.main.popMgr.close('sendCard_id');	
					me.mod.main.clipboardMgr.remove(clipuuid);	
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
				}
			},
			failure: function(response){
				btn.setEnabled(true);
				return true;
			}
		});
	}
});
