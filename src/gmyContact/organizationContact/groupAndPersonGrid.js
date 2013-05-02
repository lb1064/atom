/**
 * 组织通讯录，组和人的列表
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({
		
	});
	
	var uuid;
	var name;
	var gridPath,trackpath;
	var bookEditPriv;
	this.mod.defaultView = function(params){
		uuid = params.uuid || '';
		name = params.name || '';
		me.mod.main.open({
			id:'groupAndPerson_id'+new Date().getTime(),
			xtype:'grid',
			mode:'loop',
			//key:'orgGroupAndPerson_gridId',
			checkbox:true,
			currentPage:1,
			usePage:true,
			searchConfig:{
				useSearch:true,
				handler:function(e,obj){
					var o  = {};
					o.key = obj.getValue();
					o.groupUuid = trackpath[trackpath.length-1].value;
					me.mod.main.remoteOpen({
						url:'modules/gmyContact/organizationContact/serchPersonResult.js',
						params:{
							data:o,
							trackPath:trackpath
						}
					});
				}
			},
			store:{
				service:$sl.gcontact_personContact_personContact_getChildrenByuuid.service,
				method:$sl.gcontact_personContact_personContact_getChildrenByuuid.method+'$_'+uuid,
				params:{
					uuid:uuid,
					type:'2'
				},
				success:function(data,mod){
					gridPath = data.path.slice(0);
					trackpath = data.path.slice(0);
				//	trackpath = [{name:'我的通讯录',cursor:'false'}].concat(trackpath);
					gridPath = [{name:'我的通讯录',cursor:'false'}].concat(gridPath);
					for(var i=2;i<trackpath.length-1;i++){
						trackpath[i].handler = function(e,o){
							me.mod.defaultView({uuid:o.getName()});
						}
					};
					//点击第一个节点，打开的是所有通讯录的列表
					trackpath[1].handler = function(e,o){
						me.mod.main.remoteOpen({
							url:'modules/gmyContact/organizationContact/organizationContact.js',
							params:{}
						});
					};
					me.mod.main.reloadTrack(trackpath);
				}
			},
			actFilter:function(data,purview){
				purview['all'] = true;
				if(data.memberType==='1'){//1 组 ，2 人
					purview['group'] = true;
					purview['person'] = false;
					purview['show'] = false;
				}else{
					purview['group'] = false;
					purview['person'] = true;
					purview['show'] = true;
				}
				if(purview.edit){
					purview['copyTo'] = true;
				}else{
					purview['copyTo'] = false;
				}
				return purview;
			},
			acts:{
				grid:[
					//{name:'打开',value:'打开',imgCls:'openfolder_btn',handler:me.openChildren,exp:'show&&group'},
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.showPersonDetail,exp:'show&&person'}
//					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editGroup,exp:'edit'},
//					{name:'排序',value:'排序',imgCls:'continuesend_btn',handler:me.setSortData,exp:'edit'}
				],
				clip:[ 
//					{name:'生成群',value:'生成群',handler:me.createTeam,exp:'show'},
//					{name:'移动到',value:'移动到',handler:me.moveToHere,exp:'show'},
					{name:'复制到',value:'复制到',handler:me.copyToHere,exp:'show'}
//					{name:'删除',value:'删除',handler:me.delGroupPerson,exp:'edit'}
				],
				track:[
//					{name:'搜索',value:'搜索',handler:me.serchPerson,exp:'show'},
//					{name:'新建联系人',value:'新建联系人',handler:me.buildPerson,exp:'edit'},
//					{name:'新建组',value:'新建组',handler:me.buildGroup,exp:'edit'}
				]
			},
			colnums:[
				{header:'图标',textHidden:true,mapping:'iconUuid',renderer:me.changeFileImg,width:25,textAlign:'center'},
				{header:'名称',width:100,cursor:'pointer',mapping:'name',textAlign:'left',handler:me.openChildrenToo},
				{header:'',width:30,textAlign:'left'},
				{header:'电话',width:80,renderer:me.renderPhone,mapping:'phones',textAlign:'left'},
				{header:'图标',textHidden:true,mapping:'phones',renderer:me.showMessage,handler:function(e,o){me.show(e,o,o.phones)},width:20,textAlign:'left'},
				{header:'',width:80,textAlign:'left'},
				{header:'邮箱',mapping:'intraEmail',width:'max',textAlign:'left'},
//				{header:'邮箱',mapping:'emails',renderer:me.renderEmail,width:'max'},
//				{header:'图标',textHidden:true,mapping:'emails',renderer:me.showMessage,handler:function(e,o){me.show(e,o,o.emails)},width:25,textAlign:'left'},
				{header:'职务',mapping:'post',width:'max',textAlign:'left'},
				{header:'所属部门',mapping:'organization',width:'max',textAlign:'left'},
				{header:'备注',type:'tips',width:'max',mapping:'remark'}
				
			],
			initMethod:function(mod){
				
			}
		
		});
	}
	
	this.openRootOrgContact = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/organizationContact.js',
			params:{
				
			}
		});
	}
	
	this.createTeam = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/team/createTeam.js',
			params:{
				targetFlag:'2'
			}
		});
	}
		//用于显示信息
	this.showMessage = function(v,record,o){
		record.set('useLimit',false);
//		record.set('useTitle',false);
		if(Atom.isArray(v) && v.length>1){
			record.set('title','更多信息');
			record.setCursor('pointer');
			return '<img src="adapter/images/images/label_messageTip.png"/>';
		}else{
			record.setCursor('');
			return ' '
		}
	}
	this.show = function(e,o,d){
		if(e.getIsShow()){
			return;
		}else{
			e.setIsShow(true);
		}
		if(d.length>1){
			me.createContent(d,e);
		}
	}
	//创建content面板
	this.createContent = function(data,record){
		var labelHeight = 25;
		var countHeight = 25*data.length;
		var v = [];
		var w = 100;
		var targetXY = Atom.absPos(record.getdom());
		data.each(function(i,n){
			var str = n.key+':'+n.value;
				w = w>Atom.getWordWidth(str,'messageTitleCls')?w:Atom.getWordWidth(str,'messageTitleCls');
			var testLabel = Atom.create('Atom.form.Label',{
						textCls:'messageTitleCls',
						value:n.key+':'+n.value,
						style:{
							height:labelHeight,
							widht:w
						}
				});
			v.push(testLabel)
		});
		var h = Atom.create('Atom.panel.VBox',{
								id:'hbox1',
								align:'right',
								valign:'middle',
								style:{
									height:countHeight,
									width:w
								},
								items:v
							});
		targetXY.y = targetXY.y+parseInt(record.getdom().style.height);
		me.showTipView(h,countHeight,targetXY,record,w);
	}
	//显示信息面板
	this.showTipView = function(content,height,targetXY,e,w){
		var s = Atom.create('Atom.panel.MessagePanel',{
							anim:'down',
							style:{
								width:w+26,
								height:height+26
							},
							container:content,
							targetXY:targetXY
						});
		s.show();
		s.on('afterActive',function(){
			if(!e.getLabel().getIsblur()){
				if(s.getIsmouseOver()){
					s.on('domBlur',function(){
						s.close();
						e.setIsShow(false);
					})
				}else{
					s.close();	
					e.setIsShow(false);
				}
			}else{
				e.blur(function(){
					if(s.getIsmouseOver()){
						s.on('domBlur',function(){
							s.close();
							e.setIsShow(false);
						})
					}else{
						s.close();	
						e.setIsShow(false);
					}
				});
			}
		});
		var scrollbar = me.mod.main.getCentralView().getScroll().getScrollBar();
		scrollbar.on('mousemove',function(top){
			if(s.getIsOpen()){
				s.close();
			}
		});
	}
	//删除选中的组和人
	this.delGroupPerson = function(){
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
		me.mod.main.confirm({
			text:'确认删除选中的联系人吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
						service:$sl.gcontact_organizationContact_deleteGroup.service,
						method:$sl.gcontact_organizationContact_deleteGroup.method,
						params:{
							uuids:util.json2str(sumitUuid)
						},
						success:function(response){
							var data = util.parseJson(response.responseText);
							if(data.success){
								me.mod.main.alert({
									text:data.msg,
									level:'info',
									delay:2000
								});
								me.mod.main.clipboardMgr.remove(uuids);
								me.refreshGrid();//刷新当前的列表
							}
						}
					});
				}
			}
			
		})
	}
	
	this.renderPhone = function(v,record,o){
		record.set('useLimit',false);
		if(Atom.isArray(v)){
			for(var i = 0;i<v.length;i++){
				if(v[i].value){
					return v[i].value;
				}
			}
		}
		return '';
	}
	
	this.renderEmail = function(v,record,o){
		record.set('useLimit',false);
		var str = '';
		if(Atom.isArray(v)){
			for(var i = 0;i<v.length;i++){
				if(v[i].value){
					return v[i].value;
				}
			}
		}
		return '';
	}
	
	this.changeFileImg = function(v,record,o){
		record.set('useLimit',false);
		if(o.isSystemUser==='1'){//系统用户
			record.set('title','系统用户');
			return '<span class="meetingman_img">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
		}else{
			return '<span style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
		}
	}
	
	
	//创建分组
	this.buildGroup = function(){
		var m = gridPath.length-1;
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/editGroup.js',
			params:{
				tag:'build',
				obj:me,
				uuid:gridPath[m].value
			}
		});
	}
	
	//编辑分组
	this.editGroup = function(e,o){
		if(o.get('data').memberType==='1'){//编辑分组
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/organizationContact/editGroup.js',
				params:{
					uuid:uuid,
					obj:me,
					lineData:o.get('data')
				}
			});
		}else{
			me.mod.main.remoteOpen({//编辑联系人
				url:'modules/gmyContact/organizationContact/editPerson.js',
				params:{
					uuid:uuid,
					obj:me,
					gridPath:gridPath,
					data:o.get('data')
				}
			});
		}
	}
	
	this.openChildren = function(e,o){
		me.mod.defaultView({uuid:o.get('data').uuid});
	}
	
	this.openChildrenToo = function(e,o){//memberType 1表示组  2 表示的是人 
		if(o.memberType==='1'){
			me.mod.defaultView({uuid:o.uuid});
		}else{
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/organizationContact/viewPerson.js',
				params:{
					uuid:o.uuid,
					data:o,
					obj:me,
					gridPath:gridPath
				}
			});
		}
	}
	
	this.serchPerson = function(){
		var m = gridPath.length-1;
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/serchPerson.js',
			params:{
				uuid:gridPath[m].value,
				trackPath:trackpath
			}
		});
	}
	
	//新建联系人
	this.buildPerson = function(){
		var m = gridPath.length-1;
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/buildPerson.js',
			params:{
				toUuid:gridPath[m].value,
				name:name,
				gridPath:gridPath
			}
		});
	}
	
	this.setSortData = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/giveSort.js',
			params:{
				uuid:o.get('data').uuid,
				lineData:o.get('data'),
				obj:me
			}
		});
	}
	
	//查看联系人的详情信息
	this.showPersonDetail = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/viewPerson.js',
			params:{
				uuid:o.get('data').uuid,
				data:o.get('data'),
				obj:me,
				gridPath:gridPath
			}
		});
	}
	
	//移动到此
	this.moveToHere = function(){
		var clipdata = me.mod.main.clipboardMgr.getChecked();
		var uuids = [],clearUuids = [];
		clipdata.each(function(i,n){
			clearUuids.push(n.uuid);
			if(n.type!=3){
				uuids.push(n.uuid);	
			}
		});
		var m = gridPath.length-1;
		var targetUuid = gridPath[m].value;
		if(uuids.length){
			me.mod.main.showUserPanel({fileMode:1,selectMode:1,type:4,submit:function(data){
				mc.send({
					service:$sl.gmyContact_contactFolder_groupPerson_moveToHere.service,
					method:$sl.gmyContact_contactFolder_groupPerson_moveToHere.method,
					params:{
						uuids:util.json2str(uuids),
					//	toUuid:toUUid
					    toUuid:data[0].uuid
					    //gmyContact_contactFolder_groupPerson_moveToHere
					},
					success:function(response){
						var data = util.parseJson(response.responseText);
						if(data.success){
							me.mod.main.alert({
								text:data.msg,
								level:'info',
								delay:2000
							});
							me.mod.main.clipboardMgr.remove(clearUuids);//清空剪切板	
							me.refreshThisGird();
						}
					}
				});
				}
			});
		}else if(!uuids.length && clearUuids.length){
			me.mod.main.alert({
				text:'所选择的数据不符合移动规则！',
				level:'error',
				delay:3000
			});
			me.mod.main.clipboardMgr.remove(clearUuids);//清空剪切
		}
	}
	
	this.checkDataFunction = function(data,uuids,targetUuid,clearUuids){
		var uuids = uuids;
		if(data.messageValue=='1' || data.messageValue=='2'){
			me.mod.main.alert({
				text:data.msg,
				level:'info',
				delay:2000
			});
			me.mod.main.clipboardMgr.remove(uuids);
			//刷新当前的列表
			me.refreshGrid();
		};
		if(data.messageValue=='4'){//不可以移动
			me.mod.main.alert({
				text:data.msg,
				level:'error',
				delay:2000
			});
		};
		if(data.messageValue=='3'){//有重命名冲突，需要用户确定
			var actFlag;
			me.mod.main.prompt({
				text:data.msg,
				bts:[
					{value:'忽略',handler:function(){actFlag = '1';me.goonMove(actFlag,uuids,targetUuid,clearUuids)}},
					{value:'覆盖',handler:function(){actFlag = '2';me.goonMove(actFlag,uuids,targetUuid,clearUuids)}},
					{value:'重命名',handler:function(){actFlag = '3';me.goonMove(actFlag,uuids,targetUuid,clearUuids)}},
					{value:'取消',handler:function(){/*actFlag = '4';me.goonMove(actFlag,uuidForcopyTohere,str,toPath)*/}}
				]
			});
		
		}
	}
	
	this.goonMove = function(actFlag,uuids,targetUuid,clearUuids){
		if(actFlag){
			mc.send({
				service:$sl.gcontact_organizationContact_moveGroupAndPerson.service,
				method:$sl.gcontact_organizationContact_moveGroupAndPerson.method,
				params:{
					paths:util.json2str(uuids),
					path:targetUuid,
					flag:actFlag//覆盖同名的文件！
				},
				success:function(response){
						var data1 = util.parseJson(response.responseText);
						if(data1.success){
							if(data1.msg){
								me.mod.main.alert({
									text:data1.msg,
									level:'info',
									delay:2000
								});
							};
							me.mod.main.clipboardMgr.remove(clearUuids);
							me.refreshGrid();//刷新当前的列表
						};
				}
			});
		};
	}
	
	//复制到此
	this.copyToHere = function(){
		var clipdata = me.mod.main.clipboardMgr.getChecked();
		var uuids = [],clearUuids = [];
		clipdata.each(function(i,n){
			clearUuids.push(n.uuid);
			if(n.memberType==='2' && n.type!=3){
				uuids.push(n.uuid);
			}
		});
		var m = gridPath.length-1;
		var targetUuid = gridPath[m].value;
		if(uuids.length){
			me.mod.main.showUserPanel({fileMode:1,selectMode:1,type:4,submit:function(data){
				mc.send({
					service:$sl.gmyContact_contactFolder_groupPerson_copyToHere.service,
					method:$sl.gmyContact_contactFolder_groupPerson_copyToHere.method,
					params:{
						uuids:util.json2str(uuids),
						//toUuid:toUUid
						toUuid:data[0].uuid
					},
					success:function(response){
						var data = util.parseJson(response.responseText);
						if(data.success){
							me.mod.main.alert({
								text:data.msg,
								level:'info',
								delay:2000
							});
							me.mod.main.clipboardMgr.remove(clearUuids);//清空剪切板	
							me.refreshThisGird();
						}
					}
				});
				}
			});
		}else if(!uuids.length && clearUuids.length){
			me.mod.main.alert({
				text:'所选择的数据不符合复制规则！',
				level:'error',
				delay:3000
			});
			me.mod.main.clipboardMgr.remove(clearUuids);//清空剪切
		}
	}
	
		
	this.checkDataFunctionCopy = function(data,uuids,targetUuid,clearUuids){
		var uuids = uuids;
		if(data.messageValue=='1' || data.messageValue=='2'){
			me.mod.main.alert({
				text:data.msg,
				level:'info',
				delay:2000
			});
			me.mod.main.clipboardMgr.remove(clearUuids);
			//刷新当前的列表
			me.refreshGrid();
		};
		if(data.messageValue=='4'){//复制
			me.mod.main.alert({
				text:data.msg,
				level:'error',
				delay:2000
			});
		};
		if(data.messageValue=='3'){//复制
			var actFlag;
			me.mod.main.prompt({
				text:data.msg,
				bts:[
					{value:'忽略',handler:function(){actFlag = '1';me.goonCopy(actFlag,uuids,targetUuid,clearUuids)}},
					{value:'覆盖',handler:function(){actFlag = '2';me.goonCopy(actFlag,uuids,targetUuid,clearUuids)}},
					{value:'重命名',handler:function(){actFlag = '3';me.goonCopy(actFlag,uuids,targetUuid,clearUuids)}},
					{value:'取消',handler:function(){/*actFlag = '4';me.goonMove(actFlag,uuidForcopyTohere,str,toPath)*/}}
				]
			});
		
		}
	}
	
	this.goonCopy = function(actFlag,uuids,targetUuid,clearUuids){
		if(actFlag){
			mc.send({
				service:$sl.gcontact_organizationContact_copyGroupAndPerson.service,
				method:$sl.gcontact_organizationContact_copyGroupAndPerson.method,
				params:{
					paths:util.json2str(uuids),
					path:targetUuid,
					flag:actFlag//覆盖同名的文件！
				},
				success:function(response){
						var data1 = util.parseJson(response.responseText);
						if(data1.success){
							if(data1.msg){
								me.mod.main.alert({
									text:data1.msg,
									level:'info',
									delay:2000
								});
							};
							me.mod.main.clipboardMgr.remove(clearUuids);
							me.refreshGrid();//刷新当前的列表
						};
				}
			});
		};
	}
	
	
	//刷新列表
	this.refreshGrid = function(){
		var view = me.mod.main.getCentralView();
		if(view && view.dynamic && view.dynamic.load){
			view.dynamic.load();
		}
	}


});