(function ($) {

    var defaults = {
        "interfaceTop": true, // Show the top details bar
        "interfaceNav": true, // Show the next and previous buttons
        "loadAtStart": 2 // How many images to load on init (minimum: 2)
    };

    $.fn.imageViewer = function (options) {

        if (this.length === 0) {
            return this;
        }

        var viewer = {},
            el = this;

        viewer.settings = $.extend({}, defaults, options);
        viewer.images = el.children(".image");
        viewer.firstImage = viewer.images.slice(0, 1);
        viewer.numImages = viewer.images.length;
        viewer.currentImage = el.children(".active");

        var init = function () {

            // Build the interface if required
            if (viewer.settings.interfaceTop) {
                buildInterface("top");
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
            $(".image").bind("click", function (e) {
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

        };

        var buildInterface = function (interface) {
            if (interface == "top") {
                el.before(
                    '<section id="top" class="interface">' +
                    '<ul class="details">' +
                    '<li class="image-title"><span class="value"></span>' +
                    '<li class="image-src"><span class="label">Filename:</span> <span class="value"></span>' +
                    '<li class="image-width"><span class="label">Width:</span> <span class="value"></span>' +
                    '<li class="image-height"><span class="label">Height:</span> <span class="value"></span>' +
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
            setImageDetails(image);
            loadImages(nextImage());
            loadImages(prevImage());
        };

        var nextImage = function () {
            var activePosition = $('.active').index();
            if (activePosition == viewer.numImages - 1) {
                return $(".image").first();
            } else {
                return $(".active").next();
            }
        };

        var prevImage = function () {
            var activePosition = $('.active').index();
            if (activePosition === 0) {
                return $(".image").last();
            } else {
                return $(".active").prev();
            }
        };

        var setImageDetails = function (image) {
            var details = {
                'title': image.attr("data-title"),
                'src': image.attr("data-src").replace(/^.*[\\\/]/, ''),
                'width': image.attr("data-orig-width"),
                'height': image.attr("data-orig-height")
            };
            $(".image-title .value").text(details.title);
            $(".image-src .value").text(details.src);
            $(".image-width .value").text(details.width);
            $(".image-height .value").text(details.height);
        };

        var toggleImageSize = function (image) {
            var origWidth = image.attr("data-orig-width");
            var origHeight = image.attr("data-orig-height");
            if (image.hasClass("original")) {
                image.removeClass("original");
                image.css("width", "100%");
                image.css("height", "100%");
                $(".interface").removeClass("hidden");
            } else {
                image.addClass("original");
                image.css("width", origWidth + "px");
                image.css("height", origHeight + "px");
                $(".interface").addClass("hidden");
            }
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
                        setImageDetails(image);
                    }
                };

            });
        };

        // Initialize the app!
        init();

    };

}(jQuery));