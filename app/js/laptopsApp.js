var laptops = angular.module("laptops", ['ngRoute','ui.bootstrap']).run(['$rootScope','$uibModal',
    function($rootScope,$uibModal) {
    $rootScope.openModal = function (modal, size, data) {
        $uibModal.open({
            animation: true,
            templateUrl: 'app/views/modals/' + modal + '.html',
            controller: 'modalCtrl',
            size: size,
            resolve: {
                data: function () {
                    return data;
                }
            }
        });
    };
}]);

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
            }).
            otherwise({
                redirectTo: '/search'
            });
    }]);