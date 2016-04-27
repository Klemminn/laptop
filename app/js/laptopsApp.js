var laptops = angular.module("laptops", ['ngRoute','ui.bootstrap']).run(['$rootScope','$uibModal','$uibModalStack',
    function($rootScope,$uibModal,$uibModalStack) {
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
        $rootScope.removeFromCompare = function(index) {
            $rootScope.laptopsToCompare[index].compare = false;
            $rootScope.laptopsToCompare.splice(index,1);
            $rootScope.numberToCompare--;
            if ($rootScope.numberToCompare < 1) $uibModalStack.dismissAll();
        }
    }]);

laptops.controller('modalCtrl', ['$scope', '$rootScope', '$uibModalInstance', 'data',
    function ($scope, $rootScope, $uibModalInstance, data) {
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