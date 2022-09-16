function getProductId() {
    let url = new URL(window.location.href);

    var searchParams = new URLSearchParams(url.search); 
    if (searchParams.has("id")) {
        return searchParams.get("id");
    } else {
        return null;
    }
}


async function getProduct() {
    let id = getProductId();
    if (id != null) {
        return fetch(`http://localhost:3000/api/products/${id}`)
            .then(it => it.json());
    } else {
        return null;
    }
}

function fillImage(imageSource, imageDescription) {
    let image = document.createElement("img");
    image.setAttribute("src", imageSource);
    image.setAttribute("alt", imageDescription);
    
    document
        .querySelector("section.item > article > div.item__img")
        .appendChild(image);
}

function fillTitle(titleContent) {
    document
        .getElementById("title")
        .innerText = titleContent;
}

function fillPrice(price) {
    document
        .getElementById("price")
        .innerText = price;
}

function fillDescription(descriptionContent) {
    document
        .getElementById("description")
        .innerText = descriptionContent;
}

function fillColors(colors) {
    let select = document.getElementById("colors");

    for (let color of colors) {
        var option = document.createElement("option");
        option.value = color;
        option.text = color;
        select.add(option); 
    }
}

async function fillProduct() {
    let product = await getProduct();
    fillImage(product.imageUrl, product.altTxt);
    fillTitle(product.name);
    fillPrice(product.price);
    fillDescription(product.description);
    fillColors(product.colors);
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

function addToCart() {
    let cart = getCart();
    let productId = getProductId();
    let productQuantity = document.getElementById("quantity").value;
    let productColor = document.getElementById("colors").value;

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
