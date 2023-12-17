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
    <td  width="50%" class='p-2'>
      <div id="title" class='h1'>%TIT</div>
    </td>
    <td rowspan="2" width="30%">
      <div id="img" class="d-flex justify-content-center">
      %IMG
        </div>
    </td>
    </tr>
  <tr>
    <td>
      <div id="description"  class='p-2'>%DESCRIZIONE</div>
    </td>
  </tr>
  <tr>
    <td>
    <div id="rating" class="d-flex ">
    <!-- Crea cinque stelle vuote -->
    <span class="star" data-star="1">&#9734;</span>
    <span class="star" data-star="2">&#9734;</span>
    <span class="star" data-star="3">&#9734;</span>
    <span class="star" data-star="4">&#9734;</span>
    <span class="star" data-star="5">&#9734;</span>
  </div>  
    </td>
        <td>
      <div id="pos" class='h5'>%POS</div>
      <div id="dist" class='h5'>%DISTANZA</div>
    </td>

  </tr>
        `;

  let caroselItems = "";
  myPOI.img.forEach((img, index) => {
    if (img != undefined) {
      caroselItems += templateCaroselItem.replace("%ACTIVE", index == 0 ? "active" : "").replace("%URL", img);
    }
  });
  let carosel = templateCarosel.replace("%ITEMS", caroselItems);
  let htmlTab = "";
  htmlTab += table.replace("%IMG", carosel).replace("%TIT", myPOI.nome).replace("%DESCRIZIONE", myPOI.descrizione).replace("%POS", "Longitudine:" + myPOI.longitudine + " <br />Latitudine:" + myPOI.latitudine).replace("%DISTANZA", "Distanza dal centro storico: "+myPOI.distanza+" km");
  tabella.innerHTML = htmlTab;
  const stars = document.querySelectorAll(".star");
  const highlightStars = (count) => {
    stars.forEach(star => {   
      const starRating = parseInt(star.getAttribute('data-star'));
      if (starRating <= count) {
        star.classList.add('selected');
      }
    });
  }
  highlightStars(myPOI.valutazione);

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

        divLogin.style.display = 'none';
        divDettagli.style.display = 'block';
