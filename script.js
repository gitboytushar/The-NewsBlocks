// source: 'https://newsapi.org/'
const API_KEY = "ec42a39cec92484983ddd753b45d10f0";
const url = "https://newsapi.org/v2/everything?q=";

// initial visit on website shows India news
window.addEventListener("load", () => fetchNews("India"));

// reload the website when logo is clicked
function reload() {
   window.location.reload();
};

//  nesting callbacks or using Promise chaining
async function fetchNews(query) {
   const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
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
      if (!article.urlToImage) return;
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
   newsImg.src = article.urlToImage;
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
   fetchNews(id);
   const navItem = document.getElementById(id);
   // remove active class from previous selection
   curSelectedNav?.classList.remove('active');
   curSelectedNav = navItem;
   curSelectedNav.classList.add('active');
}

// ---------------------- search bar functianality ----------------------
const searchButton = document.getElementById('search-btn');
const searchText = document.getElementById('search-text');

function performSearch() {
   const query = searchText.value;
   // do nothing if user just clicked on the btn w/o giving input
   if (!query) return;
   // otherwise fetch and show the searched news
   fetchNews(query);

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