new (function(){
	var me = this;
	var jidName;
	var defalutUnit;
	var defaultVolume;
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
			id:'addUserView',
			xtype:'form',
			mode:'pop',
			width:510,
			height:440,
			title:'新增用户',
			popBtn:[
					{name:'确定',value:'确定',handler:me.saveInfo,itemId:'btn'},
					{name:'取消',value:'取消',handler:function(){
						var form = me.mod.main.get('addUserView');
						form.getByItemId('tipMessage').setValue('');
						form.reset();
						me.mod.main.popMgr.close('addUserView');
						
					}}
			],
			fields:[
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'用户名：',width:120,required:true},
					    {xtype:'blank',width:5},
						{xtype:'text',width:5,leftHidden:true,textAlign:'left',itemId:'loginName',name:'loginName',width:150,onBlur:me.chekUserName,vtype:'vblank',errorMsg:'用户名不能为空'},
						{xtype:'blank',width:5},
						{xtype:'label',itemId:'tipMessage',textAlign:'left',width:'max'},
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
						{xtype:'text',width:5,leftHidden:true,textAlign:'left',itemId:'email',vtype:'exp',exp:'^([\u4E00-\u9FFFa-zA-Z0-9\/]+@[\u4E00-\u9FFFa-zA-Z0-9\/]+)?$',
							errorMsg:'邮箱格式错误，请重新输入。',name:'email',width:'max'},
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
								{displayValue : '是',value :'true',width : 50}, 
								{displayValue : '否',value : 'false',checked : true,width : 50}
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
						{xtype : 'radiogroup',width : 235,itemId : 'jid',name:'jid',height:23,
							radios : [
								{displayValue : '自动生成账号 ',value :'1',checked:true, width : 135, on:{'click':function(){
									form = me.mod.main.get("addUserView");
									form.getByItemId('selectBtn').setVisible(false);
									form.getByItemId('showName').setVisible(false);
								}}}, 
								{displayValue : '选择其他账号',value : '2',width : 100,on:{'click' : function() {
									form = me.mod.main.get("addUserView");
									form.getByItemId('selectBtn').setVisible(true);
									form.getByItemId('showName').setVisible(true);
								}}
								}
							]
						},
						{xtype:'text',width : 70,name : 'showName',itemId:'showName',visible:false,
							store:{
								service:$sl.guserManager_config_user_searchAllPersons.service,
								method:$sl.guserManager_config_user_searchAllPersons.method
							},
							autoComplete:true,
							defaultField : 'name',
							displayValue : 'userName'
						},
						{xtype:'blank',width:5},
						{xtype:'button',itemId:'selectBtn',value:'其他',width:45,visible:false,handler:function(){
								me.mod.main.showUserPanel({leftHidden:true,selectMode:2,type:'1',submit:function(data){
									    jidName=data[0].userName;
									    form = me.mod.main.get("addUserView");
									    form.getByItemId('showName').setValue(data[0].name);
									    form.getByItemId('showName').setDisplaySubmitValue(jidName)
									}
								});
							}
						},
//						{xtype:'label',textCls:'title_font',textAlign:'left',itemId:'showName',name:'showName',width:150, height:23},
						{xtype:'blank',width:20}
					]
				},
				{
				    height:36,
				    align:'left',
					cols:[
					    {xtype:'label',textCls:'title_font',textAlign:'right',value:'网盘容量：',width:120},
					    {xtype:'blank',width:5},
				    	{xtype : 'radio',width : 21,itemId : 'defalutSize',name:'defalutSize',height:23,displayValue:'',value:'1',on:{'click':function(){
							form = me.mod.main.get("addUserView");
							form.getByItemId('volume').setVisible(false);
							form.getByItemId('unit').setVisible(false);
							form.getByItemId('customSize').unchecked();
						}}},
						{xtype:'label',textAlign:'left',value:'默认值()',width:114,itemId:'defalutSizeValue',handler:function(){
							form = me.mod.main.get("addUserView");
							form.getByItemId('volume').setVisible(false);
							form.getByItemId('defalutSize').checked();
							form.getByItemId('unit').setVisible(false);
							form.getByItemId('customSize').unchecked();
						}},
						{xtype : 'radio',width : 100,itemId : 'customSize',name:'customSize',height:23,displayValue:'自定义',value:'2',on:{'click':function(){
							form = me.mod.main.get("addUserView");
							form.getByItemId('volume').setVisible(true);
							form.getByItemId('defalutSize').unchecked();
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
			         {name:'jidName',itemId:'jidName'}
			         ],
			initMethod:function(mod){
				var form = me.mod.main.get('addUserView');
				if(!maskCol){
					maskCol = new Colbar({cols:[],align:'center'},{width:'max',height:30});
					mask = new Gframe.controls.Mask({msg:'正在初始化'});
					maskCol.addItem(mask);
					form.addItem(maskCol);
					form.update();
				}
				form.getByItemId('jidName').setValue(jidName);
				form.getByItemId('volume').setVisible(false);
				form.getByItemId('unit').setVisible(false);
				form.getByItemId('selectBtn').setVisible(false);
				form.getByItemId('showName').setVisible(false);
				form.getByItemId('defalutSize').checked();
				form.getByItemId('customSize').unchecked();
				form.getByItemId('jid').setValue('1');
				var MoveFileBtn = me.mod.main.popMgr.get('addUserView').getButton('btn');
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
		var form = me.mod.main.get('addUserView');
		var sv = form.getByItemId('showName').getDisplaySubmitValue();
		if(sv == ''&&form.getByItemId('jid').getValue() == '2'){
			me.mod.main.alert({
				text : "选择绑定的即时通讯账号无效，请重新选择",
				level : 'error',
				delay : 3000
			});
			return;
		}
		if(sv!=""){
			form.getByItemId('jidName').setValue(sv);
		}
		if(form.getByItemId('jid').getValue() == '1'){
			form.getByItemId('showName').setValue('');
			form.getByItemId('jidName').setValue('');
			form.getByItemId('showName').setDisplaySubmitValue('');
		}
		
		form.getByItemId('tipMessage').setValue('');
		var MoveFileBtn = me.mod.main.popMgr.get('addUserView').getButton('btn');
		var data = form.serializeForm();
		
		var bc = false;
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
						me.mod.main.popMgr.close('addUserView');
						me.mod.main.alert({
									text : d.msg,
									level : 'info',
									delay : 3000
								});
						form.reset();
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
	};

	
	//验证用户名是否已被使用
	this.chekUserName = function(){
		var form = me.mod.main.get('addUserView');
		var tipLabel = form.getByItemId('tipMessage');
		var loginName = form.getByItemId('loginName');	
		tipLabel.setValue('');
		var testName = loginName.getValue();
		if (testName != '') {
			mc.send({
				service :$sl.guserManager_sysUserInfoManage_getMyUserInfo.service,
				method :$sl.guserManager_sysUserInfoManage_getMyUserInfo.method,
				params:{
					loginName:testName,
					imageIcom:false
				},
				success:function(response){
					var d = util.parseJson(response.responseText);
					var imageStr;
					if(d.flag){
						userYes = true;
						tipLabel.set('useLimit',false);
						tipLabel.set("useTitle",false);
						imageStr = '<span class="checkOk_btn" style="width:20px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'
						tipLabel.setValue(imageStr+'用户名可用');
//						if(userYes&&emailYes){
//							form.getByItemId('submitBtn').setEnabled(true);
//						}else{
//							form.getByItemId('submitBtn').setEnabled(false);
//						}
					}else{
						userYes = false;
						tipLabel.set('useLimit',false);
						tipLabel.set("useTitle",false);
						//form.getByItemId('userName').setValue('');
						imageStr = '<span class="deletemail_btn" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
						tipLabel.setValue(imageStr+'用户名不可用!');
					}
					
				},
				failure:function(){
					userYes = false;
					tipLabel.set('useLimit',false);
					imageStr = '<span class="deletemail_btn" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
					tipLabel.setValue(imageStr+'用户名不可用!');
					//form.getByItemId('submitBtn').setEnabled(false);
				}
			});
		}
		
	}
	
})