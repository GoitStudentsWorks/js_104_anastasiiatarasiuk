import Swiper from 'swiper';
import { Keyboard, Mousewheel, Navigation } from 'swiper/modules';
import 'swiper/css';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { addSvgIcon } from './svg-utils.js';

addSvgIcon('.swiper-button-prev', 'icon-arrow-narrow-left', 'arrow-icon', 24, 24);
addSvgIcon('.swiper-button-next', 'icon-arrow-narrow-right', 'arrow-icon', 24, 24);

function showErrorToast(message) {
  iziToast.show({
    message,
    image: '../img/bi_x-octagon.svg',
    messageColor: '#FFF',
    position: 'topRight',
    backgroundColor: '#d66c66',
    maxWidth: '472px',
    imageWidth: 24,
  });
}

function renderReviewItem(item) {
  return ` <li class="reviews-item swiper-slide" data-id="${item._id}" tabindex="0">
       <div class="reviews-content ">
       <p>${item.review}</p>
        </div>
        <div class="block-author-review">
          <img class="author-photo-review" src="${item.avatar_url}" alt="photo author">
          <p class="author-name-review">${item.author}</p>
        </div>
      </li>`;
}

const prevButton = document.querySelector('.swiper-button-prev');
const nextButton = document.querySelector('.swiper-button-next');

function createReviewList(items) {
  const reviewList = document.querySelector('.reviews-list');
  const notFound = document.querySelector('.reviews-not-found');

  items = items || [];
  if (items.length) {
    reviewList.innerHTML = items.map(renderReviewItem).join('');
  } else {
    prevButton.disabled = true;
    nextButton.disabled = true;
    reviewList.classList.add('hidden');
    notFound.classList.remove('hidden');
  }
}

function initSlider() {

  const swiper = new Swiper('.swiper', {
    modules: [Navigation, Keyboard, Mousewheel],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoHeight: false,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 32,
      },
      1280: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    mousewheel: {
      invert: false,
      forceToAxis: true,
    },
  });

  const slides = document.querySelectorAll('.swiper-slide');
  slides.forEach((slide, index) => {
    slide.addEventListener('focus', () => {
      swiper.slideTo(index);
    });
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
      const activeSlide = document.activeElement;
      if (activeSlide && activeSlide.classList.contains('swiper-slide')) {
        if (event.shiftKey) {
          swiper.slidePrev();
        } else {
          swiper.slideNext();
        }
        event.preventDefault();
        const newActiveSlide = document.querySelector('.swiper-slide-active');
        if (newActiveSlide) {
          newActiveSlide.focus();
        }
      }
    }
  });


  swiper.on('slideChange', () => {
    prevButton.disabled = swiper.isBeginning;
    nextButton.disabled = swiper.isEnd;
  });
}


axios.get('https://portfolio-js.b.goit.study/api/reviews')
  .then(response => {
    if (response.status === 200) {
      createReviewList(response.data);
      initSlider();

    } else {
      showErrorToast('Sorry, something went wrong. Try one more time.');
      createReviewList([]);
    }
  })
  .catch(() => {
    showErrorToast('Sorry, something went wrong. Try one more time.');
    createReviewList([]);

  });

let darkTheme = false;
const reviews = document.querySelector('#reviews');
document
  .querySelector('#switch')
  .addEventListener('click', () => {
    darkTheme = !darkTheme;
    if (darkTheme) {
      reviews.style.setProperty('--review-card-bg', '#2A2D32');
      reviews.style.setProperty('--review-btn-hover-bg', '#3B3F45');
      reviews.style.setProperty('--review-btn-arrow-color', '#F0F0F0');
      reviews.style.setProperty('--review-btn-border-color', '#2A2D32');
    } else {
      reviews.style.setProperty('--review-card-bg', 'var(--light-grey)');
      reviews.style.setProperty('--review-btn-hover-bg', 'var(--light-grey)');
      reviews.style.setProperty('--review-btn-arrow-color', '#292929');
      reviews.style.setProperty('--review-btn-border-color', 'rgba(41, 41, 41, 0.30)');
    }
  });