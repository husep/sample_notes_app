angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicLoading, IO) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
	s = $scope;
	s.input = {};
	
	$scope.submit = function(){
		
		
		
		$ionicLoading.show({
			template: '<ion-spinner></ion-spinner><br/>Logging in...'
		}).then(function(){
			setTimeout(function(){ $ionicLoading.hide().then(function(){
				var root = IO.users[0];
				if(root.username == s.input.username && root.password == s.input.password){
					$state.transitionTo('menu.home');
				}
				else {
					$ionicPopup.alert({
						title: 'Username or password is incorrect!',
						okType: 'button-assertive'
					});
				}
			}); },1000);
		});
		
		
		
		/* cordova.exec(function(r){
			$ionicLoading.hide();
			$state.transitionTo('menu.home');
		}, function(e){
			$ionicLoading.hide();
			$ionicPopup.alert({
				title: e,
				okType: 'button-assertive'
			});
		}, "dbtools", "login", [s.input.username, s.input.password]); */
		
	};
	
})

.controller('MenuCtrl', function($scope, $state, $ionicLoading){
	s = $scope;
	
	s.menuItems = [
		{
			name: 'Home', 
			href: '#/menu/home'
		},
		{
			name: 'About',
			href: '#/menu/about'
		},
		{
			name: 'Logout',
			href: ''
		}
	];
	
	s.logout = function(menuItem){
		if(menuItem.name == 'Logout'){
			$ionicLoading.show({
				template: '<ion-spinner></ion-spinner><br/>Logging out...'
			});
			setTimeout(function(){
				$ionicLoading.hide().then(function(){
					$state.transitionTo('login');
				});
			},1000);
		}
	};
	
})

.controller('HomeCtrl', function($scope, $ionicPopup, $ionicModal, IO, $ionicLoading, $state){
	
	s = $scope;
	s.items = IO.data;
	
	s.input = {
		title: '',
		content: ''
	};
	
	$ionicModal.fromTemplateUrl('templates/add_user.html', {
    scope: s,
    animation: 'slide-in-up'
  }).then(function(modal) {
    s.modal = modal;
  });
	
	s.uiState = {
		a: false,
		b: true
	};
	
	s.showDelete = false;
	s.showReorder = false;
	s.canSwipe = false;
	
	s.toggleUiState = function(){
		s.items.forEach(function(item, index){
			item.marked = false;
		});
		s.uiState.a = !s.uiState.a;
		s.uiState.b = !s.uiState.b;
	};
	
	s.confirm = function(){
		
		var toBeRemoved = [];
		
		s.items.forEach(function(item, index){
			if(item.marked){
				toBeRemoved.push(item);
			}
		});
		
		if(toBeRemoved.length > 0){
			$ionicPopup.confirm({
				title: 'Remove Selected',
				template: 'Are you sure you want to remove the selected items?'
			}).then(function(r){
				if(r){
					toBeRemoved.forEach(function(item, index){
						s.items.splice(s.items.indexOf(item),1);
					});
					toBeRemoved = null;
					s.toggleUiState();
				}
			});
		}
		else
			s.toggleUiState();
	};
	
	s.insert = function(){
		
		if(s.input.title.length > 0){
			$ionicLoading.show().then(function(){
				s.items.push({
					title: s.input.title,
					content: s.input.content
				});
				$ionicLoading.hide().then(function(){
					s.cancel();
				});
			});
		}else {
			$ionicPopup.alert({
				title: 'Title can not be empty!',
				okType: 'button-assertive'
			});
		}
		
	};
	
	s.edit = function(index){
		$state.go('menu.edit', {id: index});
	}
	
	s.cancel = function(){
		s.input = {
			title: '',
			content: ''
		};
		s.modal.hide();
	};
	
})

.controller('EditCtrl', function($scope, $stateParams, IO, $ionicPopup, $state, $rootScope){
	
	var copy = IO.data[$stateParams.id];
	var justExit = false;
	
	$scope.data = {
		title: copy.title,
		content: copy.content
	}
	
	$scope.save = function(){
		if($scope.data.title.length > 0){
			if($scope.data.title != copy.title || $scope.data.content != copy.content){
				$ionicPopup.confirm({
					title: 'Save Changes',
					subtitle: 'Any changes made will overwrite the previous data.'
				}).then(function(r){
					if(r){
						copy.title = $scope.data.title;
						copy.content = $scope.data.content;
						$state.go('menu.home');
					}
				});
			}
		}
		else {
			$ionicPopup.alert({
				title: 'Title can not be empty!',
				okType: 'button-assertive'
			});
		}
	}
	
});
