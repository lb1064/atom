{
	total:4,
	privMap:{
		show:true,
		edit:true
	},
	path:[
		{name:'行政通讯录',value:''},
		{name:'本局通讯录',value:'benju'},
		{name:'产品部',value:'chanpinbu'}
	],
	data:[
		{
	        uuid:'111adwada' ,
	        iconUuid:'1',
	        name:'产品部一',  
	        post:'技术部经理', 
	        organization:'技术部',
	        memberType:'1',//1:表示组 2表示人,
	        isSystemUser:'0',
	        sort:'1',
	        remark:'这是备注1111',
	        privMap:{
				show:true,
				edit:true
			}
		   },
		{
	        uuid:'111' ,
	        iconUuid:'1',
	        name:'张三',  
	        sort:'2',
	        emails:[{key:'常用邮箱',value:'lisi@sina.com'}],
	        post:'技术部经理', 
	        phones:[{key:"电话",value:"1377777777"}],
	        organization:'技术部',
	        memberType:'2',//1:表示组 2表示人,
	        isSystemUser:'1',
	        remark:'这是备注1111',
	        privMap:{
				show:true,
				edit:true
			}
		    },
		{
	        uuid:'111222' ,
	        iconUuid:'122',
	        name:'李四',  
	        emails:[{key:'常用邮箱',value:'lisi@sina.com'}],
	        post:'技术部经理', 
	        phones:[{key:"电话",value:"1377777777"}],
	        organization:'产品部',
	        isSystemUser:'1',
	        sort:'3',
	        memberType:'2',//1:表示组 2表示人,
	        remark:'这是备注2222',
	        privMap:{
				show:true,
				edit:true
			}
		    }
	]
}