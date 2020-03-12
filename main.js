let newsList = []

//let pageSize=30;

let page = 1;

let total;

let keyword;

let pageSize = 20;

let category = 'general';

let callAPI = async ()=>{
    let apiKey = '31ab7921e9ce4dbfac4dd7b7413bd3de'; //get API key
    let url=`https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}` //get url

    let data = await fetch(url); //wait to fetch url. Without await the program runs to later steps and has errors
    let result = await data.json(); //wait for data to be parsed to object
    console.log("data", data);
    console.log("json", result);
    console.log(result.totalResults)
    total = result.totalResults;
    newsList = result.articles;

    filterBySource();

    render(newsList)
}

function categoryFilter(choice) {
    page=1;
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
    
    document.getElementById('totalNews').innerHTML = `Showing <span class="text-primary">${array.length}</span> of <span class="text-primary">${total}</span>`
    // document.getElementById('sourceArea').innerHTML = htmlForSources
    document.getElementById('newsArea').innerHTML = htmlForNews

}


async function loadMore(){
    page++;
    let apiKey = '31ab7921e9ce4dbfac4dd7b7413bd3de'; //get API key
    let url=`https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}` //get url

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
    let url=`https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}` //get url

    let data = await fetch(url); //wait to fetch url. Without await the program runs to later steps and has errors
    let result = await data.json(); //wait for data to be parsed to object
    console.log("data", data);
    console.log("json", result);
    console.log(result.totalResults)
    total = result.totalResults;
    newsList = result.articles;
    render(newsList)
}

function filterBySource(){
    let sourceNames = newsList.map((item) => item.source.name.split('.')[0])
    console.log('sourceNames:',sourceNames)

    let sourceObject = sourceNames.reduce((total, name) => {
        console.log('total:',total);
        if(name in total){
            total[name]++
        } else {
            total[name]=1
        }
        return total 
    },{})

    console.log('sourceObject:',sourceObject);

    let sourceArray = Object.keys(sourceObject);

    console.log('sourceArray:',sourceArray)

    let htmlForSource = sourceArray.map((item) => 
    `<div><input type="checkbox" name="sources" onclick="sourceChange('${item}')" id="${item}"/>
    <label for="${item}">${item} (${sourceObject[item]})</label></div>`).join('');

    document.getElementById("sourceArea").innerHTML = htmlForSource
}

let sourceChange = index => {
    if(document.getElementById(index).checked==true){
        let filteredNews = newsList.filter((item) => item.source.name.split('.')[0]===index)
        render(filteredNews);
    } else {
        render(newsList)
    }
}