/**
 * 查看用户信息
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.Module({
		hiddenClip:true,
		tabTitle:'个人信息中心',
		key:'userManager_Person'
	});
	
	var index;
	var sendData;
	var form;
	this.mod.defaultView = function(params){
		index = 1;
		me.mod.open({
			id:'showUserInfo_id',
			xtype:'form',
			mode:'loop',
			track:[
				{name:'个人资料'}
			],
			store:{
					service:$sl.guserManager_systemUserInfo_viewUserInfo_defaultView.service,
					method:$sl.guserManager_systemUserInfo_viewUserInfo_defaultView.method,
					params:{
						//uuid:lineData.uuid
					},
					success:function(data,mod){
						//构建面板
						sendData = data;
						me.createPanel(data);
					}
			},
			actFilter:function(data,purview){
				purview['all'] = true;
				if(data.bindedUser){
					purview['edit'] = true;			
				}else{
					purview['edit'] = false;		
				}
				return purview;
			},
			acts:{
				track:[
					{name:'修改资料',value:'修改资料',handler:me.editZiliao,exp:'edit'},
					{name:'修改密码',value:'修改密码',handler:me.editPWD,exp:'all'}
				]
			},
			fields:[
			],
			initMethod:function(mod){
				form = me.mod.get('showUserInfo_id');
//				mc.send({
//					service:$sl.guserManager_systemUserInfo_viewUserInfo_defaultView.service,
//					method:$sl.guserManager_systemUserInfo_viewUserInfo_defaultView.method,
//					params:{
//						//uuid:lineData.uuid
//					},
//					success:function(response){
//						//构建面板
//						var data = util.parseJson(response.responseText);
//						me.createPanel(data);
//					}
//				});
			}
		});
	}
	
	//创建面板
	this.createPanel = function(data){
		if(!data.person){
			data.person = {};
		}
		var form = me.mod.get('showUserInfo_id');
		var row1 = new Rowbar({rows:[]},{width:120,height:'max'});
		var row2 = new Rowbar({rows:[]},{width:'max',height:'max'});
		var mainCol = new Colbar({cols:[],align:'left'},{height:600,width:'max'});
		var jblank = new Blank({width:5});
		var kblank = new Blank({width:20});
		
		//左边的布局，图像
		var image =  new Gframe.controls.Image({src:'',borderHidden:true, borderHover:false},{width:110,height:110});
		var hrefurl;
		if(data.person.photoUuid){
			hrefurl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+data.person.photoUuid;
		}else{
			hrefurl = 'adapter/images/man01.png';
		};
		image.setImgUrl(hrefurl);

        var imageCol = new Colbar({cols:[],align:'left'},{height:110});
        imageCol.addItem(new Blank({width:10}));
        imageCol.addItem(image);
		row1.addItem(imageCol);
		row1.addItem(new Blank({width:120,height:'max'}));
		
		//右边的布局，表单的回填
		var labelTitleUser =  new Gframe.controls.Label({textAlign:'left',textCls:'tree_label',width:120,value:'用户信息'});
        var lineLabel0 =  new Gframe.controls.Label({textAlign:'right',textCls:'broken_black',width:'max'});
        var linecol = new Colbar({cols:[],align:'left'},{height:2});
        linecol.addItem(new Blank({width:40}));
        linecol.addItem(lineLabel0);
        linecol.addItem(new Blank({width:36}));
		
		var colbar0 = new Colbar({cols:[],align:'left'},{height:30,width:'max'});
		var colbar1 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
		var labelaAcount = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'账号：'}); 		
		var acountValue = new Gframe.controls.Label({textAlign:'left'});
		acountValue.setValue(data.user.loginName);
        colbar0.addItem(new Blank({width:40}));
		colbar0.addItem(labelTitleUser);
		colbar1.addItem(labelaAcount);//120
		colbar1.addItem(jblank);//5
		colbar1.addItem(acountValue);
		
		var colbar2 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
		var labelaEmail = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'电子邮箱：'}); 		
		var labelaPhone = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'手机：'}); 		
		var valueEmail = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
		var valuePhone = new Gframe.controls.Label({textAlign:'left',width:'max'}); 
		data.user.email = data.user.email || '';
		data.user.mobile = data.user.mobile || '';
		valueEmail.setValue(data.user.email);
		valuePhone.setValue(data.user.mobile);
		colbar2.addItem(labelaEmail);//120
		colbar2.addItem(jblank);//5
		colbar2.addItem(valueEmail);
		colbar2.addItem(kblank);//5
		colbar2.addItem(labelaPhone);//120
		colbar2.addItem(jblank);//5
		colbar2.addItem(valuePhone);
		
		var colbar3 = new Colbar({cols:[],align:'left'},{height:30,width:'max'});
		var labelTitleUser3 =  new Gframe.controls.Label({textAlign:'left',textCls:'tree_label',width:120,value:'个人信息'});
        colbar3.addItem(new Blank({width:40}));
        colbar3.addItem(labelTitleUser3);

        var lineLabel3 =  new Gframe.controls.Label({textAlign:'right',textCls:'broken_black',width:'max'});
        var linecol3 = new Colbar({cols:[],align:'left'},{height:2});
        linecol3.addItem(new Blank({width:40}));
        linecol3.addItem(lineLabel3);
        linecol3.addItem(new Blank({width:36}));
		
		
		var colbar4 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
		var labelaEmail3 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'姓名：'}); 		
		var labelaPhone3 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'性别：'}); 		
		var valueEmail3 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
		var valuePhone3 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 
		data.person.name = data.person.name || '';
		data.person.sex = data.person.sex || '';
		valueEmail3.setValue(data.person.name);
		if(data.person.sex==='M'){
			valuePhone3.setValue('男');
		}else if(data.person.sex==='W'){
			valuePhone3.setValue('女');
		}
		colbar4.addItem(labelaEmail3);//120
		colbar4.addItem(jblank);//5
		colbar4.addItem(valueEmail3);
		colbar4.addItem(kblank);//5
		colbar4.addItem(labelaPhone3);//120
		colbar4.addItem(jblank);//5
		colbar4.addItem(valuePhone3);
		
		var colbar5 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
		var labelaEmail5 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'部门：'}); 		
		var labelaPhone5 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'职务：'}); 		
		var valueEmail5 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
		var valuePhone5 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 
		data.person.depName = data.person.depName || '';
		data.person.headShip = data.person.headShip || '';
		valueEmail5.setValue(data.person.depName);
		valuePhone5.setValue(data.person.headShip);
		colbar5.addItem(labelaEmail5);//120
		colbar5.addItem(jblank);//5
		colbar5.addItem(valueEmail5);
		colbar5.addItem(kblank);//5
		colbar5.addItem(labelaPhone5);//120
		colbar5.addItem(jblank);//5
		colbar5.addItem(valuePhone5);
		
		var colbar6 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
		var labelaEmail6 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'职级：'}); 		
		var labelaPhone6 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'入职时间：'}); 		
		var valueEmail6 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
		var valuePhone6 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 
		data.person.rank = data.person.rank || '';
		data.person.entryTime = data.person.entryTime || '';
		valueEmail6.setValue(data.person.rank);
		valuePhone6.setValue(data.person.entryTime);
		colbar6.addItem(labelaEmail6);//120
		colbar6.addItem(jblank);//5
		colbar6.addItem(valueEmail6);
		colbar6.addItem(kblank);//5
		colbar6.addItem(labelaPhone6);//120
		colbar6.addItem(jblank);//5
		colbar6.addItem(valuePhone6);
		
		var colbar7 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
		var labelaEmail7 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'生日：'}); 		
		var labelaPhone7 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'民族：'}); 		
		var valueEmail7 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
		var valuePhone7 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 
		data.person.birthday = data.person.birthday || '';
		data.person.nation = data.person.nation || '';
		valueEmail7.setValue(data.person.birthday);
		valuePhone7.setValue(data.person.nation);
		colbar7.addItem(labelaEmail7);//120
		colbar7.addItem(jblank);//5
		colbar7.addItem(valueEmail7);
		colbar7.addItem(kblank);//5
		colbar7.addItem(labelaPhone7);//120
		colbar7.addItem(jblank);//5
		colbar7.addItem(valuePhone7);
		
		var colbar8 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
		var labelaEmail8 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'政治面貌：'}); 		
		var labelaPhone8 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'籍贯：'}); 		
		var valueEmail8 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
		var valuePhone8 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 
		data.person.face = data.person.face || '';
		data.person.nativePlace = data.person.nativePlace || '';
		valueEmail8.setValue(data.person.face);
		valuePhone8.setValue(data.person.nativePlace);
		colbar8.addItem(labelaEmail8);//120
		colbar8.addItem(jblank);//5
		colbar8.addItem(valueEmail8);
		colbar8.addItem(kblank);//5
		colbar8.addItem(labelaPhone8);//120
		colbar8.addItem(jblank);//5
		colbar8.addItem(valuePhone8);
		
//		var colbar9 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
//		var labelaEmail9 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'身份证号：'});
//		var labelaPhone9 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'婚姻状况：'});
//		var valueEmail9 = new Gframe.controls.Label({textAlign:'left',width:'max'});
//		var valuePhone9 = new Gframe.controls.Label({textAlign:'left',width:'max'});
//		data.person.cardId = data.person.cardId || '';
//		data.person.maritalStatus = data.person.maritalStatus || '';
//		valueEmail9.setValue(data.person.cardId);
//		valuePhone9.setValue(data.person.maritalStatus);
//		colbar9.addItem(labelaEmail9);//120
//		colbar9.addItem(jblank);//5
//		colbar9.addItem(valueEmail9);
//		colbar9.addItem(kblank);//5
//		colbar9.addItem(labelaPhone9);//120
//		colbar9.addItem(jblank);//5
//		colbar9.addItem(valuePhone9);
//
//		var colbar10 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
//		var labelaEmail10 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'学历：'});
//		var labelaPhone10 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'毕业学校：'});
//		var valueEmail10 = new Gframe.controls.Label({textAlign:'left',width:'max'});
//		var valuePhone10 = new Gframe.controls.Label({textAlign:'left',width:'max'});
//		data.person.eduBook = data.person.eduBook || '';
//		data.person.graduateScl = data.person.graduateScl || '';
//		valueEmail10.setValue(data.person.eduBook);
//		valuePhone10.setValue(data.person.graduateScl);
//		colbar10.addItem(labelaEmail10);//120
//		colbar10.addItem(jblank);//5
//		colbar10.addItem(valueEmail10);
//		colbar10.addItem(kblank);//5
//		colbar10.addItem(labelaPhone10);//120
//		colbar10.addItem(jblank);//5
//		colbar10.addItem(valuePhone10);
//
//		var colbar11 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
//		var labelaEmail11 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'所学专业：'});
//		var labelaPhone11 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'毕业时间：'});
//		var valueEmail11 = new Gframe.controls.Label({textAlign:'left',width:'max'});
//		var valuePhone11 = new Gframe.controls.Label({textAlign:'left',width:'max'});
//		data.person.speciallty = data.person.speciallty || '';
//		data.person.graduateTime = data.person.graduateTime || '';
//		valueEmail11.setValue(data.person.speciallty);
//		valuePhone11.setValue(data.person.graduateTime);
//		colbar11.addItem(labelaEmail11);//120
//		colbar11.addItem(jblank);//5
//		colbar11.addItem(valueEmail11);
//		colbar11.addItem(kblank);//5
//		colbar11.addItem(labelaPhone11);//120
//		colbar11.addItem(jblank);//5
//		colbar11.addItem(valuePhone11);
//
//		var colbar12 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
//		var colbar13 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
//		var labelaEmail12 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'档案所在地：'});
//		var labelaPhone13 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'户口所在地：'});
//		var valueEmail12 = new Gframe.controls.Label({textAlign:'left',width:'max'});
//		var valuePhone13 = new Gframe.controls.Label({textAlign:'left',width:'max'});
//		data.person.dossierPlace = data.person.dossierPlace || '';
//		data.person.registeredResidence = data.person.registeredResidence || '';
//		valueEmail12.setValue(data.person.dossierPlace);
//		valuePhone13.setValue(data.person.registeredResidence);
//		colbar12.addItem(labelaEmail12);//120
//		colbar12.addItem(jblank);//5
//		colbar12.addItem(valueEmail12);
//
//		colbar13.addItem(labelaPhone13);//120
//		colbar13.addItem(jblank);//5
//		colbar13.addItem(valuePhone13);


		var colbar14 = new Colbar({cols:[],align:'left'},{height:30,width:'max'});
		var labelTitleUser14 =  new Gframe.controls.Label({textAlign:'left',textCls:'tree_label',width:120,value:'联系信息'});
        colbar14.addItem(new Blank({width:40}));
        colbar14.addItem(labelTitleUser14);

        var lineLabel =  new Gframe.controls.Label({textAlign:'right',textCls:'broken_black',width:'max'});
        var linecol4 = new Colbar({cols:[],align:'left'},{height:2});
        linecol4.addItem(new Blank({width:40}));
        linecol4.addItem(lineLabel);
        linecol4.addItem(new Blank({width:36}));
			
		var colbar15 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
		var labelaEmail15 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'办公电话：'}); 		
		var labelaPhone15 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'家庭电话：'}); 		
		var valueEmail15 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
		var valuePhone15 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 
		data.person.officePhone = data.person.officePhone || '';
		data.person.homePhone = data.person.homePhone || '';
		valueEmail15.setValue(data.person.officePhone);
		valuePhone15.setValue(data.person.homePhone);
		colbar15.addItem(labelaEmail15);//120
		colbar15.addItem(jblank);//5
		colbar15.addItem(valueEmail15);
		colbar15.addItem(kblank);//5
		colbar15.addItem(labelaPhone15);//120
		colbar15.addItem(jblank);//5
		colbar15.addItem(valuePhone15);
		
		var colbar16 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
		var labelaEmail16 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'手机：'}); 		
		var labelaPhone16 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'电子邮箱：'}); 		
		var valueEmail16 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
		var valuePhone16 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 
		data.person.mobile = data.person.mobile || '';
		data.person.email = data.person.email || '';
		valueEmail16.setValue(data.person.mobile);
		valuePhone16.setValue(data.person.email);
		colbar16.addItem(labelaEmail16);//120
		colbar16.addItem(jblank);//5
		colbar16.addItem(valueEmail16);
		colbar16.addItem(kblank);//5
		colbar16.addItem(labelaPhone16);//120
		colbar16.addItem(jblank);//5
		colbar16.addItem(valuePhone16);
		
		var colbar17 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
		var labelaEmail17 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'家庭地址：'}); 		
		var labelaPhone17 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'邮编：'}); 		
		var valueEmail17 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
		var valuePhone17 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 
		data.person.familyAddress = data.person.familyAddress || '';
		data.person.homePostage = data.person.homePostage || '';
		valueEmail17.setValue(data.person.familyAddress);
		valuePhone17.setValue(data.person.homePostage);
		colbar17.addItem(labelaEmail17);//120
		colbar17.addItem(jblank);//5
		colbar17.addItem(valueEmail17);
		colbar17.addItem(kblank);//5
		colbar17.addItem(labelaPhone17);//120
		colbar17.addItem(jblank);//5
		colbar17.addItem(valuePhone17);
		
		
		var colbar18 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
		var labelaEmail18 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'通讯地址：'}); 		
		var labelaPhone18 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'邮编：'}); 		
		var valueEmail18 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
		var valuePhone18 = new Gframe.controls.Label({textAlign:'left',width:'max'}); 
		data.person.postAddress = data.person.postAddress || '';
		data.person.postage = data.person.postage || '';
		valueEmail18.setValue(data.person.postAddress);
		valuePhone18.setValue(data.person.postage);
		colbar18.addItem(labelaEmail18);//120
		colbar18.addItem(jblank);//5
		colbar18.addItem(valueEmail18);
		colbar18.addItem(kblank);//5
		colbar18.addItem(labelaPhone18);//120
		colbar18.addItem(jblank);//5
		colbar18.addItem(valuePhone18);
		
		
		
		row2.addItem(colbar0);
        row2.addItem(linecol);
        row2.addItem(new Colbar({cols:[],align:'left'},{height:10,width:'max'}));
        row2.addItem(colbar1);
		row2.addItem(colbar2);
        row2.addItem(new Colbar({cols:[],align:'left'},{height:20,width:'max'}));
		row2.addItem(colbar3);
        row2.addItem(linecol3);
        row2.addItem(new Colbar({cols:[],align:'left'},{height:10,width:'max'}));
        row2.addItem(colbar4);
		row2.addItem(colbar5);
		row2.addItem(colbar6);
		row2.addItem(colbar7);
		row2.addItem(colbar8);
//		row2.addItem(colbar9);
//		row2.addItem(colbar10);
//		row2.addItem(colbar11);
//		row2.addItem(colbar12);
//		row2.addItem(colbar13);
        row2.addItem(new Colbar({cols:[],align:'left'},{height:20,width:'max'}));
		row2.addItem(colbar14);
		row2.addItem(linecol4);
        row2.addItem(new Colbar({cols:[],align:'left'},{height:10,width:'max'}));
        row2.addItem(colbar15);
		row2.addItem(colbar16);
		row2.addItem(colbar17);
		row2.addItem(colbar18);

		mainCol.addItem(row1);
		mainCol.addItem(row2);
		form.addItem(1,mainCol);
		
		form.update();
	}
	
	this.editZiliao = function(){
		me.mod.remoteOpen({
			url:'modules/guserManager/systemUserInfo/editUser.js',
			params:{
				sendData:sendData,
				obj:me,
				form:form
			}
		});
		
	}
	
	this.editPWD = function(){
		me.mod.remoteOpen({
			url:'modules/guserManager/systemUserInfo/editPwd.js',
			params:{
				sendData:sendData
			}
		});
		
	}

});