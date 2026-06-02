// Video Carousel Functionality
(function() {
  let currentSlide = 0;
  let carouselInterval = null;

  function initVideoCarousel() {
    const slides = document.querySelectorAll('.video-slide');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    
    if (slides.length === 0) return;

    function goToSlide(index) {
      currentSlide = index;
      
      slides.forEach(function(slide, i) {
        const videoEl = slide.querySelector('video');
        if (i === index) {
          slide.classList.add('active');
          if (videoEl) {
            videoEl.play().catch(function() {});
          }
        } else {
          slide.classList.remove('active');
          if (videoEl) {
            videoEl.pause();
            videoEl.currentTime = 0;
          }
        }
      });
      
      indicators.forEach(function(indicator, i) {
        if (i === index) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }

    window.carouselNext = function() {
      const nextIndex = (currentSlide + 1) % slides.length;
      goToSlide(nextIndex);
      resetAutoPlay();
    };

    window.carouselPrev = function() {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      goToSlide(prevIndex);
      resetAutoPlay();
    };

    window.carouselGoTo = function(index) {
      goToSlide(index);
      resetAutoPlay();
    };

    function startAutoPlay() {
      carouselInterval = setInterval(function() {
        window.carouselNext();
      }, 8000);
    }

    function resetAutoPlay() {
      if (carouselInterval) clearInterval(carouselInterval);
      startAutoPlay();
    }

    startAutoPlay();

    const carouselWrapper = document.querySelector('.video-carousel-wrapper');
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', function() {
        if (carouselInterval) clearInterval(carouselInterval);
      });
      carouselWrapper.addEventListener('mouseleave', function() {
        startAutoPlay();
      });
    }
  }

  window.initVideoCarousel = initVideoCarousel;
})();
