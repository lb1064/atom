new (function(){
	var me = this;
	var defalutUnit;
	var defaultVolume;
	var jidName;
	var statusData = [
		{text:'KB',value:'KB'},
		{text:'MB',value:'MB'},
		{text:'GB',value:'GB'}
	]
	var parentParams;
	this.mod = new Gframe.module.RemoteModule({})
	var maskCol,mask;
	this.mod.defaultView = function(params){
		parentParams = params;
		me.mod.main.open({
			id:'editUserView',
			xtype:'form',
			mode:'pop',
			width:500,
			height:440,
			store:{
				service:$sl.guserManager_config_config_getMyUserInfo.service,
				method:$sl.guserManager_config_config_getMyUserInfo.method,
				params:{
					loginName:params.uuid,
					imageIcom:false
				},
				success:function(response){
					var data = response;
					if(data){
						var form = me.mod.main.get('editUserView');
						if(data.sys == 'true'||data.sys == true){
							form.getByItemId('sys').getByItemId('checkYes').checked();
							form.getByItemId('sys').getByItemId('checkNo').unchecked();
						}else{
							form.getByItemId('sys').getByItemId('checkNo').checked();
							form.getByItemId('sys').getByItemId('checkYes').unchecked();
						}
						
						if(data.selected){
							form.getByItemId('defalutSize').unchecked();
							form.getByItemId('customSize').checked();
							form.getByItemId('unit').setValue(data.unit);
							form.getByItemId('volume').setValue(data.volume);
						}else{
							form.getByItemId('defalutSize').checked();
							form.getByItemId('customSize').unchecked();
						}
						
						

//						form.getByItemId('jid').setValue('2');
						form.getByItemId('showName').setDisplaySubmitValue(data.jidName);
						form.getByItemId('showName').setValue(data.showName);
							
						form.getByItemId('volume').setVisible(data.selected);
						form.getByItemId('unit').setVisible(data.selected);
//						form.getByItemId('selectBtn').setVisible(true);
//						form.getByItemId('showName').setVisible(true);
					}
					
				}
			},
			title:'编辑用户',
			popBtn:[
					{name:'确定',value:'确定',handler:me.saveInfo,itemId:'btn'},
					{name:'取消',value:'取消',handler:function(){
						var form = me.mod.main.get('editUserView');
						form.reset();
						me.mod.main.popMgr.close('editUserView');
					}}
			],
			fields:[
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'用户名：',width:120,required:true},
					    {xtype:'blank',width:5},
						{xtype:'text',width:5,leftHidden:true,textAlign:'left',itemId:'loginName',name:'loginName',enabled:false,width:150,vtype:'vblank',errorMsg:'用户名不能为空'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'姓名：',width:120,required:true},
					    {xtype:'blank',width:5},
						{xtype:'text',width:5,leftHidden:true,textAlign:'left',itemId:'name',name:'name',width:'max',vtype:'vblank',errorMsg:'姓名不能为空'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'性别：',width:120},
					    {xtype:'blank',width:5},
						{xtype : 'radiogroup',width : 'max',itemId : 'sex',name:'sex',height:23,
							radios : [
								{displayValue : '男',value :'M',checked : true,width : 50}, 
								{displayValue : '女',value : 'W',width : 50}
							]
						},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'邮箱：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',width:5,leftHidden:true,textAlign:'left',vtype:'exp',exp:'^([\u4E00-\u9FFFa-zA-Z0-9\/]+@[\u4E00-\u9FFFa-zA-Z0-9\/]+)?$',
							errorMsg:'邮箱格式错误，请重新输入。',itemId:'email',name:'email',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'手机：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',width:5,leftHidden:true,textAlign:'left',itemId:'phoneNum',vtype:'exp',exp:'^([0-9])*$',
					    	errorMsg:'手机格式错误，请重新输入。',name:'phoneNum',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'部门：',width:120},
					    {xtype:'blank',width:5},
						{xtype:'text',width:5,leftHidden:true,textAlign:'left',itemId:'department',name:'department',width:'max'},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'系统管理员：',width:120},
					    {xtype:'blank',width:5},
						{xtype : 'radiogroup',width : 'max',itemId : 'sys',name:'sys',height:23,
							radios : [
								{displayValue : '是',value :'true',checked : true,itemId:'checkYes',width : 50}, 
								{displayValue : '否',value : 'false',itemId:'checkNo',width : 50}
							]
						},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'即时通讯账号：',width:120},
					    {xtype:'blank',width:5},
						{xtype : 'radio',height:23,displayValue : '自动生成账号 ',value :'1',enabled:false,checked:true, width : 135},
						{xtype : 'radio',width : 90,height:23,displayValue:'选择账号',value:'2',checked:true},
						{xtype:'text',width : 70,name : 'showName',itemId:'showName',
							store:{
								service:$sl.guserManager_config_user_searchAllPersons.service,
								method:$sl.guserManager_config_user_searchAllPersons.method,
							},
							autoComplete:true,
							defaultField : 'name',
							displayValue : 'userName'
						},
						{xtype:'blank',width:5},
						{xtype:'button',itemId:'selectBtn',value:'其他',width:45,handler:function(){
								me.mod.main.showUserPanel({leftHidden:true,selectMode:2,type:'1',submit:function(data){
									    jidName=data[0].userName;
									    form = me.mod.main.get("editUserView");
									    form.getByItemId('showName').setValue(data[0].name);
									    form.getByItemId('showName').setDisplaySubmitValue(jidName)
									}
								});
							}
						},
						{xtype:'blank',width:5},
//						{xtype:'label',textCls:'title_font',textAlign:'left',itemId:'showName',name:'showName',width:150, height:23},
						{xtype:'blank',width:20}
					]
				},
//				{
//				    height:36,
//				    align:'left',
//					cols:[
//					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'即时通讯账号：',width:120},
//					    {xtype:'blank',width:5},
//						{xtype : 'radiogroup',width : 235,itemId : 'jid',name:'jid',height:23,
//							radios : [
//								{displayValue : '自动生成账号 ',value :'1',enabled:false,checked:true, width : 135, on:{'click':function(){
//									form = me.mod.main.get("editUserView");
////									form.getByItemId('showName').setValue("");
//									form.getByItemId('selectBtn').setVisible(false);
//									form.getByItemId('showName').setVisible(false);
//								}}}, 
//								{displayValue : '选择其他账号',value : '2',width : 100,on:{'click' : function() {
//									form = me.mod.main.get("editUserView");
//									form.getByItemId('selectBtn').setVisible(true);
//									form.getByItemId('showName').setVisible(true);
//								}}
//								}
//							]
//						},
//						{xtype:'text',width : 70,name : 'showName',itemId:'showName',visible:false,
//							store:{
//								service:$sl.guserManager_config_user_searchAllPersons.service,
//								method:$sl.guserManager_config_user_searchAllPersons.method,
//							},
//							autoComplete:true,
//							defaultField : 'name',
//							displayValue : 'userName'
//						},
//						{xtype:'blank',width:5},
//						{xtype:'button',itemId:'selectBtn',value:'其他',width:45,visible:false,handler:function(){
//								me.mod.main.showUserPanel({selectMode:2,type:'1',submit:function(data){
//									    jidName=data[0].userName;
//									    form = me.mod.main.get("editUserView");
//									    form.getByItemId('showName').setValue(data[0].name);
//									    form.getByItemId('showName').setDisplaySubmitValue(jidName)
//									}
//								});
//							}
//						},
//						{xtype:'blank',width:5},
////						{xtype:'label',textCls:'title_font',textAlign:'left',itemId:'showName',name:'showName',width:150, height:23},
//						{xtype:'blank',width:20}
//					]
//				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'网盘容量：',width:120},
					    {xtype:'blank',width:5},
				    	{xtype : 'radio',width : 21,itemId : 'defalutSize',name:'defalutSize',height:23,displayValue:'',value:'1',on:{'click':function(){
							form = me.mod.main.get("editUserView");
//								form.getByItemId('volume').setValue("");
							form.getByItemId('customSize').unchecked();
							form.getByItemId('volume').setVisible(false);
							form.getByItemId('unit').setVisible(false);
						}}},
						{xtype:'label',textAlign:'left',value:'默认值()',width:114,itemId:'defalutSizeValue',handler:function(){
							form = me.mod.main.get("editUserView");
							form.getByItemId('volume').setVisible(false);
							form.getByItemId('defalutSize').checked();
							form.getByItemId('unit').setVisible(false);
							form.getByItemId('customSize').unchecked();
						}},
						{xtype : 'radio',width : 90,itemId : 'customSize',name:'customSize',height:23,displayValue:'自定义',value:'2',on:{'click':function(){
							form = me.mod.main.get("editUserView");
							form.getByItemId('defalutSize').unchecked();
							form.getByItemId('volume').setVisible(true);
							form.getByItemId('unit').setVisible(true);
						}}},
						{xtype:'text',width:5,leftHidden:true,textAlign:'right',value:'1024',itemId:'volume',visible:false,name:'volume',width:70},
						{xtype:'blank',width:5},
						{xtype:'combo',width:5,data:statusData,displayField:'text',defaultValue:statusData[1].value,visible:false,displayValue:'value',name:'unit',itemId:'unit',width:45},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:5,
				    align:'left',
					cols:[
						{xtype:'blank',width:'max'}
					]
				}
			],
			hiddens:[
				{name:'uuid',itemId:'uuid'},
				{name:'jidName',itemId:'jidName'}
			],
			initMethod:function(mod){
				var form = me.mod.main.get('editUserView');
				if(!maskCol){
					maskCol = new Colbar({cols:[],align:'center'},{width:'max',height:30});
					mask = new Gframe.controls.Mask({msg:'正在更新用户'});
					maskCol.addItem(mask);
					form.addItem(maskCol);
					form.update();
				}
				var MoveFileBtn = me.mod.main.popMgr.get('editUserView').getButton('btn');
				MoveFileBtn.setEnabled(true);
				
				mc.send({
					service:$sl.guserManager_config_config_getContextNetDiskCapacity.service,
					method:$sl.guserManager_config_config_getContextNetDiskCapacity.method,
					params:{
					},
					success:function(response){
						var data = util.parseJson(response.responseText);
						var text = "默认值("+data.maxSize+data.unit+")";
						form.getByItemId('defalutSizeValue').setValue(text);
						defalutUnit = data.unit;
						defaultVolume = data.maxSize;
					}
				})
			}
		});
	}
	
	
	//提交表单
	this.saveInfo = function(){
		var form = me.mod.main.get('editUserView');
		
//		
//		var email = form.getByItemId('email').getValue();
//		var pattEmail = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");
//		var resultEmail = pattEmail.test(email);
//		if(resultEmail == "false" || resultEmail == false){
//			me.mod.main.alert({
//				text : "",
//				level : 'info',
//				delay : 2000
//			})
//			return
//		}
		
//		var phoneNum = form.getByItemId('phoneNum').getValue();
//		var patt1 = new RegExp("^[0-9]*$");
//		var result = patt1.test(phoneNum);
//		if(result == "false" || result == false){
//			me.mod.main.alert({
//				text : "请输入正确的手机号码",
//				level : 'info',
//				delay : 2000
//			})
//			return
//		}
		
		
		var sv = form.getByItemId('showName').getDisplaySubmitValue();
		form.getByItemId('jidName').setValue(sv);
//		if(sv == ''&&form.getByItemId('jid').getValue() == '2'){
//			me.mod.main.alert({
//				text : "选择绑定的即时通讯账号无效，请重新选择",
//				level : 'error',
//				delay : 3000
//			});
//			return;
//		}
//		if(sv!=""){
//			form.getByItemId('jidName').setValue(sv);
//		}
		
		
		var data = form.serializeForm();
		
		if(form.getByItemId('defalutSize').getChecked()){
			data.unit = defalutUnit;
			data.volume = defaultVolume
			data.selected = false;
		}else{
			data.selected = true;
			var v = form.getByItemId('volume').getValue();
			var patt1 = new RegExp("^(([1-9])|([1-9][0-9]{1,2})|(10[01][0-9])|(102[1234]))$");
			if(!patt1.test(v)){
				me.mod.main.alert({
					text : "请输入1-1024之间的整数",
					level : 'error',
					delay : 3000
				});
				MoveFileBtn.setEnabled(true);
				return;
			}
		}
		
		var flag = form.validate();
		if(flag==true){
			var MoveFileBtn = me.mod.main.popMgr.get('editUserView').getButton('btn');
			data.loginName = form.getByItemId('loginName').getValue();
			MoveFileBtn.setEnabled(false);
			mask.onMask();
			mc.send({
				service:$sl.guserManager_config_config_addUser.service,
				method:$sl.guserManager_config_config_addUser.method,
				params:data,
				success : function(response){
					var d = util.parseJson(response.responseText);
					if (d.success) {
						mask.unMask();
						me.mod.main.alert({
									text : d.msg,
									level : 'info',
									delay : 3000
								});
						form.reset();
						me.mod.main.popMgr.close('editUserView');
						parentParams.refreshFn();
						MoveFileBtn.setEnabled(true);
					}
				},
				failure: function() {
					mask.unMask();
					MoveFileBtn.setEnabled(true);
					return true;
				}
			});
		}
	}

})