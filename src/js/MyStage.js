import * as PIXI from 'pixi.js'
import Cookies from 'js-cookie';

import TWEEN from '@tweenjs/tween.js';

import sheep0 from '../images/sheeps/shBH01.png';
import sheep1 from '../images/sheeps/shBH02.png';
import sheep2 from '../images/sheeps/shBH03.png';
import sheep3 from '../images/sheeps/shBH04.png';
import sheep4 from '../images/sheeps/shBH05.png';
import sheep5 from '../images/sheeps/shBH06.png';
import sheep6 from '../images/sheeps/shBH07.png';
import sheep7 from '../images/sheeps/shBH08.png';
import sheep8 from '../images/sheeps/shBH09.png';
import sheep9 from '../images/sheeps/shBH10.png';



class MyStage{
  constructor( selector , isExtension){
  
  if( isExtension ){
    console.log('extension');
    let injectContainer = document.createElement('section');
    injectContainer.setAttribute( 'id' , 'myContent');
    document.body.appendChild( injectContainer );
  }

    console.log('Selector', selector);
    // this.state = null;
    // this.app = null;
    this.sheeps = null;
    this.mySheep = null;
    this.centerPoint = null;
    this.sheepsToRender = [];
    this.container = null;
    this.canvas = null;
    this.devicePixelRatio = null;
    this.bounds = null;
    this.renderer = null;
    this.stage = null;
    this.loader = new PIXI.Loader();

    // this.addDots();
    // this.onResize();
    // this.startDots();

    this.initializeApp = () => {
      console.log( 'initialize App' );

      let promise = new Promise( (res, rej ) => {
        let status = { success: false }
        try{
          this.container = document.querySelector(selector);
          this.canvas = document.createElement('canvas');
          this.container.classList.add('pixi-container');
          // this.container.appendChild(this.canvas);
          this.devicePixelRatio = window.devicePixelRatio;
          this.bounds = [this.container.offsetWidth, this.container.offsetHeight];
          console.log('container size', this.bounds)
          this.renderer = PIXI.autoDetectRenderer(this.bounds[0], this.bounds[1], {
            antialias: true,
            transparent:true,
            resolution: this.devicePixelRatio,
            view: this.canvas,
          });
          this.renderer.resize( this.bounds[0], this.bounds[1]);
          this.renderer.backgroundColor = '#fffff';
          this.renderer.transparent = true;

          this.container.appendChild( this.renderer.view );

          this.stage = new PIXI.Container();
          
          window.addEventListener('resize', () => {
            // requestAnimationFrame(() => this.onResize());
          }, false);
          
          // requestAnimationFrame((time) => this.step(time));
          // let w = document.body.clientWidth ;
          // let h = document.body.clientHeight;
          // this.app = new PIXI.Application({
          //   antialias: true,   
          //   resolution: 1 ,
          //   transparent: true,
          // })
        
          // this.app.renderer.autoResize =  true ;
          // this.app.renderer.resize(w, 800);

          // // console.log(w, h);
          // this.app.renderer.backgroundColor = '#fff';
          
          // // The application will create a canvas element for you that you
          // // can then insert into the DOM
          // document.body.appendChild(this.app.view);
          status.success = true;
          return  res(  status );
        }
        catch( err ){
          console.error( err);
          return  rej(  status );
        }
      } );

      return promise
    }

    this.setCenterPoint = ( position ) => {
      this.centerPoint = position;
    }

    this.setSheeps = ( sheeps ) => {
      this.sheeps = sheeps;
      
      this.renderAvSheeps( this.sheeps )
      .then( response =>{
        console.log( 'renderAvSheeps', response );
      } );
    }

    this.findtheAngle = ( xI,yI, xD, yD, type ) => {
      let angle = null;
      if( type == 'rad' ){
       angle = Math.atan2(yD - yI, xD - xI );
      }
      else if( type == 'deg' ){
        angle = Math.atan2(yD - yI, xD - xI) * 180 / Math.PI;
      } 
      
      // console.log( 'angle',angle );
      return angle
    }

    this.play = ( sheep ) => {
    if( !sheep ){ 
      console.error('Sheep isnt available')
      return null
    }
    console.log( sheep );
      sheep.rotation =  this.findtheAngle( sheep.x, sheep.y, sheep.xD, sheep.yD, 'rad' ) ;
      // sheep.rotation =  10 ;z
      console.log(sheep.rotation);

      var dx = sheep.x - sheep.xD;
      var dy = sheep.y - sheep.yD;
      console.log('Its herer');
      console.log('dx',dx);
      console.log('dy herer',dy);
      console.log(' herer',Math.sqrt(dx * dx + dy * dy));
    
      if (Math.sqrt(dx * dx + dy * dy) <= 50) {
          sheep.x = sheep.xD;
          sheep.y = sheep.yD;
          // sheep.x = 0
          // sheep.y = 0
      }
      else if( Math.sqrt(dx * dx + dy * dy) >= this.bounds[0] ){
        sheep.x = sheep.xI;
        sheep.y = sheep.yI;
        sheep.rotation  = this.findtheAngle( sheep.xI , sheep.yI, sheep.xD, sheep.yD, 'rad')
      }
      else {
          sheep.x += 1;
          sheep.y += 1;
      }


    }

    this.gameLoop = (  ) =>  {
      console.log('inside gameLoop befor raf' );
      //Loop this function at 60 frames per second
      requestAnimationFrame( this.gameLoop  );
      this.sheepsToRender.forEach( sheep => {
        
        this.play( sheep );
      } ); 
      // this.state( sheep );
    
      // //Render the stage to see the animation
      this.renderer.render(this.stage);
    }

    this.setupPixi = (  resources, files ) => {
      console.log('Setup Pixi');
      var circle = new PIXI.Graphics();

      circle.beginFill( 0xFFF00 );

      circle.drawEllipse( this.centerPoint.c, this.centerPoint.y ,64,64 )
      circle.endFill();
      // var circle = new PIXI.Circle(this.centerPoint.x, this.centerPoint.y, 20);
      this.stage.addChild(circle);


      files.forEach( f => {
        const sheep = new PIXI.Sprite( resources[ f.fileName ].texture );
        let state = null;


        let newX = f.borrego.position.xI;
        let newY = f.borrego.position.yI;
        console.log( 'Before Add', sheep );
        // sheep.x = this.app.renderer.width / 2;
        // sheep.y = this.app.renderer.height / 2;
        sheep.position.set( newX, newY );

        sheep.vx = 0;
        sheep.vy = 0;
        
        sheep.xD = this.centerPoint.x;
        sheep.yD = this.centerPoint.y;

        sheep.xI = newX;
        sheep.yI = newY;

        sheep.anchor.x = 1;
        sheep.anchor.y = 0.5;

    
        this.sheepsToRender = [...this.sheepsToRender, sheep];

        this.stage.addChild(sheep);


      } );
      console.log( this.stage );

      this.gameLoop( );
    }

    this.renderAvSheeps = ( sheeps ) => {
      return new Promise( (resolve, reject)=> {
      
      // console.log( sheeps );

      let files = [];
      sheeps.forEach( sh => {
        // console.log( 'sheep' );
        // console.log( sh );
        this.loadSheep( sh )
        .then( responseSh => {
          console.log( responseSh );
          sh['fileName'] = responseSh.data;
          files = [...files, sh ];
        } );
      } );

      this.loader.load(
        (loader, resources) => {
      //     // This creates a texture from a 'sheep.png' image
         console.log(  'Loading' );
         console.log(  resources );
         this.setupPixi( resources,  files );
          
      });
      
      
      } );
    }

    this.selectSheep = ( id ) => {
      // console.log(id);
      switch(id){
        case 0:
         return sheep0
        case 1:
          return sheep1
        case 2:
          return sheep2
        case 3:
         return sheep3
        case 4:
         return sheep4
        case 5:
          return sheep5
        case 6:
         return sheep6
        case 7:
         return sheep7
        case 8:
        return sheep8
        case 9:
        return sheep9
      }
    }

    this.loadSheep = ( sheepObject ) => {
      console.log('Load new Sheep');

      console.log(sheepObject);
      

      let promise = new Promise( (res, rej )=> {
        let status = { success: false};
        let currentSheep = this.selectSheep( sheepObject.borregoId );
        console.log( currentSheep );
        try{
          this.loader.add( currentSheep )
          status.success = true;
          status.data = currentSheep;
          return res( status )
        }
        catch ( error ){
          status['error'] = error;
          return rej( status )
        }        
      } );

      return promise
    }
    // load the texture we need

  }

//   onResize(){
//     this.bounds = [this.container.offsetWidth, this.container.offsetHeight];
//     this.canvas.style.width = `${this.bounds[0]}px`;
//     this.canvas.style.height = `${this.bounds[1]}px`;
//     this.canvas.width = this.bounds[0];
//     this.canvas.height = this.bounds[1];
//     this.dots.x = (this.bounds[0] / 2) - (this.maxX / 2);
//     this.dots.y = (this.bounds[1] / 2) - ((this.spacer * this.totalDots) / 2);
//     this.renderer.resize(this.canvas.width, this.canvas.height);
//     this.renderer.render(this.stage);
//   }
  
//   step(timestamp) {
//     console.log('Step');
//     requestAnimationFrame((time) => this.step(time));
//     this.renderer.render(this.stage);
//   }
  
//   startDots() {
//     console.log('Start Dots');
//     const now = performance.now();
//     for (let i = 0; i < this.totalDots; i++) {
//       this.dots.children[i].animateComponent.start(now);
//     }
//   }

//   addDots() {
//     console.log('Add Dots');
//     this.dotSize = 10;
//     this.totalDots = 10;
//     this.duration = 1400;
//     this.minX = 0;
//     this.maxX = 200;
//     this.spacer = (this.dotSize * 2) + 3;
//     this.delay = this.duration / this.totalDots;
//     this.dots = new PIXI.Container();
//     this.stage.addChild(this.dots);
//     for (let i = 0; i < this.totalDots; i++) {
//       let dot = new Dot(this.dotSize);
//       dot.x = 0;
//       dot.y = i * this.spacer;
//       dot.animateComponent = new AnimateComponent(dot, this.delay * i, this.duration, this.minX, this.maxX);
//       this.dots.addChild(dot);
//     }
//   }
// }
// /**
//  * 
//  */

// class Dot {
//   constructor(size) {
//     const dot = new PIXI.Graphics();
//     dot.lineStyle(0);
//     dot.beginFill(0xFF0099, 0.6);
//     dot.drawCircle(0, 0, size);
//     dot.endFill();
//     return dot;
//   }
// }

// class AnimateComponent {
//   constructor(displayObject, delay, duration, minX, maxX) {
//     this.displayObject = displayObject;
//     this.delay = delay;
//     this.duration = duration;
//     this.minX = minX;
//     this.maxX = maxX;
//   }
  
//   start(timestamp) {
//     if (this.isAnimating) return;
//     const displayObject = this.displayObject;
//     const now = timestamp + this.delay;
//     setTimeout(() => {
//       this.tween = new TWEEN.Tween({x: this.minX})
//         .to({x: this.maxX}, this.duration)
//         .repeat(Infinity)
//         .yoyo(true)
//         .easing(TWEEN.Easing.Quartic.InOut)
//         .onUpdate(function onUpdate() {
//           displayObject.x = this.x;
//         })
//         .start(now);
//       this.isAnimating = true;
//       this.step(now);
//     }, this.delay);
//   }
  
//   stop() {
//     if (!this.isAnimating) return;
//     this.isAnimating = false;
//     this.tween.stop();
//     this.reset();
//   }
  
//   reset() {
//     this.displayObject.x = 0;
//   }
  
//   step(timestamp) {
//     if (this.isAnimating) requestAnimationFrame((time) => this.step(time));
//     this.tween.update(timestamp);
//   }
}

export default MyStage;