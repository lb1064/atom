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

	this.openGrid = function(params){
		var data = params.data;
		me.mod.main.open({
			id:'orgContactGrid_id'+new Date().getTime(),
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
					me.mod.defaultView({
							data:o
					});
				}
			},
			track:[
				{name:'我的通讯录',cursor:'false'},
				{name:'行政通讯录',handler:function(){
					me.mod.main.goback();
				}},
				{name:'搜索结果'}
			],
			actFilter:function(data,purview){
				return purview;
			},
			store:{
				service:$sl.gcontact_organizationContact_editContact_serchBooks.service,
				method:$sl.gcontact_organizationContact_editContact_serchBooks.method,
				params:data,
				success:function(data,mod){
					
				}
			},
			actFilter:function(data,purview){
				return purview;
			},
			acts:{
				grid:[
					//{name:'打开',value:'打开',imgCls:'openfolder_btn',handler:me.openChildren,exp:'show&&group'},
//					{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editContactInfo,exp:'edit'},
//					{name:'授权',value:'授权',imgCls:'authorize_btn',handler:me.givePriv,exp:'edit'}
				],
				clip:[ 
//					{name:'生成群',value:'生成群',handler:me.createTeam,exp:'show'},
//					{name:'删除',value:'删除',handler:me.delContact,exp:'edit'}
				]
			},
			colnums:[
				{header:'名称',width:'max',cursor:'pointer',mapping:'name',textAlign:'center',handler:me.openChidrenToo},
				{header:'创建人',width:'max',mapping:'createdBy'},
				{header:'创建时间',mapping:'createdTime',width:'max'},
				{header:'备注',type:'tips',width:'max',mapping:'remark'}
				
			],
			initMethod:function(mod){
				
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