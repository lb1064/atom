/*
 * 	‘我的通讯录’中‘我的联系人’的查看操作
 * */
new (function(){
	var me = this;
	var personalSendInfoTree;
	this.mod = new Gframe.module.RemoteModule({
		expandView:{
				'sendInfoCardTreeInPersonalInOrgConatct':{
				title:'请选择名片接收人',
				create:function(params){
					personalSendInfoTree = new Treebar({serviceType:true});
						personalSendInfoTree.handler = function(node){
						if(node.options.xtype == 'contact'){
							if(!sendToTempforCard.contain(node.options.uuid)){							
							var sendInfoCardFormNew = me.mod.main.get('sendPersonDetailInfoCardId_inViewOrgContact');//发送名片
							var sendNameText = sendInfoCardFormNew.getByItemId('recevierItemId_InOrgContactItm');
							sendNameText.setValue(sendNameText.getValue()+node.options.name+';');
							var object = {
								uuid:node.options.uuid,
								dn:node.options.id,
								type:'1'//目前只考虑个人
							}
							uuidsForSend.push(object);
							sendToTempforCard.push(node.options.uuid);
							}else{
							}
						}	
					}
					return personalSendInfoTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.gcontactNewT_contactTonXun_gcontactTonXun_getAllUsers.service,
						method:$sl.gcontactNewT_contactTonXun_gcontactTonXun_getAllUsers.method,
						//params:{},
						success:function(response){
								mc.fireEvent(personalSendInfoTree.get('id'),'loadData',{obj:response.responseText});
						}
					});
				}
			}
	}
	});
	var oldparentContactName;
	var persContactName ;
	var uuid;  
	var parentObject;//我的通讯录
	var sendToTempforCard = [];
	var uuidsForSend = [];
	this.mod.defaultView = function(params){
		parentObject = params.parent,
		oldparentContactName = params.oldparentContactName;//'我的通讯录'
		persContactName = params.persContactName;//'我的联系人'
		uuid = params.uuid;
		me.reloadMyrelateBookGrid();
	}
	var sendBookPath;
	this.reloadMyrelateBookGrid = function(){//我的联系人主列表
		sendBookPath = '[{name:"mybook",value:""}]';
		me.mod.main.open({
			id:'viewPersonalOrgContactDetailpersonalInfoGridId11',
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			usePage:true,
			currentPage:1,
			track:[
				{name:'通讯录管理'},
				{name:oldparentContactName,handler:parentObject.reopenMyRelateTonBook},//'我的通讯录'
				{name:persContactName,handler:function(){}}	//我的联系人
			],
			actFilter:function(data,purview){
				purview['all'] = true;	
				if(data.name == '我的联系人')purview.impower = false;	
				return purview;
			},
			acts:{
				track:[
					{value:'新建联系人' ,handler:me.builNewPersonContact,exp:'impower'}
					//{value:'导入联系人' ,handler:me.daoruRelateMan,exp:'impower'}
				],
				clip:[
					{value:'发送名片' ,handler:me.sendPersonalCard,exp:'all'},
					{value:'删除' ,handler:me.delGroupAndPeople,exp:'all'},
					{value:'复制到此' ,handler:me.copycontactToHereNow,exp:'all'},
					{value:'移动到此' ,handler:me.movecontactToHereNow,exp:'all'}			
				],
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.viewpersonalDetailInfo,exp:'impower'},
					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editPerosnDetailInfo,exp:'impower'}
				]
			},
			store:{
				service : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.service,
				method : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.method+'$_'+uuid,
				params:{
					uuid:uuid, //我的联系人分组的uuid
					path:sendBookPath
				},
				success:function(data,mod){
				}
			},
			colnums:[
					{header:'名称(组)',textAlign:'left',cursor:'pointer',width:'max',renderer:me.changeSchelType,handler:me.viewPernalTonDetaiInfoAtCol,mapping:'name'},
					{header:'电话(手机)',textAlign:'left',width:150,mapping:'phone'},
					{header:'邮箱',width:220,mapping:'email'},	
					{header:'备注',mapping:'remark',type:'tips'}
				],
			initMethod:function(mod){

			}
		});
	} 
	
	this.viewPernalTonDetaiInfoAtCol = function(e,o){//列表上得单击事件，相当于查看
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/personTonXun/viewPersonalDetaiInfo.js',
				params:{
					parent:me,
					oldPanrentObject:parentObject,//传递我的通讯录
					oldparentContactName:oldparentContactName,//'我的通讯录'
					persContactName:persContactName,//'我的联系人'
					lastPersContactName:o.name,
					parentUuid:uuid,//我的联系人的uuid
					uuid:o.uuid
				}
			});
		
	}
	
	this.movecontactToHereNow = function(){//移动到此
		var fromUuids = [];
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		var clearuuids = [];
		fromuuids.each(function(i,n){
			//if(n.type=='1'){//考虑到后台是不是有booktype
				var obj = {
				uuid:n.uuid,
				type:n.type
				};
			fromUuids.push(obj);
			clearuuids.push(n.uuid);
			//}
		});
		var uuidForsend = '';
		if(fromUuids.length){
			fromUuids.each(function(i,n){
			uuidForsend+='{uuid:"'+n.uuid+'",type:"'+n.type+'"},';
			})
			uuidForsend = uuidForsend.substring(0,uuidForsend.length-1);
			uuidForsend = '['+uuidForsend+']';
		}
	
		if(fromUuids.length){
			me.mod.main.confirm({
			text:'确定移动到此吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
					service:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.service,
					method:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.method,
					params:{
						uuids:uuidForsend,
						toUuid:uuid//我的通讯录的uuid
					},
					success:function(response){
						var data = util.parseJson(response.responseText);
						if(data.checkResult == '1'){
							mc.send({
								service:$sl.gcontact_personTonXun_persongerenTonxunLu_movecontactToHereNow.service,
								method:$sl.gcontact_personTonXun_persongerenTonxunLu_movecontactToHereNow.method,
								params:{
									flag:'mybook',//操作标示
									uuids:uuidForsend,
									toUuid:uuid//我的通讯录的uuid
								},
								success:function(response){
									var dataa = util.parseJson(response.responseText);
									if(dataa.success){
										me.mod.main.alert({
											text:dataa.msg,
											level:'info',
											delay:2000
										});
									me.mod.main.clipboardMgr.remove(clearuuids);//清空剪切板
									me.reloadMyrelateManmainGrid();
									}
								}
							});
						}
						
							if(data.checkResult == '2'){//后台返回的校验结果是2，就给客户一个提示
							me.mod.main.confirm({
								text:data.msg+'，确定继续移动吗？',
								handler:function(confirm){
									if(confirm){
										mc.send({
											service:$sl.gcontact_personTonXun_persongerenTonxunLu_movecontactToHereNow.service,
											method:$sl.gcontact_personTonXun_persongerenTonxunLu_movecontactToHereNow.method,
											params:{
												flag:'mybook',//操作标示
												uuids:uuidForsend,
												toUuid:uuid//我的通讯录的uuid
											},
											success:function(response){
												var datab = util.parseJson(response.responseText);
												if(datab.success){
													me.mod.main.alert({
														text:datab.msg,
														level:'info',
														delay:2000
													});
												me.mod.main.clipboardMgr.remove(clearuuids);//清空剪切板
												}
												me.reloadMyrelateManmainGrid();
											}
										});
									}
								}
							});
						}
						
						if(data.checkResult!='1' && data.checkResult!='2'){//
								me.mod.main.alert({
											text:data.msg,
											level:'error',
											delay:2000
											});
						}
						
						
						
						
						}
					});
				
				}
			}
		});
	}else{
			me.mod.main.alert({
					text:'没有选中正确的数据',
					level:'error',
					delay:'2000'
				});
	}
		
		
	}
	
	this.copycontactToHereNow = function(){//复制到此,这个逻辑是有问题的，如果们只有个人
		var fromUuids = [];
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		var clearuuids = [];
		fromuuids.each(function(i,n){
			//if(n.type == '1'){
				var obj = {
					uuid:n.uuid,
					type:n.type
				};
				fromUuids.push(obj);
			//}
			clearuuids.push(n.uuid);
		});
		var uuidForsend = '';
		fromUuids.each(function(i,n){
			uuidForsend+='{uuid:"'+n.uuid+'",type:"'+n.type+'"},';
		})
		uuidForsend = uuidForsend.substring(0,uuidForsend.length-1);
		uuidForsend = '['+uuidForsend+']';
		if(fromUuids.length){
			me.mod.main.confirm({
			text:'确定复制到此吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
						service:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.service,
						method:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.method,
						params:{
							uuids:uuidForsend,
							toUuid:uuid//我的通讯录的uuid
						},
						success:function(response){
							var data = eval('['+response.responseText+']');
							data = data[0];
							
							if(data.checkResult == '1'){
								mc.send({
									service:$sl.gcontact_personTonXun_persongerenTonxunLu_copycontactToHereNow.service,
									method:$sl.gcontact_personTonXun_persongerenTonxunLu_copycontactToHereNow.method,
									params:{
										flag:'mybook',
										uuids:uuidForsend,
										toUuid:uuid//父节点的uuid
									},
									success:function(response){
										var datas = util.parseJson(response.responseText);
										if(datas.success){
											me.mod.main.alert({
												text:datas.msg,
												level:'info',
												delay:2000
										});
										me.mod.main.clipboardMgr.remove(clearuuids);//清空剪切板
										}
										me.reloadMyrelateManmainGrid();
									}
								});
							}else if(data.checkResult == '2'){
								me.mod.main.confirm({
									text:data.msg+'，确定继续复制吗？',
									handler:function(confirm){
										if(confirm){
											mc.send({
												service:$sl.gcontact_personTonXun_persongerenTonxunLu_copycontactToHereNow.service,
												method:$sl.gcontact_personTonXun_persongerenTonxunLu_copycontactToHereNow.method,
												params:{
													flag:'mybook',//操作标示
													uuids:uuidForsend,
													toUuid:uuid//父节点的uuid
												},
												success:function(response){
													var datar = util.parseJson(response.responseText);
													if(datar.success){
														me.mod.main.alert({
															text:datar.msg,
															level:'info',
															delay:2000
														});
													me.mod.main.clipboardMgr.remove(clearuuids);//清空剪切板
													}
													me.reloadMyrelateManmainGrid();
												}
											});
										}
									}
								});
							}else if(data.checkResult == '3'){
								me.mod.main.alert({
											text:data.msg,
											level:'error',
											delay:2000
											});
							}else if(data.checkResult == '4'){
								me.mod.main.alert({
											text:data.msg,
											level:'error',
											delay:2000
											});
						}
							
						}
					});
				}

			}
		});
		
		}else{
				me.mod.main.alert({
									text:'没有选中正确的数据',
									level:'error',
									delay:2000
									});
		}
		
		
	}
	
	this.delGroupAndPeople = function(){//删除组和人
		var fromUuids = [];
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		var clearuuids = [];
		fromuuids.each(function(i,n){
			var obj = {
				uuid:n.uuid,
				type:n.type
			};
			fromUuids.push(obj);
			clearuuids.push(n.uuid);
		});
		var uuidForsend = '';
		fromuuids.each(function(i,n){
			uuidForsend+='{uuid:"'+n.uuid+'",type:"'+n.type+'"},';
		});
		uuidForsend = uuidForsend.substring(0,uuidForsend.length-1);
		uuidForsend = '['+uuidForsend+']';
		me.mod.main.confirm({
			text:'确定删除吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
					service:$sl.gcontact_personTonXun_viewOrgContactDetailInfo_delINlkMan.service,
					method:$sl.gcontact_personTonXun_viewOrgContactDetailInfo_delINlkMan.method,
					params:{
						uuids:uuidForsend
					},
					success:function(response){
						var data = util.parseJson(response.responseText);
						if(data.success){
							me.mod.main.alert({
								text:data.msg,
								level:'info',
								delay:2000
							});
						me.mod.main.clipboardMgr.remove(clearuuids);//清空剪切板	
						me.reloadMyrelateManmainGrid();
						}

						}
					});
				}

			}
									
		});
	}
	
	this.daoruRelateMan = function(){//导入联系人 
		me.mod.main.open({
			id:'importmyNewcontacGroupIdId2',
			xtype:'form',
			mode:'pop',
			width:600,
			height:190,
			fields:[
				{height:25,cols:[
					{xtype:'blank',width:10},
					{xtype:'label',textAlign:'left',value:'导入联系人',textCls:'title_font',width:80},
					{xtype:'blank',width:'max'}
				]},
				'-',
				{height:36,cols:[
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'分组名称：',width:100},
						{xtype:'blank',width:5},
						{xtype:'label',textAlign:'left',top:6,itemId:'needImportRalConId',itemId:'importFromFileRelateMan_itemid',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{height:36,cols:[
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'选择导入：',width:100},
					{xtype:'blank',width:5},
					{xtype:'file',width:'max',name:'uuid',label:'浏览'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',value:'确定',width:100,handler:me.quedingDaoruReladManOk},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.main.get('importmyNewcontacGroupIdId2');
						addcaontactform.reset();
						var needImportRalConId = addcaontactform.getByItemId('importFromFileRelateMan_itemid');
						needImportRalConId.setValue('');
						me.mod.main.popMgr.close('importmyNewcontacGroupIdId2');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			hiddens:[
				{name:'nodeUuid',itemId:'importWenjiannodeDeuuid22'}
			],
			initMethod:function(mod){
				//importFromFileRelateMan_itemid
				var form = me.mod.main.get('importmyNewcontacGroupIdId2');
				var importFromFileRelateMan_itemid = form.getByItemId('importFromFileRelateMan_itemid');
				importFromFileRelateMan_itemid.setValue(persContactName);
			}
		})
	
	}
	
	this.quedingDaoruReladManOk = function(){
		var form = me.mod.main.get('importmyNewcontacGroupIdId2');
		var nodeUuid = form.getByItemId('importWenjiannodeDeuuid22');
		if(uuid){
			nodeUuid.setValue(uuid);
		}
		var o = form.serializeForm();
		form.submit({
			service:$sl.gcontact_personTonXun_persongerenTonxunLu_queimportMy22333Contact.service,
			method:$sl.gcontact_personTonXun_persongerenTonxunLu_queimportMy22333Contact.method,
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
					var needImportRalConId = form.getByItemId('needImportRalConId');
					needImportRalConId.setValue('');
					me.mod.main.popMgr.close('importmyNewcontacGroupIdId2');
					me.reloadMyrelateManmainGrid();
				}
			}
		});
	}
	
	this.sendPersonalCard = function(){//发送名片
		me.mod.main.open({
			id:'sendPersonDetailInfoCardId_inViewOrgContact',
			xtype:'form',
			mode:'pop',
			width:600,
			height:165,
			fields:[
				{height:20,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'left',textCls:'title_font',value:'发送名片',width:100},
						{xtype:'blank',width:'max'}				
				]},
				'-',
				{height:10,cols:[]},
				{height:36,cols:[//165
					{xtype:'blank',width:20},
					{xtype:'label',textAlign:'left',textCls:'title_font',value:'接收人：',width:100},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',itemId:'recevierItemId_InOrgContactItm',onclick:me.openTonxunLuIn_Org,leftHidden:true,width:'max'},
					{xtype:'button',imgCls:'clear30_btn',width:30,height:30,title:'清空',
									handler:function(){
									sendToTempforCard = [];
									uuidsForSend = [];
									me.mod.main.get('sendPersonDetailInfoCardId_inViewOrgContact').getByItemId('recevierItemId_InOrgContactItm').setValue('');
													
		                }},
					{xtype:'blank',width:20}					
				]},
				{height:36,	cols:[
						{xtype:'blank',width:'max'},
						{xtype:'button',value:'确定',width:100,handler:me.sendInINfoCardNowInOrgContact},
						{xtype:'blank',width:10},
						{xtype:'button',value:'取消',width:100,handler:function(){
							 var form = me.mod.main.get('sendPersonDetailInfoCardId_inViewOrgContact');
							 form.reset();
							 sendToTempforCard = [];
							 uuidsForSend = [];
							 me.mod.main.closeExpandView('sendInfoCardTreeInPersonalInOrgConatct');
							 me.mod.main.popMgr.close('sendPersonDetailInfoCardId_inViewOrgContact');		
						}},
						{xtype:'blank',width:'max'}
					]
				}
			]
		});
	}
	
	this.openTonxunLuIn_Org = function(){
		 sendToTempforCard = [];
		 uuidsForSend = [];
		 me.mod.main.showExpandView('sendInfoCardTreeInPersonalInOrgConatct');
	}
	
	this.sendInINfoCardNowInOrgContact = function(){//发送名片
		var uuids = me.mod.main.clipboardMgr.getChecked();
		var fromUuids = [];//被发送的uuid的集合
		var clearuuids = [];//要清楚的uuid的集合
		uuids.each(function(i,n){
			var object = {
				uuid:n.uuid,
				type:n.type //这里的type只能够是'1'
			};
			fromUuids.push(object);
			clearuuids.push(n.uuid);
		});
		
		var uuidChang = '';
		fromUuids.each(function(i,n){
			uuidChang+='{uuid:"'+n.uuid+'",type:"'+n.type+'"},';
		})
		uuidChang = uuidChang.substring(0,uuidChang.length-1);
		uuidChang = '['+uuidChang+']';
		
		var uuidsendchang = '';
		uuidsForSend.each(function(i,n){
		uuidsendchang+='{uuid:"'+n.uuid+'",type:"'+n.type+'",dn:"'+n.dn+'"},';
		})
		uuidsendchang = uuidsendchang.substring(0,uuidsendchang.length-1);
		uuidsendchang = '['+uuidsendchang+']';	
	
		
		mc.send({
			service:$sl.gcontactNewT_contactTonXun_gcontactTonXun_sendInfoCardInOrg.service,
			method:$sl.gcontactNewT_contactTonXun_gcontactTonXun_sendInfoCardInOrg.method,
			params:{
				uuids:uuidChang,
				toUuids:uuidsendchang
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
				
				me.mod.main.get('sendPersonDetailInfoCardId_inViewOrgContact').reset();
				me.mod.main.popMgr.close('sendPersonDetailInfoCardId_inViewOrgContact');
				me.mod.main.clipboardMgr.remove(clearuuids);
				uuidsForSend = [];
				sendToTempforCard = [];
				me.mod.main.closeExpandView('sendInfoCardTreeInPersonalInOrgConatct');
				}
			}
		});
		
	}
	
	this.viewpersonalDetailInfo = function(e,o){//我的通讯录‘我的联系人’查看
		var type = o.get('data').type;
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/personTonXun/viewPersonalDetaiInfo.js',
				params:{
					parent:me,
					oldPanrentObject:parentObject,//传递我的通讯录
					oldparentContactName:oldparentContactName,//'我的通讯录'
					persContactName:persContactName,//'我的联系人'
					lastPersContactName:o.get('data').name,
					parentUuid:uuid,//我的联系人的uuid
					uuid:o.get('data').uuid
				}
			});		
	}
	
	this.editPerosnDetailInfo = function(e,o){//我的通讯录‘我的联系人'编辑
		var uuid = o.get('data').uuid;//资源标识（此处为个人）
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personTonXun/editPersonalDetaiInfo.js',
			params:{
				parent:me,
				oldPanrentObject:parentObject,//传递我的通讯录
				oldparentContactName:oldparentContactName,//'我的通讯录'
				persContactName:persContactName,//'我的联系人'
				lastPersContactName:o.get('data').name,
				uuid:o.get('data').uuid
			}
		});
	}
	
	this.builNewPersonContact = function(){//新建联系人
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personTonXun/buildNewPersonContact.js',
			params:{
				parent:me,//传一个父对象
				oldPanrentObject:parentObject,//传递我的通讯录
				oldparentContactName:oldparentContactName,//'我的通讯录'
				lastPersContactName:persContactName,//'我的联系人'
				uuid:uuid //传递'我的联系人节点的uuid'
			}
		});
	}
	
	this.reloadMyrelateManmainGrid = function(){//刷新我的联系人列表
		var view = me.mod.main.getCentralView();
		view.dynamic.setStore({
			service : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.service,
			method : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.method,
			params:{
				uuid:uuid ,//我的联系人分组的uuid
				path:sendBookPath
			},
			success : function(){
			}
		});
			view.dynamic.load();
			

		
	}
});