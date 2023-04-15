function photographerFactory(data) {
    const { name, id, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/Sample_Photos/Photographers_ID_Photos/${portrait}`;

    const photographerID = id;

    return { name, picture, photographerID, city, country, tagline, price }
}