/*---- Script pour l'affichage de chaque profil de photographe sur la page d'accueil ----*/

// Le script exécute la fonction init()
// Cette fonction exécute elle-même  la fonction getPhotographers() pour récupérer les données .json des photographes
// Puis ensuite la fonction displayData() pour afficher les données formatées par getPhotographers() (en utilisant photographerFactory()...)

/*-- Récupération et formatage des données par getPhotographers --*/

    async function getPhotographers() {

        // Récupération des données de photographers.json (composées d'une partie "photographers" et d'une partie "media")

        let getJsonData = fetch("./data/photographers.json").then(response => { return response.json() });

        // Récupération de la partie "photographers" du json

        const photographers = await getJsonData.then(data => data.photographers);

        // et bien retourner le tableau photographers seulement une fois

        return ({
            photographers: [...photographers]})
    }

/*-- Affichage des données --*/

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {


            const photographerModel = photographerFactory(photographer);

            const id = photographerModel.photographerID;
            const photoID =photographerModel.picture;
            const name = photographerModel.name;
            const photographerCity = photographerModel.city;
            const photographerCountry = photographerModel.country;
            const photographerTagline = photographerModel.tagline;
            const photographerPrice = photographerModel.price;



            photographersSection.innerHTML += ` <a href="photographer.html?id=${id}">
                                                    <article>
                                                        <div>
                                                            <img src="${photoID}" alt="${name}">
                                                        </div>
                                                        <h2>${name}</h2>
                                                        <h3>${photographerCity}, ${photographerCountry}</h3>
                                                        <h4>${photographerTagline}</h4>
                                                        <p>${photographerPrice}€/jour</p>
                                                    </article>
                                                </a>`;
        });
    };

/*-- Création et exécution de la fonction init() --*/

    async function init() {
        // Récupère les datas des photographes
        const { photographers } = await getPhotographers();
        await displayData(photographers);
    };
    
    init();
    