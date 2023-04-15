function mediaFactory(data) {
    const { id, photographerId, title, image, likes, date, price } = data;

    const photo = `assets/photographers/Sample_Photos/dossier_test/${image}`;

    const photographerID = 82;

    function getPhotoCardDOM() {


        const article = document.createElement( 'article' );

        const cropPhoto = document.createElement( 'div' );


        const img = document.createElement( 'img' );
        img.setAttribute("src", photo);

        const h3 = document.createElement( 'h3' );
        h3.textContent = title;

        cropPhoto.appendChild(img);
        article.appendChild(cropPhoto);
        

        article.appendChild(h3);
        return (article);
    }
    return { title, photo, photographerID, getPhotoCardDOM }
}