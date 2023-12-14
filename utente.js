import { login, set, get } from "./salva.js";
const tabellaElenco = document.getElementById("tabella");
const tabMappa = document.getElementById("tab");
const buttonLog = document.getElementById("login");
const divLogin = document.getElementById('divLogin');
const divMappa = document.getElementById('divMappa');
const divElenco = document.getElementById('divElenco');
const buttonEle = document.getElementById('elenco');
const buttonMap = document.getElementById('mappa');

function setLayers(map) {
  const layers = [new ol.layer.Tile({ source: new ol.source.OSM() })];
  map.addLayer(new window.ol.layer.Group({ layers }));
}
function setCenter(map, lonlat) {
  const center = window.ol.proj.fromLonLat(lonlat);
  map.getView().setCenter(center);
}
function setZoom(map, zoom) {
  map.getView().setZoom(zoom);
}
function addMarker(map, point) {
  const feature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(point.lonlat))
  });
  feature.name = point.name;
  const layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [feature]
    }),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        crossOrigin: 'anonymous',
        src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
      })
    })
  });
  map.addLayer(layer);
}
const caricaMark = (map) => {
  get("POI").then((response) => {
    if (response.result != "") {
      POI = JSON.parse(response.result);
      console.log("dopo get", POI);
      POI.forEach((element) => {
        let marker = { lonlat: [element.longitudine, element.latitudine], name: element.nome };
        addMarker(map, marker);
      });
    }
  });
}

const map = new ol.Map({ target: document.querySelector('.map') });
setLayers(map);
setCenter(map, [14.2681244, 40.8517746]);
setZoom(map, 12);
caricaMark(map);
const tableElenco = `
    <tr>
    <td> %DETTAGLIO </td>
      <td >%IMG</td>
      <td >%TIT</td>
      <td >%POS</td>
    </tr>
      `;
let htmlTab = "";
let htmlTabMap = "";
//  "https://i.imgur.com/JBcvbpr.png";
let id = 0;
let idMap = 0;

let imgArray = "";
let POI = [];
//render per creazione della tabella dell'elenco in vista mappa
const renderTabMap = () => {
  //get per ottenere tutti i POI
  get("POI").then((response) => {
    if (response.result != "") {
      POI = JSON.parse(response.result);
      console.log("dopo get tabella mappa", POI);
      htmlTabMap = "";
      idMap = 0;
      POI.forEach((element) => {
        idMap++;
        //creo la riga contenente i dati del POI inserito
        htmlTabMap += tableElenco.replace("%IMG", "<img src='" + element.img[0] + "' title='source: imgur.com' height='125px' width='250px' >").replace("%TIT", element.nome).replace("%POS", "" + element.longitudine + "" + element.latitudine).replace("%DETTAGLIO", "<button class='btn btn-primary' id='bottone-" + id + "'>visualizza Dettaglio</button>");
      });
      // aggiungo la tabella al div
      tabMappa.innerHTML = htmlTabMap;
      //ciclo per far funzionare tutti i bottoni per entrare in vista elenco per una riga dalla tabella
      for (let cont = 1; cont <= idMap; cont++) {
        let button = document.getElementById("bottone-" + cont);
        //bottone per rimuovere POI
        button.onclick = () => {
          window.location.href = "dettaglio.html?id=" + cont;
        }
      }
    }
  });
}
renderTabMap();
//render per creazione della tabella vista elenco
const renderElenco = () => {
  //get per ottenere tutti i POI
  get("POI").then((response) => {
    if (response.result != "") {
      POI = JSON.parse(response.result);
      console.log("dopo get", POI);
      htmlTab = "";
      id = 0;
      POI.forEach((element) => {
        id++;
        //creo la riga contenente i dati del POI inserito
        htmlTab += tableElenco.replace("%IMG", "<img src='" + element.img[0] + "' title='source: imgur.com' height='125px' width='250px' >").replace("%TIT", element.nome).replace("%POS", "" + element.longitudine + "" + element.latitudine).replace("%DETTAGLIO", "<button class='btn btn-primary' id='bottone-" + id + "'>visualizza Dettaglio</button>");
      });
      // aggiungo la tabella al div
      tabellaElenco.innerHTML = htmlTab;
      //ciclo per far funzionare tutti i bottoni per entrare in vista elenco per una riga dalla tabella
      for (let cont = 1; cont <= id; cont++) {
        let button = document.getElementById("bottone-" + cont);
        button.onclick = () => {
          window.location.href = "dettaglio.html?id=" + cont;
        }
      }
    }
  });
}
renderElenco();

buttonEle.onclick = () =>{
  divElenco.style.display = 'block';
  divMappa.style.display = 'none';
}
buttonMap.onclick = () =>{
  divElenco.style.display = 'none';
  divMappa.style.display = 'block';
}
buttonLog.onclick = () => {
  login(username.value, password.value).then((element) => {
    if (element.result !== false) {
      if (username.value && password.value == "Admin") {
        window.location.href = "./admin.html";
      } else {
        divLogin.style.display = 'none';
        divMappa.style.display = 'block';
      }
    } else {
      alert("You are not registered, please check that you have entered the right credentials.")
    }

  })
}