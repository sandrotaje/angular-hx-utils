angular.module('hxUtils', [])
    .filter('millisecondsToTimeString', function () {
        return function (millseconds) {
            var neg = false;
            if (millseconds < 0) {
                millseconds = -millseconds;
                neg = true;
            }

            var seconds = Math.floor(millseconds / 1000);
            var days = Math.floor(seconds / 86400);
            var hours = Math.floor((seconds % 86400) / 3600);
            var minutes = Math.floor(((seconds % 86400) % 3600) / 60);

            var secondsRemaining = seconds - minutes * 60 - hours * 3600 - days * 86400;

            var timeString = '';
            // if (days > 0) timeString += (days > 1) ? (days + " days ") : (days + " day ");
            // if (hours > 0) timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
            // if (minutes >= 0) timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");
            // if (secondsRemaining >= 0) timeString += (secondsRemaining > 1) ? (secondsRemaining + " seconds ") : (secondsRemaining + " second ");


            if (days > 0) timeString = days + "d ";
            if (hours > 0) timeString += hours + "h ";
            if (minutes > 0) timeString += minutes + "m ";
            if (secondsRemaining >= 0) timeString += secondsRemaining + "s ";

            if (neg)
                timeString = "-" + timeString;

            return timeString;
        };
    })
    .filter('millisecondsToCronString', function () {
        return function (millseconds) {
            var neg = false;
            if (millseconds < 0) {
                millseconds = -millseconds;
                neg = true;
            }

            var seconds = Math.floor(millseconds / 1000);
            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds % 3600) / 60);

            var secondsRemaining = Math.floor(seconds % 60);

            function pad(n, width, z) {
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            }

            var timeString = pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);

            if (neg)
                timeString = "-" + timeString;

            return timeString;
        };
    })
    .filter('millisecondsToHxDonuts', ['$filter', function ($filter) {
        return function (millseconds) {
            var neg = false;
            if (millseconds < 0) {
                millseconds = -millseconds;
                neg = true;
            }

            var seconds = Math.floor(millseconds / 1000);
            var days = Math.floor(seconds / 86400);
            var hours = Math.floor((seconds % 86400) / 3600);
            var minutes = Math.floor(((seconds % 86400) % 3600) / 60);

            var secondsRemaining = seconds - minutes * 60 - hours * 3600 - days * 86400;

            var hxDonuts = {
                firstValue: "",
                firstUnit: "",
                rest: ""
            };

            var firstCollapsed = "";

            if (secondsRemaining >= 0) {
                hxDonuts.firstValue = secondsRemaining;
                hxDonuts.firstUnit = secondsRemaining != 1 ? $filter("translate")("SECONDS") : $filter("translate")("SECOND");
                firstCollapsed = secondsRemaining + "s";
                hxDonuts.rest = "";
            }

            if (minutes > 0) {
                hxDonuts.firstValue = minutes;
                hxDonuts.firstUnit = minutes != 1 ? $filter("translate")("MINUTES") : $filter("translate")("MINUTE");

                hxDonuts.rest = firstCollapsed;
                firstCollapsed = minutes + "m";
            }
            if (hours !== 0) {
                hxDonuts.firstValue = hours;
                hxDonuts.firstUnit = hours != 1 ? $filter("translate")("HOURS") : $filter("translate")("HOUR");

                hxDonuts.rest = firstCollapsed + " " + hxDonuts.rest;
                firstCollapsed = hours + "h";
            }
            if (days !== 0) {
                hxDonuts.firstValue = days;
                hxDonuts.firstUnit = days != 1 ? $filter("translate")("DAYS") : $filter("translate")("DAY");

                hxDonuts.rest = firstCollapsed + " " + hxDonuts.rest;
            }

            if (neg)
                hxDonuts.firstValue = "-" + hxDonuts.firstValue;

            return hxDonuts;
        };
    }])
    .filter("emptyDateFilter", function () {
        return function (input) {
            if (!input)
                return "--/--/----";
            return input;
        };
    })
    .filter("emptyFilter", function () {
        return function (input) {
            if (!input)
                return "-";
            return input;
        };
    })
    .directive("hxDonuts", function () {
        return {
            restrict: "C",
            scope: {
                options: "=?",
                value: "=",
                title: "=",
                subtitle: "=",
                name: "="
            },
            link: function ($scope, element, attr) {
                var _defaultOptions = {
                    frontStrokeColors: ["#11c1f3"],
                    frontStrokeWidth: 4,
                    backStrokeColor: "#141718",
                    backStrokeWidth: 4,
                    borderStrokeColor: "#51545a",
                    borderStrokeWidth: 1
                };



                var loadOptions = function () {
                    if (!$scope.options) {
                        $scope.options = {};
                    }

                    $scope.frontStrokeColors = $scope.options.frontStrokeColors ? $scope.options.frontStrokeColors : _defaultOptions.frontStrokeColors;
                    $scope.frontStrokeWidth = $scope.options.frontStrokeWidth ? $scope.options.frontStrokeWidth : _defaultOptions.frontStrokeWidth;
                    $scope.backStrokeColor = $scope.options.backStrokeColor ? $scope.options.backStrokeColor : _defaultOptions.backStrokeColor;
                    $scope.backStrokeWidth = $scope.options.backStrokeWidth ? $scope.options.backStrokeWidth : _defaultOptions.backStrokeWidth;
                    $scope.borderStrokeColor = $scope.options.borderStrokeColor ? $scope.options.borderStrokeColor : _defaultOptions.borderStrokeColor;
                    $scope.borderStrokeWidth = $scope.options.borderStrokeWidth ? $scope.options.borderStrokeWidth : _defaultOptions.borderStrokeWidth;
                };
                loadOptions();


                $scope.dashArray = 264;
                $scope.dashOffset = 264;


                $scope.$watch("value", function () {
                    var j = Math.ceil($scope.frontStrokeColors.length * $scope.value / 100) - 1;
                    $scope.frontStrokeColor = $scope.frontStrokeColors[j];

                    $scope.dashOffset = $scope.dashArray - $scope.value * $scope.dashArray / 100;
                    $scope.deg = 90 - ($scope.value / 100 * 360) / 2;

                    //because if it is less than zero it means that is over 100%
                    if ($scope.dashOffset < 0) {
                        $scope.dashOffset = 0;
                        $scope.deg = 0;
                        $scope.frontStrokeColor = $scope.frontStrokeColors[$scope.frontStrokeColors.length - 1];
                    }


                });

                $scope.$watch("options", function () {
                    loadOptions();
                });


            },
            template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" perserveAspectRatio="xMinYMid" style="transform: rotate({{deg}}deg);">        <g>            <circle style="fill:none;" r="49" cy="50%" cx="50%"  stroke="{{borderStrokeColor}}" stroke-width="{{borderStrokeWidth}}"></circle>            <circle style="fill:none;" r="42" cy="50%" cx="50%" stroke="{{backStrokeColor}}" stroke-width="{{backStrokeWidth}}"></circle>            <circle style="fill:none;" id="circle" r="42" cy="50%" cx="50%" stroke-dasharray="{{dashArray}}" stroke-dashoffset="{{dashOffset}}"  stroke="{{frontStrokeColor}}" stroke-width="{{frontStrokeWidth}}"></circle>        </g>        <h1>{{title}}</h1>        <h2>{{name}}</h2>        <h3>{{subtitle}}</h3></svg>'
        }
    })
    ;
