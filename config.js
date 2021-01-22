//import * as firebase from 'firebase'
//require('@firebase/firestore')
import firebase from 'firebase/app'
import '@firebase/firestore'
import 'firebase/storage'
import 'firebase/analytics'

  // Your web app's Firebase configuration
 
  var firebaseConfig = {
    apiKey: "AIzaSyDOBneFDnI-MQHmSG6vbUao3gcwVCdtlyE",
    authDomain: "wily-88fd0.firebaseapp.com",
    databaseURL: "https://wily-88fd0-default-rtdb.firebaseio.com",
    projectId: "wily-88fd0",
    storageBucket: "wily-88fd0.appspot.com",
    messagingSenderId: "6347492811",
    appId: "1:6347492811:web:28b217c6c425adefc53a4e"
  };
  // Initialize Firebase
  //if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
  //}
  

  export default firebase.firestore();
