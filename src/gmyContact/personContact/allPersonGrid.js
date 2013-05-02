/**
 * 全部联系人的列表
 */
new (function(){
	
	var me = this;
	
	var toUUid;
	this.mod = new Gframe.module.RemoteModule({
		expandView:{
				'orgTonxunTree':{
					title:'指定导入范围',
					create:function(params){
						orgTonxunTree = new Treebar({serviceType:true});	
						orgTonxunTree.handler = function(node){
									if(!node.options.realName){
										node.options.realName=node.options.name;
									}
									var record = {
											uuid : node.options.uuid,
											name : node.options.realName,
											type:node.options.memberType
									};
									importText.addRecord(record);
									importText.update();
									
						};
						return orgTonxunTree;
					},
					initMethod:function(params){
						mc.send({
							service:$sl.gmyContact_contactFolder_contactMain_getOrgTree.service,
							method:$sl.gmyContact_contactFolder_contactMain_getOrgTree.method,
							//params:{},
							success:function(response){
								mc.fireEvent(orgTonxunTree.get('id'),'loadData',{obj:response.responseText});
								}
						});
					}
			},
			'myFolderTree':{
					title:'指定备份路径',
					create:function(params){
						myFolderTree = new Treebar({serviceType:true});	
						myFolderTree.handler = function(node){
									if(!node.options.realName){
										node.options.realName=node.options.name;
									}
									var record = {
											uuid : node.options.uuid,
											name : node.options.realName
									};
									backUpText.setValue(record);
									backUpText.update();
									
						};
						return myFolderTree;
					},
					initMethod:function(params){
						mc.send({
							service:$sl.gmyContact_contactFolder_contactMain_getMyFolders.service,
							method:$sl.gmyContact_contactFolder_contactMain_getMyFolders.method,
							params:{
								system:true,
								orgFile:false
							},
							success:function(response){
								mc.fireEvent(myFolderTree.get('id'),'loadData',{obj:response.responseText});
								}
						});
					}
			}
		}
	});
	
	var uuid;
	var option;
	this.mod.defaultView = function(params){
		option = params.option || params;
		uuid = params.uuid || '';
		toUUid = params.uuid || '';//如果为空表示是在全部联系人总查找
		me.mod.main.open({
			id:'allDetail_GridId'+new Date().getTime(),
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
					o.groupUuid = toUUid;
					o.type = '1';
					me.mod.main.remoteOpen({
						url:'modules/gmyContact/personContact/contactFolder/advancedSerch.js',
						params:{
							o:o,
							mod:me.mod,
							option:option,
							tag:'all'
						}
					});
				}
			},
			track:[
				{name:'我的通讯录',cursor:'false'},
				{name:'全部'}
			],
			store:{
					service:$sl.gcontact_personContact_personContact_getAllperson.service,
					method:$sl.gcontact_personContact_personContact_getAllperson.method,
					params:{
						//uuid:uuid	
					},
					success:function(data,mod){
						
					}
			},
			acts:{
				grid:[
//					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.lookAtPersonDetailInfo},
//					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editPersonInfo},
					{name:'排序',value:'排序',imgCls:'continuesend_btn',handler:me.setSortData}
				],
				clip:[
//					{name:'生成群',value:'生成群',handler:me.createTeam},
					{name:'导出',value:'导出',handler:me.exportGroup},
					{name:'发送名片',value:'发送名片',handler:me.sendInfoCardInGroup},
					{name:'复制到此',value:'复制到此',handler:me.copyToHere},
					{name:'移动到此',value:'移动到此',handler:me.moveToHere},
					{name:'删除',value:'删除',handler:me.delGroupPerson}
				],
				track:[
//					{name:'搜索',value:'搜索',handler:me.serchInGroup},
					{name:'新建联系人',value:'新建联系人',handler:me.buildNewPerson},
					{name:'新建组',value:'新建组',handler:me.addNewGroup},
					{name:'导入',value:'导入',handler:me.importRel}
					//{name:'备份/还原',value:'备份/还原',handler:me.backupOrRevert},
//					{name:'合并联系人',value:'合并联系人',handler:me.mergeRelman}
				]
			},
			colnums:[
				{header:'图标',textHidden:true,mapping:'iconUuid',renderer:me.changeFileImg,width:25,textAlign:'center'},
				{header:'名称',width:100,cursor:'pointer',mapping:'name',textAlign:'left',handler:me.editPersonInfo},
				{header:'手机',width:80,mapping:'phones',renderer:me.renderPhone,textAlign:'right'},
				{header:'更多',textHidden:true,mapping:'phones',textAlign:'left',renderer:me.showMessage,handler:function(e,o){me.show(e,o,o.phones)},width:25,textAlign:'left'},
				{header:'邮箱',mapping:'intraEmail',width:'max',textAlign:'right',textAlign:'center'},
//				{header:'邮箱',mapping:'emails',width:'max',textAlign:'right',renderer:me.renderEmail},
//				{header:'更多',textHidden:true,mapping:'emails',textAlign:'left',renderer:me.showMessage,handler:function(e,o){me.show(e,o,o.emails)},width:25,textAlign:'left'},
				{header:'职务',mapping:'post',width:'max'},
				{header:'所属部门',mapping:'organization',width:'max'},
				{header:'备注',type:'tips',width:'max',mapping:'remark'}
				
			],
			initMethod:function(mod){
				
			}
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
	
	this.openMinePage = function(){
	
	}
	//用于显示信息
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
	
	//新建联系人
	this.buildNewPerson = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/relativeOpen/buildNewPerson.js',
			params:{
				toUUid:toUUid,
				option:option
			}
		});
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
	this.quedingAddnewBuildGroup  = function(){
		var form = me.mod.main.get('createNewGroup');
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
					me.mod.main.popMgr.close('createNewGroup');
					//me.refreshThisGird();
					//TODO 刷新固定导航中个人通讯录的树personTree
					me.mod.main.getNavigation().initMethod({type:'1'});
				}
			}
		});
	}
	
	
	this.addNewGroup = function(){
		me.mod.main.open({
			id:'createNewGroup',
			xtype:'form',
			mode:'pop',
			title:'新建分组',
			width:600,
			height:260,
			fields:[
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
						var addcaontactform = me.mod.main.get('createNewGroup');
						addcaontactform.reset();
						me.mod.main.popMgr.close('createNewGroup');
					}},
					{xtype:'blank',width:'max'}	
				]}
			],
			hiddens:[
	
			],
			initMethod:function(mod){
				
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
	
	
	
	//创建团队
	this.createTeam = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/team/createTeam.js',
			params:{
				targetFlag:'1'
			}
		});
	}
	
	//备份或者还原
	this.backupOrRevert = function(){
		me.mod.main.open({
			id:'backupOrRevert_form',
			xtype:'form',
			width:500,
			mode:'pop',
			height:310,
			fields:[
				{
					height:20,
					cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'left',textCls:'title_font',value:'备份/还原',width:'max'},
						{xtype:'blank',width:'max'}				
					]
				},
				'-',
				{
					height:36,
					cols:[
						{xtype:'blank',width:20},
						{xtype:'radiogroup',width:200,radios:[
								{displayValue:'备份',value:'',cursor:'pointer',textCls:'title_font',on:{'click':me.clickBackup},checked:true,width:'max'},
								{displayValue:'还原',value:'',cursor:'pointer',textCls:'title_font',on:{'click':me.clickHuanyuan},width:'max'}
							]},
						{xtype:'blank',width:20}
					]
				}
			],
			hiddens:[
				{name:'type',itemId:'backUpType_id'}
			],
			initMethod:function(mod){
				//模拟点击备份操作
				me.clickBackup();
			}
		});
	}	
	
	this.exportGroup = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/contactFolder/exportGroup.js',
			params:{
				
			}
		});
	}
	
	//查看联系人的详细信息
	this.lookAtPersonDetailInfo = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/relativeOpen/viewPerson.js',
			params:{
				data:o.get('data'),
				mod:me.mod,
				option:option
			}
		});
	}
	
	//合并联系人
	this.mergeRelman = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/relativeOpen/mergePerson.js',
			params:{
				
			}
		});
	}
	
	
	//备份时form表单的切换
	var backUpText;
	var backcols;
	this.clickBackup = function(){
		revertTag = false;
		var index = 10;
		var actTag;
		var form = me.mod.main.get('backupOrRevert_form');
		//备份文件的类型
		var backtype = form.getByItemId('backUpType_id'); 
		backtype.setValue('bak加密文件');
		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:40});
		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:40});
		var col3 = new Colbar({cols:[],align:'left'},{width:'max',height:40});
		var col4 = new Colbar({cols:[],align:'left'},{width:'max',height:40});
		//销毁点击还原时，动态增加的行
		revertCols = Boolean(revertCols)===true?revertCols:[];
		revertCols.each(function(index,col){
			form.removeItemById(col.get('id'));
		});
		backcols = Boolean(backcols)===true?backcols:[];
		backcols.each(function(index,col){
			form.removeItemById(col.get('id'));
		});
		
		var blank = new Blank({width:20});
		var nameLabel = new Gframe.controls.Label({width:120,height:40,textAlign:'right',textCls:'title_font',value:'备份文件类型：'});
		var valueLabel  = new Gframe.controls.Label({width:'max',textAlign:'left',height:40,value:'bak加密文件'});
		col1.addItem(blank);
		col1.addItem(nameLabel);
		col1.addItem(new Blank({width:10}));
		col1.addItem(valueLabel);
		col1.addItem(blank);
		
		var nameLabel2 = new Gframe.controls.Label({width:120,height:40,top:2,textAlign:'right',textCls:'title_font',value:'备份到：'});
		var group = new Gframe.controls.RadioGroup({name:'backupPath'},{width:200});
		var radio1 = new Gframe.controls.Radio({displayValue:'文档中心',value:'1',checked:true,on:{'click':function(){
				if(col3 && col4 && !actTag){
					form.removeItemById(col4.get('id'));
					col3.addItem(blank);
					col3.addItem(nameLabel3);
					col3.addItem(new Blank({width:10}));
					col3.addItem(backUpText);
					col3.addItem(blank);
					form.addItem(index+2,col3);

					col4.addItem(new Blank({width:'max'}));
					col4.addItem(bt1);
					col4.addItem(new Blank({width:10}));	
					col4.addItem(bt2);
					col4.addItem(new Blank({width:'max'}));
					form.addItem(index+3,col4);
					form.update();
					actTag = true;
				}
				
		}}},{width:'max',cursor:'pointer'});
		var radio2 = new Gframe.controls.Radio({displayValue:'本地',cursor:'pointer',value:'2',on:{'click':function(){
			actTag = false;
			if(col3){
				form.removeItemById(col3.get('id'));
				form.update();
			}
		}}},{width:'max',cursor:'pointer'});
		group.addItem(radio1);
		group.addItem(radio2);
		col2.addItem(blank);
		col2.addItem(nameLabel2);
		col2.addItem(new Blank({width:10}));
		col2.addItem(group);
		col2.addItem(blank);
		
		var nameLabel3 = new Gframe.controls.Label({width:120,height:40,textAlign:'right',textCls:'title_font',value:'存储路径：'});
		backUpText = new Gframe.controls.TextFieldPlus({
			name:'stored',
			defaultField:'name',
			width:'max',
			listeners : ({'click' : function(){
					me.mod.main.showExpandView('myFolderTree');
			}}),
			fields:['name','uuid']
		});
		col3.addItem(blank);
		col3.addItem(nameLabel3);
		col3.addItem(new Blank({width:10}));
		col3.addItem(backUpText);
		col3.addItem(blank);
		
		var bt1 = new Gframe.controls.Button({width:100,value:'确定',handler:me.quedingBackUp});
		var bt2 = new Gframe.controls.Button({width:100,value:'取消',handler:function(){
			form.reset();
			me.mod.main.popMgr.close('backupOrRevert_form');
			//删除动态增加的行
			form.removeItemByIds([col1.get('id'),col2.get('id'),col3.get('id'),col4.get('id')]);
			form.update();
			me.mod.main.closeExpandView('myFolderTree');
		}});
		col4.addItem(new Blank({width:'max'}));
		col4.addItem(bt1);
		col4.addItem(new Blank({width:10}));	
		col4.addItem(bt2);
		col4.addItem(new Blank({width:'max'}));
		
		form.addItem(index,col1);
		form.addItem(index+1,col2);
		form.addItem(index+2,col3);
		form.addItem(index+3,col4);
		form.update();
		actTag = true;
		//放入垃圾箱
		backcols = [];
		backcols.push(col1);
		backcols.push(col2);
		backcols.push(col3);
		backcols.push(col4);
	}
	
	//确定备份文件
	this.quedingBackUp = function(){
		var form = me.mod.main.get('backupOrRevert_form');
		var o = form.serializeForm();
		for(var p in o){
			if(p.startWith('gsoft')){
				delete o[p];
			}
		};
		if(o.stored){
			var store = util.parseJson(o.stored);
			if(store.length){
				store = store[0].uuid;
				o.stored = store;
			}else{
				o.stored = '';
			}
		}
		form.submit({
			service:$sl.gmyContact_contactFolder_contactMain_quedingBackUp.service,
			method:$sl.gmyContact_contactFolder_contactMain_quedingBackUp.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					form.reset();
					me.mod.main.popMgr.close('backupOrRevert_form');
					//删除动态增加的行
					backcols.each(function(index,col){
						form.removeItemById(col.get('id'));
					});
					form.update();
					me.mod.main.closeExpandView('myFolderTree');
					if(data.storedUuid){
						mc.download(data.storedUuid);
					}else{
						me.mod.main.alert({
							text:data.msg,
							level:'info',
							delay:2000
						});
					}
				}
			}
		});
		
	}
	
	//还原时form表单的切换
	var revertCols;
	var revertTag;
	this.clickHuanyuan = function(){
		var form = me.mod.main.get('backupOrRevert_form');
		var bt1 = new Gframe.controls.Button({width:100,value:'确定',handler:me.revertContact});
		bt1.setEnabled(false);
		if(!revertTag){
			var col = new Colbar({cols:[],align:'left'},{width:'max',height:40});
			var colbt = new Colbar({cols:[],align:'left'},{width:'max',height:40});
			
			var nameLabel = new Gframe.controls.Label({width:140,height:40,textAlign:'right',textCls:'title_font',value:'选择通讯录文件：'});
			var file = new Gframe.controls.DirectUpload({success:function(){
				bt1.setEnabled(true);
			}},{width:'max',name:'uuid'});
			
			//删除动态增加的行
			backcols.each(function(index,col){
				form.removeItemById(col.get('id'));
			});
			me.mod.main.closeExpandView('myFolderTree');
		
			var bt2 = new Gframe.controls.Button({width:100,value:'取消',handler:function(){
				form.reset();
				me.mod.main.popMgr.close('backupOrRevert_form');
				//删除动态增加的行
				revertCols.each(function(index,col){
					form.removeItemById(col.get('id'));
				});
				form.update();
			}});
			
			col.addItem(new Blank({width:20}));
			col.addItem(nameLabel);
			col.addItem(new Blank({width:10}));
			col.addItem(file);
			col.addItem(new Blank({width:20}));
			
			colbt.addItem(new Blank({width:'max'}));
			colbt.addItem(bt1);
			colbt.addItem(new Blank({width:10}));
			colbt.addItem(bt2);
			colbt.addItem(new Blank({width:'max'}));
			revertCols = [];
		
			var index = 5;
			form.addItem(index,col);
			form.addItem(index+1,colbt);
			form.update();
			revertCols.push(col);
			revertCols.push(colbt);
			revertTag = true;
		}
	}
	
	//确定还原通讯录
	this.revertContact = function(){
		var form = me.mod.main.get('backupOrRevert_form');
		var o = form.serializeForm();
		form.submit({
			service:$sl.gmyContact_contactFolder_contactMain_clickHuanyuan.service,
			method:$sl.gmyContact_contactFolder_contactMain_clickHuanyuan.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					form.reset();
					me.mod.main.popMgr.close('backupOrRevert_form');
					//删除动态增加的行
					revertCols.each(function(index,col){
						form.removeItemById(col.get('id'));
					});
					form.update();
					//刷新表格的shuju
					me.refreshThisGird();
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
				}
			}
		});
		
	}
	
	//还是查看联系人的详细信息
	this.lookAtPersonDetailInfoTwo = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/relativeOpen/viewPerson.js',
			params:{
				data:o,
				tag:'grOup',
				//dataR:dataR,
				mod:me.mod
			}
		});
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
	
	this.sendInfoCardInGroup = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/contactFolder/sendCard.js',
			params:{
				
			}
		});
	}
	
	this.editPersonInfo = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/relativeOpen/editPersonInfo.js',
			params:{
				data:o,
				mod:me.mod,
				option:option
			}
		});
	}
	
	this.delGroupPerson = function(){
		var uuids = [];
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		fromuuids.each(function(i,n){
			uuids.push(n.uuid);
		});
		me.mod.main.confirm({
			text:'确定删除吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
						service:$sl.gmyContact_contactFolder_groupPerson_delPeople.service,
						method:$sl.gmyContact_contactFolder_groupPerson_delPeople.method,
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
								me.refreshThisGird();
							}
	
							}
					});
				}

			}
									
		});
	}
	
	//复制到此
	this.copyToHere = function(){
		//memberType==1 表示是组  2表示人
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		var uuids = [],clearUuids = [];
		fromuuids.each(function(index,col){
			if(col.memberType==='2' && col.type!=3){
				uuids.push(col.uuid);
			}
			clearUuids.push(col.uuid);
		});
		if(uuids.length){
			me.mod.main.confirm({
				text:'确定复制到此吗？',
				handler:function(confirm){
					if(confirm){
						mc.send({
							service:$sl.gmyContact_contactFolder_groupPerson_copyToHere.service,
							method:$sl.gmyContact_contactFolder_groupPerson_copyToHere.method,
							params:{
								uuids:util.json2str(uuids),
								toUuid:toUUid
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
	
	//移动到此
	this.moveToHere = function(){
		//memberType==1 表示是组  2表示人
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		var uuids = [],clearUuids = [];
		fromuuids.each(function(index,col){
			clearUuids.push(col.uuid);
			if(col.type!=3){
				uuids.push(col.uuid);
			}
		});
		if(uuids.length){
			me.mod.main.confirm({
				text:'确定移动到此吗？',
				handler:function(confirm){
					if(confirm){
						mc.send({
							service:$sl.gmyContact_contactFolder_groupPerson_moveToHere.service,
							method:$sl.gmyContact_contactFolder_groupPerson_moveToHere.method,
							params:{
								uuids:util.json2str(uuids),
								toUuid:toUUid
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
	
	//组内部的高级搜索
	this.serchInGroup = function(){
		me.mod.main.open({
			id:'advancedSerchAllperson_inGroup',
			xtype:'form',
			width:550,
			mode:'pop',
			height:180,
			fields:[
				{
					height:20,
					cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'left',textCls:'title_font',value:'高级搜索',width:'max'},
						{xtype:'blank',width:'max'}				
					]
				},
				'-',
				{
					height:40,
					cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'right',textCls:'title_font',value:'包含 内容：',width:100},
						{xtype:'blank',width:10},
						{xtype:'text',textAlign:'left',value:'姓名（全拼，简拼），电话号码，邮箱，地址...',onclick:me.clearDefaulTtext,itemId:'advancedSerch_text',leftHidden:true,width:'max',name:'key'},
						{xtype:'blank',width:20}
					]
				},
				{
					height:40,
					cols:[
						{xtype:'blank',width:'max'},
						{
							xtype:'button',
							width:100,
							value:'搜索',
							handler:me.submitSerch						
						},
						{xtype:'blank',width:20},
						{xtype:'button',width:100,value:'取消',handler:function(){
							var form = me.mod.main.get('advancedSerchAllperson_inGroup');
							form.reset();
							me.mod.main.popMgr.close('advancedSerchAllperson_inGroup');
						}},					
						{xtype:'blank',width:'max'}
					]
				}
				
			]
		});
	}
	
	this.clearDefaulTtext = function(){
		var form = me.mod.main.get('advancedSerchAllperson_inGroup');
		var text = form.getByItemId('advancedSerch_text');
		if(text.getValue()==='姓名（全拼，简拼），电话号码，邮箱，地址...'){
			text.setValue('');
		}
	}
	
	this.submitSerch= function(){
		var form = me.mod.main.get('advancedSerchAllperson_inGroup');
		var o  = form.serializeForm();
		var text = form.getByItemId('advancedSerch_text');
		if(text.getValue()==='姓名（全拼，简拼），电话号码，邮箱，地址...'){
			o.key = '';
		}
		o.groupUuid = toUUid;
		o.type = '1';
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/contactFolder/advancedSerch.js',
			params:{
				o:o,
				mod:me.mod,
				option:option,
				form:form,
				tag:'all'
			}
		});
	}
	
	this.addNewGroupPerson = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/relativeOpen/buildNewPerson.js',
			params:{
				name:dataR.name,
				toUUid:toUUid,
				mod:me.mod,
				dataR:dataR
			}
		});
		
	}
	
	//导入联系人
	this.importRel = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/contactFolder/importPerson.js',
			params:{
				toUUid:toUUid,
				obj:me
			}
		});
	}
	
	//刷新表格
	this.refreshThisGird = function(){
		var view = me.mod.main.getCentralView();
		view.dynamic.load();
	}
});