var laptops = angular.module("laptops", ['ngRoute','ui.bootstrap']);

laptops.controller('modalCtrl', ['$scope', '$uibModalInstance', 'data',
    function ($scope, $uibModalInstance, data) {
        $scope.data = data;
        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
    }]);

laptops.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/search', {
                templateUrl: 'app/views/search.html',
                controller: 'searchCtrl'
            }).otherwise({
                redirectTo: '/search'
            });
    }]);