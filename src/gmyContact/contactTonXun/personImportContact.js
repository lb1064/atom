new (function(){
	var dataImport={};
	var me= this;
	var fn;
	this.mod=new Gframe.module.RemoteModule();
	this.mod.defaultView=function(params){
		dataImport.fileUuid=params.value.uploadDaoruFile;
		dataImport.flag=params.value.flag;
		dataImport.parentUuid=params.value.parentUuid;
		fn=params.fn;
		var data = params.data;
		me.mod.main.open({
			id:'mapingView',
			xtype:'form',
			mode:'loop',
			track:[
				{name:'通讯录管理'},
				{name:'导入文件',value:'',handler:function(){
					params.fn();
				}},
				{name:'自定义映射字段'}
			],
			acts:{
				track:[
					{value:'保存',handler:me.submitMapingView}
				]
			},
			fields:[
				{
					align:'center',
					height:36,
					cols:[
						{xtype:'blank',width:'max'},
						{xtype:'label',textAlign:'right',value:'从outlook联系人',width:240},
						{xtype:'blank',width:'50'},
						{xtype:'label',textAlign:'left',value:'到通讯录名片',width:220},
						{xtype:'blank',width:'max'}
					]
				}
			],
			initMethod:function(){
				var store={
					service:$sl.gcontact_personTonXun_persongerenTonxunLu_getExeclCols.service,
					method:$sl.gcontact_personTonXun_persongerenTonxunLu_getExeclCols.method,
					params:{
						uuid:dataImport.fileUuid
					},
					success:function(response) {
					var data=util.parseJson(response.responseText);
					var form=me.mod.main.get('mapingView');
					data.push({text:'请选择',value:'0'});
					for(var i=0; i<arrayName.length;i++){
						me.createColba(form,arrayName[i],data[i].text,2+i,data)
					}
					form.update();
					}
				}	
				mc.send(store);
			}
		});
		
		
	}
	this.createColba=function(fr,name,i,num,d){
		var co = new Colbar({cols:[],align:'center'},{width:'max',height:36});
		var cb = new Gframe.controls.ComboBox({displayField:'text',defaultValue:'0',displayValue:'value',name:name.value,itemId:i,data:d},{width:240});
		var la = new Gframe.controls.Label({textAlign:'left',value:name.name,width:220});
		co.addItem(new Blank({width:'190'}));
		co.addItem(cb);
		co.addItem(new Blank({width:'80'}));
		co.addItem(la);
		co.addItem(new Blank({width:'max'}));
		fr.addItem(num,co);
	}
	var arrayName=[
			{name:'姓名',value:'name'},
			{name:'性别',value:'sex'},
			{name:'单位',value:'company'},
			{name:'部门',value:'organization'},
			{name:'职位',value:'position'},
			{name:'职称',value:'post'},
			{name:'电子邮箱',value:'email'},
			{name:'即时通讯',value:'jid'},
			{name:'QQ',value:'qq'},
			{name:'msn',value:'msn'},
			{name:'网站',value:'site'},
			{name:'商务电话',value:'businessMobile'},
			{name:'商务传真',value:'businessFax'},
			{name:'住宅电话',value:'houseMobile'},
			{name:'手机',value:'phone'},
			{name:'邮编',value:'postCode'},
			{name:'详细地址',value:'address'},
			{name:'备注',value:'remark'},
			{name:'签名',value:'signName'},
			{name:'便签',value:'signature'}
		]
	
//	var arrayName=['姓名','性别','单位','部门',
//					'职位','职称','电子邮箱','即时通讯','QQ','msn',
//					'网站','商务电话','商务传真','住宅电话','手机','邮编',
//					'详细地址','备注','签名','便签','图标']
					
	this.submitMapingView=function(e,o){
		var form=me.mod.main.get('mapingView');
		var d=form.serializeForm();
		var str=util.json2str(d);
		dataImport.fieldMapping=str;
		mc.send({
			service:$sl.gcontact_personTonXun_persongerenTonxunLu_importOutLook.service,
			method:$sl.gcontact_personTonXun_persongerenTonxunLu_importOutLook.method,
			params:dataImport,
			success:function(response){
				var data=util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:3000
					});
					fn();
				}
			}
		})
	}
})