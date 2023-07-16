import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a');

let currentPage = 1;

form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value.trim();
  if (searchQuery) {
    currentQuery = searchQuery;
    currentPage = 1;
    gallery.innerHTML = '';
    getImage(currentQuery, currentPage);
  }
}

loadMoreBtn.style.visibility = 'hidden';

async function getImage(query) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '37377775-c77698ffc3675e3ed26b97c68',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
      },
    });

    const images = response.data.hits;

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    showImages(images);
    if (images.length < 40) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.style.visibility = 'visible';
      Notiflix.Notify.info(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }

    lightbox.refresh();
    function pageScroll() {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function showImages(images) {
  const imageCards = images.map(image => createImage(image));
  gallery.innerHTML += imageCards.join('');
}

function createImage(image) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = image;

  return `
    <div class="photo-card">
    <a href="${largeImageURL}" data-lightbox="gallery" data-title="${tags}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy">
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </div>
  `;
}

loadMoreBtn.addEventListener('click', loadMoreImages);

function loadMoreImages() {
  currentPage++;
  getImage(currentQuery, currentPage);
}
