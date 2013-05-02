/**
 * @author tianjun
 * 导入联系人
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var allLines,index,parentDepId,reloadExpendView;
	var obj;
	this.mod.defaultView = function(params){
		parentDepId = params.parentDepId || '';
		obj = params.refreshFn || null;
		me.mod.main.open({
			id:'importPersonFromExcel_id',
			xtype:'form',
			mode:'pop',
			height:280,
			width:550,
			title:'导入',
			fields:[
				{
					height:5,
					cols:[
						{xtype:'blank'}
					]
				},
				{
					height:40,
					cols:[
						{xtype:'label',value:'导入来源：',textCls:'title_font',textAlign:'right',width:80},
						{xtype:'blank',width:20},
						{xtype:'file',name:'fileUuid',itemId:'file_id',width:'max',success:function(tObj){						
							if(bt1){
								bt1.setEnabled(true);
							}
						}},
						{xtype:'blank',width:40}
					]
				}
			],
			initMethod:function(mod){
				reloadExpendView = params.reloadExpendView;
				bt1 = null;
				var form = me.mod.main.get('importPersonFromExcel_id');
				if(allLines){
					allLines.each(function(index,col){
						if(col){
							form.removeItemById(col.get('id'));
							col = null;
						}			
					});
					form.update();
				}
				index = 4;allLines = [];
				me.createFirst();
				if(bt1){
					bt1.setEnabled(false);
				}
			}
		
		
		});
	}
	
	var bt1;
	this.createFirst = function(){
		var form = me.mod.main.get('importPersonFromExcel_id');
		var row = new Rowbar({rows:[]},{width:550,height:200});
		var mainCol = new Colbar({cols:[],align:'left'},{width:550,height:200});
		var colbar1 = new Colbar({align:'left',cols:[]},{width:'max',height:36});
		var colbar2 = new Colbar({align:'left',cols:[]},{width:'max',height:36});
		var colbar3 = new Colbar({align:'left',cols:[]},{width:'max',height:36});
		var colbar4 = new Colbar({align:'left',cols:[]},{width:'max',height:36});
		
		var label1 = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:'max',value:'Excel模板导入指引：'});
		var label2 = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:20,value:'1.'});
		var label2text = new Gframe.controls.Label({textAlign:'left',textCls:'text_font',width:195,value:'按规定的模板制作Excel表格：'});
		var label3 = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:20,value:'2.'});
		var label3text = new Gframe.controls.Label({textAlign:'left',textCls:'text_font',width:'max',value:'"浏览"-->"确定"'});
		
		var downloadtn = new Gframe.controls.Label({textAlign:'left',value:'模板下载',width:60,textCls:'alable',cursor:'pointer',mouseOverCls:true});
		
		
		downloadtn.handler = function(){
			mc.send({
				service:$sl.guserManager_allUsers_importUser.service,
				method:$sl.guserManager_allUsers_importUser.method,
				params:{
					
				},
				success:function(response){
					var data = util.parseJson(response.responseText);
					if(data.fileUuid){
						mc.download(data.fileUuid);
					}
				}
			});
		}
		
		if(!bt1){
			bt1 = new Gframe.controls.Button({width:100,value:'确定',handler:me.importRelFunc});
		}
		var bt2 = new Gframe.controls.Button({width:100,value:'取消',handler:function(){
				me.mod.main.popMgr.close('importPersonFromExcel_id');
				form.reset();
				allLines.each(function(index,col){
					if(col){
						form.removeItemById(col.get('id'));
					}			
				});
				form.update();
		}});
		
		colbar1.addItem(new Blank({width:18}));
		colbar1.addItem(label1);
			
		colbar2.addItem(new Blank({width:18}));
		colbar2.addItem(label2);
		colbar2.addItem(label2text);
		colbar2.addItem(downloadtn);
		colbar3.addItem(new Blank({width:18}));
		colbar3.addItem(label3);
		colbar3.addItem(label3text);
		colbar4.addItem(new Blank({width:'max'}));
		colbar4.addItem(bt1);
		colbar4.addItem(new Blank({width:20}));
		colbar4.addItem(bt2);
		colbar4.addItem(new Blank({width:'max'}));
		
		row.addItem(colbar1);
		row.addItem(colbar2);
		row.addItem(colbar3);
		row.addItem(colbar4);
		
		mainCol.addItem(row);
		
		
		form.addItem(index,mainCol);
		allLines.push(mainCol);
		index++;
		form.update();
	}
	
	//确定导入
	this.importRelFunc = function(){
		var form = me.mod.main.get('importPersonFromExcel_id');
		var da = form.serializeForm();
		bt1.setEnabled(false);
		if(!da.depId){
			da.depId = 	parentDepId;
		}
		mc.send({
			service:$sl.guserManager_allUsers_importUser_importRelFunc.service,
			method:$sl.guserManager_allUsers_importUser_importRelFunc.method,
			params:da,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:3000
					});
					me.mod.main.popMgr.close('importPersonFromExcel_id');
					form.reset();
					me.reloadDangqianGridFunc();
					allLines.each(function(index,col){
						if(col){
							form.removeItemById(col.get('id'));
						}			
					});
					form.update();
//					if(obj){
//						obj();
//					}
				}
				bt1.setEnabled(true);
			},
			failure:function(){
				bt1.setEnabled(true);
				return true;
			}
		});
	}

	this.reloadDangqianGridFunc = function(){
		var view = me.mod.main.getCentralView();
		if (view && view.dynamic && view.dynamic.load) {
			view.dynamic.load();
		}
		reloadExpendView();
	}
});
	