/**
 * Get the list of products
 * @returns the list of products
 */
async function getProducts() {
    return fetch("http://localhost:3000/api/products/")
        .then(it => it.json());
}

/**
 * Creates a link element
 * @param { String } id 
 * @returns a link element
 */
function createProductLink(id) {
    let link = document.createElement("a");
    link.setAttribute("href", `./product.html?id=${id}`)
    return link;
}

/**
 * Creates an article element
 * @returns an article element
 */
function createArticle() {
    return document.createElement("article");
}

/**
 * Creates an image element
 * @param { String } imageSource 
 * @param { String } imageDescription 
 * @returns an image element
 */
function createImage(imageSource, imageDescription) {
    let image = document.createElement("img");
    image.setAttribute("src", imageSource);
    image.setAttribute("alt", imageDescription);
    return image;
}

/**
 * Creates a title element
 * @param { String } titleClass 
 * @param { String } titleContent 
 * @returns a title element
 */
function createTitle(titleClass, titleContent) {
    let title = document.createElement("h3");
    title.classList.add(titleClass);
    title.innerText = titleContent;
    return title;
}

/**
 * Creates a description element
 * @param { String } descriptionClass 
 * @param { String } descriptionContent 
 * @returns a description element
 */
function createDescription(descriptionClass, descriptionContent) {
    let description = document.createElement("p");
    description.classList.add(descriptionClass);
    description.innerText = descriptionContent;
    return description;
}

/**
 * Injects the product into the page by creating the required elements
 * @param { Object } product 
 */
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

/**
 * Injects all products into the page by calling injectProduct
 */
async function injectProducts() {
    let products = await getProducts();
    for (let product of products) {
        injectProduct(product);
    }
}

injectProducts();
