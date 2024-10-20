const socket = io();

//SignUp
const signForm = document.getElementById("signForm");

signForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();

    const formData = new FormData(ev.target)
    const nuevoUsuario = {};

    formData.forEach((value, key)=>{
        nuevoUsuario[key] = value; 
    })

    socket.emit('nuevoRegistro', nuevoUsuario)
})
//login
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();

    const formData = new FormData(ev.target)
    const nuevaSesion = {};

    formData.forEach((value, key)=>{
        nuevaSesion[key] = value; 
    })
    
    socket.emit('nuevoInicio', nuevaSesion)
})

//check signup
socket.on("registroExitoso", ()=>{
    alert("Ahora puedes iniciar sesión")
})
socket.on("registroFallido", ()=>{
    alert("Ya existe una cuenta asociada a ese mail")
})

//check login
socket.on("inicioExitoso", (data)=>{
    sessionStorage.setItem("logged",true)
    Object.entries(data).forEach((value)=>{
        sessionStorage.setItem(value[0],value[1])
    })
    history.back();
})
socket.on("inicioFallido", ()=>{
    alert("Credenciales incorrectas. Volvé a intentar")
})