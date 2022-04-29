//Constructors
function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

//Realize the action with the data
Seguro.prototype.cotizarSeguro = function(){
    /**
     * 1 = Americano 1.15
     * 2 = Asiatico 1.05
     * 3 = Europeo 1.35
     */

    let cantidad;
    const base = 2000;

    switch(this.marca){
        case '1':
            cantidad =  base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;

        case '3':
            cantidad = base * 1.35;
            break;

        default:
            break;
    }

    //Read the Year
    const diferencia = new Date().getFullYear() - this.year;
    //Each year different, will have 3% discount
    if (diferencia != 0){
        cantidad -= (((diferencia * 3) * cantidad) / 100);
    }
    
    /**
     * If the insurance is basic "basico"  you add 30% more
     *   If the insurance is complete "completo" you add 50% more
     */

    if(this.tipo === 'basico'){
        cantidad *=1.30;

    }else{
        cantidad *= 1.5;
    }

    return cantidad;
}

function UI(){}

//Fill years in #year html option.
//It can be arrow function as it does not have 
UI.prototype.llenarYears = ()=>{
    const max = new Date().getFullYear(), 
          min = max - 22;

    const selectYear = document.querySelector("#year");

    for(let i = max; i > min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;

        selectYear.appendChild(option);
    }
}

//Show the Alerts on screen
UI.prototype.mostrarMensaje =  (mensaje, tipo) =>{
    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add( 'correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    //Insert into HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() =>{
        div.remove();
    }, 2000)
}

UI.prototype.mostrarResultado = (total, seguro) =>{

    const {marca, year, tipo} = seguro;
    const div = document.createElement('div');

    let textoMarca;

    switch (marca){
        case '1': textoMarca = 'Americano';
        break;

        case '2': textoMarca = 'Asiatico';
        break;

        case '3': textoMarca = 'Europeo';
        break;

        default:
            break;
    }

    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header"> Tu resumen</p>
        <p class="font-bold"> Marca: <span class ="font-normal"> ${textoMarca} </span></p>
        <p class="font-bold"> Año: <span class ="font-normal"> ${year} </span></p>
        <p class="font-bold capitalize"> Tipo de Seguro: <span class ="font-normal"> ${tipo} </span></p>
        <p class="font-bold"> Total: <span class ="font-normal"> $${total} </span></p>

    `;

    const resultadoDiv = document.querySelector('#resultado');
    

    //Show the spinner defined in HTML as hidden
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none'; //We delete the spinner
        resultadoDiv.appendChild(div); // We add the result
    }, 2000);
}

//Instanciar UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', ()=>{
    ui.llenarYears();
});

eventListener();

function eventListener(){
    const formulario = document.querySelector('#cotizar-seguro');

    formulario.addEventListener('submit', cotizarSeguro)
}

function cotizarSeguro(e){
    e.preventDefault();

    //Read the brand selected
    const marca = document.querySelector('#marca').value;
    //Read the year selected
    const year = document.querySelector('#year').value;
    //Read the type selected
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === '' || year==='' || tipo===''){
        ui.mostrarMensaje("Todos los campos son obligatorios", 'error');
        return;
    }
        ui.mostrarMensaje('Cotizando...', 'exito');

        //Hide the previous results
        const resultados = document.querySelector('#resultado div');

        if(resultados != null){
            console.log("Is not Null the result");
            resultados.remove();
        }

        //Create instance of Seguro
        const seguro = new Seguro(marca, year, tipo);
        
        //Use prototype for cotiza
        const total = seguro.cotizarSeguro();

        //Show the result
        ui.mostrarResultado(total, seguro);

}