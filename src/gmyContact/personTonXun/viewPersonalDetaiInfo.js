/*
 * 	我的通讯论中和我的联系人平级的个人 编辑
 * */
new (function(){
	var me = this;
	
	this.mod = new Gframe.module.RemoteModule();
	var parentObject;
	var oldPanrentObject;
	this.mod.defaultView = function(params){
		//父页面传给我一个通讯录的名字和uuid标识
		var track = [];  
		parentObject = params.parent;
		var persContactName =' ';
		if(params.persContactName){
			persContactName = params.persContactName;//我的通讯录中子文件夹得名字
		}
		var uuid = params.uuid;//用于获取该通讯录中所有的联系人包括子目录
		var oldparentContactName = params.oldparentContactName;//上级的上级通讯录名字（通讯录管理列表中的通讯论名）
		var lastPersContactName = params.lastPersContactName //查看联系人详情的第三个节点
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
			id:'viewPersonDetailContactInfoId',
			xtype:'form',
			mode:'loop',
			checkbox:false,
			usePage:false,
			track:track,
			store:{
				service :$sl.gcontactNew_personTonXun_editPersonalDetaiInfo_defaultView.service,
				method :$sl.gcontactNew_personTonXun_editPersonalDetaiInfo_defaultView.method,
				params:{
					uuid:uuid
				},
				success:function(data,mod){
					var form = me.mod.main.get('viewPersonDetailContactInfoId');
					var isSystemUerItenid = form.getByItemId('isSystemUerItenid');
					if(data.isSystemUser == '1'){
						isSystemUerItenid.setValue('是');
					}
					if(!data.isSystemUser){
						isSystemUerItenid.setValue('否');
					}
					if(data.isSystemUser =='0'){
						isSystemUerItenid.setValue('否');
					}
					me.createBaseicInfoPanel(data);//创建基本信息的布局
					
					
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
					{xtype:'label',textAlign:'left',value:'',name:'email',width:'max'},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'即时通讯：',width:100},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',value:'',width:'max',name:'jid'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[//165
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'QQ：',width:110},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',value:'',width:'max',name:'qq'},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'MSN：',width:100},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',value:'',width:'max',name:'msn'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[//165
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'网站：',width:110},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',value:'',width:'max',name:'site'},
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
					{xtype:'label',textAlign:'left',value:'',width:'max',name:'businessMobile'},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'住宅电话：',width:100},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',value:'',width:'max',name:'houseMobile'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[//165
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'商务传真：',width:110},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',value:'',width:'max',name:'businessFax'},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'手机：',width:100},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',value:'',width:'max',name:'phone'},
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
					{xtype:'label',textAlign:'left',value:'',width:'max',name:'postCode'},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'',width:100},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',width:'max'},
					{xtype:'blank',width:20}					
				]},
				{height:36,cols:[//165
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'详细地址：',width:110},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',value:'',width:'max',name:'address'},
					{xtype:'blank',width:20}					
				]},
				{height:20,cols:[
					{xtype:'blank',width:20},
					{xtype:'label',textAlign:'left',textCls:'title_font',value:'备注信息',width:100},
					{xtype:'blank',width:'max',name:'remark'}				
				]},
				'-',
				{height:10,cols:[]},
				{height:100,cols:[
					{xtype:'blank',width:65},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'备注：',width:110},
					{xtype:'blank',width:5},
					{xtype:'label',text: '',width:'max',name:'remark',textAlign:'left'},
					{xtype:'blank',width:20}
					]
				},
				{height:36,cols:[//165
					{xtype:'blank',width:45},
					{xtype:'label',textAlign:'right',textCls:'title_font',value:'是否为系统用户：',width:130},
					{xtype:'blank',width:5},
					{xtype:'label',textAlign:'left',itemId:'isSystemUerItenid',name:'isSystemUser',value:'',width:'max'},
					{xtype:'blank',width:20}					
				]}
			],
			initMethod:function(mod){
				//alert(mod);
				
			}
		});
	}
	
	
	this.createBaseicInfoPanel = function(obj){
		var form = me.mod.main.get('viewPersonDetailContactInfoId');
		var mainCol = new Colbar({cols:[],align:'left'},{width:'max',height:220});
		
		var rowlef = new Rowbar({},{width:100,height:220}); 
		var rowlef20Jiange = new Rowbar({},{width:20,height:220});//左侧间隔20
		var blankDown = new Blank({width:100,height:30});
		
		var rowright = new Rowbar({},{width:'max',height:220}); 
		
		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable4 = new Gframe.controls.Label({value:'姓名：',textCls:'title_font',width:65,textAlign:'right'});
		var nameText4 = new Gframe.controls.Label({width:'max',textAlign:'left',name:'name',value:obj.name});

		
		var sexlabel = new Gframe.controls.Label({value:'性别：',textCls:'title_font',width:65,textAlign:'right'});
		var buildsexText= new Gframe.controls.Label({name:'sex',textAlign:'left',width:'max',value:obj.sex});
		col1.addItem(namelable4);
		col1.addItem(new Blank({width:5}));
		col1.addItem(nameText4);
		col1.addItem(new Blank({width:20}));
		col1.addItem(sexlabel);
		col1.addItem(new Blank({width:5}));
		col1.addItem(buildsexText);
		col1.addItem(new Blank({width:20}));

		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable5 = new Gframe.controls.Label({textAlign:'right',value:'单位：',textCls:'title_font',width:65});
		var nameText5 = new Gframe.controls.Label({name:'company',width:'max',textAlign:'left',value:obj.company});
		
		col2.addItem(namelable5);
		col2.addItem(new Blank({width:5}));
		col2.addItem(nameText5);
		col2.addItem(new Blank({width:20}));
		
		var col3 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable1 = new Gframe.controls.Label({textAlign:'right',value:'部门：',textCls:'title_font',width:65});
		var nameText1 = new Gframe.controls.Label({value:'',name:'organization',textAlign:'left',width:'max',value:obj.organization});
		var namelable2 = new Gframe.controls.Label({textAlign:'right',value:'职务：',textCls:'title_font',width:65});
		var nameText2= new Gframe.controls.Label({name:'position',width:'max',textAlign:'left',value:obj.position});
		
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
		var nameText7 = new Gframe.controls.Label({width:'max',name:'post',textAlign:'left',value:obj.post});
		
		col4.addItem(namelable7);
		col4.addItem(new Blank({width:5}));
		col4.addItem(nameText7);
		col4.addItem(new Blank({width:20}));
		col4.addItem(new Blank({width:65}));
		col4.addItem(new Blank({width:5}));
		col4.addItem(new Blank({width:'max'}));
		col4.addItem(new Blank({width:20}));
		
		var col5 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var col6 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable11 = new Gframe.controls.Label({textAlign:'right',value:'签名：',textCls:'title_font',width:65});
		var signNameText = new Gframe.controls.Label({width:'max',textAlign:'left',name:'signName',value:obj.signName});
		var namelable12 = new Gframe.controls.Label({textAlign:'right',value:'便签：',textCls:'title_font',width:65});
		var signatureText = new Gframe.controls.Label({width:'max',textAlign:'left',name:'signature',value:obj.signature});
		
		col5.addItem(namelable11);
		col5.addItem(new Blank({width:5}));
		col5.addItem(signNameText);
		col5.addItem(new Blank({width:20}));
		
		col6.addItem(namelable12);
		col6.addItem(new Blank({width:5}));
		col6.addItem(signatureText);
		col6.addItem(new Blank({width:20}));
		
		var image = new Gframe.controls.Image({},{width:100,height:100});
		iconUuid = obj.iconuuid;
		if(iconUuid){
			var hrefUrl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+(iconUuid);
			image.setImgUrl(hrefUrl);
		}else{
			image.setImgUrl('adapter/images/man01.png');
		}
		rowlef.addItem(image);
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
		
		
	} 
	
	this.createBaseicInfoPanel2 = function(){
		var form = me.mod.main.get('viewPersonDetailContactInfoId');
		var mainCol = new Colbar({cols:[],align:'left'},{width:'max',height:170});
		
		var rowlef = new Rowbar({},{width:100,height:170}); 
		var rowlef20Jiange = new Rowbar({},{width:20,height:170});//左侧间隔20
		var blankDown = new Blank({width:100,height:110});
		
		var rowright = new Rowbar({},{width:'max',height:170}); 
		
		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable4 = new Gframe.controls.Label({value:'姓名：',textCls:'title_font',width:65,textAlign:'right'});
		var nameText4 = new Gframe.controls.Label({width:'max',textAlign:'left',name:'name'});
	
		col1.addItem(namelable4);
		col1.addItem(new Blank({width:5}));
		col1.addItem(nameText4);
		col1.addItem(new Blank({width:20}));
		col1.addItem(new Blank({width:65}));
		col1.addItem(new Blank({width:5}));
		col1.addItem(new Blank({width:'max'}));
		col1.addItem(new Blank({width:20}));
		
		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable5 = new Gframe.controls.Label({textAlign:'right',value:'单位：',textCls:'title_font',width:65});
		var nameText5 = new Gframe.controls.Label({name:'company',width:'max',textAlign:'left'});
		
		col2.addItem(namelable5);
		col2.addItem(new Blank({width:5}));
		col2.addItem(nameText5);
		col2.addItem(new Blank({width:20}));
		
		var col3 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable1 = new Gframe.controls.Label({textAlign:'right',value:'部门：',textCls:'title_font',width:65});
		var nameText1 = new Gframe.controls.Label({value:'',name:'organization',textAlign:'left',width:'max'});
		var namelable2 = new Gframe.controls.Label({textAlign:'right',value:'职务：',textCls:'title_font',width:65});
		var nameText2= new Gframe.controls.Label({name:'position',width:'max',textAlign:'left'});
		
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
		var nameText7 = new Gframe.controls.Label({width:'max',name:'post',textAlign:'left'});
		
		col4.addItem(namelable7);
		col4.addItem(new Blank({width:5}));
		col4.addItem(nameText7);
		col4.addItem(new Blank({width:20}));
		col4.addItem(new Blank({width:65}));
		col4.addItem(new Blank({width:5}));
		col4.addItem(new Blank({width:'max'}));
		col4.addItem(new Blank({width:20}));
		
		
		var image = new Gframe.controls.Image({},{width:100,height:100});
		
		rowlef.addItem(image);
		rowlef.addItem(blankDown);
		
		rowright.addItem(col1);
		rowright.addItem(col2);
		rowright.addItem(col3);
		rowright.addItem(col4);
		
		mainCol.addItem(rowlef20Jiange);
		mainCol.addItem(rowlef);
		mainCol.addItem(rowright);
		
		form.addItem(3,mainCol);
		form.update();		
	} 
	
});