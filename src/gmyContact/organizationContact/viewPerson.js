/**
 * @author 田军
 *  查看联系人,属于联系人操作之一
 */
new (function(){
	var me  = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var index=1;//同步行标
	var mainData;//后台请求查看的服务返回的总数据
	var allLines;//所有动态添加的行
	var lineData;//传递过来的行数据
	var gridPath;
	var tag;//是组织通讯录，还是团队的
	this.mod.defaultView = function(params){
		lineData = params.data;
		gridPath = params.gridPath.slice(0);
		tag = params.tag || '';
		me.mod.main.open({
			id:'viewPersonDetail_id',
			xtype:'form',
			mode:'loop',
			store:{
					service:$sl.gcontact_organizationContact_viewPersonInfo.service,
					method:$sl.gcontact_organizationContact_viewPersonInfo.method,
					params:{
						uuid:lineData.uuid
					},
					success:function(data,mod){
						mainData = Boolean(data)===true?data:null;
					
						if(mainData){
							me.createFirst(data);
						}
					}
			},
			hiddens:[],
			initMethod:function(mod){
				//路径处理
				var obj = {name:lineData.name+'的详细信息'};
				gridPath.push(obj);
				if(tag!='team'){//组织通讯录
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
				}
				me.mod.main.reloadTrack(gridPath);
				//路径处理结束
				index = 1;
				var form = me.mod.main.get('viewPersonDetail_id');
				allLines = [];
			}
		});
	}
	
	this.createFirst = function(data){
		allLines = [];
		var form = me.mod.main.get('viewPersonDetail_id');
		var image =  new Gframe.controls.Image({src:'',borderHidden:true, borderHover:false},{width:120,height:133});
		var hrefurl;
		if(data.iconUuid){
			hrefurl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+data.iconUuid;
		}else{
			hrefurl = 'adapter/images/man01.png';
		};
		image.setImgUrl(hrefurl);
		var row1 = new Rowbar({rows:[]},{width:120,height:140});	
		var row2 = new Rowbar({rows:[]},{width:'max',height:140});
		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:100});
		var firstCol = new Colbar({cols:[],align:'left'},{width:'max',height:140});
		var nameTextl = new Gframe.controls.Label({width:60,height:33,textCls:'title_font',value:'姓名：'});
		var nameLabel = new Gframe.controls.Label({width:120,height:33,textAlign:'left'});
		nameLabel.setValue(data.name);
		
		
		var sexTextl = new Gframe.controls.Label({width:60,height:33,textCls:'title_font',value:'性别：'});
		var sexLabel = new Gframe.controls.Label({width:120,height:33,textAlign:'left'});
		var sexValue = '';
		if(data.sex==='男'){
			sexValue = '男';
		}else if(data.sex==='女'){
			sexValue = '女';
		}
		sexLabel.setValue(sexValue);
		
		var label5 =  new Gframe.controls.Label({textAlign:'left',top:3,textCls:'title_font',width:50,value:'生日：'});
		var text5 = new Gframe.controls.Label({textAlign:'left',top:3,width:'max'});
		text5.setValue(data.birthday);
		
		var remarkLabel = new Gframe.controls.Label({width:'max',height:33,textAlign:'left'});
		remarkLabel.setValue(data.remark);
		
		col1.addItem(nameTextl);
		col1.addItem(nameLabel);
		col1.addItem(new Blank({width:33}));
		col1.addItem(sexTextl);
		col1.addItem(sexLabel);
		col1.addItem(new Blank({width:10}));
		col1.addItem(label5);
		col1.addItem(text5);
		col2.addItem(remarkLabel);
		
		row1.addItem(image);

		row2.addItem(col1);
		row2.addItem(col2);
		
		firstCol.addItem(new Blank({width:20}));
		firstCol.addItem(row1);
		firstCol.addItem(new Blank({width:2}));
		firstCol.addItem(row2);
		firstCol.addItem(new Blank({width:20}));	
		form.addItem(index,firstCol);
		
		form.update();
		index++;
		//创建基本信息
		me.createBasicInfo(data);
		//便于以后销毁
		allLines.push(firstCol);
	}
	
	//创建 基本信息
	this.createBasicInfo = function(data){
		var form = me.mod.main.get('viewPersonDetail_id');
		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:33}); 
		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:33}); 
		var col3 = new Colbar({cols:[],align:'left'},{width:'max',height:33}); 
		var colTitle = new Colbar({cols:[],align:'left'},{width:'max',height:30}); 
		var secondRowbar = new Rowbar({rows:[]},{width:'max',height:170});
		
		var label1 =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'单位：'});
		var text1 = new Gframe.controls.Label({textAlign:'left',width:'max'});
		text1.setValue(data.company);
		var label2 =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'部门：'});
		var text2 = new Gframe.controls.Label({textAlign:'left',width:'max'});
		text2.setValue(data.organization);
		var label3 =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'职务：'});
		var text3 = new Gframe.controls.Label({textAlign:'left',width:'max'});
		text3.setValue(data.post);
		var label4 =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'其他：'});
		var text4 = new Gframe.controls.Label({textAlign:'left',width:'max'});
		text4.setValue(data.position);
	
		var label6 =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'系统账号：'});
		var text6 = new Gframe.controls.Label({textAlign:'left',width:'max'});
	
		text6.setValue(data.sysAccount);
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
		
	
		var titel = new Gframe.controls.Label({textAlign:'left',textCls:'tree_label',height:30,width:120,value:'基本信息'}); 
		colTitle.addItem(new Blank({width:20}));
		colTitle.addItem(titel);
		var line= new Gframe.controls.Label({textCls:'broken_black',width:'max'});
		var linecol = new Colbar({cols:[
			new Blank({width:20}),
			line,
			new Blank({width:10})
		],align:'left'},{height:3});
		secondRowbar.addItem(new Blank({height:10}));
		secondRowbar.addItem(colTitle);
		secondRowbar.addItem(linecol);
		secondRowbar.addItem(new Colbar({align:'left'},{height:10}));
		secondRowbar.addItem(new Blank({height:5}));
		secondRowbar.addItem(col1);
		secondRowbar.addItem(col2);
		secondRowbar.addItem(col3);
		
		form.addItem(index+1,secondRowbar);
		index++;
		form.update();
		//创建联系信息的标签
		me.createRelTitle(data);	
		//便于以后销毁
		allLines.push(secondRowbar);
	}
	
	this.createRelTitle = function(data){
		var form = me.mod.main.get('viewPersonDetail_id');
		var titleRowbar = new Rowbar({rows:[]},{width:'max',height:40});
		var colTitle = new Colbar({cols:[],align:'left'},{width:'max',height:30});
		var titel = new Gframe.controls.Label({textAlign:'left',textCls:'tree_label',height:30,width:'max',value:'联系信息'}); 
		colTitle.addItem(new Blank({width:20}));
		colTitle.addItem(titel);
		var line= new Gframe.controls.Label({textCls:'broken_black',width:'max'});
		var linecol = new Colbar({cols:[
			new Blank({width:20}),
			line,
			new Blank({width:10})
		],align:'left'},{height:3});
		titleRowbar.addItem(colTitle);
		titleRowbar.addItem(linecol);
		titleRowbar.addItem(new Blank({height:5}));
		form.addItem(index+1,titleRowbar);
		form.update();
		index++;
		//便于以后销毁
		allLines.push(titleRowbar);
		//创建联系信息
		me.createRelativeInfo(data);
	}
	
	//创建联系人的信息
	this.createRelativeInfo = function(data){
		var form = me.mod.main.get('viewPersonDetail_id');
		var phones = data.phones;
		if(util.isArray(phones)){
			var phoneLabel = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',height:33,width:80,value:'电话：'});
			var rowbarPhone = new Rowbar({rows:[]},{width:'max',height:phones.length*33});
			for(var i=0;i<phones.length;i++){
				var phone = phones[i];
				var keyabel = new Gframe.controls.Label({textAlign:'right',height:33,width:120,value:phone.key});
				var valueLabel = new Gframe.controls.Label({textAlign:'left',height:33,width:'max',value:phone.value});
				var col = new Colbar({cols:[],align:'left'},{width:'max',height:33});
				col.addItem(new Blank({width:20}));
				if(i==0){
					col.addItem(phoneLabel);
				}else{
					col.addItem(new Blank({width:80}));
				};
				col.addItem(new Blank({width:15}));
				col.addItem(keyabel);
				col.addItem(new Blank({width:15}));
				col.addItem(valueLabel);
				col.addItem(new Blank({width:40}));
				rowbarPhone.addItem(col);
			};
			allLines.push(rowbarPhone);
			form.addItem(index+1,rowbarPhone);
			index++;
		}
		if(data.faxes && util.isArray(data.faxes) && data.faxes.length){
			var faxes = data.faxes;
			var faxLabel = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',height:33,width:80,value:'传真：'});
			var rowbarFax = new Rowbar({rows:[]},{width:'max',height:faxes.length*33});
			for(var i=0;i<faxes.length;i++){
				var fax = faxes[i];
				var keyabel = new Gframe.controls.Label({textAlign:'right',height:33,width:120,value:fax.key});
				var valueLabel = new Gframe.controls.Label({textAlign:'left',height:33,width:'max',value:fax.value});
				var col = new Colbar({cols:[],align:'left'},{width:'max',height:33});
				col.addItem(new Blank({width:20}));
				if(i==0){
					col.addItem(faxLabel);
				}else{
					col.addItem(new Blank({width:80}));
				};
				col.addItem(new Blank({width:15}));
				col.addItem(keyabel);
				col.addItem(new Blank({width:15}));
				col.addItem(valueLabel);
				col.addItem(new Blank({width:40}));
				rowbarFax.addItem(col);
			};
			form.addItem(index+1,rowbarFax);
			allLines.push(rowbarFax);
			index++;
		}
		var messaginges = data.messaginges;
		if(util.isArray(messaginges)){
			var msgLabel = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',height:33,width:80,value:'即时通讯：'});
			var rowbarMsg = new Rowbar({rows:[]},{width:'max',height:messaginges.length*33});
			for(var i=0;i<messaginges.length;i++){
				var msg = messaginges[i];
				var keyabel = new Gframe.controls.Label({textAlign:'right',height:33,width:120,value:msg.key});
				var valueLabel = new Gframe.controls.Label({textAlign:'left',height:33,width:'max',value:msg.value});
				var col = new Colbar({cols:[],align:'left'},{width:'max',height:33});
				col.addItem(new Blank({width:20}));
				if(i==0){
					col.addItem(msgLabel);
				}else{
					col.addItem(new Blank({width:80}));
				};
				col.addItem(new Blank({width:15}));
				col.addItem(keyabel);
				col.addItem(new Blank({width:15}));
				col.addItem(valueLabel);
				col.addItem(new Blank({width:40}));
				rowbarMsg.addItem(col);
			};
			form.addItem(index+1,rowbarMsg);
			allLines.push(rowbarMsg);
			index++;
		}
		
		var intraEmail = data.intraEmail || ' ';
		if(intraEmail){
			var emailLabel2 = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',height:33,width:80,value:'电子邮箱：'});
			var rowbarEmail2 = new Rowbar({rows:[]},{width:'max',height:33});
			var keyabel2 = new Gframe.controls.Label({textAlign:'right',height:33,width:120,value:'系统邮箱'});
			var valueLabel2 = new Gframe.controls.Label({textAlign:'left',height:33,width:'max'});
			var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:33});
			col2.addItem(new Blank({width:20}));
			
			col2.addItem(emailLabel2);
			
			col2.addItem(new Blank({width:15}));
			col2.addItem(keyabel2);
			col2.addItem(new Blank({width:15}));
			col2.addItem(valueLabel2);
			col2.addItem(new Blank({width:40}));
			valueLabel2.setValue(intraEmail);
			rowbarEmail2.addItem(col2);
			form.addItem(index+1,rowbarEmail2);
			allLines.push(rowbarEmail2);
			index++;
		}
		
		var emails = data.emails || [];
		if(util.isArray(emails) && emails.length){
			var emailLabel = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',height:33,width:80,value:'邮箱：'});
			var rowbarEmail = new Rowbar({rows:[]},{width:'max',height:emails.length*33});
			for(var i=0;i<emails.length;i++){
				var email = emails[i];
				var keyabel = new Gframe.controls.Label({textAlign:'right',height:33,width:120,value:email.key});
				var valueLabel = new Gframe.controls.Label({textAlign:'left',height:33,width:'max',value:email.value});
				var col = new Colbar({cols:[],align:'left'},{width:'max',height:33});
				col.addItem(new Blank({width:20}));
				if(intraEmail){
					col.addItem(new Blank({width:80}));
				}else{
					col.addItem(emailLabel);
				};
				col.addItem(new Blank({width:15}));
				col.addItem(keyabel);
				col.addItem(new Blank({width:15}));
				col.addItem(valueLabel);
				col.addItem(new Blank({width:40}));
				rowbarEmail.addItem(col);
			};
			form.addItem(index+1,rowbarEmail);
			allLines.push(rowbarEmail);
			index++;
		}
		var addresses = data.addresses;
		if(util.isArray(addresses)){
			var addressLabel = new Gframe.controls.Label({textAlign:'right',textCls:'title_font',height:33,width:80,value:'地址：'});
			var rowbarAddress = new Rowbar({rows:[]},{width:'max',height:addresses.length*33});
			for(var i=0;i<addresses.length;i++){
				var address = addresses[i];
				var keyabel = new Gframe.controls.Label({textAlign:'right',height:33,width:120,value:address.key});
				var codeNameLabel = new Gframe.controls.Label({textAlign:'right',height:33,width:80});
				var valueLabel = new Gframe.controls.Label({textAlign:'left',height:33,width:'max',value:address.value});
				var codeLabel = new Gframe.controls.Label({textAlign:'left',height:33,width:'max',value:address.code});
				var col = new Colbar({cols:[],align:'left'},{width:'max',height:33});
				col.addItem(new Blank({width:20}));
				if(i==0){
					col.addItem(addressLabel);
				}else{
					col.addItem(new Blank({width:80}));
				};
				col.addItem(new Blank({width:15}));
				col.addItem(keyabel);
				col.addItem(new Blank({width:15}));
				col.addItem(valueLabel);
				col.addItem(new Blank({width:15}));
				col.addItem(codeNameLabel);
				col.addItem(new Blank({width:2}));
				col.addItem(codeLabel);
				col.addItem(new Blank({width:40}));
				rowbarAddress.addItem(col);
			};
			form.addItem(index+1,rowbarAddress);
			allLines.push(rowbarAddress);
			index++;
		}
		//update form
		form.update();
		//me.createRemarkInfo(data);
		//me.createWlanEmail(data);
	}
	
	this.createWlanEmail = function(data){
		var form = me.mod.main.get('viewPersonDetail_id');
		var label =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'内网邮箱：'});
		var emailText = new Gframe.controls.Label({textAlign:'left',width:'max'});
		var wlanEmailCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		wlanEmailCol.addItem(new Blank({width:20}));
		wlanEmailCol.addItem(label);
		wlanEmailCol.addItem(new Blank({width:10}));
		wlanEmailCol.addItem(emailText);
		wlanEmailCol.addItem(new Blank({width:52}));
		form.addItem(index,wlanEmailCol);
		form.update();
		data.intraEmail = data.intraEmail || '';
		emailText.setValue(data.intraEmail);
		index++;
	}
	
	
	//创建备注信息
	this.createRemarkInfo = function(data){
		var form = me.mod.main.get('viewPersonDetail_id');
		var col = new Colbar({cols:[],align:'left'},{width:'max',height:100});
		var label = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',height:18,width:80,value:'兴趣爱好：'}); 
		var txtArea = new Gframe.controls.Label({width:'max',textAlign:'left',value:data.interest});
		col.addItem(new Blank({width:20}));
		col.addItem(label);
		col.addItem(new Blank({width:5}));
		col.addItem(txtArea);
		col.addItem(new Blank({width:20}));
		form.addItem(index,col);
		form.update();
		index++;
		//便于以后销毁
		allLines.push(col);
	}
})
