/**
 * 排序
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var uuid;
	var lineData;
	var obj;
	var tag;
	var index;
	this.mod.defaultView = function(params){
		uuid = params.uuid || '';
		index = 1;
		allcols = [];
		lineData = params.lineData || undefined;
		obj = params.obj || undefined;
		tag = params.tag || '';
		me.mod.main.open({
			id:'giveSortForPerson_id',
			xtype:'form',
			mode:'pop',
			width:550,
			height:160,
			title:'排序',
			popBtn:[
			        {value:'确定',handler:function(){
			        	var form = me.mod.main.get('giveSortForPerson_id');
						if(text.getValue()){
							var value = text.getValue();//^[0-9]*$
							var reg = new RegExp(/^[0-9]*$/);
							if(!reg.test(value)){
								me.mod.main.alert({
									text:'请输入大于0的整数!',
									delay:2000,
									level:'error'
								});
								return ;
							}
						}
						mc.send({
							service:$sl.gcontact_organizationContact_setSortForPerson.service,
							method:$sl.gcontact_organizationContact_setSortForPerson.method,
							params:{
								uuid:uuid,
								sort:text.getValue()
							},
							success:function(response){
								var data = util.parseJson(response.responseText);
								if(data.success){
									me.mod.main.alert({
										text:data.msg,
									delay:2000,
									level:'info'
									});
									obj.refreshThisGird();
									form.reset();
									allcols.each(function(index,col){
										form.removeItemById(col.get('id'));
									});
									form.update();
									me.mod.main.popMgr.close('giveSortForPerson_id');
								}
							}
						});
					}},
			        {value:'取消',handler:function(){
			        	var form = me.mod.main.get('giveSortForPerson_id');
						form.reset();
						allcols.each(function(index,col){
							form.removeItemById(col.get('id'));
						});
						form.update();
						me.mod.main.popMgr.close('giveSortForPerson_id');
					}}
			        ],
			fields:[
				
			],
			initMethod:function(mod){
				index = 1;
				allcols = [];
				me.createPanel();
			}
		});
	}
	
	//创建面板
	var text;
	var allcols;
	this.createPanel = function(){
		var form = me.mod.main.get('giveSortForPerson_id');
		var colbar1 = new Colbar({cols:[],align:'left'},{width:'max',height:30});
		var colbar2 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var colbar3 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		text = new Gframe.controls.TextField({width:'max',name:'sort',leftHidden:true});
		var label = new Gframe.controls.Label({value:'排序：',textCls:'title_font',textAlign:'right',width:70});
//		var btn1 = new Gframe.controls.Button({value:'确定',width:100,handler:function(){
//			if(text.getValue()){
//				var value = text.getValue();//^[0-9]*$
//				var reg = new RegExp(/^[0-9]*$/);
//				if(!reg.test(value)){
//					me.mod.main.alert({
//						text:'请输入数字!',
//						delay:2000,
//						level:'error'
//					});
//					return ;
//				}
//			}
//			mc.send({
//				service:$sl.gcontact_organizationContact_setSortForPerson.service,
//				method:$sl.gcontact_organizationContact_setSortForPerson.method,
//				params:{
//					uuid:uuid,
//					sort:text.getValue()
//				},
//				success:function(response){
//					var data = util.parseJson(response.responseText);
//					if(data.success){
//						me.mod.main.alert({
//							text:data.msg,
//						delay:2000,
//						level:'info'
//						});
//						obj.refreshThisGird();
//						form.reset();
//						allcols.each(function(index,col){
//							form.removeItemById(col.get('id'));
//						});
//						form.update();
//						me.mod.main.popMgr.close('giveSortForPerson_id');
//					}
//				}
//			});
//		}});
//		var btn2 = new Gframe.controls.Button({value:'取消',width:100,handler:function(){
//			form.reset();
//			allcols.each(function(index,col){
//				form.removeItemById(col.get('id'));
//			});
//			form.update();
//			me.mod.main.popMgr.close('giveSortForPerson_id');
//		}});
		var label2 = new Gframe.controls.Label({value:'数字越大，排序越靠前',cls:'show_font',width:'max',textAlign:'left'});
		colbar1.addItem(new Blank({width:20}));
		colbar1.addItem(label);
		colbar1.addItem(new Blank({width:5}));
		colbar1.addItem(text);
		colbar1.addItem(new Blank({width:20}));
		
		colbar2.addItem(new Blank({width:95}));
		colbar2.addItem(label2);
		colbar2.addItem(new Blank({width:20}));
		
		colbar3.addItem(new Blank({width:'max'}));
	//	colbar3.addItem(btn1);
		colbar3.addItem(new Blank({width:20}));
	//	colbar3.addItem(btn2);
		colbar3.addItem(new Blank({width:'max'}));
		
		form.addItem(index,colbar1);
		form.addItem(index+1,colbar2);
		form.addItem(index+2,colbar3);
		
		form.update();
		allcols.push(colbar1);
		allcols.push(colbar2);
		allcols.push(colbar3);
		if(lineData){
			text.setValue(lineData.sort);
		}
	}

});