new (function(){
	/*
	 * 2.1用户管理树查询
	 */
	this.guserManager_userGroups_userManagerMain_getAllTree = {
		service : 'userManager.treeAction',//userManager.treeAction.getUserMngTree.gjs
		method : 'getUserMngTree'
	}
	/*
	 * 2.2.1用户群组列表
	 */
	this.guserManager_userGroups_userManagerMain_getFirstLevelUserGroupList = {
		service : 'userManager.groupAction',
		method : 'getFirstLevelUserGroupList'
	}
	/*
	 * 2.2.3新增组
	 */
	this.guserManager_userGroups_addGroups_addUserGroup = {
		service : 'userManager.groupAction',
		method : 'addUserGroup'
	}
	/*
	 * 2.2.4编辑组
	 */
	this.guserManager_userGroups_editorGroups_modifyUserGroup = {
		service : 'userManager.groupAction',
		method : 'modifyUserGroup'
	}
	/*
	 * 2.2.5查看组详情
	 */
	this.guserManager_userGroups_editorGroups_getGroupInfo = {
		service : 'userManager.groupAction',
		method : 'getGroupInfo'
	}
	/*
	 * 2.2.6获取角色树
	 */
	this.guserManager_userGroups_addGroups_getRoleTree = {
		service : 'userManager.groupAction',
		method : 'getRoleTree'
	}
	/*
	 * 2.2.17移动到此
	 */
	this.guserManager_userGroups_userManagerMain_moveUserOrUserGroup = {
		service : 'userManager.groupAction',
		method : 'moveUserGroups'
	}
	/*
	 * 2.2.18删除
	 */
	this.guserManager_userGroups_userManagerMain_delUserOrUserGroup = {
		service : 'userManager.groupAction',
		method : 'delUserOrUserGroup'
	}
	/*
	 * 2.2.2组列表查询
	 */
	this.guserManager_userGroups_userGroups_getChildrenListByUserGroup = {
		service : 'userManager.groupAction',
		method : 'getChildrenListByUserGroup'
	}
	/*
	 * 2.2.2组列表查询
	 */
	this.guserManager_userGroups_userGroups_addUser = {
		service : 'userManager.userAction',
		method : 'addUser'
	}
	/*
	 * 2.2.8新增用户的登录名是否可用
	 */
	this.guserManager_userGroups_addPerson_checkUserName = {
		service : 'userManager.userAction',
		method : 'checkLoginName'
	}
	/*
	 *2.2.9编辑用户
	 */
	this.guserManager_userGroups_editorUser_modifyUser = {
		service : 'userManager.userAction',
		method : 'modifyUser'
	}
	/*
	 *2.2.10查看用户详情
	 */
	this.guserManager_userGroups_editorUser_getUserInfo = {
		service : 'userManager.userAction',
		method : 'getUserInfo'
	}
	/*
	 *2.2.14重置密码
	 */
	this.guserManager_userGroups_userGroups_resetUserPwd = {
		service : 'userManager.userAction',
		method : 'resetUserPwd'
	}
	/*
	 *2.2.14删除
	 */
	this.guserManager_userGroups_openGroupsGrid_delUserOrUserGroup = {
		service : 'userManager.groupAction',//userManager.groupAction.delUserGroups.gjs
		method : 'delUserGroups'
	}
	
	this.guserManager_userGroups_openGroupsGrid_delUsersByUuid = {
		service : 'userManager.userAction',//userManager.groupAction.delUsers.gjs
		method : 'delUsers'
	}
	/*
	 *2.2.17移动到此
	 */
	this.guserManager_userGroups_openGroupsGrid_moveUserOrUserGroup = {
		service : 'userManager.groupAction',
		method : 'moveUserOrUserGroup'
	}
	/*
	 *2.2.16复制到此
	 */
	this.guserManager_userGroups_openGroupsGrid_copyUserOrUserGroup = {
		service : 'userManager.groupAction',
		method : 'copyUserOrUserGroup'
	}
	/*
	 *2.2.15移出本组
	 */
	this.guserManager_userGroups_openGroupsGrid_removeUserFromGroup = {
		service : 'userManager.userAction',
		method : 'removeUserFromGroup'
	}
	/*
	 *2.2.11获取系统自动匹配绑定人员
	 */
	this.guserManager_userGroups_openGroupsGrid_getAuthMatchPersonList = {
		service : 'userManager.userAction',
		method : 'getAuthMatchPersonList'
	}
	/*
	 *2.2.12获取人员树
	 */
	this.guserManager_userGroups_bindUser_getPersonTree = {
		service : 'userManager.treeAction',
		method : 'getPersonTree'
	}
	/*
	 *2.2.12获取人员树
	 */
	this.guserManager_userGroups_bindUser_bindPerson = {
		service : 'userManager.userAction',
		method : 'bindPerson'
	}
	/*
	 *2.3.1部门分组列表
	 */
	this.guserManager_deptGroups_deptGroupsMain_getChildrenListByDept = {
		service : 'userManager.groupAction',
		method : 'getChildrenListByDept'
	}
	/*
	 *2.4.1角色列表查询
	 */
	this.guserManager_roles_roleList_getRoleList = {
		service : 'userManager.groupAction',
		method : 'getRoleList'
	}
	/*
	 *2.4.1角色列表查询
	 */
	this.guserManager_roles_addRole_addRole = {
		service : 'userManager.groupAction',
		method : 'addRole'
	}
	/*
	 *2.4.1角色列表查询
	 */
	this.guserManager_roles_editorRole_modifyRole = {
		service : 'userManager.groupAction',
		method : 'modifyRole'
	}
	/*
	 *2.4.5查看拥有该角色的组和用户
	 */
	this.guserManager_roles_lookRoleGroups_getChildrenListByRole = {
		service : 'userManager.groupAction',
		method : 'getChildrenListByRole'
	}
	/*
	 *2.4.5查看拥有该角色的组和用户
	 */
	this.guserManager_roles_roleList_delRole = {
		service : 'userManager.groupAction',
		method : 'delRole'
	}
	/*
	 *2.4.9解除关联
	 */
	this.guserManager_roles_roleRoleGroups_removeRelation = {
		service : 'userManager.groupAction',
		method : 'removeRelation'
	}
	/*
	 *2.4.10关联此角色
	 */
	this.guserManager_roles_roleRoleGroups_grantRoleToUserOrGroup = {
		service : 'userManager.groupAction',
		method : 'grantRoleToUserOrGroup'
	}
	/*
	 *2.4.10关联此角色
	 */
	this.guserManager_roles_addRole_getUserGroupTree = {
		service : 'userManager.groupAction',
		method : 'getUserGroupTree'
	}
	//////////////////////////////////////个人信息中心//////////////////////////////////////////////////
	this.guserManager_systemUserInfo_viewUserInfo_defaultView = {
		service : 'userManager.userAction',//userManager.groupAction.findUserInfoById.gjs
		method : 'getMyUserInfo'
	}
	this.guserManager_systemUserInfo_viewUserInfo_editUserInfo = {
		service : 'userManager.userAction',//userManager.groupAction.modifyUserInfo.gjs
		method : 'saveMyUserInfo'
	}
	this.guserManager_systemUserInfo_viewUserInfo_editUsrPwd = {
		service : 'userManager.userAction',//userManager.groupAction.modifyUserPwd.gjs
		method : 'updateMyUserPwd'
	}
	
	////////////////////////////////////////9.27新版的接口//////////////////////////////////////////////////////////
	this.guserManager_allUsers_getAllusersList = {
		service : 'userManager.userAction',//userManager.userAction.getUserList.gjs
		method : 'getUserList'
	}
	
	//获取用户组的树
	this.guserManager_allUsers_getSelectUserGroupTree = {
		service : 'userManager.treeAction',//userManager.treeAction.getGroupTree.gjs
		method : 'getGroupTree'
	}
	
	//获取角色树
	this.guserManager_allUsers_getSelectRolesTree = {
		service : 'userManager.treeAction',//userManager.treeAction.getRoleTree.gjs
		method : 'getRoleTree'
	}
	
	
	//获取部门树
	this.guserManager_allUsers_getSelectDeptsTree = {
		service : 'userManager.treeAction',//userManager.treeAction.getDepTree.gjs
		method : 'getDepTree'
	}
	
	
	//获取关联用户的树
	this.guserManager_allUsers_getSelectRelatedUserTree = {
		service : 'userManager.treeAction',//userManager.treeAction.getUserTree.gjs
		method : 'getUserTree'
	}
	
	//获取关联人员的树
	this.guserManager_allUsers_getSelectRelatedPersonTree = {
		service : 'userManager.treeAction',//userManager.treeAction.getPersonTree.gjs
		method : 'getPersonTree'
	}
	
	
	//获取用户的详情
	this.guserManager_allUsers_getPersonInfoDetail = {
		service : 'userManager.userAction',//userManager.userAction.getUserInfo.gjs
		method : 'getUserInfo'
	}
	
	//获取部门的详情
	this.guserManager_allUsers_getDepartmentInfoDetail = {
		service : 'userManager.groupAction',//userManager.groupAction.getDepInfo.gjs
		method : 'getDepInfo'
	}
	
	
	//获取部门的详情
	this.guserManager_allUsers_editDepartmentInfomation = {
		service : 'userManager.groupAction',//userManager.groupAction.modifyDep.gjs
		method : 'modifyDep'
	}
	
	//获取角色详情
	this.guserManager_allUsers_getRolesInfomationByuuid = {
		service : 'userManager.groupAction',//userManager.groupAction.getRoleInfo.gjs
		method : 'getRoleInfo'
	}
	
	
	//解除绑定
	this.guserManager_allUsers_setUnBindPerson = {
		service : 'userManager.userAction',//userManager.userAction.unbindPerson.gjs
		method : 'unbindPerson'
	}
	
	//用户的高级搜索
	this.guserManager_allUsersGrid_seachUserByKey = {
		service : 'userManager.userAction',//userManager.userAction.searchPerson.gjs
		method : 'searchPerson'
	}
	
	
	//编辑部门
	this.guserManager_allUsersGrid_groupACtion_editDept = {
		service : 'userManager.groupAction',//userManager.groupAction.modifyDep
		method : 'modifyDep'
	}

//    导入用户
    this.guserManager_allUsers_importUser_importRelFunc = {
        service : 'userManager.userAction',
        method : 'importUsers'
    };

    this.guserManager_allUsers_importUser = {
        service : 'userManager.userAction',
        method : 'getTmpFileUuid'
    };
    
    //设置——用户列表
    this.guserManager_config_config_getUserList = {
        service : 'userManager.userManageAction',//userManager.userManageAction.getUserList.gjs
        method : 'getUserList'
    };
	
	//设置——添加，修改用户
    this.guserManager_config_config_addUser = {
        service : 'userManager.userManageAction',//userManager.userManageAction.addUser.gjs
        method : 'addUser'
    };
    
    //设置——删除用户
    this.guserManager_config_config_delUser = {
        service : 'userManager.userManageAction',//userManager.userManageAction.delUser.gjs
        method : 'delUser'
    };
    
    //设置——获取用户信息
    this.guserManager_config_config_getMyUserInfo = {
        service : 'userManager.userManageAction',//userManager.userManageAction.getMyUserInfo.gjs
        method : 'getMyUserInfo'
    };
    
	//设置——获取网盘容量
    this.guserManager_config_config_getContextNetDiskCapacity = {
        service : 'docCenter.statisticAtion',//docCenter.statisticAtion.getContextNetDiskCapacity.gjs
        method : 'getContextNetDiskCapacity'
    };
    
    //设置——获取网盘容量
    this.guserManager_config_config_setNetDiskCapacity = {
        service : 'docCenter.statisticAtion',//docCenter.statisticAtion.setNetDiskCapacity.gjs
        method : 'setNetDiskCapacity'
    };
    
    //设置——上传模版(邮件联系人)
//    this.guserManager_config_config_impEmailBook = {
//        service:'emailer.folderAction',//emailer.folderAction.impEmailBook.gjs
//        method:'impEmailBook'
//    };
//    //设置——上传模版（其他联系人）
//    this.guserManager_config_config_importOrgContact = {
//        service:'docCenter.eachOtherAction',//docCenter.eachOtherAction.importOrgContact.gjs
//        method:'importOrgContact'
//    };
    
    //设置——上传模版（所有的上传）
    this.guserManager_config_config_sysImpData = {
        service:'docCenter.eachOtherAction',//docCenter.eachOtherAction.sysImpData.gjs
        method:'sysImpData'
    };
    
    //系统公告-发布或修改公告
    this.guserManager_config_config_saveorUpdateNotice = {
        service:'appManager.appAction',
        method:'saveorUpdateNotice'
    };
    
    //系统公告-获取公告内容
    this.guserManager_config_config_getNoticeContent = {
        service:'appManager.appAction',
        method:'getNoticeContent'
    };
    
    //设置——上传模版（licence设置）
    this.guserManager_config_config_impSetLicence = {
        service:'docCenter.eachOtherAction',//docCenter.eachOtherAction.impSetLicence.gjs
        method:'impSetLicence'
    };
    
    //设置——获取licence设置
    this.guserManager_config_config_getSetLicenceInfo = {
        service:'docCenter.eachOtherAction',//docCenter.eachOtherAction.getSetLicence.gjs
        method:'getSetLicence'
    };
    
    //设置——下载模版
    this.guserManager_config_config_docDownloadFolder = {
        service:'docCenter.eachOtherAction',//docCenter.eachOtherAction.docDownloadFolder.gjs
        method:'docDownloadFolder'
    };

    //新版个人中心-查看个人资料
    this.guserManager_sysUserInfoManage_viewUserInfo = {
    	service : 'userManager.userManageAction',
		method : 'getMyUserInfo'
    }
	
    //新版个人中心-修改密码
    this.guserManager_sysUserInfoManage_updatePwd = {
    	service : 'userManager.userManageAction',
		method : 'updatePwd'
    }
    
    //新版个人中心-修改图片
    this.guserManager_sysUserInfoManage_saveOrUpadateImage = {
    	service : 'userManager.userManageAction',
		method : 'saveOrUpadateImage'
    }
	
    //新版本检验用户名是否存在
    this.guserManager_sysUserInfoManage_getMyUserInfo = {
    	service : 'userManager.userManageAction',
		method : 'chekUserName'
    }
    
  //新版本检验用户名是否存在
    this.guserManager_config_user_searchAllPersons = {
    	service : 'webChat.webChatActionImpl',
		method : 'searchPersonsList'
    }
})