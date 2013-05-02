/**
 *新版通讯录查找、高级搜索结果
 *@author tianjun
 *2012.6.19
 */
new (function(){
	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var groupFlag;
	var mod;
	var dataR;
	var option;
	var mod;
	this.mod.defaultView = function(params){
		if(params.o.key){
		if(params.o.key.indexOf('\'')!=-1||params.o.key.indexOf('\.')!=-1||params.o.key.indexOf('\*')!=-1){
			me.mod.main.alert({
				text:'关键字含有非法字符（例如\' \. \*等），请重新搜索！',
				delay:2000,
				level:'error'
			});
			return;}};
		var o = params.o;
		var form = params.form;
		option = params.option;
		mod = params.mod;
		var tag = params.tag || undefined;
		var track,param;
		//查找
		if(tag==='all'){
			track = [
					{name:'我的联系人',cursor:'false'},
					{name:'搜索结果'}
			];
		}else{
			track = [
					{name:'我的联系人',cursor:'false'},
					{name:option.name,handler:function(){
						mod.defaultView({uuid:option.uuid,name:option.name});
					}},
					{name:'搜索结果'}
			];
		}
		me.mod.main.open({
			id:'personRel_GridId'+new Date().getTime(),
			xtype:'grid',
			mode:'loop',
			checkbox:true,
			currentPage:1,
			usePage:true,
			track:track,
			searchConfig:{
				useSearch:true,
				handler:function(e,obj){
					var o  = {};
					o.key = obj.getValue();
					o.groupUuid = params.o.groupUuid;
					o.type = '1';
					me.mod.defaultView({
							o:o,
							mod:mod,
							option:option,
							tag:tag
					});
				}
			},
			actFilter:function(data,purview){
				purview['all'] = true;
				if(o.scope==='1' && !o.groupUuid){//组织
					purview['add'] = true;
					purview['edit'] = false;
				}else{
					purview['add'] = false;
					purview['edit'] = true;
				}
				return purview;
			},
			store:{
				service:$sl.gcontact_organizationContact_editContact_serchContact.service,
				method:$sl.gcontact_organizationContact_editContact_serchContact.method,
				params:o,
				success:function(data,mod){
				}
			},
			acts:{
				grid:[
					//{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.showPersonInfDetail,exp:'all'},
					//{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editPersonINfo,exp:'all'}
					//{name:'添加',value:'添加',imgCls:'add_btn',handler:me.addToGroup,exp:'add'}
				],
				clip:[
				    {name:'导出',value:'导出',handler:me.exportGroup},
					{name:'发送名片',value:'发送名片',handler:me.sendCardFunc,exp:'all'},'-',
					{name:'复制到',value:'复制到',handler:me.copyToHere},
					{name:'移动到',value:'移动到',handler:me.moveToHere},'-',
					{name:'删除',value:'删除',handler:me.deletePersonFunc,exp:'all'},
				],
				track:[
					//{name:'搜索',value:'搜索',handler:me.serchInGroup,exp:'all'}
				]
			},
			colnums:[
				{header:'图标',textHidden:true,mapping:'iconUuid',renderer:me.changeFileImg,width:25,textAlign:'center'},
				{header:'名称',width:100,mapping:'name',cursor:'pointer',textAlign:'left',handler:me.showPersonInfDetailTwo},
				{header:'手机',width:100,mapping:'phones',renderer:me.renderPhone,textAlign:'left'},
				{header:'图标',textHidden:true,mapping:'phones',textAlign:'left',renderer:me.showMessage,handler:function(e,o){me.show(e,o,o.phones)},width:25,textAlign:'left'},
				{xtype:'vblank',width:70},
				{header:'邮箱',mapping:'intraEmail',width:'max',textAlign:'left'},
//				{header:'邮箱',mapping:'emails',width:'max',renderer:me.renderEmail,textAlign:'right'},
//				{header:'图标',textHidden:true,mapping:'emails',textAlign:'left',renderer:me.showMessage,handler:function(e,o){me.show(e,o,o.emails)},width:25,textAlign:'left'},
				{header:'职务',mapping:'post',width:'max',textAlign:'left'},
				{header:'所属部门',mapping:'organization',width:'max',textAlign:'left'},
				{header:'备注',type:'tips',width:'max',mapping:'remark'}
				
			],
			initMethod:function(mod){
				
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
	
	//复制到此
	this.copyToHere = function(){
		//memberType==1 表示是组  2表示人
		var fromuuids = me.mod.main.clipboardMgr.getChecked(); 
		var uuids = [],clearUuids = [];
		fromuuids.each(function(index,col){
			clearUuids.push(col.uuid);
			if(col.memberType==='2' && col.type!=3){
				uuids.push(col.uuid);
			}
		});
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
							me.refreshSerchGird();
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
			me.mod.main.showUserPanel({fileMode:1,selectMode:1,type:4,submit:function(data){
				mc.send({
					service:$sl.gmyContact_contactFolder_groupPerson_moveToHere.service,
					method:$sl.gmyContact_contactFolder_groupPerson_moveToHere.method,
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
							me.refreshSerchGird();
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
		});
		var scrollbar = me.mod.main.getCentralView().getScroll().getScrollBar();
		scrollbar.on('mousemove',function(top){
			if(s.getIsOpen()){
				s.close();
			}
		});
	}
		//组内部的高级搜索
	this.serchInGroup = function(){
		me.mod.main.open({
			id:'advancedSerch_inGroup',
			xtype:'form',
			width:550,
			mode:'pop',
			tilte:'高级搜索',
			height:180,
			fields:[
			
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
							var form = me.mod.main.get('advancedSerch_inGroup');
							form.reset();
							me.mod.main.popMgr.close('advancedSerch_inGroup');
						}},					
						{xtype:'blank',width:'max'}
					]
				}
				
			]
		});
	}
	
	this.submitSerch= function(){
		var form = me.mod.main.get('advancedSerch_inGroup');
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
				form:form
			}
		});
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
	
	
	//编辑联系人的信息	
	this.editPersonINfo = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/relativeOpen/editPersonInfo.js',
			params:{
				data:o.get('data'),
				mod:me.mod,
				option:option
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
	
	//删除
	this.deletePersonFunc = function(){
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
								me.refreshSerchGird();
							}
	
							}
					});
				}

			}
									
		});
	}
	
	//发送名片
	this.sendCardFunc = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/contactFolder/sendCard.js',
			params:{
				
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
	
	//添加到组
	var storedUuid;
	this.addToGroup = function(e,o){
		storedUuid = o.get('data').uuid;
		me.mod.main.open({
			id:'storeToOtherGroup_id',
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
					{xtype:'button',value:'确定',width:100,handler:me.storeTo},
					{xtype:'blank',width:10},	
					{xtype:'button',value:'取消',width:100,handler:function(){
						var addcaontactform = me.mod.main.get('storeToOtherGroup_id');
						addcaontactform.reset();
						me.mod.main.popMgr.close('storeToOtherGroup_id');
					}},
					{xtype:'blank',width:'max'}	
				]}
				
			],
			initMethod:function(mod){
				var form = me.mod.main.get('storeToOtherGroup_id');	
				var storeGroup_idrel = form.getByItemId('storeGroup_idrel');
				//刷新目标分组的数据
				mc.fireEvent(storeGroup_idrel.get('id'),'reload',{});
			}
		});	
	}
	
	//显示联系人的详细信息
	this.showPersonInfDetail = function(e,o){
//		var pam = {
//				data:o.get('data'),
//				tag:'serch',
//				groupFlag:groupFlag
//		};
//		if(groupFlag==='0'){
//			pam.mod = mod;
//			pam.dataR = dataR;
//		}
//		me.mod.main.remoteOpen({
//			url:'modules/gmyContact/relativeOpen/viewPerson.js',
//			params:pam
//		});
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/relativeOpen/viewPerson.js',
			params:{
				data:o.get('data'),
				mod:me.mod,
				option:option
			}
		});
	}
	
	this.showPersonInfDetailTwo = function(e,o){
		var pam = {
				data:o,
				tag:'serch',
				groupFlag:groupFlag
		};
		if(groupFlag==='0'){
			pam.mod = mod;
			pam.dataR = dataR;
		}
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/relativeOpen/editPersonInfo.js',
			params:pam
		});
	}
	
	//保存添加到组
	this.storeTo = function(){//TODO此处少了一个接口gmyContact_relativeOpen_mergePerson_addPerosnToConFromOrg
		var form = me.mod.main.get('storeToOtherGroup_id');
		var o = form.serializeForm();
		var uuids = [];
		uuids.push(storedUuid);
		if(!o.uuids){
			o.uuids = util.json2str(uuids);
		}
		form.submit({
			service:$sl.gmyContact_relativeOpen_mergePerson_addPerosnToConFromOrg.service,
			method:$sl.gmyContact_relativeOpen_mergePerson_addPerosnToConFromOrg.method,
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
					me.mod.main.popMgr.close('storeToOtherGroup_id');
				}
			}
		});
	}
	
	//刷新当前的列表
	this.refreshSerchGird = function(){
		var view = me.mod.main.getCentralView();
		view.dynamic.load();
	}
	
});
