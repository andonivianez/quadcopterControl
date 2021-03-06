app.controller('AppController', function($scope, $rootScope) {
    $scope.system = {
        deviceState: 'notReady',
        wifi: {
            state: 'NotConnected'
        },
        information: {
            record: false
        }
    }

    $scope.initialize = function() {
        $scope.system.deviceState = 'ready';
        $scope.lastCall = Date.now();

        $scope.initWebsocket();

        // WIFI
        //$scope.system.wifi.state = $cordovaNetwork.getNetwork() == "wifi" ? 'connected' : 'connected';

        //$scope.$apply();
    }

    $scope.initWebsocket = function() {
        console.log('conection en cours');
				$scope.string = "ws://" + document.getElementById("ipAdress").value + "/chatsocket";
        $rootScope.ws = new WebSocket($scope.string);

        $rootScope.ws.onopen = function() {
            console.log('connected');
            $rootScope.ws.opened = true;
            $rootScope.ws.send(JSON.stringify({
                action: "get_info"
            }));
        }

        $rootScope.ws.onerror = function(error) {
            $scope.$apply();
        }

        $rootScope.ws.onmessage = function(message) {
            message = JSON.parse(message.data);
            if (message.action = "get_info") {
                console.log(message);
                $scope.system.information = message.data;
                $scope.$apply();
            }
        }

        $rootScope.ws.onclose = function() {
            $rootScope.ws.opened = false;
        }

        $scope.record = function() {
            console.log('--: ' + (Date.now() - $scope.lastCall));
            if (Date.now() - $scope.lastCall < 100) {
                return false;
            }
            $scope.lastCall = Date.now();
            $rootScope.ws.send(JSON.stringify({
                action: "record"
            }));
        }

        $scope.dosMill = function() {
            console.log("Send{2000, 2000, 2000, 2000}");
        }
    }

    $scope.reconect = function() {
        $scope.initWebsocket();
    }

    $scope.ipConnection = function() {
        $rootScope.ipAdress = $scope.ipAdress;
        $scope.initialize();
    }

    //$scope.initialize();

    document.addEventListener("pause", function() {
        navigator.app.exitApp();
    }, false);

    document.addEventListener("deviceready", function() {
        //$scope.initialize();
    }, false);
});
