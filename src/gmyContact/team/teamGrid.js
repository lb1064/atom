/**
 * 团队列表
 */
new (function(){
	
	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({
		
	});
	
	var targetUuid;
	var teamName;
	var editPriv;
	this.mod.defaultView = function(params){
		targetUuid = params.uuid;
		teamName = params.name;
		if(params.priv && params.priv.edit){
			editPriv = params.priv.edit;
		}else{
			editPriv = false;
		};
		me.mod.main.open({
			id:'teamGrid_id'+new Date().getTime(),
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			currentPage:1,
			usePage:true,
			searchConfig:{
				useSearch:true,
				handler:function(e,obj){
					var o  = {};
					o.key = obj.getValue();
					o.groupUuid = targetUuid;
					o.teamUuid = targetUuid,
					o.teamName = teamName,
					o.mod = me.mod,
					me.mod.main.remoteOpen({
						url:'modules/gmyContact/team/serchPersonResult.js',
						params:{
							data:o
						}
					});
				}
			},
			track:[
				{name:'我的群',handler:me.openAllTeam},
				{name:teamName}
			],
			actFilter:function(data,purview){
				purview['all'] = true;
				if(editPriv){
					purview['editP'] = true;
				}else{
					purview['editP'] = false;
				}
				if(data.memberType==='2'){
					purview['person'] = true;
				}else{
					purview['person'] = false;
				}
				if(data.isSystemUser==='1'){
					purview['sys'] = true;
				}else{
					purview['sys'] = false;
				}
				return purview;
			},
			acts:{
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.showPersonDetail,exp:'all'}
					//{name:'排序',value:'排序',imgCls:'continuesend_btn',handler:me.setSortData,exp:'all'}
				],
				clip:[
//					{name:'生成群',value:'生成群',handler:me.createTeam,exp:'person'},
					{name:'复制到此',value:'复制到此',handler:me.copyToHere,exp:'editP&&person&&sys'},
					{name:'删除',value:'删除',handler:me.delGroupPerson,exp:'editP&&person'}
				],
				track:[
//					{name:'搜索',value:'搜索',handler:me.serchTeam}
				]
			},
			store:{
				service:$sl.gcontact_personContact_personContact_getChildrenByuuid.service,
				method:$sl.gcontact_personContact_personContact_getChildrenByuuid.method+'$_'+targetUuid,
				params:{
					uuid:targetUuid,
					type:'3'
				},
				success:function(data,mod){

				}
			},
			colnums:[
				{header:'图标',textHidden:true,mapping:'iconUuid',renderer:me.changeFileImg,width:25,textAlign:'center'},
				{header:'名称',width:100,cursor:'pointer',mapping:'name',textAlign:'left',handler:me.showPersonDetailToo},
				{header:'手机',width:100,renderer:me.renderPhone,mapping:'phones',textAlign:'right'},
				{header:'图标',textHidden:true,mapping:'phones',textAlign:'left',renderer:me.showMessage,handler:function(e,o){me.show(e,o,o.phones)},width:25,textAlign:'left'},
				{header:'邮箱',mapping:'intraEmail',width:'max',textAlign:'center'},
//				{header:'邮箱',mapping:'emails',renderer:me.renderEmail,width:'max',textAlign:'right'},
//				{header:'图标',textHidden:true,mapping:'emails',textAlign:'left',renderer:me.showMessage,handler:function(e,o){me.show(e,o,o.emails)},width:25,textAlign:'left'},
				{header:'职务',mapping:'post',width:'max'},
				{header:'所属部门',mapping:'organization',width:'max'},
				{header:'备注',type:'tips',width:'max',mapping:'remark'}
			]
		
		});
	}
	
	this.setSortData = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/relativeOpen/giveSort.js',
			params:{
				uuid:o.get('data').uuid,
				lineData:o.get('data'),
				obj:me
			}
		});
	}
	
	
	this.showMessage = function(v,record,o){
		record.set('useLimit',false);
//		record.set('useTitle',false);
		if(Atom.isArray(v) && v.length>1){
			record.setCursor('pointer');
			record.set('title','更多信息');
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
		})
	}
	//回到团队的根页面
	this.openAllTeam = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/team/teams.js',
			params:{}
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
	
	this.copyToHere = function(){		
		var clipdata = me.mod.main.clipboardMgr.getChecked();
		var uuids = [];
		var sumitUuid = [];
		clipdata.each(function(i,n){
			if(n.memberType==='2'){
				var obj = {};
				obj.uuid = n.uuid;
				obj.type = n.memberType;
				uuids.push(n.uuid);
				sumitUuid.push(obj);
			}
		});
		me.mod.main.confirm({
			text:'确定将选中的联系人复制到此吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
						service:$sl.gcontact_organizationContact_createTeam.service,
						method:$sl.gcontact_organizationContact_createTeam.method,
						params:{
							members:util.json2str(sumitUuid),
							uuid:targetUuid
						},
						success:function(response){
							var data = util.parseJson(response.responseText);
							if(data && data.success){
								me.mod.main.alert({
									text:data.msg,
									level:'info',
									delay:2000
								});
								me.mod.main.clipboardMgr.remove(uuids);
								//刷新当前的列表
								me.refreshGrid();
							}					
						}
					});
				}
			}			
		})
	}
	
	this.checkDataFunctionCopy= function(data,uuids,targetUuid){
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
					{value:'忽略',handler:function(){actFlag = '1';me.goonCopy(actFlag,uuids,targetUuid)}},
					{value:'覆盖',handler:function(){actFlag = '2';me.goonCopy(actFlag,uuids,targetUuid)}},
					{value:'重命名',handler:function(){actFlag = '3';me.goonCopy(actFlag,uuids,targetUuid)}},
					{value:'取消',handler:function(){/*actFlag = '4';me.goonMove(actFlag,uuidForcopyTohere,str,toPath)*/}}
				]
			});
		
		}
	}
	
	this.goonCopy = function(actFlag,uuids,targetUuid){
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
							me.mod.main.clipboardMgr.remove(uuids);
							me.refreshGrid();//刷新当前的列表
						};
				}
			});
		};
	}
	
	//删除选中的人
	this.delGroupPerson = function(){
		var clipdata = me.mod.main.clipboardMgr.getChecked();
		var uuids = [];
		var sumitUuid = [];
		clipdata.each(function(i,n){
			uuids.push(n.uuid);
		});
		
		me.mod.main.confirm({
			text:'确认删除选中的联系人吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
						service:$sl.gcontact_organizationContact_delTeamPerson.service,
						method:$sl.gcontact_organizationContact_delTeamPerson.method,
						params:{
							teamUuid:targetUuid,
							uuids:util.json2str(uuids)
						},
						success:function(response){
							var data = util.parseJson(response.responseText);
							if(data.messageValue==='1'){
								me.mod.main.alert({
									text:data.messageDes,
									level:'info',
									delay:2000
								});
								me.mod.main.clipboardMgr.remove(uuids);
								me.refreshGrid();//刷新当前的列表
							}else if(data.messageValue==='2'){//团队的创建者
								me.mod.main.confirm({
									text:'该联系人是团队创建者，如果删除，团队会解散，是否继续？',
									handler:function(confirm){
										if(confirm){
											mc.send({
											service:$sl.gcontact_organizationContact_delteMyTeam.service,
											method:$sl.gcontact_organizationContact_delteMyTeam.method,
											params:{
												uuid:data.messageUuid,
												flag:'1'
											},
											success:function(response){
													var data = util.parseJson(response.responseText);
													if(data.success){
														me.mod.main.alert({
															text:data.msg,
															level:'info',
															delay:2000
														});
														me.mod.main.remoteOpen({
															url:'modules/gmyContact/team/teams.js',
															params:{}
														});
														//刷新树的操作
														me.mod.main.clipboardMgr.remove(uuids);
														//me.refreshThisGird();
														me.mod.main.getNavigation().initMethod({type:'3'});
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
			}
			
		})
	}
	
	
	
	this.changeFileImg = function(v,record,o){
		record.set('useLimit',false);
//		record.set('useTitle',false);
		if(o.isSystemUser==='1'){//系统用户
			record.set('title','系统用户');
			return '<span class="meetingman_img">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
		}else{
			return '<span style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
		}
	}
	
	
	this.showPersonDetail = function(e,o){
		var gridPath = [
			{name:'我的群'},
			{name:teamName,handler:function(){
				me.mod.defaultView({uuid:targetUuid,name:teamName});
			}}
		]; 
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/viewPerson.js',
			params:{
				uuid:o.get('data').uuid,
				data:o.get('data'),
				obj:me,
				tag:'team',
				gridPath:gridPath
			}
		});
	}
	
	this.showPersonDetailToo = function(e,o){
		var gridPath = [
			{name:'我的群'},
			{name:teamName,handler:function(){
				me.mod.defaultView({uuid:targetUuid,name:teamName});
			}}
		]; 
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/viewPerson.js',
			params:{
				uuid:o.uuid,
				tag:'team',
				data:o,
				obj:me,
				gridPath:gridPath
			}
		});
	}
	
	//团队
	this.serchTeam = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/team/serchPerson.js',
			params:{
				uuid:targetUuid,
				teamName:teamName,
				mod:me.mod
			}
		});
	}
	
	//刷新列表
	this.refreshGrid = function(){
		var view = me.mod.main.getCentralView();
		if(view && view.dynamic && view.dynamic.load){
			view.dynamic.load();
		}
	}
	
	this.refreshThisGird = function(){
		var view = me.mod.main.getCentralView();
		if(view && view.dynamic && view.dynamic.load){
			view.dynamic.load();
		}
	}


});