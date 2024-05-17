

"use strict";

var mapListings;
$(document).ready(function () {

    var config = {
        mapboxToken: 'pk.eyJ1Ijoiem9sdGFudGhlbWVzYmVyZyIsImEiOiJjazZqaWUwcWswYTBvM21td2Jmcm5mYmdyIn0.7_5YCbbOFRnvqZzCNDo9fw',
        mapboxId: 'mapbox/streets-v10'
    };

    // preloader
    var $preloader = $('.preloader');
    if($preloader.length) {
        $preloader.delay(1500).slideUp();
    }

    var baseLatLng = [-18.877938, 47.5373728];;

    var zoom = 5;

    var listings = []
    var markers =[]

    mapListings = L.map('mapListings').setView(baseLatLng, zoom);

    // var zoomLevel = mapListings.getZoom();

    fetch("/getAllSupplier").then(res=>res.json())
    .then(results=>{
        console.log(results);

        for(let res of results){

            // console.log(res);
            listings.push({
                url: res.company_url,
                latLng: [res.latitude, res.longitude],
                name: res.company_name,
                price: res.nif,
                people: res.stat,
                sqFt: res.rcs,
                rating: 3,
                adresse : res.address,
                photo : res.company_photo,
            })
        }

        $.each(listings, function(index, listing) {

            var i;
            var ratingStarsHtml = '';
            for (i = 1; i <= 5; i++) {
                if (i < listing.rating) {
                    ratingStarsHtml += '<i class="star fas fa-star text-warning"></i>'
                } else {
                    ratingStarsHtml += '<i class="star far fa-star text-gray-500"></i>'
                }
              }

            var popupHtml = `

                <div class="card card-article-wide no-gutters no-hover p-0">
                    <img src="${listing.photo?listing.photo:"../assets/images/default_pdc.jpg"}" class="card-img-top-map" alt="...">
                    <div class="card-body py-1 px-2">
                        <h4 class="h6 font-weight-normal mb-2"><a href="${listing.url}">${listing.name}</a></h4>
                        <div class="d-flex font-small">
                            ${ratingStarsHtml}
                            <span class="badge badge-pill badge-secondary map-badge ml-2">${listing.rating}</span>
                        </div>
                        <span class="font-small text-dark font-weight-bold">Adresse : ${listing.adresse}</span>
                    </div>
                </div>
                
                
            `;

            var randomColor = getRandomColor();
            var randomColorFill = getRandomColor();

            var marker = L.marker(listing.latLng, { icon: createFlexibleIcon(randomColorFill) }).addTo(mapListings);

            marker.bindTooltip('<span class="custom-tooltip" style="pointer:cursor;color:'+randomColor+'">'+listing.name+'</span>', {
                permanent: true, // Le tooltip est affiché en permanence
                direction: 'left', // Direction du tooltip
                className: 'custom-tooltip', // Classe CSS personnalisée pour le tooltip
              }).openTooltip();

            marker.bindPopup(popupHtml);

            markers.push(marker);

        });
        
    })


    // Écouter les événements de zoom sur la carte
    mapListings.on('zoomend', function() {
        var zoomLevel = mapListings.getZoom();
        markers.forEach(function(marker) {
            // marker.setIcon(createFlexibleIcon(20)); // Ajustez le facteur de zoom selon vos besoins
        });
        // adjustMarkers(zoomLevel);
    });


    // var listings = [
    //     {
    //         url: 'single-space.html',
    //         latLng: [37.70, -122.41],
    //         name: 'Meeting Workspace',
    //         price: '$99',
    //         people: '12',
    //         sqFt: '120',
    //         rating: 3
    //     },
    //     {
    //         url: 'single-space.html',
    //         latLng: [37.59, -122.39],
    //         name: 'Private Workspace',
    //         price: '$49',
    //         people: '12',
    //         sqFt: '123',
    //         rating: 4
    //     },
    //     {
    //         url: 'single-space.html',
    //         latLng: [37.52, -122.29],
    //         name: 'Lifestyle Workspace',
    //         price: '$120',
    //         people: '3',
    //         sqFt: '120',
    //         rating: 5
    //     },
    //     {
    //         url: 'single-space.html',
    //         latLng: [37.37, -122.12],
    //         name: 'Basic Workspace',
    //         price: '$299',
    //         people: '5',
    //         sqFt: '180',
    //         rating: 5
    //     },
    //     {
    //         url: 'single-space.html',
    //         latLng: [37.36, -121.94],
    //         name: 'Collaborative Workspace',
    //         price: '$1200',
    //         people: '30',
    //         sqFt: '1200',
    //         rating: 5
    //     }
    // ]


    if ($('#map-listings').length) {

        var icon = L.icon({
            iconUrl: '../assets/images/marker.png',
        
            // iconSize:     [38, 95], // size of the icon
            iconSize:     [38, 40], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            iconAnchor:   [22, 38], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        // modal listing view
        
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: config.mapboxId,
            accessToken: config.mapboxToken
        }).addTo(mapListings);

        // $.each(listings, function(index, listing) {

        //     var i;
        //     var ratingStarsHtml = '';
        //     for (i = 1; i <= 5; i++) {
        //         if (i < listing.rating) {
        //             ratingStarsHtml += '<i class="star fas fa-star text-warning"></i>'
        //         } else {
        //             ratingStarsHtml += '<i class="star far fa-star text-gray-500"></i>'
        //         }
        //       }

        //     var popupHtml = `
        //         <a href="${listing.url}" class="card card-article-wide flex-column no-gutters no-hover">
        //             <div class="card-body py-0 d-flex flex-column justify-content-between col-12">
        //                 <h4 class="h6 font-weight-normal mb-3">${listing.name}</h4>
        //                 <div class="d-flex font-small">
        //                     ${ratingStarsHtml}
        //                     <span class="badge badge-pill badge-secondary map-badge ml-2">${listing.rating}</span>
        //                 </div>
        //                 <div class="d-flex justify-content-between my-3">
        //                     <div class="col pl-0">
        //                         <span class="text-muted font-xs d-block mb-1">Price</span>
        //                         <span class="font-small text-dark font-weight-bold">${listing.price}</span>
        //                     </div>
        //                     <div class="col">
        //                         <span class="text-muted font-xs d-block mb-1">Size</span>
        //                         <span class="font-small text-dark font-weight-bold">${listing.people}</span>
        //                     </div>
        //                     <div class="col pr-0">
        //                         <span class="text-muted font-xs d-block mb-1">Sq.Ft</span>
        //                         <span class="font-small text-dark font-weight-bold">${listing.sqFt}</span>
        //                     </div>
        //                 </div>
        //             </div>
        //         </a>
        //     `;

        //     var marker = L.marker(listing.latLng, { icon: icon }).addTo(mapListings);
        //     marker.bindPopup(popupHtml);
        // });

        // must render map again after modal is shown
        $('#map-listings').on('shown.bs.modal', function() {
            // preloader
            var $preloadermap = $('.preloadermap');
            if($preloadermap.length) {
                $preloadermap.delay(1500).fadeOut('slow');
                mapListings.invalidateSize();
            }
        });

    }

    if ($('#mapListings2').length) {

        var icon = L.icon({
            iconUrl: '../assets/img/marker.svg',
        
            iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        // modal listing view
        var mapListings2 = L.map('mapListings2').setView(baseLatLng, zoom);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: config.mapboxId,
            accessToken: config.mapboxToken
        }).addTo(mapListings2);

        $.each(listings, function(index, listing) {

            var i;
            var ratingStarsHtml = '';
            for (i = 1; i <= 5; i++) {
                if (i < listing.rating) {
                    ratingStarsHtml += '<i class="star fas fa-star text-warning"></i>'
                } else {
                    ratingStarsHtml += '<i class="star far fa-star text-gray-500"></i>'
                }
              }

            var popupHtml = `
                <a href="${listing.url}" class="card card-article-wide flex-column no-gutters no-hover">
                    <div class="card-body py-0 d-flex flex-column justify-content-between col-12">
                        <h4 class="h5 font-weight-normal mb-3">${listing.name}</h4>
                        <div class="d-flex font-small">
                            ${ratingStarsHtml}
                            <span class="badge badge-pill badge-secondary map-badge ml-2">${listing.rating}</span>
                        </div>
                        <div class="d-flex justify-content-between my-3">
                            <div class="col pl-0">
                                <span class="text-muted font-xs d-block mb-1">Price</span>
                                <span class="font-small text-dark font-weight-bold">${listing.price}</span>
                            </div>
                            <div class="col">
                                <span class="text-muted font-xs d-block mb-1">Size</span>
                                <span class="font-small text-dark font-weight-bold">${listing.people}</span>
                            </div>
                            <div class="col pr-0">
                                <span class="text-muted font-xs d-block mb-1">Sq.Ft</span>
                                <span class="font-small text-dark font-weight-bold">${listing.sqFt}</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;

            var marker = L.marker(listing.latLng, { icon: icon }).addTo(mapListings2);
            marker.bindPopup(popupHtml);
        });

    }

    // options
    var breakpoints = {
        sm: 540,
        md: 720,
        lg: 960,
        xl: 1140
    };

    var $navbarCollapse = $('.navbar-main .collapse');

    // Collapse navigation
    $navbarCollapse.on('hide.bs.collapse', function () {
        var $this = $(this);
        $this.addClass('collapsing-out');
        $('html, body').css('overflow', 'initial');
    });

    $navbarCollapse.on('hidden.bs.collapse', function () {
        var $this = $(this);
        $this.removeClass('collapsing-out');
    });

    $navbarCollapse.on('shown.bs.collapse', function () {
        $('html, body').css('overflow', 'hidden');
    });

    $('.navbar-main .dropdown').on('hide.bs.dropdown', function () {
        var $this = $(this).find('.dropdown-menu');

        $this.addClass('close');

        setTimeout(function () {
            $this.removeClass('close');
        }, 200);

    });

    $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
        if (!$(this).next().hasClass('show')) {
          $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        var $subMenu = $(this).next(".dropdown-menu");
        $subMenu.toggleClass('show');
      
        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
          $('.dropdown-submenu .show').removeClass("show");
        });
      
        return false;
    });

    if ($(document).width() >= breakpoints.lg) {
        $('.nav-item.dropdown').hover(function() {
            $(this).find('> .dropdown-toggle').dropdown('toggle');
        },
        function () {
            $(this).removeClass('show');
            $(this).find('.dropdown-menu').removeClass('show');
            $(this).find('> .dropdown-toggle').attr('aria-expanded', 'false');
        });
    
        $('.dropdown-menu a.dropdown-toggle').hover(function() {
            if (!$(this).next().hasClass('show')) {
                $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
              }
              var $subMenu = $(this).next(".dropdown-menu");
              $subMenu.toggleClass('show');
            
              $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
                $('.dropdown-submenu .show').removeClass("show");
              });
            
              return false;
        },
        function () {
            $(this).removeClass('show');
            $(this).find('.dropdown-menu').removeClass('show');
            $(this).attr('aria-expanded', false);
        });
    }

    // Headroom - show/hide navbar on scroll
    if ($('.headroom')[0]) {
        var headroom = new Headroom(document.querySelector("#navbar-main"), {
            offset: 0,
            tolerance: {
                up: 0,
                down: 0
            },
        });
        headroom.init();
    }

    // Background images for sections
    $('[data-background]').each(function () {
        $(this).css('background-image', 'url(' + $(this).attr('data-background') + ')');
    });

    $('[data-background-inner]').each(function () {
        $(this).find('.inner-bg').css('background-image', 'url(' + $(this).attr('data-background-inner') + ')');
    });

    $('[data-background-color]').each(function () {
        $(this).css('background-color', $(this).attr('data-background-color'));
    });

    $('[data-color]').each(function () {
        $(this).css('color', $(this).attr('data-color'));
    });

    // Datepicker
    $('.datepicker')[0] && $('.datepicker').each(function () {
        $('.datepicker').datepicker({
            disableTouchKeyboard: true,
            autoclose: false,
        });
    });

    $('.availability')[0] && $('.availability').each(function () {
        $('.availability').datepicker({
            disableTouchKeyboard: true,
            autoclose: false,
            daysOfWeekDisabled: [0, 4, 2]
        });
    });

    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Popover
    $('[data-toggle="popover"]').each(function () {
        var popoverClass = '';
        if ($(this).data('color')) {
            popoverClass = 'popover-' + $(this).data('color');
        }
        $(this).popover({
            trigger: 'focus',
            template: '<div class="popover ' + popoverClass + '" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        })
    });

    //Fancybox
    $('[data-fancybox="images"]').fancybox({
        afterLoad : function(instance, current) {
          var pixelRatio = window.devicePixelRatio || 1;
      
          if ( pixelRatio > 1.5 ) {
            current.width  = current.width  / pixelRatio;
            current.height = current.height / pixelRatio;
          }
        }
    });

    // Additional .focus class on form-groups
    $('.form-control').on('focus blur', function (e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');

    // NoUI Slider
    if ($(".input-slider-container")[0]) {
        $('.input-slider-container').each(function () {

            var slider = $(this).find('.input-slider');
            var sliderId = slider.attr('id');
            var minValue = slider.data('range-value-min');
            var maxValue = slider.data('range-value-max');

            var sliderValue = $(this).find('.range-slider-value');
            var sliderValueId = sliderValue.attr('id');
            var startValue = sliderValue.data('range-value-low');

            var c = document.getElementById(sliderId),
                d = document.getElementById(sliderValueId);

            noUiSlider.create(c, {
                start: [parseInt(startValue)],
                connect: [true, false],
                //step: 1000,
                range: {
                    'min': [parseInt(minValue)],
                    'max': [parseInt(maxValue)]
                }
            });

        })
    }

    if ($("#input-slider-range")[0]) {
        var c = document.getElementById("input-slider-range"),
            d = document.getElementById("input-slider-range-value-low"),
            e = document.getElementById("input-slider-range-value-high"),
            f = [d, e];

        noUiSlider.create(c, {
            start: [parseInt(d.getAttribute('data-range-value-low')), parseInt(e.getAttribute('data-range-value-high'))],
            connect: !0,
            tooltips: true,
            range: {
                min: parseInt(c.getAttribute('data-range-value-min')),
                max: parseInt(c.getAttribute('data-range-value-max'))
            }
        }), c.noUiSlider.on("update", function (a, b) {
            f[b].textContent = a[b]
        })
    }

    if ($("#input-slider-range-map")[0]) {
        var c = document.getElementById("input-slider-range-map"),
            d = document.getElementById("input-slider-range-map-value-low"),
            e = document.getElementById("input-slider-range-map-value-high"),
            f = [d, e];

        noUiSlider.create(c, {
            start: [parseInt(d.getAttribute('data-range-value-low')), parseInt(e.getAttribute('data-range-value-high'))],
            connect: !0,
            tooltips: true,
            range: {
                min: parseInt(c.getAttribute('data-range-value-min')),
                max: parseInt(c.getAttribute('data-range-value-max'))
            }
        }), c.noUiSlider.on("update", function (a, b) {
            f[b].textContent = a[b]
        })
    }

    if ($("#input-slider-vertical-1")[0]) {
        var c = document.getElementById("input-slider-vertical-1"),
            d = document.getElementById("input-slider-range-value-low-3"),
            e = document.getElementById("input-slider-range-value-high-3"),
            f = [d, e];

        noUiSlider.create(c, {
            start: [parseInt(d.getAttribute('data-range-value-low')), parseInt(e.getAttribute('data-range-value-high'))],
            connect: !0,
            tooltips: false,
            orientation: 'vertical',
            range: {
                min: parseInt(c.getAttribute('data-range-value-min')),
                max: parseInt(c.getAttribute('data-range-value-max'))
            }
        }), c.noUiSlider.on("update", function (a, b) {
            f[b].textContent = a[b]
        })
    }

    if ($("#input-slider-vertical-2")[0]) {
        var c = document.getElementById("input-slider-vertical-2"),
            d = document.getElementById("input-slider-range-value-low"),
            e = document.getElementById("input-slider-range-value-high"),
            f = [d, e];

        noUiSlider.create(c, {
            start: [parseInt(d.getAttribute('data-range-value-low')), parseInt(e.getAttribute('data-range-value-high'))],
            connect: !0,
            tooltips: true,
            orientation: 'vertical',
            pips: {
                mode: 'positions',
                values: [0, 25, 50, 75, 100],
                density: 5
            },
            range: {
                min: parseInt(c.getAttribute('data-range-value-min')),
                max: parseInt(c.getAttribute('data-range-value-max'))
            }
        }), c.noUiSlider.on("update", function (a, b) {
            f[b].textContent = a[b]
        })
    }

    //Chartist

    if($('.ct-chart-5').length) {
        //Chart 5
          new Chartist.Bar('.ct-chart-5', {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            series: [
              [5, 4, 3, 7, 5, 10, 3],
              [3, 2, 9, 5, 4, 6, 4]
            ]
          }, {
            low: 0,
            showArea: true,
            plugins: [
              Chartist.plugins.tooltip()
            ],
            axisX: {
                // On the x-axis start means top and end means bottom
                position: 'end'
            },
            axisY: {
                // On the y-axis start means left and end means right
                showGrid: false,
                showLabel: false,
                offset: 0
            }
        });
    }

    if($('.ct-chart-7').length) {
        var data = {
            series: [30, 40, 10, 20]
          };
          
          var sum = function(a, b) { return a + b };
          
          new Chartist.Pie('.ct-chart-7', data, {
            labelInterpolationFnc: function(value) {
              return Math.round(value / data.series.reduce(sum) * 100) + '%';
            },            
            low: 0,
            high: 8,
            fullWidth: false,
            plugins: [
              Chartist.plugins.tooltip()
            ],
        });         
    }

    $('#modal-notification').on('shown.bs.modal', function (event) {
        new Chartist.Line('.ct-chart-statistics', {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            series: [
                [0, 0, 50, 60, 90, 140, 200, 330, 400, 500, 700, 760, 880, 900, 1000]
            ]
            }, {
            low: 0,
            showArea: true,
            fullWidth: true,
            plugins: [
              Chartist.plugins.tooltip()
            ],
        });
    });

    $('#modal-notification-2').on('shown.bs.modal', function (event) {
        new Chartist.Line('.ct-chart-statistics-2', {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            series: [
                [0, 0, 50, 60, 90, 140, 200, 330, 400, 500, 700, 760, 880, 900, 1000]
            ]
            }, {
            low: 0,
            showArea: true,
            fullWidth: true,
            plugins: [
              Chartist.plugins.tooltip()
            ],
        });
    });

    $('#modal-notification-3').on('shown.bs.modal', function (event) {
        new Chartist.Line('.ct-chart-statistics-3', {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            series: [
                [0, 0, 50, 60, 90, 140, 200, 330, 400, 500, 700, 760, 880, 900, 1000]
            ]
            }, {
            low: 0,
            showArea: true,
            fullWidth: true,
            plugins: [
              Chartist.plugins.tooltip()
            ],
        });
    });

    $('#modal-notification-4').on('shown.bs.modal', function (event) {
        new Chartist.Line('.ct-chart-statistics-4', {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            series: [
                [0, 0, 50, 60, 90, 140, 200, 330, 400, 500, 700, 760, 880, 900, 1000]
            ]
            }, {
            low: 0,
            showArea: true,
            fullWidth: true,
            plugins: [
              Chartist.plugins.tooltip()
            ],
        });
    });

    //vmap
    if($('#vmap').length) {
        $('#vmap').vectorMap(
          {
              map: 'usa_en',
              backgroundColor: '#ffffff',
              borderColor: '#ffffff',
              borderOpacity: 0,
              borderWidth: 1,
              color: '#e9ecef',
              enableZoom: false,
              hoverColor: '#0E1B48',
              hoverOpacity: null,
              normalizeFunction: 'linear',
              scaleColors: ['#b6d6ff', '#005ace'],
              selectedColor: '#0E1B48',
              selectedRegions: null,
              showTooltip: true,
              onLabelShow: function(event, label, code)
              {
                label.text(label.text() + ': ' + Math.floor((Math.random() * 10000) + 1) + ' session');
              }
          });
    }

    $(".progress-bar").each(function () {
        $(this).waypoint(function () {
            var progressBar = $(".progress-bar");
            progressBar.each(function (indx) {
                $(this).css("width", $(this).attr("aria-valuenow") + "%");
            });
            $('.progress-bar').css({
                animation: "animate-positive 3s",
                opacity: "1"
            });
        }, {
                triggerOnce: true,
                offset: '60%'
            });
    });

    //Owl Carousel

    $('.basic-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        dots: false,
        navElement: 'button type="button" aria-label="navigation button link" role="presentation"',
        responsive: {
            0: {
                items: 1
            },
            500: {
                items: 1
            },
            700: {
                items: 2
            },
            1000: {
                items: 3
            }
        },
        navText: [
			'<span class="fas fa-chevron-left"</span>',
			'<span class="fas fa-chevron-right"</span>'
		],
    });

    $('.clients-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        navElement: 'button type="button" aria-label="github social link" role="presentation"',
        dots: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        },
        navText: [
            '<span class="fas fa-chevron-left"></span>',
            '<span class="fas fa-chevron-right"></span>'
        ]
    });

    $('.testimonial-carousel').owlCarousel({
        loop: true,
        margin: 8,
        nav: true,
        dots: false,
        navElement: 'button type="button" aria-label="github social link" role="presentation"',
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        },
        navText: [
            '<span class="fas fa-chevron-left"></span>',
            '<span class="fas fa-chevron-right"></span>'
        ]
    });

    // Review stars rating
    $('.stars-rating .star').on('mouseover', function() {
        var rating = $(this).attr('data-rating-value');
        $('.stars-rating .star').each(function(value) {
            if (value + 1 <= rating) {
                $(this).removeClass('text-gray');
                $(this).addClass('text-warning');
            }
            if (value >= rating) {
                $(this).addClass('text-gray');
                $(this).removeClass('text-warning');
                $(this).removeClass('fas');
                $(this).addClass('far');
            }
        });
        $(this).on('click', function() {
            $(this).parent().addClass('rated');
            $('.stars-rating .star').each(function(value) {
                if (value + 1 <= rating) {
                    $(this).removeClass('text-gray');
                    $(this).addClass('text-warning');
                    $(this).removeClass('far');
                    $(this).addClass('fas');
                }
            });
            $('#rating').val(rating);
        });
    });
    $('.stars-rating').on('mouseleave', function() {
        if (!$(this).hasClass('rated')) {
            $('.stars-rating .star').each(function() {
                $(this).addClass('text-gray');
                $(this).removeClass('text-warning');
                $(this).addClass('far');
                $(this).removeClass('fas');
            });
        }
    });

    if($('#profile-sidebar').length) {
        var profileSidebar = new StickySidebar('#profile-sidebar', {
            containerSelector: '#spaces-container',
            innerWrapperSelector: '.sidebar-inner',
            topSpacing: 150,
            leftSpacing: 40
        });
    }

    // When in viewport
    $('[data-toggle="on-screen"]')[0] && $('[data-toggle="on-screen"]').onScreen({
        container: window,
        direction: 'vertical',
        doIn: function () {
            //alert();
        },
        doOut: function () {
            // Do something to the matched elements as they get off scren
        },
        tolerance: 200,
        throttle: 50,
        toggleClass: 'on-screen',
        debug: false
    });

    // Scroll to anchor with scroll animation
    $('[data-toggle="scroll"]').on('click', function (event) {
        var hash = $(this).attr('href');
        var offset = $(this).data('offset') ? $(this).data('offset') : 0;

        // Animate scroll to the selected section
        $('html, body').stop(true, true).animate({
            scrollTop: $(hash).offset().top - offset
        }, 600);

        event.preventDefault();
    });

    //Rotating Cards
    $(document).on('click', '.card-rotate .btn-rotate', function () {
        var $rotating_card_container = $(this).closest('.rotating-card-container');

        if ($rotating_card_container.hasClass('hover')) {
            $rotating_card_container.removeClass('hover');
        } else {
            $rotating_card_container.addClass('hover');
        }
    });
    
    //Smooth scroll
    var scroll = new SmoothScroll('a[href*="#"]', {
        speed: 500,
        speedAsDuration: true
    });

    // Equalize height to the max of the elements
    if ($(document).width() >= breakpoints.lg) {

        // object to keep track of id's and jQuery elements
        var equalize = {
            uniqueIds: [],
            elements: []
        };

        // identify all unique id's
        $('[data-equalize-height]').each(function () {
            var id = $(this).attr('data-equalize-height');
            if (!equalize.uniqueIds.includes(id)) {
                equalize.uniqueIds.push(id)
                equalize.elements.push({ id: id, elements: [] });
            }
        });

        // add elements in order
        $('[data-equalize-height]').each(function () {
            var $el = $(this);
            var id = $el.attr('data-equalize-height');
            equalize.elements.map(function (elements) {
                if (elements.id === id) {
                    elements.elements.push($el);
                }
            });
        });

        // equalize
        equalize.elements.map(function (elements) {
            var elements = elements.elements;
            if (elements.length) {
                var maxHeight = 0;

                // determine the larget height
                elements.map(function ($element) {
                    maxHeight = maxHeight < $element.outerHeight() ? $element.outerHeight() : maxHeight;
                });

                // make all elements with the same [data-equalize-height] value
                // equal the larget height
                elements.map(function ($element) {
                    $element.height(maxHeight);
                })
            }
        });
    }

    // update target element content to match number of characters
    $('[data-bind-characters-target]').each(function () {
        var $text = $($(this).attr('data-bind-characters-target'));
        var maxCharacters = parseInt($(this).attr('maxlength'));
        $text.text(maxCharacters);

        $(this).on('keyup change', function (e) {
            var string = $(this).val();
            var characters = string.length;
            var charactersRemaining = maxCharacters - characters;
            $text.text(charactersRemaining);
        })
    });

    // copy docs
    $('.copy-docs').on('click', function () {
        var $copy = $(this);
        var htmlEntities = $copy.parents('.nav-wrapper').siblings('.card').find('.tab-pane:last-of-type').html();
        var htmlDecoded = $('<div/>').html(htmlEntities).text().trim();

        var $temp = $('<textarea>');
        $('body').append($temp);
        console.log(htmlDecoded);
        $temp.val(htmlDecoded).select();
        document.execCommand('copy');
        $temp.remove();

        $copy.text('Copied!');
        $copy.addClass('copied');

        setTimeout(function () {
            $copy.text('Copy');
            $copy.removeClass('copied');
        }, 1000);
    });

    $('.current-year').text(new Date().getFullYear());

    var $slideForm = $('#spaceSubmitForm');
    $('#slideform-btn-submit').text('Send');
    $('#spaceSubmitForm').slideform({});

    $('#loadOnClick').click(function () {
        var $button = $(this);
        var $loadContent = $('#extraContent');
        var $allLoaded = $('#allLoadedText');
        $button.addClass('btn-loading');
        $button.attr('disabled', true);

        setTimeout(function () {
            $loadContent.show();
            $button.hide();
            $allLoaded.show();
        }, 1500);
    });

    if($('#filters-sidebar').length && $(window).width() > 1200) {
        var sidebar = new StickySidebar('#filters-sidebar', {
            containerSelector: '#filters-container',
            innerWrapperSelector: '.sidebar-inner',
            topSpacing: 20,
            leftSpacing: 40
        });
    } else {
        if ($('#filters-sidebar').length) {
            $('#show-filters-button').on('click', function () {
                if($(this).text() === 'Show filters') {
                    $('#filters-sidebar').removeClass('d-none');
                    $(this).text('Hide filters');
                } else {
                    $('#filters-sidebar').addClass('d-none');
                    $(this).text('Show filters');
                }
                
            });
        }
    }

    if($('#profile-sidebar').length) {
        var profileSidebar = new StickySidebar('#profile-sidebar', {
            containerSelector: '#spaces-container',
            innerWrapperSelector: '.sidebar-inner',
            topSpacing: 150,
            leftSpacing: 40
        });
    }

    $('a[href=".full-search"]').on('click', function(event) {
        event.preventDefault();
        $('.full-search').addClass('open');
        $('.full-search > form > input[type="search"]').focus();
    });
    
    $('.full-search, .full-search button.close').on('click keyup', function(event) {
        if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
            $(this).removeClass('open');
        }
    });
    
    // $('form').submit(function(event) {
    //     event.preventDefault();
    //     return false;
    // })    

});   


function openUserSignup(){
// $("#registerUser").collapse("show")
// $("#registerSupplier").collapse("hide")
document.querySelector("#types").value = "client"
}

function openSupplierSignup(){
    // $("#registerUser").collapse("hide")
    // $("#registerSupplier").collapse("show")
document.querySelector("#types").value = "vendor"
}


function choosePlan(id, val){

    Swal.fire({
        title: "Payement d'abonnement",
        input: "text",
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Envoyer",
        cancelButtonText: "Annuler",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
          try {

            let plane = {
                "0": "0",
                "5000": "1",
                "8000": "2",
                "15000": "3",
                "35000": "4",
                "50000": "5"
            }

            const baseUrl = `/update-plan`;

            const queryParams = {
                id: id,
                plan: val
              };

              let url = baseUrl + '?' + new URLSearchParams(queryParams);

              // Envoi de la requête GET

              if(plane[login.toString()] == val){
                fetch(url)
                .then(async response => {
                  if (!response.ok) {
                    return Swal.showValidationMessage(`
                        ${JSON.stringify(await response.json())}
                    `);
                  }
                  return response.json();
                })
                .then(data => {
                  console.log('Response data:', data);
                })
                .catch(error => {
                  console.error('Error during fetch:', error);
                }).finally(() => {
                  // Masquer le chargement après 5 secondes
                  setTimeout(() => {
                    Swal.hideLoading();
                    window.location.href = "/page/pricing"
                  }, 5000);
                });
              }else{
                Swal.showValidationMessage(`
                    Veuillez saisir un montant valide.
                `);
              }
              
              
          } catch (error) {
            console.log(error);
            Swal.showValidationMessage(`
              Request failed: ${error}
            `);
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Changement de plan en cours...',
                willOpen: () => {
                  Swal.showLoading();
                }
            });
        }
      });

}

function demandeGeolocalisation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // alert(`Latitude: ${latitude}, Longitude: ${longitude}`);
        }, (error) => {
            console.error('Erreur de géolocalisation:', error);
        });
    } else {
        console.error('La géolocalisation n\'est pas prise en charge par ce navigateur.');
    }
}

// Fonction pour générer une couleur aléatoire
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Fonction pour créer une icône flexible en fonction du niveau de zoom
function createFlexibleIcon(color) {
    // Créer une icône SVG avec un cercle de la taille spécifiée

    var svg2 = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="35" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
    <g> <path fill="#e94419" d="M128,10c-45.6,0-82.6,37-82.6,82.6C45.4,138.2,128,246,128,246s82.6-107.8,82.6-153.4 C210.6,47,173.6,10,128,10z M128,133.9c-22.8,0-41.3-18.5-41.3-41.3s18.5-41.3,41.3-41.3s41.3,18.5,41.3,41.3 S150.8,133.9,128,133.9z"/></g>
    </svg>
    `
    let svg =`
            <svg width="32" height="35" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 656.467 656.467" xml:space="preserve">
            <g>
                <g>
                    <g>
                        <path style="fill:${color};" d="M328.238,46.77c88.254,0,160.025,71.801,160.025,160.006c0,88.244-71.781,160.016-160.025,160.016
                            c-88.234,0-159.996-71.781-159.996-160.016C168.242,118.571,240.004,46.77,328.238,46.77 M328.238,0
                            C214.035,0,121.433,92.582,121.433,206.786c0,114.243,206.805,449.682,206.805,449.682s206.795-335.449,206.795-449.691
                            C535.044,92.572,442.471,0,328.238,0z M414.089,146.689h-25.315v-1.573c0-33.306-27.151-60.448-60.507-60.448
                            s-60.458,27.142-60.458,60.448v1.573h-25.344L227.655,311.6h201.226L414.089,146.689z M328.258,92.064
                            c22.071,0,41.035,13.502,49.017,32.711c-10.513-15.818-28.568-26.292-49.017-26.292c-20.439,0-38.446,10.493-49.027,26.35
                            C287.262,105.615,306.197,92.064,328.258,92.064z M278.958,146.689c4.953-22.735,25.158-39.784,49.31-39.784
                            c24.162,0,44.405,17.039,49.31,39.784H278.958z"/>
                    </g>
                </g>
            </g>
        </svg>
    `
    return L.divIcon({
        iconSize : [32, 35],
        html: svg,
        iconAnchor: [16, 30],
        popupAnchor: [0, -20],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
        popupAnchor:  [0, -20],
        className: 'flexible-icon'
    });
}

function syncMap(item){
    var lat = parseFloat(item.getAttribute('data-lat'));
    var lng = parseFloat(item.getAttribute('data-lng'));
    mapListings.setView([lat, lng], 10);
}
