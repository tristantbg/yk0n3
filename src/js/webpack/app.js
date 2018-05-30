/* jshint esversion: 6 */

import lazysizes from 'lazysizes';
import optimumx from 'lazysizes';
require('../../../node_modules/lazysizes/plugins/object-fit/ls.object-fit.js');
import Flickity from 'flickity';
import 'flickity-hash';
import {
  TweenMax
} from 'gsap';
import Plyr from 'plyr';
import Barba from 'barba.js';
import Hls from 'hls.js';
import './iscroll'
// require('../../../node_modules/fullPage.js/vendors/scrolloverflow.min.js');
import fullpage from 'fullPage.js';
require('viewport-units-buggyfill').init();
// import throttle from 'lodash.throttle';
// import debounce from 'lodash.debounce';

const _root = "/ykone"

const freezeVp = (e) => {
  e.preventDefault();
};

const stopBodyScrolling = (bool) => {
  if (bool === true) {
    document.body.addEventListener("touchmove", freezeVp, false);
  } else {
    document.body.removeEventListener("touchmove", freezeVp, false);
  }
};

const App = {
  header: null,
  siteTitle: null,
  introPlayers: [],
  initialize: () => {
    App.header = document.querySelector("header");
    App.siteTitle = document.querySelector("#site-title");
    App.menu = document.getElementById("menu");
    App.players = document.querySelectorAll('video')
    App.sizeSet();

    if (!App.isMobile) {
      // App.pjax();
      $('#mobile-home').remove()
      if (document.getElementById('fullpage')) {
        const anchors = document.querySelectorAll('[data-menuanchor]')
        for (var i = 0; i < anchors.length; i++) {
          anchors[i].setAttribute('href', '#' + anchors[i].dataset.menuanchor)
        }
        $('#fullpage').fullpage({
          menu: '#menu',
          normalScrollElements: '.page-description',
          scrollOverflow: true,
          scrollOverflowReset: false,
          slideSelector: false,
          continuousVertical: true,
          touchSensitivity: 15,
          // afterLoad: function(anchorLink, index) {
          //   var loadedSection = $(this);
          // },
          afterRender: function() {
            $('section.section.active').addClass('animate');
            new TimelineLite().to('#loader .spinner', 0.6, {
              opacity: 0,
              // scale: 0.3,
              ease: Expo.easeOut
            }, '+=0.5').to('#loader', 0.3, {
              autoAlpha: 0
            }, '+=0.3');
            // App.setPageId();
          },
          afterLoad: function(anchorLink, index) {
            var loadedSection = $(this)
            App.videoPlayers.play(loadedSection[0])
          },
          onLeave: function(index, nextIndex, direction) {
            if (direction == "up") {
              document.getElementById('fullpage').classList.add('going-up')
            } else {
              document.getElementById('fullpage').classList.remove('going-up')
            }
            var slide = $(this)
            var nextSection = document.querySelector('section.section:nth-child(' + nextIndex + ')')
            setTimeout(function() {
              nextSection.classList.add('animate')
            }, 100)
            slide.addClass('leaving').removeClass('animate')
            document.body.setAttribute('page-type', nextSection.getAttribute('page-type'))
            App.videoPlayers.stop()
            setTimeout(function() {
              slide.removeClass('leaving')
            }, 600);
            switch (nextIndex) {
              case 0:
                App.introPlayers[0].play();
                document.body.setAttribute('logo-color', App.introPlayers[0].media.getAttribute('logo-color'))
                break;
              default:
                document.body.setAttribute('logo-color', 'dark');
                break;
            }
            if (nextSection.getAttribute('page-type') == 'manifesto') {
              const p = nextSection.querySelector('#page-description');
              const v = nextSection.querySelector('#manifesto .plyr');
              TweenMax.set(p, {
                xPercent: 100,
              });
              TweenMax.set(v, {
                width: '100%',
              });
              setTimeout(function() {
                TweenMax.to(p, 0.8, {
                  xPercent: 0,
                  ease: Expo.easeInOut
                });
                TweenMax.to(v, 0.8, {
                  width: '60%',
                  ease: Expo.easeInOut
                });
                // document.getElementById('page-content').classList.add('popup')
              }, 3000);
            }
          }
        });
      } else {
        new TimelineLite({
          onComplete: () => {
            if (App.introPlayers && App.introPlayers.length > 0) {
              // App.introPlayers[0].on('canplay', event => {
              //   console.log('ok')
              // });
              App.introPlayers[0].play();
              document.body.setAttribute('logo-color', App.introPlayers[0].media.getAttribute('logo-color'));
            }
          }
        }).to('#loader .spinner', 0.6, {
          opacity: 0,
          // scale: 0.3,
          ease: Expo.easeOut
        }, '+=0.5').to('#loader', 0.3, {
          autoAlpha: 0
        }, '+=0.3');
      }
      // App.mouseWheel();
    } else {
      $('#fullpage').remove()
      new TimelineLite({
        onComplete: () => {
          if (App.introPlayers && App.introPlayers.length > 0) {
            // App.introPlayers[0].on('canplay', event => {
            //   console.log('ok')
            // });
            App.introPlayers[0].play();
            document.body.setAttribute('logo-color', App.introPlayers[0].media.getAttribute('logo-color'));
          }
        }
      }).to('#loader .spinner', 0.6, {
        opacity: 0,
        // scale: 0.3,
        ease: Expo.easeOut
      }, '+=0.5').to('#loader', 0.3, {
        autoAlpha: 0
      }, '+=0.3');
    }
    if (!App.isMobile) {

      setTimeout(function() {
        TweenMax.to('#page-description', 0.8, {
          x: 0,
          ease: Expo.easeInOut
        });
        TweenMax.to('#manifesto .plyr', 0.8, {
          width: '60%',
          ease: Expo.easeInOut
        });
        // document.getElementById('page-content').classList.add('popup')
      }, 3000);

    }
    App.interact.init();
    // document.getElementById("loader").style.display = 'none';
  },
  sizeSet: () => {
    App.width = (window.innerWidth || document.documentElement.clientWidth);
    App.height = (window.innerHeight || document.documentElement.clientHeight);
    if (App.width <= 1024)
      App.isMobile = true;
    if (App.isMobile) {
      if (App.width >= 1024) {
        // location.reload();
        App.isMobile = false;
      }
    }
  },
  mouseWheel: () => {
    const pageLinks = document.querySelectorAll('a[page-id]');

    window.addEventListener('mousewheel', e => {

      if (App.isScrolling) return;

      const goingUp = e.deltaY < 0 && Math.abs(e.deltaY) > 30;
      const goingDown = e.deltaY > 0 && Math.abs(e.deltaY) > 30;
      if (goingUp) {
        // going up
        const atTop = window.scrollY === 0;
        if (atTop) {
          App.transitionDirection = 'up';
          const previous = (App.pageId - 1) < 0 ? (pageLinks.length - 1) : App.pageId - 1;
          const currentLink = document.querySelector('a.active');
          if (currentLink) currentLink.classList.remove('active');
          if (pageLinks[previous]) {
            App.pageId = previous;
            pageLinks[previous].classList.add('active');
            Barba.Pjax.goTo(pageLinks[previous].getAttribute('href'));
          }
          App.isScrolling = true;
        }

      } else if (goingDown) {
        // going down
        const atBottom = window.scrollY + document.documentElement.clientHeight == document.documentElement.offsetHeight;
        if (atBottom) {
          App.transitionDirection = 'down';
          const next = (App.pageId + 1) === pageLinks.length ? 0 : App.pageId + 1;
          const currentLink = document.querySelector('a.active');
          if (currentLink) currentLink.classList.remove('active');
          if (pageLinks[next]) {
            App.pageId = next;
            pageLinks[next].classList.add('active');
            Barba.Pjax.goTo(pageLinks[next].getAttribute('href'));
          }
          App.isScrolling = true;
        }
      }
    });
  },
  setPageId: () => {
    const pageId = document.querySelector('a[page-id].active');
    if (pageId) {
      App.pageId = parseInt(pageId.getAttribute('page-id'), 10);
    } else {
      App.pageId = 0;
    }
    document.body.setAttribute('page-id', App.pageId);
  },
  videoPlayers: {
    init: () => {

      const introVideos = document.getElementsByClassName('intro-video');
      const manifesto = document.getElementById('manifesto');


      if (introVideos.length > 0) {
        App.videoPlayers.prepare(introVideos);

        const options = {
          controls: [''],
          clickToPlay: false,
          muted: true,
          iconUrl: _root + "/assets/images/plyr.svg"
        };
        App.introPlayers = Array.from(document.querySelectorAll('.intro-video')).map(player => new Plyr(player, options));
        App.manifesto = Array.from(document.querySelectorAll('.manifesto-video')).map(player => new Plyr(player, options));
      }



      if (App.introPlayers && App.introPlayers.length > 1) {

        for (var i = 0; i < App.introPlayers.length; i++) {
          const current = App.introPlayers[i];
          const next = (i === App.introPlayers.length - 1) ? App.introPlayers[0] : App.introPlayers[(i + 1)];
          current.on('ended', event => {
            event.target.style.display = 'none';

            next.elements.wrapper.parentNode.style.display = 'block';
            next.play();
          });
          current.on('playing', event => {
            document.body.setAttribute('logo-color', next.media.getAttribute('logo-color'))
          });
        }

      }

      // const options = {
      //   controls: ['play-large'],
      //   clickToPlay: false,
      //   iconUrl: _root + "/assets/images/plyr.svg"
      // };
      // App.players = Array.from(document.querySelectorAll('.js-player')).map(player => new Plyr(player, options));

    },
    prepare: (videos) => {

      if (videos.length < 1) return;

      const hls = [];

      const attachStream = (videoElement) => {
        if (videoElement.getAttribute('data-stream') && Hls.isSupported()) {
          hls[i] = new Hls({
            minAutoBitrate: 1700000
          });
          hls[i].loadSource(videoElement.getAttribute('data-stream'));
          hls[i].attachMedia(videoElement);
        }
      };

      for (var i = 0; i < videos.length; i++) {
        const videoElement = videos[i];
        videoElement.controls = false;
        attachStream(videoElement);
      }
    },
    play: container => {
      const videos = container.querySelectorAll('video')
      if (videos.length > 0) {

        for (var i = 0; i < App.introPlayers.length; i++) {
          App.introPlayers[i].elements.wrapper.parentNode.style.display = i == 0 ? 'block' : 'none'
        }

        for (var j = 0; j < videos.length; j++) {
          videos[j].currentTime = 0;
        }
        videos[0].play()

      }
    },
    pause: () => {
      for (var i = 0; i < App.players.length; i++) {
        App.players[i].pause();
      }
    },
    stop: () => {
      const videos = container.querySelectorAll('video')
      for (var i = 0; i < videos.length; i++) {
        videos[i].pause();
        videos[i].currentTime = 0;
      }
    },
    destroy: () => {
      if (App.players) {
        for (var i = 0; i < App.players.length; i++) {
          App.players[i].destroy();
        }
        App.players = null;
      }
    }
  },
  interact: {
    init: () => {
      App.interact.linkTargets()
      App.interact.eventTargets()
      App.interact.embedKirby()
      App.interact.loadSliders()
      App.videoPlayers.init()
    },
    eventTargets: () => {
      App.interact.menuBurger();
      const offices = document.querySelectorAll('[event-target=office]');

      for (var i = offices.length - 1; i >= 0; i--) {
        var office = offices[i];
        office.addEventListener('click', (e) => {
          document.getElementById('page-content').classList.add('popup')
          const description = document.querySelector('.dynamic-description');
          if (description) {
            description.innerHTML = e.currentTarget.getAttribute("data-caption");
            App.interact.linkTargets();
            TweenMax.to('#page-description', 0.6, {
              x: 0,
              ease: Expo.easeInOut
            })
          }
        });
      }
    },
    linkTargets: () => {
      const links = document.querySelectorAll("a");
      for (var i = 0; i < links.length; i++) {
        const element = links[i];
        if (element.host !== window.location.host) {
          element.setAttribute('target', '_blank');
        } else {
          element.setAttribute('target', '_self');
        }
      }
    },
    menuBurger: () => {
      const burger = document.getElementById('burger');
      if (burger) {
        burger.addEventListener('click', () => {
          document.body.classList.toggle("menu-on");
          burger.classList.toggle("opened");

          if (burger.classList.contains("opened")) {
            App.interact.menu.on();
          } else {
            App.interact.menu.off();
          }
        });
      }
    },
    menu: {
      on: () => {
        stopBodyScrolling(true);
        new TimelineLite().set("#secondary-menu", {
          autoAlpha: 1,
        }).fromTo("#secondary-menu", 0.5, {
          xPercent: 100,
          force3D: true,
        }, {
          xPercent: 0,
          force3D: true,
          ease: Power3.easeInOut
        }).to('#logo', 0.3, {
          autoAlpha: 1
        });
      },
      off: () => {
        stopBodyScrolling(false);
        new TimelineLite().to('#logo', 0.3, {
          autoAlpha: 0
        }).fromTo("#secondary-menu", 0.5, {
          xPercent: 0,
          force3D: true,
        }, {
          xPercent: 100,
          force3D: true,
          ease: Power3.easeInOut
        });
      }
    },
    embedKirby: () => {
      var pluginEmbedLoadLazyVideo = function() {
        var e = this.parentNode,
          d = e.children[0];
        d.src = d.dataset.src, e.removeChild(this)
      };
      for (var d = document.getElementsByClassName("embed__thumb"), t = 0; t < d.length; t++) d[t].addEventListener("click", pluginEmbedLoadLazyVideo, !1)
    },
    loadSliders: () => {
      const initFlickity = (element, options) => {
        var slider = new Flickity(element, options);
        slider.slidesCount = slider.slides.length;
        slider.isEntries = element.classList.contains('slider-entries');
        if (slider.slidesCount < 1) return; // Stop if no slides
        slider.on('change', function() {
          // $('#slide-number').html((slider.selectedIndex + 1) + '/' + slider.slidesCount);
          if (this.selectedElement) {
            const caption = this.element.parentNode.querySelector(".caption");
            if (caption)
              caption.innerHTML = this.selectedElement.getAttribute("data-caption");

            if (slider.isEntries) {
              const description = this.element.parentNode.querySelector('.dynamic-description');
              if (description) {
                description.innerHTML = this.selectedElement.getAttribute("data-caption");
                document.getElementById('page-description').scroll(0, 0);
                App.interact.linkTargets();
              }
            }
          }
          var adjCellElems = this.getAdjacentCellElements(1);
          for (var i = 0; i < adjCellElems.length; i++) {
            var adjCellImgs = adjCellElems[i].querySelectorAll('.lazy:not(.lazyloaded):not(.lazyload)')
            for (var j = 0; j < adjCellImgs.length; j++) {
              adjCellImgs[j].classList.add('lazyload')
            }
          }
        });
        // slider.on('staticClick', function(event, pointer, cellElement, cellIndex) {
        //   if (!cellElement || !Modernizr.touchevents || cellElement.getAttribute('data-media') == "video") {
        //     return;
        //   } else {
        //     this.next();
        //   }
        // });
        slider.on('staticClick', function(event, pointer, cellElement, cellIndex) {
          if (typeof cellIndex == 'number') {
            slider.selectCell(cellIndex);
          }
        });
        // let prevNextButtons = slider.element.querySelectorAll(".flickity-prev-next-button");
        // prevNextButtons.forEach((el) => {
        //   let cursor = document.createElement('div');
        //   cursor.className = "cursor";
        //   el.appendChild(cursor);
        //   el.addEventListener('mousemove', () => {
        //     if (!Modernizr.touchevents) {
        //       let rect = el.getBoundingClientRect();
        //       cursor.style.top = event.pageY - rect.top - window.scrollY + "px";
        //       cursor.style.left = event.pageX - rect.left - window.scrollX + "px";
        //     }
        //   });

        // })
        if (slider.selectedElement) {
          const caption = slider.element.parentNode.querySelector(".caption");
          if (caption)
            caption.innerHTML = slider.selectedElement.getAttribute("data-caption");
        }
      }
      var flickitys = [];
      var elements = document.getElementsByClassName('slider');
      if (elements.length > 0) {
        for (var i = 0; i < elements.length; i++) {
          initFlickity(elements[i], {
            cellSelector: '.slide',
            imagesLoaded: true,
            lazyLoad: 3,
            hash: false,
            cellAlign: elements[i].getAttribute('cell-align'),
            setGallerySize: false,
            adaptiveHeight: false,
            percentPosition: true,
            accessibility: true,
            wrapAround: true,
            prevNextButtons: true,
            pageDots: false,
            draggable: '>1',
            freeScroll: true,
            dragThreshold: 30,
            arrowShape: 'M74.3 99.3L25 50 74.3.7l.7.8L26.5 50 75 98.5z'
          });
        }
      }
    }
  },
  scrollSave: {
    set: () => {
      if (App.pageType === "projects" && Modernizr.sessionstorage) {
        sessionStorage.setItem('scroll-home', window.scrollY);
      }
    },
    get: () => {
      if (App.pageType === "projects" && Modernizr.sessionstorage) {
        const scrollTop = sessionStorage.getItem('scroll-home') || 0;
        window.scroll(0, scrollTop);
      } else {
        window.scroll(0, 0);
      }
    }
  },
  pjax: () => {
    let transitionDuration = 300;
    let linkClicked;
    let nextPageType;
    const HideShowTransition = Barba.BaseTransition.extend({
      start: function() {
        let _this = this;
        App.scrollSave.set();
        _this.newContainerLoading.then(_this.startTransition.bind(_this));
      },
      startTransition: function() {
        let _this = this;
        const newContent = _this.newContainer.querySelector('#page-content');
        _this.newContainer.visibility = "visible";
        nextPageType = newContent.getAttribute('page-type');

        document.body.setAttribute('page-id', App.pageId);
        document.body.classList.add('is-loading');
        document.body.classList.remove('menu-on');
        const currentLink = document.querySelector('a.active');
        if (currentLink) currentLink.classList.remove('active');
        if (linkClicked) linkClicked.classList.add('active');
        App.interact.init();

        // newContent.style.opacity = 0;

        if (nextPageType == "project") {
          new TimelineMax({
            onComplete: () => {
              _this.finish(_this, newContent);
            }
          }).to("#page-content", 0.3, {
            opacity: 0,
          });
        } else {
          setTimeout(function() {
            new TimelineMax({
              onComplete: () => {
                App.videoPlayers.destroy();
                _this.finish(_this, newContent);
              }
            }).set(_this.newContainer, {
              visibility: 'visible',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 15
            }).set(_this.oldContainer, {
              zIndex: 10
            }).fromTo(newContent, 1, {
              zIndex: 15,
              yPercent: App.transitionDirection === 'up' ? -100 : 100
            }, {
              yPercent: 0,
              force3D: true,
              ease: Expo.easeOut
            }).set(_this.newContainer, {
              clearProps: 'all'
            });
          }, 500);
        }

      },
      finish: function(_this, newContent) {

        _this.done();
        App.pageType = nextPageType;
        App.logoColor = newContent.getAttribute('logo-color');
        document.body.setAttribute("page-type", App.pageType);
        document.body.setAttribute("logo-color", App.logoColor);
        // App.scrollSave.get();


        App.interact.menuBurger();
        setTimeout(function() {
          App.setPageId();
        }, transitionDuration);

        setTimeout(function() {
          if (App.introPlayers && App.introPlayers.length > 0) {
            // App.introPlayers[0].on('canplay', event => {
            //   console.log('ok')
            // });
            App.introPlayers[0].play();
            document.body.setAttribute('logo-color', App.introPlayers[0].media.getAttribute('logo-color'));
          }
          new TimelineMax().to(newContent, 0.3, {
            opacity: 1
          });
          document.body.classList.remove('is-loading');
        }, 200);
        App.isScrolling = false;
      }


    });
    Barba.Pjax.getTransition = function() {
      return HideShowTransition;
    };
    Barba.Dispatcher.on('linkClicked', function(el) {
      linkClicked = el;
      App.transitionDirection = 'down';
    });
    Barba.Pjax.Dom.wrapperId = "main";
    Barba.Pjax.Dom.containerClass = "pjax";
    Barba.BaseCache.reset();
    // Barba.Pjax.cacheEnabled = false;
    Barba.Pjax.start();
  }
}

document.addEventListener("DOMContentLoaded", App.initialize);