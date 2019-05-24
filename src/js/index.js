import utils from './utils';
import MyStage from './MyStage';
import firebase from 'firebase/app';
// require('dotenv').config();

export const isExtension = chrome && chrome.hasOwnProperty( 'extension' ); 

var firebaseConfig = {
  apiKey: "AIzaSyAijrYSPktsl036mpAZwjyb77l6OWcxAhA",
  authDomain: "borregosconectados.firebaseapp.com",
  databaseURL: "https://borregosconectados.firebaseio.com",
  projectId: "borregosconectados",
  storageBucket: "borregosconectados.appspot.com",
  messagingSenderId: "974041705636",
  appId: "1:974041705636:web:d322a63d7e3d9241"
};
// Initialize Firebase
// console.log( firebase );
// console.log( firebaseConfig );
// firebase.initializeApp(firebaseConfig);

let myStage = new MyStage( '#myContent', isExtension );

let chainedRequests = [ 
  utils.initializeFingerprint(), 
  utils.initializeFirebase(),
  utils.fetchSheeps(), 
  utils.fetchCenterPoint(), 
  myStage.initializeApp()  
];


Promise.all( chainedRequests  )
.then( ( [ responseInitFp, responseInitializeFirebase, responseSheeps, responseCenterPoint, responseInitApp ] )=> {
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
    myStage.setCenterPoint( responseCenterPoint.data );
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
