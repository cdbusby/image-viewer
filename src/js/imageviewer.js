(function ($) {

    var defaults = {
        "selector": ".image", // Class of images to be includes
        "interfaceTop": true, // Show the top details bar
        "interfaceBottom": true, // Show the bottom details bar
        "interfaceNav": true, // Show the next and previous buttons
        "keyboardNav": true, // Enable arrow keys to navigate images
        "loadAtStart": 2 // How many images to load on init (minimum: 2)
    };

    $.fn.imageViewer = function (options) {

        if ($(this).length === 0) {
            return $(this);
        }

        var viewer = {},
            el = $(this);

        viewer.settings = $.extend({}, defaults, options);
        viewer.images = el.children(viewer.settings.selector);
        viewer.firstImage = viewer.images.slice(0, 1);
        viewer.numImages = viewer.images.length;
        viewer.currentImage = el.children(".active");

        var init = function () {

            // Build the interface if required
            if (viewer.settings.interfaceTop) {
                buildInterface("top");
            }
            if (viewer.settings.interfaceBottom) {
                buildInterface("bottom");
            }
            if (viewer.settings.interfaceNav) {
                buildInterface("nav");
            }

            // Load the first image, set it as the active image
            loadImages(viewer.firstImage, true);
            setActiveImage(viewer.firstImage);

            // Check to see if we need to load more than two images off the bat
            if (viewer.settings.loadAtStart > 2) {
                // If the setting is higher than the number of images, set it to the number of images
                if (viewer.settings.loadAtStart > viewer.numImages) {
                    viewer.settings.loadAtStart = viewer.numImages;
                }
                loadImages(viewer.images.slice(2, viewer.settings.loadAtStart), false);
            }

            // Bind image click to toggle image size
            $(viewer.settings.selector).bind("click", function (e) {
                e.preventDefault();
                toggleImageSize($(this));
            });

            // Bind click events for preview and next image
            $(".nav-item").bind("click", function (e) {
                e.preventDefault();
                if ($(this).hasClass("next")) {
                    setActiveImage(nextImage());
                } else {
                    setActiveImage(prevImage());
                }
            });

            // Listen for keypress inside viewer
            if (viewer.settings.keyboardNav) {
                $(document).keydown(function(e) {
                    if (e.keyCode == 37) {
                        imageSizeScaled(prevImage());
                        setActiveImage(prevImage());
                    } else if (e.keyCode == 39) {
                        imageSizeScaled(nextImage());
                        setActiveImage(nextImage());
                    }
                });
            }

            // Listen for window resize and adjust some variables
            $(window).resize(function() {
                var width = el.width();
                var height = el.height();

                setImageDetails(el.find('.active'), width, height);
            });

        };

        var buildInterface = function (interface) {
            if (interface == "top") {
                el.before(
                    '<section id="top" class="interface">' +
                    '<ul class="details">' +
                        '<li class="image-position"><span class="value"></span>' +
                        '<li class="image-title"><span class="value"></span>' +
                        '<li class="image-src"><span class="label">Filename:</span> <span class="value"></span>' +
                    '</ul>' +
                    '</section>'
                );
            }
            if (interface == "bottom") {
                el.before(
                    '<section id="bottom" class="interface">' +
                    '<ul class="details">' +
                        '<li class="image-width"><span class="label">Width:</span> <span class="value"></span>' +
                        '<li class="image-height"><span class="label">Height:</span> <span class="value"></span>' +
                        '<li class="image-scale"><span class="label">Scale:</span> <span class="value"></span>' +
                        '<li class="image-download"><a href="#" target="_blank">Download</a>' +
                    '</ul>' +
                    '</section>'
                );
            }
            if (interface == "nav") {
                el.before(
                    '<section id="nav" class="interface">' +
                    '<a href="#" class="nav-item prev">Previous</a>' +
                    '<a href="#" class="nav-item next">Next</a>' +
                    '</section>'
                );
            }
        };

        var setActiveImage = function (image) {
            viewer.images.removeClass("active");
            image.addClass("active");
            $(window).trigger('resize');
            loadImages(nextImage());
            loadImages(prevImage());
        };

        var nextImage = function () {
            var activePosition = $('.active').index();
            if (activePosition == viewer.numImages - 1) {
                return $(viewer.settings.selector).first();
            } else {
                return $(".active").next();
            }
        };

        var prevImage = function () {
            var activePosition = $('.active').index();
            if (activePosition === 0) {
                return $(viewer.settings.selector).last();
            } else {
                return $(".active").prev();
            }
        };

        var setImageDetails = function (image, width, height) {
            var details = {
                'title': image.attr("data-title"),
                'src': image.attr("data-src").replace(/^.*[\\\/]/, ''),
                'width': image.attr("data-orig-width"),
                'height': image.attr("data-orig-height"),
                'scale': getImageScale(image, width, height)
            };
            $(".image-position .value").text(image.index()+1 + "/" + viewer.numImages);
            $(".image-title .value").text(details.title);
            $(".image-src .value").text(details.src);
            $(".image-width .value").text(details.width);
            $(".image-height .value").text(details.height);
            $(".image-scale .value").text(details.scale);
            $(".image-download a").attr("href", image.attr("data-src"));
        };

        // Still a work in progress
        var getImageScale = function(image, width, height) {
            var scale,
                viewerWidth = width,
                viewerHeight = height,
                imageWidth = image.attr("data-orig-width"),
                imageHeight = image.attr("data-orig-height");
            var viewerRatio = viewerWidth / viewerHeight;
            var imageRatio = imageWidth / imageHeight;
            if (imageRatio < 1) {
                if (viewerRatio > imageRatio) {
                    scale = viewerHeight / imageHeight;
                } else {
                    scale = viewerWidth / imageWidth;
                }
            } else {
                if (imageRatio > viewerRatio) {
                    scale = viewerWidth / imageWidth;
                } else {
                    scale = viewerHeight / imageHeight;
                }
            }
            return Math.round(scale * 100) + "%";
        };

        var toggleImageSize = function (image) {
            if (image.hasClass("original")) {
                imageSizeScaled(image);
            } else {
                imageSizeOriginal(image);
            }
        };

        var imageSizeScaled = function(image) {
            image.removeClass("original");
            image.css("width", "100%");
            image.css("height", "100%");
            $(".interface").removeClass("hidden");
        };

        var imageSizeOriginal = function(image) {
            var origWidth = image.attr("data-orig-width");
            var origHeight = image.attr("data-orig-height");
            image.addClass("original");
            image.css("width", origWidth + "px");
            image.css("height", origHeight + "px");
            $(".interface").addClass("hidden");
        };

        var loadImages = function (images, updateDetails) {
            images.each(function (index) {
                var image = $(this);
                var imageEl = new Image();
                imageEl.src = image.attr("data-src");
                imageEl.onload = function () {
                    var imageWidth = imageEl.width;
                    var imageHeight = imageEl.height;
                    image.attr("data-orig-width", imageWidth);
                    image.attr("data-orig-height", imageHeight);
                    image.css("background-image", "url(" + imageEl.src + ")");
                    image.addClass('loaded');
                    if (updateDetails) {
                        $(window).trigger('resize');
                    }
                };

            });
        };

        // Initialize the app!
        return el.each(function() {
            init();
        });

    };

}(jQuery));