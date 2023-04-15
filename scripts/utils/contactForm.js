/*---- Fonctionnalités des boutons ----*/

// On déclare des variables pour chaque class ou id associé à chaque bouton

// Les boutons

// Bouton d'ouverture de fenêtre
const modalBtn = document.querySelectorAll(".JS-modal-btn");

// Boutons de fermeture de fenêtre
const closeBtn = document.querySelectorAll(".JS-close");

/*---- Fonctionnalités associées à l'apparition/disparition du modal et de la confirmation d'envoie des données ----*/

const modalbg = document.querySelector(".bground"); // constante qui gère l'apparition du formulaire
const media = document.getElementById("main");
const formContent = document.querySelector(".content");

// Lancement/fermeture du modal au clique sur le bouton associé à la fonctionnalité
// Le clique exécute la fonction launchModal/closeWindow associée

modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
closeBtn.forEach((btn) => btn.addEventListener("click", closeWindow));

function launchModal() {
  modalbg.style.display = "block";
  formContent.setAttribute("aria-hidden", "false"); // Visible par les technologies d'assistance
  media.setAttribute("aria-hidden", "true"); // Non visible par les technologies d'assistance
  formContent.setAttribute("aria-modal", "true");
}

function closeWindow() {
  modalbg.style.display = "none";
  formContent.setAttribute("aria-hidden", "true"); // Non visible par les technologies d'assistance
  media.setAttribute("aria-hidden", "false"); // Visible par les technologies d'assistance 
  formContent.setAttribute("aria-modal", "false");
}

/*-- Soumission des données --*/

// Déclaration du bouton d'envoi

const submitBtn = document.getElementById("JS-btn-submit");

// Déclaration des lignes du formulaire

const firstname = document.getElementById("JS-first");
const surname = document.getElementById("JS-last");
const email = document.getElementById("JS-email");
const message = document.getElementById("JS-message");

const response = [firstname, surname, email, message];

// Au clique, si le champ est vide, on met un message d'erreur dans la console. Sinon, on met la valeur du champ
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  for(i=0; i<response.length; i++) {
    if(response[i].value.length === 0){
      console.log('Ce champ est vide')
    }else{
      console.log(response[i].value)
    }
    closeWindow();
  }
});

