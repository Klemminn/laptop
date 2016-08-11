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

        $rootScope.openWizard = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/views/modals/wizardModal.html',
                controller: 'wizardModalCtrl',
                size: 'lg'
            });
        };

        $rootScope.removeFromCompare = function(index) {
            $rootScope.laptopsToCompare[index].compare = false;
            $rootScope.laptopsToCompare.splice(index,1);
            $rootScope.countComparison(false);
            if ($rootScope.numberToCompare < 1) $uibModalStack.dismissAll();
        };

        $rootScope.countComparison = function(isTrue) {
            if (isTrue) $rootScope.numberToCompare++; else $rootScope.numberToCompare--;
            $rootScope.unchecker = ($rootScope.numberToCompare > 0);
        };
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