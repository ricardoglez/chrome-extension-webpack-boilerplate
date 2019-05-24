import Fingerprint2 from 'fingerprintjs2';
import Cookies from 'js-cookie';
const localStorage = window.localStorage;
import firestore from './firestore';
import firebase from 'firebase';


const utils = {
  initializeFirebase: () => {
    return new Promise( (resolve , rejest) => {
      
    } )
  },
  addThisSheep:( sheep ) => {
    console.log( 'Add this sheep', sheep );
    return new Promise ( ( resolve, reject ) => {
      const sheepToServer = { 
        borrego: sheep,

      } 
      firestore.collection('borregos').add( sheep )
      .then( response => {
        console.log( 'Successfully Added' );
        console.log( response );
        sheep["id"] = response.id;
        resolve( { success: true , sheepId: response.id} );
      } )
      .catch( err => {
        console.error(err);
        reject({ success: false } );
      });     
    } )
  },
  mapRange : (value, low1, high1, low2, high2)  => {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  },
  createOwnSheep: ( components, fingerprint ) => {
    console.log('Creat Sheep');
    let sheepModel = {
      borrego:{
        borregoId       : null,
        numCurl         : null,
        height          : null,
        width           : null,
        size            : null,
        speed           : null,
        exponential     : null,
        position        : {},
      },
      borregoId: null, 
      connected       : false,
      created         : null,
      fingerprint     : fingerprint,
    };

    let response = { success: false , data: null };

    let promise = null;



    /**
     * Set the size of the screen 
     * @param { Number } width 
     */
    const setSizeScreen = ( width ) => {
      if( width <= 669 ){
        return 'xs'
      }
      else if( width <= 769 && width > 669 ){
        return 'sm'
      }
      else if( width <= 1024 && width > 769 ){
        return 'md'
      }
      else if( width <= 1240 && width > 1224 ){
        return 'lg'
      }
      else {
        return 'xlg'
      }
    };


    const setSheepPosition= ( nowDate ) => {

      let position = { xI:null  , yI:null };

      position.yI = utils.mapRange( nowDate.getHours() , 9 , 18 , 1 ,10 );
      position.xI = utils.randomNumber( -100 , -250  );

      return position 
    };

    /**
     * Get Number of curls based on the screen Size
     * @param { String } size 
     */
    const setNumCurl = ( size ) => {
      switch( size ){
        case 'xs':
          return utils.randomNumber( 0,1 );
        case 'sm':
          return utils.randomNumber( 2,3 );
        case 'md':
          return utils.randomNumber( 4,5 );
        case 'lg':
          return utils.randomNumber( 6,7 );
        case 'xlg':
          return utils.randomNumber( 8,9 );
      }
    }

    promise = new Promise ( ( res, rej )  => {

      try{
        components.forEach( component => {      
          switch( component.key){
            case 'screenResolution':
              sheepModel.borrego.width =  component.value[ 1 ] ; 
              sheepModel.borrego.height =  component.value[ 0 ] ; 
              sheepModel.borrego.size = setSizeScreen( component.value[ 1 ] );
              sheepModel.borrego.numCurl = setNumCurl( sheepModel.size );
            break;
            case 'colorDepth':
              // sheepModel.opacity = this.setSize( component.value );
            break;
            case 'deviceMemory':
              // sheepModel.speed = component.value ;         
            break;
            case 'hardwareConcurrency':
              sheepModel.borrego.speed =  component.value ; 
            break;
            case 'timezoneOffset':
              sheepModel.borrego.exponential =  component.value;
            break;
            case 'fonts':
              sheepModel.borrego.numCurl = component.value.length ;         
            break;
            case 'adBlock':
              // sheepModel.fill = this.setFill( component.value );
            break;
            case 'touchSupport':
              // sheepModel.exponential = sheepModel.exponential*.2;         
            break;
            case 'audio':
            break;
          }
        } );
        
        console.log( sheepModel);

        let nowDate = new Date();
        let borregoId =  setNumCurl( sheepModel.borrego.size );

        sheepModel.created = nowDate;
        sheepModel.borrego.position = setSheepPosition( nowDate );
    
        sheepModel.borrego.borregoId = borregoId;
        sheepModel.borregoId = borregoId;


    
        response.success = true ;
        console.log( sheepModel );
        response.data = sheepModel;

        res( response );
      }
      catch( err ){
        response.data = err;
        rej( response );
      }
    });

    return  promise
  },
  randomNumber : (minHeight, maxHeight) => {
    let r = Math.floor(Math.random() * (maxHeight - minHeight +1 )) + minHeight;
    // console.log( 'r', r);
    return r
  },
  setMySheep: ( mySheep ) => {
    if( !mySheep ){
      console.err(  'MySheep Doesnt exist');
    };

    console.log( mySheep );
    let sheep = JSON.stringify( mySheep );
    console.log(sheep);
    localStorage.setItem( 'mySheep', sheep );
  },
  fetchCenterPoint: () => {
    return new Promise( ( resolve, reject ) => {
      try{
        let position = null;
        firestore.collection('centerPosition')
        .onSnapshot( (snapshot) => {
          // console.log('snapshot');
          // console.log(  snapshot);
          snapshot.forEach( doc => {
            position  = doc.data();
          });
          resolve( {success: true , data: position} );
        })
      }
      catch( err){
        console.error( error )
        reject( err );
      }
    });
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
    console.log(sheep);
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
          // console.log( components );
          let values = components.map( ( component ) => {
            // console.log(component);
            return component.value
          } );


        let now = new Date();

        let salt = now;
        
        let toHash = salt+""+values.join('');

        let murmur = Fingerprint2.x64hash128( toHash, 31 );

        fingerPrint = murmur;

        utils.createOwnSheep( components , fingerPrint )
        .then( responseModel => {
          let cookieFingerprint = Cookies.get( 'fingerprint' );
          // console.log( 'CoookieFP', cookieFingerprint, fingerPrint );
          if ( cookieFingerprint == undefined ) {
            Cookies.set( 'fingerprint', fingerPrint );
            localStorage.setItem( 'fingerprint', fingerPrint );
            localStorage.setItem('created', now);
            utils.setMySheep( responseModel.data.borrego );
          } else {
            localStorage.setItem( 'fingerprint', fingerPrint );
            localStorage.setItem('created', now);
            utils.setMySheep( responseModel.data.borrego );
          }
  
          status.data = {fingerprint: fingerPrint, "fpExist": false, "created": now, "sheepModel": responseModel.data, "fPComopnents": components} ;
          console.log(status);
  
          resolve( status );
        } )
        .catch( error => {
          console.error( error);
        } );
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