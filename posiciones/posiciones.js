// version 1.04 template index made by heine.froholdt@gmail.com

let isOn = false;
let framesMilliseconds;
let fontsLoaded = false;
let animLoaded = false;
let animElementsLength;
let markers = {}
let markersLoop = {}

//loop handling
let loopExits = false;
let loopAnimation = false;
let loopDelay = 0;
let loopExternal = false;
let loopRepeat;
let loopDuration;
let loopTiming;


//update
let updateAnimation = false;
let updateDelay = 0;
let nextAnimation;
let imagesReplace = {};


//data de equipos
let current_team


var data_equipos = {
    "aguilas": {
        "color": "#ffc900",
        "color_texto": [0,0,0],
        "logo": "logo_aguilas"
    },
    "leones": {
        "color": "#ce2029",
        "color_texto": [1,1,1],
        "logo": "logo_escogido"
    },
    "tigres": {
        "color": "#175db4",
        "color_texto": [1,1,1],
        "logo": "logo_licey"
    },
    "estrellas": {
        "color": "#006339",
        "color_texto": [1,1,1],
        "logo": "logo_estrellas"
    },
    "gigantes": {
        "color": "#8d1738",
        "color_texto": [1,1,1],
        "logo": "logo_gigantes"
    },
    "toros": {
        "color": "#FD3F00",
        "color_texto": [0,0,0],
        "logo": "logo_toros"
    }
}

let animContainer = document.getElementById('bm');
let loopContainer = document.getElementById('loop');


const loadAnimation = (data, container) => {
    console.log('loading ' + data)
    return lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: data,
        rendererSettings: {hideOnTransparent:false}
    });
}

let anim = loadAnimation('posiciones.json', animContainer)
let externalLoop;

//add font-face from data.json  
const addFont = (fam, path) => {
    let newFont = document.createElement('style')
    newFont.appendChild(document.createTextNode(`\
    @font-face {\
        font-family: ${fam};\
        src: url('${path}');\
    }\
    `));
    document.head.appendChild(newFont);
}


//checking if the animation is ready
const makeAnimPromise = () => {
    return new Promise(function (resolve, reject) {
        if (animLoaded) {
            resolve('Animation ready to play')
        } else {
            anim.addEventListener('DOMLoaded', function (e) {
                animLoaded = true;
                resolve('Animation ready to play')
                
            });
        }
    })
};


const isMarker = (obj, keyItem, markerName) => {
    return new Promise((resolve, reject) => {
        let markers = obj.markers
        markers.forEach((item, index) => {
            for (let key in item) {
                if (item[key][keyItem] === markerName) {
                    resolve(true)
                } else if (item.length === key) {
                    reject(false)
                }
            }
        })
    })
}

const getMarkerValue = (obj, keyItem, defaultValue) => {
    return new Promise((resolve, reject) => {
        let markers = obj.markers
        markers.forEach((item, index) => {
            for (let key in item) {
                if (item[key].hasOwnProperty(keyItem)) {
                    resolve(item[key][keyItem])
                } else if (item.length === key) {
                    reject(defaultValue)
                }
            }
        })
    })
}



//anim ready
anim.addEventListener('config_ready', function (e) {
    //setting the animation framerate
    let mainAnimation = anim.renderer.data
    framesMilliseconds = 1000 / mainAnimation.fr

    if (anim.hasOwnProperty('markers')) {
        anim.markers.forEach((item, index) => {
            markers[item.payload.name] = item;
        })
    }
    //checking for a loop in the animation
    isMarker(anim, 'name', 'loop').then((res) => {
        loopAnimation = res

        if (res) {
            loopExits = true;
            getMarkerValue(anim, 'loopDelay', 0).then((res) => {
                loopDelay = Number(res)
            })
            getMarkerValue(anim, 'loopExternal', false).then((res) => {
                loopExternal = (res === 'true')

                //handling of external loop
                if (loopExternal) {

                    externalLoop = loadAnimation('loop.json', loopContainer)
                    if (externalLoop.hasOwnProperty('markers')) {
                        externalLoop.markers.forEach((item, index) => {
                            markersLoop[item.payload.name] = item;
                
                        })
                    }
                    externalLoop.addEventListener('complete', () => {
                        if (nextAnimation !== 'stop') {
                            loopRepeat = setTimeout(() => {
                                externalLoop.goToAndPlay('loop', true);
                            }, framesMilliseconds * loopDelay)

                        } else if (isOn && nextAnimation === 'stop') {
                            externalLoop.goToAndPlay('stop', true);
                            anim.goToAndPlay('stop', true)
                            nextAnimation === 'no animation'
                            isOn = false;
                        }

                    })
                }


            })
            if(!loopExternal){
                loopDuration = markers['loop']['duration']
            } else {
                loopDuration = markersLoop['loop']['duration']
            }
          
        }
    })
    //checking for a update animation in the animation 
    isMarker(anim, 'name', 'update').then((res) => {
        updateAnimation = res
        if (res) {
            getMarkerValue(anim, 'updateDelay', 0).then((res) => {
                updateDelay = Number(res)
            })
        }
    })

    //Add fonts to style
    if (!fontsLoaded) {
        let fonts = anim.renderer.data.fonts.list;
        for (const font in fonts) {
            let family = fonts[font].fFamily
            let fontPath = fonts[font].fPath
            if (fontPath !== '') {
                addFont(family, fontPath)
            }
        }
    }

});

const animPromise = makeAnimPromise()

webcg.on('data', function (data) {
    let updateTiming = 0
    console.log('data from casparcg received')
    
    var key; 
    for (key in data) {
        console.log(key + " = " + data[key]); 
       // if (key.includes("equipo")){equipo = data[key]}
        if (key.includes("equipo")){update_equipo(data[key])}
        //if ( key.includes("out") || key.includes("basellena") || key.includes("parte")){update_opacidad(key,data[key])}
        //if (key === "visitante" || key === "homeclub"){update_equipos(data[key],key)}
    } 
    console.log('End of my test segment')
    animPromise.then(resolve => {
            if (anim.currentFrame !== 0 && updateAnimation) {
                updateTiming = framesMilliseconds * (updateDelay + loopTiming)
                if (anim.isPaused && isOn) {
                    anim.goToAndPlay('update', true)
                    if (!loopExternal) {
                        clearTimeout(loopRepeat);
                    }

                } else {
                    loopAnimation = false;
                    nextAnimation = 'update'
                }
            } else if(!loopExternal && loopExits && anim.isPaused) {
                anim.goToAndPlay('loop', true)
            }

            let imageElements = animContainer.getElementsByTagName("image");
            animElementsLength = anim.renderer.elements.length;
            console.log(resolve)

            setTimeout(() => {
                for (let i = 0; i < animElementsLength; i++) {
                    var animElement = anim.renderer.elements[i];
                    if (
                        animElement.hasOwnProperty('data') && animElement.data.hasOwnProperty('cl') &&
                        data && data.hasOwnProperty(animElement.data.cl)
                    ) {
                        let cl = animElement.data.cl;
                        let searchPath;
                        let newPath;

                        if (animElement.data.hasOwnProperty('refId') && animElement.data.refId.includes('image')) {
                            newPath = data[cl] ? data[cl].text || data[cl] : '';
                            anim.assets.forEach((item, index) => {
                                if (item.id === animElement.data.refId) {
                                    if (imagesReplace.hasOwnProperty(animElement.data.refId)) {
                                        searchPath = imagesReplace[animElement.data.refId];
                                    } else {
                                        searchPath = `${anim.assets[index].u}${anim.assets[index].p}`;
                                    }
                                }
                            })

                            for (let i = 0; i < imageElements.length; i++) {
                                const element = imageElements[i];
                                if (~element.getAttribute("href").search(searchPath)) {
                                    element.setAttribute("href", newPath);
                                    imagesReplace[animElement.data.refId] = newPath
                                }
                            };


                        } else {
                            try {
                                animElement.canResizeFont(true);
                                animElement.updateDocumentData({
                                    t: data[cl] ? data[cl].text || data[cl] : ''
                                }, 0);

                                if (animElement.data.hasOwnProperty('lineup')){ // esto es solo necesario si la barra activa es diferente --> && animElement.data.lineup !== current_bat){
                                    console.log(`Lineup Color Negro: ${animElement.data.nm} lineup:${animElement.data.lineup}`);
                                     animElement.updateDocumentData({
                                  t: data[cl] ? data[cl].text || data[cl] : '', fc: data_equipos[current_team].color_texto}, 0); // Update the text y coloreamos Negro
                                     
                                 }

                            } catch (err) {
                                console.log(err)
                            }
                        };
                    }
                }

            }, updateTiming);

        })
        .catch(error => console.log(error))
});


//what to do everytime main animation is done playing
anim.addEventListener('complete', () => {

    if (loopAnimation && isOn && !loopExternal) {
        loopRepeat = setTimeout(() => {
            anim.goToAndPlay('loop', true);
        }, framesMilliseconds * loopDelay)

    } else if (nextAnimation === 'stop' && isOn && !loopExternal) {
        anim.goToAndPlay(nextAnimation, true)
        isOn = false

    } else if (isOn && nextAnimation !== 'no animation' && !loopExternal) {
        anim.goToAndPlay(nextAnimation, true)
        if (loopExits && !loopExternal) {
            loopAnimation = true;

        }

        nextAnimation = 'no animation'
    }
})

//Custom methods

function update_color(campo,color){
    var fill_color = `.${campo}`
    document.querySelector(fill_color).style.setProperty("fill", color);
}

function update_opacidad(campo,value){
    var fill = `.${campo}`
    document.querySelector(fill).style.setProperty("opacity", value);
}




function checkandupdate(item, value){
    if (itemExists(item)){
        console.log(`checkandupdate: ${item} -- exist`)
        update_opacidad(item,value)
    } else {
        console.log(`checkandupdate: ${item} --- waiting`)
        setTimeout(function(){
            checkandupdate(item, value);
        }, 100);
    }
}

function checkandcolor(item, color){
    if (itemExists(item)){
        console.log(`checkandcolor: ${item} -- exist`)
        update_color(item,color);
    } else {
        console.log(`checkandcolor: ${item} --- waiting`)
        setTimeout(function(){
            checkandcolor(item, color);
        }, 100);
    }
}

function itemExists(item) {
    var fill = `.${item}`
   //return document.querySelector(item).style !== false;
   return document.querySelector(fill) !== null;
}


function clear_logos(){ 
    for( equipo in data_equipos) {
        logo = data_equipos[equipo].logo;
        checkandupdate(logo,0);
    }
}

function update_equipo(nombre_equipo){
    current_team = nombre_equipo
    clear_logos()
    for (let i = 0; i <= 30; i++) {
        checkandcolor(`c${i}`, data_equipos[nombre_equipo].color);
    }
        checkandupdate(data_equipos[nombre_equipo].logo, 1);
    
}



webcg.on('equipo', function(data){  
    update_equipo(data)
    console.log(data)
});



//casparcg control
webcg.on('play', function () {
    animPromise.then((resolve) => {
       
            anim.goToAndPlay('play', true);
    
        isOn = true;
    });

});




webcg.on('stop', function () {
    
            anim.goToAndPlay('stop', true)
            isOn = false
        

});

webcg.on('playAnimation', function (animationName) {
    console.log('playAnimation ' + animationName)
    anim.goToAndPlay(animationName, true);
});

webcg.on('update', function () {
    if (!loopExternal) {
        clearTimeout(loopRepeat);
    }

    if (anim.isPaused || loopExternal) {
        loopTiming = 0

    } else if (isOn) {
        loopTiming = loopDuration - Math.round(anim.currentFrame)

    }
});
