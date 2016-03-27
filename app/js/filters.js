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
            var add, item;
            var cpuTypes = $rootScope.intelCpuTypes.concat($rootScope.amdCpuTypes);
            var toggledBrands = [];
            for (var i = 0; i < $rootScope.brands.length; i++) {
                if ($rootScope.brands[i].toggled) {
                    toggledBrands.push($rootScope.brands[i][0])
                }
            }
            var toggledStores = [];
            for (var i = 0; i < $rootScope.brands.length; i++) {
                if ($rootScope.stores[i].toggled) {
                    toggledStores.push($rootScope.stores[i][0])
                }
            }
            var toggledSizes = [];
            for (var i = 0; i < $rootScope.sizes.length; i++) {
                if ($rootScope.sizes[i].toggled) {
                    toggledSizes.push($rootScope.sizes[i][0])
                }
            }
            var toggledCpuTypes = [];
            for (var i = 0; i < cpuTypes.length; i++) {
                if (cpuTypes[i].toggled) {
                    toggledCpuTypes.push(cpuTypes[i][0]);
                }
            }
            var toggledHddTypes = [];
            for (var i = 0; i < $rootScope.hdd_types.length; i++) {
                if ($rootScope.hdd_types[i].toggled) {
                    toggledHddTypes.push($rootScope.hdd_types[i][0]);
                }
            }
            var toggledGpuVendors = [];
            for (var i = 0; i < $rootScope.gpu_vendors.length; i++) {
                if ($rootScope.gpu_vendors[i].toggled) {
                    toggledGpuVendors.push($rootScope.gpu_vendors[i][0]);
                }
            }
            for (var i = 0; i < input.length; i++) {
                item = input[i];
                for (var j = 0; j < $rootScope.display_resolutions.length; j++) {
                    if (item.display_resolution == $rootScope.display_resolutions[j][0]) {
                        item.resolutionIndex = j;
                        break;
                    }
                }
                // Leitum eftir framleiðanda
                add = (toggledBrands.length == 0 || $.inArray(item.brand, toggledBrands) > -1);
                if (add == false) continue;
                add = (toggledStores.length == 0 || $.inArray(item.store, toggledStores) > -1);
                if (add == false) continue;
                // Leitum eftir skjástærð
                if (toggledSizes.length > 0) {
                    if (Math.floor(item.display_size) == 11) {
                        add = $.inArray(12, toggledSizes) > -1;
                    } else {
                        add = $.inArray(Math.floor(item.display_size), toggledSizes) > -1;
                    }
                    if (add == false) continue;
                }
                // Leitum eftir örgjörva
                add = (toggledCpuTypes.length == 0 || $.inArray(item.cpu_type, toggledCpuTypes) > -1);
                if (add == false) continue;
                // Leitum eftir hörðum disk
                add = (item.hdd_capacity >= Number($rootScope.hddLower) && item.hdd_capacity <= Number($rootScope.hddHigher));
                if (add == false) continue;
                // Leitum eftir upplausn
                add = (item.resolutionIndex >= $rootScope.resolutionLowerIndex && item.resolutionIndex <= $rootScope.resolutionHigherIndex);
                if (add == false) continue;
                add = (toggledHddTypes.length == 0 || $.inArray(item.hdd_type, toggledHddTypes) > -1);
                if (add == false) continue;
                // Leitum eftir vinnsluminni
                add = (item.ram >= Number($rootScope.ramLower) && item.ram <= Number($rootScope.ramHigher));
                if (add == false) continue;
                // Leitum eftir skjákorti
                add = (toggledGpuVendors.length == 0 || $.inArray(item.gpu_vendor, toggledGpuVendors) > -1);
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

