/**
 * @author 田军
 * 导出组
 */
new (function(){
	var me = this;
	
	var myFolderTreeExport;
	this.mod = new Gframe.module.RemoteModule({
		expandView:{
				'myFolderTreeExport':{
					title:'指定目标路径',
					create:function(params){
						myFolderTreeExport = new Treebar({serviceType:true});	
						myFolderTreeExport.handler = function(node){
									if(!node.options.realName){
										node.options.realName=node.options.name;
									}
									var record = {
											uuid : node.options.uuid,
											type:node.options.type,
											name : node.options.realName
									};
									exportToText.setValue(record);
									exportToText.update();
									
						};
						return myFolderTreeExport;
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
								mc.fireEvent(myFolderTreeExport.get('id'),'loadData',{obj:response.responseText});
								}
						});
					}
			}
		}
		
	});
	
	this.mod.defaultView = function(){
		var dataT = [
			{name:'Excel',value:'1'},
			{name:'CSV',value:'2'},
			{name:'Vcard/zip',value:'3'}
		];
		me.mod.main.open({
			id:'exportGroup_id',
			xtype:'form',
			mode:'pop',
			width:600,
			height:220,
			title:'导出通讯录',
			fields:[
//					{height:25,cols:[
//					{xtype:'blank',width:10},
//					//{xtype:'label',textAlign:'left',value:'导出通讯录',textCls:'title_font',width:100},
//					//{xtype:'blank',width:'max'}
//				]},
//				'-',
				{height:40,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'right',textCls:'title_font',value:'导出文件类型：',width:120},
						{xtype:'blank',width:5},
						{xtype:'combo',displayField:'name',defaultValue:'1',itemId:'houseAnpaiZhusucombo',displayValue:'value',data:dataT,name:'type',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{height:40,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'导出到：',width:120},
						{xtype:'blank',width:5},
						{xtype:'radiogroup',name:'export',itemId:'exportTo_id',radios:[
							{displayValue:'我的网盘',value:'1',cursor:'pointer',checked:true,width:120},
							{displayValue:'本地',value:'2',cursor:'pointer',width:'max',checked:true,width:60}
						]},
						{xtype:'blank',width:20}					
				]}
			],
			popBtn:[	
			        {xtype:'button',value:'确定',width:100,handler:me.confirmExport},
			        {xtype:'button',value:'取消',width:100,handler:function(){
			        	var form = me.mod.main.get('exportGroup_id');
			        	form.reset();
			        	me.openLocal();		
			        	me.mod.main.closeExpandView('myFolderTreeExport');
			        	me.mod.main.popMgr.close('exportGroup_id');
			        	
			        }}
			        ],
			initMethod:function(mod){
				//导出到文档中心
				
			}
		});
	}
	
	this.openLocal = function(){
		var form = me.mod.main.get('exportGroup_id');
		if(col){
			form.removeItemById(col.get('id'));
			form.update();
		}
	}
	
	var exportToText;
	var col;
	this.confirmExport = function(){
		var form = me.mod.main.get('exportGroup_id');
		var o = form.serializeForm();
		var clipUuids = me.mod.main.clipboardMgr.getChecked();
		var uuids = [];
		var clipuuid = [];
		clipUuids.each(function(index,col){
			var obj = {
				uuid:col.uuid,
				type:col.memberType
			};
		
			clipuuid.push(col.uuid);
			uuids.push(obj);
		});
	
		var exportTo_id = form.getByItemId('exportTo_id');
		if(!o.uuids){
			o.uuids = util.json2str(uuids);
		}
			
//		var str = exportToText.getValue();
//		str = util.parseJson(str);
//		str = util.isObject(str[0])===true?str[0].uuid:'';
//		if(!o.stored && exportTo_id.getValue()==='1'){
//			o.stored = str;
//		} 
		mc.send({
			//导出到本地和文档中心公用
			service:$sl.gmyContact_contactFolder_contactMain_exportGroup.service,
			method:$sl.gmyContact_contactFolder_contactMain_exportGroup.method+'$_'+o['export'],
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					var form = me.mod.main.get('exportGroup_id');
					var value = form.getByItemId('exportTo_id').getValue();
					if(value=='1'){
						me.mod.main.popMgr.close('exportGroup_id');	
						me.mod.main.showFilePanel({
							folderType: 'document',
							fileMode:1,
							selectMode:1,
							submit: function (data) {
							//	console.log(data[0].path); 添加到我的网盘
							//	console.log(data[0]);
								o.toUuid=data[0].uuid;
								mc.send({
									////加导出到文档中心公用WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
									service:$sl.gmyContact_contactFolder_contactMain_exportForGroup.service,
									method:$sl.gmyContact_contactFolder_contactMain_exportForGroup.method+'$_'+o['export'],
									params:o,
									//	uuids:o.uuidStr
									success:function(response){
										var data = util.parseJson(response.responseText);
										
										me.mod.main.alert({
											text:"导出到我的网盘成功!",
											level:'info',
											delay:2000
										});
										var centralView = me.mod.main.getCentralView();
											centralView.dynamic.load();
									}
								});
									
								//------
							}});
					}else{
						if(data.uuid){
							mc.download(data.uuid);
						}else{
							//实现导出到本地
							me.mod.main.alert({
								text:data.msg,
								level:'info',
								delay:2000
							});
						}
						var form = me.mod.main.get('exportGroup_id');
						form.reset();
						me.openLocal();		
						me.mod.main.closeExpandView('myFolderTreeExport');
						me.mod.main.popMgr.close('exportGroup_id');	
						me.mod.main.clipboardMgr.remove(clipuuid);
					}
					
				}
			}
		});
	}
	
	
	this.addNewCol = function(){
		var form = me.mod.main.get('exportGroup_id');
		col = new Colbar({cols:[],align:'left'},{width:'max',height:40});
		var nameLabel3 = new Gframe.controls.Label({width:130,height:40,textAlign:'right',textCls:'title_font',value:'存储路径：'});
		exportToText = new Gframe.controls.TextFieldPlus({
			//name:'stored',
			defaultField:'name',
			selectOnly:true,
			width:'max',
			listeners : ({'click' : function(){
					me.mod.main.showExpandView('myFolderTreeExport');
			}}),
			fields:['name','uuid']
		});
		col.addItem(new Blank({width:20}));
		col.addItem(nameLabel3);
		col.addItem(new Blank({width:10}));
		col.addItem(exportToText);
		col.addItem(new Blank({width:20}));
		form.addItem(5,col);
		form.update();
	}
	
	
});
