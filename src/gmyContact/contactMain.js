/**
 * 个人通讯录 田军
 */
new (function(){

	var me = this;
	
	var personTree;
	var orgTree;
	var teamTree;
	var allUuid;
	var allOptions;
	var toUUid;
    var miniTab;
	this.mod = new Gframe.module.Module({
		tabTitle:'通讯录',
		key:'contactOrg_clipboardKey',
		colnums:[
			{header:'名称',width:200,mapping:'name'}
		],
		navigation:{
			title:'通讯录',
			autoOpen:true,
			active:true,
			create : function(params){
				miniTab = Atom.create('Atom.panel.tab.MiniTab',{
                    refresh:false
				});
				miniTab.on('click',function(title,pams){
					if(pams.value==='2'){//组织通讯录
//						me.mod.remoteOpen({
//							url:'modules/gmyContact/organizationContact/organizationContact.js',
//							params:{}
//						});
					}else if(pams.value==='1'){//个人通讯录
						me.mod.defaultView();
					}else if(pams.value==='3'){//团队
						me.mod.remoteOpen({
							url:'modules/gmyContact/team/teams.js',
							params:{}
						});
					}
				});
				//个人通讯录
				miniTab.addItem({
					title:'我的联系人',
					params:{
						value:'1'
					},
                    refreshMethod:function(){
                        personTree.onclick({mark:true});
                    },
					create:function(params){
                        personTree = new Treebar({
//                            showSum:{
//                                showAll:true,
//                                show:true
//                            },
                            afterEditText:function(newValue,label,node){
                                mc.send({
                                    service:$sl.gmyContact_contactFolder_groupPerson_editGroupInfo.service,
                                    method:$sl.gmyContact_contactFolder_groupPerson_editGroupInfo.method,
                                    params:{
                                        name:newValue,
                                        uuid:node.options.uuid
                                    },
                                    success:function(response){
                                        var data = util.parseJson(response.responseText);
                                        if(data.success){
//                                            me.mod.alert({
//                                                text:data.msg,
//                                                level:'info',
//                                                delay:2000
//                                            });
                                            //刷新这个树
                                           var oldData = node.options;
                                            oldData.name = newValue;
                                            node.updateNode(oldData);
                                        }
                                    }
                                });
                            },
                            acts:[
                                  {value:'添加', width:'17', imgCls:'treeTool_add',
                                      renderer:function(node){
                                          if (node.options.nodeTag === 'noGroup' || node.options.nodeTag === 'all' || node.options.nodeTag === 'sendCard') {//未分组,
                                              return false;//不显示按钮
                                          } else {
                                              return true;
                                          }
                                      },
                                      handler:function (tree, node) {
                                      toUUid = node.options.uuid;
                                      me.addNewGroup();
                                  }
                                  },
                                {value:'修改', width:'17', imgCls:'treeTool_del',
                                    renderer:function(node){
                                        if (node.options.nodeTag === 'noGroup' || node.options.nodeTag === 'all' || node.options.nodeTag === 'sendCard') {//未分组,
                                            return false;//不显示按钮
                                        } else {
                                            return true;
                                        }
                                    },
                                    handler:function (tree, node) {
                                    tree.editNode({node:node});
                                }
                                },
                                {value:'删除',width:'17', imgCls:'treeTool_edit',
                                    renderer:function(node){
                                        if(node.options.nodeTag==='noGroup' || node.options.nodeTag==='all' || node.options.nodeTag==='sendCard'){//未分组,
                                            return false;//不显示按钮
                                        }else{
                                            return true;
                                        }
                                    },
                                    handler:function(tree, node){
                                    	me.mod.confirm({
                                    		text:'是否确定删除此组？',
                                    		handler: function(confirm){
                                    			if(confirm){
                                    				mc.send({
        		                                        service:$sl.gmyContact_contactFolder_contactMain_delGroups.service,
        		                                        method:$sl.gmyContact_contactFolder_contactMain_delGroups.method,
        		                                        params:{
        		                                            uuids:'["'+node.options.uuid+'"]'
        		                                        },
        		                                        success:function(response){
        		                                            var data = util.parseJson(response.responseText);
        		                                            if(data.success){
        		                                                me.mod.alert({
        		                                                    text:data.msg,
        		                                                    level:'info',
        		                                                    delay:2000
        		                                                });
        		                                            }
        		                                            //如果刷新这个树
        		                                            tree.delNode({node:node,handler:function(parentTree,parentNode){
        		                                            	parentTree.onclick({uuid:parentNode.data.uuid});
        		            	                            }});
//        		                                            me.refreshTree('1');
        		                                        }
        		                                    });
                                    			}
                                    		}
                                    	});

                                }}
                            ]
                        });


//							personTree = new Treebar({
//								serviceType:true,
//								//nodeEdit:true, //签名修改后的回调 默认true
//								showSum:true,
//                                //是否可编辑的预处理
//                                editRenderer:function (node) {
//                                    if (node.options.nodeTag === 'noGroup' || node.options.nodeTag === 'all' || node.options.nodeTag === 'sendCard') {//未分组,
//                                        return false;//不显示按钮
//                                    } else {
//                                        return true;
//                                    }
//                                },
//								actRenderer:function(node){
//								      if(node.options.nodeTag==='noGroup' || node.options.nodeTag==='all' || node.options.nodeTag==='sendCard'){//未分组,
//								        return false;//不显示按钮
//								      }else{
//								        return true;
//								      }
//   								 },
//        						afterEditText:function(newValue,node){
// 									mc.send({
//										service:$sl.gmyContact_contactFolder_groupPerson_editGroupInfo.service,
//										method:$sl.gmyContact_contactFolder_groupPerson_editGroupInfo.method,
//										params:{
//											name:newValue,
//											uuid:node.options.uuid
//										},
//										success:function(response){
//												var data = util.parseJson(response.responseText);
//												if(data.success){
//													me.mod.alert({
//														text:data.msg,
//														level:'info',
//														delay:2000
//													});
//													//刷新这个树
//													me.refreshTree('1');
//												}
//										}
// 									});
//        						},
//								acts:[
//									{name:'删除',handler:function(btn,node){
//										mc.send({
//											service:$sl.gmyContact_contactFolder_contactMain_delGroups.service,
//											method:$sl.gmyContact_contactFolder_contactMain_delGroups.method,
//											params:{
//												uuids:'["'+node.options.uuid+'"]'
//											},
//											success:function(response){
//												var data = util.parseJson(response.responseText);
//												if(data.success){
//													me.mod.alert({
//														text:data.msg,
//														level:'info',
//														delay:2000
//													});
//												}
//												//如果刷新这个树
//												me.refreshTree('1');
//											}
//										});
//
//									}}
//								]
//							});
							personTree.handler = function(node){
								var url,pams;
								if(node.options.nodeTag==='sendCard'){
									url = 'modules/gmyContact/personContact/contactFolder/recvCards.js';
									pams = pams || {};
									pams.data = node.options;
								}else if(node.options.nodeTag==='all'){
									pams = node.options;
									url = 'modules/gmyContact/personContact/personGrid.js';
								}else{
									pams = node.options;
									url = 'modules/gmyContact/personContact/personGrid.js';
								}
								me.mod.remoteOpen({
									url:url,
									params:pams
								});
							};
							//TODO
							personTree.renderer = function (tObj) {
	                            tObj.img = 'resources/tree/user/person_group_tree.png';
		                        return tObj;
		                    };
//							personTree.renderer = function(tObj){
//								if(tObj.nodeTag ==='all'){
//			                		tObj.open = true;
//			                	}							
//							};
							return personTree;
					},
					initMethod:function(params){
						me.refreshTree('1');
					}
				});
				//组织通讯录
				miniTab.addItem({
					title:'其他联系人',
					params:{
						value:'2'
					},
                    refreshMethod:function(){
                        orgTree.onclick({mark:true});
                    },
					create:function(params){
							orgTree = new Treebar({
//                                showSum:{
//                                    showAll:true,
//                                    show:true
//                                }
							});
							//TODO
							orgTree.renderer = function(tObj){
		                        tObj.img = 'resources/tree/user/contact_group_tree.png';
								return tObj;
							};
							orgTree.handler = function(node){
								var pams = node.options;
								if(node.options.memberType==='1' && node.options.type==='2'){//组或者通讯录是可以打开的
									var orgurl = 'modules/gmyContact/organizationContact/groupAndPersonGrid.js';
								}
								me.mod.remoteOpen({
									url:orgurl,
									params:{
										uuid:node.options.uuid,
										name:node.options.name
									}
								});
							};
							return orgTree;
					},
					initMethod:function(params){
						me.refreshTree('2');
					}
				});
				return miniTab;
			},
			initMethod:function(params){
				//此操作仅仅用于从列表中刷新固定导航中的树
				if(params.type){
					me.refreshTree(params.type,params.uuid);
				}
			}
		}
	
	});
	
	//刷新固定导航中的树
	this.refreshTree = function(type,uuid){
		var tree;
		if(type==='1'){
			tree = personTree
		}else if(type==='2'){
			tree = orgTree;
		}else if(type==='3'){
			tree = teamTree;
		};
		mc.send({
			service:$sl.gcontact_personContact_personContact_expandViewTreebar.service,
			method:$sl.gcontact_personContact_personContact_expandViewTreebar.method+'$_'+type,
			params:{
				type:type
			},
			success:function(response){
				if(type == '1'){
					var tObj = util.parseJson(response.responseText);
//					var tObject = tObj.data?tObj:tObj[0]?tObj[0]:'';
//					if(util.isObject(tObject)||util.isArray(tObject.data)){
//						if(util.isArray(tObject.data)&&tObj&&tObject.data){
//							tObject.data[0].open = true;
//		                } else if(tObject&&tObject.data){
//							tObject.data[0].open = true;
//		                }
//					}
					mc.fireEvent(tree.get('id'),'loadData',{obj:tObj});
	                var root = tree.getRoot();
	                if(uuid){
	                	 tree.onclick({uuid:uuid});
	                }else if(root && root.children[0]){
	                    tree.onclick(root.children[0]);
	                }
				}else if(type == '2'){
					mc.fireEvent(tree.get('id'),'loadData',{obj:response.responseText});
					var root = orgTree.getRoot();
					if (root.children.length > 0){
						orgTree.onclick(root.children[0]);
					}
				}else{
					mc.fireEvent(tree.get('id'),'loadData',{obj:response.responseText});
				}
				
			}
		});
	}
	
	//解散 退出团队
	this.delOrExistTeam = function(btn,node){
			mc.send({
				service:$sl.gcontact_organizationContact_delteMyTeam.service,
				method:$sl.gcontact_organizationContact_delteMyTeam.method,
				params:{
					uuid:node.options.uuid,
					flag:node.options.flag
				},
				success:function(response){
					var data = util.parseJson(response.responseText);
					if(data.success){
						me.mod.alert({
							text:data.msg,
							level:'info',
							delay:2000
						});
						//刷新这个树
						me.refreshTree('3');
					}
				}
			});
	}
	
	
	this.mod.defaultView = function(params){
		
//		me.mod.remoteOpen({
//			url:'modules/gmyContact/personContact/personGrid.js',//个人通讯录的我的全部联系人
//			params:{
//				option:{
//					nodeTag:'all'
//				}
//			}
//		});

	}
	
	this.addNewGroup = function(){
		me.mod.open({
			id:'createNewGroup',
			xtype:'form',
			mode:'pop',
			title:'新建组',
			width:500,
			height:120,
			fields:[
			
				{height:40,cols:[
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'组名：',width:100},
						{xtype:'blank',width:5},
						{xtype:'text',top:5,textAlign:'left',leftHidden:true,name:'name',width:'max',vtype:'vblank',errorMsg:'添加组失败，组名不能为空'},
						{xtype:'blank',width:20}					
				]}
//				,
//				{height:100,cols:[
//					{xtype:'label',textAlign:'right',textCls:'title_font',value:'备注：',width:100},
//					{xtype:'blank',width:5},
//					{xtype:'textarea',width:'max',name:'remark'},
//					{xtype:'blank',width:20}					
//				]}
//				,{height:36,cols:[
//					{xtype:'blank',width:'max'},	
//					{xtype:'button',value:'确定',width:100,handler:me.quedingAddnewBuildGroup},
//					{xtype:'blank',width:10},	
//					{xtype:'button',value:'取消',width:100,handler:function(){
//						var addcaontactform = me.mod.main.get('createNewGroup');
//						addcaontactform.reset();
//						me.mod.main.popMgr.close('createNewGroup');
//					}},
//					{xtype:'blank',width:'max'}	
//				]}
			],
			
				popBtn:[
					{name:'确定',value:'确定',itemId:'queding',handler:me.quedingAddnewBuildGroup},
					{name:'取消',value:'取消',handler:function(){
						var addcaontactform = me.mod.get('createNewGroup');
						addcaontactform.reset();
						me.mod.popMgr.close('createNewGroup');
					}}
				]
			,
			hiddens:[
	
			],
			initMethod:function(mod){
//				var pop = me.mod.popMgr.get('createNewGroup');
//				btn = pop.getButton("queding");
				
			}
		});
	}
	
	this.quedingAddnewBuildGroup  = function(){
		var pop = me.mod.popMgr.get('createNewGroup');
		var btn = pop.getButton("queding");
		btn.setEnabled(false);
		var form = me.mod.get('createNewGroup');
		var o  = form.serializeForm();
		o.uuid = toUUid;
		form.submit({
			service:$sl.gmyContact_contactFolder_contactMain_quedingAddnewBuildGroup.service,
			method:$sl.gmyContact_contactFolder_contactMain_quedingAddnewBuildGroup.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
//					me.mod.main.alert({
//						text:data.msg,
//						level:'info',
//						delay:2000
//					});
					form.reset();
					me.mod.popMgr.close('createNewGroup');
					//me.refreshThisGird();
					//TODO 刷新固定导航中个人通讯录的树personTree
					me.mod.getNavigation().initMethod({type:'1',uuid:data.groupUuid});
					btn.setEnabled(true);
				}
			},
			failure:function(){
				btn.setEnabled(true);
				return true;
			}
		},function(){
			btn.setEnabled(true);
		});
	}
	
});