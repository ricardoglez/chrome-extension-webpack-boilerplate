import Fingerprint2 from 'fingerprintjs2';
import Cookies from 'js-cookie';
const localStorage = window.localStorage;
import firestore from './firestore';

const utils = {
  createOwnSheep: () => {
    console.log('Creat Sheep');
  },
  setMySheep: () => {
    let sheep = JSON.stringify( mySheep );
    console.log(sheep);
    localStorage.setItem( 'mySheep', sheep );
  },
  fetchSheeps: () => {
    return new Promise( (resolve, reject) => {
      let sheeps = [];
      firestore.collection('borregos')
      .onSnapshot( (snapshot) => {
        // console.log('snapshot');
        snapshot.forEach( doc => {
          // console.log(doc.data);
          // console.log(doc.id);
          let sheep = {  
            id: doc.id,
            borrego: doc.data().borrego,
            connected: doc.data().connected,
            borregoId: doc.data().borregoId,
            created: doc.data().created,
            fingerprint: doc.data().fingerprint,
          }
          sheeps = [...sheeps, sheep];
        } );
        let responseObj = { success: true, data:sheeps }
        resolve( responseObj );
      } );
    } );
  },
  getMySheep: () => {
    let sheep = localStorage.getItem( "mySheep" );
    // console.log(sheep);
    try {
      sheep = JSON.parse( sheep );
      // console.log('Parsed',sheep);
      return sheep

    }
    catch(err){
      console.error(err);
      return null
    }
  },

  initializeFingerprint: () => {
    console.log('Initialize Fingerprint ');
    return new Promise( (resolve, reject) => {
      let fingerprintExist = !localStorage.getItem('fingerprint') ? false: true ;
      let fingerPrint = null;

      let status = { success : false, data:null }

      if( fingerprintExist ){
        console.log('User already has a sheep!');
        // let obj = { fingerprint: localStorage.getItem('fingerprint'),  }
        // this.setStaet({
        //   mySheep:
        // })
        let mySheepData = utils.getMySheep();
        // console.log(mySheepData);
        status.data = {"fingerprint": localStorage.getItem('fingerprint'), "fpExist": true, "created": localStorage.getItem("created"), mySheep: mySheepData };
        resolve(status); 
      }
      else{
        console.log('User doesnt own a sheep so create one with fingerprint');
        Fingerprint2.getPromise( {} )
        .then( ( components ) => {
          console.log( components );
          let values = components.map( ( component ) => {
            console.log(component);
            return component.value
          } );

        let sheepModel = utils.createOwnSheep( components );

        let now = new Date();

        let salt = now;
        
        let toHash = salt+""+values.join('');

        let murmur = Fingerprint2.x64hash128( toHash, 31 );

        fingerPrint = murmur;

        let cookieFingerprint = Cookies.get( 'fingerprint' );
        // console.log( 'CoookieFP', cookieFingerprint, fingerPrint );
        if ( cookieFingerprint == undefined ) {
          Cookies.set( 'fingerprint', fingerPrint );
          localStorage.setItem( 'fingerprint', fingerPrint );
          localStorage.setItem('created', now);
          utils.setMySheep( sheepModel );
        } else {
          localStorage.setItem( 'fingerprint', fingerPrint );
          localStorage.setItem('created', now);
          utils.setMySheep( sheepModel );
        }

        status.data = {fingerprint: fingerPrint, "fpExist": false, "created": now, "sheepModel": sheepModel, "fPComopnents": components} ;
        console.log(status);

        resolve( status );

      } ).catch( e => {
        console.error( e );
        reject(e);
      } );
      }  
    } )
  },
  getCentralPoint: () => {
    firestore.collection('centerPosition')
    .onSnapshot( (snapshot) => {
      // console.log('snapshot');
      // console.log(  snapshot);
      let position = null;
      snapshot.forEach( doc => {
        position  = doc.data();
      });
      //   // console.log(doc.id);
      //   // let position = {  
      //   //   id: doc.id,
      //   //   borrego: doc.data().borrego,
      //   //   connected: doc.data().connected,
      //   //   borregoId: doc.data().borregoId,
      //   //   created: doc.data().created,
      //   //   fingerprint: doc.data().fingerprint,
      //   // }
      //   // sheeps = [...sheeps, sheep];
      // } );
      let responseObj = { success: true, data: position }
      console.log( responseObj);
      resolve( responseObj );
    } );
  },
  addSheep: () => {

  }



}


export default utils;