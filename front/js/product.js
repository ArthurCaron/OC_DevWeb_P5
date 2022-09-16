/**
 * Gets the current product id for the page
 * @returns 
 */
function getProductId() {
    let url = new URL(window.location.href);

    var searchParams = new URLSearchParams(url.search); 
    if (searchParams.has("id")) {
        return searchParams.get("id");
    } else {
        return null;
    }
}

/**
 * Gets the product data associated with the product id
 * @returns 
 */
async function getProduct() {
    let id = getProductId();
    if (id != null) {
        return fetch(`http://localhost:3000/api/products/${id}`)
            .then(it => it.json());
    } else {
        return null;
    }
}

/**
 * Adds the relevant information to the image in the page
 * @param { String } imageSource 
 * @param { String } imageDescription 
 */
function fillImage(imageSource, imageDescription) {
    let image = document.createElement("img");
    image.setAttribute("src", imageSource);
    image.setAttribute("alt", imageDescription);
    
    document
        .querySelector("section.item > article > div.item__img")
        .appendChild(image);
}

/**
 * Adds the relevant information to the title in the page
 * @param { String } titleContent 
 */
function fillTitle(titleContent) {
    document
        .getElementById("title")
        .innerText = titleContent;
}

/**
 * Adds the relevant information to the price in the page
 * @param { Number } price 
 */
function fillPrice(price) {
    document
        .getElementById("price")
        .innerText = price;
}

/**
 * Adds the relevant information to the description in the page
 * @param { String } descriptionContent 
 */
function fillDescription(descriptionContent) {
    document
        .getElementById("description")
        .innerText = descriptionContent;
}

/**
 * Adds the relevant information to the colors in the page
 * @param { Array } colors 
 */
function fillColors(colors) {
    let select = document.getElementById("colors");

    for (let color of colors) {
        var option = document.createElement("option");
        option.value = color;
        option.text = color;
        select.add(option); 
    }
}

/**
 * Adds the relevant information to the product in the page
 */
async function fillProduct() {
    let product = await getProduct();
    fillImage(product.imageUrl, product.altTxt);
    fillTitle(product.name);
    fillPrice(product.price);
    fillDescription(product.description);
    fillColors(product.colors);
}

/**
 * Gets the cart from localstorage or a new one if none exists
 * @returns the current cart
 */
function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    }
    return JSON.parse(cart);
}

/**
 * Finds the product in the cart if it exists or null if it doesn't
 * @param { Object } cart 
 * @param { String } productId 
 * @param { String } productColor 
 * @returns the product if found or null if not found
 */
function getProductInCart(cart, productId, productColor) {
    for (let product of cart) {
        if (product.id === productId && product.color === productColor) {
            return product;
        }
    }
    return null;
}

/**
 * Saves the new version of the cart in the local storage
 * @param { Object } cart 
 */
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Adds the selected product quantity and color to the cart
 */
function addToCart() {
    let cart = getCart();
    let productId = getProductId();
    let productColor = document.getElementById("colors").value;
    let productQuantity = document.getElementById("quantity").value;

    if (productColor == "" || productQuantity <= 0 || productQuantity > 100) {
        return;
    }

    let productInCart = getProductInCart(cart, productId, productColor);
    if (productInCart == null) {
        cart.push({
            "id": productId,
            "quantity": Number(productQuantity),
            "color": productColor
        })
    } else {
        productInCart.quantity = Number(productInCart.quantity) + Number(productQuantity);
    }

    saveCart(cart);
}

fillProduct();

document
    .getElementById("addToCart")
    .addEventListener("click", ev => {
        ev.preventDefault();
        addToCart();
    });
