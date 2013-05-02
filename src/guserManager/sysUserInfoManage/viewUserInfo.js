new (function(){
	var me = this;
	var viewPop;
	var viewForm;
	var iconuuid;
	var target = Atom.getComp(mc.viewer);
	this.init = function(config){
		var content = {
			title:'个人资料',
//			layout:'block',//round圆角,block方角
			popBtn:[
               {xtype:'button',value:'确定',width:100,itemId:'btn', handler:me.submitSaveImage},
			   {xtype:'button',value:'取消',width:100,handler:function(){
						viewForm.reset();
						viewPop.close();
						if(Atom.isFunction(target.closeShade)){
							target.closeShade();
						}
					}
				}],
			withClose:function(){
				if(Atom.isFunction(target.closeShade)){
					target.closeShade();
				}
			},
			anim:'middle',
			close:'',
			target:target
		};
		
		var options = {
			id:'guserManager_viewUserInfo',
			width: 440,
			height: 290
		};
		
//		var formFields = [{
//					height:5,
//					cols:[
//						{xtype:'blank'}
//					]
//				},{
//					cols:[
//						{xtype:'label',value:'用户名:',textAlign:'right',width:100},
//						{xtype:'blank',width:10},
//						{xtype:'label',name:'loginName',itemId:'loginName',width:'max'}
//					]
//				},{
//					cols:[
//						{xtype:'label',value:'姓名:',textAlign:'right',width:100},
//						{xtype:'blank',width:10},
//						{xtype:'label',name:'name',itemId:'name',textAlign:'left',width:'max'}
//					]
//				},{
//					cols:[
//						{xtype:'label',value:'性别',textAlign:'right',width:100},
//						{xtype:'blank',width:10},
//						{xtype:'label',name:'sex',itemId:'sex',width:'max'}
//					]
//				},{
//					cols:[
//						{xtype:'label',value:'邮箱:',textAlign:'right',width:100},
//						{xtype:'blank',width:10},
//						{xtype:'label',name:'email',itemId:'email',width:'max'}
//					]
//				},{
//					cols:[
//						{xtype:'label',value:'手机:',textAlign:'right',width:100},
//						{xtype:'blank',width:10},
//						{xtype:'label',name:'phoneNum',itemId:'phoneNum',width:'max'}
//					]
//				},{
//					cols:[
//						{xtype:'label',value:'部门:',textAlign:'right',width:100},
//						{xtype:'blank',width:10},
//						{xtype:'label',name:'department',itemId:'department',width:'max'}
//					]
//				}];
		
		
		
		//创建面板
		me.createPanel = function(data){
			var form = viewForm;
			var row1 = new Rowbar({rows:[]},{width:260,height:'max'});
			var row2 = new Rowbar({rows:[]},{width:'max',height:'max'});
			var mainCol = new Colbar({cols:[],align:'left'},{height:220,width:'max'});
	
			//左边的布局，表单的回填
			var colbar1 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
			var labelaAcount = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'用户名：'}); 
			var acountValue = new Gframe.controls.Label({textAlign:'left'});
			acountValue.setValue(data.loginName);
			colbar1.addItem(labelaAcount);
			colbar1.addItem(acountValue);

			var colbar2 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
			var labelaName = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'姓名：'}); 		
			var valueName = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
			data.name = data.name || '';
			valueName.setValue(data.name);
			colbar2.addItem(labelaName);
			colbar2.addItem(valueName);
			
			var colbar3 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
			var labelaSex = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'性别：'}); 		
			var valueSex = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
			data.sex = data.sex || '';
			valueSex.setValue(data.sex);
			colbar3.addItem(labelaSex);
			colbar3.addItem(valueSex);
			
			var colbar4 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
			var labelaEmail = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'邮箱：'}); 		
			var valueEmail = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
			data.email = data.email || '';
			valueEmail.setValue(data.email);
			colbar4.addItem(labelaEmail);
			colbar4.addItem(valueEmail);
			
			var colbar5 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
			var labelaPhoneNum = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'手机：'}); 		
			var valuePhoneNum = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
			data.phoneNum = data.phoneNum || '';
			valuePhoneNum.setValue(data.phoneNum);
			colbar5.addItem(labelaPhoneNum);
			colbar5.addItem(valuePhoneNum);
			
			var colbar6 = new Colbar({cols:[],align:'left'},{height:36,width:'max'});
			var labelaDepartment = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:120,value:'部门：'}); 		
			var valueDepartment = new Gframe.controls.Label({textAlign:'left',width:'max'}); 		
			data.department = data.department || '';
			valueDepartment.setValue(data.department);
			colbar6.addItem(labelaDepartment);
			colbar6.addItem(valueDepartment);		
			
//			//左边的布局，图像
//			var image =  new Gframe.controls.Image({src:'',borderHidden:true, borderHover:false},{width:150,height:160});
//			var hrefurl;
//			if(data.photoUuid){
//				hrefurl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+data.photoUuid;
//			}else{
//				hrefurl = 'adapter/images/man01.png';
//			};
//			
//			image.setImgUrl(hrefurl);
//
//	        var imageCol = new Colbar({cols:[],align:'left'},{height:110});
//	        imageCol.addItem(new Blank({width:10}));
//	        imageCol.addItem(image);
	        
	        
	        
	        var image = new Gframe.controls.Image({},{width:100,height:120});
			var upload = new Gframe.controls.DirectUpload({
				success:function(){
					var o = upload.getUploadInfo();
					iconuuid = o.uuid;
					var hrefUrl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+(o.uuid);
					image.setImgUrl(hrefUrl);
				},
				startUp:function(){},
				leftHidden:true
				},
				{width:65,left:40,label:'上传',name:'iconuuid'});		
			var uploadCol = new Colbar({cols:[],align:'left'},{width:20,height:25});	
			uploadCol.addItem(new Blank({width:65}));
	        uploadCol.addItem(upload);
				
			var imageCol = new Colbar({cols:[],align:'center'},{width:'max',height:120});
			iconuuid = data.iconuuid;
			if(iconuuid){
				upload.setValue(iconuuid);
				var hrefUrl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+(iconuuid);
				image.setImgUrl(hrefUrl);
			}else{
				image.setImgUrl('adapter/images/man01.png');
			}
			imageCol.addItem(new Blank({width:10}));
	        imageCol.addItem(image);
			
	        row1.addItem(colbar1);
			row1.addItem(colbar2);
			row1.addItem(colbar3);
			row1.addItem(colbar4);
			row1.addItem(colbar5);
			row1.addItem(colbar6);
	        row1.addItem(new Colbar({cols:[],align:'left'},{height:20,width:'max'}));

	        row2.addItem(imageCol);
	        row2.addItem(new Blank({height:5}));
	        row2.addItem(uploadCol);
		
		
			mainCol.addItem(row1);
			mainCol.addItem(row2);
			form.addItem(1,mainCol);
			form.update();
		}
		
		var formHiddens = [];
		
		viewForm = Atom.create('Atom.panel.form.FormPanelAdapt',{
			id:'viewForm',
			hiddens:formHiddens
		});
		
		viewPop = new Gframe.controls.NewPopup(content,options);
		viewPop.addItem(viewForm);
		return viewPop;
	};	
	
	this.initData = function(){
		var store = {
			//配置个人资料详情--服务
			service:$sl.guserManager_sysUserInfoManage_viewUserInfo.service,
			method:$sl.guserManager_sysUserInfoManage_viewUserInfo.method,
			params:{
				loginName:mc.username,
				imageIcom:true
			},
			success:function(data,mod){
				var d = util.parseJson(data.responseText);
				if(d.sex == 'M'){
					d.sex = '男';			
				}else{
					d.sex = '女';	
				}
				//配置个人资料详情--服务回调
				me.createPanel(d);
//				mc.fireEvent(viewForm.get('id'),'loadForm',{data:d});
				
			}
		};
		if(Atom.isFunction(target.showShade)){
			target.showShade();
		}
		viewPop.show();
		mc.send(store);
	};
	
	this.submitSaveImage = function(){//保存用户图像
		var MoveFileBtn = viewPop.getButton('btn');
		MoveFileBtn.setEnabled(false);
		mc.send({
			service:$sl.guserManager_sysUserInfoManage_saveOrUpadateImage.service,
			method:$sl.guserManager_sysUserInfoManage_saveOrUpadateImage.method,
			params:{iconuuid:iconuuid},
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
//					me.mod.main.alert({
//						text:data.msg,
//						level:'info',
//						delay:2000
//					});
					viewForm.reset();
					viewPop.close();
					if(Atom.isFunction(target.closeShade)){
						target.closeShade();
					}
					MoveFileBtn.setEnabled(true);
				}
				getMyUserInfo();
			},failure: function() {
				MoveFileBtn.setEnabled(true);
				return true;
			}
		});
	}
});