import * as PIXI from 'pixi.js'
import utils from './utils';
import Cookies from 'js-cookie';


import sheep from '../images/sheeps/shBH01.png';

console.log(sheep);

export class MyStage{
  constructor(){
    this.state = {};
    this.app = null;

    this.initializeApp = () => {
      console.log( 'initialize App' );

      let promise = new Promise( (res, rej ) => {
        let status = { success: false }
        try{
          this.app = new PIXI.Application({
            antialias: true,   
            resolution: 1 ,
            transparent: true,
          })
        
          this.app.renderer.autoResize =  true ;
          this.app.renderer.backgroundColor = '#fff';
          
          // The application will create a canvas element for you that you
          // can then insert into the DOM
          document.body.appendChild(this.app.view);
          status.success = true;
          return  res(  status );
        }
        catch( err ){
          return  rej(  status );
        }
      } );

      return promise
    }

    this.loadNewSheep = ( id, iX, iY, dX, dY, s, ang ) => {
      console.log('Load new Sheep')
      let promise = new Promise( (res, rej )=> {
        let status = { success: false};
        try{
          this.app.loader.add('sheep', sheep).load(
            (loader, resources) => {
          //     // This creates a texture from a 'sheep.png' image
              const sheep = new PIXI.Sprite( resources.sheep.texture );
          
          //     // Setup the position of the sheep
              sheep.x = this.app.renderer.width / 2;
              sheep.y = this.app.renderer.height / 2;
          
          //     // Rotate around the center
              sheep.anchor.x = 1;
              sheep.anchor.y = 0.5;
          
          //     // Add the sheep to the scene we are building
              this.app.stage.addChild(sheep);
          
          //     // Listen for frame updates
              this.app.ticker.add(() => {
                   // each frame we spin the sheep around a bit
                  // sheep.rotation += 0.01;
              });
              
          });
          status.success = true;
          return res( status )
        }
        catch ( error ){
          return rej( status )
        }        
      } );

      return promise
    }
    // load the texture we need
    
  } 
  

}

let myStage = new MyStage();

let chainedRequests = [ 
  utils.initializeFingerprint(), 
  utils.fetchSheeps(), 
  myStage.initializeApp()  
];

Promise.all( chainedRequests  )
.then( ( [ responseInitFp, responseSheeps, responseInitApp ] )=> {
  console.log(responseInitFp, responseSheeps, responseInitApp ); 
  if( !responseInitFp.data.fpExist){
    utils.addThisSheep( responseInitFp.data.sheepModel )
    .then( responseAddSheep => {
      console.log( 'add sheep REsponse' , responseAddSheep );
    } )
    .catch( err => {
      console.error(err);
    } );
  }
 })
 .catch( error => {
   console.error( error );
 } );

// utils.initializeFingerprint()
// .then( resolve => {
//   utils.fetchSheeps()
//   .then( responseSheeps => {
//     console.log( responseSheeps );
//       myStage.initializeApp()
//       .then( response => {
//         console.log( response ); 
//       } )
//       .catch( err => {
//         console.error( err );
//       } )
//   } )
//   .catch( err => {
//     console.error(err);
//   })
// })

