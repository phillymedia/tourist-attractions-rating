var text = require("../text.json")
var Kaleidoscope = require('kaleidoscopejs');

$(document).ready(function() {

    var map = L.map('map').setView([
        39.9526, -75.1652
    ], 14);

    // L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}' + (
    //     L.Browser.retina
    //     ? '@2x'
    //     : '') + '.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'}).addTo(map);

    map.scrollWheelZoom.disable();

    var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' + (
        L.Browser.retina
        ? '@2x'
        : '') + '.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    var icon = L.divIcon({
        className: 'icon',
        iconSize: 22,
        iconAnchor: [
            11, 22
        ],
        html: '<i class="fa fa-certificate"></i>'
    });

    var icon2 = L.divIcon({
        className: 'icon2',
        iconSize: 30,
        iconAnchor: [
            15, 30
        ],
        html: '<i class="fa fa-map-marker"></i>'
    });

    // var geojson = L.geoJson(data, {
    // 	pointToLayer: function(feature, latlng) {
    //         return L.marker(latlng, {
    //             icon: icon
    //         })
    //     }
    // }).addTo(map)

    // var geojson2 = L.geoJson(text, {
    // 	pointToLayer: function(feature, latlng) {
    //         return L.marker([feature.lat, feature.long], {
    //             icon: icon
    //         })
    //     }
    // }).addTo(map);
    var tileURL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}' + (
        L.Browser.retina
        ? '@2x'
        : '') + '.png';
    var allmarkers = L.featureGroup();
    text.forEach(function(r, i) {
        var marker = L.marker([
            r.lat, r.long
        ], {icon: icon}).addTo(allmarkers).bindPopup(`
                        <div class="popupText">
                        <div class="name">${r.name}</div>
                        <div class="address">${r.address}</div>
                        <div class="website">
                        <div class="markerScroll" data-scroll=""><a class="gotoRest">Scroll to rating</a></div>
                        </div>`);

        marker.data = r;
        r.marker = marker;

        marker.on("click", function(e) {
            var getname = e.target.data.name;
            var jumpname = getname.replace(/\s+/g, '-').replace(/\.+/g, '').replace('&', 'and').replace(/\’+/g, '');

            $(".gotoRest").click(function() {
                var headerPosition = Number($('.header').height()) + Number($('.header').css('top').replace('px', ''));
                $('html,body').animate({
                    scrollTop: $("#" + jumpname).offset().top - 50 - headerPosition
                }, 'slow');
            })
        })
        var mapName = 'lilMap' + (
        i + 1);

        if ($(`#${mapName}`).length > 0) {
            L.map(mapName, {
                zoomControl: false,
                dragging: false,
                scrollWheelZoom: false
            }).setView([
                r.lat, r.long
            ], 15).addLayer(L.tileLayer(tileURL)).addLayer(L.marker([
                r.lat, r.long
            ], {icon: icon2}));
        }
    })

    allmarkers.addTo(map)

    map.fitBounds(allmarkers.getBounds())

    $(".leaflet-marker-icon.icon").each(function(r, i) {
        $(this).append(`<span class="iconlabel">${r + 1}</span>`)
    })

    window.addEventListener('load', function() {
        var allimages = $(".lazy-load");
        allimages.each(function() {
            var dsrc = $(this).attr("data-src");
            if (!$(this).attr("src")) {
                $(this).attr("src", dsrc)
            }
        })
    }, false)

    $(".jItems a").each(function() {
        var $this = $(this);
        var getText = $(this).html().trim();
        var jumpname = getText.replace(/\s+/g, '-').replace(/\.+/g, '').replace('&', 'and').replace(/\’+/g, '');
        $this.click(function() {
            var headerPosition = Number($('.header').height()) + Number($('.header').css('top').replace('px', ''));
            $('html,body').animate({
                scrollTop: $("#" + jumpname).offset().top - 50 - headerPosition
            }, 'slow');
        })
    })

    var loadGalleryImage = function(frame) {
        var img = frame.find("img");
        if (!img.attr("src")) {
            var datasrc = img.attr("data-src");
            img.attr("src", datasrc);
        }
        return img;
    };

    var advance = function(gallery, direction) {
        gallery.find(".noNext").removeClass("noNext");
        var caption = gallery.find(".caption");
        var current = gallery.find(".active");
        var images = $(".gallery-img", gallery);
        var index = images.index(current);
        var direction;
        if (direction == "right") {
            var next = $(images[index + 1]);
            var afterNext = $(images[index + 2]);

        } else {
            var next = $(images[index - 1]);
            var afterNext = $(images[index - 2]);
        }

        if (images.index(next) < 0)
            return;

        var image = loadGalleryImage(next);
        if (afterNext)
            loadGalleryImage(afterNext);

        gallery.find(".count").html(next.attr('data-index') * 1 + 1);

        $(".post-active").removeClass("post-active")
        $(".left").removeClass("left")
        $(".right").removeClass("right")

        function getOpp(d) {
            if (d == "left") {
                return "right"
            } else {
                return "left"
            }
        }

        afterNext.addClass("post-active " + direction)

        next.addClass("active");
        current.removeClass("active");
        current.addClass("post-active " + getOpp(direction))
    }

    $(".lf-gallery").each(function() {
        var $this = $(this);
        var photoc = $(this).find(".active img").attr("alt");
        var $cont = $(this).find(".caption");

        $this.find(".caption").html($this.find(".active img").attr("alt"));

        if ($(this).find(".gallery-img").length < 2) {
            $(this).find(".arrow").remove();
            return;
        }
        $(this).find(".arrow").on("click", function() {
            var direction = $(this).attr("class");
            advance(
                $this, direction.includes("next")
                ? "right"
                : "left");
            $this.find(".caption").html($this.find(".active img").attr("alt"));
        })

    })

    $(".active").next(".gallery-img").addClass("post-active right")

    var viewer;

    if ($(".reviewText").width() > 800) {
        var videoWidth = 800
    } else {
        var videoWidth = $(".reviewText").width()
    }
    var videoHeight = videoWidth * .55;

    viewer = new Kaleidoscope.Video({source: 'http://media.philly.com/storage/inquirer/special%20project%20media/tourism17/RS1252475_ReadingTerminal.mp4', containerId: '#video360', loop: true, height: videoHeight, width: videoWidth, autoplay: false});
    viewer.render();



    $(window).on('resize', function() {

        viewer.destroy();

        if ($(".reviewText").width() > 800) {
            var videoWidth = 800
        } else {
            var videoWidth = $(".reviewText").width()
        }
        var videoHeight = videoWidth * .55;

        viewer = new Kaleidoscope.Video({source: 'http://media.philly.com/storage/inquirer/special%20project%20media/tourism17/RS1252475_ReadingTerminal.mp4', containerId: '#video360', loop: true, height: videoHeight, width: videoWidth, autoplay: false});
        viewer.render();
    })

    $(window).on("scroll", function() {
        var elementTop = $('.videowrapper').offset().top;
        var elementBottom = elementTop + $('.videowrapper').outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        if(elementBottom > viewportTop && elementTop < viewportBottom) {
            viewer.play();
            $(".fa-play-circle").addClass('controlOff')
            $(".fa-pause-circle").removeClass('controlOff')

        } else {
            viewer.pause()
            $(".fa-play-circle").removeClass('controlOff')
            $(".fa-pause-circle").addClass('controlOff')
        }
    })

    $(".fa-play-circle").click(function(){
        $(window).unbind('scroll');

        viewer.play();
        $(".fa-play-circle").addClass('controlOff')
        $(".fa-pause-circle").removeClass('controlOff')
    })
    $(".fa-pause-circle").click(function(){
        $(window).unbind('scroll');

        viewer.pause()
        $(".fa-play-circle").removeClass('controlOff')
        $(".fa-pause-circle").addClass('controlOff')
    })

});



// var data = require("./data.json")
