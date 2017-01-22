'use strict';

angular.module('confusionApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;                //when the server down
            $scope.message = "Loading ...";         //when the server down
            
            $scope.dishes = menuFactory.getDishes().query(function(response) {
                    $scope.dishes = response;
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                });
                                    
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope','feedbackFactory', function($scope,feedbackFactory) {
            // TASK 3 to save the feedback information to the server
            $scope.sendFeedback = function() {
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                     $scope.invalidChannelSelection = false;
                feedbackFactory.getFeedback().save($scope.feedback);
                $scope.feedbackForm.$setPristine();
                console.log('Saved feedback: ' + JSON.stringify($scope.feedback));
                $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

            $scope.showDish = false;                //when the server down
            $scope.message = "Loading ...";         //when the server down
            
            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
            );
            
        }])

        .controller('DishCommentController', ['$scope','menuFactory', function($scope,menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.dish.comments.push($scope.mycomment);
                menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
                $scope.commentForm.$setPristine();
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            };
        }])

        // implement the IndexController and About Controller here
.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function ($scope, menuFactory, corporateFactory) {

        $scope.showDish = false;                //when the server down
        $scope.showPromotion = false;           //when the server down     
        $scope.showLeader = false;
                
        $scope.message = "Loading ...";         //when the server down
        
        $scope.dish = menuFactory.getDishes().get({id:0}).$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
                        );
    // TASK 1 to render the promotion data. You should handle the error condition appropriately
        $scope.Promotion = menuFactory.getPromotion().get({id:0})
        .$promise.then(
                function (response) {
                    $scope.Promotion = response;
                    $scope.showPromotion = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
        );
    
        // TASK 2 to render the leadership data obtained from the server, and error condition should be handled
        $scope.leader = corporateFactory.getLeaders().get({id:3})
        .$promise.then(
                function (response) {
                    $scope.leader = response;
                    $scope.showLeader = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );

    }])
.controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {
// TASK 2 to render the leadership data obtained from the server, and error condition should be handled
    $scope.showLeaders = false;
    $scope.leaders = corporateFactory.getLeaders().query(
        function(responce){
            $scope.leaders=responce;
            $scope.showLeaders = true;
        },
        function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

    }]);
;
