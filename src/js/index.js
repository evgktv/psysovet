const sliderNews = new Swiper(".feedback__slider", {
  slidesPerView: 1.3,
  initialSlide: 2,
  spaceBetween: 20,
  loop: true,

  breakpointsInverse: true,
  breakpoints: {
    320: {
      slidesPerView: 1.2,
      centeredSlides: true,
      spaceBetween: 20
    },
    768: {

      slidesPerView: 2,
      slidesOffsetBefore: 100,
      spaceBetween: 80
    },

    961: {
      slidesPerView: 2.6,
      slidesOffsetBefore: 170,
      spaceBetween: 120
    }
  },
});

const sliderPsy = new Swiper(".intro-psy__slider", {
  slidesPerView: 1.3,
  initialSlide: 2,
  spaceBetween: 20,
  loop: true,

  breakpointsInverse: true,
  breakpoints: {
    320: {
      slidesPerView: 1.2,
      centeredSlides: true,
      spaceBetween: 20
    },
    768: {

      slidesPerView: 4,
      spaceBetween: 30
    },

    961: {
      slidesPerView: 7
    }
  },
});

const sliderFeedback = new Swiper(".feedback-bot__slider", {
  slidesPerView: 1.3,
  initialSlide: 2,
  spaceBetween: 20,
  loop: true,

  breakpointsInverse: true,
  breakpoints: {
    320: {
      slidesPerView: 1,
      centeredSlides: true,
    },
    768: {

      slidesPerView: 2,
      spaceBetween: 30
    },

    961: {
      slidesPerView: 3
    }
  },

  pagination: {
    el: ".swiper-pagination"
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  }
});