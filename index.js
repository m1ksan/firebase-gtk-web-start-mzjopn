// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import {
  getAuth,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import {getFirestore,addDoc,collection} from 'firebase/firestore';

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

let rsvpListener = null;
let guestbookListener = null;

let db, auth;

async function main() {
  // Add Firebase project configuration object here

  const firebaseConfig = {
    apiKey: 'AIzaSyD-gq6voNT7QK-BBtNW5JiYlpnRHdDlI8I',
    authDomain: 'fir-web-codelab-9ce45.firebaseapp.com',
    projectId: 'fir-web-codelab-9ce45',
    storageBucket: 'fir-web-codelab-9ce45.appspot.com',
    messagingSenderId: '854646381616',
    appId: '1:854646381616:web:3b33704f286dcb4a29e1f5',
  };
  // const firebaseConfig = {};

  // Initialize Firebase
  initializeApp(firebaseConfig);
  auth = getAuth();
  db = getFirestore();
  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };

  // const ui = new firebaseui.auth.AuthUI(auth);
  const ui = new firebaseui.auth.AuthUI(auth);

  // Listen to RSVP button clicks
  // Called when the user clicks the RSVP button
startRsvpButton.addEventListener('click', () => {
  if (auth.currentUser) {
    // User is signed in; allows user to sign out
    signOut(auth);
  } else {
    // No user is signed in; allows user to sign in
    ui.start('#firebaseui-auth-container', uiConfig);
  }
});

  // Listen to the current Auth state
  onAuthStateChanged(auth, user => {
    if (user) {
      startRsvpButton.textContent = 'LOGOUT';
    } else {
      startRsvpButton.textContent = 'RSVP';
    }
  });

  // Listen to the current Auth state
onAuthStateChanged(auth, user => {
  if (user) {
    startRsvpButton.textContent = 'LOGOUT';
    // Show guestbook to logged-in users
    guestbookContainer.style.display = 'block';
  } else {
    startRsvpButton.textContent = 'RSVP';
    // Hide guestbook for non-logged-in users
    guestbookContainer.style.display = 'none';
  }
});

// Listen to the form submission
form.addEventListener('submit', async e => {
  // Prevent the default form redirect
  e.preventDefault();
  // Write a new message to the database collection "guestbook"
  addDoc(collection(db, 'guestbook'), {
    text: input.value,
    timestamp: Date.now(),
    name: auth.currentUser.displayName,
    userId: auth.currentUser.uid
  });
  // clear message input field
  input.value = '';
  // Return false to avoid redirect
  return false;
});

}
main();
