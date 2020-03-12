let newsList = []

//let pageSize=30;

let page = 1;

let total;

let keyword;

let pageSize = 20;

let category = 'general';

let callAPI = async ()=>{
    let apiKey = '31ab7921e9ce4dbfac4dd7b7413bd3de'; //get API key
    let url=`http://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}` //get url

    let data = await fetch(url); //wait to fetch url. Without await the program runs to later steps and has errors
    let result = await data.json(); //wait for data to be parsed to object
    console.log("data", data);
    console.log("json", result);
    console.log(result.totalResults)
    total = result.totalResults;
    newsList = result.articles;
    render(newsList)
}

function categoryFilter(choice) {
    category = choice;
    callAPI();
}

// async function callAPI() {
//     let apiKey = '';
//     let url=`http://newsapi.org/v2/everything?q=korea&apiKey=${apiKey}`

//     let data = await fetch(url);
//     console.log("data", data)
// }

let render = (array) => {
    let htmlForNews = array.map((item) => {
        return `<div class="card mb-3" style="max-width: 100%;">
    <div class="row no-gutters">
      <div class="col-md-4">
        <img src="${item.urlToImage}" class="card-img">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <div class="news-company text-danger">${item.source.name.split('.')[0]}</div>
          <h5 class="card-title"><a href="${item.url}">${item.title}</a></h5>
          <p class="card-text">${item.description}</p>
          <p class="card-text"><small class="text-muted">${moment(item.publishedAt).fromNow()}</small></p>
        </div>
      </div>
    </div>
  </div>`}).join('')




    // let sourceNames = array.map((item) => {
    //     let newArray2 = item.source.name;
    //     console.log(newArray2)
    // })        

    let htmlForSources = array.map((item) => {

        let sourceName = item.source.name.split('.')[0]
        
        return `<div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="${item.source.name}" onclick="filterBySource(${item.source.name})">
        <label class="custom-control-label" for="${item.source.name}">${sourceName}</label>
      </div>`}).join('')
    
    document.getElementById('totalNews').innerHTML = `Showing ${array.length} of ${total}`
    document.getElementById('sourceArea').innerHTML = htmlForSources
    document.getElementById('newsArea').innerHTML = htmlForNews

}


async function loadMore(){
    page++;
    let apiKey = '31ab7921e9ce4dbfac4dd7b7413bd3de'; //get API key
    let url=`http://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}` //get url

    let data = await fetch(url); //wait to fetch url. Without await the program runs to later steps and has errors
    let result = await data.json(); //wait for data to be parsed to object
    console.log("data", data);
    console.log("json", result);
    
    let moreList = result.articles;
    newsList = newsList.concat(moreList);
    render(newsList)
}

callAPI()

async function searching() {
    let keyword = document.getElementById("searchBar").value;
    let apiKey = '31ab7921e9ce4dbfac4dd7b7413bd3de'; //get API key
    let url=`http://newsapi.org/v2/top-headlines?country=us&q=${keyword}&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}` //get url

    let data = await fetch(url); //wait to fetch url. Without await the program runs to later steps and has errors
    let result = await data.json(); //wait for data to be parsed to object
    console.log("data", data);
    console.log("json", result);
    console.log(result.totalResults)
    total = result.totalResults;
    newsList = result.articles;
    render(newsList)
}

function filterBySource(sourceName){
    listFilteredBySource = newsList.filter(() => {
        return newsList.source.name = sourceName;
    });
    render(listFilteredBySource)
}
