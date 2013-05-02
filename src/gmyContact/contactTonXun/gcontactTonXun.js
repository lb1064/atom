new (function(){
	var me = this;
	var uuidsForSend = [];//名片接受人的集合
	var sendToTempforCard = [];
	var givePerssionActFlag;
	var rootContactUuid;//根节点的uuid
	var systemUserTree,sendInfoCardTree;
	//var sendToTemp;
	this.mod = new Gframe.module.Module({
		tabTitle:'通讯录管理',
		key:'gcontactTonXunluIdKey_clipboard',
		colnums:[
			{header:'组名(联系人名字)',width:200,mapping:'name'}
		],
		trackHandler:function(e,o){
			switch(o.getValue()){//得到的是path的name的值
				case '通讯录管理' :
					me.openMainGridAgain();//重新打开主列表
					me.mod.closeExpandView('tonXunBoookTree');
					break;
				default:
					var viewUuid = o.getName();
					var name = o.getValue();
					var needPathkey;
					diguiPath.each(function(i,n){
						if(n.value == viewUuid){
							needPathkey = i;
						}
					});
					diguiPath = diguiPath.splice(0,needPathkey);
					me.viewOrgnationZuzhiTonxun({viewUuid:viewUuid,path:diguiPath});
					break;
			}
		},
		expandView:{
			'tonXunBoookTree':{
				title:'请选择授权对象',
				create:function(params){
					systemUserTree = new Treebar({serviceType:true});	
					systemUserTree.handler = function(node){
								if(!node.options.realName){
									node.options.realName=node.options.name;
								}
								var records = {
										uuid : node.options.uuid,
										type : node.options.type,
										name : node.options.name
									}
								if(givePerssionActFlag == 'right'){//右侧
									var shouQuanForm = me.mod.get('givePersionTOuserAtRightpageId');//右侧授权
									var nameText =shouQuanForm.getByItemId('zhidingDuixiangTextId2');
									nameText.addRecord(records);
									nameText.update();
								}
								if(givePerssionActFlag == 'grid'){
									var shouQuanFormNew = me.mod.get('givePersionToUserpageId');//grid区域授权
									var nameTextNew = shouQuanFormNew.getByItemId('zhidingDuixiangTextId');
									nameTextNew.addRecord(records);
									nameTextNew.update();
								}

					};
					return systemUserTree;
				},
				initMethod:function(params){
					mc.send({
						service:$sl.gcontactNewT_contactTonXun_gcontactTonXun_getAllUsers.service,
						method:$sl.gcontactNewT_contactTonXun_gcontactTonXun_getAllUsers.method,
						//params:{},
						success:function(response){
							mc.fireEvent(systemUserTree.get('id'),'loadData',{obj:response.responseText});
						}
					});
				}
			},
			'sendInfoCardTree':{
				title:'请选择名片接收人',
				create:function(params){
					sendInfoCardTree = new Treebar({serviceType:true});	
					sendInfoCardTree.handler = function(node){
						if(node.options.xtype == 'contact'){
							if(!sendToTempforCard.contain(node.options.uuid)){							
							var sendInfoCardFormNew = me.mod.get('sendPersonDetailInfoCardIdInOrgContact');//发送名片
							var sendNameText = sendInfoCardFormNew.getByItemId('recevierINfoCardItemId');
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
					
					return sendInfoCardTree;
				},
				initMethod:function(params){
					uuidsForSend = [];//清空名片接受人,
					mc.send({
						service:$sl.gcontactNewT_contactTonXun_gcontactTonXun_getAllUsers.service,
						method:$sl.gcontactNewT_contactTonXun_gcontactTonXun_getAllUsers.method,
						//params:{},
						success:function(response){
								var data = util.parseJson(response.responseText);
								mc.fireEvent(sendInfoCardTree.get('id'),'loadData',{obj:response.responseText});
						}
					});
				}
			}
		}
	});
	var contactName;//通讯录的名字
	var tonXunAllPurview;//通讯录的最外层权限
	var uuidForAllNewBuild;//所有新建要用到的父节点的uuid
	var tonxunLuUUid;//通讯录的uuid
	this.mod.defaultView = function(params){
		me.openMainGridAgain();
	}
	this.openMainGridAgain = function(){//重新打开主列表
		me.mod.open({
			id:'gcontactTonXunluId',
			xtype:'grid',
			mode:'loop',
			checkbox:false,
			key:'gcontactMainGridClipboard_key',
			usePage:false,
			currentPage:1,
			track:[
				{name:'通讯录管理'}
			],
			actFilter:function(data,purview){
				if(data.type=='1'){//个人通讯录
					purview['edit'] = false;
					purview['exporeBook'] = true;
					purview['importFile'] = true;
				}
				if(data.type=='2'){//如果是组织通讯录
					if(purview.impower){
						purview['other'] = true;
						purview['edit'] = true;
						purview['exporeBook'] = true;
						purview['importFile'] = false;
						purview['importPaltForm'] = true;
					}else{
						purview['other'] = false;
						purview['edit'] = false;
						purview['exporeBook'] = false;
						purview['importFile'] = false;
						purview['importPaltForm'] = false;
					}
				}
				if(data.type == '3'){//我的团队
					purview['edit'] = false;
				}
				if(!data.role.impower){
					purview['impower'] = false;
				}
				return purview;
			},
			acts:{//daoruRelateMan
				track:[
					{value:'新建通讯录',handler:me.createNewcontactFolder,exp:'impower'},
					{value:'授权',handler:me.givePersionTOuserAtRight,exp:'impower'}
				],
				clip:[],
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.lookAtContactDetailInfo,exp:'show'},
					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editContactLu,exp:'edit'},	
					{name:'授权',value:'授权',imgCls:'authorize_btn',handler:me.givePersionToUser,exp:'other'},
					{name:'删除',value:'删除',imgCls:'delete_btn',handler:me.delshanchuContactNow,exp:'other'},
					{name:'复制',value:'复制',imgCls:'copy_btn',handler:me.copyConactFolder,exp:'other'},
					{name:'导出',value:'导出',imgCls:'export_btn',handler:me.expoContactFolder,exp:'exporeBook'},
					{name:'导入',value:'导入',imgCls:'import_btn',handler:me.daoruRelateMan,exp:'importFile'},
					{name:'导入',value:'导入',imgCls:'import_btn',handler:me.daoruNewContactFolder,exp:'importPaltForm'}
				]
			},
			store:{
				service:$sl.gcontact_contactTonXun_gcontactTonXun_defaultView.service,
				method:$sl.gcontact_contactTonXun_gcontactTonXun_defaultView.method,
				params:{
				},
				success:function(data,mod){
					//me.mod.historyMgr.reloadTrack(data.path);  
					if(data.path.uuid){
						rootContactUuid = data.path.uuid;	
					}
				}
			},
			colnums:[
					{header:'通讯录类型',textHidden:true,textAlign:'right',width:40,renderer:me.changeSchelType,mapping:'type'},
					{header:'名称',textAlign:'left',width:'max',mapping:'name',cursor:'pointer',handler:me.viewTonXunluManger},
					{header:'创建人',width:'max',mapping:'creator'},
					{header:'创建时间',width:'max',mapping:'creatTime'},
					{header:'备注',mapping:'remark',type:'tips'}
				],
			initMethod:function(mod){
			}
		});
	}
	var track = [{name:'通讯录管理'}];
	this.lookAtContactDetailInfo = function(e,o){
		var type = o.get('data').type;
		if(type == '1'){//个人通讯录
			me.mod.remoteOpen({
				url:'modules/gmyContact/personTonXun/persongerenTonxunLu.js',
				params:{
					parentContactName:o.get('data').name,//'我的通讯录'
					uuid:o.get('data').uuid//通讯录的标示。用以获取它下面的所有子通讯录（包括组和联系人）
				}
			});
		}
		
		if(type == '2'){//组织通讯录
		   var viewUuid = o.get('data').uuid;
		   var path = [{name:"通讯录管理",value:""}];
		   var object = {viewUuid:viewUuid,path:path};
		   me.viewOrgnationZuzhiTonxun(object);
		}
		
		if(type == '3'){//团队
			mc.loadModule({
				url:'modules/gteamRoom/teamRoomUI/teamRoomMain.js',
				params:{}
			});
		}
	}
	
	this.viewTonXunluManger = function(e,o){//主列表中单击列的查看操作
		var type = o.type;
		if(type == '1'){//个人通讯录
			me.mod.remoteOpen({
				url:'modules/gmyContact/personTonXun/persongerenTonxunLu.js',
				params:{
					parentContactName:o.name,//'我的通讯录'
					uuid:o.uuid//通讯录的标示。用以获取它下面的所有子通讯录（包括组和联系人）
				}
			});
		}
		if(type == '2'){//组织通讯录
			var path = [{name:"通讯录管理",value:""}];
			var viewUuid = o.uuid;
		   	var object = {viewUuid:viewUuid,path:path};
			me.viewOrgnationZuzhiTonxun(object);
		}
		
		if(type == '3'){//团队
			mc.loadModule({
				url:'/modules/gteamRoom/teamRoomUI/teamRoomMain.js',
				params:{}
			});
		}
	}
	
	this.viewFistOrgnation = function(e,o){//type 只有1和2  1是个人 2是组
		if(o.get('data').type == '2'){
			var viewUuid = o.get('data').uuid;
			var object = {viewUuid:viewUuid,path:diguiPath}
			me.viewOrgnationZuzhiTonxun(object);
		};
		if(o.get('data').type == '1'){//查看个人的相信信息
			me.mod.remoteOpen({
				url:'modules/gmyContact/organizationTonXun/viewOrgPersonalDetaiInfo.js',
				params:{
					//传递path
					nodeName:o.get('data').name,
					tspath:translatePath,//传达当前列表的路径
					uuid:o.get('data').uuid
					//track:
				}
		});
		
		}
	}
	
	var countData = 0;
	var viewOrgReloadUuid;
	var translatePath;
	var diguiPath;
	this.viewOrgnationZuzhiTonxun = function(params){//组织通讯录begin：组织通讯录的查看操作
		var viewUuid =  params.viewUuid;
	//	uuidForAllNewBuild = params.viewUuid;
		//viewOrgReloadUuid = params.viewUuid;
		diguiPath = params.path;
		var sendPath = '';
		diguiPath.each(function(i,n){
			sendPath+='{name:"'+n.name+'",value:"'+n.value+'"},';
		});
		sendPath =sendPath.substring(0,sendPath.length-1);
		sendPath = '['+sendPath+']';
		me.mod.open({
			id:'orgartionlZUzhiTonXunlMainuGridId'+countData,
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			usePage:true,
			currentPage:1,
			//track:track,
			actFilter:function(data,purview){
				/*我的联系人，常用联系人，最近联系人有个标示,从后台获取*/
				purview['all'] = true;
				if(data.role.impower==true && data.type=='2'){
					purview['exporeGroup'] = true;
					purview['importGroup'] = true;
				}
				return purview;
			},
			acts:{
				track:[
					{value:'新建分组' ,handler:me.createNewGroup,exp:'impower'},
					{value:'新建联系人' ,handler:me.builNewPersonContact,exp:'impower'}
				],
				clip:[//ee
					{value:'发送名片' ,handler:me.sendPersonalCardInOrgContact,exp:'all'},
					{value:'删除' ,handler:me.delGroupAndPeople,exp:'all'},
					{value:'复制到此' ,handler:me.copyOrgcontactToHereNow,exp:'all'},
					{value:'移动到此' ,handler:me.moveOrgcontactToHereNow,exp:'all'}			
				],
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.viewFistOrgnation,exp:'show'},
					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editFirstPerosnDetailInfo,exp:'impower'},
					{name:'导出',value:'导出',imgCls:'export_btn',handler:me.expoContactFolder,exp:'exporeGroup'},
					{name:'导入',value:'导入',imgCls:'import_btn',handler:me.daoruRelateManForOrgbook,exp:'importGroup'}
				]
			},
			store:{
				service : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.service,
				method : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.method+'$_'+viewUuid,
				params:{
					uuid:viewUuid,//中科天翔的uuid
					path:sendPath
				},
				success:function(data,mod){
						diguiPath = data.path;
						uuidForAllNewBuild = data.path[data.path.length-1].value;//新建
						viewOrgReloadUuid = data.path[data.path.length-1].value;//刷新
						me.mod.historyMgr.reloadTrack(diguiPath); 
						translatePath = diguiPath;
				}
			},
			colnums:[
					{header:'名称(组)',textAlign:'left',width:'max',cursor:'pointer',handler:me.openDetailInfoInThisWays,mapping:'name'},
					{header:'电话(手机)',textAlign:'left',width:150,mapping:'phone'},
					{header:'邮箱',width:220,mapping:'email'},	
					{header:'备注',mapping:'remark',type:'tips'}
				],
			initMethod:function(mod){
				countData = countData+1;
			}
		});
	}
	
	this.delGroupAndPeople = function(){//删除组和人
		var fromUuids = [];
		var fromuuids = me.mod.clipboardMgr.getChecked(); 
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
		me.mod.confirm({
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
							me.mod.alert({
								text:data.msg,
								level:'info',
								delay:2000
							});
						me.mod.clipboardMgr.remove(clearuuids);//清空剪切板	
						}
						me.reloadOrgViewCenterGrid();

						}
					});
				}

			}
									
		});
	}
	
	var uuidForzudedaoru;
	this.daoruRelateManForOrgbook = function(e,o){//组织通讯录中组的导入
		uuidForzudedaoru = o.get('data').uuid;
		me.mod.open({
			id:'importralateman_forOrgBook',
			xtype:'form',
			width:500,
			mode:'pop',
			height:190,
			fields:[
				{height:20,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'left',textCls:'title_font',value:'导入联系人',width:100},
						{xtype:'blank',width:'max'}				
				]},
				'-',
				{height:30,cols:[
					{xtype:'blank',width:20},
					{xtype:'label',textAlign:'left',value:'组名：',textCls:'title_font',width:70},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',itemId:'inmortContactFolderName_itemid',textCls:'title_font',width:'max'},
					{xtype:'blank',width:20}
				]},
				{height:36,cols:[
					{xtype:'blank',width:20},
					{xtype:'file',name:'uuid',width:'max',success:function(){
							var form = me.mod.get('importralateman_forOrgBook');
							var importFolderButton = form.getByItemId('importFolderButton');
							importFolderButton.setEnabled(true);
					}},
					{xtype:'blank',width:20}
				]},
				{height:36,cols:[
					{xtype:'blank',width:'max'},
					{xtype:'button',width:100,itemId:'importFolderButton',value:'导入',handler:me.daorulanxienForZu},
					{xtype:'blank',width:20},
					{xtype:'button',width:100,value:'取消',handler:function(){
							var form = me.mod.get('importralateman_forOrgBook');
							form.reset();
							me.mod.popMgr.close('importralateman_forOrgBook');
					}},
					{xtype:'blank',width:'max'}
				]}
			],
			initMethod:function(mod){
				var form = me.mod.get('importralateman_forOrgBook');
				var inmortContactFolderName_itemid = form.getByItemId('inmortContactFolderName_itemid');
				inmortContactFolderName_itemid.setValue(o.get('data').name);
				var importFolderButton = form.getByItemId('importFolderButton');
				importFolderButton.setEnabled(false);
			}
			
		});
	}
	
	this.daorulanxienForZu = function(){//组导入联系人
		var form = me.mod.get('importralateman_forOrgBook');
		var o  = form.serializeForm();
		if(!o.bookUuid){
			o.bookUuid = uuidForzudedaoru;
		}
		form.submit({
			service:$sl.gcontact_contactTonXun_gcontactTonXun_importPersonForGroup.service,
			method:$sl.gcontact_contactTonXun_gcontactTonXun_importPersonForGroup.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					form.reset();
					me.reloadOrgViewCenterGrid();
					me.mod.popMgr.close('importralateman_forOrgBook');
				}
			}
		});
	
	}
	
	this.sendPersonalCardInOrgContact = function(){
		me.mod.open({
			id:'sendPersonDetailInfoCardIdInOrgContact',
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
					{xtype:'text',textAlign:'left',value:'',onclick:me.openTonXunluNOw,itemId:'recevierINfoCardItemId',leftHidden:true,width:'max'},
					{xtype:'button',imgCls:'clear30_btn',width:30,height:30,title:'清空',
									handler:function(){
										uuidsForSend = [];
										sendToTempforCard = [];
									 	me.mod.get('sendPersonDetailInfoCardIdInOrgContact').getByItemId('recevierINfoCardItemId').setValue('');
													
		                }},
					{xtype:'blank',width:20}					
				]},
				{height:36,	cols:[
						{xtype:'blank',width:'max'},
						{xtype:'button',value:'确定',width:100,handler:me.sendInfoCardInOrg},
						{xtype:'blank',width:10},
						{xtype:'button',value:'取消',width:100,handler:function(){
							 var form = me.mod.get('sendPersonDetailInfoCardIdInOrgContact');
							 form.reset();
							 uuidsForSend = [];
							 sendToTempforCard = [];
							 me.mod.closeExpandView('sendInfoCardTree');
							 me.mod.popMgr.close('sendPersonDetailInfoCardIdInOrgContact');							
						}},
						{xtype:'blank',width:'max'}
					]
				}
			]
		});
	}
	
	this.sendInfoCardInOrg = function(){//sendInfoCardTree
		var uuids = me.mod.clipboardMgr.getChecked();
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
					me.mod.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
				
				me.mod.get('sendPersonDetailInfoCardIdInOrgContact').reset();
				me.mod.popMgr.close('sendPersonDetailInfoCardIdInOrgContact');
				me.mod.clipboardMgr.remove(clearuuids);
				uuidsForSend = [];
				sendToTempforCard = [];
				//关闭名片接收人选择的面板
				me.mod.closeExpandView('sendInfoCardTree');
				}
			}
		});
	}
	
	this.openTonXunluNOw = function(){//打开通讯录面板
		uuidsForSend = [];
		me.mod.showExpandView('sendInfoCardTree');
	}
	
	this.openDetailInfoInThisWays = function(e,o){//单击事件的查看操作
		if(o.type == '2'){
			var viewUuid = o.uuid;
			var object = {viewUuid:viewUuid,path:diguiPath}
			me.viewOrgnationZuzhiTonxun(object);
		};
		if(o.type == '1'){//查看个人的相信信息
			me.mod.remoteOpen({
				url:'modules/gmyContact/organizationTonXun/viewOrgPersonalDetaiInfo.js',
				params:{
					uuid:o.uuid,
					nodeName:o.name,
					tspath:translatePath//传达当前列表的路径
					//track:
				}
		});
		
		}
	}
	
	this.reloadOrgViewCenterGrid = function(){//组织通讯录查看列表的刷新操作
		var cutKey;
		var sendPath = '';
		diguiPath.each(function(i,n){
			sendPath+='{name:"'+n.name+'",value:"'+n.value+'"},';
		});
		sendPath =sendPath.substring(0,sendPath.length-1);
		sendPath = '['+sendPath+']';
		var view = me.mod.getCentralView();
		view.dynamic.setStore({
			service : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.service,
			method : $sl.gcontact_personTonXun_persongerenTonxunLu_defaultView.method,
			params:{
				uuid:viewOrgReloadUuid,//中科天翔的uuid
				path:sendPath
			},
			success : function(){
			}
		});
			view.dynamic.load();
			

	}
	
	this.copyOrgcontactToHereNow = function(){//组织通讯录查看操作中  复制到此
		var fromUuids = [];
		var fromuuids = me.mod.clipboardMgr.getChecked(); 
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
		if(fromUuids.length){
			me.mod.confirm({
			text:'确定复制到此吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
					service:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.service,
					method:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.method,
					params:{
						uuids:uuidForsend,
						toUuid:uuidForAllNewBuild//父节点的uuid
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
										toUuid:uuidForAllNewBuild//父节点的uuid
									},
									success:function(response){
										var dataa = eval('['+response.responseText+']');
										dataa = dataa[0];
										if(dataa.success){
											me.mod.alert({
												text:dataa.msg,
												level:'info',
												delay:2000
										});
										me.mod.clipboardMgr.remove(clearuuids);//清空剪切板
										}
										me.reloadOrgViewCenterGrid();
									}
								});
							}
						
						if(data.checkResult == '2'){
							me.mod.confirm({
								text:data.msg+',确定继续复制吗？',
								handler:function(confirm){
									if(confirm){
										mc.send({
											service:$sl.gcontact_personTonXun_persongerenTonxunLu_copycontactToHereNow.service,
											method:$sl.gcontact_personTonXun_persongerenTonxunLu_copycontactToHereNow.method,
											params:{
												flag:'1',//操作标示
												uuids:uuidForsend,
												toUuid:uuidForAllNewBuild//父节点的uuid
											},
											success:function(response){
												var datar = util.parseJson(response.responseText);
												if(datar.success){
													me.mod.alert({
														text:datar.msg,
														level:'info',
														delay:2000
													});
												me.mod.clipboardMgr.remove(clearuuids);//清空剪切板
												}
												me.reloadOrgViewCenterGrid();
											}
							});
									}
								}
							});
						}
						
						if(data.checkResult == '3'){
								me.mod.alert({
											text:data.msg,
											level:'error',
											delay:2000
											});
						}
						
						if(data.checkResult == '4'){
								me.mod.alert({
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
			me.mod.alert({
				text:'没有选中正确的数据',
				level:'error',
				delay:2000
			});
		}
		
		
	}
	
	this.moveOrgcontactToHereNow = function(){//组织通讯录查看操作中  移动到此
		var fromUuids = [];
		var fromuuids = me.mod.clipboardMgr.getChecked(); 
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
		me.mod.confirm({
			text:'确定移动到此吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
					service:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.service,
					method:$sl.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow.method,
					params:{
						uuids:uuidForsend,
						toUuid:uuidForAllNewBuild//我的通讯录的uuid
					},
					success:function(response){
						var data = util.parseJson(response.responseText);
						if(data.checkResult == '1'){//后台返回的校验结果是1，就直接调用移动接口,此时我传递的flag是空的
							mc.send({
							service:$sl.gcontact_personTonXun_persongerenTonxunLu_movecontactToHereNow.service,
							method:$sl.gcontact_personTonXun_persongerenTonxunLu_movecontactToHereNow.method,
							params:{
								//flag:'',
								uuids:uuidForsend,
								toUuid:uuidForAllNewBuild//我的通讯录的uuid
							},
							success:function(response){
								var dataa = util.parseJson(response.responseText);
								if(dataa.success){
									me.mod.alert({
										text:dataa.msg,
										level:'info',
										delay:2000
									});
									me.mod.clipboardMgr.remove(clearuuids);//清空剪切板
									me.reloadOrgViewCenterGrid();
								}
								}
							});
						}
						
						if(data.checkResult == '2'){//后台返回的校验结果是2，就给客户一个提示
							me.mod.confirm({
								text:data.msg+',确定继续移动吗？',
								handler:function(confirm){
									if(confirm){
										mc.send({
											service:$sl.gcontact_personTonXun_persongerenTonxunLu_movecontactToHereNow.service,
											method:$sl.gcontact_personTonXun_persongerenTonxunLu_movecontactToHereNow.method,
											params:{
												//flag:'1',//操作标示
												uuids:uuidForsend,
												toUuid:uuidForAllNewBuild//父节点的uuid
											},
											success:function(response){
												var datab = util.parseJson(response.responseText);
												if(datab.success){
													me.mod.alert({
														text:datab.msg,
														level:'info',
														delay:2000
													});
												me.mod.clipboardMgr.remove(clearuuids);//清空剪切板
												}
												me.reloadOrgViewCenterGrid();
											}
										});
									}
								}
							});
						}
						
						if(data.checkResult!='1' && data.checkResult!='2'){//
								me.mod.alert({
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
	
	this.builNewPersonContact = function(){//新建联系人
		me.mod.remoteOpen({
			url:'modules/gmyContact/organizationTonXun/buildNewOrgPersonContact.js',
			params:{
				//oldparentContactName:parentContactName,//'我的通讯录'
				//lastPersContactName:'0',
				uuid:uuidForAllNewBuild, //组的uuid
				tspath:translatePath//传达当前列表的路径
			}
		});
	}
	
	this.createNewGroup = function(){//新建分组,要传一个父节点的uuid
		me.mod.open({
			id:'createmy_OrgNewcontacGroupId11',
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
					{xtype:'button',value:'确定',width:100,handler:me.quedingAddnewBuildGroup},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.get('createmy_OrgNewcontacGroupId11');
						addcaontactform.reset();
						me.mod.popMgr.close('createmy_OrgNewcontacGroupId11');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			hiddens:[
				{name:'parentUuid',itemId:'parentUuidFornNewbuildgroup'}
			],
			initMethod:function(mod){
				
			}
		});
	}
	
	this.quedingAddnewBuildGroup = function(){//保存新建分组
		var form  = me.mod.get('createmy_OrgNewcontacGroupId11');
		//父节点uuid
		var parentUuidFornNewbuildgroup = form.getByItemId('parentUuidFornNewbuildgroup');
		parentUuidFornNewbuildgroup.setValue(uuidForAllNewBuild);
		var o = form.serializeForm();
		form.submit({
			service:$sl.gcontact_personTonXun_persongerenTonxunLu_createNewGroup.service,
			method:$sl.gcontact_personTonXun_persongerenTonxunLu_createNewGroup.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					form.reset();
					me.mod.popMgr.close('createmy_OrgNewcontacGroupId11');
					me.reloadOrgViewCenterGrid();
				}
			}
		});
		
	}
	
	this.editFirstPerosnDetailInfo = function(e,o){//编辑操作  分2种情况
		var isOrg=  o.get('data').type;//1，  人  2 组
		if(isOrg == '1'){
			me.mod.remoteOpen({
					url:'modules/gmyContact/organizationTonXun/editOrgPersonalDetaiInfo.js',
					params:{
						nodeName:o.get('data').name,
						tspath:translatePath,//传达当前列表的路径
						uuid:o.get('data').uuid  //当前节点的uuid
					}
			});
		}
		if(isOrg == '2'){//编辑组
			me.mod.open({
			id:'editmyNew_contacOrgGroupINfomainId11',
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
					var form = me.mod.get('editmyNew_contacOrgGroupINfomainId11');
					mc.fireEvent(form.get('id'),'loadForm',{data:data});
					var editGroupINfomainuuuid = form.getByItemId('editOrgGroupINfomain_uuuid');
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
						var editcaontactform = me.mod.get('editmyNew_contacOrgGroupINfomainId11');
						editcaontactform.reset();
						me.mod.popMgr.close('editmyNew_contacOrgGroupINfomainId11');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			hiddens:[
				{name:'uuid',itemId:'editOrgGroupINfomain_uuuid'}
			],
			initMethod:function(mod){
				
			}
		})
		}
	
	
	}
	
	this.quedingeditContact = function(){// 保存编辑组
		var editcaontactform = me.mod.get('editmyNew_contacOrgGroupINfomainId11');
		var o = editcaontactform.serializeForm();
		editcaontactform.submit({
			service:$sl.contact_personTonXun_persongerenTonxunLu_quedingeditContact.service,
			method:$sl.contact_personTonXun_persongerenTonxunLu_quedingeditContact.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					editcaontactform.reset();
					me.mod.popMgr.close('editmyNew_contacOrgGroupINfomainId11');
					//刷新列表
					me.reloadOrgViewCenterGrid();
				}
			}
		});
	}
	
	this.givePersionTOuserAtRight = function(){// 右侧区域的授权操作，只是页面和gird区域的授权操作是一样的
		me.mod.open({
			id:'givePersionTOuserAtRightpageId',
			xtype:'form',
			mode:'loop',
			track:[
				{name:'通讯录管理'},
				{name:'授权'}
			],
			acts:{
				track:[
					{value:'保存',handler:me.saveGivePersionToUser2},
					{value:'取消',handler:function(){
						var form = me.mod.get('givePersionTOuserAtRightpageId');
						form.reset();
						me.mod.closeExpandView('tonXunBoookTree');
						me.mod.goback();
					}}
				],
				clip:[],
				grid:[]
			},
			fields:[
				{height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'通讯录名：',width:100},
					{xtype:'blank',width:8},
					{xtype:'label',textAlign:'left',value:'通讯录根目录',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',top:4,textAlign:'right',textCls:'title_font',value:'授权对象：',width:100},
					{xtype:'blank',width:5},
					{xtype:'radiogroup',width:180,name:'',itemId:'everyOneGivePermissionson',cursor:'pointer',radios:[
							{displayValue:'所有对象',checked:true,value:'everyone',width:100,on:{'click':me.opentonghandlerradiogroup2}},
							{displayValue:'指定对象',value:'2',width:80,on:{'click':me.opentonghandlerradiogroup1}}
					]},
					//{xtype:'text',itemId:'zhidingDuixiangTextId2',leftHidden:true,name:'',width:250},
					{xtype : 'textplus',width : 250,name :'members',itemId:'zhidingDuixiangTextId2',listeners : ({
												'click' : function() {
													
												}
											}),
						defaultField : 'name',
						fields : ['uuid', 'type', 'name']
						},
		            {xtype:'blank',width:20}
				]},
				{height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',top:4,textAlign:'right',textCls:'title_font',value:'授权操作：',width:100},
					{xtype:'blank',width:5},
					{xtype:'radiogroup',width:'max',cursor:'pointer',name:'roleType',radios:[
							{displayValue:'允许',checked:true,value:'1',width:100},
							{displayValue:'拒绝',value:'2',width:80}
					]},
					{xtype:'blank',width:20}
				]},
					{height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',top:4,textAlign:'right',textCls:'title_font',value:'授予权限：',width:100},
					{xtype:'blank',width:5},
					{xtype:'checkbox',name:'show',checked:true,modle:'role',displayValue:'可见',value:true,width:100},
					{xtype:'checkbox',name:'impower',modle:'role',displayValue:'管理',value:true,width:100},
					{xtype:'blank',width:'max'}
					]
				},
				{height:36,cols:[
					{xtype:'blank',width:30},
					{xtype:'label',top:4,textAlign:'left',textCls:'title_font',value:'已存在的权限列表：',width:200},
					{xtype:'blank',width:'max'}
				]}
				//{height:40,title:'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;授权对象'},
			],
			initMethod:function(mod){
				//加载已经授予的权限列表
				me.createAddContactQuanxianGrid2();
				me.opentonghandlerradiogroup2();
			},
			hiddens:[
				//{name:'uuid',value:''}
			]
		});
	}
	
	var parentForImportUUid;
	var importGroupFlagAtPageGrid;
	this.daoruRelateMan = function(e,o){//导入联系人 （通讯录 或者 组）
		var importContactName;
		importGroupFlagAtPageGrid = null;
		if(o && o.get('data') && o.get('data').bookType=='2' && o.get('data').type=='2'){
			importGroupFlagAtPageGrid = '1';
		}else{
			importGroupFlagAtPageGrid = '0';
		}
		if(o){
			importContactName = o.get('data').name;
			parentForImportUUid = o.get('data').uuid;
		}else{
			importContactName = contactName;
			parentForImportUUid = tonxunLuUUid;
		}
		me.importFileView(o);
	}
	///////////////////////////////////////导入文件/////////////////////////////////////////////////////////////
	this.importFileView=function(o){
		me.mod.open({
			id:'importmyNewcontac_Group_Id1',
			xtype:'form',
			mode:'loop',
			width:600,
			height:226,
			track:[
				{name:'通讯录管理'},
				{name:'导入文件'}
			],
			fields:[
				{height:36,cols:[
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'选择通讯录文件:',width:350},
					{xtype:'blank',width:5},
					{xtype:'file',textAlign:'left',label:'浏览',itemId:'uploadDaoruFile',name:'uploadDaoruFile',width:300,success:function(){
							var form = me.mod.get('importmyNewcontac_Group_Id1');
							var nextStepButton = form.getByItemId('nextStepButton');
							nextStepButton.setEnabled(true);
					}},
					{xtype:'blank',width:20}					
				]}, 
				{height:36,cols:[
					{xtype:'label',textAlign:'center',textCls:'title_font',value:'可以导入从outlook、foxmail导出的通讯录文件(支持excel、cvs格式)',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'导入到组:',width:350},
						{xtype:'blank',width:5},
						{xtype:'combo',name:'parentUuid',displayValue:'value',displayField:'text',store:{
								service:$sl.gcontact_personTonXun_persongerenTonxunLu_getMyBookGroups.service,
								method:$sl.gcontact_personTonXun_persongerenTonxunLu_getMyBookGroups.method,
								params:{}
							},width:120},
						{xtype:'blank',width:20}					
				]},
				{height:30,cols:[
					{xtype:'label',textAlign:'right',value:'如果遇到重名联系人:',width:350},
					{xtype:'blank',width:5},
					{xtype:'radiogroup',name:'flag',itemId:'flag',textAlign:'left',width:220,radios:[
						{displayValue:'跳过',checked:true,value:'1',width:100},
						{displayValue:'覆盖',value:'2',width:100}
					]}
				]},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					//{xtype:'button',itemId:'confirmUploadButtotn',value:'确定',width:100,handler:me.queimportMy22333Contact},
					{xtype:'button',itemId:'nextStepButton',value:'下一步',width:100,handler:function(){
						return me.openMappingView();
					}},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.get('importmyNewcontac_Group_Id1');
						addcaontactform.reset();
						me.mod.goback();
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			hiddens:[
				{name:'uuid',itemId:'uuidForImportWenjian'}
				//nodeUuid
			],
			initMethod:function(mod){
				var form = me.mod.get('importmyNewcontac_Group_Id1');
				var nextStepButton = form.getByItemId('nextStepButton');
				nextStepButton.setEnabled(false);
			}
		});
		return me.importFileView;
	}
	
	this.openMappingView=function(){
		var url = 'modules/gmyContact/contactTonXun/personImportContact.js';
		var f=me.mod.get('importmyNewcontac_Group_Id1');
		var d=f.serializeForm();
		if(!d.uploadDaoruFile){
			me.mod.alert({
				text:'请选择导入文件',
				level:'error',
				delay:3000
			})
		}else{
			d.flag=f.getByItemId('flag').getValue();
			me.mod.remoteOpen({
				url:url,
				params:{
					fn:me.importFileView,
					value:d,
					fn:me.openMainGridAgain
				}
			})
		}
	}
	
	//下载模板
	this.downloadTemplate = function() {
		mc.download('dfc967d4-1681-4799-8bd8-d74442451608')
	}
	
	
	this.queimportMy22333Contact = function(){//导入联系人
		var form = me.mod.get('importmyNewcontac_Group_Id1');
		var nodeUuid = form.getByItemId('importWenjiannodeDeuuid');
		var uuidForImportWenjian = form.getByItemId('uuidForImportWenjian');
		if(parentForImportUUid){
			nodeUuid.setValue(parentForImportUUid);//目录的uuid
		}
		var o = form.serializeForm();
		if(!o.uuid){
			o.uuid = uuidForImportWenjian.getValue();
		}
		form.submit({
			service:$sl.gcontact_personTonXun_persongerenTonxunLu_queimportMy22333Contact.service,
			method:$sl.gcontact_personTonXun_persongerenTonxunLu_queimportMy22333Contact.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					form.reset();
					var neededDaoRuGroupNameid = form.getByItemId('neededDaoRuGroupNameid');
					neededDaoRuGroupNameid.setValue('');
					me.mod.popMgr.close('importmyNewcontac_Group_Id1');
					if(importGroupFlagAtPageGrid == '1'){//导入组
						me.reloadOrgViewCenterGrid();
					}else{
						me.reloadCenterMainGird();
					}
					importGroupFlagAtPageGrid = null;
				}
			}
		});
	}
	
	
	this.opentonghandlerradiogroup1 = function(){
		givePerssionActFlag = 'right';
		//members = [];
		//sendToTemp = [];
		me.mod.showExpandView('tonXunBoookTree');
		var form = me.mod.get('givePersionTOuserAtRightpageId');
		var textForSend = form.getByItemId('zhidingDuixiangTextId2');
		textForSend.setEnabled(true);
	}
	
	this.opentonghandlerradiogroup2 = function(){
		//关闭左侧，同时输入框变灰色
		me.mod.closeExpandView('tonXunBoookTree');
		var form = me.mod.get('givePersionTOuserAtRightpageId');
		var textForSend = form.getByItemId('zhidingDuixiangTextId2');
		textForSend.setEnabled(false);
		textForSend.removeData();
		//members = [];
		
	}
	this.opentonghandlerradiogroup3 = function(){
		givePerssionActFlag = 'grid';
		//sendToTemp = [];
		var form = me.mod.get('givePersionToUserpageId');
		var sendText = form.getByItemId('zhidingDuixiangTextId');
		sendText.setEnabled(true);
		me.mod.showExpandView('tonXunBoookTree');
	}
	var exportUuid;
	var titleValueFlag;
	var titleValue;
	this.expoContactFolder = function(e,o){//导出通讯录或者导出组
		exportUuid = o.get('data').uuid;
		if(o.get('data').bookType=='2' && o.get('data').type=='2'){
			titleValue = '导出组:'+o.get('data').name;
			titleValueFlag = '1';
		}else{
			titleValue = '导出通讯录';
			titleValueFlag = '0';
		}
		me.mod.open({
			id:'exportMyTonxunluId',
			xtype:'form',
			mode:'pop',
			width:600,
			height:150,
			fields:[
				{height:25,cols:[
					{xtype:'blank',width:20},
					{xtype:'label',textAlign:'left',textCls:'title_font',itemId:'setTitleValue',width:'max'},
					{xtype:'blank',width:'max'},
					{xtype:'blank',width:20}			
				]},
				'-',
				{height:36,cols:[
					{xtype:'blank',width:20},
					{xtype:'label',top:8,textAlign:'left',textCls:'title_font',value:'导出文件类型：',width:120},
					{xtype:'blank',width:5},
					{xtype:'radiogroup',name:'type', cursor:'pointer',radios:[
							{displayValue:'Excel文件',checked:true,value:'1',width:100},
							{displayValue:'CVS文件',value:'2',width:100}
						]},
					{xtype:'blank',width:20}			
				]},
				{height:36,cols:[
					{xtype:'blank',width:'max'},
					{xtype:'button',width:100,value:'确定',handler:me.daochuTongxunLu},
					{xtype:'blank',width:10},
					{xtype:'button',width:100,value:'取消',handler:function(){
						var form  = me.mod.get('exportMyTonxunluId');
						form.reset();
						me.mod.popMgr.close('exportMyTonxunluId');
						titleValueFlag = null;
						titleValue = null;
					}},
					{xtype:'blank',width:'max'}			
				]}
				
			],
			hiddens:[
				//{name:'uuid',value:o.get('data').uuid}
			],
			initMethod:function(mod){
				var form  = me.mod.get('exportMyTonxunluId');
				var setTitleValue = form.getByItemId('setTitleValue');
				setTitleValue.setValue(titleValue)
			}
		});
		
	}
	
	this.daochuTongxunLu = function(e,datao){//{name:'uuid',value:o.get('data').uuid}
		var form  = me.mod.get('exportMyTonxunluId');
		var o = form.serializeForm();
		if(o.uuid == undefined){
			o.uuid = exportUuid;
		}
		var service,method;
		if(titleValueFlag =='0'){//导出通讯录
			service = $sl.gcontact_contactTonXun_gcontactTonXun_expoContactFolder.service;
			method = $sl.gcontact_contactTonXun_gcontactTonXun_expoContactFolder.method;
		}
		
		if(titleValueFlag == '1'){//导出组
			service = $sl.gcontact_contactTonXun_gcontactTonXun_expoContactFolder_exportGroup.service;
			method = $sl.gcontact_contactTonXun_gcontactTonXun_expoContactFolder_exportGroup.method;
		}
		form.submit({
			service:service,
			method:method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					mc.download(data.uuid); 
					form.reset();
					me.mod.popMgr.close('exportMyTonxunluId');
					titleValueFlag = null;
					titleValue = null;
				}
			}
		});
		
	}
	
	this.daoruNewContactFolder = function(e,o){// 组织通讯录导入联系人
		contactName = o.get('data').name;//通讯录的名字
		tonxunLuUUid = o.get('data').uuid;//通讯录的uuid
		me.mod.open({
			id:'daoruOrgLianxiren_formId',
			xtype:'form',
			mode:'loop',
			acts:{
				track:[
					{value:'下一步',handler:me.hanlderNextStepForImportOrgBook},
					{value:'取消',handler:function(){
					me.mod.goback();//importmyNewcontac_Group_Id1
					}}
				],
				clip:[],
				grid:[]
			},
			track:[
				{name:'通讯录管理'},
				//{name:contactName},
				{name:'导入'}
			],
			fields:[
				{height:30,cols:[
					{xtype:'blank',width:20},
					{xtype:'label',top:4,textAlign:'right',textCls:'title_font',value:'通讯录名称：',width:100},
					{xtype:'blank',width:5},
					{xtype:'label',top:5,textAlign:'left',leftHidden:true,name:'',value:contactName,width:'max'},
					{xtype:'blank',width:20}			
				]},
				{height:30,cols:[
					{xtype:'blank',width:20},
					{xtype:'label',top:4,textAlign:'right',textCls:'title_font',value:'联系人来源：',width:100},
					{xtype:'blank',width:5},
					{xtype:'radiogroup',itemId:'platFormChooseId',radios:[
							{displayValue:'平台',checked:true,on:{'click':me.improFromPingtaiFun},value:1,width:80},
							{displayValue:'文件',value:'',width:80,on:{'click':me.clickImportBookPersonFromplat}}
					]}
//					{xtype:'radio',name:'',cursor:'pointer',checked:true,value:1,itemId:'platFormChooseId',displayValue:'平台',width:80},
//					{xtype:'blank',width:10},
//					{xtype:'radio',name:'',cursor:'pointer',checked:true,value:'',itemId:'platFormChooseFile_Id',click:function(){alert('333')},displayValue:'文件',width:80},
//					{xtype:'blank',width:20}
					
				]}
				
			],
			hiddens:[],
			initMethod:function(mod){
				
			}
		});
	}
	
	this.improFromPingtaiFun = function(){//从平台导入
		me.mod.historyMgr.reloadActs([
				{value:'下一步',handler:me.hanlderNextStepForImportOrgBook},
					{value:'取消',handler:function(){
					me.mod.goback();//importmyNewcontac_Group_Id1
					}}
		]);
		me.mod.popMgr.close('importmyNewcontac_Group_Id1');
	}
	
	this.clickImportBookPersonFromplat = function(){//从文件导入联系人
		me.mod.historyMgr.reloadActs([
		]);
		me.daoruRelateMan();
	}
	
	var orgImportRelateType;//组织通讯录导入的平台类型 1、LDAP  2、其他系统
	var pingtaiId;;
	this.hanlderNextStepForImportOrgBook = function(){//组织通讯录导入联系人点击下一步的操作
		var form = me.mod.get('daoruOrgLianxiren_formId');
		var platFormChooseId = form.getByItemId('platFormChooseId');
		orgImportRelateType = platFormChooseId.getValue();//type：//  	1、LDAP  2、其他系统
		pingtaiId = platFormChooseId.getValue();
		me.mod.open({
			id:'import_OrgBookTonXunluAtFirstMainGrid_Id',
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			usePage:true,
			currentPage:1,
			key:'import_OrgContatRelatManFormPlat_form',
			track:[
				{name:'通讯录管理'},
				{name:'导入'}//组织通讯录的名字
			],
			acts:{
				track:[	],
				clip:[
					{value:'完成导入' ,handler:me.finishImportOrgContact}
				],
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.openImportRelaPeople_fromPlataform}
				]
			},
			store:{
				service : $sl.gcontact_contactTonXun_gcontactTonXun_hanlderNextStepForImportOrgBook.service,
				method : $sl.gcontact_contactTonXun_gcontactTonXun_hanlderNextStepForImportOrgBook.method,
				params:{
					uuid:'',  //parentkeyUuid : '标识' ,type：//1 LDAP  2其他系统
					type:orgImportRelateType
				},
				success:function(data,mod){
				}
			},
			colnums:[
					{header:'名称(组)',cursor:'pointer',handler:me.openImportRePeo_fromPlatform,textAlign:'left',width:'max',mapping:'name'},
					{header:'电话(手机)',textAlign:'left',width:180,mapping:'phone'},
					{header:'邮箱',width:180,mapping:'email'},	
					{header:'备注',mapping:'remark',type:'tips'}
				],
			initMethod:function(mod){
			}
		});
	}
	
	this.openImportRePeo_fromPlatform = function(e,o){
		if(o.type == '1'){
			me.mod.remoteOpen({
				url:'modules/gmyContact/organizationTonXun/viewImportPeopleInfo.js',
				params:{
					data:o
				}
			});
		}
		
		if(o.type == '2'){
			me.goonLookAtImortQuery(o);
		}
	}
	

	var conuntNUmberg = 0;
	this.openImportRelaPeople_fromPlataform = function(e,o){
		var transdata = o.get('data');
		if(transdata.type == '1'){
			me.mod.remoteOpen({
				url:'modules/gmyContact/organizationTonXun/viewImportPeopleInfo.js',
				params:{
					data:transdata
				}
			});
		}
		if(transdata.type == '2'){
			me.goonLookAtImortQuery(transdata);
		}

	}
	
	this.goonLookAtImortQuery = function(transdata){//从LDAP导入的时候，二次查看操作。
			var form = me.mod.get('daoruOrgLianxiren_formId');
			me.mod.open({
				id:'import_OrgBookTonXunlu_goOnLookAtImport'+conuntNUmberg,
				xtype:'grid',
				mode:'loop',
				checkbox:true,
				usePage:true,
				currentPage:1,
				key:'import_OrgContatRelatManFormPlat_form',
				track:[
					{name:'通讯录管理'},
					{name:'导入'}//组织通讯录的名字
				],
				acts:{
					track:[	],
					clip:[
						{value:'完成导入' ,handler:me.finishImportOrgContact}
					],
					grid:[
						{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.openImportRelaPeople_fromPlataform}
					]
				},
				store:{
					service : $sl.gcontact_contactTonXun_gcontactTonXun_hanlderNextStepForImportOrgBook.service,
					method : $sl.gcontact_contactTonXun_gcontactTonXun_hanlderNextStepForImportOrgBook.method,
					params:{
						uuid:transdata.uuid,  //parentkeyUuid : '标识' ,type：//1 LDAP  2其他系统
						type:pingtaiId
					},
					success:function(data,mod){
					}
				},
				colnums:[
						{header:'名称(组)',cursor:'pointer',handler:me.openImportRePeo_fromPlatform,textAlign:'left',width:'max',mapping:'name'},
						{header:'电话(手机)',textAlign:'left',width:180,mapping:'phone'},
						{header:'邮箱',width:180,mapping:'email'},	
						{header:'备注',mapping:'remark',type:'tips'}
					],
				initMethod:function(mod){
					conuntNUmberg+=1;
				}
			});
		}

	this.finishImportOrgContact = function(){//完成组织通讯录的导入操作
		var clearuuids = [];
		var dataObject = [];//给后台的联系人集合
		var uuids = me.mod.clipboardMgr.getChecked();
		uuids.each(function(i,n){
			if(!n.uuid){n.uuid = ' '};if(!n.name){n.name = ' '};if(!n.type){n.type = ' '};
			if(!n.email){n.email = ' '};if(!n.phone){n.phone = ' '};if(!n.remark){n.remark = ' '};
			var object = {
					uuid:n.uuid,
					name:n.name,
					type:n.type,//如果1表示人；2表示该数据是组：
					email:n.email,
					phone:n.phone,
					remark:n.remark
			};
			dataObject.push(object);
			clearuuids.push(n.uuid);
		});
		var sendObject='';
		dataObject.each(function(i,n){
			sendObject+='{uuid:"'+n.uuid+'",name:"'+n.name+'",type:"'+n.type+'",email:"'+n.email+'",phone:"'+n.phone+'",remark:"'+n.remark+'"},';
		});
		sendObject = sendObject.substring(0,sendObject.length-1);
		sendObject = '['+sendObject+']';
		mc.send({
			service:$sl.gcontact_contactTonXun_gcontactTonXun_finishImportOrgContact.service,
			method:$sl.gcontact_contactTonXun_gcontactTonXun_finishImportOrgContact.method,
			params:{
				type:orgImportRelateType,
				bookUuid:tonxunLuUUid,
				dataObject:sendObject
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					me.mod.clipboardMgr.remove(clearuuids);//清空剪切板
					//回到主列表kk
					me.openMainGridAgain();
				}
			}
		});
		
	}
	
	this.copyConactFolder = function(e,o){//复制通讯录
		var uuid = o.get('data').uuid;
		if(uuid){
			me.mod.confirm({
			text:'确定复制该通讯录吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
						service:$sl.gcontact_contactTonXun_gcontactTonXun_copyConactFolder.service,
						method:$sl.gcontact_contactTonXun_gcontactTonXun_copyConactFolder.method,
						params:{
							uuid:uuid
						},//该通讯录的uuid
						success:function(response){
							var data = util.parseJson(response.responseText);
							if(data.success){
									me.mod.alert({
										text:data.msg,
										level:'info',
										delay:2000
									});
							me.reloadCenterMainGird();//刷新通讯录管理主列表
							}
						}
					})
				}else{}
			}
		})

		}
		
	}
	
	this.delshanchuContactNow = function(e,o){//删除通讯录
		var uuid = o.get('data').uuid;
		var uuids = [];
		uuids.push(uuid);
		if(uuid){
			me.mod.confirm({
			text:'确定删除该通讯录吗？(如果删除，则该通讯录中的联系人都将被删除)',
			handler:function(confirm){
				if(confirm){
					mc.send({
						service:$sl.gcontact_contactTonXun_gcontactTonXun_delshanchuContactNow.service,
						method:$sl.gcontact_contactTonXun_gcontactTonXun_delshanchuContactNow.method,
						params:{
							uuids:uuids
						},
						success:function(response){
							var data = util.parseJson(response.responseText);
							if(data.success){
									me.mod.alert({
										text:data.msg,
										level:'info',
										delay:2000
									});
									me.reloadCenterMainGird();//刷新通讯录管理主列表
							}
						}
					})
				}else{}
			}
		})

		}
		
	}
	
	this.editContactLu = function(e,o){//组织通讯录的编辑
		me.mod.open({
			id:'editmycontactFoldernowId',
			xtype:'form',
			mode:'pop',
			width:600,
			height:260,
			store:{//调用查看通讯录详细信息的接口
				service :$sl.gcontact_contactTonXun_gcontactTonXun_editContactLuforedit.service,
				method : $sl.gcontact_contactTonXun_gcontactTonXun_editContactLuforedit.method,
				params:{
					uuid:o.get('data').uuid
				},
				success:function(data,mod){
					//初始化编辑form
					var form = me.mod.get('editmycontactFoldernowId');
					var editMyContactUuid = form.getByItemId('editMyContactUuid');
					editMyContactUuid.setValue(data.uuid);//通讯录的uuid
					var editMyContactType = form.getByItemId('editMyContactType');
					editMyContactType.setValue(data.type);
					mc.fireEvent(form.get('editmycontactFoldernowId','loadForm',{data:data}))
				}
			},
			fields:[
				{height:25,cols:[
					{xtype:'blank',width:10},
					{xtype:'label',textAlign:'left',value:'通讯录编辑',textCls:'title_font',width:100},
					{xtype:'blank',width:'max'}
				]},
				'-',
				{height:40,cols:[
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'通讯录名称：',width:100},
						{xtype:'blank',width:5},
						{xtype:'text',top:5,textAlign:'left',leftHidden:true,name:'name',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{height:100,cols:[
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'备注：',width:100},
					{xtype:'blank',width:5},
					{xtype:'textarea',name:'remark',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',value:'确定',width:100,handler:me.savemyEditContactFolder},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var editmycontactFoldernowId = me.mod.get('editmycontactFoldernowId');
						editmycontactFoldernowId.reset();
						me.mod.popMgr.close('editmycontactFoldernowId');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			hiddens:[
				{name:'uuid',itemId:'editMyContactUuid'},
				{name:'type',itemId:'editMyContactType'}
			],
			initMethod:function(mod){
				
			}
		})
	}
	
	this.savemyEditContactFolder = function(){
		var form = me.mod.get('editmycontactFoldernowId');		
		var o = form.serializeForm();
		form.submit({
			service:$sl.gcontact_contactTonXun_gcontactTonXun_savemyEditContactFolder.service,
			method:$sl.gcontact_contactTonXun_gcontactTonXun_savemyEditContactFolder.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					form.reset();
					me.mod.popMgr.close('editmycontactFoldernowId');
					me.reloadCenterMainGird();
				}
			}
		});
	}
	
	this.changeSchelType  = function(v,record,o){//改变第一列的样式
		record.set('useLimit',false);
//		record.set('useTitle',false);
		if(v == '1'){//个人
			record.set('title','个人通讯录');
			return '<span class="my_addresslist_sign" style="width:30px;height:30px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>';		
		}
		if(v == '2'){//组织		
			if(o.role){
				if(!o.role.show){
					record.set('title','组织通讯录（只读）');
					return '<span class="mishandled_addresslist_sign" style="width:30px;height:30px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>';
				}
				if(o.role.show==true &&  !o.role.impower){//如果只是有查看的权限
						record.set('title','组织通讯录（只读）');
						return '<span class="mishandled_addresslist_sign" style="width:30px;height:30px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>';
				}
				if(o.role.show && o.role.impower){
						record.set('title','组织通讯录（管理）');
						return '<span class="manage_addresslist_sign" style="width:30px;height:30px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>';
				}	
			}
		}
		if(v == '3'){//团队
			record.set('title','团队通讯录');
			return '<span class="team_addresslist_sign" style="width:30px;height:30px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>';
		}
		return v;
	}
	
	this.createNewcontactFolder = function(){
		me.mod.open({
			id:'createmyNewcontactFolderId1',
			xtype:'form',
			mode:'pop',
			width:600,
			height:260,
			fields:[
				{height:25,cols:[
					{xtype:'blank',width:10},
					{xtype:'label',textAlign:'left',value:'新建通讯录',textCls:'title_font',width:100},
					{xtype:'blank',width:'max'}
				]},
				'-',
				{height:40,cols:[
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'通讯录名称：',width:100},
						{xtype:'blank',width:5},
						{xtype:'text',errorMsg:'名称不能够为空',top:5,textAlign:'left',leftHidden:true,name:'name',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{height:100,cols:[
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'备注：',width:100},
					{xtype:'blank',width:5},
					{xtype:'textarea',name:'remark',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[
					{xtype:'blank',width:'max'},	
					{xtype:'button',value:'确定',width:100,handler:me.quedingAddContact},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.get('createmyNewcontactFolderId1');
						addcaontactform.reset();
						me.mod.popMgr.close('createmyNewcontactFolderId1');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			hiddens:[
				{name:'type',value:'2'}//默认是'新建的是组'
			],
			initMethod:function(mod){
				
			}
		})
	}
	
	this.quedingAddContact = function(){//保存新建通讯录
		var giveUuid;//保存成功后返回的uuid
		var addNewContactform = me.mod.get('createmyNewcontactFolderId1');
		var o = addNewContactform.serializeForm();
		addNewContactform.submit({
			service:$sl.gcontact_contactTonXun_gcontactTonXun_quedingAddContact.service,
			method:$sl.gcontact_contactTonXun_gcontactTonXun_quedingAddContact.method,
			params:o,
			success:function(response){
						var data = util.parseJson(response.responseText);
						if(data.success){
							giveUuid = data.uuid;
//							me.mod.alert({
//								text:data.msg,
//								level:'info',
//								delay:2000
//								});
								//刷新主列表
								me.reloadCenterMainGird();
								addNewContactform.reset();
								me.mod.popMgr.close('createmyNewcontactFolderId1');
								//赋予默认的权限开始
								//给全部的用户拒绝可见、管理的权限。
									mc.send({
										service:$sl.gcontact_contactTonXun_gcontactTonXun_saveGivePersionToUser.service,
										method:$sl.gcontact_contactTonXun_gcontactTonXun_saveGivePersionToUser.method,
										params:{
											members:'[{loginName:"everyone",type:"2"}]',
											roleType:'2',
											role:'{show:"true",impower:"true"}',
											uuid:data.uuid//通讯录的uuid
										},
										success:function(response){
											var data = util.parseJson(response.responseText);
											if(data.success){
//												me.mod.alert({
//													text:data.msg,
//													level:'info',
//													delay:2000
//												});
												//在给创建者赋予管理权限。
												mc.send({
													service:$sl.gcontact_contactTonXun_gcontactTonXun_saveGivePersionToUser.service,
													method:$sl.gcontact_contactTonXun_gcontactTonXun_saveGivePersionToUser.method,
													params:{//	loginName:mc.username
														members:'[{loginName:"'+mc.username+'",type:"1"}]',
														roleType:'1',
														role:'{show:"true",impower:"true"}',
														uuid:giveUuid//通讯录的uuid
													},
													success:function(response){
														var data = util.parseJson(response.responseText);
														if(data.success){
															me.mod.alert({
																text:'新建通讯录成功，默认授权操作成功！',
																level:'info',
																delay:2000
															});
														}
													}
												});
											}
										}
									});
						}
				}
		});
	}
	var geivePerssionUuid;
	this.givePersionToUser = function(e,o){//grid授权
		contactName = o.get('data').name;
		geivePerssionUuid = o.get('data').uuid;
		me.mod.open({
			id:'givePersionToUserpageId',
			xtype:'form',
			mode:'loop',
			track:[
				{name:'通讯录管理'},
				{name:contactName,handler:function(){me.mod.goback()}},
				{name:'授权'}
			],
			acts:{
				track:[
					{value:'保存',handler:me.saveGivePersionToUser},
					{value:'取消',handler:function(){
						var form = me.mod.get('givePersionToUserpageId');
						form.reset();
						me.mod.closeExpandView('tonXunBoookTree');
						me.mod.goback();
						
					}}
				],
				clip:[],
				grid:[]
			},
			fields:[
				{height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'通讯录名：',width:100},
					{xtype:'blank',width:8},
					{xtype:'label',textAlign:'left',itemId:'getContactNameForGrid',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',top:4,textAlign:'right',textCls:'title_font',value:'授权对象：',width:100},
					{xtype:'blank',width:5},
					{xtype:'radiogroup',width:180,name:'',itemId:'givePerssionToUsersid',cursor:'pointer',radios:[
							{displayValue:'所有对象',checked:true,value:'everyone',width:100,on:{'click':me.opentonghandlerradiogroup5}},
							{displayValue:'指定对象',value:'',width:80,on:{'click':me.opentonghandlerradiogroup3}}
					]},
					//{xtype:'text',itemId:'zhidingDuixiangTextId',leftHidden:true,name:'',width:250},
					{xtype : 'textplus',width : 250,name :'members',itemId:'zhidingDuixiangTextId',listeners : ({
												'click' : function(){
												}
											}),
						defaultField : 'name',
						fields : ['uuid', 'type', 'name']
					},
		            {xtype:'blank',width:20}
				]},
				{height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',top:4,textAlign:'right',textCls:'title_font',value:'授权操作：',width:100},
					{xtype:'blank',width:5},
					{xtype:'radiogroup',width:'max',cursor:'pointer',name:'roleType',radios:[
							{displayValue:'允许',checked:true,value:'1',width:100},
							{displayValue:'拒绝',value:'2',width:80}
					]},
					{xtype:'blank',width:20}
				]},
				{height:30,cols:[
					{xtype:'blank',width:5},
					{xtype:'label',top:4,textAlign:'right',textCls:'title_font',value:'授予权限：',width:100},
					{xtype:'blank',width:5},
					{xtype:'checkbox',name:'show',checked:true,modle:'role',displayValue:'可见',value:true,width:100},
					{xtype:'checkbox',name:'impower',modle:'role',displayValue:'管理',value:true,width:100},
					{xtype:'blank',width:'max'}
					]
				},
				{height:36,cols:[
					{xtype:'blank',width:30},
					{xtype:'label',top:4,textAlign:'left',textCls:'title_font',value:'已存在的权限列表：',width:200},
					{xtype:'blank',width:'max'}
				]}
				//{height:40,title:'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;授权对象'},
			],
			initMethod:function(mod){
				var form  = me.mod.get('givePersionToUserpageId');
				var givePerssionAtrightConname_id = form.getByItemId('getContactNameForGrid');
				givePerssionAtrightConname_id.setValue(contactName);
				//加载已经授予的权限列表
				me.createAddContactQuanxianGrid(o);
				me.opentonghandlerradiogroup5();
			},
			hiddens:[
			]
		});
	}
	var addnewQuanxiangrid;//通讯录权限列表
	var tongXunluUuid;//要删除权限通讯录的uuid
	this.opentonghandlerradiogroup5 = function(){
		me.mod.closeExpandView('tonXunBoookTree');
		var form = me.mod.get('givePersionToUserpageId');
		var sendText = form.getByItemId('zhidingDuixiangTextId');
		sendText.removeData();
		sendText.setEnabled(false);		
		
	}
	this.createAddContactQuanxianGrid = function(o){
		tongXunluUuid = o.get('data').uuid;
		var form = me.mod.get('givePersionToUserpageId');
		addnewQuanxiangrid = new Gframe.controls.GridPanel({
			checkbox:false,
			borderHidden:true,
			colnums:[
				{header:'',width:25,textAlign:'left'},
				{header:'授权对象',width:'max',textAlign:'left',mapping:'showName'},
				{header:'授权',width:'max',textAlign:'left',renderer:me.getShouquanAtRender22,mapping:'roleType'},
				{header:'路径',width:'max',textAlign:'left',renderer:me.getShouquanAtRender22,mapping:'path'},
				{header:'权限',width:'max',textAlign:'left',renderer:me.changeRoleTYpe,mapping:'role'},
				{
				header:'操作',
						type:'act',
						mapping:'isDel',
						renderer:me.createbts
				}
			]			
		},{id:'newCreateContaPerviwGridId',width:'max',height:350,border:0});	
		mc.send({
			service:$sl.gcontact_contactTonXun_gcontactTonXun_createAddContactQuanxianGrid.service,
			method:$sl.gcontact_contactTonXun_gcontactTonXun_createAddContactQuanxianGrid.method,
			params:{
				uuid:o.get('data').uuid
			},
			success:function(response){
				//var data = util.parseJson(response.responseText);
				var data = eval('['+response.responseText+']');
				data = data[0];
				if(data){
						addnewQuanxiangrid.setData(data);
						mc.fireEvent(addnewQuanxiangrid.get('id'),'loadData',{data:data});
				}
				
			}
		});
		var colbar1 = new Colbar({cols:[],align:'left'},{width:'max',height:350});
		colbar1.addItem(addnewQuanxiangrid);
		form.addItem(10,colbar1);
		form.update();
	}
	
	this.createbts = function(v,record,o){
		if(o.isDel == 'true'){
			return [
				{name:'删除',imgCls:'delete_btn',handler:function(){
					me.mod.confirm({
					text:'确定删除该权限吗？',
					handler:function(confirm){
						if(confirm){
							mc.send({
							service:$sl.gcontact_contactTonXun_gcontactTonXun_delePurviewGridNow.service,
							method:$sl.gcontact_contactTonXun_gcontactTonXun_delePurviewGridNow.method,
							params:{
								nodeUuid:tongXunluUuid,
								loginName:o.loginName,
								roleType:o.roleType,
								type:o.type
							},
							success:function(response){
								var data = util.parseJson(response.responseText);
								if(data.success){
									me.mod.alert({
										text:data.msg,
										level:'info',
										delay:2000
									});
									me.reloadContactPersionGrid(tongXunluUuid);
								}
							}
							});
						}
					}
				});
				},value:'删除'}
			]
		}else{
		}
	}
	
	this.createbts2 = function(v,record,o){//删除根目录的权限
		if(o.isDel == 'true'){
			return [
				{name:'删除',imgCls:'delete_btn',handler:function(){
					me.mod.confirm({
					text:'确定删除该权限吗？',
					handler:function(confirm){
						if(confirm){
							mc.send({
							service:$sl.gcontact_contactTonXun_gcontactTonXun_delePurviewGridNow.service,
							method:$sl.gcontact_contactTonXun_gcontactTonXun_delePurviewGridNow.method,
							params:{
								nodeUuid:rootContactUuid,//对根节点权限的删除
								loginName:o.loginName,
								type:o.type,
								roleType:o.roleType
							},
							success:function(response){
								var data = util.parseJson(response.responseText);
								if(data.success){
									me.mod.alert({
										text:data.msg,
										level:'info',
										delay:2000
									});
									me.reloadContactPersionGrid2(rootContactUuid);
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
	
		
	
	
	this.changeRoleTYpe = function(v,record,o){
		record.set('useLimit',false);
		if(v.show && !v.impower){
			return '可见';
		}
		if(v.impower){
			return '可见、管理';
		}
		return v;
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
	
	var addnewQuanxiangrid2;//右侧按钮区域的权限列表
	this.createAddContactQuanxianGrid2 = function(){//右侧区域的授权权限列表
		var form = me.mod.get('givePersionTOuserAtRightpageId');
		addnewQuanxiangrid2 = new Gframe.controls.GridPanel({
			checkbox:false,
			borderHidden:true,
			colnums:[//path
				{header:'',width:25,textAlign:'left'},
				{header:'授权对象',width:'max',textAlign:'left',mapping:'showName'},
				{header:'授权',width:'max',textAlign:'left',renderer:me.getShouquanAtRender22,mapping:'roleType'},
				{header:'路径',width:'max',textAlign:'left',renderer:me.getShouquanAtRender22,mapping:'path'},
				{header:'权限',width:'max',textAlign:'left',renderer:me.changeRoleTYpe,mapping:'role'},
				{
				header:'操作',
						type:'act',
						mapping:'isDel',
						renderer:me.createbts2
				}
			]			
		},{id:'newCreateContaPerviwGridId2',width:'max',height:350,border:0});	
		mc.send({
			service:$sl.gcontact_contactTonXun_gcontactTonXun_createAddContactQuanxianGrid.service,
			method:$sl.gcontact_contactTonXun_gcontactTonXun_createAddContactQuanxianGrid.method,
			params:{
				uuid:rootContactUuid//获取根节点的权限
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
	
	
	
	this.saveGivePersionToUser = function(){//保存授权操作 grid区域
		var form = me.mod.get('givePersionToUserpageId');
		var text = form.getByItemId('givePerssionToUsersid');
		var nameTextNew = form.getByItemId('zhidingDuixiangTextId');
		var o = form.serializeForm();
		if(text.getValue() == 'everyone'){
			o.members = '[{loginName:"everyone",type:"3"}]';
		}else{
			var member='';
			if(o.members){var members = util.parseJson(o.members)};
			members.each(function(e,o){
			member+='{loginName'+':"'+ o.uuid+ '",'+'type:"'+o.type+'"},';
			});
			member = member.substring(0,member.length-1);
			member = '['+member+']';
			o.members = member;
		}
		if(!o.uuid){
			o.uuid = geivePerssionUuid;
		}
		var jsonRole = util.parseJson(o.role_modle);
		if(jsonRole.impower == 'null'){
			jsonRole.impower = false;
		}
		if(jsonRole.show == 'null'){
			jsonRole.show = false;
		}
		if(jsonRole.show == false && jsonRole.impower == false){
			me.mod.alert({
				text:'权限不能够为空，请选择权限',
				level:'error',
				delay:2000
			});
			me.mod.closeExpandView('tonXunBoookTree');
			return ;
		}
		var sendrole = '';
		sendrole = '{show:"'+jsonRole.show+'",impower:"'+jsonRole.impower+'"}';
		o.role_modle = sendrole;
		form.submit({
			service:$sl.gcontact_contactTonXun_gcontactTonXun_saveGivePersionToUser.service,
			method:$sl.gcontact_contactTonXun_gcontactTonXun_saveGivePersionToUser.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.alert({
						text:data.msg,
						level:'info',
						delay:2000
					})
					form.reset();
					nameTextNew.setEnabled(false);
					//刷新当前的通讯录下面的权限列表
					me.reloadContactPersionGrid(geivePerssionUuid);
					me.mod.closeExpandView('tonXunBoookTree');
				}
			
			}
		});
	}
		
	this.saveGivePersionToUser2 = function(){//保存授权操作//右侧按钮的保存
		var form = me.mod.get('givePersionTOuserAtRightpageId');
		var	alltext = form.getByItemId('everyOneGivePermissionson');
		var t = form.getByItemId('zhidingDuixiangTextId2');
		var o = form.serializeForm();
		if(alltext.getValue() == 'everyone'){
			o.members = '[{loginName:"everyone",type:"3"}]';
		}else{
			if(o.members){
				var member = '';
				var members = util.parseJson(o.members);
				members.each(function(i,n){
				member+='{loginName:"'+n.uuid+'",type:"'+n.type+'"},';
				});
				member = member.substring(o,member.length-1);
				member = '['+member+']';
				o.members = member;
			}
		}
		if(!o.uuid){
			o.uuid = rootContactUuid;
		}
		var jsonRole = util.parseJson(o.role_modle);
		
		if(jsonRole.impower == 'null'){
			jsonRole.impower = false;
		}
		if(jsonRole.show == 'null'){
			jsonRole.show = false;
		}
		if(jsonRole.show == false && jsonRole.impower == false){
		me.mod.alert({
			text:'权限不能够为空，请选择权限',
			level:'error',
			delay:2000
		});
		me.mod.closeExpandView('tonXunBoookTree');
		return ;
		}
		var sendrole = '';
		sendrole = '{show:"'+jsonRole.show+'",impower:"'+jsonRole.impower+'"}';
		o.role_modle = sendrole;	
		form.submit({
			service:$sl.gcontact_contactTonXun_gcontactTonXun_saveGivePersionToUser.service,
			method:$sl.gcontact_contactTonXun_gcontactTonXun_saveGivePersionToUser.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.alert({
						text:data.msg,
						level:'info',
						delay:2000
					})
					form.reset();
					t.setEnabled(false);
					//刷新当前的通讯录下面的权限列表
					me.reloadContactPersionGrid2(rootContactUuid);
					//关闭左侧面板
					me.mod.closeExpandView('tonXunBoookTree');
				}
			
			}
		});
	}
	
	this.reloadContactPersionGrid = function(uuid){
		mc.send({
			service:$sl.gcontact_contactTonXun_gcontactTonXun_createAddContactQuanxianGrid.service,
			method:$sl.gcontact_contactTonXun_gcontactTonXun_createAddContactQuanxianGrid.method,
			params:{
				uuid:uuid
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success == false){
					me.mod.goback();
					return ;
				}
				if(data){
						addnewQuanxiangrid.setData(data);
						mc.fireEvent(addnewQuanxiangrid.get('id'),'load');
				}
			},
			failure:function(){
				me.mod.goback();
			}
		});
		
	}
	
	this.reloadContactPersionGrid2 = function(uuid){
		mc.send({
			service:$sl.gcontact_contactTonXun_gcontactTonXun_createAddContactQuanxianGrid.service,
			method:$sl.gcontact_contactTonXun_gcontactTonXun_createAddContactQuanxianGrid.method,
			params:{
				uuid:uuid			
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
	
	this.reloadCenterMainGird = function(){
		var view = me.mod.getCentralView();
		if(view){
			view.dynamic.setStore({
				service : $sl.gcontact_contactTonXun_gcontactTonXun_defaultView.service,
				method : $sl.gcontact_contactTonXun_gcontactTonXun_defaultView.method,
				params:{
					//startDate:sdate,
					//endDate:edate
			},
			success : function(){
			}
			});
			view.dynamic.load();			
		}
	}
});