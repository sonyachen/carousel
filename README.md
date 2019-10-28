Disclaimer: AlipesCarousel was writing by Sonya Chen for Alipes. It was published in npm for resuability. This version of AlipesCarousel is for resume purposes.

# AlipesCarousel 1.3.14

AlipesCarousel was created to provide custom carousel solutions designed by Alipes. It currently contains 3 different types of custom carousels.

## How to use
* npm install alipes-carousel
* require('alipes-carousel/js/alipesCarousel') for the javascript
* import '~alipes-carousel/scss/alipesCarousel.scss' for the scss

There are currently settings you can override:

###Default:
```js
$('#my-carousel').alipesCarousel({
    type: 'sonyacel',
    navPrev: true,
    navPrevClass: 'prev',
    navPrevContent: '&lt;',
    navNext: true,
    navNextClass: 'next',
    navNextContent: '&gt;',
    indicators: true,
    transtionTextColor: true,
    carouselHeightBasedOnImage: false,
    defaultCarouselHeight: 500
});
```

### Settings
Option | Description
------ | -----------
type | Avaliable: 'sonyacel', 'singleSlide', and 'sudensel'
navPrev | bool value. Show previous arrow navigation
navPrevClass | Add custom class to the previous arrow navigation
navPrevContent | Change the arrows to your own custom version
navNext | bool value. Show next arrow navigation
navNextClass | Add custom class to the next arrow navigation
navNextContent | Change the arrows to your own custom version
indicators | true/false value. Add dot indicators
transtionTextColor | true/false value. Transition the background color for the text slider
carouselHeightBasedOnImage | bool value. Allows the carousel to size based on the images used. Only used in sonyacel
defaultCarouselHeight | int value. Only used when carouselHeightBasedOnImage is TRUE. Only used in sonyacel

### Methods
$('#my-carousel').alipesCarousel().destroy();

Removes all the event listeners in the carousel


## SingleSlider
In order to use this feature, you must install hammerjs for mobile support (touch guestures)
Uses 2.0.8 as of 10/17/2017


## Standalone Installation
1. npm install
2. npm run build or webpack
3. php -S localhost:8000
4. navigate to localhost:8000 in browser
5. profit