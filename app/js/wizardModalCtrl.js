laptops.controller("wizardModalCtrl", function($scope,$uibModalInstance,$timeout) {
    $scope.currentQuestion = 1;
    $scope.answers = ["","","",""];

    $scope.answerQuestion = function (index, answer) {
        $scope.answers[index-1] = answer;

        $("#question" + $scope.currentQuestion).fadeOut("slow", function() {
            if ($scope.currentQuestion <= $scope.answers.length-1) {
                $scope.currentQuestion += 1;
                $("#question" + $scope.currentQuestion).fadeIn("slow");
            } else {
                $("#result-loader").fadeIn(1000).fadeOut(1000, function() {
                    $("#results").fadeIn();
                });
            }
        });

        if ($scope.currentQuestion == $scope.answers.length+1) {
            $scope.loadingAnswers = true;
            $timeout(function() {
                $scope.loadingAnswers = false;
            }, 1000);
        }
    };

    $scope.close = function () {
        $uibModalInstance.dismiss();
    };

});
