/**
 * 编辑用户信息
 */
new (function(){

	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var getData;
	var obj,getform;
	this.mod.defaultView = function(params){
		//getData = params.sendData;
		obj = params.obj;
		getform = params.form;
		me.mod.main.open({
			id:'editUserInfo_id',
			xtype:'form',
			mode:'pop',
			width:750,
			height:400,
			fields:[
				{height:33,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'left',textCls:'title_font',value:'联系信息：',width:80}		
				]},
				'-',
				{height:40,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'办公电话：',width:80},
						{xtype:'blank',width:5},
						{xtype:'text',leftHidden:true,itemId:'officePhone_id',name:'officePhone',width:'max'},
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'手机：',width:80},
						{xtype:'blank',width:5},
						{xtype:'text',leftHidden:true,itemId:'mobile_id',name:'mobile',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{height:40,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'家庭电话：',width:80},
						{xtype:'blank',width:5},
						{xtype:'text',leftHidden:true,itemId:'homePhone_id',name:'homePhone',width:'max'},
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'电子邮箱：',width:80},
						{xtype:'blank',width:5},
						{xtype:'text',leftHidden:true,itemId:'email_id',name:'email',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{height:40,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'家庭地址：',width:80},
						{xtype:'blank',width:5},
						{xtype:'text',leftHidden:true,itemId:'familyAddress_id',name:'familyAddress',width:'max'},
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'邮编：',width:80},
						{xtype:'blank',width:5},
						{xtype:'text',leftHidden:true,itemId:'homePostage_id',name:'homePostage',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{height:40,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'通讯地址：',width:80},
						{xtype:'blank',width:5},
						{xtype:'text',leftHidden:true,itemId:'postAddress_id',name:'postAddress',width:'max'},
						{xtype:'blank',width:20},
						{xtype:'label',top:6,textAlign:'right',textCls:'title_font',value:'邮编：',width:80},
						{xtype:'blank',width:5},
						{xtype:'text',leftHidden:true,itemId:'postage_id',name:'postage',width:'max'},
						{xtype:'blank',width:20}					
				]},
				{
					height:40,
					cols:[
						{xtype:'blank',width:'max'},
						{
							xtype:'button',
							width:100,
							value:'确定',
							handler:me.submitFoem					
						},
						{xtype:'blank',width:20},
						{xtype:'button',width:100,value:'取消',handler:function(){
							var form = me.mod.main.get('editUserInfo_id');
							form.reset();
							form.removeItemById(mainCol.get('id'));
							me.mod.main.popMgr.close('editUserInfo_id');
						}},					
						{xtype:'blank',width:'max'}
					]
				}
			],
			initMethod:function(mod){
				var form = me.mod.main.get('editUserInfo_id');
				if(mainCol){
					form.removeItemById(mainCol.get('id'));
				}
				var officePhone_id = form.getByItemId('officePhone_id');
				var mobile_id = form.getByItemId('mobile_id');
				var homePhone_id = form.getByItemId('homePhone_id');
				var email_id = form.getByItemId('email_id');
				var familyAddress_id = form.getByItemId('familyAddress_id');
				var homePostage_id = form.getByItemId('homePostage_id');
				var postAddress_id = form.getByItemId('postAddress_id');
				var postage_id = form.getByItemId('postage_id');
				//数据回填
				mc.send({
					service:$sl.guserManager_systemUserInfo_viewUserInfo_defaultView.service,
					method:$sl.guserManager_systemUserInfo_viewUserInfo_defaultView.method,
					params:{
						//uuid:lineData.uuid
					},
					success:function(response){
						getData = util.parseJson(response.responseText);
						if(getData){
							getData.person.officePhone = getData.person.officePhone || '';
							getData.person.mobile = getData.person.mobile || '';
							getData.person.homePhone = getData.person.homePhone || '';
							getData.person.email = getData.person.email || '';
							getData.person.familyAddress = getData.person.familyAddress || '';
							getData.person.homePostage = getData.person.homePostage || '';
							getData.person.postAddress = getData.person.postAddress || '';
							getData.person.postage = getData.person.postage || '';
							
							officePhone_id.setValue(getData.person.officePhone);
							mobile_id.setValue(getData.person.mobile);
							homePhone_id.setValue(getData.person.homePhone);
							email_id.setValue(getData.person.email);
							familyAddress_id.setValue(getData.person.familyAddress);
							homePostage_id.setValue(getData.person.homePostage);
							postAddress_id.setValue(getData.person.postAddress);
							postage_id.setValue(getData.person.postage);
							
							me.createPanel(getData);
							
						}
					}
				});
			}
		});
	}
	
	var mainCol;
	this.createPanel = function(data){
		var form = me.mod.main.get('editUserInfo_id');
		var image =  new Gframe.controls.Image({src:'',borderHidden:true, borderHover:false},{width:100,height:80});
		var hrefurl;
		var upload = new Gframe.controls.DirectUpload({
						success:function(data){
							var o = upload.getUploadInfo();
							var pictureUrl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+(o.uuid);
							image.setImgUrl(pictureUrl);
						},
						startUp:function(){},
						leftHidden:true
		},{width:65,height:33,label:'上传',name:'photoUuid'});
		var uploadCol = new Colbar({cols:[],align:'center'},{height:33,width:100});
		uploadCol.addItem(upload);
		mainCol = new Colbar({cols:[],align:'left'},{width:'max',height:106});	
		var row1 = new Rowbar({rows:[]},{width:100,height:116});	
		var row2 = new Rowbar({rows:[]},{width:'max',height:106});
		row1.addItem(image);
		row1.addItem(uploadCol);
		
		var label = new Gframe.controls.Label({width:120,height:36,value:'修改个性签名：',textCls:'title_font',textAlign:'left'});
		var textarea = new Gframe.controls.TextArea({width:'max',height:100,name:'personalSign',text:'个性签名'});
		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var col3 = new Colbar({cols:[],align:'left'},{width:'max',height:70});
		
		data.remark  = data.remark || '';
		col2.addItem(label);
		col3.addItem(textarea);
		row2.addItem(col2);
		row2.addItem(col3);
		
		mainCol.addItem(row1);
		mainCol.addItem(row2);
		form.addItem(1,mainCol);
		form.update();		
		//初始化
		data.user.personalSign = data.user.personalSign || '';
		textarea.setValue(data.user.personalSign);
		if(data.person.photoUuid){
			hrefurl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+data.person.photoUuid;
			image.setImgUrl(hrefurl);
		}else{
			hrefurl = 'adapter/images/man01.png';
		};
		image.setImgUrl(hrefurl);
	}
	
	this.submitFoem = function(){
		var form = me.mod.main.get('editUserInfo_id');
		var person = {},user = {};
		var o = form.serializeForm();
		for(var p in o ){
			if(p==='personalSign'){
				user['personalSign'] = o.personalSign;
			}else{
				person[p] = o[p] || '';
			}
		};
		form.submit({
			service:$sl.guserManager_systemUserInfo_viewUserInfo_editUserInfo.service,
			method:$sl.guserManager_systemUserInfo_viewUserInfo_editUserInfo.method,
			params:{
				user:util.json2str(user),
				person:util.json2str(person)
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
					form.removeItemById(mainCol.get('id'));
					me.mod.main.popMgr.close('editUserInfo_id');
					getform.removeData();
					if(getform){
						mc.send({
							service:$sl.guserManager_systemUserInfo_viewUserInfo_defaultView.service,
							method:$sl.guserManager_systemUserInfo_viewUserInfo_defaultView.method,
							params:{
								//uuid:lineData.uuid
							},
							success:function(response){
								var dataJson = util.parseJson(response.responseText);
								obj.createPanel(dataJson);
								getform.update();
								//刷新个人首页的个性签名：
								getMyUserInfo();
							}
						});
					}
				}
			}
		});
	}
});