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
            var add, item, category, size;
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
                // Leitum eftir framleiðanda
                if (!add) continue; else add = (toggled.brands.length == 0 || $.inArray(item.brand, toggled.brands) > -1);
                // Leitum eftir skjástærð
                if (!add) continue; else {
                    if (toggled.sizes.length > 0) {
                        size = (Math.floor(item.display_size) == 11) ? 12 : item.display_size;
                        add = $.inArray(Math.floor(size), toggled.sizes) > -1;
                    }
                }
                // Leitum eftir örgjörva
                if (!add) continue; else add = (toggled.cpuTypes.length == 0 || $.inArray(item.cpu_type, toggled.cpuTypes) > -1);
                // Leitum eftir stærð harðs disks
                if (!add) continue; else add = (item.hdd_capacity >= Number($rootScope.hddLower) && item.hdd_capacity <= Number($rootScope.hddHigher));
                // Leitum eftir upplausn
                if (!add) continue; else add = (item.resolutionIndex >= $rootScope.resolutionLowerIndex && item.resolutionIndex <= $rootScope.resolutionHigherIndex);
                // Leitum eftir týpu af hörðum disk
                if (!add) continue; else add = (toggled.hdd_types.length == 0 || $.inArray(item.hdd_type, toggled.hdd_types) > -1);
                // Leitum eftir skjákorti
                if (!add) continue; else add = (toggled.gpu_vendors.length == 0 || $.inArray(item.gpu_vendor, toggled.gpu_vendors) > -1);
                // Leitum eftir vinnsluminni
                if (!add) continue; else add = (item.ram >= Number($rootScope.ramLower) && item.ram <= Number($rootScope.ramHigher));
                // Leitum eftir verði
                if (!add) continue; else add = (item.price >= Number($rootScope.priceLower) && item.price <= Number($rootScope.priceHigher));
                if (add == true) filtered.push(item);
            }
            return filtered;
        }
        return input;
    }
});

