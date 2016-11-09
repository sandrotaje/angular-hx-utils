angular.module('hxUtils')
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
    .filter('millisecondsToHxDonuts', function ($filter) {
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
    })
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
;