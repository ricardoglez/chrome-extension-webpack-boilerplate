import * as PIXI from 'pixi.js'
import utils from './utils';
import Cookies from 'js-cookie';


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

// console.log(sheep);

export class MyStage{
  constructor(){
    this.state = null;
    this.app = null;
    this.sheeps = null;
    this.mySheep = null;
    this.centerPoint = null;

    this.initializeApp = () => {
      console.log( 'initialize App' );

      let promise = new Promise( (res, rej ) => {
        let status = { success: false }
        try{
          let w = document.body.clientWidth ;
          let h = document.body.clientHeight;
          this.app = new PIXI.Application({
            antialias: true,   
            resolution: 1 ,
            transparent: true,
          })
        
          this.app.renderer.autoResize =  true ;
          this.app.renderer.resize(w, 800);

          // console.log(w, h);
          this.app.renderer.backgroundColor = '#fff';
          
          // The application will create a canvas element for you that you
          // can then insert into the DOM
          document.body.appendChild(this.app.view);
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

    this.play = ( sheep ) => {
    if( !sheep ){ 
      console.error('Sheep isnt available')
      return null
    }
    console.log( sheep );

      var dx = sheep.x - sheep.xD;
      var dy = sheep.y - sheep.yD;
  
      if (Math.sqrt(dx * dx + dy * dy) <= 5) {
          sheep.x = sheep.xD;
          sheep.y = sheep.yD;
      }
      else {
          sheep.x += 1;
          sheep.y += 1;
      }
    }

    this.gameLoop = ( sheep ) =>  {
      console.log( sheep );
      //Loop this function at 60 frames per second
      // requestAnimationFrame(this.gameLoop);
      this.state( sheep );
    
      // //Render the stage to see the animation
      this.app.renderer.render(this.app.stage);
    }

    this.setupPixi = (  resources, files ) => {
      console.log('Setup Pixi');


      files.forEach( f => {
        const sheep = new PIXI.Sprite( resources[ f.fileName ].texture );
        let state =null;
        let newX = f.borrego.position.xI;
        let newY = f.borrego.position.yI;
        console.log( sheep );
        // sheep.x = this.app.renderer.width / 2;
        // sheep.y = this.app.renderer.height / 2;
        sheep.position.set( newX, newY );

        sheep.vx = 0;
        sheep.vy = 0;
        
        sheep.xD = this.centerPoint.x;
        sheep.yD = this.centerPoint.y;


        sheep.anchor.x = 1;
        sheep.anchor.y = 0.5;
    
        this.app.stage.addChild(sheep);

        this.state = this.play;

        console.log( sheep );
        this.gameLoop( sheep );

      } );
      
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

      this.app.loader.load(
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
          this.app.loader.add( currentSheep )
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
  

}

let myStage = new MyStage();

let chainedRequests = [ 
  utils.initializeFingerprint(), 
  utils.fetchSheeps(), 
  utils.fetchCenterPoint(), 
  myStage.initializeApp()  
];

Promise.all( chainedRequests  )
.then( ( [ responseInitFp, responseSheeps, responseCenterPoint, responseInitApp ] )=> {
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

  if( responseCenterPoint.success ){
    myStage.setCenterPoint( responseCenterPoint.data )
  }

  if( responseSheeps.success ){
    console.log( 'Sheeps from server' );
    console.log( responseSheeps );
    myStage.setSheeps( responseSheeps.data );
  }
 })
 .catch( error => {
   console.error( error );
 } );


 
