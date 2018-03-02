// directive js file

/**
 * 好友列表单个好友div指令
 * @DateTime 2017-04-23T13:37:06+0800
 */
app.directive('friendlistItem',function () {
	return{
		replace:true,
		restrict:'EA',
		scope:{
			usernumber:'@',
			username:'@'
		},
		template:
		'<div class="friend-box {{isSelected}}" ng-click="beActive()" ng-dblclick="changePage()" data-userid="{{usernumber}}">\
			<div class="friend-item"> \
				<img src="./img/mywife.png" class="friend-head"><span class="friend-name" ng-bind="username">你的好友</span>\
			</div>\
		</div>',
		controller:function ($scope,$element,$attrs,$transclude,$scope) {
			 
		},
		link:function ($scope,$element,$attrs) {
			 
			/**
			 * 判断是否被选中
			 * @type {String}
			 */
			$scope.isSelected = '';
			$scope.beActive = function () {
				$scope.isSelected = 'friend-box-active';
				$scope.$parent.chooseOne($scope);
				$scope.$emit('getInfor',$attrs.usernumber);
			}
			$scope.unActive = function () {
				$scope.isSelected = '';
			}
			$scope.$parent.addToLists($scope);

			$scope.changePage = function () {
				$scope.$emit('dblclick',$attrs.usernumber);
				$scope.$parent.changePage(123);
			}
		}
	}
})

/**
 * 最近联系人列表的好友div指令
 */
app.directive('talkinglist',function () {
	return{
		replace:true,
		restrict:'EA',
		scope:{
			nickname:'@username',
			time:'@talktime',
			content:'@talkcontent'
		},
		template:
		'<div class="talking-item {{isSelected}}" ng-click="beActive()">\
			<img src="./img/mywife.png" class="talking-head">\
			<div class="talk-infor">\
				<div class="talk-name">\
					<span class="talk-name-item" ng-bind="nickname">好友昵称</span>\
					<span class="talk-time" ng-bind="time"></span>\
				</div>\
				<p class="talk-content" ng-bind="content">暂无消息</p>\
			</div>\
		</div>',
		controller:function ($scope,$element,$attrs,$transclude) {
		},
		link:function ($scope,$element,$attrs,$state) {
			 
			/**
			 * 判断是否被选中
			 * @type {String}
			 */
			$scope.isSelected = '';
			$scope.beActive = function () {
				$scope.isSelected = 'talking-item-active';
				$scope.$parent.chooseOne($scope);
				$scope.$emit('theManYouAreTalkingTo',$attrs.usernumber);
				$scope.$parent.$parent.talking_friend = $attrs.usernumber;
			}
			$scope.unActive = function () {
				$scope.isSelected = '';
			}
			$scope.$parent.addToLists($scope);

			/**
			 * 监听highlight事件
			 */
			$scope.$on('highLightTheOneWhichHasBeenChoosed',function (event,next,current) {
				if(next == $attrs.usernumber){
					$scope.isSelected = 'talking-item-active';
				}else{
					$scope.isSelected = '';
				}
			})
		}
	}
})


/**
 * 聊天记录 的div指令
 */
app.directive('talkingRecords',function () {
	return{
		replace:true,
		restrict:'EA',
		scope:{
			record:'@talkrecord',
			sender:'@',
			receiver:'@'
		},
		template:
		'<div class="talking-records-item {{senderClass}}">\
			<img src="./img/mywife.png" class="talking-sm-head son-item">\
			<div class="talking-content-detail son-item" ng-bind="record">暂无</div>\
		</div>',
		controller:function ($scope,$element,$attrs,$transclude) {
		},
		link:function ($scope,$element,$attrs,$state) {
			
			$scope.senderClass = '';

			var myUserId = $scope.$parent.$parent.personalId_copy;
			if($scope.sender == myUserId){
				$scope.senderClass = 'my-item';
			}else{
				$scope.senderClass = 'other-item';
			}

		}
	}
})