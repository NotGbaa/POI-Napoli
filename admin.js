import { login, set, get } from "./salva.js";
const username = document.getElementById("username");
const password = document.getElementById("password");
const buttonLog = document.getElementById("login");
const divLogin = document.getElementById('divLogin');
const divAdmin = document.getElementById('divAdmin');
const tabella = document.getElementById("tabella");
const nome = document.getElementById("nome");
const descr = document.getElementById("descr");
const long = document.getElementById("long");
const lat = document.getElementById("lat");
const dis = document.getElementById("distanza");
const img = document.getElementById("img");
const buttonAdd = document.getElementById("add");
// Aggiungi gestori di eventi alle stelle
const stars = document.querySelectorAll('.star');
const ratingElement = document.getElementById('selected-rating');
const valutazione = 0;
stars.forEach(star => {
  star.addEventListener('click', () => {
    const rating = parseInt(star.getAttribute('data-star'));
    updateRating(rating);
    valutazione = rating;
  });

  star.addEventListener('mouseover', () => {
    const rating = parseInt(star.getAttribute('data-star'));
    highlightStars(rating);

  });

  star.addEventListener('mouseout', () => {
    resetStars();
    const currentRating = parseInt(ratingElement.textContent);
    highlightStars(currentRating);
  });
});

const updateRating = (rating) => {
  ratingElement.textContent = rating;
  highlightStars(rating);
}

const highlightStars = (count) => {
  resetStars();
  stars.forEach(star => {
    const starRating = parseInt(star.getAttribute('data-star'));
    if (starRating <= count) {
      star.classList.add('selected');
    }
  });
}

const resetStars = () => {
  stars.forEach(star => {
    star.classList.remove('selected');
  });
}

const table = `
    <tr>
      <td >%ID</td>
      <td >%IMG</td>
      <td >%TIT</td>
      <td >%POS</td>
      <td> %DELETE </td>
    </tr>
      `;
let htmlTab = "";
//  "https://i.imgur.com/JBcvbpr.png";
let id = 0;
let imgArray = "";
let POI = [];
//render per creazione della tabella
const render = () => {
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
        htmlTab += table.replace("%ID", id).replace("%IMG", "<img src='" + element.img[0] + "' title='source: imgur.com' height='125px' width='250px' >").replace("%TIT", element.nome).replace("%POS", "" + element.longitudine + "" + element.latitudine).replace("%DELETE", "<button class='btn btn-danger' id='bottone-" + id + "'>cancella POI</button>");
      });
      // aggiungo la tabella al div
      tabella.innerHTML = htmlTab;
      //ciclo per far funzionare tutti i bottoni per eliminare una riga dalla tabella
      for (let cont = 1; cont <= id; cont++) {
        let button = document.getElementById("bottone-" + cont);
        //bottone per rimuovere POI
        button.onclick = () => {
          console.log("cancello POI" + cont);
          get("POI").then((response) => {
            if (response.result != "") {
              POI = JSON.parse(response.result);
              POI.splice(cont - 1, 1);
              console.log("cancellati", POI)
              set(POI, "POI").then(() => { render() });

            }
          });
        }
      }
    }
  });
}

buttonAdd.onclick = () => {
  console.log("entratro");
  imgArray = img.value.split(",");
  get("POI").then((response) => {
    POI = JSON.parse(response.result);
    //aggiungo un POI alla lista
    POI.push({ "nome": nome.value, "descrizione": descr.value, "longitudine": long.value, "latitudine": lat.value, "img": imgArray, "valutazione": valutazione, "distanza": dis.value });
    //salvo i POI sulla cache remota
    set(POI, "POI").then(() => { render() })
    console.log("passa", POI);
  });
}

buttonLog.onclick = () => {
  login(username.value, password.value).then((element) => {
    if (element.result !== false) {
      if (username.value && password.value == "Admin") {
        divLogin.style.display = 'none';
        divAdmin.style.display = 'block';
        render();
      } else {
        window.location.href = "./list.html";
      }
    } else {
      alert("You are not registered, please check that you have entered the right credentials.")
    }

  })
}
