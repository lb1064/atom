new function(){
/***********************************田军通讯录start********************************************************/
	/*2.1.5.	获取通讯录列表
接口功能：获取右边通讯录列表
服务名：contact.bookAction
方法名：getChildrenByUuid
参数：
返回：
//参数
   {
service: contact.personAction
method:getChildrenByUuid
params: 
}
//后台返回格式
{
      path：:[{"name":"通讯录管理","uuid":"dea59067-6b95-463a-a885-266813cebe40"},*]
roles:['show',‘impower’]role:{show:true,
impower:true}
data:[
			{
				uuid : '标识' ,
				名称：name
备注：remark
类型   type  //1个人  2 组织  3团队
创建人：creator
创建时间：creatTime
role:{show:true,
impower:true}roles:['show',‘impower’]
			}			
		]}

	 * 
	 * 获取右边通讯录列表*/
	this.gcontact_contactTonXun_gcontactTonXun_defaultView = {
		service:'contact.bookAction',//contact.bookAction.getChildrenByUuid
		method:'getChildrenByUuid',
		params:{},
		result:{}  
	}
	
	this.tel={
		service:'testfavorite.favoriteAction',
		method:'getAllByUuid'
	}
	/*2.4.4.	获取单个联系人
接口功能：获取单个联系人
服务名：contact.personAction
方法名：viewPerson
参数：uuid
返回：
//参数
   {
     service: contact.personAction
  method:viewPerson
     params{
       uuid
}
//后台返回格式
{
uuid:'唯一标示'
path：
name:'姓名'
company:'单位'
organization:'部门'
position:'职位'
post:'职称'
email:'电子邮箱'
jid:'即时通讯'
qq:'QQ'
msn:'msn'
site:'网站'
businessMobile:'商务电话'
houseMobile:'住宅电话'
businessFax:'商务传真'
phone:'手机'
postCode:'邮编'
address:'详细地址'
remark:'备注'
signName:'签名'
signature:'便签'
iconuuid:'图标'
isSystemUser:  //是否系统用户  1系统  0非系统
	用：姓名，邮箱，手机
}	 * */
	
	this.gcontactNew_personTonXun_editPersonalDetaiInfo_defaultView = {
		service:'contact.personAction', //contact.personAction.viewPerson$_auuid.js
		method:'viewPerson',
		params:{},
		result:{}
	}
	/*2.4.21.	修改登录用户的密码
接口功能：修改用户密码
服务名：contact.personAction
方法名：updatePassword
参数：
返回：true
//参数
{
service:contact.personAction
     method: updatePassword
params:{
     oldPwd:  原来的密码(登录密码)
     newPwd:  新密码
     newPwd2: 确认新密码
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
*/
	this.gcontact_editpersonal_updateUusePasword = {
		service:'contact.personAction',//contact.personAction.updatePassword
		method:'updatePassword',
		params:{},
		result:{}
	}
	
	/*新增接口：*检验复制的路径是不是正确的/
	 * 
	 */
	this.gcontact_personTonXun_persongerenTonxunLu_checkCopycontactToHereNow = {
		service:'contact.groupAction',//contact.groupAction.copy
		method:'checkCopyMove',
		params:{},
		result:{}
	}
	
	/*	2.1.4.	查看通讯录详情
接口功能：查看通讯录详情
服务名：contact.bookAction
方法名：viewBook
参数：通讯录UUID
返回：通讯录UUID，名称，备注
//参数
{
service: contact.bookAction
     method: viewBook
     params:{
	 uuid:’要查看的通讯录的uuid’,
}
}
//后台返回格式：

{
	  uuid ‘通讯录uuid’
name ‘名称’,
type://类型
remark   ‘备注’

}


	查看通讯录详情
	*/
	this.gcontact_contactTonXun_gcontactTonXun_editContactLuforedit = {
		service:'contact.bookAction', //contact.bookAction.viewBook
		method:'viewBook',
		params:{},
		result:{}
	}
	/*2.3.2.	获取权限列表
//参数
{
	service:'contact.roleAction',
	method:'getPrivList',
	params : {
		uuid : '标识'  //为空的时候，获取管理根节点权限信息
	}
}
//后台返回格式：
data：[
{
	loginName: loginName,//用于删除
	 sssshowName:' showName',//用于显示
		roleType:'1允许 2拒绝  ;权限类型',
		path:'路径',
		roles:[‘show’,’impower’],//show可见、impower管理
		isDel:'true/false是否可以删除'
	},
	{}
]
*/
	this.gcontact_contactTonXun_gcontactTonXun_createAddContactQuanxianGrid = {
		service:'contact.roleAction',//contact.roleAction.getPrivList
		method:'getPrivList',
		params:{},
		result:{}
	}
	/*2.3.1.	通讯录授权
接口功能：授权
服务名：contact.roleAction
方法名setPolicy
参数：

返回：是否授权成功
//参数
{
service: contact.roleAction
         method: setPolicy
     params:{
		uuid : '资源标识',//当uuid为空的时候，直接给根“通讯录管理”授权
		members：[{
                  loginName:’登录名或者DN’//只有组的时候才是DN 
                  type：‘是否组’// 1用户   2组

}，*]
	     roleType:'1允许 2拒绝  ;权限类型',
roles:[‘show’,’impower’]  // ‘show’可用、’impower’管理 ,至于管理权限有哪些子权限，前台自己控制
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}

	 * 
	 * */
	this.gcontact_contactTonXun_gcontactTonXun_saveGivePersionToUser = {
		service:'contact.roleAction',//contact.roleAction.setPolicy
		method:'setPolicy',
		params:{},
		result:{}
	}
	/* 2.1.2.	新建通讯录
接口功能：新建通讯录
服务名：contact.bookAction
方法名：addBook
参数：通讯录名称，备注，类型
返回：是否增加成功
//参数
{
 service: contact.bookAction
     method: addBook
     params:{
name ‘名称’,
type  ：//1个人通讯录 2组织 3团队
remark   ‘备注’

}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}

	 * 
	 * */
	this.gcontact_contactTonXun_gcontactTonXun_quedingAddContact = {
		service:'contact.bookAction',//contact.bookAction.addBook
		method:'addBook',
		params:{},
		result:{}
	}
	/*	2.4.1.	添加联系人
接口功能：添加联系人
服务名：contact.personAction
方法名：saveOrUpdatePerson
参数：添加位置标识,姓名,性别，QQ,单位，部门，职位，职称，手机号，商务座机，住宅座机，即时通讯，网站，邮编，详细住址，邮箱，传真，签名，图标，便签,备注
返回：是否添加成功
//参数
   {
service: contact.personAction
         method: saveOrUpdatePerson
     params:{
		parentUuid：‘添加位置标识’
		uuid:'联系人标示'（添加时为空）
		name:'姓名'
		sex   //参照会员管理“男/女”
		company:'单位'
		organization:'部门'
		position:'职位'
		post:'职称'
		email:'电子邮箱'
		jid:'即时通讯'
		qq:'QQ'
		msn:'msn'
		site:'网站'
		businessMobile:'商务电话'
		houseMobile:'住宅电话'
		businessFax:'商务传真'
		phone:'手机'
		postCode:'邮编'
		address:'详细地址'
		remark:'备注'
		signName:'签名'
		signature:'便签'
		iconuuid:'图标'
		isSystemUser:  //是否系统用户  1系统  0非系统
						用：姓名，邮箱，手机
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
*/
	this.gcontact_personTonXun_buildNewPersonContact_savenewbuildPersonDeailInfo = {
		service:'contact.personAction',//contact.personAction.addPerson
		method:'addPerson',
		params:{},
		result:{}
	} 
	
	/*修改联系人*/
	this.gcontact_personTonXun_editPersonalDetaiInfo_updatePerson= {
		service:'contact.personAction',//contact.personAction.updatePerson.gjs
		method:'updatePerson',
		params:{},
		result:{}
	} 
	
	
	/*2.4.19.	导入联系人
接口功能：导入联系人
服务名：contact.personAction
方法名：importPerson
参数：%联系人%
返回：导入成功
//参数
   {
     service: contact.personAction
         method: importPerson
params:
nodeUuid: '节点uuid' ,
uuid：//文件UUID
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
	 * */
	this.gcontact_personTonXun_persongerenTonxunLu_queimportMy22333Contact = {
		service:'contact.bookAction',//contact.personAction.importPerson.gjs
		method:'importBook',
		params:{},
		result:{}
	}
	
	/*2.1.3.	编辑通讯录
接口功能：编辑通讯录
服务名：contact.bookAction
方法名：updateBook
参数：通讯录名称，备注，通讯录UUID
返回：是否修改成功
//参数
{
service: contact.bookAction
     method: updateBook
     params:{
     uuid ‘通讯录uuid’
name ‘名称’,
remark   ‘备注’
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
*/
	this.gcontact_contactTonXun_gcontactTonXun_savemyEditContactFolder = {
		service:'contact.bookAction',//contact.bookAction.updateBook
		method:'updateBook',
		params:{},
		result:{}
	}
	/*2.1.11.	删除通讯录
接口功能：删除通讯录
服务名：contact.bookAction
方法名：delBook
参数：分组UUID
返回：分组UUID，名称，备注
//参数
{
service: contact.bookAction
     method: delBook
params:{
uuids:[‘需要删除的uuid数组’]
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}


	 * */
	this.gcontact_contactTonXun_gcontactTonXun_delshanchuContactNow = {
		service:'contact.bookAction',//contact.bookAction.delBook
		method:'delBook',
		params:{},
		result:{}
	}
	/*2.1.10.	通讯录复制
接口功能：复制
服务名：contact.bookAction
方法名：copy
参数：源路径目标路径
返回：是否成功
//参数
{
service: contact.bookAction
method: copy
params:{
uuid：
}
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}

	 * 
	 * */
	this.gcontact_contactTonXun_gcontactTonXun_copyConactFolder = {
		service:'contact.bookAction',//contact.bookAction.copy
		method:'copy',
		params:{},
		result:{}
	}
	/*2.3.3.	删除权限
//参数
{
	service:'contact.roleAction',
	method:'delPriv',
	params : {
		nodeUuid : '当前节点UUID',
		loginName:' loginName ',//成员ID
roleType:'1允许 2拒绝  ;权限类型'
	}
}
//后台返回格式：
{
	success : true/false ,
	msg : '提示xxxxxxxx' 
 }

	 * */
	this.gcontact_contactTonXun_gcontactTonXun_delePurviewGridNow = {
		service:'contact.roleAction',//contact.roleAction.delPriv
		method:'delPriv',
		params:{},
		result:{}
	}
	/*/*2.1.6.	导出通讯录
接口功能：导出通讯录，系统是否支持2中方式导出，excel和cvs文件，前台选择文件类型
服务名： contact.bookAction
方法名：exportBook
参数：uuid，导出文件类型
返回：true/false，文件UUID
//参数
   {
        service: contact.bookAction
         method: exportBook
         params:
			uuid: '标识' ,
			type：//1 excel  2cvs文件
		}
//后台返回格式
{
     uuid：‘文件uuid’
	success : true/false ,
	msg : '提示xxxxxxxx' 

} */
	this.gcontact_contactTonXun_gcontactTonXun_expoContactFolder = {
		service:'contact.bookAction',//contact.bookAction.exportBook
		method:'exportBook',
		params:{},
		result:{}
	}
	
	/*2.2.7.	导出组
接口功能：导出组
服务名： contact.groupAction
方法名：exportGroup
参数：源路径目标路径
返回：是否成功
//参数
{
     service: contact.groupAction
     method: exportGroup
 params:{
uuid : 需要导出的组的uuid
type：//1 excel  2cvs文件
}
}
//后台返回格式
{
      uuid：‘文件uuid’
success : true/false ,
msg : '提示xxxxxxxx' 
}
	
	
	
	*/
	this.gcontact_contactTonXun_gcontactTonXun_expoContactFolder_exportGroup = {
		service:'contact.groupAction',//contact.groupAction.exportGroup
		method:'exportGroup',
		params:{},
		result:{}
	}
	
	/*2.4.3.	删除联系人(删除联系人和组)
接口功能：删除联系人
服务名：contact.personAction
方法名：delPerson
参数：uuids
返回：true
//参数
{
service:contact.personAction
     method: delete 
params:{
uuids:{[‘uuid’:23333333，‘type’:”1”]，*} //type:1个人 2 组织 
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}

	 * */
	this.gcontact_personTonXun_viewOrgContactDetailInfo_delINlkMan = {
		service:'contact.personAction',//contact.personAction.delete 
		method:'delete',
		params:{},
		result:{}
	}
	
	/*2.4.6.	获取右边某一个分组下的分组和联系人(如：个人通讯录列表,组织通讯录列表  新增字段 bookType)
接口功能：获取某一个分组下的所有分组和联系人（分页）
服务名：contact.personAction
方法名：getChildrenByUuid
参数：uuid
返回：
//参数
   {
     service: contact.personAction
  method:getChildrenByUuid
     params{
  uuid
}
}
//后台返回格式
{
      total：20
	      path：:[{"name":"通讯录管理		","uuid":"dea59067-6b95-463a-a885-266813cebe40"},*]
roles:['show',‘impower’]
   data:[
{
uuid : '标识' ,
名称：name  //当type为1的时候，
	存在职称的时候需要拼接
type:‘1/2’,//如果1表示人；2表示该数据是组创建人：
电子邮箱： email
即时通讯：  jid
手机：  phone
bookType: 1、标示个人   2、标示组织 3、标示团队 
备注：remark
roles:['show',‘impower’]
}			
]sss
}

	 * 
	 * */
	this.gcontact_personTonXun_persongerenTonxunLu_defaultView = {
		service:'contact.personAction',//contact.personAction.getChildrenByUuid.gjs
		method:'getChildrenByUuid',
		//contact.personAction.getChildrenByUuid$type_mybookuuid
		params:{},
		result:{}
	}	
	/*2.2.3.	查看分组详情
接口功能：查看分组详情
服务名：contact.groupAction
方法名：viewGroup
参数：分组UUID
返回：分组UUID，名称，备注
//参数
{
service: contact.groupAction
     method: viewGroup
     params:{
	uuid:’要查看的分组的uuid’,
}
}
//后台返回格式：

{
	  uuid ‘分组uuid’
name‘名称’,
remark   ‘备注’

}

	 * */
	this.contact_personTonXun_persongerenTonxunLu_editPerosnDetailInfoforEdit = {
		service:'contact.groupAction',//contact.groupAction.viewGroup
		method:'viewGroup',
		params:{},
		result:{}
	}
	/*2.2.2.	编辑分组
接口功能：编辑分组
服务名：contact.groupAction
方法名：updateGroup
参数：分组名称，备注，分组UUID
返回：是否修改成功
{
     service: contact.groupAction
     method: updateGroup
     params:{
uuid ‘分组uuid’
name ‘名称’,
remark   ‘备注’
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}

	 * */
	this.contact_personTonXun_persongerenTonxunLu_quedingeditContact = {
		service:'contact.groupAction',//contact.groupAction.updateGroup
		method:'updateGroup',
		params:{},
		result:{}
	}
	/*2.2.6.	联系人和组复制
接口功能：复制
服务名：contact.groupAction
方法名：copy
参数：源路径目标路径
返回：是否成功
//参数
{
     service: contact.groupAction
     method: copy
 params:{
 uuids：[{
    uuid：‘’
type:‘1/2’,//如果1表示人；2表示该数据是组
}],
toUuid ‘目标uuid’
}
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}

	 * */
	this.gcontact_personTonXun_persongerenTonxunLu_copycontactToHereNow = {
		service:'contact.groupAction',//contact.groupAction.copy
		method:'copy',
		params:{},
		result:{}
	}
	
	/*2.2.5.	联系人和组移动
接口功能：移动
服务名：contact.groupAction
方法名：move
参数：源路径目标路径
返回：是否成功
//参数
{
     service: contact.groupAction
     method: move
     params:{
 uuids：[{
    uuid：‘’
type:‘1/2’,//如果1表示人；2表示该数据是组
}],
toUuid ‘目标uuid’
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}

	 * */
	
	this.gcontact_personTonXun_persongerenTonxunLu_movecontactToHereNow = {
		service:'contact.groupAction',//contact.groupAction.move
		method:'move',
		params:{},
		result:{}
	}
	/*	2.2.1.	新建分组
接口功能：新建分组
服务名：contact.groupAction
方法名：addGroup
参数：分组名称，备注
返回：是否增加成功
//参数
{
     service: contact.groupAction
     method: addGroup
     params:{
     parentUuid：//父节点UUDI
name ‘名称’,
remark   ‘备注’
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
*/
	this.gcontact_personTonXun_persongerenTonxunLu_createNewGroup = {
		service:'contact.groupAction',//contact.groupAction.addGroup
		method:'addGroup',
		params:{},
		result:{}
	}
	
	/*2.1.8.	导入查询（组织通讯录的导入列表）
接口功能：导入查询
服务名：contact.bookAction
方法名：importQuery
参数：uuid
返回：
//参数
   {
service: contact.bookAction
         method: importQuery
 params:
parentkeyUuid : '标识' ,
type：//1 LDAP  2其他系统
}
//后台返回格式
{
data:[
			{
				keyUuid : '标识' ,
name：
type:‘1/2’,//如果1表示人；2表示该数据是组：
电子邮箱： email
手机：  phone
备注：remark
			}			
		]}
}	 * */
	this.gcontact_contactTonXun_gcontactTonXun_hanlderNextStepForImportOrgBook = {
		service:'contact.bookAction',//contact.bookAction.importQuery
		method:'importQuery',
		params:{},
		result:{}
	}
	
	/*2.1.1.	获取左边通讯录下拉
接口功能：
服务名：contact.bookAction
方法名：getBooks
参数：
返回：
//参数
   {
     service: contact.bookAction
method:getBooks
params:
}
//后台返回格式
data:[
			 {
				uuid : '标识' ,
				名称：name
类型   type  //1个人  2 组织  3团队
			 }			
		]
	 * */
	this.gcontact_contactTonXun_gcontactTonXun_createContactPanel = {//获取下拉框中得联系人
		service:'contact.bookAction',//contact.bookAction.getBooks
		method:'getBooks',
		params:{},
		result:{}
	}
	
	/*2.4.5.	获取左边某一个通讯录下的所有分组和联系人
接口功能：获取某一个分组下的所有分组和联系人
服务名：contact.personAction
方法名：getChildrensByBook
参数：uuid，范围  //0所有  1邮件  2即时通讯  3系统  4手机  //1or2or3，1and2and3

返回：
//参数
   {
     service: contact.personAction
  method:getChildrensByBook
     params{
		uuid:
		scope:’’//范围,获取指定范围的用户和组
}
//后台返回格式
{
data:[
		 {//组数据
				uuid:'',
              path：‘’
				name:'groupName',//节点名称
				type:‘1/2’,//如果1表示人；2表示该数据是组
				isLeaf:true/false,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	 xtype：‘’//’group’’contact’
				children:[
					{%数据%},
				]
		},
		{%联系人数据%},
			...
 ]
}	 * */
	this.gcontact_contactTonXun_gcontactTonXun_createModuaal = {
		service:'contact.personAction',//contact.personAction.getChildrensByBook
		method:'getChildrensByBook',
		params:{},
		result:{}
	}
	
	/*2.4.11.	发送名片到目标联系人(接口已经被调用，但是有点问题)
接口功能：发送名片到目标联系人，发送到对方我的联系人
服务名：contact.personAction
方法名：sendCard
参数： uuids[](被选中发送联系人的uuid),toUuids[](目标联系人的uuid)
返回：是否发送成功
//参数
{
     service: contact.personAction
     method: sendCard
     params:{
uuids：[{
uuid：‘’
type:‘1/2’,//如果1表示人；2表示该数据是组
}],
toUuids：[{
    uuid：‘’
type:‘1/2’,//如果1表示人；2表示该数据是组
}],
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}

	 * */
	this.gcontactNewT_contactTonXun_gcontactTonXun_sendInfoCardInOrg = {
		service:'contact.personAction',//contact.personAction.sendCard
		method:'sendCard',
		params:{},
		result:{}
	}
	
	/*2.4.17.	判断是否为系统用户
接口功能：判断是否为系统用户
服务名：contact.personAction
方法名：checkSystemUser
参数：姓名，电子邮箱，手机
返回：是否为系统用户

//参数
   {
     service: contact.personAction
  method:checkSystemUser
     params:
name:'姓名'
email:'电子邮箱'
phone:'手机'

}
//后台返回格式
{
isSystemUser:  //是否系统用户  1系统  0非系统
}


	 * */
	this.gcontactNewT_personTonXun_buildNewPersonContact_diaoBackPaltToCheck = {
		service:'contact.personAction',//contact.personAction.checkSystemUser
		method:'checkSystemUser',
		params:{},
		result:{}
	}
	
	/*2.1.9.	针对导入查询导入（组织通讯录完成导入操作）
接口功能：针对导入查询导入
服务名：contact.bookAction
方法名：importBySystem
参数：uuid
返回：
//参数
   {
service: contact.bookAction
         method: import
 params:{
type：//1 LDAP  2其他系统
         bookUuid：
dataObject：[
	{
		keyUuid : '标识' ,
           name：
type:‘1/2’,//如果1表示人；2表示该数据是组创建人：
电子邮箱： email
手机：  phone
备注：remark

			}			
		]
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}

	 * */
	
	this.gcontact_contactTonXun_gcontactTonXun_finishImportOrgContact = {
		service:'contact.bookAction',//contact.bookAction.importBySystem
		method:'importBySystem',
		params:{},
		result:{}
	}
	
	/*1.1.	获取所有系统用户（左边）
接口功能：获取所有系统用户（左边）
服务名：ugManager.userGroupAction
方法名：listSysUser
参数：无
返回：
//参数
{
     service: ugManager.userGroupAction
     method: listSysUser
     params:{
}
}
//后台返回格式：
{
	data:[
{
loginName:’登录名或者DN’//只有组或者部门的时候才是DN ,对应ldap 的sAMAccountName
displayName:’’,对应ldap displayName
                  type：‘是否组’// 1用户   2组 3部门
isLeaf:true/false,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
 xtype：‘’//’group’’contact’
	children:[
					{%数据%},
		]
		}
	]
}

	 * */
	this.gcontactNewT_contactTonXun_gcontactTonXun_getAllUsers = {
		service:'userManager.treeAction',//userManager.treeAction.getUserTree
		method:'getUserTree',
		params:{},
		result:{}
	}
	
	/*获取常用联系人*/
	
	this.gcontact_personTonXun_persongerenTonxunLu_huoquOftenContactot = {
		service:'contact.personAction',//ugManager.userGroupAction.listSysUser
		method:'getRecentlyPerson',
		params:{},
		result:{}
	}
	//获取文件列头列表
	this.gcontact_personTonXun_persongerenTonxunLu_getExeclCols= {
		service:'contact.personAction',
		method:'getExeclCols',
		params:{},
		result:{}
	}
	//导入通讯录
	this.gcontact_personTonXun_persongerenTonxunLu_importOutLook={
		service:'contact.bookAction',
		method:'importOther',
		params:{},
		result:{}
	}
	//2.1.2.	获取我的通讯录组信息
	this.gcontact_personTonXun_persongerenTonxunLu_getMyBookGroups={
		service:'contact.personAction',
		method:'getMyBookGroups'
	}
	
	/*2.4.19.	导入联系人
接口功能：导入联系人
服务名：contact.personAction
方法名：importPerson
参数：%联系人%
返回：导入成功
//参数
   {
     service: contact.personAction
         method: importPerson
params:
nodeUuid: '节点uuid' ,
uuid：//文件UUID
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}	 * */
	
	this.gcontact_contactTonXun_gcontactTonXun_importPersonForGroup = {
		service:'contact.bookAction',
		method:'importBook'
	}
/**************************************田军通讯录end***************************************************************/
	
/**************************************V5.1.5 通讯录 个人，组织,行政三合一 start by tianjun***************************************************************/
	//获取左边的通讯录的树，type为1是个人，type为2是组织（行政），type为3是团队
	this.gmycontact_personContact_personContact_expandViewTreebar = {
		service:'myContact.myBookAction',//contact.bookAction.listContact.gjs
		method:'getChildrenBooks'
	}
	
	this.gcontact_personContact_personContact_getChildrenByuuid = {
		service:'contact.bookAction',//contact.bookAction.getChildrenByUuid.gjs
		method:'getChildrenByUuid'
	}
	//个人和团队中获取某一个分组下面的联系人
	this.gcontact_personContact_myPersonContact_getChildrenByuuid = {
		service:'myContact.myGroupAction',//myContact.myGroupAction.getChildrenByUuid.gjs
		method:'getChildrenByUuid'
	}
	
	
	this.gcontact_personContact_personContact_getAllperson = {
		service:'myContact.myGroupAction',//myContact.myGroupAction.getAllPerson.gjs
		method:'getAllPerson'
	}
	
	this.gcontact_personContact_personContact_getAllOrgContactBooks = {
		service:'contact.bookAction',//contact.bookAction.getBooks.gjs
		method:'getBooks'
	}
	
	this.gcontact_organizationContact_editContact_confirmUpdate = {
		service:'contact.bookAction',//contact.bookAction.addUpdateBook.gjs
		method:'addUpdateBook'
	}
	
	this.gcontact_organizationContact_editContact_serchContact = {
		service:'contact.bookAction',//contact.bookAction.search.gjs
		method:'search'
	}
	
	this.gcontact_organizationContact_editContact_serchBooks = {
		service:'contact.bookAction',//contact.bookAction.searchBook.gjs
		method:'searchBook'
	}
	
	this.gcontact_organizationContact_deleteContact = {
		service:'contact.bookAction',//contact.bookAction.delBook.gjs
		method:'delBook'
	}
	
	this.gcontact_organizationContact_getPrivList = {
		service:'contact.roleAction',//contact.roleAction.getPrivList.gjs
		method:'getPrivList'
	}
	
	this.gcontact_organizationContact_deletePriv = {
		service:'contact.roleAction',//contact.roleAction.delPriv.gjs
		method:'delPriv'
	}
	
	this.gcontact_organizationContact_addPrivew = {
		service:'contact.roleAction',//contact.roleAction.savePriv.gjs
		method:'savePriv'
	}
	
	this.gcontact_organizationContact_buildAndEditGroup = {
		service:'contact.groupAction',//contact.groupAction.addUpdateGroup.gjs
		method:'addUpdateGroup'
	}
	
	this.gcontact_organizationContact_buildAndEditPerson = {
		service:'contact.personAction',//contact.personAction.saveOrUpdatePerson.gjs
		method:'saveOrUpdatePerson'
	}
	
	this.gcontact_organizationContact_setSortData = {
		service:'contact.personAction',//contact.personAction.sort.gjs
		method:'sort'
	}
	
	this.gcontact_organizationContact_viewPersonInfo = {
		service:'contact.personAction',//contact.personAction.viewPerson.gjs
		method:'viewPerson'
	}
	
	this.gcontact_organizationContact_moveGroupAndPerson = {
		service:'contact.personAction',//contact.personAction.move.gjs
		method:'move'
	}
	
	
	this.gcontact_organizationContact_copyGroupAndPerson = {
		service:'contact.personAction',//contact.personAction.copy.gjs
		method:'copy'
	}
	
	
	this.gcontact_organizationContact_deleteGroup = {
		service:'contact.groupAction',//contact.groupAction.delGroup.gjs
		method:'delGroup'
	}
	
	
	this.gcontact_organizationContact_createTeam = {
		service:'contact.teamAction',//contact.teamAction.addTeam.gjs
		method:'addTeam'
	}
	
	this.gcontact_organizationContact_addNewTeam = {
		service:'contact.teamAction',//contact.teamAction.addOrEditTeam.gjs
		method:'addOrEditTeam'
	}
	//新增的接口
	this.gcontact_organizationContact_getAllMyteamS = {
		service:'contact.teamAction',//contact.teamAction.getAllMyContactTeams.gjs
		method:'getAllMyContactTeams'
	}
	
	
	//修改团度
	this.gcontact_organizationContact_getAllMyteamS = {
		service:'contact.teamAction',//contact.teamAction.getAllMyContactTeams.gjs
		method:'getAllMyContactTeams'
	}
	
	//删除团队,退出团队
	this.gcontact_organizationContact_delteMyTeam = {
		service:'contact.teamAction',//contact.teamAction.delTeam.gjs
		method:'delTeam'
	}
	
	
	//通讯录的全文搜索
	this.gcontact_organizationContact_serchPersonInAllContacts = {
		service:'contact.bookAction',//contact.bookAction.searchPerson.gjs
		method:'searchPerson'
	}
	
	//删除团队的联系人
	this.gcontact_organizationContact_delTeamPerson = {
		service:'contact.teamAction',//contact.teamAction.delTeamPerson.gjs
		method:'delTeamPerson'
	}
	
	
	//联系人的排序
	this.gcontact_organizationContact_setSortForPerson = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.sort.gjs
		method:'sort'
	}
	
	//获取名片消息推的内容
	this.gcontact_personContact_contactFolder_viewPersonCard = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.getCardContent.gjs
		method:'getCardContent'
	}
	
	//选择导入的文件
	this.gcontact_personContact_contactFolder_getAllFileForImport = {
		service:'myContact.myGroupAction',//myContact.myGroupAction.getMyContactBackUp.gjs
		method:'getMyContactBackUp'
	}
	
	
	//生成通讯录
	this.gcontact_personContact_contactFolder_createContactFromDept = {
		service:'contact.bookAction',//contact.bookAction.creatAdminContact.gjs
		method:'creatAdminContact'
	}
	
	
	this.gdocCenter_personalAndOrgFolder_personAndOrgFolder_getGcrSystemUsers = {
		service:'userManager.treeAction',//userManager.treeAction.getAuthObjTree.gjs
		method:'getAuthObjTree'
	}
	
	
	//发送名片
	this.gdocCenter_personalAndOrgFolder_personAndOrgFolder_getSendCardUserSelectTree = {
		service:'userManager.treeAction',//userManager.treeAction.getAuthObjTree.gjs
		method:'getUserTree'
	}


//    关于组织通讯录联系人导入接口说明：
//编号：组织通讯录中联系人导入
//    C:\nginx\html\modules\gcontact\organizationContact\newEditContact.js
    this.gcontact_organizationContact_newEditContact_EditContact = {
        service:'contact.bookAction',
        method:'importOrgContact'
    }


//    组织通讯录中联系人导入模板
    this.gcontact_organizationContact_newEditContact_downImport = {
        service:'contact.bookAction',
        method:'getContactModleUuid'
    }
	
	/*
 * 接收名片列表

接口功能：获取接收到名表
服务名：myContact.myPersonAction
方法名：acceptCardList
参数：uuid
返回：
//参数
   {
     service: myContact.myPersonAction
         method: acceptCardList
     params{
            uuid
}
//后台返回格式
{
      uuid:’要查看的分组的uuid’
sendPerson ‘发送人’,
sendTime   ‘发送时间’

}
 */
	this.gmyContact_contactFolder_contactFolder_recvCards__defaultView  = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.acceptCardList.gjs
		method:'acceptCardList',
		params:{},
		result:{}  
	}
	
/**************************************V5.1.5 通讯录 个人，组织,行政三合一 end by tianjun***************************************************************/
	this.gmyContact_contactFolder_contactFolder_recvCards__defaultView  = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.acceptCardList.gjs
		method:'acceptCardList',
		params:{},
		result:{}  
	}
	
/*
 * 获取联系信息的数据字典
接口功能：新建分组
服务名：myContact. myPersonAction
方法名：getContactDicInfos
参数： 
返回：字典信息
//参数
{
     service: myContact. myPersonAction
     method: getContactDicInfos
     params:{
}
}
//后台返回格式
{
phones：[String数组] 
faxes：[String数组] 

messaginges：[String数组] 

emails：[String数组] 
addresses：[String数组]

}
 */
	this.gmyContact_contactFolder_contactFolder_BuildnewPerson__requestShujuzidian  = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.getContactDicInfos.gjs
		method:'getContactDicInfos',
		params:{},
		result:{}  
	}
 	
/*
 * 添加联系人
接口功能：添加联系人
服务名：myContact.myPersonAction
方法名：saveOrUpdatePerson
参数：添加位置标识,姓名,性别,备注，单位，职级，生日，部门，职务，系统账号，电话，传真，即时通讯，电子邮箱，住址，兴趣爱好
返回：是否添加成功
//参数
   {
     service: myContact.myPersonAction
     method: saveOrUpdatePerson
     params:{
		groups：‘分组ID’
		uuid： 唯一标示
      name：姓名
      sex   性别//参照会员管理  “男/女” 
      remark  备注
      iconuuid  图标
      company  单位
      organization  部门
      position  职级 
      post  职务
      birthday  生日
      sysAccount  系统账号     
        phones 电话
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      faxes 传真 
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      messaginges  即时通讯
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      emails 邮件地址
[{key：’类型（中文）’ ，value ：’值’,isDefault'},{ key：’类型’ ，value ：’值’ ,isDefault'}]   0: 否 ，1：是
      addresses  地址
[{key：’类型（中文）’ ，value ：’值’，code '},{ key：’类型’ ，value ：’值’, code }]

      interest  兴趣爱好
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
 */
	this.gmyContact_contactFolder_contactFolder_BuildnewPerson__submitNewInfo  = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.saveOrUpdatePerson.gjs
		method:'saveOrUpdatePerson',
		params:{},
		result:{}  
	}

/*
 * 名片另存为

接口功能：接到的名片另存在目标组下
服务名：myContact.myPersonAction
方法名：saveAsCard
参数：源路径 目标路径
返回：是否成功
   {
     service: myContact.myPersonAction
         method: saveAsCard
     params:{
 uuids：[
    uuid：‘名片uuid’
     toUuid ‘目标组 uuid’
], 
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
 */
	this.gmyContact_contactFolder_contactFolder_BuildnewPerson__saveCardToOtherPlace  = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.saveAsCard.gjs
		method:'saveAsCard',
		params:{},
		result:{}  
	}

/*
 * 接收名片查看详细

接口功能：根据组uuid 查看下面的具体名片
服务名：myContact.myPersonAction
方法名：acceptCardView
参数：uuid
返回：
//参数
   {
     service: myContact.myPersonAction
         method: acceptCardView
     params{
            uuid:”根据组uuid 查看下面的具体名片”
}
//后台返回格式
{
      uuid:’具体名片的uuid’
}
 */
	this.gmyContact_contactFolder_showCardDatail_viewCardDetailInfo = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.acceptCardView.gjs
		method:'acceptCardView',
		params:{},
		result:{}  
	}

/*
 * 名片拒绝

接口功能：拒绝接收X人发送的名片，直接删除列下UUID
服务名：myContact.myPersonAction
方法名：refuseCard
参数：uuid
返回：
//参数
   {
     service: myContact.myPersonAction
         method: refuseCard
     params{
            uuid:”名片uuid”
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
 */
	this.gmyContact_contactFolder_showCardDatail_refuseCardServ = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.refuseCard.gjs
		method:'refuseCard',
		params:{},
		result:{}  
	},

/*
 * 获取单个联系人
接口功能：获取单个联系人
服务名：myContact.myPersonAction
方法名：viewPerson
参数：uuid
返回：
//参数
   {
     service: myContact.myPersonAction
         method: viewPerson
     params{
       uuid
}
//后台返回格式
{
       groups：‘添加位置标识’
		uuid： 唯一标示
      name：姓名
      sex   性别//参照会员管理  “男/女” 
      remark  备注
      iconuuid  图标
      company  单位
      organization  部门
      position  职级
      post  职务
      birthday  生日
      sysAccount  系统账号
        phones 电话
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      faxes 传真 
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      messaginges  即时通讯
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      emails 邮件地址
[{key：’类型（中文）’ ，value ：’值’,isDefault'},{ key：’类型’ ，value ：’值’ ,isDefault'}]   0: 否 ，1：是
      addresses  地址
[{key：’类型（中文）’ ，value ：’值’，code '},{ key：’类型’ ，value ：’值’, code }]
    interest  兴趣爱好
}
 */
	this.gmyContact_relativeOpen_viewRelative = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.viewPerson.gjs
		method:'viewPerson',
		params:{},
		result:{}  
	}

/*
 * 1获取合并联系人
接口功能：获取所有要合并的联系人的接口
服务名：mycontact.myPersonAction
方法名：getCombinePersonList
参数：添加位置标识,姓名,性别,备注，单位，职级，生日，部门，职务，系统账号，电话，传真，即时通讯，电子邮箱，住址，兴趣爱好
返回： 
//参数
{
service: mycontact.myPersonAction
     method: getCombinePersonList
  params:
}
//后台返回格式
{
   //1、
		data:[
			{
				uuids:[uuids数组]
			},
			
			........
		]
}
 */
	this.gmyContact_relativeOpen_mergePerson_getAllMergerPesonList = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.getCombinePersonList.gjs
		method:'getCombinePersonList',
		params:{},
		result:{}  
	}
	
/*
 * 获取需要合并联系人每组详情信息
接口功能：获取需要合并联系人每组详情信息
服务名：mycontact.myPersonAction
方法名：getCombinePersonInfo
参数：添加位置标识,姓名,性别,备注，单位，职级，生日，部门，职务，系统账号，电话，传真，即时通讯，电子邮箱，住址，兴趣爱好
返回： 
//参数
{
service: mycontact.myPersonAction
     method: getCombinePersonInfo
  params:
}
//后台返回格式
{
  data : [
		groups：‘添加位置标识’
		uuid： 唯一标示
      name：姓名
      sex   性别//参照会员管理  “男/女” 
      remark  备注
      iconuuid  图标
      company  单位
      organization  部门
      position  职级
      post  职务
      birthday  生日
      sysAccount  系统账号
        phones 电话
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      faxes 传真 
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      messaginges  即时通讯
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      emails 邮件地址
[{key：’类型（中文）’ ，value ：’值’,isDefault'},{ key：’类型’ ，value ：’值’ ,isDefault'}]   0: 否 ，1：是
      addresses  地址
[{key：’类型（中文）’ ，value ：’值’，code '},{ key：’类型’ ，value ：’值’, code }]
    interest  兴趣爱好
	]	
}
 */
	this.gmyContact_relativeOpen_mergePerson_getMergePeopleDetailInfo = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.getCombinePersonInfo.gjs
		method:'getCombinePersonInfo',
		params:{},
		result:{}  
	}

/*
 *  合并联系人
接口功能：合并联系人
服务名：myContact.myPersonAction
方法名：combinePerson
参数：添加位置标识,姓名,性别,备注，单位，职级，生日，部门，职务，系统账号，电话，传真，即时通讯，电子邮箱，住址，兴趣爱好
返回： 
//参数
{
service: myContact.myPersonAction
     method: getMyBookGroups
     params:{
            groupUuids:组名
		uuid:[uuids]： 唯一标示
      name：姓名
      sex   性别//参照会员管理  “男/女” 
      remark  备注
      iconuuid  图标
      company  单位
      organization  部门
      position  职级
      post  职务
      birthday  生日
      sysAccount  系统账号(系统账号，0表示否，1表示是)
          phones 电话
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      faxes 传真 
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      messaginges  即时通讯
[{key：’类型（中文）’ ，value ：’值’'},{ key：’类型’ ，value ：’值’}]
      emails 邮件地址
[{key：’类型（中文）’ ，value ：’值’,isDefault'},{ key：’类型’ ，value ：’值’ ,isDefault'}]   0: 否 ，1：是
      addresses  地址
[{key：’类型（中文）’ ，value ：’值’，code '},{ key：’类型’ ，value ：’值’, code }]
      interest  兴趣爱好
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
 */
	this.gmyContact_relativeOpen_mergePerson_mergePersonFunc = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.combinePerson.gjs
		method:'combinePerson',
		params:{},
		result:{}  
	}
	
/*3.2.1.1	高级搜索结果增加到Ｘ分组下
接口功能：将高级搜素的结果添加到个人通讯录的某个分组的下面
服务名：myContact.myPersonAction
方法名：move
参数：源路径 目标路径
返回：是否成功
//参数
{
     service: myContact.myPersonAction
     method: move
     params:{
 uuids：[
 　　　　   uuid：‘搜索出来的联系人ＵＵＩＤ’
],
toUuid ‘目标uuid’
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
*/
	this.gmyContact_relativeOpen_mergePerson_addPerosnToConFromOrg = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.move.gjs
		method:'move',
		params:{},
		result:{}  
	}
	/*
 * 获取我的通讯录分组（只有分组信息）
接口功能：查看通讯录详情
服务名：mycontact.myPersonAction
方法名：getMyBookGroups
参数：
返回： 
//参数
{
service: mycontact.myPersonAction
     method: getMyBookGroups
     params:
}
//后台返回格式：
[{
   text:’组名’
   value:’ 组uuid’
}] 
 */
	this.gmyContact_contactFolder_contactMain_getAllGroupsInfo  = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.getMyBookGroups.gjs
		method:'getMyBookGroups',
		params:{},
		result:{}  
	}
	/*
 * 3.2.1新建分组
接口功能：新建分组
服务名：myContact.myGroupAction
方法名：addGroup
参数：分组名称，备注
返回：是否增加成功
//参数
{
     service: myContact.myGroupAction
     method: addGroup
     params:{
name ‘名称’,
remark   ‘备注’
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
 */
	this.gmyContact_contactFolder_contactMain_quedingAddnewBuildGroup  = {
		service:'myContact.myGroupAction',//myContact.myGroupAction.addGroup.gjs
		method:'addGroup',
		params:{},
		result:{}  
	}
/*
 * 获取我的通讯录分组（只有分组信息）
接口功能：查看通讯录详情
服务名：mycontact.myPersonAction
方法名：getMyBookGroups
参数：
返回： 
//参数
{
service: mycontact.myPersonAction
     method: getMyBookGroups
     params:
}
//后台返回格式：
[{
   text:’组名’
   value:’ 组uuid’
}] 
 */
	this.gmyContact_contactFolder_contactMain_getAllGroupsInfo  = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.getMyBookGroups.gjs
		method:'getMyBookGroups',
		params:{},
		result:{}  
	}
	
	/*
 * 获取系统联系人字段接口
接口功能：
服务名：myContact.myGroupAction
方法名：getSystemHeads
参数：
返回： 
//参数
   {
     service: myContact.myGroupAction
         method: getSystemHeads
 params: {
           }
}
//后台返回格式
{
      
 data:[
       {key}		
   ]
}
 */
	this.gmyContact_contactFolder_contactFolder_reflectPage_getSysFolders  = {
		service:'myContact.myGroupAction',//myContact.myGroupAction.getSystemHeads.gjs
		method:'getSystemHeads',
		params:{},
		result:{}  
	}
	/*
 * 外部文件表头查询
接口功能：
服务名：myContact.myGroupAction
方法名：getTableHeads
参数：uuid
返回： 
//参数
   {
     service: myContact.myGroupAction
         method: getTableHeads
 params: {
            uuid：文件的uuid
}
}
//后台返回格式
{
mailInfo：[
	{key:'',default:''},
	{key:'',default:''},
]（主要信息）
      
otherInfo：[
	{key:'',default:''},
	{key:'',default:''},
] （详细信息，除去主要信息外的其他信息）
}
 */	
 	this.gmyContact_contactFolder_contactFolder_reflectPage_defaultView  = {
		service:'myContact.myGroupAction',//myContact.myGroupAction.getTableHeads.gjs
		method:'getTableHeads',
		params:{},
		result:{}  
	}
	
	/*
 * 导入提交接口
接口功能：
服务名：myContact.myGroupAction
方法名：phaseHeads
参数：uuid
返回： 
//参数
   {
     service: myContact.myGroupAction
         method: phaseHeads
 params: {
  key1：value1，
	key2：value2，
	。。。。（key表示导入的表头，value表示系统的字段名）
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 

}
 */
	this.gmyContact_contactFolder_contactFolder_reflectPage_phraseHeader  = {
		service:'myContact.myGroupAction',//myContact.myGroupAction.phaseHeads.gjs
		method:'phaseHeads',
		params:{},
		result:{}  
	}
	
	/*
 * 导出组
接口功能：导出组
服务名： myContact.myGroupAction
方法名：exportGroup
参数：文件类型 目标路径 存储路径
返回：是否成功 
//参数
{
     service: myContact.myGroupAction
     method: exportGroup
  params:{
 uuids :[{uuid:’,type:’’}] 需要导出组的uuid
type：//1 excel  2cvs文件 3zip文件
export //1文档中心 2本地
stored //存储到
 }
}
//后台返回格式
{
          success : true/false ,
      msg : '提示xxxxxxxx' 
}
 */
	this.gmyContact_contactFolder_contactMain_exportGroup  = {
		service:'myContact.myGroupAction',//myContact.myGroupAction.exportGroup.gjs
		method:'exportGroup',
		params:{},
		result:{}  
	}
//导入到我的网盘	
	this.gmyContact_contactFolder_contactMain_exportForGroup  = {
			service:'myContact.myGroupAction',//myContact.myGroupAction.exportGroup.gjs
			method:'exportForGroup',
			params:{},
			result:{}  
		}
	/*联系人复制
接口功能：复制
服务名：myContact.myPersonAction
方法名：copy
参数：源路径 目标路径
返回：是否成功 
//参数
{
     service: myContact.myPersonAction
     method: copy
  params:{
 uuids：[
    uuid：‘’
],
toUuid ‘目标uuid’
}
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
 * 
 */
	this.gmyContact_contactFolder_groupPerson_copyToHere  = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.copy.gjs
		method:'copy',
		params:{},
		result:{}  
	}
	
	/*
 * 联系人移动 
接口功能：移动
服务名：myContact.myPersonAction
方法名：move
参数：源路径 目标路径
返回：是否成功
//参数
{
     service: myContact.myPersonAction
     method: move
     params:{
 uuids：[
    uuid：‘’
],
toUuid ‘目标uuid’
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}

 */
	this.gmyContact_contactFolder_groupPerson_moveToHere  = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.move.gjs
		method:'move',
		params:{},
		result:{}  
	}
	/*
 * 删除联系人
接口功能：删除联系人
服务名：myContact.myPersonAction
方法名：delPerson
参数： uuids
返回： true
//参数
{
     service: myContact.myPersonAction
     method: delPerson
    params:{
uuids:[‘需要删除的uuid数组’]
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
 */
	this.gmyContact_contactFolder_groupPerson_delPeople  = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.delPerson.gjs
		method:'delPerson',
		params:{},
		result:{}  
	}
	
	/*发送名片到目标联系人
接口功能：发送名片到目标联系人，发送到对方我的联系人
服务名：myContact.myPersonAction
方法名：sendCard
参数： uuids[](被选中发送联系人的uuid),toUuids[](目标联系人的uuid)
返回：是否发送成功
（获取系统用户树）
//参数
{
     service: myContact.myPersonAction
     method: sendCard
     params:{
uuids：[{
uuid：‘’
type:‘1/2’,//如果1表示人；2表示该数据是组
}],
toUuids：[{
    uuid：‘’
type:‘1/2’,//如果1表示人；2表示该数据是组
}],
}
 */
	this.gmyContact_contactFolder_contactMain_sendCard  = {
		service:'myContact.myPersonAction',//myContact.myPersonAction.sendCard.gjs
		method:'sendCard',
		params:{},
		result:{}  
	}
	
	/*
 * 编辑分组
接口功能：编辑分组
服务名：myContact.myGroupAction
方法名：updateGroup
参数：分组名称，备注，分组UUID
返回：是否修改成功
{
     service: myContact.myGroupAction
     method: updateGroup
     params:{
uuid ‘分组uuid’
name ‘名称’,
remark   ‘备注’
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}
 */
	this.gmyContact_contactFolder_groupPerson_editGroupInfo  = {
		service:'myContact.myGroupAction',//myContact.myGroupAction.updateGroup.gjs
		method:'updateGroup',
		params:{},
		result:{}  
	}
	
	/*
 * 3.2.4删除分组
接口功能：删除分组
服务名：myContact.myGroupAction
方法名：delGroup
参数： 分组UUID
返回： 分组UUID
//参数
{
     service: myContact.myGroupAction
     method: delGroup
    params:{
uuids:[‘需要删除的uuid数组’]
}
}
//后台返回格式
{
success : true/false ,
msg : '提示xxxxxxxx' 
}

 */
	this.gmyContact_contactFolder_contactMain_delGroups  = {
		service:'myContact.myGroupAction',//myContact.myGroupAction.delGroup.gjs
		method:'delGroup',
		params:{},
		result:{}  
	}
	//下载导入模版
	this.gmyContact_personContact_contactFolder_importPerson_getContactModleUuid  = {
		service:'myContact.myBookAction',//myContact.myBookAction.getContactModleUuid.gjs
		method:'getContactModleUuid',
		params:{},
		result:{}  
	}
};