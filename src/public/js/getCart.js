let cartId = sessionStorage.getItem('cart');
const cartBtn = document.createElement("a")
cartBtn.className="btn-cart";
cartBtn.innerText="Carrito"

document.getElementsByTagName("nav")[0].appendChild(cartBtn)

cartBtn.addEventListener("click",(ev)=>{
    cartId = sessionStorage.getItem('cart');
    if (cartId) {
        window.location.href=`/carts/${cartId}`
    }
    else{
        window.location.href="/login"
    }
})