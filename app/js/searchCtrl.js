laptops.controller("searchCtrl", ['$scope','$rootScope','$timeout','$routeParams','$http',
    function($scope,$rootScope,$timeout,$routeParams,$http) {
        $scope.searchSort = ["price", "price"];
        $rootScope.intel = {};
        $rootScope.amd = {};
        $rootScope.sizes = [[10],[12],[13],[14],[15],[17]];
        $rootScope.intelCpuTypes = [["Atom"],["Celeron"],["Pentium"],["Core M"],["i3"],["i5"],["i7"],["Xeon"]];
        $rootScope.amdCpuTypes = [["FX"],["E2"],["E6"],["A4"],["A6"],["A8"],["A10"]];
        $rootScope.cpuTypes = $rootScope.intelCpuTypes.concat($rootScope.amdCpuTypes);
        $rootScope.thisYear = new Date().getFullYear();
        $rootScope.selectedLaptop = $rootScope.laptops[0];
        $scope.resultLimit = 50;
        $scope.textFilter = {description: ""};
        var allCategories = ['amdCpuTypes','intelCpuTypes','brands','stores','sizes','hdd_types','gpu_vendors','display_resolutions'];
        new Clipboard('#clipboardButton');

        $scope.sendAnalyticsEvent = function(category,action,label) {
            ga('send', 'event', category, action, label, {
                'transport': 'beacon'
            });
        };

        var removeIcelandic = function(string) {
            string = string.toString().toLowerCase();
            var icelandic = {'á': 'a','ð': 'd','é': 'e','í': 'i','ó': 'o','ú': 'u','ý': 'y','þ': 'th','æ': 'ae','ö': 'o'};
            for (var letter in icelandic) {
                if (icelandic.hasOwnProperty(letter)) {
                    string = string.replace(new RegExp(letter, 'g'), icelandic[letter]);
                }
            }
            return string;
        };

        $scope.clearFilter = function() {
            for (var i = 0; i < allCategories.length; i++) {
                for (var j = 0; j < $rootScope[allCategories[i]].length; j++) {
                    $rootScope[allCategories[i]][j].toggled = false;
                }
            }
            resolutionSlider.noUiSlider.set([0,$rootScope.display_resolutions.length-1]);
            ramSlider.noUiSlider.set([ramRange.min, ramRange.max]);
            hddSlider.noUiSlider.set([hddRange.min, hddRange.max]);
            priceSlider.noUiSlider.set([priceRange.min, priceRange.max]);
            $scope.textFilter.description = "";
        };


        // Opnar modal glugga með upplýsingum um staka fartölvu
        $scope.showLaptop = function(laptop) {
            laptop.largeImage = $scope.getImageLink(laptop,'large');
            laptop.disk = $scope.getDiskText(laptop.hdd_capacity, laptop.hdd_type);
            $rootScope.openModal('laptopModal','lg',laptop);
        };

        $rootScope.numberToCompare = 0;
        $scope.countComparison = function(trueOrFalse) {
            if (trueOrFalse) $rootScope.numberToCompare++; else $rootScope.numberToCompare--;
        };

        $scope.getComparison = function() {
            $rootScope.laptopsToCompare = [];
            var laptop;
            for (var i = 0; i < $rootScope.laptops.length; i++) {
                laptop = $rootScope.laptops[i];
                if (laptop.compare) {
                    laptop.largeImage = $scope.getImageLink(laptop,'large');
                    laptop.disk = $scope.getDiskText(laptop.hdd_capacity, laptop.hdd_type);
                    $rootScope.laptopsToCompare.push(laptop);
                }
            }
            $rootScope.openModal('comparisonModal','lg',$rootScope.laptopsToCompare);
        };

        // Opnar modal glugga með upplýsingum um ákveðinn eiginleika, s.s. skjástærð, örgjörva o.s.frv.
        $scope.getInfo = function (item) {
            $rootScope.openModal('propertyInfoModal','lg',infoForModals[item]);
        };

        // Breytir röðun í töflu
        $scope.changeSort = function(sortBy) {
            if (sortBy == "gpu") {
                $scope.searchSort = $scope.searchSort[0] == "gpu_vendor" ? ["-gpu_vendor", "gpu_model"] : ["gpu_vendor", "gpu_model"]
            } else {
                $scope.searchSort = $scope.searchSort[0] == sortBy ? ['-' + sortBy, "price"] : [sortBy, "price"];
            }
        };

        // Notað til að auðkenna hvaða dálk er raðað eftir í töflu
        $scope.checkSort = function(column) {
            if ($scope.searchSort[0].indexOf(column) > -1) {
                return $scope.searchSort[0].indexOf("-") > -1 ? 1 : -1;
            }
            return false;
        };

        // Umbreytir GB í TB ef þess er þörf
        $scope.getDiskText = function(capacity, type) {
            return ((capacity >= 1000) ? capacity/1000 + "TB " : capacity + "GB ") + type;
        };

        // Skilar link á mynd
        $scope.getImageLink = function(laptop, size) {
            return "images/laptops/" + laptop.id + size + ".jpeg";
        };

        // Velur- eða afvelur hnapp
        $scope.toggle = function(item, cpuVendor) {
            $scope.filterLink = "";
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

        // Opnar eða lokar röð
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
                $scope.filterLink = "";
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
                $scope.filterLink = "";
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
                $scope.filterLink = "";
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
                $scope.filterLink = "";
                $rootScope.priceLower = roundThousand(values[0],'round');
                $rootScope.priceHigher = roundThousand(values[1],'round');
            });
            priceLabels[handle].value = roundThousand(values[handle],'round').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        });

        // Virkjum þær síur sem koma inn með routeParam
        if(Object.keys($routeParams).length > 0) {
            var selected;
            for(var i = 0; i < allCategories.length; i++) {
                if ($routeParams[allCategories[i]] != undefined){
                    selected = $routeParams[allCategories[i]].split(",");
                    for(var j = 0; j < $rootScope[allCategories[i]].length; j++) {
                        $rootScope[allCategories[i]][j].toggled = $.inArray(removeIcelandic($rootScope[allCategories[i]][j][0]), selected) > -1;
                    }
                }
            }
            if($routeParams["ram"]) ramSlider.noUiSlider.set($routeParams["ram"].split(","));
            if($routeParams["hddSize"]) hddSlider.noUiSlider.set($routeParams["hddSize"].split(","));
            if($routeParams["price"]) priceSlider.noUiSlider.set($routeParams["price"].split(","));
            if($routeParams["resolution"]) {
                var resolutions = $routeParams["resolution"].split(",");
                var indexes = [];
                for (var i = 0; i < resolutions.length; i++) {
                    for (var j = 0; j < $rootScope.display_resolutions.length; j++) {
                        if (resolutions[i] == $rootScope.display_resolutions[j]) {
                            indexes.push(j);
                            break;
                        }
                    }
                }
                resolutionSlider.noUiSlider.set([indexes[0],indexes[1]]);
            }
            if($routeParams["description"]) $scope.textFilter = {description: $routeParams["description"]};
        }

        $scope.shareOnFacebook = function() {
            FB.ui({
                method: 'share',
                href: $scope.longFilterLink
            }, function(response){});
        };

        $scope.createLink = function() {
            var getSymbol = function(link) {
                return (link[link.length-1] == "?") ? "" : "&";
            };
            //var link = location.origin + "/#/search?";
            var link = "http://laptop.is/#/search?";
            var allCategories = ['amdCpuTypes','intelCpuTypes','brands','stores','sizes','hdd_types','gpu_vendors','display_resolutions'];
            var category;
            var selected;
            for (var i = 0; i < allCategories.length; i++) {
                category = $rootScope[allCategories[i]];
                selected = [];
                for (var j = 0; j < category.length; j++) {
                    if (category[j].toggled) selected.push(removeIcelandic(category[j][0]));
                }
                if (selected.length > 0) {
                    link = link + getSymbol(link) + allCategories[i] + "=" + selected.join();
                }
            }
            if ($rootScope.priceLower > priceRange.min || $rootScope.priceHigher < priceRange.max) {
                link = link + getSymbol(link) + "price=" + $rootScope.priceLower + "," + $rootScope.priceHigher;
            }
            if ($rootScope.ramLower > ramRange.min || $rootScope.ramHigher < ramRange.max) {
                link = link + getSymbol(link) + "ram=" + $rootScope.ramLower + "," + $rootScope.ramHigher;
            }
            if ($rootScope.hddLower > hddRange.min || $rootScope.hddHigher < hddRange.max) {
                link = link + getSymbol(link) + "hddSize=" + $rootScope.hddLower + "," + $rootScope.hddHigher;
            }
            if ($rootScope.resolutionLowerIndex > 0 || $rootScope.resolutionHigherIndex < $rootScope.display_resolutions.length-1) {
                link = link + getSymbol(link) + "resolution=" + $rootScope.display_resolutions[$rootScope.resolutionLowerIndex][0] + "," + $rootScope.display_resolutions[$rootScope.resolutionHigherIndex][0];
            }
            var textFilter = document.getElementById('textFilter').value;
            if ($scope.textFilter.description.length > 0) {
                link = link + getSymbol(link) + "description=" + $scope.textFilter.description;
            }
            $scope.longFilterLink = link;

            // Sækjum styttra URL frá
            gapi.client.setApiKey('AIzaSyAO-_WMv7v_ZD3bJbD6ILB0vh4kMaSJjR4');
            gapi.client.load('urlshortener', 'v1').then(function() {
                function useResponse(response) {
                    $timeout(function() {
                        $scope.filterLink = response.id;
                    },1);
                }
                var request = gapi.client.urlshortener.url.insert({
                    'longUrl': link
                });
                request.execute(useResponse);
            });
        };

        // Texti fyrir modal glugga v. eiginleika.
        var infoForModals = {
            "vendor": {
                "title": "Framleiðandi",
                "body": "<div>Framleiðandi tölvunnar skiptir helst máli þegar kemur að bilanatíðni og þjónustu við tölvuna þegar eitthvað kemur upp á.<br/>" +
                "<br/>Sumir framleiðendur hafa umboð hér á landi sem annast viðgerðir og þá er er viðgerðartími almennt styttri, þar sem ekki þarf að " +
                "senda tölvuna úr landi í ábyrgðarviðgerð og/eða bíða lengi eftir varahlutum. <br/>" +
                "<br/>Einnig ber að nefna að sumir framleiðendur bjóða alheimsábyrgð, þannig að ef ske kynni að tölvan bilaði erlendis, þá væri hægt að sækja þjónustu þar.</div>"
            },
            "size": {
                "title": "Skjástærð",
                "body": "<div>Skjástærð segir til um hversu stór skjárinn er, frá horni í horn.  Skjástærðin á myndinni hér að neðan er því 15.4\"<br/>" +
                "Almennt séð helst stærð og þyngd tölvunnar í hendur við skjástærðina.</div>" +
                "<br/><center><img src='images/screensize.png'></center>"
            },
            "resolution": {
                "title": "Upplausn",
                "body": "<div>Upplausn segir til um hversu margir pixlar eru á skjánum.  Því fleiri pixlar, því meira er vinnuplássið á skjánum.<br/>" +
                "Fyrri talan segir til um fjölda pixla lárétt yfir skjáinn og seinni talan lóðrétt.<br/>" +
                "<br/>Tökum sem dæmi skjá með upplausn 1920x1080, hann hefur 1920 pixla lárétt yfir skjáinn og 1080 pixla lóðrétt.<br/>Þessi upplausn er betur þekkt sem \"fullHD\"</div>"
            },
            "cpu": {
                "title": "Örgjörvi",
                "body": "<div>Örgjörvi segir til um hráa reiknigetu tölvunar.  Hann hefur því áhrif á hvernig notkun tölvan ræður við. " +
                "<br/><br/>Flestir örgjörvar í fartölvum sem seldar eru í dag duga fyrir venjulega heimilisnotkun, þ.e. vefráp og skóla- eða skrifstofuvinnslu.<br/>" +
                "Það er því óþarfi að fjárfesta í tölvum með mjög öflugum örgjörva ef ekki á að nota tölvuna mikið í mjög þunga vinnslu, s.s. hljóð- og myndvinnslu.<br/>" +
                "<br/>Almennt kæmi betur út þegar kaupa á tölvu fyrir heimilis- eða skólanotkun að leggja meiri áherslu á að tölvan sé með SSD disk eða mikið vinnsluminni," +
                " þar sem þeir þættir hafa talsvert meiri áhrif á notendaupplifun þeirra.</div>"
            },
            "disk": {
                "title": "Harður diskur",
                "body": "<div>Diskur tölvunar er það geymslurými sem tölvan hefur.<br/>" +
                "Á síðustu árum hafa verið að ryðja sér til rúms svo kallaðir Solid State Diskar (SSD), sem eru í raun ekki harðir diskar heldur flash minni.<br/>" +
                "Slíkir diskar eru margfalt hraðari og gera tölvuna því liprari og skemmtilegri í notkun.  Hins vegar eru þeir einnig dýrari og oft hafa þeir takmarkað geymslurými.<br/>" +
                "Því hafa einnig komið fram SSHD diskar, sem eru hybrid, þ.e. eru í grunninn hefðbundnir harðir diskar, en þó með flash minni sem heldur utan um mest notuðu gögnin.  " +
                "Slíkir diskar brúa því að einhverju leiti bilið milli HDD og SSD, bjóða upp á stærðina sem HDD býður og smá hraðaaukningu með flash minninu.<br/><br/>" +
                "<b>SSD diskar hafa gífurleg áhrif á notendaupplifun, þar sem þeir hraða flestum aðgerðum.</b></div>"
            },
            "ram": {
                "title": "Vinnsluminni",
                "body": "<div>Vinnsluminni tölvunar segir til um hversu mikið magn af upplýsingum tölvan getur haldið utan um, án þess að þurfa að sækja þær af disk.<br/>" +
                "Þegar vinnsluminni fyllist, þá skrifar tölvan upplýsingarnar á harðan disk. Vinnsluminnið er töluvert hraðara heldur en diskur tölvunnar, " +
                "og því er ráðlegt að stærð vinnsluminnis sé í samræmi við það sem tölvan á að vera notuð í.<br/>" +
                "Ef notandi vinnur með þung forrit, er almennt með mörg forrit opin í einu, eða mjög marga glugga í vafra, þá þarf hann talsvert vinnsluminni.<br/><br/>" +
                "Við kaup á tölvu er það <b>magn</b> vinnsluminnis sem skiptir máli, <b>ekki hraði þess</b>.  MHz tölur vinnsluminnis er eitthvað sem þarf ekki að hafa í huga við kaup á fartölvu, " +
                "þar sem hraðamunurinn er mögulega mælanlegur en ekki sjáanlegur.</div>"
            },
            "gpu": {
                "title": "Skjákort",
                "body": "<div>Skjákort/skjástýring fartölvu hefur áhrif á grafíska vinnslugetu tölvunar.<br/>" +
                "Skjákortið er því helst mikilvægt fyrir þá sem eru í þungri grafískri vinnslu, s.s. þrívíddarteikningu eða tölvuleikjum.<br/>" +
                "<br/>Erfitt er að sjá út frá nöfnunum á skjástýringunum hversu öflugar þær eru, því er helst hægt að benda á raunverulega prófanir á þeim, svo sem hjá" +
                " <a href='http://www.notebookcheck.net/Mobile-Graphics-Cards-Benchmark-List.844.0.html' target='_blank'>NotebookCheck.net</a></div>"
            }
        };
    }]);
