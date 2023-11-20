//set ins and out of animation

var animSettings = {
    "play": {
        "in": 722,
        "out": 734
    },
    "homerun": {
        "in": 347,
        "out": 600
    },
    "bb": {
        "in": 1,
        "out": 42
    },
    "hit": {
        "in": 43,
        "out": 85
    },
    "doble": {
        "in": 86,
        "out": 128
    },
    "triple": {
        "in": 129,
        "out": 171
    },
    "out": {
        "in": 172,
        "out": 214
    },
    "hbp": {
        "in": 215,
        "out": 258
    },
    "kderecho": {
        "in": 303,
        "out": 358
    },
    "kizquierdo": {
        "in": 259,
        "out": 364
    },
    "bate": [
        {"in": 646,"out": 648},
        {"in": 646,"out": 648}, // 1
        {"in": 650,"out": 656}, // 2
        {"in": 658,"out": 665}, // 3
        {"in": 667,"out": 674}, // 4
        {"in": 676,"out": 682}, // 5
        {"in": 685,"out": 692}, // 6
        {"in": 694,"out": 700}, // 7
        {"in": 704,"out": 709}, // 8
        {"in": 712,"out": 715}, // 9
        {"in": 655,"out": 674}, // 9
       
    ],

    "conteo": {
        "in": 707.0000287967,
        "out": 733.000029855702,
    },

    "update": {
        "in": 420,
        "out": 425

    },
    "loop": {
        "in": 420,
        "out": 440
    }
}

var data_equipos = {
    "aguilas": {
        "color": "#ffc900",
        "color_texto": [0,0,0],
        "logo": "logo_aguilas_arriba",
        "logo2": "logo_aguilas_abajo"
    },
    "leones": {
        "color": "#ce2029",
        "color_texto": [1,1,1],
        "logo": "logo_escogido_arriba",
        "logo2": "logo_escogido_abajo"
    },
    "tigres": {
        "color": "#175db4",
        "color_texto": [1,1,1],
        "logo": "logo_licey_arriba",
        "logo2": "logo_licey_abajo"
    },
    "estrellas": {
        "color": "#006339",
        "color_texto": [1,1,1],
        "logo": "logo_estrella_arriba",
        "logo2": "logo_estrella_abajo"
    },
    "gigantes": {
        "color": "#8d1738",
        "color_texto": [1,1,1],
        "logo": "logo_gigantes_arriba",
        "logo2": "logo_gigantes_abajo"
    },
    "toros": {
        "color": "#FD3F00",
        "color_texto": [0,0,0],
        "logo": "logo_toros_arriba",
        "logo2": "logo_toros_abajo"
    }
}

var equipo_visitante
var saved_data
var current_loop
var current_bat
var inFrame

//the first search path
var defult_image = "images/img_1.png";


const formatter = new Intl.DateTimeFormat('es', {
    year: "numeric",
    month: "long",
    day: "numeric"
});


var animData = 'data';
var animContainer = document.getElementById('bm');
var anim = lottie.loadAnimation({
    container: animContainer, // The dom element that will contain the animation
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: 'data.json',
    rendererSettings: {hideOnTransparent:false}
});
anim.addEventListener('DOMLoaded', function (e) {
    console.log('DOMLoaded');
    check();
  //  current_bat = "1"; //Esto sobreescribe la data inicial, no lo quiero ya!!
});

var check = function(){
    var condition = document.querySelector(".C0") !== false;
    if(condition){
        console.log("DONE waiting!! :)")
        webcg.update(saved_data);
        webcg.play() 
    }
    else {
        console.log("waiting")
        setTimeout(check, 100); // check again in a second
    }
}

// Handle update/data using WebCG

webcg.on('data', function (data) {
   
    saved_data = data;
    if(data && data.hasOwnProperty('image')){
        
                console.log('Image exists.');
                var newPath = data.image ? data.image.text || data.image : '';
                var imageElements = animContainer.getElementsByTagName("image");
                const element = imageElements[3];
                element.setAttribute("href", newPath);
                update_opacidad("foto",1)
            }
            
       
      
    if(data && data.hasOwnProperty('visitante')){
        console.log(`vistiante: ${data['visitante']}`)
        update_visitante(data['visitante'])
    }
    if(data && data.hasOwnProperty('equipo')){
        current_team = (data['equipo'])
    }
    if (data && data.hasOwnProperty('bateador')){
        current_bat = data['bateador']; 
        albate(current_bat);
    } 


    var key; 
    for (key in data) {
        console.log(key + " = " + data[key]); 
        if (key.includes("equipo")){update_equipo(data[key])}
        if (key.includes("opa")){update_opacidad(key,data[key])}
         // opa_base_# opa_out_# opa_baja opa_alta
        // vamos a usar opa para actualizar bases y outs! 
    } 
    if (anim.currentFrame !== 0 && anim.isPaused ) {
        // el update solo funciona durante una animacion, por eso hace el update, eso regresa la animacion a la posicion donde estaba
        // antes de iniciar el update (excepto si era al inicio)
        saveCurrentFrame();
        console.log("saving current")
       // anim.playSegments([animSettings.update.in, animSettings.update.out], true);
        anim.playSegments([animSettings.bate[current_bat].in, animSettings.bate[current_bat].out], true);
    }
   
    
    setTimeout(function () {
        // Update animation text
        var animElementsLength = anim.renderer.elements.length;
        for (let i = 0; i < animElementsLength; i++) {
            var animElement = anim.renderer.elements[i];
            // Check the animation element has a class name and that the WebCG data has a key with the same class name
            if (
                animElement.hasOwnProperty('data') && animElement.data.hasOwnProperty('cl') &&
                data && data.hasOwnProperty(animElement.data.cl) && animElement.data.hasOwnProperty('t')
            ) {
                var cl = animElement.data.cl;
                try {
                    animElement.canResizeFont(true); // Let lottie resize text to fit the text box
                    animElement.updateDocumentData({
                        t: data[cl] ? data[cl].text || data[cl] : ''
                    }, 0); // Update the text

                    if (animElement.data.hasOwnProperty('lineup')){ // esto es solo necesario si la barra activa es diferente --> && animElement.data.lineup !== current_bat){
                       console.log(`Lineup Color Negro: ${animElement.data.nm} lineup:${animElement.data.lineup}`);
                        animElement.updateDocumentData({
                     t: data[cl] ? data[cl].text || data[cl] : '', fc: data_equipos[current_team].color_texto}, 0); // Update the text y coloreamos Negro
                        
                    }// Esta seccion es solo necesaria si queremos que la barra del bateador tenga un color diferente
                    //else if(animElement.data.hasOwnProperty('lineup') && animElement.data.lineup == current_bat){
                    //    console.log(`Lineup Color Blanco: ${animElement.data.nm} lineup:${animElement.data.lineup}, current_bat: ${current_bat}`)
                    //    animElement.updateDocumentData({
                    //            t: data[cl] ? data[cl].text || data[cl] : '', fc: [1,1,1]}, 0); // Update the text y coloreamos blaco     
                    //    }
                    
                } catch (err) {console.log(err)}
            }
        }    
    }, 0); // esto es para esperar antes de hacer los cambios, por ejemplo en el momento exacto de la animacion
});


  
   /* calling currentTime() function to initiate the process */

function update_color(campo,color){
    var fill_color = `.${campo}`
    document.querySelector(fill_color).style.setProperty("fill", color);
}

function update_opacidad(campo,value){
    var fill = `.${campo}`
    document.querySelector(fill).style.setProperty("opacity", value);
}

function clear_logos(){
    const logos = ["logo_estrella_arriba", data_equipos[equipo_visitante].logo];
    logos.forEach((item, index) => {
      console.log(`${index} : ${item}`);
      update_opacidad(item,0);
    });
}

function update_equipo(nombre_equipo){
    clear_logos()
    update_color("c1",data_equipos[nombre_equipo].color);
    update_color("c2",data_equipos[nombre_equipo].color);
    update_color("c3",data_equipos[nombre_equipo].color);
    update_color("c4",data_equipos[nombre_equipo].color);

    update_opacidad(data_equipos[nombre_equipo].logo, 1);
    
}

function update_visitante(visitante){
    update_color("c0",data_equipos[visitante].color);
    update_opacidad(data_equipos[visitante].logo2, 1);
    equipo_visitante = visitante;
}

webcg.on('equipo', function(data){  
    update_equipo(data)
    console.log(data)
});



//casparcg control
 webcg.on('play', function () {
    //currentTime() 
    anim.playSegments([animSettings.play.in, animSettings.play.out], true);
 });


 webcg.on('playfull', function () {
    //currentTime() 
    anim.playSegments([722, 734], true);
 });


 webcg.on('entrada', function () {
    //currentTime() 
    anim.playSegments([10, 23], true);
 });

 webcg.on('homerun', function () {
    //currentTime() 
    saveCurrentFrame()
    anim.playSegments([animSettings.homerun.in, animSettings.homerun.out], true);
 });

 webcg.on('bb', function () {
    //currentTime() 
    saveCurrentFrame()
    anim.playSegments([animSettings.bb.in, animSettings.bb.out], true);
 });

 webcg.on('hit', function () {
    //currentTime() 
    saveCurrentFrame()
    anim.playSegments([animSettings.hit.in, animSettings.hit.out], true);
 });

 webcg.on('doble', function () {
    //currentTime() 
    saveCurrentFrame()
    anim.playSegments([animSettings.doble.in, animSettings.doble.out], true);
 });

 webcg.on('triple', function () {
    //currentTime() 
    saveCurrentFrame()
    anim.playSegments([animSettings.triple.in, animSettings.triple.out], true);
 });

 webcg.on('out', function () {
    //currentTime() 
    saveCurrentFrame()
    anim.playSegments([animSettings.out.in, animSettings.out.out], true);
 });

 webcg.on('hbp', function () {
    //currentTime() 
    saveCurrentFrame()
    anim.playSegments([animSettings.hbp.in, animSettings.hbp.out], true);
 });

 webcg.on('kderecho', function () {
    //currentTime() 
    saveCurrentFrame()
    anim.playSegments([animSettings.kderecho.in, animSettings.kderecho.out], true);
 });

 webcg.on('kizquierdo', function () {
    //currentTime() 
    saveCurrentFrame()
    anim.playSegments([animSettings.kizquierdo.in, animSettings.kizquierdo.out], true);
 });

 //No en uso, usamos un grafico
 webcg.on('conteo', function () {
    //currentTime() 
    saveCurrentFrame()
    anim.playSegments([animSettings.conteo.in, animSettings.conteo.out], true);
 });


 webcg.on('bate', function(data){ 
            console.log(data);
            albate(data) 
});

function albate(value){
    anim.firstFrame = 0;
    anim.goToAndStop(animSettings.bate[value].out,true);
  //  anim.playSegments([animSettings.bate[value].in, animSettings.bate[value].out], true);
}

 function lastFrame(){ 
    anim.removeEventListener('complete', lastFrame);
    anim.firstFrame = 0;
   anim.goToAndStop(inFrame,true);
   console.log(`Current --> ${anim.currentFrame} `)
   console.log(`hi goto --> ${inFrame} `)
};

function saveCurrentFrame(){
    inFrame = anim.currentFrame + anim.firstFrame;
    console.log(`Current FRame from start --> ${inFrame} `)
    anim.addEventListener('complete', lastFrame);
}


webcg.on('stop', function () {
  
});

webcg.on('loop_play', function () {
    anim.addEventListener('complete', loop);
    anim.playSegments([animSettings.loop.in, animSettings.loop.out], true);
});

webcg.on('stoploop', function () {
    anim.removeEventListener('complete', loop);
});

function loop() {
    console.log('Loop start');
    anim.playSegments([animSettings.loop.in, animSettings.loop.out], true);
    }

function remove_anim(){
    window.close()
}