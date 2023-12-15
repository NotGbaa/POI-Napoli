const urlLogin = "https://ws.progettimolinari.it/credential/login";
const key = "dbe120ab-55b2-4a15-8a5b-78aa04bd6975";
export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    fetch(urlLogin, {
      headers: {
        "Content-Type": "application/json",
        key: key
      },
      method: "POST",
      body: JSON.stringify(
        {
          username: username,
          password: password
        })
    })
      .then((r) => {
        resolve(r.json())
      })

      .catch((error) => { reject(error) });
  })

};
export const set = (dict, token) => {
  return new Promise((resolve, reject) => {
    fetch("https://ws.progettimolinari.it/cache/set", {
      headers: {
        "content-type": "application/json",
        key: key
      },
      method: "Post",
      body: JSON.stringify({
        key: token,
        value: JSON.stringify(dict),
      })
    })
      .then((element) => element.json())
      .then((element) => {
        console.log("Salvataggio dati : ", element);
        resolve(element)
      })
      .catch((error) => console.error(error))
  })
}


export const get = (token) => {
  return new Promise((resolve, reject) => {
    fetch("https://ws.progettimolinari.it/cache/get", {
      headers: {
        "content-type": "application/json",
        key: key
      },
      method: "Post",
      body: JSON.stringify({
        key: token
      })
    })
      .then((r) => resolve(r.json()))
      .catch((error) => reject(error));
  });
}