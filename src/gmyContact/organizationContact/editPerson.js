/**
 * @author 田军
 * @编辑联系人 
 */
new (function(){
	
	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var lineData;//传递过来的行数据
	var index;//行标
	var mainData;//后台返回的总数据
	var allLines;//所有的动态增减行
	var rightG;//固定间隔
	var gridPath;//前面传递过来的路径
	this.mod.defaultView = function(params){
		lineData = params.data;//行数据
		gridPath = params.gridPath.slice(0);
		var track;
		var mod = params.mod;
		me.mod.main.open({
			id:'editPerson_id',
			xtype:'form',
			mode:'loop',
//			store:{
//				service:$sl.gcontact_organizationContact_viewPersonInfo.service,
//				method:$sl.gcontact_organizationContact_viewPersonInfo.method,
//				params:{
//					uuid:lineData.uuid
//				},
//				success:function(data,mod){
//					mainData = Boolean(data)===true?data:null;
//					if(mainData){					
//						me.createFirst(data);
//					}
//				}
//			},
			acts:{
				track:[
					{name:'保存',value:'保存',handler:me.saveEditPerson},
					{name:'取消',value:'取消',handler:function(){me.mod.main.goback()}}
				]
			},
			hiddens:[],
			initMethod:function(mod){
				//路径处理
				var obj = {name:'编辑联系人'};
				gridPath.push(obj);
				for(var i=1;i<gridPath.length-1;i++){
					gridPath[i].handler = function(e,o){
						me.mod.main.remoteOpen({
							url:'modules/gmyContact/organizationContact/groupAndPersonGrid.js',
							params:{
								uuid:o.getName(),
								name:o.getValue()
							}
						});
					}
				};
				gridPath[0].handler = function(){
					me.mod.main.remoteOpen({
						url:'modules/gmyContact/organizationContact/organizationContact.js',
						params:{
						}
					});
				};
				me.mod.main.reloadTrack(gridPath);
				//初始化部分控制变量
				var form = me.mod.main.get('editPerson_id');
				allLines = [];allPhones = [];
				allFaxs = [];allMsgs = [];
				allEmails = [];allAddress = [];				
				phoneIndex = null;
				phoneLength = 0;
				faxLength = 0;
				index = 0;
				rightG = 5;
				msgLength = 0;
				emailLength = 0;
				addressLength = 0;
				//创建表单
				mc.send({
					service:$sl.gcontact_organizationContact_viewPersonInfo.service,
					method:$sl.gcontact_organizationContact_viewPersonInfo.method,
					params:{
						uuid:lineData.uuid
					},
					success:function(response){
						var getdata = util.parseJson(response.responseText);
						mainData = Boolean(getdata)===true?getdata:null;
						if(mainData){					
							me.createFirst(mainData);
						}
					}
				});
				
			}
		});
	}
	
	//提交保存新建联系人
	this.saveEditPerson = function(){
		var setDefaultTag = 0;//设置默认邮箱的计数器
		var phones = [],faxs = [],msgs = [],emails = [],address = []; 
		allPhones.each(function(index,col){
			if(col['combo'].getValue()!='其他'){
				var key = col['combo'].getValue();
				var value = col['txt'].getValue();
				var obj = {key:key,value:value};
				phones.push(obj);
			}
		});
		allFaxs.each(function(index,col){
			if(col['combo'].getValue()!='其他'){
				var key = col['combo'].getValue();
				var value = col['txt'].getValue();
				var obj = {key:key,value:value};
				faxs.push(obj);
			}
		});
		allMsgs.each(function(index,col){
			if(col['combo'].getValue()!='其他'){
				var key = col['combo'].getValue();
				var value = col['txt'].getValue();
				var obj = {key:key,value:value};
				msgs.push(obj);
			}
		});
		allEmails.each(function(index,col){
			if(col['combo'].getValue()!='其他'){
				var key = col['combo'].getValue();
				var value = col['txt'].getValue();
				var def = col['defaultPro'];
				if(def==='1'){
					setDefaultTag++;
				}
				var obj = {key:key,value:value,isDefault:def};
				emails.push(obj);
			}
		});
		allAddress.each(function(index,col){
			if(col['combo'].getValue()!='其他'){
				var key = col['combo'].getValue();
				var value = col['txt'].getValue();
				var code = col['codeTxt'].getValue()==='输入邮编'?'':col['codeTxt'].getValue();
				var obj = {key:key,value:value,code:code};
				address.push(obj);
			}
		});
		//打印所有的动态信息
		// console.log('phones',phones);
		// console.log('faxs',faxs);
		// console.log('msgs',msgs);
		// console.log('emails',emails);
		// console.log('address',address);
		if(setDefaultTag>1){
			me.mod.main.alert({
				text:'只能够设置一个默认的邮箱',
				level:'error',
				delay:3000
			});
			setDefaultTag = undefined;
			return ;
		}
		var form = me.mod.main.get('editPerson_id');
		var o = form.serializeForm();
		if(!o.uuid){
			o.uuid = mainData.uuid;
		}
		if(!o.sysAccount){
			o.sysAccount = mainData.sysAccount;
		}
		o.phones = Boolean(!o.phones)===true ? (util.json2str(phones)):(o.phones);
		o.faxes = Boolean(!o.faxes)===true ? (util.json2str(faxs)):(o.faxes);
		o.messaginges = Boolean(!o.messaginges)===true ? (util.json2str(msgs)):(o.messaginges);
		o.emails = Boolean(!o.emails)===true ? (util.json2str(emails)):(o.emails);
		o.addresses = Boolean(!o.addresses)===true ? (util.json2str(address)):(o.addresses);
		for(var p in o){
			if(p.startWith('gsoft')){
				delete o[p];
			}
		};
		if(o.remark==='请输入备注信息'){
			o.remark = '';
		}
		//console.log('提交给后台的参数',o);
		form.submit({
			service:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__submitNewInfo.service,
			method:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__submitNewInfo.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					form.removeData();//删除所有的子对象
					form.update();
					me.mod.main.goback();
				}
			}
		})
		
	}

	this.createWlanEmail = function(data){
		var emailComboData = [{key:'系统邮箱',value:''}];//phoneCombox的假数据
		var msgIndex = phoneIndex+faxLength+msgLength;
		var form = me.mod.main.get('editPerson_id');
		var emailCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var emaillabel =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'电子邮箱：'});
		var emailText = new Gframe.controls.TextField({textAlign:'left',name:'intraEmail',leftHidden:true,width:'max'});
		var emailCombo = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:emailComboData},{width:200});
		emailCol.addItem(new Blank({width:20}));
		if(allEmails.length===0){
			emailCol.addItem(emaillabel);
		}else{
			emailCol.addItem(new Blank({width:80}));
		};
		emailCol.addItem(new Blank({width:10}));
		emailCol.addItem(emailCombo);
		emailCol.addItem(new Blank({width:30}));
		emailCol.addItem(emailText);
		emailCol.addItem(new Blank({width:rightG}));//5
		//emailCol.addItem(defaultLabel);//5
		emailCol.addItem(new Blank({width:45}));
		form.addItem(msgIndex,emailCol);
		index++;
		//msgLength++;//便于计算后面的动态index
		form.update();
		emailCombo.setEnabled(false);
		data.intraEmail = data.intraEmail || '';
		emailText.setValue(data.intraEmail);
		//便于以后销毁
		allLines.push(emailCol);
	}
	
	
	this.createFirst = function(data){
		allLines = [];
		var form = me.mod.main.get('editPerson_id');
		var image =  new Gframe.controls.Image({src:'',borderHidden:true, borderHover:false},{width:120,height:113});
		var hrefurl;
		if(data.iconUuid){
			hrefurl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+data.iconUuid;
		}else{
			hrefurl = 'adapter/images/man01.png';
		};
		image.setImgUrl(hrefurl);
		var upload = new Gframe.controls.DirectUpload({
													success:function(data){
														var o = upload.getUploadInfo();
														var pictureUrl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+(o.uuid);
														image.setImgUrl(pictureUrl);
													},
													startUp:function(){},
													leftHidden:true
												  },{width:65,label:'上传',name:'iconUuid'});
		var uploadCol = new Colbar({cols:[],align:'center'},{width:120});	
		uploadCol.addItem(upload);
		var row1 = new Rowbar({rows:[]},{width:120,height:180});	
		var row2 = new Rowbar({rows:[]},{width:'max',height:180});
		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:40});
		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:100});
		var firstCol = new Colbar({cols:[],align:'left'},{width:'max',height:160});
		var text = new Gframe.controls.TextField({textAlign:'left',top:2,name:'name',onclick:clearTxt,leftHidden:true,width:'max',value:'编辑姓名'});
		
		var group = new Gframe.controls.RadioGroup({name:'sex'},{width:120,height:33});
		var radio1 = new Gframe.controls.Radio({displayValue:'男',value:'M',checked:true},{cursor:'pointer',width:'max'});
		var radio2 = new Gframe.controls.Radio({displayValue:'女',value:'W'},{cursor:'pointer',width:'max'});
		var textarea = new Gframe.controls.TextArea({width:'max',height:100,name:'remark',text:'请输入备注信息'});
		group.addItem(radio1);
		group.addItem(radio2);
		var jCol = new Colbar({cols:[],align:'left'},{width:'max',height:20});
		var jCol2 = new Colbar({cols:[],align:'left'},{width:'max',height:20});
		
			
			//添加生日的标签
		var label = new Gframe.controls.Label({textAlign:'right',top:5,width:60,value:'生日：'});
		var date = new Gframe.controls.DatePicker({name:'birthday',top:2,format:'%Y-%m-%d',showTime:false,lableWidth:0,leftHidden:true});
		
		
		
		col1.addItem(text);
		col1.addItem(new Blank({width:15}));
		col1.addItem(group);
		col1.addItem(label);
		col1.addItem(new Blank({width:5}));
		col1.addItem(date);
		
		col2.addItem(textarea);
		
		row1.addItem(jCol);
		row1.addItem(image);
		row1.addItem(uploadCol);
		row2.addItem(jCol2);
		row2.addItem(col1);
		row2.addItem(col2);
		
		firstCol.addItem(new Blank({width:20}));
		firstCol.addItem(row1);
		firstCol.addItem(new Blank({width:2}));
		firstCol.addItem(row2);
		firstCol.addItem(new Blank({width:20}));	
		
		form.addItem(index,firstCol);	
		form.update();
		
		textarea.setValue(data.remark);
		text.setValue(data.name);
		group.setValue(data.sex);
		
		upload.setValue(data.iconUuid);
		date.setValue(data.birthday);
		
		if(data.bySelf==='0'){
			upload.setEnabled(false);
			group.setEnabled(false);
			text.setEnabled(false);
			textarea.setEnabled(false);
			date.setEnabled(false);
		}
		
		index++;
		//创建基本信息
		me.createBasicInfo(data);
		//便于以后销毁
		allLines.push(firstCol);
		//清除默认的文本
		function clearTxt(){
			if(text.getValue()==='编辑姓名'){
				text.setValue('');
			}
		};
		textarea.handler = function(event,obk){
			if(obk.getValue()==='请输入备注信息'){
				obk.setValue('');
			}
		};
	}
	
	//创建基本信息
	this.createBasicInfo = function(data){
		var form = me.mod.main.get('editPerson_id');
		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:33}); 
		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:33}); 
		var col3 = new Colbar({cols:[],align:'left'},{width:'max',height:33}); 
		var colTitle = new Colbar({cols:[],align:'left'},{width:'max',height:18}); 
		var secondRowbar = new Rowbar({rows:[]},{width:'max',height:150});
		
		var label1 =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'单位：'});
		var text1 = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,name:'company',width:'max'});
		var label2 =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'部门：'});
		var text2 = new Gframe.controls.TextField({textAlign:'left',name:'organization',leftHidden:true,width:'max'});
		var label3 =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'职务：'});
		var text3 = new Gframe.controls.TextField({textAlign:'left',name:'post',leftHidden:true,width:'max'});
		var label4 =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'其他：'});
		var text4 = new Gframe.controls.TextField({textAlign:'left',name:'position',leftHidden:true,width:'max'});
//		var label5 =  new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:80,value:'生日：'});
//		var text5 = new Gframe.controls.DatePicker({width:'max',name:'birthday',format:'%Y-%m-%d'});
		var label6 =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'系统账号：'});
		var text6 = new Gframe.controls.Label({textAlign:'left',width:'max'});
		
		
		col1.addItem(new Blank({width:20}));
		col1.addItem(label1);
		col1.addItem(new Blank({width:5}));
		col1.addItem(text1);
		col1.addItem(new Blank({width:50}));
		col1.addItem(label2);
		col1.addItem(new Blank({width:5}));
		col1.addItem(text2);
		col1.addItem(new Blank({width:20}));
		
		col2.addItem(new Blank({width:20}));
		col2.addItem(label3);
		col2.addItem(new Blank({width:5}));
		col2.addItem(text3);
		col2.addItem(new Blank({width:50}));
		col2.addItem(label4);
		col2.addItem(new Blank({width:5}));
		col2.addItem(text4);
		col2.addItem(new Blank({width:20}));
		
		col3.addItem(new Blank({width:20}));
//		col3.addItem(label5);
//		col3.addItem(new Blank({width:5}));
//		col3.addItem(text5);
//		col3.addItem(new Blank({width:50}));
		col3.addItem(label6);
		col3.addItem(new Blank({width:5}));
		col3.addItem(text6);
		col3.addItem(new Blank({width:20}));
		
		
	
		var titel = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',height:20,width:120,value:'基本信息'}); 
		colTitle.addItem(new Blank({width:25}));
		colTitle.addItem(titel);
		var linecol = new Colbar({cols:[],align:'left'},{height:3,cls:'broken_line'});
		secondRowbar.addItem(new Blank({height:10}));
		secondRowbar.addItem(colTitle);
		secondRowbar.addItem(linecol);
		secondRowbar.addItem(new Blank({height:5}));
		secondRowbar.addItem(col1);
		secondRowbar.addItem(col2);
		secondRowbar.addItem(col3);
		
		form.addItem(index,secondRowbar);
		index++;
		form.update();
		//回填数据
		text1.setValue(data.company);
		text2.setValue(data.organization);
		
		text3.setValue(data.post);
	
		text4.setValue(data.position);
		
//		text5.setValue(data.birthday);
		text6.setValue(data.sysAccount);
		if(data.bySelf==='0'){
			text1.setEnabled(false);
			text2.setEnabled(false);
			text3.setEnabled(false);
			text4.setEnabled(false);
		}
		//创建联系信息的标签
		me.createRelTitle(data);	
		//便于以后销毁
		allLines.push(secondRowbar);
	}
	
	//创建联系信息的标签
	this.createRelTitle = function(data){
		var form = me.mod.main.get('editPerson_id');
		var titleRowbar = new Rowbar({rows:[]},{width:'max',height:25});
		var colTitle = new Colbar({cols:[],align:'left'},{width:'max',height:18});
		var titel = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',height:18,width:'max',value:'联系信息'}); 
		colTitle.addItem(new Blank({width:25}));
		colTitle.addItem(titel);
		var linecol = new Colbar({cols:[],align:'left'},{height:3,width:'max',cls:'broken_line'});
		titleRowbar.addItem(colTitle);
		titleRowbar.addItem(linecol);
		titleRowbar.addItem(new Blank({height:5}));
		
	
		form.addItem(index,titleRowbar);
		form.update();
		index++;
		//便于以后销毁
		allLines.push(titleRowbar);
		me.requestDataZidian(data);
	}
	
	//请求数据字典
	this.requestDataZidian = function(mainDa){
		mc.send({
			service:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__requestShujuzidian.service,
			method:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__requestShujuzidian.method,
			//params:{},
			success:function(response){
					var data = util.parseJson(response.responseText);
					if(data){
						//创建联系信息的动态增减行
						var zidianData = data;
					
						me.createActiveRelDetail(zidianData,mainDa);
					}
			}
		});
	}
	
	//创建动态联系信息（总的调度方法）
	this.createActiveRelDetail = function(zidianData,mainDa){		
		//创建电话的动态行，用对象存储组件，以便向后台提交数据
		me.initCreatePhone(zidianData,mainDa);
		//创建传真的动态行，用对象存储组件，以便向后台提交数据
		//me.initCreateFax(zidianData,mainDa);
		//创建即时通讯的动态行，用对象存储组件，以便向后台提交数据
		me.initCreateMsg(zidianData,mainDa);
		//创建内网邮箱		
		me.createWlanEmail(mainDa);
		//创建电子邮箱的动态行，用对象存储组件，以便向后台提交数据
		me.initCreateEmail(zidianData,mainDa);
		//创建地址的动态行，用对象存储组件，以便向后台提交数据
		me.initCreateAddress(zidianData,mainDa);
	
	}
	

	
	//用后台返回的数据初始化phone
	this.initCreatePhone = function(zidianData,mainDa){
		var phones = mainDa.phones;
		
		if(phones && util.isArray(phones)){
			if(phones.length){
				for(var i=0;i<phones.length;i++){
					me.createPhone(zidianData,phones[i]);
				};
			}else{
				me.createPhone(zidianData);
			};
		}
	} 
	//用后台返回的数据初始化fax
	this.initCreateFax = function(zidianData,mainDa){
		var faxes = mainDa.faxes;
	
		if(faxes && util.isArray(faxes)){
			if(faxes.length){
				for(var i=0;i<faxes.length;i++){
					me.createFax(zidianData,faxes[i]);
				};
			}else{
				me.createFax(zidianData);
			}
		}
	} 
	
	//用后台返回的数据初始化即时通讯
	this.initCreateMsg = function(zidianData,mainDa){
		var msgs = mainDa.messaginges;
	
		if(msgs && util.isArray(msgs)){
			if(msgs.length){
				for(var i=0;i<msgs.length;i++){
					me.createMsg(zidianData,msgs[i]);
				};
			}else{
				me.createMsg(zidianData);
			};
		}
	} 
	//用后台返回的数据初始化email
	this.initCreateEmail = function(zidianData,mainDa){
		var emails = mainDa.emails;
		if(emails && util.isArray(emails)){
			if(emails.length){
				for(var i=0;i<emails.length;i++){
					me.createEmail(zidianData,emails[i]);
				};
			}else{
				me.createEmail(zidianData);
			};
		}
	} 
	//用后台返回的数据初始化address
	this.initCreateAddress = function(zidianData,mainDa){
		var addresses = mainDa.addresses;
		if(addresses && util.isArray(addresses)){
			if(addresses.length){
				for(var i=0;i<addresses.length;i++){
					me.createAddress(zidianData,addresses[i]);
				};
			}else{
				me.createAddress(zidianData);
			};
		}
		//创建其他信息
		//me.createOthersTitle(mainDa);
	} 
	
	//创建电话的动态行
	var allPhones = [];//用于提交时获取当前行的数据
	//动态增减的行标
	var phoneIndex,phoneLength=0;//phoneLength表示的是phone的总行数
	this.createPhone = function(zidianData,da){
		var phoneComboData = [];//phoneCombox的假数据
		var phoneObj;
		if(zidianData.phones){
			zidianData.phones.each(function(index,col){
				var obj = {	key:col,value:col};
				phoneComboData.push(obj);
			});
			phoneComboData.push({key:'其他',value:'其他'});
		}
		phoneIndex = !Boolean(allPhones.length)===true?index:phoneIndex;
		var form = me.mod.main.get('editPerson_id');
		var phoneCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var labelphone =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'电话：'});
		var deldanweiZhizilabel = new Gframe.controls.Label({textAlign:'left',value:'',cursor : 'pointer',textCls:'deletemail_btn',height:25,width:15,handler:function(){
					allPhones.del(phoneObj);
					form.removeItemByIds([phoneCol.get('id')]);	
	 				index--;
	 				phoneIndex--;
	 				phoneLength--;
	 				form.update();
		}});//
		var addBtn = new Gframe.controls.Label({textAlign:'left',value:'',cursor : 'pointer',textCls:'addarea_btn',height:25,width:15,handler:function(){
				//递归创建动态增减行
				me.createPhone(zidianData);
		}});
		var phoneText = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,width:'max'});
		var phoneCombo = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:phoneComboData,onclick:function(self){
			//如果是自定义
			var bnObj = me.updateSumitData(self,phoneCol,allPhones,addBtn,deldanweiZhizilabel,'','',phoneText);
			//修改用于提交数据的组件
			var okn = me.getObjById(allPhones,self.get('id'));
			if(okn){//找到了就直接修改
				okn['combo'] = bnObj.comboxK;
				okn['txt'] = bnObj.txtK;
			}
		}},{width:200});
		phoneCol.addItem(new Blank({width:20}));
		if(allPhones.length===0){//如果只有一行就加label
			phoneCol.addItem(labelphone);
		}else{
			phoneCol.addItem(new Blank({width:80}));
		}
		phoneCol.addItem(new Blank({width:10}));
		phoneCol.addItem(phoneCombo);
		phoneCol.addItem(new Blank({width:30}));
		phoneCol.addItem(phoneText);
		phoneCol.addItem(new Blank({width:rightG}));
		if(allPhones.length===0){
			phoneCol.addItem(addBtn);
		}else{
			phoneCol.addItem(deldanweiZhizilabel);
		}
		phoneCol.addItem(new Blank({width:30}));
		form.addItem(phoneIndex,phoneCol);
		index++;//同步行标
		phoneIndex++;//动态行标
		phoneLength++;//phone高度的该变量
		form.update();
		//便于以后销毁
		allLines.push(phoneCol);
		phoneObj = {
			'combo':phoneCombo,
			'txt':phoneText
		};
		//可能的数据回填操作
		if(da && util.isObject(da)){
			da.value = da.value || '';
			da.key = da.key || '';
			phoneCombo.setValue(da.key);
			phoneText.setValue(da.value);
		}
		//保存当前的组件，便于以后提交数据
		allPhones.push(phoneObj);
	}
	
	//创建传真的动态行
	var allFaxs = [];//用于提交时获取当前行的数据
	var faxLength=0;//fax的总行数
	this.createFax = function(zidianData,da){
		var faxComboData = [];//phoneCombox的假数据
		var faxObj;
		var changephLen;//phone改变的行数
		
		//计算faxIndex的初始值，或者递归时候的值
		var faxIndex = phoneIndex+faxLength;
		
		if(zidianData.faxes){
			zidianData.faxes.each(function(index,col){
				var obj = {	key:col,value:col};
				faxComboData.push(obj);
			});
			faxComboData.push({key:'其他',value:'其他'});
		}
		var form = me.mod.main.get('editPerson_id');
		var faxCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var labelfax =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'传真：'});
		var deldanweiZhizilabel = new Gframe.controls.Label({textAlign:'left',value:'',cursor : 'pointer',textCls:'deletemail_btn',height:25,width:15,handler:function(){
					allFaxs.del(faxObj);
					form.removeItemByIds([faxCol.get('id')]);	
	 				index--;
	 				faxLength--;
	 				form.update();
		}});//
		var addBtn = new Gframe.controls.Label({textAlign:'left',value:'',cursor : 'pointer',textCls:'addarea_btn',height:25,width:15,handler:function(){
				//递归创建动态增减行
				me.createFax(zidianData);
		}});
		var faxText = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,width:'max'});
		var faxCombo = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:faxComboData,onclick:function(self){
			//如果是自定义
			var bnObj = me.updateSumitData(self,faxCol,allFaxs,addBtn,deldanweiZhizilabel,'','',faxText);
			//修改用于提交数据的组件
			var okn = me.getObjById(allFaxs,self.get('id'));
			if(okn){//找到了就直接修改
				okn['combo'] = bnObj.comboxK;
				okn['txt'] = bnObj.txtK;
			}
		}},{width:200});
		faxCol.addItem(new Blank({width:20}));
		if(allFaxs.length===0){
			faxCol.addItem(labelfax);
		}else{
			faxCol.addItem(new Blank({width:80}));
		};
		faxCol.addItem(new Blank({width:10}));
		faxCol.addItem(faxCombo);
		faxCol.addItem(new Blank({width:30}));
		faxCol.addItem(faxText);
		faxCol.addItem(new Blank({width:rightG}));
		if(allFaxs.length===0){
			faxCol.addItem(addBtn);
		}else{
			faxCol.addItem(deldanweiZhizilabel);
		};
		faxCol.addItem(new Blank({width:30}));
		form.addItem(faxIndex,faxCol);
		index++;
		faxLength++;//便于计算后面的动态index
		form.update();
		//便于以后销毁
		allLines.push(faxCol);
		faxObj = {
			'combo':faxCombo,
			'txt':faxText
		};
		//可能的数据回填操作
		if(da && util.isObject(da)){
			da.value = da.value || '';
			da.key = da.key || '';
			faxCombo.setValue(da.key);
			faxText.setValue(da.value);
		}
		allFaxs.push(faxObj);
	}
	
	//创建即时通讯的动态行
	var allMsgs = [];//用于提交时获取当前行的数据
	var msgLength=0;
	this.createMsg = function(zidianData,da){
		var msgComboData = [];//phoneCombox的假数据
		var msgObj;
		
		//计算msgIndex的初始值，或者递归时候的值
		var msgIndex = phoneIndex+faxLength+msgLength;
		
		if(zidianData.messaginges){
			zidianData.messaginges.each(function(index,col){
				var obj = {	key:col,value:col};
				msgComboData.push(obj);
			});
			msgComboData.push({key:'其他',value:'其他'});
		}
		var form = me.mod.main.get('editPerson_id');
		var msgCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var msglabel =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'即时通讯：'});
		var deldanweiZhizilabel = new Gframe.controls.Label({textAlign:'left',value:'',cursor : 'pointer',textCls:'deletemail_btn',height:25,width:15,handler:function(){
					allMsgs.del(msgObj);
					form.removeItemByIds([msgCol.get('id')]);	
	 				index--;
	 				msgLength--;
	 				form.update();
		}});//
		var addBtn = new Gframe.controls.Label({textAlign:'left',value:'',cursor : 'pointer',textCls:'addarea_btn',height:25,width:15,handler:function(){
				//递归创建动态增减行
				me.createMsg(zidianData);
		}});
		var msgText = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,width:'max'});
		var msgCombo = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:msgComboData,onclick:function(self){
			//如果是自定义
			var bnObj = me.updateSumitData(self,msgCol,allMsgs,addBtn,deldanweiZhizilabel,'','',msgText);
			//修改用于提交数据的组件
			var okn = me.getObjById(allMsgs,self.get('id'));
			if(okn){//找到了就直接修改
				okn['combo'] = bnObj.comboxK;
				okn['txt'] = bnObj.txtK;
			}
		}},{width:200});
		msgCol.addItem(new Blank({width:20}));
		if(allMsgs.length===0){
			msgCol.addItem(msglabel);
		}else{
			msgCol.addItem(new Blank({width:80}));
		};
		msgCol.addItem(new Blank({width:10}));
		msgCol.addItem(msgCombo);
		msgCol.addItem(new Blank({width:30}));
		msgCol.addItem(msgText);
		msgCol.addItem(new Blank({width:rightG}));
		if(allMsgs.length===0){
			msgCol.addItem(addBtn);
		}else{
			msgCol.addItem(deldanweiZhizilabel);
		};
		msgCol.addItem(new Blank({width:30}));
		form.addItem(msgIndex,msgCol);
		index++;
		msgLength++;//便于计算后面的动态index
		form.update();
		//便于以后销毁
		allLines.push(msgCol);
		msgObj = {
			'combo':msgCombo,
			'txt':msgText
		};
		//可能的数据回填操作
		if(da && util.isObject(da)){
			da.value = da.value || '';
			da.key = da.key || '';
			msgCombo.setValue(da.key);
			msgText.setValue(da.value);
		}
		allMsgs.push(msgObj);
	}
	
	//创建电子邮箱的动态行
	var allEmails = [];//用于提交时获取当前行的数据
	var emailLength=0;
	this.createEmail = function(zidianData,da){
		var emailComboData = [];//phoneCombox的假数据
		var emailObj;
		
		//计算emailIndex的初始值，或者递归时候的值
		var emailIndex = phoneIndex+faxLength+msgLength+emailLength+1;
		
		if(zidianData.emails){
			zidianData.emails.each(function(index,col){
				var obj = {	key:col,value:col};
				emailComboData.push(obj);
			});
				emailComboData.push({key:'其他',value:'其他'});
		}
		var form = me.mod.main.get('editPerson_id');
		var emailCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var emaillabel =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'电子邮箱：'});
		var deldanweiZhizilabel = new Gframe.controls.Label({textAlign:'left',value:'',cursor : 'pointer',textCls:'deletemail_btn',height:25,width:15,handler:function(){
					allEmails.del(emailObj);
					form.removeItemByIds([emailCol.get('id')]);	
	 				index--;
	 				emailLength--;
	 				form.update();
	 		
		}});//
		var addBtn = new Gframe.controls.Label({textAlign:'left',value:'',cursor : 'pointer',textCls:'addarea_btn',height:25,width:15,handler:function(){
				//递归创建动态增减行
				me.createEmail(zidianData);
		}});
		var emailText = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,width:'max'});
		var emailCombo = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:emailComboData,onclick:function(self){
			var bnObj = me.updateSumitData(self,emailCol,allEmails,addBtn,deldanweiZhizilabel,'emailDefault',defaultLabel,emailText);
			//修改用于提交数据的组件
			var okn = me.getObjById(allEmails,self.get('id'));
			if(okn){//找到了就直接修改
				okn['combo'] = bnObj.comboxK;
				okn['txt'] = bnObj.txtK;
			}
		}},{width:200});
		emailCol.addItem(new Blank({width:20}));
//		if(allEmails.length===0){
//			emailCol.addItem(emaillabel);
//		}else{
			emailCol.addItem(new Blank({width:80}));
//		};
		emailCol.addItem(new Blank({width:10}));
		emailCol.addItem(emailCombo);
		
		emailCol.addItem(new Blank({width:30}));
		
		emailCol.addItem(emailText);
		
		emailCol.addItem(new Blank({width:rightG}));
		if(allEmails.length===0){//15
			emailCol.addItem(addBtn);
		}else{
			emailCol.addItem(deldanweiZhizilabel);
		};
		//为了修改默认的邮箱而附带的设置
		emailCol.addItem(new Blank({width:rightG}));//5
		var defTag;
//		var defaultLabel =  new Gframe.controls.Label({textAlign:'left',value:'',title:'设置默认邮箱',cursor : 'pointer',textCls:'notfinal_sign',height:25,width:15,handler:function(e,lal){
//				if(!defTag){
//					lal.setCls('finish_sign');
//					defTag = true;
//					emailObj['defaultPro'] = '1';
//				}else{
//					lal.setCls('notfinal_sign');
//					defTag = null;
//					emailObj['defaultPro'] = '0';
//				}
//		}});
//		emailCol.addItem(defaultLabel);//5
		emailCol.addItem(new Blank({width:25}));
		form.addItem(emailIndex,emailCol);
		index++;
		emailLength++;//便于计算后面的动态index
		form.update();
		//便于以后销毁
		allLines.push(emailCol);
		emailObj = {
			'combo':emailCombo,
			'txt':emailText,
			'defaultPro':'0'
		};
		//可能的数据回填操作
		if(da && util.isObject(da)){
			da.value = da.value || '';
			da.key = da.key || '';
			emailCombo.setValue(da.key);
			emailText.setValue(da.value);
			if(da.isDefault==='1'){//默认邮箱
				defaultLabel.setCls('finish_sign');
				emailObj['defaultPro']='1';
				defTag = true;
			}
		}
		allEmails.push(emailObj);
	}
	
	//创建电子邮箱的动态行
	var allAddress = [];//用于提交时获取当前行的数据
	var addressLength=0;
	this.createAddress = function(zidianData,da){
		var addressComboData = [];//phoneCombox的假数据
		var addressObj;
		
		//计算emailIndex的初始值，或者递归时候的值
		var addressIndex = phoneIndex+faxLength+msgLength+emailLength+addressLength+1;
		
		if(zidianData.addresses){
			zidianData.addresses.each(function(index,col){
				var obj = {	key:col,value:col};
				addressComboData.push(obj);
			});
				addressComboData.push({key:'其他',value:'其他'});
		}
		var form = me.mod.main.get('editPerson_id');
		var addressCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var addresslabel =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'地址：'});
		var deldanweiZhizilabel = new Gframe.controls.Label({textAlign:'left',value:'',cursor : 'pointer',textCls:'deletemail_btn',height:25,width:15,handler:function(){
					allAddress.del(addressObj);
					form.removeItemByIds([addressCol.get('id')]);	
	 				index--;
	 				addressLength--;
	 				form.update();

		}});//
		var addBtn = new Gframe.controls.Label({textAlign:'left',value:'',cursor : 'pointer',textCls:'addarea_btn',height:25,width:15,handler:function(){
				//递归创建动态增减行
				me.createAddress(zidianData);
		}});
		var addressText = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,width:'max'});
		var codeText = new Gframe.controls.TextField({textAlign:'left',value:'输入邮编',onclick:clearTxt,leftHidden:true,width:'max'});
		var addressCombo = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:addressComboData},{width:200});
		addressCol.addItem(new Blank({width:20}));
		if(allAddress.length===0){
			addressCol.addItem(addresslabel);
		}else{
			addressCol.addItem(new Blank({width:80}));
		};
		addressCol.addItem(new Blank({width:10}));
		addressCol.addItem(addressCombo);
		
		addressCol.addItem(new Blank({width:30}));//多余45
		addressCol.addItem(addressText);
		addressCol.addItem(new Blank({width:20}));
		addressCol.addItem(codeText);
		
		addressCol.addItem(new Blank({width:rightG}));
		if(allAddress.length===0){
			addressCol.addItem(addBtn);
		}else{
			addressCol.addItem(deldanweiZhizilabel);
		};
		addressCol.addItem(new Blank({width:rightG}));
		addressCol.addItem(new Blank({width:30}));
		form.addItem(addressIndex,addressCol);
		index++;
		addressLength++;//便于计算后面的动态index
		form.update();
		//便于以后销毁
		allLines.push(addressCol);
		addressObj = {
			'combo':addressCombo,
			'txt':addressText,
			'codeTxt':codeText
		};
		//可能的数据回填操作
		if(da && util.isObject(da)){
			da.value = da.value || '';
			da.key = da.key || '';
			addressCombo.setValue(da.key);
			addressText.setValue(da.value);
			da.code = da.code || '';
			codeText.setValue(da.code);
		}
		allAddress.push(addressObj);
		//清楚文本框的默认值
		function clearTxt(){
			if(codeText.getValue()==='输入邮编'){
				codeText.setValue('');
			}
		}
	}
	
	//创建其他信息的标签
	this.createOthersTitle = function(data){
	
		var form = me.mod.main.get('editPerson_id');
		var titleRowbar = new Rowbar({rows:[]},{width:'max',height:25});
		var colTitle = new Colbar({cols:[],align:'left'},{width:'max',height:18});
		var titel = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',height:18,width:'max',value:'其他信息'}); 
		colTitle.addItem(new Blank({width:20}));
		colTitle.addItem(titel);
		var linecol = new Colbar({cols:[],align:'left'},{height:3,width:'max',cls:'broken_line'});
		titleRowbar.addItem(colTitle);
		titleRowbar.addItem(linecol);
		titleRowbar.addItem(new Blank({height:5}));
		form.addItem(index,titleRowbar);
		form.update();
		index++;
		//便于以后销毁
		allLines.push(titleRowbar);
		//创建其他信息
		me.createOthersDetail(data);
	}
	
	//创建其他信息
	this.createOthersDetail = function(data){
		var form = me.mod.main.get('editPerson_id');
		var col = new Colbar({cols:[],align:'left'},{width:'max',height:100});
		var label = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',height:18,width:80,value:'兴趣爱好'}); 
		var txtArea = new Gframe.controls.TextArea({width:'max',name:'interest',height:90});
		col.addItem(new Blank({width:20}));
		col.addItem(label);
		col.addItem(new Blank({width:5}));
		col.addItem(txtArea);
		col.addItem(new Blank({width:20}));
	
		form.addItem(index,col);
		form.update();
		txtArea.setValue(data.interest);
		index++;
		//便于以后销毁
		allLines.push(col);
	}
	
	/************************************************类似工具方法***************************************************/
	this.isHave = function(arrayList,id){
		for(var i=0;i<arrayList.length;i++){
			var b = Boolean(arrayList[i]['combo'].get('id')===id);
			if(b){
				return i;
			}
				
		};
	}
	
	this.delObjFromArray = function(arrayList,id){
		var i = me.isHave(arrayList,id);
		arrayList.remove(i);
	}
	
	this.getObjById = function(arrayList,id){
		var abk;
		for(var i=0;i<arrayList.length;i++){
			var b = Boolean(arrayList[i]['combo'].get('id')===id);
			if(!b){
				b = Boolean(arrayList[i]['combo']['flag']==='bySelf');//属于自定义的组件
			}
		
			if(b){
				abk = arrayList[i];
			}
		};
		return abk;
	}
	
	//局部修改数据提交对象
	this.updateSumitData = function(comboS,mCol,allM,addBtn,deldanweiZhizilabel,emailDefaultTag,defaultLabel,txtGet){
		var comboxK;
		var txtK;
		var retuObj = {};
		if(comboS.getValue()==='其他'){
			mCol.removeItems(5);
			var msgText1 = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,width:'max'});
			mCol.addItem(msgText1);
			mCol.addItem(new Blank({width:5}));
			var btxt = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,width:'max'});
			btxt.setValue(txtGet.getValue());
			mCol.addItem(btxt);
			mCol.addItem(new Blank({width:rightG}));
			if(allM.length===1){
				mCol.addItem(addBtn);
			}else{
				mCol.addItem(deldanweiZhizilabel);
			};
			//针对邮箱的特殊情况
			if(emailDefaultTag==='emailDefault'){
				mCol.addItem(new Blank({width:rightG}));//5
				mCol.addItem(defaultLabel);//5
				mCol.addItem(new Blank({width:9}));
			}else{
				mCol.addItem(new Blank({width:30}));
			};
			mCol.update();
			//考虑到数据的提交问题
			comboxK = msgText1;
			txtK = btxt;
			msgText1['flag'] = 'bySelf';//添加自定义的标识
		}else{
			mCol.removeItems(5);
			var msgtxt2 = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,width:'max'});
			mCol.addItem(msgtxt2);
			msgtxt2.setValue(txtGet.getValue());
			mCol.addItem(new Blank({width:rightG}));
			if(allM.length===1){
				mCol.addItem(addBtn);
			}else{
				mCol.addItem(deldanweiZhizilabel);
			};
			//针对邮箱的特殊情况
			if(emailDefaultTag==='emailDefault'){
				mCol.addItem(new Blank({width:rightG}));
				mCol.addItem(defaultLabel);//5
				mCol.addItem(new Blank({width:9}));
			}else{
				mCol.addItem(new Blank({width:30}));
			};
			mCol.update();
			comboxK = comboS;
			txtK = msgtxt2;
		};
		//返回
		retuObj['comboxK'] = comboxK;
		retuObj['txtK'] = txtK;
		return retuObj;
	}
	
});
