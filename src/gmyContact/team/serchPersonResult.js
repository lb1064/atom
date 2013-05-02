/**
 * 搜索结果
 */
new (function(){

	var me = this;
	
	
	this.mod = new Gframe.module.RemoteModule({
		
	});
	this.mod.defaultView = function(params){
		me.openGrid(params);
	}
	var data,da;
	var gridPath;
	var teamName,teamUuid,mod,type;
	this.openGrid = function(params){
		
		data = params.data;
		da = data;
		teamName= data.teamName || null;
		teamUuid = data.teamUuid || null;
		if(data.mod){
			mod = data.mod;
			delete data['mod'];
		}
		if(!data.type){
			data.type = '3';
		}
		me.mod.main.open({
			id:'orgPersonGrid_idteam'+new Date().getTime(),
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
					o.groupUuid = data.groupUuid;
					o.teamUuid = teamUuid,
					o.teamName = teamName,
					o.type = '3';//根据后台业务写死的
					o.mod = mod,
					me.mod.defaultView({
							data:o
					});
				}
			},
			actFilter:function(data,purview){
				purview['all'] = true;
				if(data.memberType==='2'){
					purview['view'] = true;
				}else{
					purview['view'] = false;			
				}
				return purview;
			},
			store:{
				service:$sl.gcontact_organizationContact_editContact_serchContact.service,
				method:$sl.gcontact_organizationContact_editContact_serchContact.method,
				params:data,
				success:function(data,mod){
					gridPath = data.path.slice(0);
//					var trackpath = data.path.slice(0);
				
						trackpath = [
							{name:'我的群',handler:me.openAllTeams}
						];
						if(teamName){
							trackpath.push({name:teamName,handler:me.openTeam});
						}
						trackpath.push({name:'搜索结果'});
					me.mod.main.reloadTrack(trackpath);	
				}
			},
			acts:{
				track:[
					//{name:'搜索',value:'搜索',handler:me.serchPerson,exp:'all'}
				],
				grid:[
					{name:'查看',value:'查看',imgCls:'preview_btn',handler:me.showPersonDetail,exp:'view'}
					//{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editGroup,exp:'all'}
				],
				clip:[
//					{name:'生成群',value:'生成群',handler:me.createTeam,exp:'all'},
					{name:'删除',value:'删除',handler:me.delGroupPerson,exp:'all'}
				]
			},
			colnums:[
				{header:'图标',textHidden:true,mapping:'iconUuid',renderer:me.changeFileImg,width:25,textAlign:'center'},
				{header:'名称',width:100,cursor:'pointer',mapping:'name',textAlign:'left',handler:me.openChildrenToo},
				{header:'手机',width:100,renderer:me.renderPhone,mapping:'phones'},
				{header:'图标',textHidden:true,mapping:'phones',renderer:me.showMessage,cursor: 'pointer',handler:function(e,o){me.show(e,o,o.phones)},width:25,textAlign:'left'},
				{header:'邮箱',width:'max',mapping:'intraEmail',textAlign:'center'},
//				{header:'邮箱',renderer:me.renderEmail,width:'max',mapping:'emails'},
//				{header:'图标',textHidden:true,mapping:'emails',renderer:me.showMessage,cursor: 'pointer',handler:function(e,o){me.show(e,o,o.emails)},width:25,textAlign:'left'},
				{header:'职务',mapping:'post',width:'max'},
				{header:'所属部门',mapping:'organization',width:'max'},
				{header:'备注',type:'tips',width:'max',mapping:'remark'}
			],
			initMethod:function(mod){
				
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
	
		//编辑分组
	this.editGroup = function(e,o){
		if(o.get('data').memberType==='1'){//编辑分组
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/organizationContact/editGroup.js',
				params:{
					uuid:o.get('data').uuid,
					obj:me,
					lineData:o.get('data')
				}
			});
		}else{
			me.mod.main.remoteOpen({//编辑联系人
				url:'modules/gmyContact/organizationContact/editPerson.js',
				params:{
					uuid:o.get('data').uuid,
					obj:me,
					gridPath:gridPath,
					data:o.get('data')
				}
			});
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
		})
	}
		
	this.serchPerson = function(){
		var m = gridPath.length-1;
		if(type==='2'){
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/organizationContact/serchPerson.js',
				params:{
					uuid:gridPath[m].value,
					type:'2'
				}
			});
		}else if(type==='3'){
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/organizationContact/serchPerson.js',
				params:{
					uuid:targetUuid,
					teamName:teamName,
					mod:mod,
					type:'3'
				}
			});
		}
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
	
	//创建团队
	this.createTeam = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/team/createTeam.js',
			params:{
				targetFlag:'2'
			}
		});
	}
	
	this.openAllTeams = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/team/teams.js',
			params:{}
		});
	}
	
	this.openTeam = function(){
		if(mod){
			mod.defaultView({uuid:teamUuid,name:teamName,type:data.type});
		}
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
//		record.set('useTitle',false);
		if(o.isSystemUser==='1'){//系统用户
			record.set('title','系统用户');
			return '<span class="meetingman_img">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
		}else{
			return '<span style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
		}
	}

});