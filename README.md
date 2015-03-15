Image Viewer
============

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
    <img src="path/to/image1.jpg" title="Image 1" />
    <img src="path/to/image2.jpg" title="Image 2" />
    <img src="path/to/image3.jpg" title="Image 3" />
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
npm install gulp-jshint gulp-ruby-sass gulp-concat gulp-uglify gulp-rename --save-dev
```

```
gulp watch
```

Version History
---------------

**1.0.0**

* Initial release