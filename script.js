// source: 'https://gnews.io/dashboard'
const API_KEY = "808bfdab4ac1ddef9a80fce663055a30";

// initial visit on website shows India news
window.addEventListener("load", () => fetchNews('https://gnews.io/api/v4/search?q=' + 'India' + '&lang=en&country=us&max=10&apikey=' + API_KEY));

// reload the website when logo is clicked
function reload() {
   window.location.reload();
};

// to avoid nesting callbacks or using Promise chaining
async function fetchNews(url) {
   const res = await fetch(url);
   const data = await res.json();
   bindData(data.articles);
}

function bindData(articles) {
   const cardsContainer = document.getElementById('cards-container');
   const newsCardTemplate = document.getElementById('template-news-card');

   // page clears up first before showing the new data
   cardsContainer.innerHTML = "";

   articles.forEach((article) => {
      // don't show a news without image
      if (!article.image) return;
      const cardClone = newsCardTemplate.content.cloneNode(true);
      // fill the data in cards
      fillDataInCard(cardClone, article);
      // add card on website 
      cardsContainer.appendChild(cardClone);
   });
}

function fillDataInCard(cardClone, article) {
   const newsImg = cardClone.querySelector('#news-img');
   const newsTitle = cardClone.querySelector('#news-title');
   const newsSource = cardClone.querySelector('#news-source');
   const newsDesc = cardClone.querySelector('#news-desc');

   // set data to html id's
   newsImg.src = article.image;
   newsTitle.innerHTML = article.title;

   // Truncate description if it's too long
   const maxLength = 101;
   newsDesc.innerHTML = article.description.length > maxLength ? article.description.substring(0, maxLength - 3) + "..." : article.description;

   // change the date format for user understanding
   const date = new Date(article.publishedAt).toLocaleString("en-US", {
      timeZone: "Asia/Jakarta"
   });

   // now, set the source data to our source's id
   newsSource.innerHTML = `${article.source.name} &#183; ${date}`;

   // if user clicks on the card it will be directed to that news-page
   cardClone.firstElementChild.addEventListener('click', () => {
      window.open(article.url, "_blank");
   });
}

// ------------------- Activate current Nav selection -------------------
let curSelectedNav = null;
// show news related to nav-clicked
function onNavItemClick(id) {
   fetchNews('https://gnews.io/api/v4/search?q=' + id + '&lang=en&country=us&max=10&apikey=' + API_KEY);
   const navItem = document.getElementById(id);
   // remove active class from previous selection
   curSelectedNav?.classList.remove('active');
   curSelectedNav = navItem;
   curSelectedNav.classList.add('active');

   // Clear the search field when user clicks on nav links
   searchText.value = '';
}

// ---------------------- search bar functianality ----------------------
const searchButton = document.getElementById('search-btn');
const searchText = document.getElementById('search-text');

function performSearch() {
   const query = searchText.value;
   // do nothing if user just clicked on the btn w/o giving input
   if (!query) return;
   // otherwise fetch and show the searched news
   fetchNews('https://gnews.io/api/v4/search?q=' + query + '&lang=en&country=us&max=10&apikey=' + API_KEY);

   // bug fix: remove active-nav when search happened
   curSelectedNav?.classList.remove('active');
   curSelectedNav = null;
}

// when user clicks the Search-Button
searchButton.addEventListener('click', performSearch);

// When user Press Enter after giving search input
searchText.addEventListener('keydown', (event) => {
   if (event.key === 'Enter') {
      performSearch();
   }
});