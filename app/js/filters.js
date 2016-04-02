laptops.filter('thousandSeparator', function() {
    return function(input) {
        return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
});

laptops.filter('limitText', function() {
    return function(input, limit) {
        if (input.length <= limit-3) {
            return input;
        } else {
            return input.toString().substr(0,limit) + "...";
        }
    }
});

laptops.filter('getHtml', function($sce) {
    return function(input) {
        return $sce.trustAsHtml(input);
    }
});

laptops.filter('searchFilter', function($rootScope) {
    return function(input) {
        if (input) {
            var filtered = [];
            var buttonCategories = ["brands","stores","sizes","cpuTypes","hdd_types","gpu_vendors"];
            var toggled = {};
            var add, item, category;
            for (var i = 0; i < buttonCategories.length; i++) {
                category = buttonCategories[i];
                toggled[category] = [];
                for (var j = 0; j < $rootScope[category].length; j++) {
                    if ($rootScope[category][j].toggled) {
                        toggled[category].push($rootScope[category][j][0]);
                    }
                }
            }
            for (var i = 0; i < input.length; i++) {
                item = input[i];
                // Finnum index á upplausn þessarar tölvu til þess að geta borið hana saman við valin gildi
                for (var j = 0; j < $rootScope.display_resolutions.length; j++) {
                    if (item.display_resolution == $rootScope.display_resolutions[j][0]) {
                        item.resolutionIndex = j;
                        break;
                    }
                }
                // Leitum eftir verslun
                add = (toggled.stores.length == 0 || $.inArray(item.store, toggled.stores) > -1);
                if (add == false) continue;
                // Leitum eftir framleiðanda
                add = (toggled.brands.length == 0 || $.inArray(item.brand, toggled.brands) > -1);
                if (add == false) continue;
                // Leitum eftir skjástærð
                if (toggled.sizes.length > 0) {
                    if (Math.floor(item.display_size) == 11) {
                        add = $.inArray(12, toggled.sizes) > -1;
                    } else {
                        add = $.inArray(Math.floor(item.display_size), toggled.sizes) > -1;
                    }
                    if (add == false) continue;
                }
                // Leitum eftir örgjörva
                add = (toggled.cpuTypes.length == 0 || $.inArray(item.cpu_type, toggled.cpuTypes) > -1);
                if (add == false) continue;
                // Leitum eftir stærð harðs disks
                add = (item.hdd_capacity >= Number($rootScope.hddLower) && item.hdd_capacity <= Number($rootScope.hddHigher));
                if (add == false) continue;
                // Leitum eftir upplausn
                add = (item.resolutionIndex >= $rootScope.resolutionLowerIndex && item.resolutionIndex <= $rootScope.resolutionHigherIndex);
                if (add == false) continue;
                // Leitum eftir týpu af hörðum disk
                add = (toggled.hdd_types.length == 0 || $.inArray(item.hdd_type, toggled.hdd_types) > -1);
                if (add == false) continue;
                // Leitum eftir skjákorti
                add = (toggled.gpu_vendors.length == 0 || $.inArray(item.gpu_vendor, toggled.gpu_vendors) > -1);
                if (add == false) continue;
                // Leitum eftir vinnsluminni
                add = (item.ram >= Number($rootScope.ramLower) && item.ram <= Number($rootScope.ramHigher));
                if (add == false) continue;
                // Leitum eftir verði
                add = (item.price >= Number($rootScope.priceLower) && item.price <= Number($rootScope.priceHigher));
                if (add == false) continue;
                filtered.push(item);
            }
            return filtered;
        }
        return input;
    }
});

