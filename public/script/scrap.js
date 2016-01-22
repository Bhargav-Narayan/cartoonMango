angular.module('scrap',['ngResource'])
	.controller('searchCtrl',function($scope,$resource){
		$scope.searching = false;
		$scope.myTrue = true;
		$('.searchList').css('display','none');
		var data = $resource('/process');
		$scope.data = data.query();
		$scope.dynamicData = [];
		$('input').focus();
		$scope.searchingFun = function(){
			$scope.dynamicData = [];
			// console.log($scope.search);
			$('.searchList').css('display','block');
			$scope.data.forEach(function(element){ 
				var re = new RegExp($scope.search);
				if(element.name.match(re)){
					// console.log(element)
					$scope.dynamicData.push(element);
				}
				else if($scope.dynamicData.length === 0)
					$scope.dynamicData[0] = {name:'no results found'};
				else if($scope.dynamicData.length>1){
					if($scope.dynamicData[0].name ==='no results found')
						$scope.dynamicData.splice(0,1)
				}
			});
			
			if(!$scope.search){
				$scope.dynamicData = [];
				$('.searchList').css('display','none');
			}
		};

		$scope.scrapping = function(e){
			$scope.dynamicData = [];
			$scope.search = '';
			$('.searchList').css('display','none');
			var id=$(e.target).data('id');
			var particular = $resource('/details/:id',{id:id});
			$scope.result = particular.query();
			
		};
	});




