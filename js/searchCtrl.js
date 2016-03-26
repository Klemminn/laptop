laptops.controller("searchCtrl", function($scope,$rootScope,$timeout) {
    $scope.searchSort = ["price", "price"];
    $rootScope.intel = {};
    $rootScope.amd = {};
    $rootScope.sizes = [[10],[12],[13],[14],[15],[17]];
    $rootScope.intelCpuTypes = [["Atom"],["Celeron"],["Pentium"],["Core M"],["i3"],["i5"],["i7"],["Xeon"]];
    $rootScope.amdCpuTypes = [["FX"],["E2"],["E6"],["A4"],["A6"],["A8"],["A10"]];
    $rootScope.cpuTypes = $rootScope.intelCpuTypes.concat($rootScope.amdCpuTypes);
    $rootScope.thisYear = new Date().getFullYear();
    $scope.selectedLaptop = $rootScope.laptops[0];
    $scope.resultLimit = 50;

    $scope.showLaptop = function(laptop) {
        $scope.selectedLaptop = laptop;
        $("#imageModal").modal()
    };

    $scope.changeSort = function(sortBy) {
        if (sortBy == "gpu") {
            $scope.searchSort = $scope.searchSort[0] == "gpu_vendor" ? ["-gpu_vendor", "gpu_model"] : ["gpu_vendor", "gpu_model"]
        } else {
            $scope.searchSort = $scope.searchSort[0] == sortBy ? ['-' + sortBy, "price"] : [sortBy, "price"];
        }
    };

    $scope.checkSort = function(column) {
        if ($scope.searchSort[0].indexOf(column) > -1) {
            return $scope.searchSort[0].indexOf("-") > -1 ? 1 : -1;
        }
        return false;
    };

    $scope.getDiskText = function(capacity, type) {
        return ((capacity >= 1000) ? capacity/1000 + "TB " : capacity + "GB ") + type;
    };

    $scope.getImageLink = function(laptop, size) {
        return "images/laptops/" + laptop.id + size + ".jpeg";
    };

    $scope.toggle = function(item, cpuVendor) {
        if (item == 'intel' || item == 'amd') {
            $rootScope[item].toggled = $rootScope[item].toggled != true;
            for (var i = 0; i < $rootScope[item + "CpuTypes"].length; i++) {
                $rootScope[item + "CpuTypes"][i].toggled = $rootScope[item].toggled;
            }
        } else {
            if (cpuVendor && $rootScope[cpuVendor].toggled && item.toggled) {
                $rootScope[cpuVendor].toggled = false;
            }
            item.toggled = item.toggled != true;
        }
    };

    $scope.toggleCollapse = function (element) {
        //$(element).collapse("toggle");
    };


    // Harða disk slider
    var hddSlider = document.getElementById('hddSlider');
    var hddRange = {'min': $rootScope.hdd_capacity[0][0], 'max': $rootScope.hdd_capacity[$rootScope.hdd_capacity.length-1][0]};
    var percent;
    for (var i = 1; i < $rootScope.hdd_capacity.length-1; i++) {
        //percent = Math.round(($rootScope.hdd_capacity[i][0]/hddRange.max)*100) + "%";
        percent = Math.round((i/$rootScope.hdd_capacity.length)*100) + "%";
        hddRange[percent] = $rootScope.hdd_capacity[i][0];
    }
    noUiSlider.create(hddSlider, {
        connect: true,
        snap: true,
        start: [ $rootScope.hdd_capacity[0][0], $rootScope.hdd_capacity[$rootScope.hdd_capacity.length-1][0] ],
        range: hddRange
    });
    var hddLabels = [
        document.getElementById('hdd-lower'),
        document.getElementById('hdd-higher')
    ];

    hddSlider.noUiSlider.on('update', function(values, handle) {
        $timeout(function() {
            $rootScope.hddLower = values[0];
            $rootScope.hddHigher = values[1];
        }, 1);
        hddLabels[handle].innerHTML = $scope.getDiskText(Math.round(values[handle]),"");
    });

    // Vinnsluminnis slider
    var ramSlider = document.getElementById('ramSlider');
    var ramRange = {'min': $rootScope.ram_sizes[0][0], 'max': $rootScope.ram_sizes[$rootScope.ram_sizes.length-1][0]};
    for (var i = 1; i < $rootScope.ram_sizes.length-1; i++) {
        //percent = Math.round(($rootScope.ram_sizes[i][0]/ramRange.max)*100) + "%";
        percent = Math.round((i/$rootScope.ram_sizes.length)*100) + "%";
        ramRange[percent] = $rootScope.ram_sizes[i][0];
    }
    noUiSlider.create(ramSlider, {
        connect: true,
        snap: true,
        start: [ ramRange.min, ramRange.max ],
        range: ramRange
    });
    var ramLabels = [
        document.getElementById('ram-lower'),
        document.getElementById('ram-higher')
    ];
    ramSlider.noUiSlider.on('update', function(values, handle ) {
        $timeout(function() {
            $rootScope.ramLower = values[0];
            $rootScope.ramHigher = values[1];
        });
        ramLabels[handle].innerHTML = Math.round(values[handle]) + "GB";
    });

    // Upplausnar slider
    var resolutionSlider = document.getElementById('resolutionSlider');

    noUiSlider.create(resolutionSlider, {
        connect: true,
        step: 1,
        start: [ 0, $rootScope.display_resolutions.length-1 ],
        range: {
            "min": 0,
            "max": $rootScope.display_resolutions.length-1
        }
    });

    var resolutionLabels = [
        document.getElementById('resolution-lower'),
        document.getElementById('resolution-higher')
    ];

    resolutionSlider.noUiSlider.on('update', function(values, handle ) {
        $timeout(function() {
            $rootScope.resolutionLowerIndex = Math.round(values[0]);
            $rootScope.resolutionHigherIndex = Math.round(values[1]);
        });
        resolutionLabels[handle].innerHTML = $rootScope.display_resolutions[Math.round(values[handle])];
    });

    // Verð slider
    var roundThousand = function(number, type) {
        return Math[type](Number(number)/1000)*1000;
    };
    var priceSlider = document.getElementById('priceSlider');
    var priceRange = {
        'min': roundThousand($rootScope.price_range[0][0], 'floor'),
        '75%': roundThousand(Number($rootScope.price_range[0][1])/3, 'ceil'),
        'max': roundThousand($rootScope.price_range[0][1],'ceil')};

    noUiSlider.create(priceSlider, {
        connect: true,
        start: [ priceRange.min, priceRange.max],
        range: priceRange
    });

    // Tengjum input við slider
    var priceLabels = [
        document.getElementById('price-lower'),
        document.getElementById('price-higher')
    ];

    // Fylgjumst með breytingum á inputi
    priceLabels[0].addEventListener('change', function() {
        priceSlider.noUiSlider.set([this.value, null]);
    });
    priceLabels[1].addEventListener('change', function() {
        priceSlider.noUiSlider.set([null, this.value]);
    });

    priceSlider.noUiSlider.on('update', function(values, handle ) {
        $timeout(function() {
            $rootScope.priceLower = roundThousand(values[0],'round');
            $rootScope.priceHigher = roundThousand(values[1],'round');
        });
        priceLabels[handle].value = roundThousand(values[handle],'round');
    });
});
