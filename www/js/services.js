angular.module('starter.services', [])

.factory('IO', function(){
	return {
		init: function(scope){
			scope.input = {};
			scope.output = {};
			scope.error = {};
			return scope;
		},
		users : [
			{
				username: 'admin',
				password: 'admin'
			}
		],
		data : [
			{
				title: 'Test Data',
				content: 'Hello world!'
			}
		]
	};
});