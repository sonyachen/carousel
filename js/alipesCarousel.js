var $ = require('jquery');
var hammer = require ('hammerjs');

(function($) {
    $.fn.alipesCarousel = function(options) {
        var settings = $.extend({
            type: 'sonyacel',
            navPrev: true,
            navPrevClass: '',
            navPrevContent: '&lt;',
            navNext: true,
            navNextClass: '',
            navNextContent: '&gt;',
            indicators: true,
            transtionTextColor: true,
            carouselHeightBasedOnImage: false,
            defaultCarouselHeight: 500,
        }, options);

        // Function from David Walsh: http://davidwalsh.name/css-animation-callback
        // Checks if animations are executing
        function whichTransitionEvent() {
            var t,
                el = document.createElement('fakeelement');

            var transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd',
            };

            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }
        function sonyacel($carousel) {
            var lockdown = false;
            var currentTextIndex = 0;

            // Set up the $carousel
            textSlideColorChange(0, false);
            var $textSlider = $carousel.find('.text-slider');
            var $imageSlider = $carousel.find('.img-slider');

            if (settings.carouselHeightBasedOnImage) {
                $(function() {
                    sizeCarousel($image_slider, $text_slider);
                    $(window).resize(function() {
                        sizeCarousel($image_slider, $text_slider);
                    });
                });
            }

            // Prepend the navigation
            prependNavigation($textSlider);
            appendIndicators($textSlider, $imageSlider.find('img'));

            // Set first img-slider child as active
            $imageSlider.children().first().addClass('active');

            // Set up the text sliders using math that kinda doesn't make sense but it works.
            var $textSliderContainer = $textSlider.find('.slide-container');
            var $textSlides = $textSlider.find('.slide');

            var slideWidth = 100.0 / 3;
            var $firstSlide = $textSlides.first();
            var $lastSlide = $textSlides.last();

            // Clone the last slide and add as first element
            $lastSlide.clone().prependTo($textSliderContainer);

            // Clone the first slide and add as last element
            $firstSlide.clone().appendTo($textSliderContainer);

            var newTextSliderText = $textSlider.find('.slide');
            newTextSliderText.each(function(index) {
                var leftPercent = (slideWidth * index) + '%';
                $(this).css({ 'left': leftPercent });
                $(this).css({ 'width': slideWidth + '%' });
            });

            $textSliderContainer.css('margin-left', '-100%');

            // Next button
            $carousel.find('.carousel-nav.next').on('click', function() {
                var newSlideIndex = currentTextIndex + 1;
                slide(newSlideIndex, $textSlides.length);
                currentTextIndex = newSlideIndex >= $textSlides.length ? 0 : newSlideIndex;
                slideToImage(currentTextIndex, false);
            });
            $carousel.find('.carousel-nav.prev').on('click', function() {
                lockdown = true;
                var newSlideIndex = currentTextIndex - 1;
                slide(newSlideIndex, $textSlides.length);
                currentTextIndex = newSlideIndex < 0 ? $textSlides.length - 1 : newSlideIndex;
                slideToImage(newSlideIndex, true);
            });

            $carousel.find('.carousel-indicators-container li').on('click', function() {
                var selectedButtonNumber = $(this).data('id');
                var activeButtonNumber = $carousel.find('.carousel-indicators-container .active').data('id');
                if (selectedButtonNumber == activeButtonNumber) {
                    return;
                }
                slide(selectedButtonNumber - 1, $textSlides.length);
                // slide goes right
                var direction = false;
                if (selectedButtonNumber < activeButtonNumber) {
                    direction = true;
                }
                currentTextIndex = selectedButtonNumber - 1;
                slideToImage((selectedButtonNumber - 1), direction);
            });

            function sizeCarousel($imageSlider, $textSlider) {
                var carouselHeight = settings.defaultCarouselHeight;
                if ($imageSlider.find('img').height() > 0){
                    carouselHeight = $imageSlider.find('img').height();
                }
                $textSlider.css({
                    height: '',
                });
                $carousel.css({
                    height: carouselHeight,
                });
                if ($(window).width() < 1023) {
                    $textSlider.css({
                        height: tallestText(textSlider),
                    });
                    $carousel.css({
                        height: '',
                    });
                };
            }
            function tallestText($textSlider) {
                var tallestText = 90;
                $textSlider.find('.content').each(function() {
                    tallestText = tallestText > $(this).height() ? tallestText : $(this).height();
                });
                tallestText = tallestText + 100;
                return tallestText < 400 ? 400 : tallestText;
            }

            function textSlideColorChange(index, trans) {
                var $textSlider = $carousel.find('.text-slider');
                var $ele = $($textSlider.find('.slide')[index]);
                var color = $ele.data('bg-color');
                $textSlider.attr('class', 'text-slider'); // Reset classes
                $textSlider.addClass(color);
                if (trans) {
                    $textSlider.css('transition', 'background-color 2s');
                }
            }

            function slide(newSlideIndex, count) {
                var marginLeftPc = (newSlideIndex * (-100) - 100) + '%';
                textSlideColorChange(newSlideIndex + 1, settings.transtionTextColor);
                var $slide = $carousel.find('.text-slider .slide-container');
                var $indicatorsContainer = $carousel.find('.carousel-indicators-container');
                $slide.not(':animated').animate({
                    'margin-left': marginLeftPc,
                }, 400, function() {
                    $indicatorsContainer.find('.active').removeClass('active');
                    // If new slide is before first slide...
                    if (newSlideIndex < 0) {
                        $slide.css('margin-left', ((count) * (-100)) + '%');
                        newSlideIndex = count - 1;
                    }
                    // If new slide is after last slide...
                    else if (newSlideIndex >= count) {
                        $slide.css('margin-left', '-100%');
                        newSlideIndex = 0;
                    }
                    $indicatorsContainer.find('li[data-id=' + (newSlideIndex + 1) + ']').addClass('active');
                });
            }

            function slideToImage(newImageIndex, direction) {
                var lockdown = true;
                var $currentSlide = $carousel.find('.img-slider .img.active');
                var $nextSlide = $carousel.find('.img').eq(newImageIndex);
                $carousel.find('.img').removeClass('slide-left').removeClass('under').removeClass('slide-right');
                if (direction) {
                    nextSlide.addClass('under-slide-right');
                    setTimeout(function() {
                        clearTimeout(this);
                        $nextSlide.removeClass('under-slide-right').addClass('slide-right');
                    }, 50);

                    $nextSlide.one(whichTransitionEvent(), function(e) {
                        $nextSlide.addClass('active').removeClass('slide-right');
                        $currentSlide.removeClass('active').removeClass('slide-right');
                        lockdown = false;
                    });
                } else {
                    $currentSlide.addClass('slide-left');
                    $nextSlide.addClass('under');
                    $currentSlide.one(whichTransitionEvent(), function(e) {
                        $currentSlide.removeClass('active slide-left');
                        $nextSlide.removeClass('under').addClass('active');
                        lockdown = false;
                    });
                }
            }
        }

        function singleSlide($carousel) {
            if (!Hammer) {
                throw new Error('Hammer.js must be installed for this carousel!');
            }
            var lockdown = false;
            var currentIndex = 0;
            // Wrap each div with div.class
            $carousel.children().each(function() {
                $(this).wrap("<div class='slide'></div>");
            });
            $carousel.css({
                height: $carousel.children().height(),
            });
            // Prepend the navigation
            appendIndicators($carousel, $carousel.children());
            prependNavigation($carousel);

            // Set the first child top
            var $slides = $carousel.find('.slide');
            $($slides[currentIndex]).addClass('active');

            // Next button
            $carousel.find('.carousel-nav.next').on('click', function() {
                singleSlideNext();
            });
            // Prev button
            $carousel.find('.carousel-nav.prev').on('click', function() {
                singleSlidePrev();
            });
            // Next Swipe
            Hammer($carousel[0]).on('swipeleft', function() {
                singleSlideNext();
            });
            // Prev Swipe
            Hammer($carousel[0]).on('swiperight', function() {
                singleSlidePrev();
            });
            // Indicator
            $carousel.find('.carousel-indicators-container li').on('click', function() {
                var selectedButtonNumber = $(this).data('id');
                var activeButtonNumber = $carousel.find('.carousel-indicators-container .active').data('id');
                var direction;
                if (selectedButtonNumber == activeButtonNumber || lockdown) {
                    return;
                } else if (selectedButtonNumber < activeButtonNumber) {
                    direction = 'left';
                } else {
                    direction = 'right';
                }
                singleSlideSlide(activeButtonNumber - 1, selectedButtonNumber - 1, direction);
            });

            function singleSlideNext() {
                if ($slides[currentIndex + 1] && !lockdown) {
                    singleSlideSlide(currentIndex, currentIndex + 1, 'right');
                } else if (!lockdown) {
                    singleSlideSlide(currentIndex, 0, 'right');
                }
            }
            function singleSlidePrev() {
                if ($slides[currentIndex - 1] && !lockdown) {
                    singleSlideSlide(currentIndex, currentIndex - 1, 'left');
                } else if (!lockdown) {
                    singleSlideSlide(currentIndex, $slides.length - 1, 'left');
                }
            }
            function singleSlideSlide(currSlideIndex, nextSlideIndex, direction) {
                lockdown = true;
                $($slides[nextSlideIndex]).addClass('next');
                $carousel.find('.carousel-indicators-container .active').removeClass('active');
                $carousel.find('.carousel-indicators-container li[data-id=' + (nextSlideIndex + 1) + ']').addClass('active');
                switch (direction) {
                    case 'right':
                        $($slides[currSlideIndex]).addClass('slide-to-left').one(whichTransitionEvent(), function() {
                            $($slides[nextSlideIndex]).addClass('active').removeClass('next');
                            $($slides[currSlideIndex]).removeClass('slide-to-left active');
                            currentIndex = nextSlideIndex;
                            lockdown = false;
                        });
                        break;
                    case 'left':
                        $($slides[currSlideIndex]).addClass('slide-to-right').one(whichTransitionEvent(), function() {
                            $($slides[nextSlideIndex]).addClass('active').removeClass('next');
                            $($slides[currSlideIndex]).removeClass('slide-to-right active');
                            currentIndex = nextSlideIndex;
                            lockdown = false;
                        });
                        break;
                }
            }
        }

        function sundensel($carousel) {
            var lockdown = false;

            // Prepend the navigation
            prependNavigation($carousel);
            appendIndicators($carousel, $carousel.find('.slide'));

            var carousel = $carousel;



            $carousel.find('.carousel-nav.next').on('click', function() {
                if (lockdown){
                    return;
                }
                slide(null, true);
            });

            $carousel.find('.carousel-nav.prev').on('click', function() {
                if (lockdown) {
                    return;
                }
                slide(null, false);
            });

            $carousel.find('.dot').on('click', function() {
                if (lockdown) {
                    return;
                }
                var selectedButtonNumber = $(this).parent().data('id');
                var activeButtonNumber = $carousel.find('.carousel-indicators-container .active').data('id');
                if (selectedButtonNumber == activeButtonNumber) {
                    return;
                }
                // slide goes right
                var direction = false;
                if (selectedButtonNumber > activeButtonNumber) {
                    direction = true;
                }
                slide((selectedButtonNumber - 1), direction);
            });

            function slide(newImageIndex, direction) {
                lockdown = true;
                var $currentSlide = $carousel.find('.slide.active');
                var $nextSlide = $currentSlide.next();
                var $previousSlide = $currentSlide.prev();
                var $indicatorsContainer = $carousel.find('.carousel-indicators-container');
                var $activeIndicator = $indicatorsContainer.find('li.active');
                if (direction) {
                    if (newImageIndex != null) {
                        $nextSlide = $carousel.find('.slide').eq(newImageIndex);
                    }
                    else if ($nextSlide.length == 0) {
                        $nextSlide = $carousel.find('.slide').first();
                        var last = true;
                    }
                    $nextSlide.addClass('place-to-right');
                    setTimeout(function() {
                        clearTimeout(this);
                        $nextSlide.removeClass('place-to-right').addClass('slide-left').one(whichTransitionEvent(), function(e) {
                                lockdown = true;
                                $currentSlide.removeClass('active');
                                $nextSlide.addClass('active').removeClass('slide-left');
                                // make the text fade in
                                $nextSlide.find('.text').addClass('display-text');
                                $activeIndicator.removeClass('active');
                                if (newImageIndex != null) {
                                    $indicatorsContainer.find('li').eq(newImageIndex).addClass('active');
                                }
                                else if (last) {
                                    $indicatorsContainer.find('li').first().addClass('active');
                                }
                                else {
                                    $activeIndicator.next().addClass('active');
                                }
                                lockdown = false;
                            });
                        $carousel.find('.text').removeClass('display-text');
                    }, 50);
                } else {
                    if (newImageIndex != null) {
                        $previousSlide = $carousel.find('.slide').eq(newImageIndex);
                    }
                    else if ($previousSlide.length == 0) {
                        previousSlide = $carousel.find('.slide').last();
                        var last = true;
                    }
                    $previousSlide.addClass('place-to-left');
                    setTimeout(function() {
                        clearTimeout(this);
                        $previousSlide.removeClass('place-to-left').addClass('slide-right').one(whichTransitionEvent(), function(e) {
                            $currentSlide.removeClass('active');
                            $previousSlide.addClass('active').removeClass('slide-right');
                            // make the text fade in
                            var text = $previousSlide.find('.text').addClass('display-text');
                            $activeIndicator.removeClass('active')
                            if (newImageIndex != null) {
                                $indicatorsContainer.find('li').eq(newImageIndex).addClass('active');
                            } else {
                                if(last) {
                                    $indicatorsContainer.find('li').last().addClass('active');
                                } else {
                                    $activeIndicator.prev().addClass('active');
                                }
                            }
                            lockdown = false;
                        });;
                        $carousel.find('.text').removeClass('display-text');
                    }, 50);
                }
            }
        }

        // ---Functions used across Carousels---

        // Prepends navigation arrows to the element
        function prependNavigation(el) {
            if (settings.navPrev) {
                var prevNav = $("<button class='carousel-nav prev' aria-label='Previous'></button>")
                    .addClass(settings.navPrevClass)
                    .html(settings.navPrevContent);
                el.prepend(prevNav);
            }
            if (settings.navNext) {
                var nextNav = $("<button class='carousel-nav next' aria-label='Next'></button>")
                    .addClass(settings.navNextClass)
                    .html(settings.navNextContent);
                el.prepend(nextNav);
            }
        }
        // Appends navigation indicators (dots) to the element based on number given
        // @param $ appendTo
        // @param $ getCountFrom
        function appendIndicators(appendTo, getCountFrom) {
            if (!settings.indicators) {
                return;
            }
            var indicatorContainer = $("<div class='carousel-indicators-container'></div>");
            var indicators = $('<ul></ul>');
            var numberOfIndicators = getCountFrom.length;
            var id = numberOfIndicators;
            if (numberOfIndicators > 2) {
                for (var j = 0; j < numberOfIndicators; j++) {
                    var dot = $('<li data-id="' + id + '"><button class="dot" aria-label="Dot"></button></li>');
                    if ($(getCountFrom[id - 1]).data('dot-label')) {
                        dot.append('<p>' + $(getCountFrom[id - 1]).data('dot-label') + '</p>');
                    }
                    indicators.prepend(dot);
                    id--;
                }
                indicators.find('li').first().addClass('active');
            }
            appendTo.append(indicatorContainer.append(indicators));
        }
        // ---End functions used across all Carousels---

        this.destroy = function() {
            this.each(function() {
                $(this).find('.carousel-nav.next').off();
                $(this).find('.carousel-nav.prev').off();
                $(this).find('.dot').off();
                Hammer(this).off();
            })
        }

        return this.each(function() {
            var $this = $(this); // A $carousel

            $this.addClass(settings.type);
            if (settings.type == 'sonyacel') {
                sonyacel($this);
            }
            else if (settings.type == 'singleSlide') {
                singleSlide($this);
            }
            else if (settings.type == 'sudensel') {
                sundensel($this);
            }
            else {
                console.log('What are you doing?');
            }
        });
    };
}(jQuery));
