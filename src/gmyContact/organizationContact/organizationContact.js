/**
 * 组织通讯录的主页面,所有通讯录的列表
 */
new (function(){
	
	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({
		
	});
	
	this.mod.defaultView = function(params){
		me.openGrid(params);
	}

	this.openGrid = function(params){
		me.mod.main.open({
			id:'orgContactGrid_id'+new Date().getTime(),
			xtype:'grid',
			mode:'loop',
			key:'orgcontact_gridId',
			checkbox:true,
			currentPage:1,
			usePage:true,
			searchConfig:{
				useSearch:true,
				handler:function(e,obj){
					var o  = {};
					o.key = obj.getValue();
					me.mod.main.remoteOpen({
//						url:'modules/gmyContact/organizationContact/serchContactResult.js',
						url:'modules/gmyContact/organizationContact/serchPersonResult.js',
						params:{
							data:o,
							trackPath:[{name:'我的通讯录',cursor:'false'},
										{name:'其他联系人'}]
						}
					});
				}
			},
			track:[
			//	{name:'我的通讯录',cursor:'false'},
				{name:'其他联系人'}
			],
			actFilter:function(data,purview){
				return purview;
			},
			store:{
				service:$sl.gcontact_personContact_personContact_getAllOrgContactBooks.service,
				method:$sl.gcontact_personContact_personContact_getAllOrgContactBooks.method,
				params:{
					
				},
				success:function(data,mod){

				}
			},
			acts:{
				grid:[
					//{name:'打开',value:'打开',imgCls:'openfolder_btn',handler:me.openChidren,exp:'show'},
//					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editContactInfo,exp:'edit'},
//					{name:'授权',value:'授权',imgCls:'authorize_btn',handler:me.givePriv,exp:'edit'}
				],
				clip:[
//					{name:'生成群',value:'生成群',handler:me.createTeam,exp:'show'},
//					{name:'删除',value:'删除',handler:me.delContact,exp:'edit'}
				],
				track:[
//					{name:'搜索',value:'搜索',handler:me.serchContact,exp:'show'},
//					{name:'新建通讯录',value:'新建通讯录',handler:me.buildContact,exp:'edit'}
//					{name:'生成通讯录',value:'生成通讯录',handler:me.createContact,exp:'edit'}
				]
			},
			colnums:[
				{header:'名称',width:'max',cursor:'pointer',mapping:'name',textAlign:'left',handler:me.openChidrenToo},
				{header:'创建人',width:'max',mapping:'createdBy'},
				{header:'创建时间',mapping:'createdTime',width:'max'},
				{header:'备注',type:'tips',width:'max',mapping:'remark'}
			],
			initMethod:function(mod){
				
			}
		});
	}
	
	this.openChidren = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/groupAndPersonGrid.js',
			params:{
				uuid:o.get('data').uuid,
				name:o.get('data').name
			}
		});
	}
	
	//编辑通讯录信息
	this.editContactInfo = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/editContact.js',
			params:{
				lineData:o.get('data'),
				obj:me,
				uuid:o.get('data').uuid
			}
		});
	}
	
//	//生成通讯录
//	this.createContact = function(){
//		me.mod.main.remoteOpen({
//			url:'modules/gcontact/organizationContact/createContact.js',
//			params:{
//				obj:me
//			}
//		});
//	}
	
	
	this.createTeam = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/team/createTeam.js',
			params:{
				targetFlag:'2'
			}
		});
	}
	
	//新建通讯录
	this.buildContact = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/newEditContact.js',
			params:{
				obj:me,
				tag:'build'
			}
		});
	}
	
	this.openChidrenToo = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/groupAndPersonGrid.js',
			params:{
				uuid:o.uuid,
				name:o.name
			}
		});
	}
	
	//搜索
	this.serchContact = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/serchContact.js',
			params:{
				
			}
		});
	}
	
	//删除
	this.delContact = function(){
		var clipdata = me.mod.main.clipboardMgr.getChecked();
		var uuids = [];
		clipdata.each(function(index,col){
			uuids.push(col.uuid);
		});
		me.mod.main.confirm({
			text:'确定删除该通讯录吗？',
			handler:function(confirm){
				if(confirm){
					mc.send({
						service:$sl.gcontact_organizationContact_deleteContact.service,
						method:$sl.gcontact_organizationContact_deleteContact.method,
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
								me.mod.main.clipboardMgr.remove(uuids);
								me.mod.main.getNavigation().initMethod({type:'2'});
								me.refreshGrid();
							}
						}
					});
				}
			}
			
		})
	}
	
	//授权
	this.givePriv = function(e,o){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/organizationContact/givePriv.js',
			params:{
				lineData:o.get('data')
			}
		});
	}
	
	this.refreshGrid = function(){
		var view = me.mod.main.getCentralView();
		if(view && view.dynamic && view.dynamic.load){
			view.dynamic.load();
		}
	}
});