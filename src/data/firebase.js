import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: 'AIzaSyCDZ3zzCfugHEqXH-6pTpSjmO3ZHiuQlpQ',
  authDomain: 'undangan-aethersub.firebaseapp.com',
  databaseURL: 'https://undangan-aethersub-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'undangan-aethersub'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const db = firebase.database()

// expose agar bisa dipakai RSVP & Dashboard
export { firebase, db }
