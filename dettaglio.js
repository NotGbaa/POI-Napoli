import { login, set, get } from "./salva.js";
const buttonLog = document.getElementById("login");
const divLogin = document.getElementById('divLogin');
const divDettagli = document.getElementById('divDettagli');
let id = getParameters("id");
let myPOI = null;

function getParameters(param) {
  const query = window.location.search;
  const urlParams = new URLSearchParams(query);
  const retValue = urlParams.get(param);
  return retValue;
}
function getPOI(id) {
  return new Promise((resolve, reject) => {
    get("POI").then((response) => {
      if (response.result != "") {
        let POI = [];
        POI = JSON.parse(response.result);
        console.log("id", id - 1)
        let myPOI = POI[id - 1];
        resolve(myPOI);
      }
    });
  });
}

function render() {
  let imgDiv = document.getElementById("img");
  const tabella = document.getElementById("tabella");
  const view = document.getElementById("view");
  view.onclick = () => {
    window.location.href = "list.html";
  }
  const templateCaroselItem = `<div class="carousel-item %ACTIVE">
      <img class="d-block w-100" src="%URL" alt="First slide">
    </div>
    `
  const templateCarosel = `
  <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner">
   %ITEMS
  </div>
  <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
  `
  const table = `
  <tr>
    <td rowspan="3">
      <div id="img" class="d-flex justify-content-center">
      %IMG
        </div>
    </td>
    <td>
      <div id="title">%TIT</div>
    </td>
  </tr>
  <tr>
    <td>
      <div id="description">%DESCRIZIONE</div>
    </td>
    <td>
      <div id="pos">%POS</div>
    </td>
  </tr>
  <tr>
    <td>
      <div id="rate">%VALUTAZIONE</div>
    </td>
<td>
      <div id="dist">%DISTANZA</div>
    </td>

  </tr>
        `;

  let caroselItems = "";
  myPOI.img.forEach((img, index) => {
    if (img != undefined) {
      caroselItems += templateCaroselItem.replace("%ACTIVE", index == 0 ? "active" : "").replace("%URL", img);
    }  });
  let carosel = templateCarosel.replace("%ITEMS", caroselItems);
  let htmlTab = "";
  htmlTab += table.replace("%IMG", carosel).replace("%TIT", myPOI.nome).replace("%DESCRIZIONE", myPOI.descrizione).replace("%POS", "" + myPOI.longitudine + "" + myPOI.latitudine).replace("%VALUTAZIONE", myPOI.valutazione).replace("%DISTANZA", myPOI.distanza);
  tabella.innerHTML = htmlTab;
}



getPOI(id).then(response => {
  myPOI = response;
  console.log(myPOI);
  render();
});

buttonLog.onclick = () => {
  login(username.value, password.value).then((element) => {
    if (element.result !== false) {
      if (username.value && password.value == "Admin") {
        window.location.href = "./admin.html";
      } else {
        divLogin.style.display = 'none';
        divDettagli.style.display = 'block';
      }
    } else {
      alert("You are not registered, please check that you have entered the right credentials.")
    }

  })
}
