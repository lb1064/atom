/**
 * @author 田军
 * 合并联系人 ，属于联系人操作之一
 * 合并联系人页面的布局思路：
 * 1、首先构建该页面需要调用后台3个服务：
 * 		1.1 服务1： 是获取所有的要合并的联系人的uuid数组 ，例如后台数据：
 * 			"data":[{"uuids":["ffa01ed8-9913-49b5-8f14-290fee48ac96","6ed1fc8e-192c-4924-bfed-6161c8cac04d"]},{"uuids":["c09e1a3b-f214-4c4f-8d88-965d0bde1c51","e01ba7ac-423f-426f-ab6d-148b1d88e2f4"]}]}
 * 			每一组uuids代表的是要合并的一组联系人,此例中共有2组要合并的联系人。
 * 		1.2 服务2： 是根据上面的一组uuids来获取这个组中所有的联系人的详细信息，比如：
 * 			'data':[
 * 				{
 * 						uuid:'ffa01ed8-9913-49b5-8f14-290fee48ac96',
 * 						name:'zhangsan',
 * 						sex:'男',
 * 						deparment:'部门1',
 * 						remark:'我是张三,家住汉口XXXX'
 * 					
 * 				},
 * 				{
 * 						uuid:'ffa01ed8-9913-49b5-8f14-290fee48ac96',
 * 						name:'zhangsan',
 * 						sex:'男',
 * 						deparment:'部门2',
 * 						remark:'我是张三,家住汉口YYYY'
 * 					
 * 				}
 * 			]
 * 		1.3 服务3： 是获取数据字典信息，如后台数据：
 * 			{"addresses":["常住地址","办公地址","家庭地址"],"emails":["办公邮箱","家庭邮箱","常用邮箱"],"faxes":[],"messaginges":["QQ","MSN","新浪微博","腾讯微博"],"phones":["移动电话","办公固话","家庭固话"]}
 * 			这些数据是combox的下拉框的数据，表示相应字段的可选择项。
 * 
 * 2、详细的构建步骤：
 * 		2.1，首先请求服务1，在该服务的success的回调中创建合并页面的表头（me.createFirst），就是已经合并了多少组，还有多少组要合并！
 * 		2.2，在me.getMergePersonDetailInfo的方法中，请求服务2，获取要合并的联系人的详细信息，由于这些信息十一人为单位给到前台的，但是
 * 			合并页面是要从不同人的同一类信息（比如 部门）中让客户去选择一个，所以拿到后台给的数据后，我们要对数据进行横向遍历，把同一类信息提取出来
 * 			比如部门，然后放到合并页面的combox的数据中，让客户去选择一个，所以要先构造一个combox的数据：
 * 			[{name:'部门1',value:'部门1'},{name:'部门2',value:'部门2'}]
 * 			以此类推，需要对基本信息，联系信息进行遍历，然后组装成我们前台页面展示需要的数据。
 * 		2.3 在展示联系信息之前我们需要先调用获取数据字典的后台服务，在服务的回调中构建联系信息的布局！
 * 
 * 3、顺次执行上面的1,2步，该页面会创建成功
 * 4、点击checkbox，取消某一个联系人的参加合并时候，页面布局需要重新构建，因为要把这个人的信息从页面显示上清除掉。
 * 		4.1、由于页面是动态创建的，所以要想将页面的数据刷新，比较简单的方式，就是form.removeItemByIds(array ids),
 * 			因为刷新数据的时候页面上基本信息以上的布局是不会改变的，所以对于这个区域，标记colbar的id为'_firstCol_',
 * 			调用getItemFromArrayById方法获取该行在form的items的indexD，然后对form的items进行遍历，凡是index>indexD
 * 			的item的Id都是被删除的对象，将这些Id存入一个数组delIds中，然后调用form.removeItemByIds(delIds),将这些对象从页面上清除掉;
 * 		4.2、将这个人的信息从数据对象中清除掉，然后使用新的数据对象来重新构建(me.createNextNameandImage(formData))页面的布局！
 * 
 * 			
 * 
 * 
 */
new (function(){
	
	var me = this;
	
	this.mod = new Gframe.module.RemoteModule({});
	
	var uuidsData;//所有的的要合并的联系人的uuid
	var index;//同步行标
	var remainUuids;//余下的尚未合并的联系人
	var allLines;//所有的动态增减行
	var mergeUuids;//已经合并的联系人的uuid
	var formDetailInfoArray;//打开整个表单的联系人的详情信息备份
	var submitUuids;//本次操作中真正要合并的联系人的uuid
	var len;//已经合并的长度
	var rightG;//固定间隔
	this.mod.defaultView = function(params){
		var uuid = params.uuid || '';
		remainUuids = [];
		mergeUuids = [];
		allLines = [];
		submitUuids = [];
		me.mod.main.open({
			id:'mergePersonInfo_id',
			xtype:'form',
			mode:'loop',
			track:[
//				{name:'我的通讯录',handler:function(){
//					me.mod.main.remoteOpen({
//						url:'modules/gmyContact/personContact/allPersonGrid.js',//个人通讯录的我的全部联系人
//						params:{
//							option:{
//								nodeTag:'all'
//							}
//						}
//					});
//				}},
				{name:'我的通讯录',cursor:'false'},
				{name:'合并联系人'}
			],
			acts:{
				track:[
					{name:'合并',value:'合并',handler:me.mergePersonFunc},
					{name:'不合并',value:'不合并',handler:me.noMergeFunc}
				]
			},
			hiddens:[],
			initMethod:function(mod){
					mc.send({
							service:$sl.gmyContact_relativeOpen_mergePerson_getAllMergerPesonList.service,
							method:$sl.gmyContact_relativeOpen_mergePerson_getAllMergerPesonList.method,
							params:{
								uuid:uuid
							},
							success:function(response){
								var data = util.parseJson(response.responseText);
								var bckData = Boolean(data.data)===true?data.data:null;
								uuidsData = bckData.slice(0);
							
								if(uuidsData.length){//后台返回的数组的长度不能够是0
									len = 0;
									remainUuids = bckData.slice(0);//剩余的uuids
									submitUuids = remainUuids[0].uuids;//本次操作中要合并的联系人的uuids
									me.createFirst(uuidsData);
								}else{
									me.mod.main.alert({
										text:'没有要合并的联系人！',
										level:'error',
										delay:3000
									});
									return ;
								}
							}
					});
					//使部分数据initialize初始化
					allLines = [];allPhones = [];
					allFaxs = [];allMsgs = [];
					allEmails = [];allAddress = [];
					index = 1;
					rightG = 5;
					phoneIndex = null;
					phoneLength = 0;
					faxLength = 0;
					msgLength = 0;
					emailLength = 0;
					addressLength = 0;
			}
		});
	}
	
	//如果不提交
	this.noMergeFunc = function(o){
			var form = me.mod.main.get('mergePersonInfo_id');
			form.removeData();//删除所有的子对象
			form.update();
			//将剩余的没有合并的组的uuid更改
			remainUuids.remove(0);
			if(remainUuids.length){
				//使部分数据初始化
				index = 0;
				rightG = 5;
				allLines = [];
				allPhones = [];
				allFaxs = [];allMsgs = [];
				allEmails = [];allAddress = [];
				phoneIndex = null;
				phoneLength = 0;
				faxLength = 0;
				msgLength = 0;
				emailLength = 0;
				addressLength = 0;
				//重新绘制表单
				me.createFirst(uuidsData);
			}else{
				me.mod.main.alert({
					text:'已经没有要合并的联系人！',
					level:'error',
					delay:3000
				});
				me.mod.main.remoteOpen({
					url:'modules/gmyContact/personContact/allPersonGrid.js',//个人通讯录的我的全部联系人
					params:{
						option:{
							nodeTag:'all'
						}
					}
				});
			}
	}
	
	//提交合并联系人
	this.mergePersonFunc = function(){
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
		var form = me.mod.main.get('mergePersonInfo_id');
		var o = form.serializeForm();
		if(!o.uuid){
		
			o.uuid = util.json2str(submitUuids);
			
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
		if(o['groupUuids']){
			o['groupUuids'] = util.json2str(o['groupUuids']);
		}
		//console.log('提交给后台的参数',o);
		form.submit({
			service:$sl.gmyContact_relativeOpen_mergePerson_mergePersonFunc.service,
			method:$sl.gmyContact_relativeOpen_mergePerson_mergePersonFunc.method,
			params:o,
			success:function(response){
				var data = util.parseJson(response.responseText);
				if(data.success){
					me.mod.main.alert({
						text:data.msg,
						level:'info',
						delay:2000
					});
					len++;
					form.removeData();//删除所有的子对象
					form.update();
					//将剩余的没有合并的组的uuid更改
					remainUuids.remove(0);
					if(remainUuids.length){
						//要重新使部分数据initialize初始化
						index = 0;
						rightG = 5;
						allLines = [];
						allPhones = [];
						allFaxs = [];allMsgs = [];
						allEmails = [];allAddress = [];
						phoneIndex = null;
						phoneLength = 0;
						faxLength = 0;
						msgLength = 0;
						emailLength = 0;
						addressLength = 0;
						//重新绘制表单
						me.createFirst(uuidsData);
					}else{
						me.mod.main.goback();
					};
				}
			}
		})
		
	}
	
	
	//创建
	this.createFirst = function(data){
		var form = me.mod.main.get('mergePersonInfo_id');
		var titleRowbar = new Rowbar({rows:[]},{width:'max',height:25});
		var colTitle = new Colbar({cols:[],align:'left'},{width:'max',height:18});
		var titel = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',height:33,width:'max',value:'合并重复联系人'}); 
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
		me.createTotalInfoLabel(data);
	}
	
	//创建统计信息的标签
	this.createTotalInfoLabel = function(data,tag){
		var form = me.mod.main.get('mergePersonInfo_id');
		var val = '你已合并'+len+'组重复联系人，还有'+remainUuids.length+'组，推荐你合并';
		var titleLabel = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',height:33,width:'max',value:val}); 
		var colTitle = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		colTitle.addItem(new Blank({width:50}));
		colTitle.addItem(titleLabel);
		form.addItem(index,colTitle);
		form.update();
		//便于以后销毁
		allLines.push(colTitle);
		index++;
		//发送获取合并联系人详细信息的请求
		me.getMergePersonDetailInfo(data);
	}
	
	//合并联系人,用剩余的uuids的第一组uuid去获取数据
	this.getMergePersonDetailInfo = function(data){
		if(remainUuids.length){
				mc.send({
					service:$sl.gmyContact_relativeOpen_mergePerson_getMergePeopleDetailInfo.service,
					method:$sl.gmyContact_relativeOpen_mergePerson_getMergePeopleDetailInfo.method,
					params:{
						uuids:util.json2str(remainUuids[0].uuids)
					},
					success:function(response){
						var data = util.parseJson(response.responseText);
						if(util.isArray(data.data)){
							var personDetailInfoArray = data.data;//从后台获取的当前组的待合并联系人的详情信息
							formDetailInfoArray = data.data.slice(0);
							me.createMergePanelHead(personDetailInfoArray);//创建合并表单的头部
						}
					}
				});
		}else{
			//maybe go back;
		}
			
	}
	
	//创建合并表单的头部
	var cbxs;
	this.createMergePanelHead = function(personDetailInfoArray){
		cbxs = [];
		if(!personDetailInfoArray.length){
			return ;
		}
		var form = me.mod.main.get('mergePersonInfo_id');
		var titleLabel = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',height:33,width:'max',value:'本组将合并以下联系人'}); 
		var colTitle = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var colname = new Colbar({cols:[],align:'left'},{width:'max',height:33});//要显示的名字
		var cbxall = new Gframe.controls.CheckBox({displayValue:'全部',width:120,value:'1',checked:true,on:{'click':function(){
			//将所有的cbx全部选中
			if(cbxall.getValue()==='1' && cbxs){
				for(var i=0;i<cbxs.length;i++){
					cbxs[i].checked();//所有都选中
				}
				//TODO 要用全部的数据来刷formPanel
				personDetailInfoArray = formDetailInfoArray.slice(0);
				//me.refreshFormFromIndex(personDetailInfoArray);
			}else{
				//如果都不选，则数据都要清空
				for(var i=0;i<cbxs.length;i++){
					cbxs[i].unchecked();//所有都不选中
				}
				personDetailInfoArray = [];//表单数据强制清空
			};
			//刷新表单数据
			me.refreshFormFromIndex(personDetailInfoArray);
		
		}}},{width:'max',cursor:'pointer'});
		colname.addItem(new Blank({width:80}));
		colname.addItem(cbxall);
		personDetailInfoArray.each(function(index,col){
			if(col.name && (!col.groups || col.groups.length===0)){
				col.groups = '未分组';
			}
			var disValue = col.name+'('+col.groups+')';
			var cbx = new Gframe.controls.CheckBox({displayValue:disValue,checked:true},{width:'max',cursor:'pointer'});
			colname.addItem(cbx);
			colname.addItem(new Blank({width:3}));
			cbxs.push(cbx);
			(function(cbxA){
				var cbxAll = cbxA;//全选按钮
				var cb = cbx;
				var cUuid = col.uuid;
				cb.addListener('click',function(){
					me.addListenerForCbx(cb,personDetailInfoArray,cUuid,cbxAll);
				});
			})(cbxall);
		});		
		
		colTitle.addItem(new Blank({width:50}));
		colTitle.addItem(titleLabel);
		form.addItem(index,colTitle);
		form.addItem(index+1,colname);
		//便于以后销毁
		allLines.push(colTitle);
		allLines.push(colname);
		form.update();
		index = index+2;
		//创建姓名，性别，备注，分组的面板
		me.createNextNameandImage(personDetailInfoArray);
	}
	
	//为checkBox添加监听事件
	this.addListenerForCbx = function(cbx,personDetailInfoArray,cuuid,cbxALL){
	
		if(cbx.getChecked()){//如果不存在，就从备份的后台数据中，找出这个人的信息，把这个人的信息放入要显示的form中
			var v = me.checkIsExist(personDetailInfoArray,cuuid);
			if(!v){//如果form数据中不存在这个人的信息，就把它加入到form数据中
				var ob = me.getObjByUuid(formDetailInfoArray,cuuid);//从备份数据中找到
				personDetailInfoArray.push(ob);//放入当前的form数据中
				submitUuids.push(cuuid);
				var t = 0;
				for(var i=0;i<cbxs.length;i++){
					if(cbxs[i].getChecked()){
						t++;
					}
				};
				if(t == cbxs.length){//如果所有的按钮都被选中，那么就选中全选
					cbxALL.checked();
					t = null;
				}
			}
		}else{ 
			var v = me.checkIsExist(personDetailInfoArray,cuuid);
			//设置全选按钮处于不要选中的状态
			cbxALL.unchecked();
			if(v){//如果已经存在就从表单中删除该人的信息
				var obj = me.getObjByUuid(personDetailInfoArray,cuuid);
				personDetailInfoArray.del(obj);
				submitUuids.del(cuuid);
			}
		}
		//refresh formpanel
		me.refreshFormFromIndex(personDetailInfoArray);
	}
	
	//创建开始的图片，名字和性别，备注面板
	this.createNextNameandImage = function(data){
		if(!util.isObject(data[0])){
			return ;
		}
		var form = me.mod.main.get('mergePersonInfo_id');
		var image =  new Gframe.controls.Image({src:'',borderHidden:true, borderHover:false},{width:120,height:133});
		var hrefurl;
		//获取当前要合并的联系人的图片
		var iconuuidU = this.getPhotoIcon(data);
		//console.log('iconuuidU:',iconuuidU);
		if(iconuuidU){
			hrefurl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+iconuuidU;
		}else{
			hrefurl = 'adapter/images/man01.png';
		};
		image.setImgUrl(hrefurl);
		var upload = new Gframe.controls.DirectUpload({
													success:function(){
														var o = upload.getUploadInfo();
														var pictureUrl = mc.downloadurl+'?g_userName='+mc.username+'&g_token='+mc.token+'&uuid='+(o.uuid);
														image.setImgUrl(pictureUrl);
													},
													startUp:function(){},
													leftHidden:true
												  },{width:65,label:'上传',name:'iconUuid'});
		var uploadCol = new Colbar({cols:[],align:'center'},{width:120});	
		uploadCol.addItem(upload);
		var row1 = new Rowbar({rows:[]},{width:120,height:165});	
		var row2 = new Rowbar({rows:[]},{width:'max',height:165});
		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:40});
		var cbxColbar = new Colbar({cols:[],align:'left'},{width:'max',height:36});
		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:100});
		var firstCol = new Colbar({cols:[],align:'left'},{width:'max',height:165});
		var text = new Gframe.controls.TextField({textAlign:'left',name:'name',onclick:clearTxt,leftHidden:true,width:'max',value:'编辑姓名'});
		
		var group = new Gframe.controls.RadioGroup({name:'sex'},{width:100,height:33});
		var radio;

		radio1 = new Gframe.controls.Radio({displayValue:'男',value:'M',checked:true},{cursor:'pointer',width:'max'});
		radio2 = new Gframe.controls.Radio({displayValue:'女',value:'W'},{cursor:'pointer',width:'max'});
		group.addItem(radio1);
		group.addItem(radio2);
		
		//创建ckxGroup
		var ckxgroup = new Gframe.controls.CheckBoxGroup({items:[],name:'groupUuids'},{width:'max'});
		//首先获取所有不相同的组
		var grs = me.getAllDifGroup(data);
	
		for(var i=0;i<grs.length;i++){
			var bcx = new Gframe.controls.CheckBox({displayValue:grs[i],value:grs[i],checked:true},{width:120,cursor:'pointer'});
			ckxgroup.addItem(bcx);
		};
		cbxColbar.addItem(ckxgroup);
		
		var textarea = new Gframe.controls.TextArea({width:'max',height:100,name:'remark',text:'请输入备注信息'});
		col1.addItem(text);
		col1.addItem(new Blank({width:13}));
		col1.addItem(group);
		//修改生日
		var comboBirthday = me.getComboxData('birthday',data);//生日
		var combox5 = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:comboBirthday,name:'birthday'},{width:'max'});
		var label5 =  new Gframe.controls.Label({top:5,textAlign:'right',textCls:'title_font',width:60,value:'生日：'});
		col1.addItem(label5);
		col1.addItem(new Blank({width:5}));
		col1.addItem(combox5);
		col1.addItem(new Blank({width:10}));
		col2.addItem(textarea);
		
		row1.addItem(image);
		row1.addItem(uploadCol);
		row2.addItem(col1);
		row2.addItem(col2);
		row2.addItem(cbxColbar);
		
		firstCol.addItem(new Blank({width:20}));
		firstCol.addItem(row1);
		firstCol.addItem(new Blank({width:2}));
		firstCol.addItem(row2);
		firstCol.addItem(new Blank({width:20}));
		firstCol.set('id', '_firstCol_'+util.id());
		
		//行标校准
		if(index>5){
			index = 5;
		}
		form.addItem(index,firstCol);	
		form.update();
		
		textarea.setValue(data[0].remark);
		text.setValue(data[0].name);
		//image.setImgUrl(hurl);
		upload.setValue(data[0].iconUuid);
		
		index++;
		//创建基本信息
		//me.createBasicInfo(data);
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
		//创建基本信息的标签
		me.createBasicInfo(data);
	}
	
		//创建基本信息
	this.createBasicInfo = function(data){
		var comboCompany = me.getComboxData('company',data);//公司
	
		var comboOrganization = me.getComboxData('organization',data);//部门
		var comboPost = me.getComboxData('post',data);//职务
		var comboPosition = me.getComboxData('position',data);//职级
	
		var comboSysAccount = me.getComboxData('sysAccount',data);//生日
		
		var form = me.mod.main.get('mergePersonInfo_id');
		var col1 = new Colbar({cols:[],align:'left'},{width:'max',height:33}); 
		var col2 = new Colbar({cols:[],align:'left'},{width:'max',height:33}); 
		var col3 = new Colbar({cols:[],align:'left'},{width:'max',height:33}); 
		var colTitle = new Colbar({cols:[],align:'left'},{width:'max',height:18}); 
		var secondRowbar = new Rowbar({rows:[]},{width:'max',height:150});
		
		var label1 =  new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:80,value:'单位：'});
	
		var label2 =  new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:80,value:'部门：'});
	
		var label3 =  new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:80,value:'职务：'});
	
		var label4 =  new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:80,value:'其他：'});
		
		
		
		var label6 =  new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:80,value:'系统账号：'});
		
		
		var combox1 = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:comboCompany,name:'company'},{width:'max'});
		var combox2 = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:comboOrganization,name:'organization'},{width:'max'});
		var combox3 = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:comboPost,name:'post'},{width:'max'});
		var combox4 = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:comboPosition,name:'position'},{width:'max'});
		//var combox5 = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:comboBirthday,name:'birthday'},{width:'max'});
		var combox6 = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:comboSysAccount,name:'sysAccount'},{width:'max'});
		
		
		col1.addItem(new Blank({width:20}));
		col1.addItem(label1);
		col1.addItem(new Blank({width:5}));
		col1.addItem(combox1);
		col1.addItem(new Blank({width:50}));
		col1.addItem(label2);
		col1.addItem(new Blank({width:5}));
		col1.addItem(combox2);
		col1.addItem(new Blank({width:20}));
		
		col2.addItem(new Blank({width:20}));
		col2.addItem(label3);//80
		col2.addItem(new Blank({width:5}));
		col2.addItem(combox3);
		col2.addItem(new Blank({width:50}));
		col2.addItem(label4);
		col2.addItem(new Blank({width:5}));
		col2.addItem(combox4);
		col2.addItem(new Blank({width:20}));
		
		col3.addItem(new Blank({width:20}));
		col3.addItem(label6);
		col3.addItem(new Blank({width:5}));
		col3.addItem(combox6);
		col3.addItem(new Blank({width:50}));
		col3.addItem(new Blank({width:80}));
		col3.addItem(new Blank({width:5}));
		col3.addItem(new Blank({width:'max'}));
		col3.addItem(new Blank({width:20}));
		
		var titel = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',height:20,width:120,value:'基本信息'}); 
		colTitle.addItem(new Blank({width:20}));
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
		// //回填数据
		// text1.setValue(data.company);
		// text2.setValue(data.organization);
		// text3.setValue(data.post);
		// text4.setValue(data.position);
		// text5.setValue(data.birthday);
		// text6.setValue(data.sysAccount);
		//创建联系信息的标签
		me.createRelTitle(data);	
		//便于以后销毁
		allLines.push(secondRowbar);
	}
	
	this.createRelTitle = function(data){
		var form = me.mod.main.get('mergePersonInfo_id');
		var titleRowbar = new Rowbar({rows:[]},{width:'max',height:25});
		var colTitle = new Colbar({cols:[],align:'left'},{width:'max',height:18});
		var titel = new Gframe.controls.Label({textAlign:'left',textCls:'title_font',height:18,width:'max',value:'联系信息'}); 
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
		
		me.requestDataZidian(data);
	}
	
	
	//请求数据字典
	this.requestDataZidian = function(da){
		mc.send({
			service:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__requestShujuzidian.service,
			method:$sl.gmyContact_contactFolder_contactFolder_BuildnewPerson__requestShujuzidian.method,
			//params:{},
			success:function(response){
					var data = util.parseJson(response.responseText);
					if(data){
						//创建联系信息的动态增减行
						var zidianData = data;
						me.createActiveRelDetail(zidianData,da);
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
		me.createIntraEmail(mainDa);
		//创建电子邮箱的动态行，用对象存储组件，以便向后台提交数据
		me.initCreateEmail(zidianData,mainDa);
		//创建地址的动态行，用对象存储组件，以便向后台提交数据
		me.initCreateAddress(zidianData,mainDa);
		//创建其他信息
		//me.createOthersTitle(mainDa);
	}
	
	this.createIntraEmail = function(data){
		var emailComboData = [{key:'系统邮箱',value:''}];//phoneCombox的假数据
		var intraEmials = [];
		var ems = [];//去重
		for(var i=0;i<data.length;i++){
			if(data[i].intraEmail && !ems.contain(data[i].intraEmail)){//去重复的值
				ems.push(data[i].intraEmail);
				var obj = {key:data[i].intraEmail,value:data[i].intraEmail};
				intraEmials.push(obj);
			}
		}
		var intraEmailIndex = phoneIndex+faxLength+msgLength;
		var form = me.mod.main.get('mergePersonInfo_id');
		var emailCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var emaillabel =  new Gframe.controls.Label({textAlign:'right',textCls:'title_font',width:80,value:'电子邮箱：'});
		var emailText = new Gframe.controls.ComboBox({displayField:'key',displayValue:'value',data:intraEmials,name:'intraEmail'},{width:'max'});
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
		emailCol.addItem(new Blank({width:47}));
		form.addItem(intraEmailIndex,emailCol);
		index++;
		//msgLength++;//便于计算后面的动态index
		form.update();
		emailCombo.setEnabled(false);
		//便于以后销毁
		allLines.push(emailCol);
	}
	
	//用后台返回的数据初始化phone
	this.initCreatePhone = function(zidianData,mainDa){
		var phones = [];
		for(var i=0;i<mainDa.length;i++){
			var s = mainDa[i].phones;
			for(var j=0;j<s.length;j++){
				phones.push(s[j]);			
			}
		}
		var checks = [];
		if(phones.length){
			for(var i=0;i<phones.length;i++){
				var a = phones[i];
				if(!checks.contain(a.key+a.value)){
					me.createPhone(zidianData,phones[i]);
				}
				checks.push((a.key+a.value));
			};
		}else{
			me.createPhone(zidianData);
		}
	} 
	//用后台返回的数据初始化fax
	this.initCreateFax = function(zidianData,mainDa){
		var faxes = [];
		for(var i=0;i<mainDa.length;i++){
			var s = mainDa[i].faxes;
			for(var j=0;j<s.length;j++){
				faxes.push(s[j]);			
			}
		};
		var checks = [];
		if(faxes.length){
			for(var i=0;i<faxes.length;i++){
				var a = faxes[i];
				if(!checks.contain(a.key+a.value)){
					me.createFax(zidianData,faxes[i]);
				}
				checks.push((a.key+a.value));
			}
		}else{
			me.createFax(zidianData);
		}
	} 
	
	//用后台返回的数据初始化即时通讯
	this.initCreateMsg = function(zidianData,mainDa){
		var msgs = [];
		for(var i=0;i<mainDa.length;i++){
			var s = mainDa[i].messaginges;
			for(var j=0;j<s.length;j++){
				msgs.push(s[j]);			
			}
		};
		var checks = [];
		if(msgs.length){
			for(var i=0;i<msgs.length;i++){
				var a = msgs[i];
				if(!checks.contain(a.key+a.value)){
					me.createMsg(zidianData,msgs[i]);
				}
				checks.push((a.key+a.value));
			}
		}else{
			me.createMsg(zidianData);
		}
	} 
	//用后台返回的数据初始化email
	this.initCreateEmail = function(zidianData,mainDa){
		var emails = [];
		for(var i=0;i<mainDa.length;i++){
			var s = mainDa[i].emails;
			for(var j=0;j<s.length;j++){
				emails.push(s[j]);			
			}
		};
		var checks = [];
		if(emails.length){
			for(var i=0;i<emails.length;i++){
				var a = emails[i];
				if(!checks.contain(a.key+a.value)){
					me.createEmail(zidianData,emails[i]);
				}
				checks.push((a.key+a.value));
			}
		}else{
			me.createEmail(zidianData);
		}
	} 
	//用后台返回的数据初始化address
	this.initCreateAddress = function(zidianData,mainDa){
		var addresses = [];
		for(var i=0;i<mainDa.length;i++){
			var s = mainDa[i].addresses;
			for(var j=0;j<s.length;j++){
				addresses.push(s[j]);			
			}
		};
		var checks = [];
		if(addresses.length){
			for(var i=0;i<addresses.length;i++){
				var a = addresses[i];
				if(!checks.contain(a.key+a.value+a.code)){
					me.createAddress(zidianData,addresses[i]);					
				}
				checks.push((a.key+a.value+a.code));
			}
		}else{
			me.createAddress(zidianData);
		}
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
		
		var form = me.mod.main.get('mergePersonInfo_id');
		var phoneCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var labelphone =  new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:80,value:'电话：'});
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
			var bnObj = me.updateSumitData(self,phoneCol,allPhones,addBtn,deldanweiZhizilabel);
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
		var form = me.mod.main.get('mergePersonInfo_id');
		var faxCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var labelfax =  new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:80,value:'传真：'});
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
			var bnObj = me.updateSumitData(self,faxCol,allFaxs,addBtn,deldanweiZhizilabel);
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
		var form = me.mod.main.get('mergePersonInfo_id');
		var msgCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var msglabel =  new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:80,value:'即时通讯：'});
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
			var bnObj = me.updateSumitData(self,msgCol,allMsgs,addBtn,deldanweiZhizilabel);
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
		var form = me.mod.main.get('mergePersonInfo_id');
		var emailCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var emaillabel =  new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:80,value:'电子邮箱：'});
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
			var bnObj = me.updateSumitData(self,emailCol,allEmails,addBtn,deldanweiZhizilabel,'emailDefault',defaultLabel);
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
		//};
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
		var defaultLabel =  new Gframe.controls.Label({textAlign:'left',value:'',title:'设置默认邮箱',cursor : 'pointer',textCls:'notfinal_sign',height:25,width:15,handler:function(e,lal){
				if(!defTag){
					lal.setCls('finish_sign');
					defTag = true;
					emailObj['defaultPro'] = '1';
				}else{
					lal.setCls('notfinal_sign');
					defTag = null;
					emailObj['defaultPro'] = '0';
				}
		}});
		emailCol.addItem(defaultLabel);//5
		emailCol.addItem(new Blank({width:9}));
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
		var form = me.mod.main.get('mergePersonInfo_id');
		var addressCol = new Colbar({cols:[],align:'left'},{width:'max',height:33});
		var addresslabel =  new Gframe.controls.Label({textAlign:'left',textCls:'title_font',width:80,value:'地址：'});
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
		addressCol.addItem(new Blank({width:27}));
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
		var form = me.mod.main.get('mergePersonInfo_id');
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
		var form = me.mod.main.get('mergePersonInfo_id');
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
		txtArea.setValue(data[0].interest);
		index++;
		//便于以后销毁
		allLines.push(col);
	}
	
	
	/*****************************************类似工具方法*******************************************************************/
	//校验某一个uuid在联系人详情的数组中是否存在
	this.checkIsExist = function(arrayList,uuid){
		for(var i=0;i<arrayList.length;i++){
			var obj = arrayList[i];
			if(obj.uuid===uuid){
				return true;
			}
		};
	}
	
	//通过uuid，去获取数组中的某一个对象
	this.getObjByUuid = function(arrayList,uuid){
		for(var i=0;i<arrayList.length;i++){
			var obj = arrayList[i];
			if(obj.uuid===uuid){
				return obj;
			}
		};
	}
	
	//性别是否是一样的
	this.isSexSame = function(arrayList){
		for(var i=0;i<arrayList.length;i++){
			var obj = arrayList[i];
			var obj2 = arrayList[i+1];
			if(obj && obj2 && (obj.sex==obj2.sex)){
				return true;
			}
		};
	}
	
	//获取所有不相同的组
	this.getAllDifGroup = function(arrayList){
		var gs = [];
		for(var i=0;i<arrayList.length;i++){
			var obj = arrayList[i];
			if(util.isArray(obj.groups)){
				for(var j=0;j<obj.groups.length;j++){
					if(!gs.contain(obj.groups[j])){
						gs.push(obj.groups[j]);
					}
				};
			}
		};
		return gs;
	}
	
	//获取combox的静态数据
	this.getComboxData = function(proName,data){
		var arr = [];
		var temp = [];
		for(var i=0;i<data.length;i++){
			var obj = data[i];
			for(var p in obj){
				if(p===proName && !temp.contain(obj[p])){
					var objs = {};
					objs['value'] = obj[p];
					objs['key'] = obj[p];
					arr.push(objs);
					temp.push(obj[p]);
				}
			};
		};
		return arr;
	}
	
	//刷新form表单的数据(从某一行开始，该行以下的form都刷新)
	this.refreshFormFromIndex = function(formData){
		var form = me.mod.main.get('mergePersonInfo_id');	
		var childItems = form.getItems();
		var oldLength = childItems.length;
	
		var indexD = me.getItemFromArrayById(childItems,'_firstCol_');
//		var indexA = me.getItemFromArrayById(allLines,'_firstCol_');
	
		var alldelIds = [];
		for(var i=indexD;i<oldLength;i++){
			//汇总所有需要删除的Id
			if(childItems[i]){
				allLines.del(childItems[i]);
				alldelIds.push(childItems[i].get('id'));
			}
		};
		form.removeItemByIds(alldelIds);	
		form.update();
		//保持index行标同步
		var changeLength = oldLength-form.getItems().length;
		index = index - changeLength;
		//要重新使部分数据initialize初始化
		allPhones = [];
		allFaxs = [];allMsgs = [];
		allEmails = [];allAddress = [];
		phoneIndex = null;
		phoneLength = 0;
		faxLength = 0;
		msgLength = 0;
		emailLength = 0;
		addressLength = 0;
		//调用相应的方法，重新绘制表单
		me.createNextNameandImage(formData);
	}
	
	//查询数组中是否存在指定的元素，并且返回该元素的index
	this.getItemFromArrayById = function(arrayList,id){
		for(var i=0;i<arrayList.length;i++){
			var a = arrayList[i].get('id').startWith(id);
			if(a){
				return i;
			}else{
			
			}
		};	
	}
	
	/*****************************************类似工具方法*******************************************************************/
	
	/************************************************类似工具方法为了校验radio的点击方法***************************************************/
	
	this.getPhotoIcon = function(arrayList){
		var iconUUid = [];
		for(var i=0;i<arrayList.length;i++){
			if(arrayList[i].iconUuid){
				iconUUid.push(arrayList[i].iconUuid);
			}
		};
		if(iconUUid.length){
			return iconUUid[0];
		}
	}
	
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
	this.updateSumitData = function(comboS,mCol,allM,addBtn,deldanweiZhizilabel,emailDefaultTag,defaultLabel){
		var comboxK;
		var txtK;
		var retuObj = {};
		if(comboS.getValue()==='其他'){
			mCol.removeItems(5);
			msgText1 = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,width:'max'});
			mCol.addItem(msgText1);
			mCol.addItem(new Blank({width:5}));
			var btxt = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,width:'max'});
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
				mCol.addItem(new Blank({width:33}));
			};
			mCol.update();
			//考虑到数据的提交问题
			comboxK = msgText1;
			txtK = btxt;
			msgText1['flag'] = 'bySelf';//添加自定义的标识
		}else{
			mCol.removeItems(5);
			msgtxt2 = new Gframe.controls.TextField({textAlign:'left',leftHidden:true,width:'max'});
			mCol.addItem(msgtxt2);
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
