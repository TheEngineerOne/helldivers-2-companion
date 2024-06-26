
const apiUrl = "https://helldivers-2-dotnet.fly.dev"
const planetsUrl = "/api/v1/planets"
const planetsApi = apiUrl + planetsUrl


var planetViewText = undefined
var data = undefined

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(url){
  let response = await fetch(url)
  if(response.ok){
    let json = await response.json()
    return(json)
  }else{
    throw new Error('HTTP-ERROR : ' + response.status, {cause: response.status})
  }
}

async function planetViewLoader(){
  let response = await fetch("view/planets.html")
  planetViewText = await response.text()
}

async function loadPlanet(data){
  let main_content = document.querySelector(".main_content")
  let planet = document.createElement("div")
  planet.innerHTML = planetViewText
  main_content.appendChild(planet)
  planet.querySelector(".planet_name").innerText = data.name
  planet.querySelector(".planet_percentage").innerText = "Liberation : " + ((1-(data.health / data.maxHealth))*100).toPrecision(4).toString() + "%"
  let icon = planet.querySelector(".icon")
  switch(data.currentOwner){
    case "Terminids" :
      icon.setAttribute("src","img/terminid.png")
      break;
    case "Automaton" :
      icon.setAttribute("src","img/automaton.png")
  }
}

async function loadElement(){
  let main_content = document.querySelector(".main_content")
  try{
    if(data == undefined){
      data = await request(planetsApi)
    }else{
      let newData = await request(planetsApi)
      for(let i = 0, content; content = newData[i];i++){
        Object.assign(data[i],content)
      }
    }
    document.querySelector(".main_content").innerHTML = ""
    for(const element of data){
      if(element.health != element.maxHealth){
        loadPlanet(element)
      }
    }
  }catch(error){
    data = undefined
    console.error(error)
    let error_display = await fetch('view/error.html')
    main_content.innerHTML = await error_display.text()
    if(error.cause != undefined){
      document.querySelector("#ErrorMessage").innerText = error.cause
    }
  }
}

window.onload = async () => {
  let main_content = document.querySelector(".main_content")
  planetViewLoader()
  while(true){
    loadElement()
    await sleep(30000)
  }
}
