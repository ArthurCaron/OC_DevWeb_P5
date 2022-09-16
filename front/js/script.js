async function getProducts() {
    return fetch("http://localhost:3000/api/products/")
        .then(it => it.json());
}

function createProductLink(id) {
    let link = document.createElement("a");
    link.setAttribute("href", `./product.html?id=${id}`)
    return link;
}

function createArticle() {
    return document.createElement("article");
}

function createImage(imageSource, imageDescription) {
    let image = document.createElement("img");
    image.setAttribute("src", imageSource);
    image.setAttribute("alt", imageDescription);
    return image;
}

function createTitle(titleClass, titleContent) {
    let title = document.createElement("h3");
    title.classList.add(titleClass);
    title.innerText = titleContent;
    return title;
}

function createDescription(descriptionClass, descriptionContent) {
    let description = document.createElement("p");
    description.classList.add(descriptionClass);
    description.innerText = descriptionContent;
    return description;
}

function injectProduct(product) {
    let article = createArticle();
    article.appendChild(createImage(product.imageUrl, product.altTxt));
    article.appendChild(createTitle("productName", product.name));
    article.appendChild(createDescription("productDescription", product.description));
    let productLink = createProductLink(product._id);
    productLink.appendChild(article);
    document
        .getElementById("items")
        .appendChild(productLink);
}

async function injectProducts() {
    let products = await getProducts();
    for (let product of products) {
        injectProduct(product);
    }
}

injectProducts();
