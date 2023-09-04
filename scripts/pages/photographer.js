/*----- Code qui gère la page de chaque photographe -----*/

/*------------------------------------------------------------------------------------------------------*/

/*---------- Présentation des différentes class intervenant dans le JS ----------*/


/*-- Class qui récupère les données du json --*/

class GetPhotographerJsonData {
  constructor(adressJSON) {
    this._adressJSON = adressJSON
  }

  async get(){
    return fetch(this._adressJSON)
        .then(res => res.json())
  }
}


/*-- Class qui va générer l'en-tête de la page d'un photographe --*/

class PhotographerHeader {
  constructor(data){
    this._name = data.name
    this._city = data.city
    this._country = data.country
    this._tagline = data.tagline
    this._photoID = data.portrait
    this._price = data.price
  }

  titleShow(){
    return `<h2>${this._name}</h2>
            <h3>${this._city}, ${this._country}</h3>
            <h4>${this._tagline}</h4>`
  }

  async photoProfileShow(){
    return `<img src="assets/photographers/Sample_Photos/Photographers_ID_Photos/${this._photoID}" alt="${this._name}">`
  }

  priceShow() {
    return this._price + '€/jour'
  }
}


/*-- Class qui vont générer la card de chaque photo --*/

// La class Media récupère l'image ou la vidéo selon le média
class Media {
  constructor(data, url) {
    this._url = url
    this._image = data.image
    this._video = data.video
    this._title = data.title
    this._likes = data.likes
    this._id = data.id
  }

  Show() {
    if((this._image)=== undefined) {
      return `<video><source class="media-article-photo" src="assets/photographers/Sample_Photos/${this._url}/${this._video}" alt="${this._title}"></video>`
    }else if((this._image)!== undefined) {
      return `<img class="media-article-photo" src="assets/photographers/Sample_Photos/${this._url}/${this._image}" alt="${this._title}">`
    }else{
      console.log('Media non trouvé')
    }
  }
}

// La class qui va générer la card de chaque média du photographe 
// Elle hérite de Media pour récupérer les propriétés d'affichage de l'image/vidéo
class PhotographerPhotosCard extends Media {
  constructor(data, url){
    super(data, url)
  }

  getLikes() {
    return `<div id="${this._id}">${this._likes}</div>`
  }

  getCard() {
    return `<article class="media-card media-card_dimensions media-card_border">
                <a title="link-lightbox" href="?photo_id=${this._id}" class="JS-lightbox-button">
                    <div class="media-article-photo-crop media-article-photo-crop_dimensions media-article-photo-crop_border">${this.Show()}</div>
                </a>
                <div class="media-card-title media-card-title_dimensions">
                    <h3 class="media-article-title media-article-title_dimensions">${this._title}</h3>
                    <h3 class="media-article-like media-article-like_dimensions">${this.getLikes()} <button aria-label="likes" type="button" id="${this._id}" class="JS-like-button"><i class="fa-solid fa-heart"></i></button></h3>
                </div>
            </article>`
  }
}


/*-- Class qui va gérer le tri --*/

// Cette class répertorie toutes les fonctions relatives à chaque type de tri
class SortingMethod {
  constructor(folder){
    this._folder = folder
  }

  async popularity() {
    this._folder.sort(function(a, b){
      return b.likes - a.likes
    });
  }

  async date() {
    this._folder.sort(function(a, b){
      return b.date.split('-').reduce((a, b) => a + b) - a.date.split('-').reduce((a, b) => a + b)
    });
  }

  async title() {
    this._folder.sort(function(a, b){
      return a.title[0].charCodeAt() - b.title[0].charCodeAt()
    });
  }
}

/*-- Class qui vont générer la lightbox --*/

// Class qui s'occupe d'identifier le bon média à afficher au clique
class GetLightBoxMedia {
  constructor(folder, btn) {
    this._folder = folder
    this._btn = btn
  }

  /*-- Fonction qui récupère l'ID de la photo cliquée --*/
  getThisMediaIdByClick() {
    //Number convertit en nombre (sinon non reconnu par indexOf)
    const mediaID = Number (this._btn.href.split('?photo_id=')[1]);
    return mediaID
  }

  /*-- Fonction qui créé un tableau avec tous les id des média du photographe --*/
  getAllMediaIdByClick() {
    const tabMediaID = this._folder.map(data => data.id);
    return tabMediaID
  }

  /*-- On connait l'id du media cliqué (mediaID). On regarde l'indice correspondant dans le tableau tabMediaID --*/
  getThisMediaIndexByClick() {
    const mediaID = this.getThisMediaIdByClick();
    const tabMediaID = this.getAllMediaIdByClick();
    let index = tabMediaID.indexOf(mediaID);
    return index
  }

  /*-- Fonction qui récupère le bon média grace au information donnée par les fonctions précédentes --*/
  show(index){
    const tabMediaID = this.getAllMediaIdByClick();
    function filterPerMediaId(Media){ 
      if(Media.id == tabMediaID[index]){
        return true
      }
    }
    let lightboxMedia = this._folder.filter(filterPerMediaId)[0];
    return lightboxMedia
  }
}

// Class qui s'occupe de l'affichage de l'image/vidéo
class LightboxMedia {
  constructor(data, url){
    this._url = url
    this._image = data.image
    this._video = data.video
    this._title = data.title
    this._likes = data.likes
    this._id = data.id
  }

  display() {
    if((this._image)=== undefined){
      return `<video controls><source class="lightbox-image" src="assets/photographers/Sample_Photos/${this._url}/${this._video}" alt="${this._title}"></video>`
    }else{
      return `<img class="lightbox-image" src="assets/photographers/Sample_Photos/${this._url}/${this._image}" alt="${this._title}">`
    }
  }
}


/*-- Class qui gère les likes --*/

class Likes {
  constructor(folder, maxValue, button) {
    this._folder = folder
    this._button = button
    this._maxValue = maxValue
  }

  // Fonction qui met à jour les likes une fois cliqués
  likeUpDate() {
    // Boucle pour scanner chaque like pour mettre à jour la valeur du like cliqué (sous réserve qu'il n'est pas eu un +1)
    for(let i=0; i<this._folder.length; i++){
      if(this._folder[i].id == this._button.id && this._folder[i].likes<this._maxValue[i]){
        this._folder[i].likes = this._folder[i].likes+1;
        // Après modification, on récupère la balise html contenant chaque valeur de like...
        const likeMedia = document.getElementById(this._folder[i].id);
        // On efface l'ancienne valeur...
        likeMedia.innerHTML = '';
        // pour y injecter la nouvelle valeur
        likeMedia.innerHTML = this._folder[i].likes;
      }
    }
  }

  // Fonction qui somme tous les likes
  sumLikes() {
    // Récupération des likes de tous les média
    const tabLikes = this._folder.map(data => data.likes);
    // Calcul de la somme de tous les likes avec la fonction reduce
    const initialValue = 0;
    const result = tabLikes.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
    return result
  }
}

/*-- Class qui gère le formulaire --*/

class PhotographerForm {
  constructor(data){
    this._name = data.name
  }

  makeForm(){
    return `<h3>${this._name}</h3>`
  }
}

/*------------------------------------------------------------------------------------------------------*/

// Quand on récupère les données des photographes et de leur profil, on obtient un tableau avec un photographe par entrée
// Chaque photographe a un numéro d'entrée (ici de 0 à 5) associé, donc, à son ID
// Quand on se connecte à la page du photographe, on récupère l'ID injecté dans l'url et on l'associe au numéro du tableau
// Par cette méthode, on prend le tableau de données de tous les profils de photographe pour n'en récupérer que celui du photographe sélectionné
// On fait de même pour le tableau de données de tous les médias de tous les photographes
tabURL = {"243" : "0", "930" : "1", "82" : "2", "527" : "3", "925" : "4", "195" : "5"};

// Mettre PhotographerId à la place de url
const url = window.location.search.split('?id=').join('');


/*---- Script pour l'affichage de la page photographe quand on clique sur son profil ----*/

// Le script exécute la fonction init()
// Cette fonction exécute elle-même  la fonction getPhotographers() pour récupérer les données .json des photographes, gérer l'affichage des médias
// afficher les likes, la lightbox, trier les médias
// Puis ensuite la fonction displayData() pour afficher les données formatées par getPhotographers() (en utilisant photographerFactory()...)
// et s'occupe d'afficher l'en-tête, le formulaire et la somme des likes


/*-- Exécution de getPhotographers --*/

async function getPhotographers() {

  // Récupération des données de photographers.json (composées d'une partie "photographers" et d'une partie "media")
  /*let getJsonData = new GetPhotographerJsonData("./data/photographers.json").get();*/

  // Récupération de la partie "photographers" du json
  /*const photographersWork = await getJsonData.then(data => data.photographers);*/
  const photographersWork = data[0].photographers;

  // Récupération de la partie "media" du json
  /*const photographersMedia = await getJsonData.then(data => data.media);*/
  const photographersMedia = data[0].media;

  // Récupération des photos du photographe dont on est sur la page

  function filterPerID(photographersMedia){
    if(photographersMedia.photographerId == url){
      return true
    }
  }

  let photographersMediabyID = photographersMedia.filter(filterPerID);

  const media = document.getElementById("main");


  /*-- Affichage des cards correspondant à chaque média --*/

  // On prend la class correspondant à la div du conteneur de toutes les cards
  const photographerMedia = document.querySelector(".media_section");

  // L'ensemble des oeuvres du photographe est contenu dans le tableau photographersMediabyID
  // On en prend chaque élément pour l'afficher un à un grace à la class correspondant à la création de la mise en page
  photographersMediabyID.forEach((media) => {
    photographerMedia.innerHTML += new PhotographerPhotosCard(media, photographersWork[tabURL[url]].name).getCard();
  });


  // On récupère dans le tableau tous les likes pour en faire la somme afin de l'injecter dans la div html répertoriant ce chiffre
  const sumOfLikes = new Likes(photographersMediabyID).sumLikes();
  const sumLikesDisplay = document.querySelector(".JS-sumLikes");
  sumLikesDisplay.innerHTML = sumOfLikes;


/*-- Le tri --*/

// Class qui choisit la bonne méthode de tri (héritée de la class Sorting Method) en fonction du bouton de tri sélectionné
class SortingCategory extends SortingMethod {
  constructor(className, folder){
    super(folder)
    this._className = className
  }

  async show() {
    photographerMedia.innerHTML = '';
    this._folder.forEach((media) => {
      photographerMedia.innerHTML += new PhotographerPhotosCard(media, photographersWork[tabURL[url]].name).getCard();
    });
  }

  async select() {
    if(this._className === '.JS-pop') {
      document.querySelector(".JS-pop").addEventListener('click', () => {
        console.log('Ok');
        this.popularity();
        this.show();
        UseLightbox();
        UseLikes();
      });
    }else if(this._className === '.JS-date') {
      document.querySelector(".JS-date").addEventListener('click', () => {
        this.date();
        this.show();
        UseLightbox();
        UseLikes();
      });
    }else if(this._className === '.JS-title') {
      document.querySelector(".JS-title").addEventListener('click', () => {
        this.title();
        this.show();
        UseLightbox();
        UseLikes();
      });
    }else {
      console.log('Bouton inconnu')
    }
  }
}

  // Instances de class pour les 3 évènements "clique" (bouton populatité/date/titre)
  new SortingCategory('.JS-pop', photographersMediabyID).select();
  new SortingCategory('.JS-date', photographersMediabyID).select();
  new SortingCategory('.JS-title', photographersMediabyID).select();


  /*-- Les likes --*/

  function UseLikes() {
      // Après création des cards média, chacune est associée à un bouton like (coeur) avec l'id de la photo
      const likeBtn = document.querySelectorAll(".JS-like-button");

      // Récupération d'un tableau regroupant toutes les valeurs de like de chaque photo + 1 car on définit un max (pas plus d'un clique par média)
      const maxLikeValue = photographersMediabyID.map(tabData => tabData.likes+1);

      likeBtn.forEach((btn) => btn.addEventListener("click", () => {

          // Scan de chaque like pour mettre à jour la valeur du like cliqué (sous réserve qu'il n'est pas eu un +1)
          // Si la valeur n'a déjà pas été modifiée, on modifie la valeur du like correspondant à l'id du btn cliqué
          new Likes(photographersMediabyID,maxLikeValue, btn).likeUpDate();


          // On reprend les nouvelles valeurs de likes pour les sommer et mettre à jour son affichage...
          const sumOfLikes = new Likes(photographersMediabyID).sumLikes();
          const sumLikesDisplay = document.querySelector(".JS-sumLikes");
          sumLikesDisplay.innerHTML = sumOfLikes;
      }));
  }  

/*-- La lightbox --*/

  function UseLightbox() {
      const displayMedia = document.querySelector(".JS-media");

      const lightboxTitle = document.querySelector('.JS-lightboxTitle');
  
      const links = document.querySelectorAll(".media_section a");


      for(let link of links){
        link.addEventListener('click', function(e){
          e.preventDefault();

          // Créer un tableau avec tous les id des média du photographe.
          const tabMediaID  = new GetLightBoxMedia(photographersMediabyID, link).getAllMediaIdByClick();
          // On connait l'id du media cliqué. On regarde l'indice du tableau correspondant.
          let index = new GetLightBoxMedia(photographersMediabyID, link).getThisMediaIndexByClick();


          /*-- Bouton fermeture de la lightbox --*/

          const modalbgd = document.querySelector(".lightbox-bground");
          modalbgd.style.display = "block";
          modalbgd.setAttribute("aria-hidden", "false"); // Visible par les technologies d'assistance
          media.setAttribute("aria-hidden", "true"); // Non visible par les technologies d'assistance

          const closeLightbox = document.querySelector(".JS-lightbox-close");
          closeLightbox.addEventListener('click', () => {
            modalbgd.style.display = "none";
            modalbgd.setAttribute("aria-hidden", "true"); // Non visible par les technologies d'assistance
            media.setAttribute("aria-hidden", "false"); // Visible par les technologies d'assistance
          });

          /*-- Bouton "précédent" de la lightbox --*/

          const prevLightbox = document.querySelector(".JS-lightbox-prev");
          prevLightbox.addEventListener('click', () => {
            if(index>0){
              index = index-1;
              let lightboxMedia = new GetLightBoxMedia(photographersMediabyID, link).show(index);
              displayMedia.innerHTML = new LightboxMedia(lightboxMedia, photographersWork[tabURL[url]].name).display();
              lightboxTitle.innerHTML = new LightboxMedia(lightboxMedia, photographersWork[tabURL[url]].name)._title;
            }else{
              e.preventDefault();
            }
          });

          /*-- Bouton "suivant" de la lightbox --*/

          const nextLightbox = document.querySelector(".JS-lightbox-next");
          nextLightbox.addEventListener('click', (e) => {

            if(index<tabMediaID.length-1){
              index = index+1;
              let lightboxMedia = new GetLightBoxMedia(photographersMediabyID, link).show(index);
              displayMedia.innerHTML = new LightboxMedia(lightboxMedia, photographersWork[tabURL[url]].name).display();
              lightboxTitle.innerHTML = new LightboxMedia(lightboxMedia, photographersWork[tabURL[url]].name)._title;
            }else{
              e.preventDefault();
            }
          });

          /*-- Affichage de la lightbox --*/

          let lightboxMedia = new GetLightBoxMedia(photographersMediabyID, link).show(index);
          displayMedia.innerHTML = new LightboxMedia(lightboxMedia, photographersWork[tabURL[url]].name).display();
          lightboxTitle.innerHTML = new LightboxMedia(lightboxMedia, photographersWork[tabURL[url]].name)._title;
        });
      };
  }

  UseLightbox();
  UseLikes();


  const photographerProfil = photographersWork[tabURL[url]];

  return (photographerProfil)
}


/*-- Exécution de displayData --*/

async function displayData(photographerProfil) {

  /*-- En-tête de la page photographe --*/

  // On appelle la class de l'en-tête dans le photographer.html ...
  //const photographerHeader = document.querySelector(".photograph-header");

  const photographerTitle = document.querySelector(".JS-photograph-title");
  const photographerPhotoProfil = document.querySelector(".JS-Photo-Profil");

 
  // pour y mettre le contenu 
  //photographerHeader.innerHTML = new PhotographerHeader (photographerProfil).makeCard();

  photographerTitle.innerHTML = new PhotographerHeader (photographerProfil).titleShow();
  photographerPhotoProfil.innerHTML = await new PhotographerHeader (photographerProfil).photoProfileShow();


  /*-- Formulaire de la page photographe --*/

  const photographerFormName = document.querySelector(".JS-form-name");

  photographerFormName.innerHTML = new PhotographerForm (photographerProfil).makeForm();


  /*-- Affichage du tarif du photographe dans l'encadré en bas de page avec la somme des likes --*/
  
  const price = document.querySelector(".JS-price");
  price.innerHTML = new PhotographerHeader (photographerProfil).priceShow();

};

/*-- Création et exécution de la fonction init() --*/

async function init() {
  // Récupère les datas des photographes
  const photographerProfil = await getPhotographers();
  // Affiche les données
  await displayData(photographerProfil);
};

init();
