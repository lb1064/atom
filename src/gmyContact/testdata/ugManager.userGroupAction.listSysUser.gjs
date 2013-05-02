{
	data:[
		{
		loginName:'yanfabu',//只有组或者部门的时候才是DN ,对应ldap 的sAMAccountName
		displayName:'研发部',//对应ldap displayName
		isLeaf:true,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
 		xtype:'group',//’group’’contact’
 		/*授权操作需要的字段*/
 		loginName:'',
 		displayName:'',
 		type:'',//1,2,3   标示1用户   2组 3部门
 		/*授权操作需要的字段*/
		children:[
			{
				loginName:'yanfabuyi',//只有组或者部门的时候才是DN ,对应ldap 的sAMAccountName
				displayName:'研发部一',//对应ldap displayName
       			 type:'2',//‘是否组’// 1用户   2组 3部门
				isLeaf:true,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
 				xtype:'group',//’group’’contact’
 				children:[
 						{
 						loginName:'wangfei',//只有组或者部门的时候才是DN ,对应ldap 的sAMAccountName
						displayName:'王飞',//对应ldap displayName
       			 		type:'1',//‘是否组’// 1用户   2组 3部门
						isLeaf:false,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
 						xtype:'contact'//’group’’contact’
 						},
 						{
 						loginName:'sunsi',//只有组或者部门的时候才是DN ,对应ldap 的sAMAccountName
						displayName:'孙思',//对应ldap displayName
       			 		type:'1',//‘是否组’// 1用户   2组 3部门
						isLeaf:false,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
 						xtype:'contact'//’group’’contact’
 						} 						
 				]
 			}
 				
		]
		}
	]
}
