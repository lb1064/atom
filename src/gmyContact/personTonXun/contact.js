new (function(){
	var me=this;
	this.mod=new Gframe.module.RemoteModule({
		
	})
	this.mod.defaultView = function(params){
		me.mod.main.open({
			id:'work_ig',
			xtype:'form',
			mode:'loop',
			acts:{
				track:[
					{value:'保存',handler:me.linkSubmit},
					{value:'取消'}
				],
				clip:[],
				grid:[]
			},
			store:{
				service :$sl.tel.service,
				method :$sl.tel.method,
				params:{
					
				},
				success:function(data,mod){
					//var form = me.mod.get('work_ig');
					me.createBaseicInfoPanel(data);//创建基本信息的布局
				}
			},
			fields:[
				{
					cols:[
						{xtype:'label',value:'基本信息'}
					]
				},
				{
					cols:[
						{xtype:'label',value:'电话号码'}
					]
				},
				{
					cols:[
						{xtype:'label',width:'150',textAlign:'right',value:'手机1：'},
						{xtype:'text',width:'300',textAlign:'left',leftHidden:'true',name:'p1'},
						{xtype:'label',width:'80',value:'手机2：'},
						{xtype:'text',width:'300',textAlign:'left',leftHidden:'true',name:'p2'}
					]
				},
				{
					cols:[
						{xtype:'label',width:'150',textAlign:'right',value:'商务电话：'},
						{xtype:'text',width:'300',leftHidden:'true',name:'businessMobile'},
						{xtype:'label',width:'80',value:'住宅电话：'},
						{xtype:'text',width:'300',leftHidden:'true',name:'houseMobile'}
					]
				},
				{	
					height:80,
					cols:[
						{xtype:'label',width:'150',textAlign:'right',value:'商务传真：'},
						{xtype:'text',width:'300',leftHidden:'true',name:'businessFax'}
					]
				},
				{
					cols:[
						{xtype:'label',value:'网络信息'}
					]
				},
				{
					cols:[
						{xtype:'label',width:'150',textAlign:'right',value:'电子邮箱：'},
						{xtype:'text',width:'300',leftHidden:'true',name:'email'},
						{xtype:'label',width:'80',value:'即时通讯：'},
						{xtype:'text',width:'300',leftHidden:'true',name:'jid'}
					]
				},
				{
					cols:[
						{xtype:'label',width:'150',textAlign:'right',value:'QQ：'},
						{xtype:'text',width:'300',leftHidden:'true',name:'qq'},
						{xtype:'label',width:'80',value:'MSN：'},
						{xtype:'text',width:'300',leftHidden:'true',name:'msn'}
					]
				},
				{
					cols:[
						{xtype:'label',width:'150',textAlign:'right',value:'网站：'},
						{xtype:'text',width:'300',leftHidden:'true',name:'site'}
					]
				},
				{
					cols:[
						{xtype:'label',value:'地址',name:'address'}
					]
				},
				{
					cols:[
						{xtype:'label',width:'150',textAlign:'right',value:'邮编：'},
						{xtype:'text',width:'300',leftHidden:'true',name:'postCode'}
					]
				},
				{
					cols:[
						{xtype:'label',width:'150',textAlign:'right',value:'详细地址：'},
						{xtype:'text',width:'300',leftHidden:'true',name:'address'}
					]
				},
				{
					cols:[
						{xtype:'label',value:'备注信息'}
					]
				},
				{
					height:80,
					cols:[
						{xtype:'label',width:'150',textAlign:'right',value:'备注：'},
						{xtype:'textarea',width:'300',leftHidden:'true',name:'remark'}
					]
				},
				{
					align:'center',
					cols:[
						{xtype:'checkbox',width:'300',value:'1',displayValue:'该用户为系统用户',name:'isSystemUser'}
					]
				}
			],
			hiddens:[
				//{name:'parentUuid',value:uuid},
				{name:'uuid',value:''}//新建的uuid是空的
			],
			initMethod:function(mod){
				//me.createBaseicInfoPanel(data);//创建基本信息的布局
			}
			
		})
	}
	
	this.createBaseicInfoPanel = function(data){
		var sexdata = [
			{name:'男',value:'男'},
			{name:'女',value:'女'}
		];
		var form = me.mod.main.get('work_ig');
		var mainCol = new Colbar({cols:[],align:'left'},{width:'max',height:220});
		
		var rowleft = new Rowbar({},{width:100}); 	//左列
		var rowright = new Rowbar({},{width:'max'});	//右列
		
		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable1 = new Gframe.controls.Label({value:'姓名：',width:70,textAlign:'right'});
		var nametext1 = new Gframe.controls.TextField({name:'name',width:'300',leftHidden:'true'});
		//var nametext1 = new Gframe.controls.Label({width:'max',textAlign:'left',name:'name',value:data.name});
		var sexlable = new Gframe.controls.Label({value:'性别：',width:70,textAlign:'right'});
		var sextext= new Gframe.controls.ComboBox({leftHidden:true,name:'sex',displayField:'name',displayValue:'value',data:sexdata},{width:'60'});
		//var sextext = new Gframe.controls.TextField({name:'name',width:'300',leftHidden:'true'});
		//var sextext = new Gframe.controls.Label({width:'max',textAlign:'left',name:'sex'});
		col1.addItem(namelable1);
		col1.addItem(nametext1);
		col1.addItem(sexlable);
		col1.addItem(sextext);

		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable2 = new Gframe.controls.Label({textAlign:'right',value:'签名：',width:70});
		var nametext2 = new Gframe.controls.TextField({name:'signName',width:'300',leftHidden:'true'});
		//var nametext2 = new Gframe.controls.Label({name:'sign',width:'max',textAlign:'left'});
		col2.addItem(namelable2);
		col2.addItem(nametext2);
		
		var col3 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable3 = new Gframe.controls.Label({textAlign:'right',value:'便签：',width:70});
		var nametext3 = new Gframe.controls.TextField({name:'signature',width:'300',leftHidden:'true'});
		//var nametext3 = new Gframe.controls.Label({width:'max',textAlign:'left'});
		col3.addItem(namelable3);
		col3.addItem(nametext3);
		
		var col4 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable4 = new Gframe.controls.Label({textAlign:'right',value:'单位：',width:70});
		var nametext4 = new Gframe.controls.TextField({name:'company',width:'300',leftHidden:'true'});
		//var nametext4 = new Gframe.controls.Label({width:'max',textAlign:'left'});
		col4.addItem(namelable4);
		col4.addItem(nametext4);
		
		var col5 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable5 = new Gframe.controls.Label({textAlign:'right',value:'部门：',width:70});
		var nametext5 = new Gframe.controls.TextField({name:'organization',width:'300',leftHidden:'true'});
		//var nametext5 = new Gframe.controls.Label({width:'max',textAlign:'left'});
		var namelable6 = new Gframe.controls.Label({textAlign:'right',value:'职位：',width:70});
		var nametext6 = new Gframe.controls.TextField({name:'position',width:'300',leftHidden:'true'});
		//var nametext6 = new Gframe.controls.Label({width:'max',textAlign:'left'});
		col5.addItem(namelable5);
		col5.addItem(nametext5);
		col5.addItem(namelable6);
		col5.addItem(nametext6);
		
		var col6 = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var namelable7 = new Gframe.controls.Label({textAlign:'right',value:'职称：',width:70});
		var nametext7 = new Gframe.controls.TextField({name:'post',width:'300',leftHidden:'true'});
		//var nametext7 = new Gframe.controls.Label({width:'max',textAlign:'left'});
		col6.addItem(namelable7);
		col6.addItem(nametext7);
		
		var image = new Gframe.controls.Image({},{width:100,height:100,name:'iconuuid'});
		image.setImgUrl('modules/gtestfavorite/work/img/u2_original.png');
		rowleft.addItem(image);
		
		rowright.addItem(col1);
		rowright.addItem(col2);
		rowright.addItem(col3);
		rowright.addItem(col4);
		rowright.addItem(col5);
		rowright.addItem(col6);
		
		mainCol.addItem(rowleft);
		mainCol.addItem(rowright);
		
		form.addItem(2,mainCol);
		form.update();
	} 
	
	this.linkSubmit=function(){
		
		var fo=me.mod.main.get('work_ig');
		var o = fo.serializeForm();
		
		var ph1=o.p1;
		var ph2=o.p2;
		var phone = '["'+ph1+'","'+ph2+'"]';
		if(!o.phone){
			o.phone = phone; 
		}
		
		fo.submit({
			service:'testfavorite.favoriteAction',
			method:'getAllByUuid',
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data){
					mc.download(data.uuid); 
					fo.reset();
					me.mod.main.popMgr.close('work_ig');
					titleValueFlag = null;
					titleValue = null;
					me.mod.main.alert({
						text:'添加成功！',
						delay:1500,
						level:'info'
					})
					fo.reset();
					me.mod.main.goback();
				}
			}
		})
	}
	
});