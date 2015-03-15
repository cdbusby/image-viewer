Image Viewer
============

A simple, lightweight jQuery plugin to quickly browse a list of viewport-scaled images with a full-size option.

Usage
-----

**Includes**

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="js/jquery.imageviewer.min.js"></script>
<link href="css/imageviewer.css" rel="stylesheet" />
```

**HTML**

```html
<div id="viewer">
    <div class="image" data-src="path/to/image1.jpg" data-title="Image 1"></div>
    <div class="image" data-src="path/to/image2.jpg" data-title="Image 2"></div>
    <div class="image" data-src="path/to/image3.jpg" data-title="Image 3"></div>
</div>
```

**JS**

```javascript
$(document).ready(function(){
    $("#viewer").imageViewer();
});
```

Settings
--------

**interfaceTop** Show the image information

```
default: true
options: boolean (true / false)
```

**interfaceNav** Show the next and previous arrows

```
default: true
options: boolean (true / false)
```

**keyboardNav** Allow keyboard image switching with the arrow keys

```
default: true
options: boolean (true / false)
```

**loadAtStart** How many images to load on init

```
default: 2
options: int (min 2)
```

Build Instructions
------------------

```
npm install --save-dev gulp
```

```
npm install gulp-jshint gulp-ruby-sass gulp-minify-css gulp-livereload gulp-concat gulp-uglify gulp-rename --save-dev
```

```
gulp watch
```

Version History
---------------

**0.1.0**

* Initial release