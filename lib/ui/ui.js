angular.module("ui", []);

angular.module("ui").run(function($templateCache){
	$templateCache.put('view/accordion.html', '<div class="ui-accordion-title" ng-click="open()">{{title}}</div><div class="ui-accordion-content" ng-if="isOpened" ng-transclude></div>');
});

angular.module("ui").directive("uiAccordions", function(){
	return {
		controller: function($scope, $element, $attrs){
			var accordions = [];
			this.registerAccordion = function(accordion){
				accordions.push(accordion);
			};
			this.closeAll = function(){
				accordions.forEach(function(accordion){
					accordion.isOpened = false;
				});
			};
		}
	};
});
angular.module("ui").directive("uiAccordion", function(){
	return {
		templateUrl: "view/accordion.html",
		transclude: true,
		scope: {
			title: "@"
		},
		require: "^uiAccordions",
		link: function(scope, element, attrs, ctrl){
			ctrl.registerAccordion(scope);
			scope.open = function(){
				ctrl.closeAll();
				scope.isOpened = true;
			};
			console.log(scope);

		}
	};
});

angular.module("ui").directive("uiDate", function($filter){
	return {
		require: "ngModel",
		link: function(scope, element, attrs, ctrl){
			var _formatDate = function(date){
				date = date.replace(/[^0-9]+/g, "");
				if (date.length > 2){
					date = date.substring(0,2) + "/" + date.substring(2);
				}
				if(date.length > 5){
					date = date.substring(0,5) + "/" + date.substring(5,9);
				}
				return date;
			}
			element.bind("keyup", function(){
				ctrl.$setViewValue(_formatDate(ctrl.$viewValue));	
				ctrl.$render();
			});
			ctrl.$parsers.push(function(value){
				if(value.length === 10){
					var dateArray = value.split("/");
					return new Date(dateArray[2], dateArray[1]-1, dateArray[0]).getTime();
				}
			});

			ctrl.$formatters.push(function(value){
				return $filter("date")(value, "dd/MM/yyyy");
			});

		}

	};
});