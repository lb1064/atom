/*’我的通讯录‘列表*/
new (function(){
	var me = this;
	var sendToTempforCard = [];
	var uuidsForSend = [];
	var personalSendInfoTree;
	this.mod = new Gframe.module.RemoteModule({
	expandView:{
		'sendInfoCardTreeInPersonal':{//个人通讯录中
				title:'请选择名片接收人',
				create:function(params){
					personalSendInfoTree = new Treebar({serviceType:true});
						personalSendInfoTree.handler = function(node){
						if(node.options.xtype == 'contact'){
							if(!sendToTempforCard.contain(node.options.uuid)){							
							var sendInfoCardFormNew = me.mod.main.get('sendPerson_IngerenDetailInfoCardId_id');//发送名片
							var sendNameText = sendInfoCardFormNew.getByItemId('recevierIN222foCardItemId');
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
	var copyOrmovePurview;//复制到此或者移动到此的权限判断
	var parentContactName;
	var parentUuid;//我的通讯录的uuid
	this.mod.defaultView = function(params){
		parentUuid = params.uuid;
		parentContactName = params.parentContactName;//父通讯录的名字
		me.reopenMyRelateTonBook();
	}	
	
	var sendbookPath;
	this.reopenMyRelateTonBook = function(){//打开列表		
		sendbookPath = '[{name:"mybook",value:""}]';
		me.mod.main.open({
			id:'personalGerenTonXunluGridId',
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			usePage:true,
			currentPage:1,
			track:[
				{name:'通讯录管理'},
				{name:parentContactName,handler:function(){}}//'我的通讯录'
			],
			actFilter:function(data,purview){
				purview['all'] = true;
				if(data.name == '我的联系人'){
					purview.del = false;	
					purview.impower = false;
				}else{
					purview.del = true;				
				}
				return purview;
			},
			acts:{  
				track:[
					{value:'新建分组' ,handler:me.createNewGroup,exp:'impower'},
					{value:'新建联系人' ,handler:me.builNewPersonContact,exp:'impower'}
					//{value:'导入联系人' ,handler:me.daoruRelateMan,exp:'impower'}
				],
				clip:[
					{value:'发送名片' ,handler:me.sendPersonalCard,exp:'all'},
					{value:'删除' ,handler:me.delGroupAndPeople,exp:'del'},
					{value:'复制到此' ,handler:me.copycontactToHereNow,exp:'all'},
					{value:'移动到此' ,handler:me.movecontactToHereNow,exp:'all'}			
				],
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.viewpersonalDetailInfo,exp:'show'},
					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editPerosnDetailInfo,exp:'impower'}
				]
			},
			store:{
				service : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.service,
				method : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.method+'$_'+parentUuid,
				params:{
					uuid:parentUuid,
					path:sendbookPath
				},
				success:function(data,mod){
				}
			},
			colnums:[
					{header:'名称(组)',textAlign:'left',width:'max',cursor:'pointer',renderer:me.changeSchelType,handler:me.viewPersonTonxunAtCsol,mapping:'name'},
					{header:'电话(手机)',textAlign:'left',width:150,mapping:'phone'},
					{header:'邮箱',width:220,mapping:'email'},	
					{header:'备注',mapping:'remark',type:'tips'}
				],
			initMethod:function(mod){
				
			}
		});
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
			//uuidForsend+='{uuid:"'+n.uuid+',type:"'+n.type+'"},';
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
						}
						me.reloadTHismainGrid();

						}
					});
				}

			}
									
		});
		
		
	}
	
	this.viewPersonTonxunAtCsol = function(e,o){//个人通讯录列表的单击事件=查看
		var isOrg = o.type;//1，  人  2 组
		if(isOrg == '2' && o.name!='常用联系人' && o.name!='最近联系人'){//组织目录的的查看（等同于打开子目录）
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/personTonXun/viewOrgContactDetailInfo.js',
				params:{
					parent:me,
					oldparentContactName:parentContactName,//'我的通讯录'
					persContactName:o.name,//'我的联系人'
					uuid:o.uuid //当前节点的uuid,用于在下个目录的新建操作 
				}
		});
		}
		if(isOrg == '1'){//个人详细信息的查看
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/personTonXun/viewPersonalDetaiInfo.js',
				params:{
					parent:me,
					oldparentContactName:parentContactName,//'我的通讯录'
					persContactName:o.name,//'我的联系人'
					lastPersContactName:'0',
					uuid:o.uuid//当期节点的uuid 
				}
			});
		}
	}
	
	
	this.movecontactToHereNow = function(){//移动到此
		var fromUuids = [];
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		var clearuuids = [];
		fromuuids.each(function(i,n){
			if(n.bookType!='2' || (n.bookType==2 && n.type==1)){
				var obj = {
						uuid:n.uuid,
						type:n.type
						};
				fromUuids.push(obj);
			}
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
			text:'确定移动到此吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
					service:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.service,
					method:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.method,
					params:{
						uuids:uuidForsend,
						toUuid:parentUuid//我的通讯录的uuid
					},
					success:function(response){
						var data = util.parseJson(response.responseText);
						if(data.checkResult == '1'){
							mc.send({
								service:$sl.gcontact_personTonXun_persongerenTonxunLu_movecontactToHereNow.service,
								method:$sl.gcontact_personTonXun_persongerenTonxunLu_movecontactToHereNow.method,
								params:{
									//flag:'',
									uuids:uuidForsend,
									toUuid:parentUuid//我的通讯录的uuid
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
									me.reloadTHismainGrid();
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
												//flag:'1',//操作标示
												uuids:uuidForsend,
												toUuid:parentUuid//我的通讯录的uuid
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
												me.reloadTHismainGrid();
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
				delay:2000
			});
		}
		
		
	}
	
	this.copycontactToHereNow = function(){//复制到此
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
		fromUuids.each(function(i,n){
			uuidForsend+='{uuid:"'+n.uuid+'",type:"'+n.type+'"},';
		})
		uuidForsend = uuidForsend.substring(0,uuidForsend.length-1);
		uuidForsend = '['+uuidForsend+']';
		me.mod.main.confirm({
			text:'确定复制到此吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
						service:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.service,
						method:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.method,
						params:{
							uuids:uuidForsend,
							toUuid:parentUuid//我的通讯录的uuid
						},
						success:function(response){
							var data = eval('['+response.responseText+']');
							data = data[0];
							
							if(data.checkResult == '1'){
								mc.send({
									service:$sl.gcontact_personTonXun_persongerenTonxunLu_copycontactToHereNow.service,
									method:$sl.gcontact_personTonXun_persongerenTonxunLu_copycontactToHereNow.method,
									params:{
										flag:'',
										uuids:uuidForsend,
										toUuid:parentUuid//父节点的uuid
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
										me.reloadTHismainGrid();
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
													flag:'1',//操作标示
													uuids:uuidForsend,
													toUuid:parentUuid//父节点的uuid
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
													me.reloadTHismainGrid();
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
		
	}
	
	

	
	this.createNewGroup = function(){//新建分组
		me.mod.main.open({
			id:'createmyNewcontacGroupId2',
			xtype:'form',
			mode:'pop',
			width:600,
			height:260,
			fields:[
				{height:25,cols:[
					{xtype:'blank',width:10},
					{xtype:'label',textAlign:'left',value:'新建分组',textCls:'title_font',width:100},
					{xtype:'blank',width:'max'}
				]},
				'-',
				{height:40,cols:[
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'分组名称：',width:100},
						{xtype:'blank',width:5},
						{xtype:'text',top:5,textAlign:'left',leftHidden:true,name:'name',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{height:100,cols:[
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'备注：',width:100},
					{xtype:'blank',width:5},
					{xtype:'textarea',width:'max',name:'remark'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',value:'确定',width:100,handler:me.quedingAddContact},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.main.get('createmyNewcontacGroupId2');
						addcaontactform.reset();
						me.mod.main.popMgr.close('createmyNewcontacGroupId2');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			hiddens:[
				//{name:'parentUuid',value:parentUuid}
			],
			initMethod:function(mod){
				
			}
		})
	
	}
	this.quedingAddContact = function(){//保存新建的分组//{name:'parentUuid',value:parentUuid}
		var form  = me.mod.main.get('createmyNewcontacGroupId2');
		var o = form.serializeForm();
		if(!o.parentUuid){
			o.parentUuid = parentUuid;
		}
		switch(o.name){
			case '我的联系人':
				{
				me.mod.main.alert({
				text:'我的通讯录中，新建分组的组名不能够是我的联系人',
				level:'error',
				delay:2000
				});
				return;
				}
			case '常用联系人':
				{
				me.mod.main.alert({
				text:'我的通讯录中，新建分组的组名不能够是常用联系人',
				level:'error',
				delay:2000
				});
				return;
				}
			case '最近联系人':
				{
				me.mod.main.alert({
				text:'我的通讯录中，新建分组的组名不能够是最近联系人',
				level:'error',
				delay:2000
				});
				return;
				}
		}
		form.submit({
			service:$sl.gcontact_personTonXun_persongerenTonxunLu_createNewGroup.service,
			method:$sl.gcontact_personTonXun_persongerenTonxunLu_createNewGroup.method,
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
					me.mod.main.popMgr.close('createmyNewcontacGroupId2');
					me.reloadTHismainGrid();
				}
			}
		});
	}
	
	this.sendPersonalCard = function(){//发送名片
		me.mod.main.open({
			id:'sendPerson_IngerenDetailInfoCardId_id',
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
					{xtype:'text',textAlign:'left',value:'',onclick:me.openTonXunluNOw,itemId:'recevierIN222foCardItemId',leftHidden:true,width:'max'},
					{xtype:'button',imgCls:'clear30_btn',width:30,height:30,title:'清空',
									handler:function(){
									 me.mod.main.get('sendPerson_IngerenDetailInfoCardId_id').getByItemId('recevierIN222foCardItemId').setValue('');
									sendToTempforCard = [];
									uuidsForSend = [];
													
		                }},
					{xtype:'blank',width:20}					
				]},
				{height:36,	cols:[
						{xtype:'blank',width:'max'},
						{xtype:'button',value:'确定',width:100,handler:me.sendInINfoCardNow},
						{xtype:'blank',width:10},
						{xtype:'button',value:'取消',width:100,handler:function(){
							 var form = me.mod.main.get('sendPerson_IngerenDetailInfoCardId_id');
							 form.reset();
							 sendToTempforCard = [];
							 uuidsForSend = [];
							 me.mod.main.closeExpandView('sendInfoCardTreeInPersonal');
							 me.mod.main.popMgr.close('sendPerson_IngerenDetailInfoCardId_id');							
						}},
						{xtype:'blank',width:'max'}
					]
				}
			]
		});
	}
	
	this.sendInINfoCardNow = function(){//发送名片
		var uuids = me.mod.main.clipboardMgr.getChecked();
		var fromUuids = [];//被发送的uuid的集合
		var clearuuids = [];//要清楚的uuid的集合
		uuids.each(function(i,n){
			var object = {
				uuid:n.uuid,
				type:n.type
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
				
				me.mod.main.get('sendPerson_IngerenDetailInfoCardId_id').reset();
				me.mod.main.popMgr.close('sendPerson_IngerenDetailInfoCardId_id');
				me.mod.main.clipboardMgr.remove(clearuuids);
				uuidsForSend = [];
				sendToTempforCard = [];
				me.mod.main.closeExpandView('sendInfoCardTreeInPersonal');
				}
			}
		});
		
	}
	this.openTonXunluNOw = function(){//打开通讯录面板
		sendToTempforCard = [];
		uuidsForSend = [];
		me.mod.main.showExpandView('sendInfoCardTreeInPersonal');
	}

	
	this.viewpersonalDetailInfo = function(e,o){//我的通讯录得查看的操作 ,2种
		//1、如果是个人
		var isOrg=  o.get('data').type;//1，  人  2 组
		if(isOrg == '2'){//组织目录的的查看（等同于打开子目录）
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/personTonXun/viewOrgContactDetailInfo.js',
				params:{
					parent:me,
					oldparentContactName:parentContactName,//'我的通讯录'
					persContactName:o.get('data').name,//'我的联系人'
					uuid:o.get('data').uuid //当期节点的uuid,用于在下个目录的新建操作 
				}
			});
		}
		if(isOrg == '1'){//个人详细信息的查看
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/personTonXun/viewPersonalDetaiInfo.js',
				params:{
					parent:me,
					oldparentContactName:parentContactName,//'我的通讯录'
					persContactName:o.get('data').name,//'我的联系人'
					lastPersContactName:'0',
					uuid:o.get('data').uuid//当期节点的uuid 
				}
			});
		}
		
	}
	
	this.editPerosnDetailInfo = function(e,o){ //编辑个人信息
		var isOrg=  o.get('data').type;//1，  人  2 组
		var uuid = o.get('data').uuid;//资源标识
		if(isOrg == '1'){
			me.mod.main.remoteOpen({
					url:'modules/gmyContact/personTonXun/editPersonalDetaiInfo.js',
					params:{
						parent:me,
						oldparentContactName:parentContactName,//'我的通讯录'
						persContactName:o.get('data').name,//'我的联系人'
						lastPersContactName:'0',
						uuid:o.get('data').uuid  //当前节点的uuid
					}
			});
		}
		if(isOrg == '2'){//编辑组
			me.mod.main.open({
			id:'editmyNewcontacGroupINfomain_ForOrgEdit_Id2',
			xtype:'form',
			mode:'pop',
			width:600,
			height:260,
			store:{//编辑组
				service:$sl.contact_personTonXun_persongerenTonxunLu_editPerosnDetailInfoforEdit.service,
				method:$sl.contact_personTonXun_persongerenTonxunLu_editPerosnDetailInfoforEdit.method,
				params:{
					uuid:o.get('data').uuid
				},
				success:function(data,mod){
					var form = me.mod.main.get('editmyNewcontacGroupINfomain_ForOrgEdit_Id2');
					mc.fireEvent(form.get('id'),'loadForm',{data:data});
					var editGroupINfomainuuuid = form.getByItemId('editGroupINfomainuuuid');
					editGroupINfomainuuuid.setValue(data.uuid);//分组的uuid
				}
			},
			fields:[
				{height:25,cols:[
					{xtype:'blank',width:10},
					{xtype:'label',textAlign:'left',value:'编辑分组',textCls:'title_font',width:100},
					{xtype:'blank',width:'max'}
				]},
				'-',
				{height:40,cols:[
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'分组名称：',width:100},
						{xtype:'blank',width:5},
						{xtype:'text',top:5,textAlign:'left',leftHidden:true,name:'name',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{height:100,cols:[
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'备注：',width:100},
					{xtype:'blank',width:5},
					{xtype:'textarea',width:'max',name:'remark'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',value:'确定',width:100,handler:me.quedingeditContact},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var editcaontactform = me.mod.main.get('editmyNewcontacGroupINfomain_ForOrgEdit_Id2');
						editcaontactform.reset();
						me.mod.main.popMgr.close('editmyNewcontacGroupINfomain_ForOrgEdit_Id2');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			hiddens:[
				{name:'uuid',itemId:'editGroupINfomainuuuid'}
			],
			initMethod:function(mod){
				
			}
		})
		}
	
	
	}
	
	this.quedingeditContact = function(){//保存编辑分组信息
		var editcaontactform = me.mod.main.get('editmyNewcontacGroupINfomain_ForOrgEdit_Id2');
		var o = editcaontactform.serializeForm();
		editcaontactform.submit({
			service:$sl.contact_personTonXun_persongerenTonxunLu_quedingeditContact.service,
			method:$sl.contact_personTonXun_persongerenTonxunLu_quedingeditContact.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					editcaontactform.reset();
					me.mod.main.popMgr.close('editmyNewcontacGroupINfomain_ForOrgEdit_Id2');
					//刷新列表
					me.reloadTHismainGrid();
				}
			}
		});
	}
	
	this.builNewPersonContact = function(){//新建联系人
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personTonXun/buildNewPersonContact.js',
			params:{
				parent:me,
				oldparentContactName:parentContactName,//'我的通讯录'
				lastPersContactName:'0',
				uuid:parentUuid //‘我的通讯录'uuid
			}
		});
	}
	
	this.reloadTHismainGrid = function(){
		var view = me.mod.main.getCentralView();
		view.dynamic.setStore({
			service : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.service,
			method : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.method,
			params:{
				uuid:parentUuid,
				path:sendbookPath
			},
			success : function(){
			}
		});
			view.dynamic.load();
			

	}
});