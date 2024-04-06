
const apiUrl = "https://helldivers-2-dotnet.fly.dev"
const planetsUrl = "/api/v1/planets"
const planetsApi = apiUrl + planetsUrl
var planetViewText;

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

}

window.onload = async () => {
  let main_content = document.querySelector(".main_content")
  planetViewLoader()
  try{
  let data = await request(planetsApi)
  for(const element of data){
    loadPlanet(element)
  }
  //main_content.appendChild(planet_view)
  }catch(error){
    console.error(error)
    let error_display = await fetch('view/error.html')
    main_content.innerHTML = await error_display.text()
    if(error.cause != undefined){
      document.querySelector("#ErrorMessage").innerText = error.cause
    }
  }
}
