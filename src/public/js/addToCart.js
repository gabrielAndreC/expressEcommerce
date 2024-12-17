const socket = io();
const addCartForm = document.getElementById("addCartForm");
/*
addCartForm.addEventListener('submit', (ev)=>{
    //ev.preventDefault();

    const formData = new FormData(ev.target)
    const nuevoProducto = {};

    formData.forEach((value, key)=>{
        nuevoProducto[key] = value; 
    })
    console.log(nuevoProducto);
    socket.emit('añadiendoAlCarrito', nuevoProducto)
})

//mostrar pantalla de carga
socket.on("cargandoProducto",()=>{
    Swal.fire({
    title: 'Cargando...',
    allowEscapeKey: false,
    allowOutsideClick: false,
    showConfirmButton: false,
    icon: "info"
  })
})

//confirmar y notificar
socket.on("alert", (data,cartId)=>{
    Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        title: data,
        icon: "success"
      }).then((isConfirmed)=>{
        window.location.href = `http://localhost:8080/carts/${cartId}`
      })
    
})*/