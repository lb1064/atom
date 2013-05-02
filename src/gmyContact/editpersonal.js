new (function(){
	var me = this;
	var rootUuid;
	var id;
	var mainGridPath;
	var systemUserTree;
	this.mod = new Gframe.module.Module({
		
	});
	var id;
	this.mod.defaultView = function(params){
		var userData;
		var sexData=[{text:'男',value:'1'},{text:'女',value:'2'}];
		me.mod.open({
			id:'addNewuser_id',
			xtype:'form',
			mode:'loop',
			track:[
				{name:'用户信息',value:'userMessage'}
			],
			acts:{
				track:[
					{name:'保存',value:'保存',handler:me.submitUserMessage},
					{name:'取消',value:'取消',handler:me.closeUserMagValue}
				]
			},
			store:{
				service:'user.userAction',
				method:'viewUser',
				params:{
					loginName:mc.username
				},
				success:function(data,mod){
					userData=data;
					
					var msgForm=me.mod.get('addNewuser_id');
					msgForm.getByItemId('showName').setValue(userData.showName);
					msgForm.getByItemId('signature').setValue(userData.signature);
					msgForm.getByItemId('sex').setValue(userData.sex);
					msgForm.getByItemId('phone').setValue(userData.phone);
					msgForm.getByItemId('tel').setValue(userData.tel);
					msgForm.getByItemId('fax').setValue(userData.fax);
					msgForm.getByItemId('email').setValue(userData.email);
					msgForm.getByItemId('homePage').setValue(userData.homePage);
					msgForm.getByItemId('qq').setValue(userData.qq);
					msgForm.getByItemId('msn').setValue(userData.msn);
					msgForm.getByItemId('loginName').setValue(userData.loginName);
					
					var imageUi=msgForm.getByItemId('uuicon');
					var icoUuid=userData.iconUuid;
					if(icoUuid){
						imageUi.setImgUrl(mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+data.iconUuid);
					}else{
						imageUi.setImgUrl('adapter/images/man01.png');
					}
				}
			},
			fields:[
					{	
						height:115,
						cols:[
							{xtype:'blank',width:20},
							{xtype:'image',width:150,height:110,name:'uuicon',itemId:'uuicon'},
							{xtype:'blank',width:10},
							{xtype:'file',value:'上传',itemId:'iconUuid',name:'iconUuid',leftHidden:'true',top:70,success:me.upLoadSuccess}
					]},
					{cols:[
							{xtype:'blank',width:20},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'姓名：',width:100},
							{xtype:'blank',width:5},
							{xtype:'text',textAlign:'left',name:'showName',itemId:'showName',width:300,leftHidden:true},
							{xtype:'label',top:2,textAlign:'right',textCls:'title_font',value:'性别：',width:100},
							{xtype:'blank',width:5},
							{xtype:'combo',data:sexData,displayField:'text',displayValue:'value',itemId:'sex',name:'sex',width:150},
							{xtype:'blank',width:'max'}
					]},
					{
						cols:[
							{xtype:'blank',width:70},
							{xtype:'checkbox',name:'checkYesOrNo',itemId:'checkYesOrNo',displayValue:'修改密码',
										on:{'click':me.changeUpdat},checked:false,value:true,width:100
							}
						]
					},
					{cols:[
							{xtype:'blank',width:20},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'原密码：',width:100},
							{xtype:'blank',width:5},
							{xtype:'password',textAlign:'left',itemId:'passWordOld',name:'passWordOld',width:300,leftHidden:true},
							{xtype:'blank',width:'max'}
					]},
					{cols:[
							{xtype:'blank',width:20},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'输入新密码：',width:100},
							{xtype:'blank',width:5},
							{xtype:'password',name:'passWordNew',itemId:'passWordNew',width:300,leftHidden:true},
							{xtype:'blank',width:'max'}
					]},
					{cols:[
							{xtype:'blank',width:20},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'确认新密码：',width:100},
							{xtype:'blank',width:5},
							{xtype:'password',name:'passWordNewYes',itemId:'passWordNewYes',width:300,leftHidden:true},
							{xtype:'blank',width:'max'}
					]},
					{cols:[
							{xtype:'blank',width:20},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'签名：',width:100},
							{xtype:'blank',width:5},
							{xtype:'text',name:'signature',itemId:'signature',width:300,leftHidden:true},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'网站：',width:100},
							{xtype:'blank',width:5},
							{xtype:'text',name:'homePage',itemId:'homePage',width:300,leftHidden:true},
							{xtype:'blank',width:'max'}
					]},
					{cols:[
							{xtype:'blank',width:20},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'电话：',width:100},
							{xtype:'blank',width:5},
							{xtype:'text',name:'tel',itemId:'tel',width:300,leftHidden:true},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'手机：',width:100},
							{xtype:'blank',width:5},
							{xtype:'text',name:'phone',itemId:'phone',width:300,leftHidden:true},
							{xtype:'blank',width:'max'}
					]},
					{cols:[
							{xtype:'blank',width:20},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'传真：',width:100},
							{xtype:'blank',width:5},
							{xtype:'text',name:'fax',itemId:'fax',width:300,leftHidden:true},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'邮箱：',width:100},
							{xtype:'blank',width:5},
							{xtype:'text',name:'email',itemId:'email',width:300,leftHidden:true},
							{xtype:'blank',width:'max'}
					]},
					{cols:[
							{xtype:'blank',width:20},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'QQ：',width:100},
							{xtype:'blank',width:5},
							{xtype:'text',name:'qq',itemId:'qq',width:300,leftHidden:true},
							{xtype:'label',textAlign:'right',textCls:'title_font',value:'MSN：',width:100},
							{xtype:'blank',width:5},
							{xtype:'text',name:'msn',itemId:'msn',width:300,leftHidden:true},
							{xtype:'blank',width:'max'}
					]}
					
					
			],
			initMethod:function(data,mod){
				
				var msgForm=me.mod.get('addNewuser_id');
				msgForm.getByItemId('passWordOld').setEnabled(false);
				msgForm.getByItemId('passWordNew').setEnabled(false);
				msgForm.getByItemId('passWordNewYes').setEnabled(false);
				
				
				
			},
			hiddens:[
				{value:'',name:'loginName',itemId:'loginName'}
			]
			
		});
	}
	//根据选择修改密码的单选款确定密码框是否启用
	this.changeUpdat=function(){
		var msgForm=me.mod.get('addNewuser_id');
		var check=msgForm.getByItemId('checkYesOrNo').getChecked();
		msgForm.getByItemId('passWordOld').setEnabled(check);
		msgForm.getByItemId('passWordNew').setEnabled(check);
		msgForm.getByItemId('passWordNewYes').setEnabled(check);
	}
	
	//图片上传成功
	this.upLoadSuccess=function(){
		var msgForm=me.mod.get('addNewuser_id');
		var imageUi=msgForm.getByItemId('uuicon');
		var icoUuid=msgForm.getByItemId('iconUuid').getUploadInfo().uuid;
		imageUi.setImgUrl(mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+icoUuid);
	}
	
	//保存用户信息
	var msgForm;
	this.submitUserMessage=function(){
		msgForm=me.mod.get('addNewuser_id');
		var data=msgForm.serializeForm();
		var oldPsd=msgForm.getByItemId('passWordOld').getValue();
		var newPsd=msgForm.getByItemId('passWordNew').getValue();
		var newPsd1=msgForm.getByItemId('passWordNewYes').getValue();
		if(msgForm.getByItemId('checkYesOrNo').getChecked()){
			if(newPsd==newPsd1){
				me.submitPassword(oldPsd,newPsd);
				me.submitMessage(data);
			}else{
				me.mod.alert({
					text:'两次密码不一致',
					level:'error',
					delay:3000
				});
			}
		}else{
			me.submitMessage(data);
		}
		
		
	}
	//关闭用户信息界面
	this.closeUserMagValue=function(){
		me.mod.closeTab();
	}
	
	//修改信息
	this.submitMessage=function(data){
		msgForm.submit({
			service:'user.userAction',
			method:'editUser',
			params:data,
			success:function(response){
				var dataResponse=util.parseJson(response.responseText);
				if(dataResponse){
					me.mod.alert({
						text:dataResponse.msg,
						level:'info',
						delay:3000
					});
					var dataMsg={
						iconUuid:data.iconUuid,
						showName:data.showName,
						signature:data.signature
					};
					getUserInfo(dataMsg);
					me.mod.closeTab();
					
				}
			}
		})
	}
	//修改密码
	this.submitPassword=function(oldPsd,newPsd){
		msgForm.submit({
			service:'user.userAction',
			method:'changePsd',
			params:{
				oldPsd:oldPsd,
				newPsd:newPsd
			},
			success:function(response){
				var data=util.parseJson(response.responseText);
				if(data){
					me.mod.alert({
						text:data.msg,
						level:'info',
						delay:3000
					});
					me.mod.closeTab();
				}
			}
		})
	}
	
});