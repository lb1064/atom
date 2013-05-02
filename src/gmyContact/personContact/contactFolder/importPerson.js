/**
 * 导入联系人的接口
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var toUUid,parentObj;
	this.mod.defaultView = function(params){
		toUUid = params.toUUid || 'all';
		parentObj = params.obj || null;
		me.mod.main.open({
			id:'importRelativeMan_id',
			xtype:'form',
			title:'导入',
			width:500,
			mode:'pop',
			height:220,
			popBtn:[
				{value:'下一步',itemId:'nextBtn',handler:me.nextPage},
				{value:'取消',handler:me.cancel}
			],
			fields:[
				
//				{
//					height:36,
//					cols:[
//						{xtype:'blank',width:20},
//						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'来源：',width:100},
//						{xtype:'blank',width:5},
//						{xtype:'radiogroup',name:'resource',itemId:'selectFileGroup',width:200,radios:[
//								//{displayValue:'组织级别通讯录',value:'1',cursor:'pointer',textCls:'title_font',on:{'click':me.openOrgtonxun},checked:true,width:140},
////								{displayValue:'文档中心',value:'2',itemId:'donCenter_id',enabled:false,cursor:'pointer',textCls:'title_font',on:{'click':me.openDoc},width:'max'},
//								{displayValue:'本地文件',value:'3',cursor:'pointer',checked:true,textCls:'title_font',on:{'click':me.openLocalFile},width:'max'}
//							]},
//						{xtype:'blank',width:20}
//					]
//				}
//				{
//					height:36,
//					cols:[
//						{xtype:'blank',width:20},
//						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'目标分组：',width:100},
//						{xtype:'blank',width:5},
//						{xtype:'combo',itemId:'targetGroup_idrel',displayField:'text',displayValue:'value',name:'toGroup',width:'max',
//							store:{
//								service:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.service,
//								method:$sl.gmyContact_contactFolder_contactMain_getAllGroupsInfo.method
//							}
//						},
//						{xtype:'blank',width:20}					
//					]
//				}
			],
			initMethod:function(mod){
				var form = me.mod.main.get('importRelativeMan_id');
				var pop = me.mod.main.popMgr.get('importRelativeMan_id');
				var nextBtn = pop.getButton('nextBtn');
				nextBtn.setEnabled(false);
				//var targetGroup_idrel = form.getByItemId('targetGroup_idrel');
//				var selectFileGroup = form.getByItemId('selectFileGroup');
				//刷新目标分组的数据
//				mc.fireEvent(targetGroup_idrel.get('id'),'reload',{
//					data:[
//						{text:'请选择分组',value:''}
//					]
//				});
//				selectFileGroup.setValue('3');
				me.openLocalFile();
//				me.openDoc();
			}
		});
	}
	
	//打开本地文件
	var localfileCol;
	var localFileUuid;
	var localBtfileCol;
	var typeTag;//文件格式标识
	//文档中心的 指定导入范围
	var orgColForImport;
	
	var col1;
	var col2;
	var col3;
	var col4;

	var orgColBtForImport;
	this.openLocalFile = function(){
		me.mod.main.closeExpandView('orgTonxunTree');
		typeTag = undefined;
		var form = me.mod.main.get('importRelativeMan_id');
		if(orgColForImport){
			form.removeItemById(orgColForImport.get('id'));
			orgColForImport = null;
		}
		if(orgColBtForImport){
			form.removeItemById(orgColBtForImport.get('id'));
			orgColBtForImport = null;
		}
		if(localfileCol){
			form.removeItemById(localfileCol.get('id'));
			localfileCol = null;
		};
		if(localBtfileCol){
			form.removeItemById(localBtfileCol.get('id'));
			localBtfileCol = null;
		}
		if(col1){
			form.removeItemById(col1.get('id'));
			col1 = null;
		}
		if(col2){
			form.removeItemById(col2.get('id'));
			col2 = null;
		}
		if(col3){
			form.removeItemById(col3.get('id'));
			col3 = null;
		}
		if(col4){
			form.removeItemById(col4.get('id'));
			col4 = null;
		}
		form.update();
		if(!localfileCol){
			localfileCol = new Colbar({cols:[],align:'left'},{width:'max',height:30});
			
		}
		if(!localBtfileCol){
			localBtfileCol = new Colbar({cols:[],align:'left'},{width:'max',height:30});
		}
		var bt1 = new Gframe.controls.Button({width:100,value:'下一步',handler:me.nextPage});
		bt1.setEnabled(false);
		var label = new Gframe.controls.Label({width:110,value:'导入联系人：',textAlign:'right',textCls:'title_font'});
		var file = new Gframe.controls.DirectUpload({success:function(){
			var pop = me.mod.main.popMgr.get('importRelativeMan_id');
			var nextBtn = pop.getButton('nextBtn');
			nextBtn.setEnabled(true);
			var o = file.getUploadInfo();
			localFileUuid = o.uuid;
			var fileName = o.fileName;
			//对于vCard格式的文件要求直接上传，不在进行映射
			if(fileName.endWith('vcf') || fileName.endWith('zip')){
				typeTag = 'vcard';
			}
			
		}},{width:'max'});
		localfileCol.addItem(new Blank({width:20}));
		localfileCol.addItem(label);
		localfileCol.addItem(new Blank({width:7}));
		localfileCol.addItem(file);
		localfileCol.addItem(new Blank({width:20}));
		
		
		 col1 = new Colbar({cols:[], align:'left'}, {width:'max', height:20});
		 var label1 = new Gframe.controls.Label({textAlign:'left', textCls:'show_font', value:'请上传CSV,Vcard,execl格式的文件', width:'max'});
		
		col1.addItem(new Blank({width:138}));
		col1.addItem(label1);
		col1.addItem(new Blank({width:0}));
		
		 col2 = new Colbar({cols:[], align:'left'}, {width:'max', height:40});
         var label2 = new Gframe.controls.Label({top:6, textAlign:'left', textCls:'title_font', value:'excel模板导入指引：', width:'max'});

        col2.addItem(new Blank({width:59}));
        col2.addItem(label2);
        col2.addItem(new Blank({width:70}));


         col3 = new Colbar({cols:[], align:'left'}, {width:'max', height:30});
        var label3 = new Gframe.controls.Label({textAlign:'left', textCls:'show_font ', value:'1、按提供的模板制作excel表格', width:'200'});
    	//var botton3 = new Gframe.controls.Label({value:'模版下载',width:60,height:30,textCls:'alable',handler:me.downImport,cursor:'pointer'});
    	
        var button3 = new Gframe.controls.Label({textCls:'alable',width:80,height:30,value:'模板下载',handler:me.downImport,cursor:'pointer'});
        col3.addItem(new Blank({width:138}));
        col3.addItem(label3);
        col3.addItem(button3);


         col4 = new Colbar({cols:[], align:'left'}, {width:'max', height:30});
        var label4 = new Gframe.controls.Label({top:6, textAlign:'left', textCls:'show_font', value:'2、“浏览”→“下一步”', width:'200'});

        col4.addItem(new Blank({width:138}));
        col4.addItem(label4);
        col4.addItem(new Blank({width:70}));
		
		
		
		var bt2 = new Gframe.controls.Button({width:100,value:'取消',handler:function(){
				me.mod.main.closeExpandView('orgTonxunTree');
				form.reset();
				if(orgColForImport){
					form.removeItemById(orgColForImport.get('id'));
					orgColForImport = null
				}
				if(orgColBtForImport){
					form.removeItemById(orgColBtForImport.get('id'));
					orgColBtForImport = null;
				};
				if(localfileCol){
					form.removeItemById(localfileCol.get('id'));
					localfileCol = null;
				};
				if(localBtfileCol){
					form.removeItemById(localBtfileCol.get('id'));
					localBtfileCol = null;
				}
				if(col1){
					form.removeItemById(col1.get('id'));
					col1 = null;
				}
				if(col2){
					form.removeItemById(col2.get('id'));
					col2 = null;
				}
				if(col3){
					form.removeItemById(col3.get('id'));
					col3 = null;
				}
				if(col4){
					form.removeItemById(col4.get('id'));
					col4 = null;
				}
				me.mod.main.popMgr.close('importRelativeMan_id');
				form.update();
				
		}});
		
		localBtfileCol.addItem(new Blank({width:'max'}));
		localBtfileCol.addItem(bt1);
		localBtfileCol.addItem(new Blank({width:5}));
		localBtfileCol.addItem(bt2);
		localBtfileCol.addItem(new Blank({width:'max'}));
		
		form.addItem(4,localfileCol);
		form.addItem(6,col1);
		form.addItem(7,col2);
		form.addItem(8,col3);
		form.addItem(9,col4);
//		form.addItem(10,localBtfileCol);
		
		form.update();		
	}
	//模版下载
	this.downImport = function () {
        mc.send({
            service:$sl.gmyContact_personContact_contactFolder_importPerson_getContactModleUuid.service,
            method:$sl.gmyContact_personContact_contactFolder_importPerson_getContactModleUuid.method,
            params:{
            },
            success:function (response) {
                var obj = util.parseJson(response.responseText);
                if (!Atom.isEmpty(obj) && !Atom.isEmpty(obj.uuid)) {
                    mc.download(obj.uuid);
                }
            }
        });

    };
    
    this.cancel = function(){
    	var form = me.mod.main.get('importRelativeMan_id');
    	me.mod.main.closeExpandView('orgTonxunTree');
		form.reset();
		if(orgColForImport){
			form.removeItemById(orgColForImport.get('id'));
			orgColForImport = null;
		}
		if(orgColBtForImport){
			form.removeItemById(orgColBtForImport.get('id'));
			orgColBtForImport = null;
		};
		if(localfileCol){
			form.removeItemById(localfileCol.get('id'));
			localfileCol = null;
		};
		if(localBtfileCol){
			form.removeItemById(localBtfileCol.get('id'));
			localBtfileCol = null;
		}
		if(col1){
			form.removeItemById(col1.get('id'));
			col1 = null;
		}
		if(col2){
			form.removeItemById(col2.get('id'));
			col2 = null;
		}
		if(col3){
			form.removeItemById(col3.get('id'));
			col3 = null;
		}
		if(col4){
			form.removeItemById(col4.get('id'));
			col4 = null;
		}
		me.mod.main.popMgr.close('importRelativeMan_id');
		form.update();
    };
	//下一个步骤
	var targetGroup;
	this.nextPage = function(){
		var form = me.mod.main.get('importRelativeMan_id'); 
		if(typeTag==='vcard'){//vcard格式的文件直接上传,不需要映射
			var o = form.serializeForm();
			mc.send({
				service:$sl.gmyContact_contactFolder_contactFolder_reflectPage_phraseHeader.service,
				method:$sl.gmyContact_contactFolder_contactFolder_reflectPage_phraseHeader.method,
				params:{
					targetGroup:toUUid,
					uuid:localFileUuid
				},
				success:function(response){
					var data = util.parseJson(response.responseText);
					if(data.success){
						me.mod.main.alert({
							text:data.msg,
							level:'info',
							delay:2000
						});
						form.reset();
						me.mod.main.closeExpandView('orgTonxunTree');
						if(orgColForImport){
							form.removeItemById(orgColForImport.get('id'));
							orgColForImport = null;
						}
						if(localfileCol){
							form.removeItemById(localfileCol.get('id'));
							localfileCol = null;
						};
						if(orgColBtForImport){
							form.removeItemById(orgColBtForImport.get('id'));
							orgColBtForImport = null;
						};
						if(localBtfileCol){
							form.removeItemById(localBtfileCol.get('id'));
							localBtfileCol = null;
						}
						me.mod.main.popMgr.close('importRelativeMan_id');
						form.update();
						typeTag = undefined;//清空
					}
				}
		});
			
		}else{
//			targetGroupCom = form.getByItemId('targetGroup_idrel');
//			targetGroup = targetGroupCom.getValue();
		
			me.mod.main.remoteOpen({
				url:'modules/gmyContact/personContact/contactFolder/reflectPage.js',
				params:{
					localFileUuid:localFileUuid,
					targetGroup:toUUid
				}
			});
		}
		
	}
	
	
//	this.openDoc = function(){
//		var importText;
//		var form = me.mod.main.get('importRelativeMan_id');
//		//销毁动态增加的行
//		if(localfileCol && localfileCol.get('id')){
//			form.removeItemById(localfileCol.get('id'));
//			localfileCol = null;
//		}
//		if(localBtfileCol && localBtfileCol.get('id')){
//			form.removeItemById(localBtfileCol.get('id'));
//			localBtfileCol = null;
//		}
//		if(orgColForImport && orgColForImport.get('id')){
//			form.removeItemById(orgColForImport.get('id'));
//			orgColForImport = null;
//		}
//		if(orgColBtForImport && orgColBtForImport.get('id')){
//			form.removeItemById(orgColBtForImport.get('id'));
//			orgColBtForImport = null;
//		}
//		form.update();
//		if(!orgColForImport){
//			orgColForImport = new Colbar({cols:[],align:'left'},{width:'max',height:40});
//		}
//		if(!orgColBtForImport){
//			orgColBtForImport = new Colbar({cols:[],align:'left'},{width:'max',height:40});
//		}
//		var label = new Gframe.controls.Label({width:110,value:'选择文件：',textAlign:'right',textCls:'title_font'});
//		
//		importText = new Gframe.controls.ComboBox({
//			name:'file',
//			displayValue:'value',
//			displayField:'name',
//			store:{
//				service:$sl.gcontact_personContact_contactFolder_getAllFileForImport.service,
//				method:$sl.gcontact_personContact_contactFolder_getAllFileForImport.method,
//				params:{}
//			}
//		},{width:'max'});
//		orgColForImport.addItem(new Blank({width:20,height:'max'}));
//		orgColForImport.addItem(label);
//		orgColForImport.addItem(new Blank({width:5,height:'max'}));
//		orgColForImport.addItem(importText);
//		orgColForImport.addItem(new Blank({width:20,height:'max'}));
//		
//		var bt1 = new Gframe.controls.Button({width:100,value:'确定',handler:me.importRelFunc});
//		var bt2 = new Gframe.controls.Button({width:100,value:'取消',handler:function(){
//				form.reset();
//				me.mod.main.closeExpandView('orgTonxunTree');
//				if(orgColForImport){
//					form.removeItemById(orgColForImport.get('id'));
//					orgColForImport = null;
//				}
//				if(localfileCol){
//					form.removeItemById(localfileCol.get('id'));
//					localfileCol = null;
//				};
//				if(orgColBtForImport){
//					form.removeItemById(orgColBtForImport.get('id'));
//					orgColBtForImport  = null;
//				};
//				if(localBtfileCol){
//					form.removeItemById(localBtfileCol.get('id'));
//					localBtfileCol = null;
//				}
//				me.mod.main.popMgr.close('importRelativeMan_id');
//				form.update();
//		}});
//		
//		orgColBtForImport.addItem(new Blank({width:'max'}));
//		orgColBtForImport.addItem(bt1);
//		orgColBtForImport.addItem(new Blank({width:5}));
//		orgColBtForImport.addItem(bt2);
//		orgColBtForImport.addItem(new Blank({width:'max'}));
//		
//		form.addItem(4,orgColForImport);
//		form.addItem(6,orgColBtForImport);
//		form.update();
//	}
	
	//确定导入联系人
//	this.importRelFunc = function(){
//		var form = me.mod.main.get('importRelativeMan_id');
//		var o = form.serializeForm();
//		var scope = Boolean(o.scope)=== true ? util.parseJson(o.scope):null;
//		if(util.isArray(scope)){
//			scope.each(function(index,col){
//				delete col.name;
//			});
//		
//			scope = util.json2str(scope);
//			o.scope = scope;
//		}
//		if(!o.targetGroup){
//			o.toGroup = toUUid;
//		}
//		form.submit({
//			service:$sl.gmyContact_contactFolder_contactMain_importRelFunc.service,
//			method:$sl.gmyContact_contactFolder_contactMain_importRelFunc.method,
//			params:o,
//			success:function(response){
//				var data = util.parseJson(response.responseText);
//				if(data.success){
//					me.mod.main.alert({
//						text:data.msg,
//						level:'info',
//						delay:2000
//					});
//					var form = me.mod.main.get('importRelativeMan_id');
//					form.reset();
//					me.mod.main.popMgr.close('importRelativeMan_id');
//					//刷新表格的数据
//					parentObj.refreshThisGird();
//					if(orgColForImport){
//						form.removeItemById(orgColForImport.get('id'));
//						orgColForImport = null;
//					}
//					if(localfileCol){
//						form.removeItemById(localfileCol.get('id'));
//						localfileCol = null;
//					};
//					if(orgColBtForImport){
//						form.removeItemById(orgColBtForImport.get('id'));
//						orgColBtForImport = null;
//					};
//					if(localBtfileCol){
//						form.removeItemById(localBtfileCol.get('id'));
//						localBtfileCol = null
//					}
//					if(scope && orgColForImport){
//						form.removeItemById(orgColForImport.get('id'));
//						orgColForImport = null;
//						me.mod.main.closeExpandView('orgTonxunTree');
//					}
//					form.update();
//					
//				}
//			}
//		});
//	}


});