/**
 * 从消息推打开名片
 */

 new (function(){
 
 	var me = this;
 	
 	this.mod = new Gframe.module.RemoteModule({});
 	
 	var uuid,index;
 	var getData;
 	this.mod.defaultView = function(params){
 		
 		uuid = params.uuid || '';
 		me.mod.main.open({
 			id:'cardFormPanel_id',
 			xtype:'form',
 			mode:'loop',
 			track:[
 				{name:'收到的名片'}
 			],
 			acts:{
 					track:[
 						{name:'查看详情',value:'查看详情',handler:me.openDetail}
 					]
 			},
 			fields:[
 				
 			],
 			initMethod:function(mod){
 				index = 1;
 				var form = me.mod.main.get('cardFormPanel_id');
 				form.removeData();
 				mc.send({
						service:$sl.gcontact_personContact_contactFolder_viewPersonCard.service,
						method:$sl.gcontact_personContact_contactFolder_viewPersonCard.method,
						params:{
							uuid:uuid
						},
						success:function(response){
								var data = util.parseJson(response.responseText);
								if(data){
									//构建表单
									me.createPanel1(data);
									getData = data;
									getData.uuid = uuid;
								}
						}
				});
 			}
 			
 		});
 	
 	}
 	
 	this.createPanel1 = function(data){
 		var form = me.mod.main.get('cardFormPanel_id');
 		
 		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
 		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
 		var col3 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
 		var nameLabel = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'发送人：'});
 		var nameValueLabel2 = new Gframe.controls.Label({textAlign:'left',width:'max'});
 		
 		
 		var timeLabel = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'发送时间：'});
 		var timeValueLabel = new Gframe.controls.Label({textAlign:'left',width:'max'});
 		timeValueLabel.setValue(data.sendTime);
 		
 		var contentLabel = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'包含内容：'});

 		
 		col1.addItem(new Blank({width:20}));
 		col1.addItem(nameLabel);
 		col1.addItem(new Blank({width:10}));
 		col1.addItem(nameValueLabel2);
 		
 		
 		
 		col2.addItem(new Blank({width:20}));
 		col2.addItem(timeLabel);
 		col2.addItem(new Blank({width:10}));
 		col2.addItem(timeValueLabel);
 		
 		col3.addItem(new Blank({width:20}));
 		col3.addItem(contentLabel);
 		
 		form.addItem(index,col1);
 		form.addItem(index+1,col2);
 		form.addItem(index+2,col3);
 				
 		if(util.isArray(data.sendContent)){
 			var contenValueLabel = new Gframe.controls.Label({textAlign:'left',width:'max'});
 			contenValueLabel.setValue(data.sendContent[0]);
 			col3.addItem(contenValueLabel);
 		}
 		if(data.sendContent.length>=2){
 			for(var i=1;i<data.sendContent.length;i++){
	 			var col4 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
	 			var lab = new Gframe.controls.Label({textAlign:'left',width:'max'});
	 			col4.addItem(new Blank({width:20}));
	 			col4.addItem(new Blank({width:120}));
	 			col4.addItem(lab);
	 			lab.setValue(data.sendContent[i]);
	 			form.addItem(index+3,col4);
 			}
 		} 	
 		nameValueLabel2.setValue(data.sendPerson);
 		form.update();
 	}
 	
 	this.openDetail = function(){
 		me.mod.main.remoteOpen({
			url:'modules/gmyContact/personContact/contactFolder/showCardDatailMsg.js',
			params:{
				sendPerson:getData.sendPerson,//发送人的名字
				personUuid:getData.uuid,//人的uuid
				data:getData,//行数据
				uuid:uuid
			}
		});
 	}
 
 
 });