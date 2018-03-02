// controller.js file

/**
 * 登录操作控制器
 * @DateTime 2017-04-22T20:15:51+0800
 * @param    {object}                 $scope     scope for ctrl
 * @param    {objecy}                 $http      service for ajax
 * @param    {string}                 projectUrl project Url constant
 * @param    {object}                 $state)    {	$scope.name [description]
 */
app.controller('loginController',function ($scope,$http,projectUrl,$state,$personalId) {
	$scope.name = 'asd';
	$scope.confirmToSubmit = function () {
		var account = $scope.account;
		var password = $scope.password;
		checkIsLegal(account,password)?sendAjax(account,password):'';
	}
	function sendAjax(account,password) {
		$http({
			method:"get",
			url:projectUrl+'/login',
			params:{
				account:account,
				password:password
			}
		})
		.success(function (data,status) {
			console.log(data);
			if(data.result=='success'){
				// 存储用户id
				$personalId.id = data.userid;
				$state.go('wechat');
				return;
			}
			alert('登录失败！原因：'+data.reason);
		})
		.error(function (data,status) {
			alert('网络连接错误!');
			console.log('error reason:'+data);
		})
	}
	function checkIsLegal(account,password) {
		if(account == '' || password == ''){
			alert('字段不能为空');
			return false;
		}
		var reg = /[\u4e00-\u9fa5]/;
		if(reg.test(account)||reg.test(password)){
			alert('字段不能为中文');
			return false;
		}
		return true;
	}
})

/**
 * 根作用域控制器
 * @DateTime 2017-04-23T15:30:02+0800
 * @param    {object}                 $scope    [description]
 * @param    {object}                 $location [description]
 * @param    {object}                 $state)   {	$scope.gomain3 [description]
 */
app.controller('rootController',function ($scope,$location,$state) {
	
})

/**
 * 整个聊天窗口控制器 负责信息中转和数据初始化
 * @DateTime 2017-04-23T15:30:42+0800
 * @param    {obj}                 $scope) {	$scope.haha [description]
 */
app.controller('wechatController',function ($scope,$timeout,$state,$http,projectUrl,$personalId) {
	$scope.$on('getInfor',function (event,next,current) { 
		$scope.$broadcast('comfirmToGetInfor',next);
	})
	$scope.$on('dblclick',function (event,next,current) { 
		$scope.$broadcast('comfirmToChangePage',next);
	})
	$scope.$on('theManYouAreTalkingTo',function (event,next,current) {
		$scope.$broadcast('getTheRecordsWhichAreFromThatMan',next);
	})
	$scope.$on('reloadLastRecord',function (event,next,current) {
		$scope.$broadcast('comfiemToReloadRecord',next);
	})
	/**
	 * 初始化样式
	 * @type {Boolean}
	 */
	$scope.showMe = true;
	$scope.chathover = 'chat-logo-hover';
	$scope.listhover = '';
	$scope.showWhitePage = true;
	$scope.Boolean = true;
	$scope.showTalkingBox = !$scope.showWhitePage;
	$scope.changePage = function (number) {
		// showMw为true则展示最近联系人列表
		$scope.showMe = true;
		$scope.chathover = 'chat-logo-hover';
		$scope.listhover = '';
		$scope.showFriendInfor = false;
		if(number == 123){
			$scope.Boolean = false;
		}
		if($scope.Boolean)$scope.showWhitePage = true;
		$scope.showTalkingBox = !$scope.showWhitePage;
	}
	$scope.changePage2 = function () {
		$scope.showMe = false;
		$scope.chathover = '';
		$scope.listhover = 'list-logo-hover';
		$scope.showFriendInfor = true;
		$scope.showWhitePage = false;
		$scope.showTalkingBox = false;
	}
	// $scope.changePage = function () {
	// 	$state.go('wechat.talk');
	// }
	// $scope.changePage2 = function () {
	// 	$state.go('wechat.list');
	// }

	$scope.showFriendInfor = false;

	// 初始化个人信息
	(function () {
		$http({
			method:'get',
			url:projectUrl + '/getUserInfor',
			params:{
				id:$personalId.id
			},
			dataType:'json'
		})
		.success(function (data,status) {
			$scope.myNickname = data.nickname;
		})
		.error(function (data) {
			alert('网络错误！');
		})
	})();

	/**
	 * 切换修改个人信息面板
	 * @DateTime 2017-04-28T13:02:45+0800
	 */
	$scope.toggleInforBox = function () {
		$scope.$broadcast('showInforBox');
	} 

	$scope.$on('updateMyNickname',function (event,next,current) {
		$scope.myNickname = next;
	})
})

/**
 * 好友列表控制器，负责加载好友列表和事件绑定，传输被选择用户数据
 * @DateTime 2017-04-23T14:25:06+0800
 */
app.controller('friendlist',function ($scope,$http,projectUrl,$friendlist,$state) {
	
	$scope.friends = [];
	$scope.myState = $state;
	/**
	 * 初始化好友列表
	 * @return Array
	 */
	$http({
		method:'get',
		url:projectUrl + '/getList',
		responseType:'json'
	})
	.success(function (data,status) {
		$scope.friends = data;
		// data 是个数组
		// 存储好友列表进共用服务中
		angular.forEach(data,function (ele) {
			$friendlist[ele.id] = ele.nickname;
		})
	})
	.error(function (data,status) {
		alert('网络连接错误!');
		console.log('error reason:'+data);
	})

	/**
	 * 控制类名变化
	 * friendlist存储所有scope
	 * 其他两个函数暴露给底层指令作用域使用
	 */
	$scope.friendlist = [];
	$scope.addToLists = function (scope) {
		$scope.friendlist.push(scope);
	}
	$scope.chooseOne = function (choosedScope) {
		angular.forEach($scope.friendlist,function (ele) {
			if(ele != choosedScope){
				ele.unActive();
			}
		})
	}

})

/**
 * 查看好友信息界面
 * @DateTime 2017-04-23T17:53:41+0800
 * @param    {obj}                 $scope      [description]
 * @param    {obj}                 $http       [description]
 * @param    {string}                 projectUrl) {	$scope.beChecked [description]
 */
app.controller('friendinfor',function ($scope,$http,projectUrl) {
	$scope.beChecked = false;
	$scope.friendId = '';
	$scope.$on('comfirmToGetInfor',function (event,next,current) {
		$scope.beChecked = true;
		$scope.friendId = next;
		$scope.getFriendInfor(next);
	})
	$scope.sendMessage = function () {
		if($scope.friendId !== ''){
			$scope.$parent.changePage(123);
			$scope.$emit('dblclick',$scope.friendId);
		}
	}
	$scope.getFriendInfor = function (userId) {
		$http({
			method:'get',
			url:projectUrl+'/getUserInfor',
			params:{
				id:userId
			}
		})
		.success(function (data,status) {
			storageData(data);
		})
		.error(function (data,status) {
			alert('网络连接错误!');
			console.log('error reason:'+data);
		})
	}
	function storageData(data) {
		$scope.username = data.nickname;
		$scope.age = data.age || '暂无'; 
		$scope.email = data.mailbox || '暂无';
		$scope.address = data.address|| '暂无';
		$scope.introduction = data.introduction|| '暂无个人介绍';
	}
})
/**
 * 最近联系人聊天框
 * @DateTime 2017-04-23T18:44:50+0800
 * @param    {obj}                  $scope) {	$scope.friends [description]
 */
app.controller('recentlyTalking',function ($scope,$friendlist,$timeout,$interval,$http,projectUrl) {
	/**
	 * 数据模型，存储最近联系人姓名id聊天记录
	 * @type {Array}
	 */
	$scope.friends = [];
	/**
	 * 最近联系人map，方便操作
	 * @type {Object}
	 */
	$scope.friends_map = {};
	/**
	 * 正在对话的好友id
	 * @type {String}
	 */
	$scope.talking_friend = '';
	$scope.$on('comfirmToChangePage',function (event,next,current) {
		var user = {
			id:next,
			nickname:$friendlist[next],
			talktime:'',
			talkcontent:''
		};
		var index;
		// 在数组中不存在的时候
		if($scope.friends_map[user.id] == undefined){
			$scope.friends.unshift(user);
		}else{
			angular.forEach($scope.friends,function (ele,i) {
				if(ele.id == user.id){
					index = i;
				}
			})
			var primary_user = $scope.friends.splice(index,1);
			$scope.friends.unshift(primary_user[0]);
		}
		$scope.friends_map[user.id] = user.nickname;
		$scope.talking_friend = user.id;
		$scope.$emit('theManYouAreTalkingTo',user.id);


		// 等页面刷新了再修改样式 否则新增的div没有在list内。
		$timeout(function () {
			$scope.$broadcast('highLightTheOneWhichHasBeenChoosed',user.id);
		},0);
	})

	/**
	 * 指令作用域的存储数组
	 * @type {Array}
	 */
	$scope.scope_lists = [];
	$scope.addToLists = function (scope) {
		$scope.scope_lists.push(scope);
	}

	$scope.chooseOne = function (choosedScope) {
		angular.forEach($scope.scope_lists,function (ele) {
			if(ele != choosedScope){
				ele.unActive();
			}
		})
	}

	/**
	 * 更新最后一条聊天记录
	 * @DateTime 2017-04-28T11:46:03+0800
	 * @param    {object}                 event    [description]
	 * @param    {object}               next     [description]
	 */
	$scope.$on('comfiemToReloadRecord',function (event,next,current) {
		// console.log(next);
		angular.forEach($scope.friends,function (ele) {
			if(ele.id == next.id){
				ele.talkcontent = next.content;
			}
		})
	})

	// 定时获取最新的未读消息
	$interval(function () {
		$http({
			method:'get',
			url:projectUrl + '/getUnreadChatRecord'
		})
		.success(function (data,status) {
			// 为什么会出现解析错误，是因为刷新后保留了上下文 导致data变成了对象 obejct
			// JSON.parse先调用了tostring方法，变成了[Object object]
			// 解析到第二个字符o的时候解析不了 报错
			try{
				var data = JSON.parse(data);
			}catch(e){
				console.error(e);
				console.log('参数解析错误');
				return;
			}
			handleData(data);

		})
		.error(function (data,status) {
			alert('网络错误！');
		})
	},2000)

	/**
	 * 处理新增未读消息数据
	 * @DateTime 2017-04-28T11:58:33+0800
	 * @param    {Array}                 data [description]
	 */
	function handleData(data) {
		if(data.length == 0){
			return;
		}
		var newRecord_map = {};
		var newRecord_arr = [];
		angular.forEach(data,function (ele) {
			if(newRecord_map[ele.sender] == undefined){
				newRecord_map[ele.sender] = ele.sender;
			}
		})
		for(var prop in newRecord_map){
			newRecord_arr.push(prop);
		}
		console.log(newRecord_arr);
		angular.forEach(newRecord_arr,function (ele) {
			// 判断是否为正在对话的好友
			if(ele == $scope.talking_friend){
				$scope.$emit('theManYouAreTalkingTo',ele);
			}else{
				// 判断是否为不存在于最近联系人列表的好友
				if($scope.friends_map[ele] == undefined){
					$scope.friends.unshift({
						id:ele,
						nickname:$friendlist[ele],
						talktime:'',
						talkcontent:'[未读消息]'
					});
					$scope.friends_map[ele] = ele;
				}else{
					var index;
					angular.forEach($scope.friends,function (ele2,i) {
						if(ele2.id == ele){
							index = i;
						}
					})
					var primary_user = $scope.friends.splice(index,1);
					primary_user[0].talkcontent = '[未读消息]';
					$scope.friends.unshift(primary_user[0]);
				}
			}
		})
	}

	// $http({
	// 	method:'post',
	// 	url:projectUrl + '/updateUserInfor',
	// 	dataType:'JSON',
	// 	data:{
	// 		nickname:'我是傻逼佩涵',
	// 	    age:'30',
	// 	    mailbox:'asdasd@qq.com',
	// 	    address:'工一',
	// 	    introduction:'女人三十烂茶渣，我是烂茶渣'
	// 	}
	// })
	// .success(function (data,status) {
	// 	// var data = JSON.parse(data);
	// 	console.log(data);
	// })
	// .error(function (data,status) {
	// 	alert('网络错误！');
	// })
})

/**
 * 对话框和聊天记录框
 */
app.controller('talkingBox',function ($scope,$friendlist,$http,projectUrl,$personalId,$timeout) {
	
	$scope.records = [];
	$scope.message = '';
	$scope.friendId = '';
	$scope.personalId_copy = $personalId.id;
	$scope.$on('getTheRecordsWhichAreFromThatMan',function(event,next,current) {
		updateView(next);
	})

	$scope.keyDownToSendMessage = function (e) {
		// 回车发送消息
		if(e.keyCode == 13){
			// 阻止换行发生
			if ( e && e.preventDefault ){
            	e.preventDefault();
			}else{
				e.returnValue = false;
			}
			$scope.sendNewMessage();
		}
	}

	$scope.sendNewMessage = function () {
		if($scope.message == ''){
			return;
		}
		sendNewMessageToYourFriend($scope.message,$scope.friendId);
	}

	function sendNewMessageToYourFriend(message,friendId) {
		$http({
			method:'post',
			url:projectUrl + '/sendContent',
			data:{
				content:message,
				receiver:friendId
			},
			dataType:'json'
		})
		.success(function (data,status) {
			console.log(data);
			if(data.result == 'success'){
				// 更新视图
				$scope.records.push({
					sender:$personalId.id,
					receiver:friendId,
					content:message,
					date:'暂无'
				})
				// 清空输入框
				$scope.message = '';

				// 更新聊天记录后自动置底
				$timeout(function () {
					var a = document.getElementById('talking-records');
					a.scrollTop = a.scrollHeight;
				})

			}else{
				alert('发送失败,原因：'+data.reason);
			}
		})
		.error(function (data,status) {
			alert('发送失败网络出错');
		})
	}

	function updateView(userId) {
		$scope.nickname = $friendlist[userId];
		$scope.friendId = userId;
		getRecords(userId);
	}
	function getRecords(userId) {
		$http({
			method:'get',
			url:projectUrl+'/getChatRecord',
			params:{
				id:userId
			},
			dataType:'json'
		})
		.success(function (data,status) {
			var data = JSON.parse(data);
			$scope.records = data;

			// 回传数据给最近联系人列表 显示最后一条消息记录
			data = data.slice();
			var last_record = data.pop();
			if(last_record!==undefined){
				$scope.$emit('reloadLastRecord',{
					content:last_record.content,
					id:userId
				})		
			}

			// 更新聊天记录后自动置底
			$timeout(function () {
				var a = document.getElementById('talking-records');
				a.scrollTop = a.scrollHeight;
			})
		})
		.error(function (data) {
			alert('出错！');
		})
	}
})
/**
 * 修改个人信息栏 控制器
 * @DateTime 2017-04-28T13:58:20+0800
 * @param    {object}                 $scope                                  [description]
 * @param    {object}                 $http                                   [description]
 * @param    {string}                 projectUrl                              [description]
 * @param    {object}                 $personalId)                            {	$scope.showInforBox [description]
 */
app.controller('inforboxController',function ($scope,$http,projectUrl,$personalId) {

	$scope.showInforBox = false;
	$scope.$on('showInforBox',function () {
		$scope.showInforBox = true;
		updateView();
	});

	$scope.closeInforbox = function () {
		$scope.showInforBox = false;
	}
	/**
	 * 更新最新的个人信息
	 * @DateTime 2017-04-28T13:29:44+0800
	 */
	function updateView() {
		$http({
			method:'get',
			url:projectUrl + '/getUserInfor',
			params:{
				id:$personalId.id
			},
			dataType:'json'
		})
		.success(function (data,status) {
			$scope.nickname = data.nickname;
			$scope.age = data.age;
			$scope.introduction = data.introduction;
			$scope.mailbox = data.mailbox;
			$scope.address = data.address;
		})
		.error(function (data) {
			alert('网络错误');
		})
	}

	$scope.confirmToUpdate = function () {
		$http({
			method:'post',
			url:projectUrl + '/updateUserInfor',
			data:{
				nickname:$scope.nickname,
			    age:$scope.age,
			    mailbox:$scope.mailbox,
			    address:$scope.address,
			    introduction:$scope.introduction
			},
			dataType:'json'
		})
		.success(function (data,status) {
			$scope.showInforBox = false;
			if(data.result != 'success'){
				alert('修改失败！');
			}else{
				$scope.$emit('updateMyNickname',$scope.nickname);
			}
		})
		.error(function (data) {
			alert('网络错误');
		})
	}

})