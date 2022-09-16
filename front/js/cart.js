/**
 * Gets the product from DB with the given id
 * @param { String } id 
 * @returns the product which has the id provided
 */
async function getProduct(id) {
    return fetch(`http://localhost:3000/api/products/${id}`)
        .then(it => it.json());
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
 * Updates the quantity for a product in the cart
 * @param { String } productId 
 * @param { String } productColor 
 * @param { Number } productQuantity 
 */
function updateCart(productId, productColor, productQuantity) {
    let cart = getCart();

    let productInCart = getProductInCart(cart, productId, productColor);
    if (productInCart != null) {
        productInCart.quantity = Number(productQuantity);
    }

    saveCart(cart);
}

/**
 * Deletes a product from the cart
 * @param { String } productId 
 * @param { String } productColor 
 */
function deleteFromCart(productId, productColor) {
    let cart = getCart();

    for (let i = 0; i < cart.length; ++i) {
        if (cart[i].id === productId && cart[i].color === productColor) {
            cart.splice(i, 1);
        }
    }

    saveCart(cart);
}

/**
 * Deletes the current cart
 */
function emptyCart() {
    localStorage.removeItem("cart");
}

/**
 * Creates an article element
 * @param { String } productId 
 * @param { String } productColor 
 * @returns an article element
 */
function createArticle(productId, productColor) {
    let article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = productId;
    article.dataset.color = productColor;
    return article;
}

/**
 * Creates an image element
 * @param { String } imageSource 
 * @param { String } imageDescription 
 * @returns an image element
 */
function createImage(imageSource, imageDescription) {
    let div = document.createElement("div");
    div.classList.add("cart__item__img");

    let image = document.createElement("img");
    image.setAttribute("src", imageSource);
    image.setAttribute("alt", imageDescription);

    div.appendChild(image);
    return div;
}

/**
 * Creates a content element
 * @returns a content element
 */
function createContent() {
    let content = document.createElement("div");
    content.classList.add("cart__item__content");
    return content;
}

/**
 * Creates a description element
 * @param { String } productName 
 * @param { String } productColor 
 * @param { Number } productPrice 
 * @returns a description element
 */
function createDescription(productName, productColor, productPrice) {
    let description = document.createElement("div");
    description.classList.add("cart__item__content__description");

    let title = document.createElement("h2");
    title.innerText = productName;
    description.appendChild(title);

    let color = document.createElement("p");
    color.innerText = productColor;
    description.appendChild(color);

    let price = document.createElement("p");
    price.innerText = productPrice + "€";
    description.appendChild(price);
    return description;
}

/**
 * Creates a settings element
 * @param { String } productId 
 * @param { String } productColor 
 * @param { Number } productQuantity 
 * @returns a settings element
 */
function createSettings(productId, productColor, productQuantity) {
    let settings = document.createElement("div");
    settings.classList.add("cart__item__content__settings");

    let quantity = document.createElement("div");
    quantity.classList.add("cart__item__content__settings__quantity");

    let quantityParagraph = document.createElement("p")
    quantityParagraph.innerText = "Qté : ";
    quantity.appendChild(quantityParagraph);
    
    let quantityInput = document.createElement("input");
    quantityInput.classList.add("itemQuantity")
    quantityInput.setAttribute("type", "number");
    quantityInput.setAttribute("name", "itemQuantity");
    quantityInput.setAttribute("min", "1");
    quantityInput.setAttribute("max", "100");
    quantityInput.setAttribute("value", productQuantity);
    quantityInput.addEventListener("change", (ev) => {
        updateCart(productId, productColor, ev.target.value);
        updateTotal();
    });
    quantity.appendChild(quantityInput);

    let deleteDiv = document.createElement("div");
    deleteDiv.classList.add("cart__item__content__settings__delete");

    let deleteParagraph = document.createElement("p")
    deleteParagraph.classList.add("deleteItem");
    deleteParagraph.innerText = "Supprimer";
    deleteParagraph.addEventListener("click", (ev) => {
        let parentItem = deleteParagraph.closest("article.cart__item");
        deleteFromCart(parentItem.dataset.id, parentItem.dataset.color);
        parentItem.remove();
        updateTotal();
    });
    deleteDiv.appendChild(deleteParagraph);

    settings.appendChild(quantity);
    settings.appendChild(deleteDiv);
    return settings;
}

/**
 * Creates a cart item in the page
 * @param { String } productId 
 * @param { Number } productQuantity 
 * @param { String } productColor 
 */
async function fillCartItem(productId, productQuantity, productColor) {
    let product = await getProduct(productId);
    let article = createArticle(productId, productColor);
    article.appendChild(createImage(product.imageUrl, product.altTxt));

    let content = createContent();
    content.appendChild(createDescription(product.name, productColor, product.price));
    content.appendChild(createSettings(productId, productColor, productQuantity));
    article.appendChild(content);

    document
        .getElementById("cart__items")
        .appendChild(article);
}

/**
 * Update the total below the cart items
 */
async function updateTotal() {
    let cart = getCart();
    let totalQuantity = 0;
    let totalPrice = 0;
    
    for (let product of cart) {
        let dbProduct = await getProduct(product.id);
        totalQuantity += Number(product.quantity);
        totalPrice += Number(product.quantity) * Number(dbProduct.price);
    }

    document
        .getElementById("totalQuantity")
        .innerText = totalQuantity;

    document
        .getElementById("totalPrice")
        .innerText = totalPrice;
}

/**
 * Creates all of the car items in the page
 */
async function fillCartItems() {
    let cart = getCart();
    
    for (let product of cart) {
        fillCartItem(product.id, product.quantity, product.color);
    }

    updateTotal();
}

/**
 * Creates an order from the information in the cart and in the form
 * @returns an order
 */
function createOrder() {
    let products = new Set();
    for (let product of getCart()) {
        products.add(product.id);
    }
    return {
        "contact": {
            "firstName": document.getElementById("firstName").value,
            "lastName": document.getElementById("lastName").value,
            "address": document.getElementById("address").value,
            "city": document.getElementById("city").value,
            "email": document.getElementById("email").value
        },
        "products": Array.from(products)
    };
}

/**
 * Calls the order api
 * @returns the order call result
 */
async function order() {
    return fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
            },
        body: JSON.stringify(createOrder())
    })
    .then(it => it.json());
}

/**
 * Sends an order with the information from the cart and from the form, and redirects to the the confirmation page
 */
async function sendOrder() {
    if (
        validateName(document.getElementById("firstName").value)
        && validateName(document.getElementById("lastName").value)
        && validateAddress(document.getElementById("address").value)
        && validateCity(document.getElementById("city").value)
        && validateEmail(document.getElementById("email").value)
    ) {
        let result = await order();
        window.location.href = `confirmation.html?order_id=${result.orderId}`;
        emptyCart();
    }
}

/**
 * Validates the firstName and lastName fields
 * @param { String } value 
 * @returns true if the value matches a firstName or lastName
 */
function validateName(value) {
    let nameReg = new RegExp("^[a-zA-Z]+$");
    return nameReg.test(value);
}

/**
 * Validates the address field
 * @param { String } value 
 * @returns true if the value matches an address
 */
function validateAddress(value) {
    if (value) {
        return true;
    } 
    return false;
}

/**
 * Validates the city field
 * @param { String } value 
 * @returns true if the value matches a city
 */
function validateCity(value) {
    let cityReg = new RegExp("^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$");
    return cityReg.test(value)
}

/**
 * Validates the email field
 * @param { String } value 
 * @returns true if the value matches an email
 */
function validateEmail(value) {
    let emailReg = new RegExp("^(.+)@(.+){2,}\.(.+){2,}$");
    return emailReg.test(value);
}

fillCartItems();

document
    .getElementById("firstName")
    .addEventListener("input", (ev) => {
        let errorMsg = document.getElementById("firstNameErrorMsg");
        if (validateName(ev.target.value)) {
            errorMsg.innerText = "";
        } else {
            errorMsg.innerText = "Mauvais format pour le prénom";
        }
    });

document
    .getElementById("lastName")
    .addEventListener("input", (ev) => {
        let errorMsg = document.getElementById("lastNameErrorMsg");
        if (validateName(ev.target.value)) {
            errorMsg.innerText = "";
        } else {
            errorMsg.innerText = "Mauvais format pour le nom";
        }
    });

document
    .getElementById("address")
    .addEventListener("input", (ev) => {
        let errorMsg = document.getElementById("addressErrorMsg");
        if (validateAddress(ev.target.value)) {
            errorMsg.innerText = "";
        } else {
            errorMsg.innerText = "Mauvais format pour l'adresse";
        }
    });

document
    .getElementById("city")
    .addEventListener("input", (ev) => {
        let errorMsg = document.getElementById("cityErrorMsg");
        if (validateCity(ev.target.value)) {
            errorMsg.innerText = "";
        } else {
            errorMsg.innerText = "Mauvais format pour la ville";
        }
    });

document
    .getElementById("email")
    .addEventListener("input", (ev) => {
        let errorMsg = document.getElementById("emailErrorMsg");
        if (validateEmail(ev.target.value)) {
            errorMsg.innerText = "";
        } else {
            errorMsg.innerText = "Mauvais format pour l'adresse email";
        }
    });

document
    .getElementById("order")
    .addEventListener("click", (ev) => {
        ev.preventDefault();
        sendOrder();
    })
