/**
个人信息编辑
2011-09-20
郑赞欢
update by tianjun 2012.1.9
*/
var userImage ;
new (function(){

	  var panel;
	  var me = this;
	  var dataEditForm,popId;
	
	  this.init = function(config){
		 var cbx;
		 var pwdtext;
		 var confirmtext;
		popId = config.popId;		
		dataEditForm = new Gframe.controls.FormPanel({borderHidden:true},{grab:true});
		/*
		var signatureText = new Gframe.controls.TextField({
		name:'sign',
		label:"个性签名",
		value:"个性签名",
		readonly:false,
		leftHidden:true,
		xtype:'text',
		readonly:false,
		width:'max',
		leftWidth:10});	
		*/
	    var signatureText = new Gframe.controls.TextField({name:'sign',lable:"签名",value:data.sign,readonly:false,xtype:'text',width:'max',leftWidth:70});	
		
		var l_col1 = new Colbar({cols:[],align:"left"},{width:80,height:80});
		var l_col2 = new Colbar({cols:[],align:"center"},{width:80,height:30});
		var r_col1 = new Colbar({cols:[],align:"left"},{width:'max',height:36});
		var r_col2 = new Colbar({cols:[],align:"left"},{width:'max',height:36});
	    var r_col3 = new Colbar({cols:[],align:"left"},{width:'max',height:36});
	    var r_col4 = new Colbar({cols:[],align:"left"},{width:'max',height:36});
	    var r_col5 = new Colbar({cols:[],align:"left"},{width:'max',height:36});
	    var r_col6 = new Colbar({cols:[],align:"left"},{width:'max',height:30});
	    var r_col7 = new Colbar({cols:[],align:"left"},{width:'max',height:36});
	    
	    var oldPwdtext;
	    oldPwdtext =  new Gframe.controls.TextField({enabled:false,name:'oldPwd',lable:"原密码",value:"",readonly:false,xtype:'password',width:'max',leftWidth:70})
	   	pwdtext =  new Gframe.controls.TextField({enabled:false,name:'newPwd',lable:"输入新密码",value:"",readonly:false,xtype:'password',width:'max',leftWidth:70})
		confirmtext = new Gframe.controls.TextField({enabled:false,name:'newPwd2',lable:"确认新密码",value:"",readonly:false,xtype:'password',width:'max',leftWidth:70})	   	
	  	
		cbx= new Gframe.controls.CheckBox({displayValue:'修改密码'},{width:80,height:30}); 
		
		cbx.addListener('click',function(){
				if(cbx.getChecked()){
						pwdtext.setEnabled(true);
						confirmtext.setEnabled(true);
						oldPwdtext.setEnabled(true);
					}else{
						pwdtext.setEnabled(false);
						confirmtext.setEnabled(false);
						oldPwdtext.setEnabled(false);
				}
		});
	
		r_col6.addItem(cbx);
		r_col4.addItem(pwdtext);
		r_col5.addItem(confirmtext);
	   	r_col5.addItem(new Blank({width:10}));
	   	r_col7.addItem(oldPwdtext);
	   	
		var mobileText = new Gframe.controls.TextField({name:'phone',lable:"手机",value:"",readonly:false,xtype:'text',width:'max',leftWidth:60});
		var phoneText = new Gframe.controls.TextField({name:'tel',lable:"电话",value:"",readonly:false,xtype:'text',width:'max',leftWidth:60});
		var faxText = new Gframe.controls.TextField({name:'fax',lable:"传真",value:"",readonly:false,xtype:'text',width:'max',leftWidth:60});
		var mailText = new Gframe.controls.TextField({name:'email',lable:"邮箱",value:"",readonly:false,xtype:'text',width:'max',leftWidth:60});
		var websiteText = new Gframe.controls.TextField({name:'homePage',lable:"网站",value:"",readonly:false,xtype:'text',width:'max',leftWidth:60});
		
		//r_col1.addItem(new Gframe.controls.Label({value:'姓名：',textAlign:'left',width:'max',width:50,height:36}));
		r_col1.addItem(new Gframe.controls.TextField({name:'realName',lable:"姓名",value:"",readonly:false,xtype:'text',width:'max',leftWidth:70}));

		r_col1.addItem(new Blank({width:10}));
		r_col3.addItem(new Gframe.controls.Label({value:'部门：',textAlign:'left',width:60,height:36,cls:'title_font'}));
		r_col3.addItem(new Gframe.controls.Label({value:'',textAlign:'left',width:'max',height:36,name:'dept'}));
															
		
	    r_col2.addItem(signatureText);
		r_col2.addItem(new Blank({width:10}));
		
		
		r_col4.addItem(new Blank({width:10}));
		r_col7.addItem(new Blank({width:10}));
		
		userImage = new Gframe.controls.Image({src:'testimg/review1.gif', borderHover:false},{width:80,height:80,cursor:'pointer'});	
		l_col1.addItem(userImage);
				
		
      
       
	 
	  upload = new Gframe.controls.DirectUpload({
	                                               success:function(){uploadsuccess();},		                                                                                             									
													leftHidden:true,
													visible:true	
												 	  },
												  {width:60,name:'iconUuid'});	
		
		l_col2.addItem(upload);  
		
		
	  function uploadsuccess(){
	   var hrefUrl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+(upload.getUploadInfo().uuid);
	    userImage.setImgUrl(hrefUrl);//上传成功后预览
	  }
       

      
		var leftrowbar = new Rowbar({},{width:100,height:178});	          
          
		leftrowbar.addItem(l_col1);	 	
		leftrowbar.addItem(l_col2);
		var rightrowbar = new Rowbar({},{width:'max',height:214});	
		
		rightrowbar.addItem(r_col1);
		rightrowbar.addItem(r_col6);
		rightrowbar.addItem(r_col7);
		rightrowbar.addItem(r_col4);
		rightrowbar.addItem(r_col5);
		rightrowbar.addItem(r_col3);
		//rightrowbar.addItem(r_col2);
		var firstColbar = new Colbar({align:'center',
												    cols:[
												    		leftrowbar,
//												    		new Gframe.controls.Label({value:'姓名：',textAlign:'left',width:'max',height:36}),
															rightrowbar
														 ]},
												   {
												    height:214});
		var singNameColbar = new Colbar({align:'center',
												    cols:[
												    	signatureText,
												    	new Blank({width:10})
														 ]},
												   {
												    height:36});
		
		var thirdColbar = new Colbar({align:'center',
														    cols:[
																	mobileText,
														    		new Blank({width:10}),
																	phoneText,
														    		new Blank({width:10})
																 ]},
														   {
														    height:36});

		var fourColbar = new Colbar({align:'center',
												    cols:[
															faxText,
												    		new Blank({width:10}),
															mailText,
												    		new Blank({width:10})
														 ]},
												   {
												    height:36});


		var fifthColbar = new Colbar({align:'center',
												    cols:[
															websiteText,
												    		new Blank({width:10})
														 ]},
												   {
												    height:36});


		
		var loginName_hidden = new Gframe.controls.HiddenField({name:'loginName',value:mc.username});
		var uuid_hidden = new Gframe.controls.HiddenField({name:'dept'});
		
		var buttonEnter= new Gframe.controls.Button({height:40,width:80,value:'修改',handler:function(){
											var o = dataEditForm.serializeForm();
											if(!o.uuid){
												o.uuid = updateUUid;
											}
											if(pwdtext.getValue()!=confirmtext.getValue()){
												var message = new Gframe.controls.Message({parent:mc.viewer,
												infoLevel:'error',colseNum:2000,infoText:'两次输入的密码不一致'});
												message.show();
												return ;
											}
											dataEditForm.submit({
												service :'contact.personAction',
												method :'updateMemberBean',
												params:o,
												success : function(response){
													var data = eval('['+response.responseText+']');
													if(data){
														data = data[0];
													}
//													var message = new Gframe.controls.Message({parent:mc.viewer,
//																		infoLevel:'info',colseNum:2000,infoText:data.msg});
//													message.show();
													var popParent = CompMgr.getComp(popId);
													dataEditForm.reset();
													popParent.close();
													
													if(data.success){
														//修改成功后做的动作
														//重新获取用户信息
														getUserInfo();
													}
												}
											});
											me.updateUusePasword(o);
										}});										
		
		var buttonClose= new Gframe.controls.Button({height:40,width:80,value:'关闭',handler:function(){
											var popParent = CompMgr.getComp(popId);
											dataEditForm.reset();
											popParent.close();
										}});
										
										
		var buttonColbar = new Colbar({align:'center',
												    cols:[
												    		buttonEnter,
															new Blank({width:10}),
															buttonClose
														 ]},
												   {
												    height:36});
												    
		dataEditForm.addItem(new Blank({height:10}));		  
		dataEditForm.addItem(firstColbar);
		dataEditForm.addItem(singNameColbar);
		dataEditForm.addItem(thirdColbar);
		dataEditForm.addItem(fourColbar);
		dataEditForm.addItem(fifthColbar);
		dataEditForm.addItem(buttonColbar);
		dataEditForm.addItem(uuid_hidden);
		dataEditForm.addItem(loginName_hidden);
												  
		var mainColbar = new Colbar({align:'left',
												    cols:[
												    		new Gframe.controls.Label({width:10}),
												    		dataEditForm,
												    		new Gframe.controls.Label({width:10})	
														 ]},
												   {height:450});
		
		panel = new Panel([mainColbar]);
		
		return panel;
	};
	
	function initIconimage(_uuid){
		var hrefUrl;
		if(_uuid && _uuid != '') {
			hrefUrl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+_uuid;
		}else {
			hrefUrl = 'adapter/images/man01.png';
		}
		userImage.setImgUrl(hrefUrl);
	}
	var updateUUid;
	this.initData = function(){
		//这里获取个人信息，填充表单供修改
		var store2 = {
			service :'contact.personAction',
			method :'getMemberByLoginName',
			params:{
				loginName:mc.username
			},
			success : function(response){
				var data2 = eval("[" + response.responseText + "]");
				if(data2){
					data2 = data2[0];
					updateUUid = data2.uuid;
					//因为dept在form中有2个字段,所需回填的时候需要是数组
					data2['dept'] = [data2['dept'],data2['dept']];			
				    initIconimage(data2['iconUuid']);
					mc.fireEvent(dataEditForm.get('id'),'loadForm',{data:data2});
				
				}
			}
		};
		mc.send(store2);
	}
	
	this.updateUusePasword = function(params){//修改用户的密码
		mc.send({
			service:$sl.gcontact_editpersonal_updateUusePasword.service,
			method:$sl.gcontact_editpersonal_updateUusePasword.method,
			params:{
				oldPwd:params.oldPwd,
				newPwd:params.newPwd,
				newPwd2:params.newPwd2
			},
			success:function(response){
				var data = eval('['+response.responseText+']');
				if(data){
					data = data[0];
					if(data.success){
					var message = new Gframe.controls.Message({parent:mc.viewer,
									infoLevel:'info',colseNum:2000,infoText:data.msg});
									message.show();
					}
				}
			}
		});
	}
	
	this.destoryData = function(){
	
	}
});
