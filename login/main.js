// import './style.css';

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import {getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

  // import {} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBPACURk0fECwcx7mdnvgKvzoAwFIZ-wfc",
    authDomain: "authlearn-c0620.firebaseapp.com",
    projectId: "authlearn-c0620",
    storageBucket: "authlearn-c0620.appspot.com",
    messagingSenderId: "1057467852931",
    appId: "1:1057467852931:web:6b68ef4f55754653c753b6"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);
const auth = getAuth(app);

// SIGN UP USER 
const notify = document.querySelector('#notify');
// notify.innerHTML="gfg";

function createUser(){
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  if(email == "" || password == ""){
    notify.innerText = "Please provide email and password"
  }
  else{
    createUserWithEmailAndPassword(auth, email, password).then((userCredentials)=>{
      const user = userCredentials.user;
      if(user){
        notify.innerText= "User Created Successfully";
      }
      else{
        notify.innerText = "Something is wrong";
      }
    }).catch((err)=>{
      console.log(err);
    })
  }
}

const signup_btn = document.querySelector("#signup_btn");
signup_btn.addEventListener('click', createUser);


// LOGIN USER

function loginUser(){
  // alert('pp');
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  if(email == "" || password == ""){
    notify.innerText = "Please provide email and password"
  }
  else{
    signInWithEmailAndPassword(auth, email, password).then((userCredentials)=>{
      const user = userCredentials.user;
      if(user){
        notify.innerText = "User Loged In";
      }
      else{
        notify.innerText = "Email or Password is wrong";
      }
    }).catch((err)=>{
      console.log(err);
    })
  }

}


const login_btn = document.querySelector('#login_btn');
login_btn.addEventListener('click', loginUser);

// AFTER LOGIN

// onAuthStateChanged(auth, (user)=>{
//   if(user){
//     document.querySelector('.user_form').classList.add('hide');
//     document.querySelector('.admin_page').classList.add('show');
//   }
// })

function okay(){
  onAuthStateChanged(auth, (user)=>{
    if(user){
      document.querySelector('.user_form').classList.add('hide');
      document.querySelector('.admin_page').classList.add('show');
    }
  })
}
login_btn.addEventListener('click', okay);

// LOGOUT

function logoutUser(){
  signOut(auth).then(()=>{
    document.querySelector('.user_form').classList.remove('hide');
    document.querySelector('.admin_page').classList.remove('show');
  }).catch((err)=>{
    console.log(err);
  })
}
const logout_btn = document.querySelector('#logout');
logout_btn.addEventListener('click', logoutUser);

// FORGET PASSWORD

const notify2 = document.querySelector('.notify2');

function showForgetPasswordForm(){
  document.querySelector('.forget_password').classList.add('visible');
}
const forget_link = document.querySelector('#forget_link');
forget_link.addEventListener('click',showForgetPasswordForm);


function forgetPassword(){
  const email = document.querySelector('#forget_email').value;
  if(email == ""){
    notify2 = "Please Enter your Email";
  }
  else{
    sendPasswordResetEmail(auth, email).then(()=>{
      notify2.innerText = "Password Reset email sent, check your email inbox"
    }).catch((err)=>{
      console.log(err);
    })
  }
}
const forget_btn = document.querySelector('#forget_btn');
forget_btn.addEventListener('click',forgetPassword);

// GOOGLE

const Provider = new GoogleAuthProvider();

function loginWithGoogle(){
  signInWithPopup(auth, Provider).then((result)=>{
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
  }).catch((err)=>{
    console.log(err);
  })
}
const gmail_login_btn = document.querySelector("#gmail_login_btn")
gmail_login_btn.addEventListener('click',loginWithGoogle);                       

onAuthStateChanged(auth,(user)=>{
  if(user){
    document.querySelector('.user_form').classList.add('hide');
    document.querySelector('.admin_page').classList.add('show');
  }
})

// FACEBOOK

const ProviderFb = new FacebookAuthProvider();

function loginWithFacebook(){
  signInWithPopup(auth, ProviderFb).then((result)=>{
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
  }).catch((err)=>{
    console.log(err);
  })
}
const fb_login_btn = document.querySelector("#fb_login_btn")
fb_login_btn.addEventListener('click',loginWithFacebook);                       

onAuthStateChanged(auth,(user)=>{
  if(user){
    console.log("yes");
    document.querySelector('.user_form').classList.add('hide');
    document.querySelector('.admin_page').classList.add('show');
  }
  else{
    console.log("sorry");
  }
})