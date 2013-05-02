/*
 * 	我的通讯论中和我的联系人平级的个人 编辑
 * */
new (function(){
	var me = this;
	
	this.mod = new Gframe.module.RemoteModule();
	var uuid;
	var oldparentContactName;
	var lastPersContactName;
	var resetData = [];  
	var parentObject;
	var oldPanrentObject;
	this.mod.defaultView = function(params){
		//父页面传给我一个通讯录的名字和uuid标识
		var track;
		var persContactName =' ';
		if(params.persContactName){
			persContactName = params.persContactName;//我的通讯录中子文件夹得名字
		}
		uuid = params.uuid;//联系人的uuid
		parentObject = params.parent;
		oldparentContactName = params.oldparentContactName;//上级的上级通讯录名字（通讯录管理列表中的通讯论名）
		lastPersContactName = params.lastPersContactName; //查看联系人详情的第三个节点
		if(lastPersContactName == '0'){//是从‘我的通讯录’
			track = [
				{name:'通讯录管理'},
				{name:oldparentContactName,handler:parentObject.reopenMyRelateTonBook},//'我的通讯录'
				{name:persContactName}//’和我的联系人平级的个人‘
				]
		}
		if(lastPersContactName != '0' && lastPersContactName){
			oldPanrentObject = params.oldPanrentObject;
			track = [
				{name:'通讯录管理'},
				{name:oldparentContactName,handler:oldPanrentObject.reopenMyRelateTonBook},//'我的通讯录'
				{name:persContactName,handler:parentObject.reloadMyrelateBookGrid},//’和我的联系人‘
				{name:lastPersContactName}
				]
		}
		me.mod.main.open({
			id:'eidtPersonDetailContactInfoId',
			xtype:'form',
			mode:'loop',
			checkbox:false,
			usePage:false,
			track:track,
			acts:{
				track:[
					{value:'保存',handler:me.saveEditpersonDeailInfo},
					{value:'取消',handler:me.resetEditpersonDeailInfo}
				],
				clip:[],
				grid:[]
			
			},
			store:{
				service :$sl.gcontactNew_personTonXun_editPersonalDetaiInfo_defaultView.service,
				method :$sl.gcontactNew_personTonXun_editPersonalDetaiInfo_defaultView.method,
				params:{
					uuid:uuid
				},
				success:function(data,mod){
					me.createBaseicInfoPanel(data);//创建基本信息的布局
					var form = me.mod.main.get('eidtPersonDetailContactInfoId');
					var isSystemUsereditId = form.getByItemId('isSystemUsereditId');
					if(data.isSystemUser == '1'){
						isSystemUsereditId.checked();
					}
					
				}
			},
			fields:[
				{height:20,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'left',textCls:'title_font',value:'基本信息',width:100},
						{xtype:'blank',width:'max'}				
				]},
				'-',
				{height:10,cols:[]},
				{height:20,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'left',textCls:'title_font',value:'网络信息',width:100},
						{xtype:'blank',width:'max'}				
				]},
				'-',
				{height:10,cols:[]},
				{height:36,cols:[//165
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'电子邮箱：',width:110},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',itemId:'emailTextFotEditThispeople',leftHidden:true,width:'max',name:'email',onTextChange:me.diaoBackPaltToCheckforEdit},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'即时通讯：',width:100},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',leftHidden:true,width:'max',name:'jid'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[//165
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'QQ：',width:110},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',name:'qq',leftHidden:true,width:'max'},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'MSN：',width:100},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',leftHidden:true,name:'msn',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[//165
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'网站：',width:110},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',leftHidden:true,name:'site',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:20,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'left',textCls:'title_font',value:'电话号码',width:100},
						{xtype:'blank',width:'max'}				
				]},
				'-',
				{height:10,cols:[]},
				{height:36,cols:[//165
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'商务电话：',width:110},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',leftHidden:true,width:'max',name:'businessMobile'},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'住宅电话：',width:100},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',leftHidden:true,width:'max',name:'houseMobile'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[//165
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'商务传真：',width:110},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',leftHidden:true,width:'max',name:'businessFax'},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'手机：',width:100},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',itemId:'phoneTextForEditPeopleId',leftHidden:true,width:'max',name:'phone',onTextChange:me.diaoBackPaltToCheckforEdit},
					{xtype:'blank',width:20}					
				]},
				{height:20,cols:[
						{xtype:'blank',width:20},
						{xtype:'label',textAlign:'left',textCls:'title_font',value:'地址',width:100},
						{xtype:'blank',width:'max'}				
				]},
					'-',
				{height:10,cols:[]},
				{height:36,cols:[//165
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'邮编：',width:110},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',leftHidden:true,width:'max',name:'postCode'},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'',width:100},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[//165
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'详细地址：',width:110},
					{xtype:'blank',width:5},
					{xtype:'text',textAlign:'left',value:'',leftHidden:true,width:'max',name:'address'},
					{xtype:'blank',width:20}					
				]},
				{height:20,cols:[
					{xtype:'blank',width:20},
					{xtype:'label',textAlign:'left',textCls:'title_font',value:'备注信息',width:100},
					{xtype:'blank',width:'max'}				
				]},
				'-',
				{height:10,cols:[]},
				{height:100,cols:[
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'备注：',width:110},
					{xtype:'blank',width:5},
					{xtype:'textarea',text: '',width:'max',name:'remark'},
					{xtype:'blank',width:20}
					]
				},
				{height:30,cols:[
					{xtype:'blank',width:175},
					{xtype:'checkbox',width:200,name:'isSystemUser',itemId:'isSystemUsereditId',displayValue:'该用户为系统用户',value:'1'},
					{xtype:'blank',width:'max'}				
				]}
			],
			hiddens:[
				//{name:'uuid',value:uuid}
			],
			initMethod:function(mod){
				//alert(mod);
				
			}
		});
	}
	
	this.diaoBackPaltToCheckforEdit = function(){//吊一个后台服务看是不是系统用户
		var form = me.mod.main.get('eidtPersonDetailContactInfoId'); 
		var emailText = form.getByItemId('emailTextFotEditThispeople');//邮箱
		var phoneTextItem_id = form.getByItemId('phoneTextForEditPeopleId');
		var isSystemUserItemId = form.getByItemId('isSystemUsereditId');
		var namesend = nameText4.getValue();
		var emailsend = emailText.getValue();
		var phonesend = phoneTextItem_id.getValue();
		if(!namesend){
			namesend = '';
		}
		if(!emailsend){
			emailsend = '';
		}
		if(!phonesend){
			phonesend = '';
		}
		mc.send({
			service:$sl.gcontactNewT_personTonXun_buildNewPersonContact_diaoBackPaltToCheck.service,
			method:$sl.gcontactNewT_personTonXun_buildNewPersonContact_diaoBackPaltToCheck.method,
			params:{
				name:namesend,
				email:emailsend,
				phone:phonesend//我的通讯录的uuid
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.isSystemUser == '1'){
					isSystemUserItemId.checked();
				}
			}
		});
		
	}
	
	var nameText4;
	this.createBaseicInfoPanel = function(obj){
		var sexdata = [
			{name:'男',value:'男'},
			{name:'女',value:'女'}
		];
		var form = me.mod.main.get('eidtPersonDetailContactInfoId');
		var mainCol = new Colbar({cols:[],align:'left'},{width:'max',height:300});
		
		var rowlef = new Rowbar({},{width:100,height:300}); 
		var rowlef20Jiange = new Rowbar({},{width:20,height:300});//左侧间隔20
		var blankDown = new Blank({width:100,height:80});
		
		var rowright = new Rowbar({},{width:'max',height:300}); 
		
		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable4 = new Gframe.controls.Label({value:'姓名：',textCls:'title_font',width:65,textAlign:'right'});
		nameText4 = new Gframe.controls.TextField({leftHidden:true,width:'max',name:'name',value:obj.name,onTextChange:me.diaoBackPaltToCheckforEdit});
		var sexlabel = new Gframe.controls.Label({value:'性别：',textCls:'title_font',width:65,textAlign:'right'});
		var buildsexText= new Gframe.controls.ComboBox({leftHidden:true,name:'sex',displayField:'name',displayValue:'value',defaultValue:obj.sex,data:sexdata},{width:'max'});
		col1.addItem(namelable4);
		col1.addItem(new Blank({width:5}));
		col1.addItem(nameText4);
		col1.addItem(new Blank({width:20}));
		col1.addItem(sexlabel);
		col1.addItem(new Blank({width:5}));
		col1.addItem(buildsexText);
		col1.addItem(new Blank({width:20}));
		

		var image = new Gframe.controls.Image({},{width:100,height:120});
		var upload = new Gframe.controls.DirectUpload({
													success:function(){
													var o = upload.getUploadInfo();
													var hrefUrl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+(o.uuid);
													image.setImgUrl(hrefUrl);
													},
													startUp:function(){},
													leftHidden:true
												  },{width:20,height:25,left:40,label:'上传',name:'iconuuid'});		
		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable5 = new Gframe.controls.Label({textAlign:'right',value:'单位：',textCls:'title_font',width:65});
		var nameText5 = new Gframe.controls.TextField({leftHidden:true,value:'',name:'company',width:'max',value:obj.company});
		var iconuuid = obj.iconuuid;
		if(iconuuid){
			upload.setValue(iconuuid);
			var hrefUrl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+(iconuuid);
			image.setImgUrl(hrefUrl);
		}else{
			image.setImgUrl('adapter/images/man01.png');
		}
		
		col2.addItem(namelable5);
		col2.addItem(new Blank({width:5}));
		col2.addItem(nameText5);
		col2.addItem(new Blank({width:20}));
		
		var col3 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable1 = new Gframe.controls.Label({textAlign:'right',value:'部门：',textCls:'title_font',width:65});
		var nameText1 = new Gframe.controls.TextField({leftHidden:true,value:'',name:'organization',width:'max',value:obj.organization});
		var namelable2 = new Gframe.controls.Label({textAlign:'right',value:'职务：',textCls:'title_font',width:65});
		var nameText2= new Gframe.controls.TextField({leftHidden:true,value:'',name:'position',width:'max',value:obj.position});
		
		col3.addItem(namelable1);
		col3.addItem(new Blank({width:5}));
		col3.addItem(nameText1);
		col3.addItem(new Blank({width:20}));
		col3.addItem(namelable2);
		col3.addItem(new Blank({width:5}));
		col3.addItem(nameText2);
		col3.addItem(new Blank({width:20}));
		
		var col4 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable7 = new Gframe.controls.Label({textAlign:'right',value:'职称：',textCls:'title_font',width:65});
		var nameText7 = new Gframe.controls.TextField({leftHidden:true,width:'max',name:'post',value:obj.post});
		
		col4.addItem(namelable7);
		col4.addItem(new Blank({width:5}));
		col4.addItem(nameText7);
		col4.addItem(new Blank({width:20}));
		col4.addItem(new Blank({width:65}));
		col4.addItem(new Blank({width:5}));
		col4.addItem(new Blank({width:'max'}));
		col4.addItem(new Blank({width:20}));
		
		var col5 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var col6 = new Colbar({cols:[],align:'left'},{width:'max',height:100});
		var namelable11 = new Gframe.controls.Label({textAlign:'right',value:'签名：',textCls:'title_font',width:65});
		var signNameText = new Gframe.controls.TextField({leftHidden:true,width:'max',name:'signName',value:obj.signName});
		var namelable12 = new Gframe.controls.Label({textAlign:'right',value:'便签：',textCls:'title_font',width:65});
		var signatureText = new Gframe.controls.TextArea({width:'max',height:100,name:'signature',text:obj.signature});
		
		col5.addItem(namelable11);
		col5.addItem(new Blank({width:5}));
		col5.addItem(signNameText);
		col5.addItem(new Blank({width:20}));
		
		col6.addItem(namelable12);
		col6.addItem(new Blank({width:5}));
		col6.addItem(signatureText);
		col6.addItem(new Blank({width:20}));
		
		
		
		rowlef.addItem(image);
		rowlef.addItem(upload);
		rowlef.addItem(blankDown);
		
		rowright.addItem(col1);
		rowright.addItem(col5);
		rowright.addItem(col6);
		rowright.addItem(col2);
		rowright.addItem(col3);
		rowright.addItem(col4);
		
		mainCol.addItem(rowlef20Jiange);
		mainCol.addItem(rowlef);
		mainCol.addItem(rowright);
		
		form.addItem(4,mainCol);
		form.update();
		
		resetData.push(nameText4);
		resetData.push(nameText7);
		resetData.push(nameText2);
		resetData.push(nameText1);
		resetData.push(nameText5);
		
	} 
	
	this.saveEditpersonDeailInfo = function(){//保存编辑个人信息 {name:'uuid',value:uuid}
		var form = me.mod.main.get('eidtPersonDetailContactInfoId');
		var o = form.serializeForm();
		if(!o.uuid){
			o.uuid = uuid;
		}
		form.submit({
			service:$sl.gcontact_personTonXun_editPersonalDetaiInfo_updatePerson.service,
			method:$sl.gcontact_personTonXun_editPersonalDetaiInfo_updatePerson.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					form.reset();
					resetData.each(function(i,n){
						n.setValue('');
					})
					me.mod.main.goback();
				
				}
			}
		});
	}
	
	this.resetEditpersonDeailInfo = function(){
			var form = me.mod.main.get('eidtPersonDetailContactInfoId');
			form.reset();
			resetData.each(function(i,n){
				n.setValue('');
			})
			me.mod.main.goback();
	}
	
});