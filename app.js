//Variables globales

const botonPrincipal = document.querySelector(".btn-principal");
const cuadro = document.querySelector(".cuadro");
const img = document.querySelector(".imagen");
const form = document.querySelector("form");
const botonesCat = document.getElementsByClassName("categorias");
var jugador = document.getElementById("jugador");
var cantidadRespondidas = 1;
var puntos;
var errores;
const tabla = document.querySelector(".tabla");
const botonFixed = document.querySelector(".btn-fixed");



//Funciones

let estructuraCuadro = (cat,preg,img,array,respondidas) =>{

if(img === undefined){cuadro.innerHTML = `<div class="categoria">${cat}</div>
<div class="cantidad">Pregunta N°  ${respondidas}/20</div>
    <div class="titulo">
        <div class="pregunta">${preg}</div>
    </div>
    <div class="respuestas">
        <div class="btn-secundarios" id="btn1" onclick="btn(0)">${array[0]}</div>
        <div class="btn-secundarios" id="btn2" onclick="btn(1)">${array[1]}</div>
        <div class="btn-secundarios" id="btn3" onclick="btn(2)">${array[2]}</div>
        <div class="btn-secundarios" id="btn4" onclick="btn(3)">${array[3]}</div>
    </div>`}else{cuadro.innerHTML = `<div class="categoria">${cat}</div>
    <div class="cantidad">Pregunta N°  ${respondidas}/20</div>
    <div class="titulo">
        <div class="pregunta">${preg}</div>
        <div class="div-imagen"><img class="imagen" src="${img}" alt=""></div>
    </div>
    <div class="respuestas">
        <div class="btn-secundarios" id="btn1" onclick="btn(0)">${array[0]}</div>
        <div class="btn-secundarios" id="btn2" onclick="btn(1)">${array[1]}</div>
        <div class="btn-secundarios" id="btn3" onclick="btn(2)">${array[2]}</div>
        <div class="btn-secundarios" id="btn4" onclick="btn(3)">${array[3]}</div>
    </div>`}
} 

function ajax(){
    var xhr = new XMLHttpRequest();
    var datos = null;
    xhr.onreadystatechange = () => {
        if(xhr.readyState == 4 && xhr.status == 200){
           datos = JSON.parse(xhr.responseText);
        }
    }
    xhr.open("GET","base.json",false);
    xhr.send();
    return datos;
};

function preguntaAleatoria(){
    const json = ajax();
    let indice = Math.floor(Math.random()*(json.length-0)-0);
    return indice;
}
function cargarPregunta(){
    if(cantidadRespondidas < 21){
        info = ajax()[preguntaAleatoria()];
        respuestas = [
        info.respuesta, info.incorrecta1, info.incorrecta2, info.incorrecta3
        ]
        respuestas.sort(()=>Math.random()-0.5);
        estructuraCuadro(info.categoria, info.pregunta, info.imagen, respuestas,cantidadRespondidas);
    }
}

function btn(n){
    if(respuestas[n] == info.respuesta){
        btnCorrecto = document.getElementById(`btn${n+1}`);
        btnCorrecto.style.background = "#6dd47e";
        setTimeout(()=>{
            cargarPregunta();
        },1000);
        puntos++;
        cantidadRespondidas++;
    }else{
        btnIncorrecto = document.getElementById(`btn${n+1}`);
        btnIncorrecto.style.background = "#ff825a";
        for(let i = 0; i < respuestas.length; i++){
            if(respuestas[i] == info.respuesta){
                setTimeout(()=>{
                    btnCorrecto = document.getElementById(`btn${i+1}`);
                    btnCorrecto.style.background = "#6dd47e";
                },500);
                setTimeout(()=>{
                    cargarPregunta();
                },1000);
            }
        }
        errores++;
        cantidadRespondidas++;
    }
    if(cantidadRespondidas > 20){
        setTimeout(()=>{
            cuadro.style.animation = "abajo 2s";
            setTimeout(()=>{
                cuadro.style.display = "none";
                tabla.style.display = "block";
                botonFixed.style.display = "block";
            },950);
        },1500);
        horaFinal=new Date();
        tiempo = parseInt((horaFinal.getTime()-horaInicio.getTime())/1000);
        puntosRealizados = puntos;
        erroresRealizados = errores;
        crearJugador(nombre,puntosRealizados,erroresRealizados,tiempo);
        guardarDB();
        cargarTablaDB();
    }
}


//Tiempo
let horaInicio;
let horaFinal;

//AddEventListenner

botonPrincipal.addEventListener("click",(e)=>{
    e.preventDefault();
    if(jugador.value == ""){
        Swal.fire('Debes ingresar un nick para continuar')
    }else{
        form.classList.add("desaparecer");
        setTimeout(()=>{
        form.style.display = "none";
        cargarPregunta();
        cuadro.style.display = "block";
        },500);
        nombre = jugador.value;
        jugador.value="";
        horaInicio=new Date();
        cantidadRespondidas = 1;
        puntos = 0;
        errores = 0;
        puntosRealizados = 0;
        erroresRealizados = 0;
        tiempo = 0;
    }
});



botonFixed.addEventListener("click",()=>{
    tabla.style.display = "none";
    cuadro.style.display = "none";
    cuadro.style.animation = "";
    botonFixed.style.display = "none";
    form.classList.remove("desaparecer");
    form.style.display = "flex";
 
});



//Tabla de lugares con LocalStorage

var nombre;
var puntosRealizados;
var erroresRealizados;
var tiempo;
var arrayJugadores = [];


const crearJugador = (nombre,puntos,errores,tiempo) => {

    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleDateString();

    usuario = {
        nombre: nombre,
        puntos: puntos,
        errores: errores,
        tiempo: tiempo,
        fecha: fechaFormateada
    }
    if(arrayJugadores === null){
        arrayJugadores = [];
        arrayJugadores.push(usuario);
    }else{
        arrayJugadores.push(usuario);
    }
    return usuario;

}

const guardarDB = () => {
    localStorage.setItem("jugador",JSON.stringify(arrayJugadores));
}


const cargarTablaDB = () => {
    arrayJugadores = JSON.parse(localStorage.getItem("jugador"));
    const tabla = document.getElementById("tbody");
    if(tabla){
        tabla.innerHTML = "";
        if(arrayJugadores === null){
            arrayJugadores = [];
        }else{
            arrayJugadores.sort((a,b)=>b.puntos-a.puntos);
            arrayJugadores.sort(function (a, b) {
                if(a.puntos == b.puntos){
                    if (a.tiempo > b.tiempo) {
                        return 1;
                      }
                      if (a.tiempo < b.tiempo) {
                        return -1;
                      }
                      return 0;
                }
            });
            arrayJugadores.forEach(element => {
                tabla.innerHTML+=
                `<tr>
                <td scope="row">${element.nombre}</td>
                <td>${element.puntos}</td>
                <td>${element.errores}</td>
                <td>${element.puntos / 20 * 100} %</td>
                <td>${element.tiempo} s</td>
                <td>${element.fecha}</td>
                </tr>`; 
            })
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarTablaDB);


