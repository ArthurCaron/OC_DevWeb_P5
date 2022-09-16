async function getProduct(id) {
    return fetch(`http://localhost:3000/api/products/${id}`)
        .then(it => it.json());
}

function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    }
    return JSON.parse(cart);
}

function getProductInCart(cart, productId, productColor) {
    for (let product of cart) {
        if (product.id === productId && product.color === productColor) {
            return product;
        }
    }
    return null;
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart(productId, productColor, productQuantity) {
    let cart = getCart();

    let productInCart = getProductInCart(cart, productId, productColor);
    if (productInCart != null) {
        productInCart.quantity = Number(productQuantity);
    }

    saveCart(cart);
}

function deleteFromCart(productId, productColor) {
    let cart = getCart();

    for (let i = 0; i < cart.length; ++i) {
        if (cart[i].id === productId && cart[i].color === productColor) {
            cart.splice(i, 1);
        }
    }

    saveCart(cart);
}

function createArticle(productId, productColor) {
    let article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = productId;
    article.dataset.color = productColor;
    return article;
}

function createImage(imageSource, imageDescription) {
    let div = document.createElement("div");
    div.classList.add("cart__item__img");

    let image = document.createElement("img");
    image.setAttribute("src", imageSource);
    image.setAttribute("alt", imageDescription);

    div.appendChild(image);
    return div;
}

function createContent() {
    let content = document.createElement("div");
    content.classList.add("cart__item__content");
    return content;
}

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

async function fillCartItems() {
    let cart = getCart();
    
    for (let product of cart) {
        fillCartItem(product.id, product.quantity, product.color);
    }

    updateTotal();
}

function getOrder() {
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

async function order() {
    return fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
            },
        body: JSON.stringify(getOrder())
    })
    .then(it => it.json());
}

async function sendOrder() {
    let result = await order();
    window.location.href = `confirmation.html?order_id=${result.orderId}`;
}

fillCartItems();

const nameReg = new RegExp("^[a-zA-Z]+$");
const cityReg = new RegExp("^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$");
const emailReg = new RegExp("^(.+)@(.+){2,}\.(.+){2,}$");

document
    .getElementById("firstName")
    .addEventListener("input", (ev) => {
        let errorMsg = document.getElementById("firstNameErrorMsg");
        if (nameReg.test(ev.target.value)) {
            errorMsg.innerText = "";
        } else {
            errorMsg.innerText = "Mauvais format pour le prénom";
        }
    });

document
    .getElementById("lastName")
    .addEventListener("input", (ev) => {
        let errorMsg = document.getElementById("lastNameErrorMsg");
        if (nameReg.test(ev.target.value)) {
            errorMsg.innerText = "";
        } else {
            errorMsg.innerText = "Mauvais format pour le nom";
        }
    });

document
    .getElementById("city")
    .addEventListener("input", (ev) => {
        let errorMsg = document.getElementById("cityErrorMsg");
        if (cityReg.test(ev.target.value)) {
            errorMsg.innerText = "";
        } else {
            errorMsg.innerText = "Mauvais format pour la ville";
        }
    });

document
    .getElementById("email")
    .addEventListener("input", (ev) => {
        let errorMsg = document.getElementById("emailErrorMsg");
        if (emailReg.test(ev.target.value)) {
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
