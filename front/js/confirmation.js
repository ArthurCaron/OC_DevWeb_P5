function getOrderId() {
    let url = new URL(window.location.href);

    var searchParams = new URLSearchParams(url.search); 
    if (searchParams.has("order_id")) {
        return searchParams.get("order_id");
    } else {
        return null;
    }
}

document
    .getElementById("orderId")
    .innerText = getOrderId();
    