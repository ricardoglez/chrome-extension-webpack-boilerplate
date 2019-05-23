import utils from './utils';
import MyStage from './MyStage';

let myStage = new MyStage( '#myContent');

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


 
