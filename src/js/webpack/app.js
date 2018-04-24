/* jshint esversion: 6 */

import lazysizes from 'lazysizes';
import optimumx from 'lazysizes';
require('../../../node_modules/lazysizes/plugins/object-fit/ls.object-fit.js');
import Flickity from 'flickity';
import TweenMax from 'gsap';
import Plyr from 'plyr';
import Barba from 'barba.js';
import Hls from 'hls.js';
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
  introPlayers: null,
  initialize: () => {
    App.header = document.querySelector("header");
    App.siteTitle = document.querySelector("#site-title");
    App.menu = document.getElementById("menu");
    App.interact.init();
    App.pjax();
    new TimelineLite({
      onComplete: () => {
        if (App.introPlayers.length > 0) {
          // App.introPlayers[0].on('canplay', event => {
          //   console.log('ok')
          // });
          App.introPlayers[0].play();
        }
      }
    }).to('#loader .spinner', 0.6, {
      opacity: 0,
      scale: 0.3,
      ease: Expo.easeOut
    }, '+=0.5').to('#loader', 0.3, {
      autoAlpha: 0
    }, '+=0.3')
    // document.getElementById("loader").style.display = 'none';
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
        newContent.style.opacity = 0;
        nextPageType = newContent.getAttribute('page-type');

        document.body.classList.add("is-loading");

        if (false && !App.isMobile && nextPageType == 'project') {
          linkClicked.classList.add("clicked");
          const selectedProject = linkClicked.getAttribute('data-id');
          const selectedProjectOverview = document.querySelector('.overview[data-project="' + selectedProject + '"]');
          const selectedProjectOverviews = selectedProjectOverview.querySelectorAll('img:not(.active)');

          // Select
          selectedProjectOverview.classList.add('clicked');
          App.preloadImages(selectedProjectOverviews);

          TweenMax.to('.project-item:not(.clicked), #categories, #about-btn, #infos-btn, #about', 0.1, {
            opacity: 0,
            onComplete: () => {
              new TimelineMax({
                onComplete: () => {
                  _this.finish(_this, newContent);
                }
              }).fromTo(linkClicked, 0.3, {
                opacity: 1,
                position: 'fixed',
                top: linkClicked.getBoundingClientRect().top,
                ease: Power3.easeInOut
              }, {
                top: '50%',
                yPercent: -50,
                force3D: true,
                onComplete: () => {
                  App.interact.loopImages(selectedProjectOverview);
                },
                ease: Expo.easeInOut
              }, '+=0.1').to([selectedProjectOverview, linkClicked], 0.3, {
                opacity: 0
              }, '+=1');
            }
          });

        } else {
          new TimelineMax({
            onComplete: () => {
              _this.finish(_this, newContent);
            }
          }).to("#page-content", 0.3, {
            opacity: 0,
          });
        }
      },
      finish: function(_this, newContent) {
        App.videoPlayers.destroy();
        App.pageType = nextPageType;
        App.pageTheme = newContent.getAttribute('page-theme');
        App.scrollSave.get();
        _this.done();
        App.interact.init();

        setTimeout(function() {
          document.body.setAttribute("page-type", App.pageType);
          document.documentElement.setAttribute("page-theme", App.pageTheme);
        }, transitionDuration);

        if (nextPageType == 'project') {
          // project transition
          setTimeout(function() {
            new TimelineMax({
              onComplete: () => {
                TweenLite.set("#project-description", {
                  clearProps: "all"
                });
              }
            }).set(newContent, {
              opacity: 1
            }).fromTo("#project-sections", 0.6, {
              y: App.height
            }, {
              y: 0,
              ease: Expo.easeInOut
            }).fromTo("#project-description", 0.3, {
              opacity: 0
            }, {
              opacity: 1
            });
            document.body.classList.remove("is-loading");
          }, transitionDuration + 200);
        } else {
          setTimeout(function() {
            new TimelineMax().to(newContent, 0.3, {
              opacity: 1
            });
            if (App.introPlayers.length > 0) {
              // App.introPlayers[0].on('canplay', event => {
              //   console.log('ok')
              // });
              App.introPlayers[0].play();
            }
            document.body.classList.remove("is-loading");
          }, transitionDuration);
        }

      }
    });
    Barba.Pjax.getTransition = function() {
      return HideShowTransition;
    };
    Barba.Dispatcher.on('linkClicked', function(el) {
      linkClicked = el;
    });
    Barba.Pjax.Dom.wrapperId = "main";
    Barba.Pjax.Dom.containerClass = "pjax";
    Barba.Pjax.start();
  },
  videoPlayers: {
    init: () => {

      const introVideos = document.getElementsByClassName('intro-video');
      const manifesto = document.getElementById('manifesto');
      console.log(manifesto)

      if (introVideos.length > 0) {
        App.videoPlayers.prepare(introVideos);

        const options = {
          controls: [''],
          clickToPlay: false,
          muted: true,
          iconUrl: _root + "/assets/images/plyr.svg"
        };
        App.introPlayers = Array.from(document.querySelectorAll('.intro-video')).map(player => new Plyr(player, options));
      }

      if (manifesto && introVideos.length > 0) {
        console.log(App.introPlayers[0])
        App.introPlayers[0].on('ended', event => {
          TweenMax.to('#page-description', 0.6, {
            x: 0,
            ease: Expo.easeInOut
          })
          manifesto.classList.add('popup')
        });
      }



      if (App.introPlayers && App.introPlayers.length > 1) {

        for (var i = 0; i < App.introPlayers.length; i++) {
          const current = App.introPlayers[i];
          const next = (i === App.introPlayers.length - 1) ? App.introPlayers[0] : App.introPlayers[(i + 1)];
          current.on('ended', event => {
            event.target.style.display = 'none';

            next.elements.wrapper.parentNode.style.display = 'block';
            document.body.setAttribute('logo-color', next.media.getAttribute('logo-color'))
            next.play();
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
    pause: () => {
      for (var i = 0; i < App.players.length; i++) {
        App.players[i].pause();
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
      App.interact.menuBurger()
      const subClick = document.querySelectorAll('[event-target=submenu]');

      for (var i = subClick.length - 1; i >= 0; i--) {
        subClick[i].addEventListener('click', (e) => {
          e.currentTarget.parentNode.classList.toggle('opened');
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

          // if (burger.classList.contains("opened")) {
          //   App.interact.menu.on();
          // } else {
          //   App.interact.menu.off();
          // }
        });
      }
    },
    menu: {
      on: () => {
        stopBodyScrolling(true);
        App.container.style.marginBottom = "0px";
        App.menuOver.classList.add('opened');
        new TimelineLite().set(App.menuOver, {
          autoAlpha: 1,
        }).fromTo(App.menuOver, 0.5, {
          yPercent: 100,
          force3D: true,
        }, {
          yPercent: 0,
          force3D: true,
          ease: Power3.easeInOut
        });
      },
      off: () => {
        stopBodyScrolling(false);
        burger.classList.remove("opened");
        App.menuOver.classList.remove('opened');
        new TimelineLite().fromTo(App.menuOver, 0.5, {
          yPercent: 0,
          force3D: true,
        }, {
          yPercent: 100,
          force3D: true,
          ease: Power3.easeInOut
        }).set(App.menuOver, {
          autoAlpha: 0,
          onComplete: App.sizeSet
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
        if (slider.slidesCount < 1) return; // Stop if no slides
        slider.on('change', function() {
          // $('#slide-number').html((slider.selectedIndex + 1) + '/' + slider.slidesCount);
          if (this.selectedElement) {
            const caption = this.element.parentNode.querySelector(".caption");
            if (caption)
              caption.innerHTML = this.selectedElement.getAttribute("data-caption");
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
            cellAlign: 'left',
            setGallerySize: false,
            adaptiveHeight: false,
            percentPosition: true,
            accessibility: true,
            wrapAround: true,
            prevNextButtons: true,
            pageDots: false,
            draggable: true,
            dragThreshold: 30,
            arrowShape: 'M74.3 99.3L25 50 74.3.7l.7.8L26.5 50 75 98.5z'
          });
        }
      }
      var elements = document.getElementsByClassName('inline-slider');
      if (elements.length > 0) {
        for (var i = 0; i < elements.length; i++) {
          initFlickity(elements[i], {
            cellSelector: '.inline-item',
            cellAlign: 'left',
            imagesLoaded: true,
            lazyLoad: false,
            setGallerySize: true,
            adaptiveHeight: false,
            percentPosition: true,
            accessibility: true,
            wrapAround: true,
            contain: false,
            prevNextButtons: true,
            pageDots: false,
            draggable: true,
            dragThreshold: 30,
            arrowShape: 'M74.3 99.3L25 50 74.3.7l.7.8L26.5 50 75 98.5z'
          });
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", App.initialize);
