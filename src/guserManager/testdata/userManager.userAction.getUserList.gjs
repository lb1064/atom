{
total:100,//总记录数
data:[
		{
			uuid:'dadaa',
		    loginName:'zhangsan',
			name:'张三',
			mobile:'138888888',
		    depName:'研发部',
		    gsoftGroups:[
		    	{uuid:'dawa111',name:'用户组A'},
		    	{uuid:'dawa111dwwdw',name:'用户组B'}	
		    	],
		    gsoftRoles:[
		    	{uuid:'jjnjnjn1111',name:'档案管理员'},
		    	{uuid:'jjnjnjn1112221',name:'系统管理员'}
		    ],  
		    sys:true,//角色类型：true 系统角色；false 自定义角色
			remark:'111111',
			bind:true
		},
		{
			uuid:'dadaadadawda',
		    loginName:'lisi',
			name:'李四',
			mobile:'138888888',
		    depName:'测试部',
		    gsoftGroups:[
		    	{uuid:'dawa111',name:'用户组B'},
		    	{uuid:'dawa111dwwdw',name:'用户组B'}	
		    	],
		    gsoftRoles:[
		    	{uuid:'jjnjnjn1111',name:'系统管理员'},
		    	{uuid:'jjnjnjn1112221',name:'系统管理员'}
		    ],  
		    sys:false,//角色类型：true 系统角色；false 自定义角色
			remark:'111111',
			bind:false
		},
		{
			uuid:'mkkmk',
		    loginName:'wangwu',
			name:'王五',
			mobile:'138888888',
		    depName:'测试部',
		    gsoftGroups:[
		    	{uuid:'dawa111',name:'用户组C'},
		    	{uuid:'dawa111dwwdw',name:'用户组C'}	
		    	],
		    gsoftRoles:[
		    	{uuid:'jjnjnjn1111',name:'用户'},
		    	{uuid:'jjnjnjn1112221',name:'用户'}
		    ],  
		    sys:false,//角色类型：true 系统角色；false 自定义角色
			remark:'111111',
			bind:false
		}
  ]
}