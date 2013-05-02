/**
 *外部导入的文件与本地的文件的映射页面
 *@author tianjun
 *2012.6.20
 */
new (function(){
	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var localFileUuid;//本地文件的uuid
	var targetGroup;//目标分组
	var index = 1;//初始行标
	var comboxData;//当前平台的联系人字段
	var fileData;//从本地文件导入的联系人字段
	var setDefaults;//键值对存储combox和它的默认值，以及外部导入表头的key值,主要信息
	var setDefaultsL;//键值对存储combox和它的默认值，以及外部导入表头的key值,其他信息
	this.mod.defaultView = function(params){
		targetGroup = params.targetGroup;
		localFileUuid = params.localFileUuid;
		me.mod.main.open({
			id:'reflectPage_id',
			xtype:'form',
			mode:'loop',
			acts:{
				track:[
					{name:'导入',value:'导入',handler:me.importLocalFile},
					'-',
					{name:'默认映射',value:'默认映射',handler:me.setDefaultReflect},
					{name:'清除映射',value:'清除映射',handler:me.clearDefaultReflect}
				]
			},
			track:[
//				{name:'我的通讯录',handler:me.openLastPage},
				{name:'我的通讯录',cursor:'false'},
				{name:'外部导入'}
			],
			hiddens:[],
			initMethod:function(mod){
				//数据的重置
				setDefaultsL = null;
				setDefaults = null;
				fileData = null;
				comboxData = null;
				index = 1;
				//创建第一行
				me.createFirst();
                				
			}
		});
	} 
	
	this.openLastPage = function(){
		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/allPersonGrid.js',//个人通讯录的我的全部联系人
			params:{
				option:{
					nodeTag:'all'
				}
			}
		});
	}
	
	this.createFirst = function(){
		allLines = [];
		var form = me.mod.main.get('reflectPage_id');
		var colbar = new Colbar({cols:[],align:'left'},{width:'max',height:36}); 
		var label1 = new Gframe.controls.Label({value:'从CSV，Excel导入元素',width:'max',textCls:'title_font',textAlign:'left'});
		var label2 = new Gframe.controls.Label({value:'通讯录元素',width:'max',textCls:'title_font',textAlign:'left'});
		colbar.addItem(new Blank({width:20}));
		colbar.addItem(label1);
		colbar.addItem(new Blank({width:80}));
		colbar.addItem(label2);
		colbar.addItem(new Blank({width:20}));
		form.addItem(index,colbar);
		form.update();
		index++;
		allLines.push(colbar);
		//获取左边的外部文件的表头,获取右边的系统表头字段,动态构建表单,并且创建其他信息
		me.createPanel();
	}
	
	this.createPanel = function(){
		//第一次请求，获取系统联系人的字段
		mc.send({
			service:$sl.gmyContact_contactFolder_contactFolder_reflectPage_getSysFolders.service,
			method:$sl.gmyContact_contactFolder_contactFolder_reflectPage_getSysFolders.method,
			params:{},
			success:function(response){
					var data = util.parseJson(response.responseText);
					if(data){
						comboxData = data;
						//第二次请求，获取外部文件的表头
						mc.send({
							service:$sl.gmyContact_contactFolder_contactFolder_reflectPage_defaultView.service,
							method:$sl.gmyContact_contactFolder_contactFolder_reflectPage_defaultView.method,
							params:{
								uuid:localFileUuid//本地上传文件的uuid
							},
							success:function(response){
									var data = util.parseJson(response.responseText);
									if(data){
										fileData = data;
										me.createColbar(comboxData,fileData);
									}
							}
						});
					}
			}
		});
	}
	
	//创建行对对象
	//所有动态生成的行,用于重置的时候销毁
	var allLines;
	//combox用到的动态数据
	var comboData;
	this.createColbar = function(comboxData,fileData){
		var form = me.mod.main.get('reflectPage_id');
		//combox的数据
		comboData = [{key:'请选择字段',value:''}];
		setDefaults = [];
		//动态增减行的初始行标
		comboxData.data.each(function(index,col){
			var obj = {};
			for(var p in col){
				obj[p] = col[p];
				obj['value'] = col[p];
			};
			comboData.push(obj);
		});
		if(fileData){
			//主要信息
			fileData.mailInfo.each(function(i,da){
				var colbarLine = new Colbar({cols:[],align:'left'},{width:'max',height:36});
				var combox = new Gframe.controls.ComboBox({data:comboData,displayField:'key',displayValue:'value'},{width:'max'});
				var label = new Gframe.controls.Label({value:da.key,width:'max',textCls:'title_font',textAlign:'left'});
				colbarLine.addItem(new Blank({width:20}));
				colbarLine.addItem(label);
				colbarLine.addItem(new Blank({width:80}));
				colbarLine.addItem(combox);
				colbarLine.addItem(new Blank({width:20}));
				allLines.push(colbarLine);
				form.addItem(index+1,colbarLine);
				
				//便于以后设置默认值
				var setdefaut = {};
				if(da.key){
					setdefaut['valueDefault'] = da.defaultValue || '';
					setdefaut['combox'] = combox;
					setdefaut['keyValue'] = da.key;
					setDefaults.push(setdefaut);
				}
				index++;
			});
			form.update();
		}
		//创建其他信息的标签
		me.createOthers();
	}
	
	//创建其他信息
	this.createOthers = function(){
		var form = me.mod.main.get('reflectPage_id');
		var otherCol = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var otherLabel = new Gframe.controls.Label({value:'查看详细信息',width:'max',handler:me.showOtherDetails,textCls:'alable',cursor:'pointer',mouseOverCls:true,textAlign:'left'});
		otherCol.addItem(new Blank({width:20}));
		otherCol.addItem(otherLabel);
		otherCol.addItem(new Blank({width:'max'}));
		form.addItem(index+1,otherCol);
		index++;
		form.update();
		//用于以后的销毁
		allLines.push(otherCol);
		me.setDefaultReflect();
	}
	
	//查看其他的详细信息
	this.showOtherDetails = function(){
		if(!setDefaultsL){
			var form = me.mod.main.get('reflectPage_id');
			setDefaultsL = [];
			fileData.otherInfo.each(function(i,da){
					var colbarLineL = new Colbar({cols:[],align:'left'},{width:'max',height:36});
					var combox = new Gframe.controls.ComboBox({data:comboData,displayField:'key',displayValue:'value'},{width:'max'});
					var label = new Gframe.controls.Label({value:da.key,width:'max',textCls:'title_font',textAlign:'left'});
					colbarLineL.addItem(new Blank({width:20}));
					colbarLineL.addItem(label);
					colbarLineL.addItem(new Blank({width:80}));
					colbarLineL.addItem(combox);
					colbarLineL.addItem(new Blank({width:20}));
					//便于以后的销毁
					allLines.push(colbarLineL);
					form.addItem(index+1,colbarLineL);
					
					//便于以后设置默认值
					var setdefautL = {};
					if(da.key){
						setdefautL['valueDefault'] = da.defaultValue || '';
						setdefautL['combox'] = combox;
						setdefautL['keyValue'] = da.key;
						setDefaultsL.push(setdefautL);
					}
					index++;
				});
			
				form.update();
		}
	}
	
	//设置默认映射
	this.setDefaultReflect = function(){
		if(setDefaults || setDefaultsL){
			setDefaults.each(function(index,obj){
				var combo = obj['combox'];
				if(obj['valueDefault']){
					combo.setValue(obj['valueDefault']);
				}
			});
			if(setDefaultsL){
				setDefaultsL.each(function(index,obj){
					var combo = obj['combox'];
					if(obj['valueDefault']){
						combo.setValue(obj['valueDefault']);
					}
				});
			}
		}
	}
	
	//清除映射
	this.clearDefaultReflect = function(){
		if(setDefaults || setDefaultsL){
			setDefaults.each(function(index,obj){
				var combo = obj['combox'];
				combo.setValue('');
			});
			setDefaultsL.each(function(index,obj){
				var combo = obj['combox'];
				combo.setValue('');
			});
		}
	}
	
	//提交映射操作结果
	this.importLocalFile = function(){
		var form = me.mod.main.get('reflectPage_id');
		var submitObj = {};
		if(setDefaults){
			setDefaults.each(function(index,obj){
				var combo = obj['combox'];
				var key = obj['keyValue'];
				if(key){
					submitObj[key] = combo.getValue();
				}
			});
		}
	
		if(setDefaultsL && setDefaultsL.length){//其他信息有修改，提交修改后的combox值
		
			setDefaultsL.each(function(index,obj){
				var combo = obj['combox'];
				var key = obj['keyValue'];
				if(key){
					submitObj[key] = combo.getValue();
				}
				
			});
		}else{//其他信息没有修改，直接提交后台返回的其他信息
		
			fileData.otherInfo.each(function(index,obj){
				submitObj[obj.key] = obj.defaultValue;
			});
		};
		submitObj.uuid = Boolean(submitObj.uuid)===false ? localFileUuid:submitObj.uuid;
		submitObj.toGroup = Boolean(submitObj.toGroup)===false ? targetGroup:submitObj.toGroup;
		
		mc.send({
			service:$sl.gmyContact_contactFolder_contactFolder_reflectPage_phraseHeader.service,
			method:$sl.gmyContact_contactFolder_contactFolder_reflectPage_phraseHeader.method,
			params:submitObj,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					//清楚所有动态增加的行
					allLines.each(function(index,col){
						form.removeItemById(col.get('id'));
					});
					me.mod.main.goback();
					allLines = null;
				}
			}
		});
	}
	
});
