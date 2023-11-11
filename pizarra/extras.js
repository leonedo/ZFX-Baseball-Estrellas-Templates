//set ins and out of animation

var animSettings = {
    "play": {
        "in": 719,
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
        "out": 345
    },
    "kizquierdo": {
        "in": 259,
        "out": 301
    },
    "update": {
        "in": 420,
        "out": 425

    },
    "loop": {
        "in": 420,
        "out": 440
    },
    "stop": {
        "in": 719,
        "out": 734
    }
}

var saved_data
var current_segment = ''
var fin_animacion = false
var animData = 'data';
var animContainer = document.getElementById('bm');
var anim = lottie.loadAnimation({
  container: animContainer, // The dom element that will contain the animation
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'extra.json'
  
});
anim.addEventListener('DOMLoaded', function (e) {
  console.log('DOM loaded');
  webcg.play();
  check();
});

var check = function(){
  var condition = document.querySelector(".caja") !== false;
  if(condition){
      console.log("DONE waiting!! :)")
      webcg.update(saved_data);
  }
  else {
      console.log("waiting")
      setTimeout(check, 500); // check again in a second
  }
}


// Handle update/data using WebCG
webcg.on('data', function (data) {
  saved_data = data;
  // only play the update animation if we have already started the animation
  if (anim.currentFrame !== 0 && anim.isPaused) {
     anim.playSegments([animSettings.play.in, animSettings.play.out], true);
  }
  setTimeout(function () {
      // Update animation text
      var animElementsLength = anim.renderer.elements.length;
      for (let i = 0; i < animElementsLength; i++) {
          var animElement = anim.renderer.elements[i];
          // Check the animation element has a class name and that the WebCG data has a key with the same class name
          if (
              animElement.hasOwnProperty('data') && animElement.data.hasOwnProperty('cl') &&
              data && data.hasOwnProperty(animElement.data.cl)
          ) {
              var cl = animElement.data.cl;
              try {
                  animElement.canResizeFont(true); // Let lottie resize text to fit the text box
                  animElement.updateDocumentData({
                      t: data[cl] ? data[cl].text || data[cl] : ''
                  }, 0); // Update the text
              } catch (err) {}
          }
      }
  }, 10);

  setTimeout(function () {

  anim.playSegments([animSettings.stop.in, animSettings.stop.out], true);},1000);
});




//casparcg control
 webcg.on('play', function () {
    //currentTime() 
    anim.playSegments([animSettings.play.in, animSettings.play.out], true);
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