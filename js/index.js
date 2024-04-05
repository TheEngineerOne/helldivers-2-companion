
const apiUrl = "https://helldivers-2-dotnet.fly.dev"
const planetsUrl = "/api/v1/planets"
const planetsApi = apiUrl + planetsUrl

async function request(url){
  let response = await fetch(url)
  if(response.ok){
    let json = await response.json()
    return(json)
  }else{
    throw new Error('HTTP-ERROR : ' + response.status)
  }
}

window.onload = async () => {
  try{
  let data = await request(planetsApi)
  }catch(error){
    console.error(error)
    fetch('view/error.html')
      .then(response => response.text())
      .then(text => document.body.innerHTML = text)
  }
}
