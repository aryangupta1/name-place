import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { createApp } from 'vue'
import './style.css'
import './index.css'

import App from './App.vue'

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBdRgb4TanojJVZXfY6l3KphI6YE3-Gw58',
  authDomain: 'name-place-840c8.firebaseapp.com',
  projectId: 'name-place-840c8',
  storageBucket: 'name-place-840c8.appspot.com',
  messagingSenderId: '398599889128',
  appId: '1:398599889128:web:2f5bd59ae73644afe8a95d',
  measurementId: 'G-73B59TKJM7',
  databaseURL: 'https://name-place-840c8-default-rtdb.firebaseio.com/',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

createApp(App).mount('#app')
