//  app.js

var app = angular.module('myapp',["ui.router"]);
/**
 * 配置跨域
 * @DateTime 2017-04-22T18:10:20+0800
 */
app.config(function ($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  	$httpProvider.defaults.withCredentials = true;
  	$httpProvider.defaults.transformRequest = function (data) { 
	     //把JSON数据转换成字符串形式
        var str = '';  
        for( var i in data ) {  
            str += i + '=' + data[i] + '&';  
        }  
        return str.substring(0,str.length-1);  
	 };
  	console.log($httpProvider.defaults);
});
/**
 * 配置路由 利用ui-router
 * @DateTime 2017-04-22T18:10:40+0800
 */
app.config(function($stateProvider,$urlRouterProvider){  
    $urlRouterProvider.otherwise("/login");//未定义的页面显示还是需要ngRoute的otherwise成员方法定义  
    $stateProvider
	.state('login',{
         url:"/login",
         // template:'<div>main1:{{title}}</div><div ui-view="hellobox"></div>',
         templateUrl:"login.html",
         controller:'loginController'
     })
	.state('wechat',{
		url:'/wechat',
		templateUrl:'wechat.html',
		controller:'wechatController'
	})
	// .state('wechat.list',{
	// 	url:'/list',
	// 	views:{
 //         	'wechat.friendlist':{
 //         		templateUrl:'friendlist.html'
 //         		// 避免重复指定控制器
 //         		// controller:'friendlist'
 //         	},
 //         	'wechat.friendinfor':{
 //         		templateUrl:'friendinfor.html'
 //         	}
 //         }
	// })
	// .state('wechat.talk',{
	// 	url:'/talk',
	// 	views:{
 //         	'wechat.friendlist':{
 //         		templateUrl:'recentlyTalking.html'
 //         		// 避免重复指定控制器
 //         		// controller:'friendlist'
 //         	},
 //         	'wechat.friendinfor':{
 //         		templateUrl:'friendinfor.html'
 //         	}
 //         }
	// })
	// .state("login.nihao",{
 //         url:"/nihao",
 //         templateUrl:'test3.html',
 //         controller: function ($scope) {
 //             $scope.title="hello angulr main2";
 //         },
 //         views:{
 //         	'hellobox':{
 //         		template:'<div>hello hhhhhahahah {{title}}</div>'
 //         	}
 //         }
 //     });
    // .state("main3",{
    //      url:"/main3",
    //      template:"<div>main3:{{name}}</div>",
    //      controller: function ($scope) {
    //          $scope.name="hello 张三"
    //      }
    //  });
        
});
/**
 * constant存储项目路径
 */
app.constant('projectUrl','http://www.gdut-rdc.com');
/**
 * $friendlist存储列表
 */
app.value('$friendlist',{});
/**
 * $personalId存储用户本人id
 */
app.value('$personalId',{id:''});
 
