const menusSec = document.getElementById("menus");
const typingSec = document.getElementById("typing-sec");
const musicSec = document.getElementById("music-sec");
const mainSec=document.querySelector(".hero-image")

const ccmBtn = document.getElementById("menus-ccm");
const typingBtn = document.getElementById("menus-typing");

const navUl = document.getElementById("nav-ul");
const navCCM = document.getElementById("nav-ccm");
const navTyping = document.getElementById("nav-typing");
const navHome = document.getElementById("nav-home");
const navAll = document.getElementById("nav-all");

// CCM
const lis = document.querySelectorAll("li");
const result = document.getElementById("result");
const inputSearch = document.getElementById("input-search");
const searchBtn = document.querySelector("#searchBtn");
// TYPING
const show = document.getElementById("show");
const inputTyping = document.getElementById("input-typing");
const h5 = document.getElementById("typing-text");
const getScore = document.getElementById("scoreNums");
const timer = document.getElementById("timer");

const startBtn = document.getElementById("startBtn");

const GAME_TIME = 60;
let list = [];
const words = [];
let nums = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
ccmBtn.addEventListener("click", goToCCM, { passive: true });
typingBtn.addEventListener("click", goToTyping, { passive: true });

navCCM.addEventListener("click", goToCCM, { passive: true });
navTyping.addEventListener("click", goToTyping, { passive: true });
navHome.addEventListener("click", goToMenu, { passive: true });
searchBtn.addEventListener("click", makeInput, { passive: true });
navAll.addEventListener("click", all, { passive: true });

async function all(evt) {
  console.log(evt.target);
  musicSec.classList.remove("hide");
  typingSec.classList.remove("hide");
  await getSearch();
}

async function goToCCM(evt) {
  evt.preventDefault();
  musicSec.classList.toggle("hide");
  typingSec.classList.add("hide");
  menusSec.classList.add("hide");
  mainSec.classList.add("hide")

  await getSearch();
}

function goToTyping(evt) {
  evt.preventDefault();
  musicSec.classList.add("hide");
  typingSec.classList.toggle("hide");
  menusSec.classList.add("hide");
}

function goToMenu(evt) {
  evt.preventDefault();
  menusSec.classList.toggle("hide");
}

async function makeInput(evt) {
  evt.preventDefault();
  getByKeyword(inputSearch.value);
}

const getSource = async () => {
  url.searchParams.set("_page",page)
  try {
    let res = await fetch(url);
    let data = await res.json();
    console.log(data);
    list = data;
    pagination();
  } catch (e) {
    console.log(e);
  }
};

const getSearch = async () => {
  url = new URL(` https://my-json-server.typicode.com/jenny4711/CN-4th_Project/ccm?_limit=4`);
  console.log(url)
  await getSource();
  render();
};

const getByKeyword = async (keyword) => {
  url = new URL(`https://my-json-server.typicode.com/jenny4711/CN-4th_Project/ccm/?q=${keyword}`);
  await getSource();
  render();
};

const render = () => {
  let show = "";
  show = list
    .map((item) => {
      return `
  
     
      <div class="source col-6">
      <h3>${item.name}</h3>
      <iframe width="350" height="250" src=${item.url} allowfullscreen></iframe>
      <img class="img" src=${item.sheet} alt="sheet">
    
      </div>`;
    })
    .join("");
  result.innerHTML = show;
};

let page=1;
let total_page=1;
// pagination
const pagination=()=>{
  let pgnHTML =``;
  let pageGroup=Math.ceil(page/5);
  let last = pageGroup *5;
  let first = last -4;

 
  pgnHTML +=` <li class=${page == 1 ? "hide" : "page-item"}>
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
    page - 1
  })">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;


  for(let i=first;i <=last;i++){
    pgnHTML += `<li class="page-item ${page ===i?"activate":""}">
    <a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a>
    </li>`
  }

  pgnHTML += `<li class=${page == 5 ? "hide" : "page-item"}>
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
    page + 1
  })">
    <span  aria-hidden="true">&gt;</span>
  </a>
  
  
  
  </li>`;

 

  render()
  document.getElementById("pagination").innerHTML=pgnHTML;

}

const moveToPage=async(pageNum)=>{
  page=pageNum;
  if (page < 1) {
    page = 5;
  } else if (page > 5) {
    page = 1;
  } else {
    page;
  }
  await getSource() 
}











// TYPING GAME
const getWords = async (cat, aa, bb) => {
  url = new URL(
    `https://yesu.io/bible?lang=kor&doc=${cat}&start=${aa}&end=${bb}`
  );
  try {
    let res = await fetch(url);
    let data = await res.json();

    data.map((item) => {
      if (item.message.length < 40) {
        words.push(item.message);
        console.log(words);
      }
    });
    buttonChange("START");
  } catch (e) {
    console.log(e);
  }
};

init();
function init() {
  buttonChange("LOADING");
  getWords("mat", "10:10", "11:10");
  words;
  inputTyping.addEventListener("input", checkMatch);
}

function run() {
  if (isPlaying) {
    return;
  }
  isPlaying = true;
  time = GAME_TIME;
  inputTyping.focus();
  getScore.innerHTML = 0;
  timeInterval = setInterval(countDown, 1000);
  checkInterval = setInterval(checkStatus, 50);
  buttonChange("LOADING...");
}

function checkStatus() {
  if (!isPlaying && time === 0) {
    buttonChange("START");
    clearInterval(checkInterval);
    
  }
}

function checkMatch() {
  console.log(inputTyping.value === h5.innerText);
  if (inputTyping.value === h5.innerText) {
    inputTyping.value = "";
    if (!isPlaying) {
      return;
    }
    nums++;
    getScore.innerText = nums;
    const randomIdx = Math.floor(Math.random() * words.length);
    h5.innerHTML = words[randomIdx];
  }
}

function countDown() {
  time > 0 ? time-- : (isPlaying = false);
  if (!isPlaying) {
    clearInterval(timeInterval);
  }
  timer.innerHTML = time;
}

function buttonChange(text) {
  startBtn.innerHTML = text;
}







