const socket = io();

//Recibir la lista de procutos por primera vez
const productsContainer = document.getElementById("products") 

socket.on('enviarProductList', data=>{
    productsContainer.innerHTML="";
    data.forEach((el) => {
        const div = document.createElement('div')
        div.className="product";
        div.id=el.id;
        
        div.appendChild(Object.assign(document.createElement('h3'),{ textContent:el.name}))
        div.appendChild(Object.assign(document.createElement('h6'),{ textContent:`categoria: ${el.categ}`}))
        div.appendChild(Object.assign(document.createElement('p'),{ textContent:el.desc}))
        div.appendChild(Object.assign(document.createElement('span'),{ textContent:`$${el.price}.00 - stock disponible: ${el.stock}`}))
        div.appendChild(document.createElement('br'));

        productsContainer.appendChild(div);
    });
})

//Manejo del form para crear productos
const productForm = document.getElementById("productForm");

productForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();

    const formData = new FormData(ev.target)
    const nuevoProducto = {id:0};

    formData.forEach((value, key)=>{
        nuevoProducto[key] = value; 
    })

    socket.emit('añadiendoProducto', nuevoProducto)
})

//Manejo del form para eliminar un producto por id
const deleteForm = document.getElementById("deleteForm");

deleteForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();

    const id = document.getElementById("post-id")

    socket.emit("eliminarProducto", id.value)
})