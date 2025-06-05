const scroll = new LocomotiveScroll({
  el: document.querySelector('#main'),
  smooth: true
});

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

import { getDatabase, set, get, ref } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import {} from "https://apis.google.com/js/platform.js?onload=init";

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
const auth = getAuth(app);
const db = getDatabase(app);

function writeUserData(userID, firstname, lastname, username, email){
  set(ref(db,'users/' + userID), {
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email
  })
}

// SIGN UP USER 
const notify = document.querySelector('#notify');

function createUser(){
  const firstname = document.querySelector('#signup-firstname').value;
  const lastname = document.querySelector('#signup-lastname').value;
  const username = document.querySelector('#signup-username').value;
  const email = document.querySelector('#signup-email').value;
  const password = document.querySelector('#signup-password').value;
  const confirm_password = document.querySelector('#confirm-password').value;

  if(firstname=="" || username=="" || email=="" || password=="" || confirm_password=="") {
    notify.innerText = "Required"
    console.log("Required");
  }
  else if(password != confirm_password) {
    console.log("Passwords don't match");
  }
  else{
    createUserWithEmailAndPassword(auth, email, password).then((userCredentials)=>{
      const user = userCredentials.user;

      if(user){
        var currentuser = {
          firstname: document.querySelector('#signup-firstname').value,
          lastname: document.querySelector('#signup-lastname').value,
          username: document.querySelector('#signup-username').value,
          email: user.email,
          uid: user.uid,
        }
        writeUserData(user.uid, currentuser.firstname, currentuser.lastname, currentuser.username, currentuser.email);
        console.log("User Created Successfully");
        notify.innerText= "User Created Successfully";
        closeSignupBox();
        showLoginBox();
        logoutUser();        
      }
      else{
        notify.innerText = "Something is wrong";
      }
    }).catch((error)=>{
      console.log(error.message);
    })
  }
}

const signup_btn = document.querySelector("#signup-btn");
signup_btn.addEventListener('click', createUser);

function loginUser(){
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  if(email == "" || password == ""){
    notify.innerText = "Please provide email and password"
    
  }
  else{
    signInWithEmailAndPassword(auth, email, password).then((userCredentials)=>{
      const user = userCredentials.user;
      if(user){
        notify.innerText = "";
        getUserData(user.uid, null);
      }
      else{
        notify.innerText = "Email or Password is wrong";
      }
    }).catch((error)=>{
      console.log(error.message);
    })
  }
}

const login_btn = document.querySelector('#login-btn');
login_btn.addEventListener('click', loginUser);

function getUserData(uid, img_src){
  const userRef = ref(db, 'users/' + uid);
    get(userRef).then((snapshot) =>{
      var uservalue = snapshot.val().firstname;
      uservalue = uservalue +" "+ snapshot.val().lastname;
      document.getElementById('user-profile-name').style.width = ((uservalue.length + 3) * 8) + 'px';
      document.getElementById('user-profile-name').value = uservalue;

      var useremail = snapshot.val().email;
      document.getElementById('user-profile-email').style.width = ((useremail.length + 1) * 8) + 'px';
      document.getElementById('user-profile-email').value = useremail;
      
      if(img_src == null) {
        document.querySelector('.user-image').src = "/assets/images/user6.png";
      }
      else {
        document.querySelector('.user-image').src = img_src; 
        document.querySelector('.user-image').srcset = img_src; 
      }
  }).catch((error)=>{
    console.log(error.message);
  })
}

onAuthStateChanged(auth,(user)=>{
  if(user){
    notify.innerText = "";
    notify2.innerText = "";
    document.getElementById("user-form").style.animation = "slideToDown 1s ease forwards";
    document.querySelector('#main').classList.remove('showLoginBoxMain');
    document.querySelector('#email').value = "";
    document.querySelector('#password').value = "";

    document.getElementById("signup-form").style.animation = "slideToDown 1s ease forwards";
    document.querySelector('#main').classList.remove('showLoginBoxMain');
    document.querySelector('#email').value = "";
    document.querySelector('#password').value = "";

    document.querySelector('.user-profile').style.display = "flex";
    document.querySelector('.nav-list2').style.display = "none";

    getUserData(user.uid, user.photoURL);
  }
})

function logoutUser(){
  signOut(auth).then(()=>{
    notify.innerText = "";
    notify2.innerText = "";
    document.querySelector('#main').classList.remove('showLoginBoxMain');
    
    document.querySelector('.user-profile').style.display = "none";
    document.querySelector('.nav-list2').style.display = "flex";
    
    document.getElementById('user-profile-name').value = "";
    document.querySelector('.user-image').src = null;  
    document.getElementById('user-profile-email').value = "";
    document.querySelector('.user-profile-box').style.display = "none";

  }).catch((error)=>{
    console.log(error.message);
  })
}
const logout_btn = document.querySelector('#logout');
logout_btn.addEventListener('click', logoutUser);

// FORGET PASSWORD
let notify2 = document.querySelector('.notify2');

function showForgetPasswordForm(){
  document.querySelector('.forget-password').classList.add('visible');
}
const forget_link = document.querySelector('#forget-link');
forget_link.addEventListener('click',showForgetPasswordForm);

function forgetPassword(){
  const email = document.querySelector('#forget-email').value;
  if(email == ""){
    notify2.innerText = "Please Enter your Email";
  }
  else{
    sendPasswordResetEmail(auth, email).then(()=>{
      notify2.innerText = "Password Reset email sent, check your email inbox"
    }).catch((error)=>{
      console.log(error.message);
    })
  }
}
const forget_btn = document.querySelector('#forget-btn');
forget_btn.addEventListener('click',forgetPassword);

// GOOGLE
const Provider = new GoogleAuthProvider();
Provider.addScope('profile'); 
Provider.addScope('email');

function loginWithGoogle(){
  signInWithPopup(auth, Provider).then((result)=>{
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;

    const currentuser = result._tokenResponse;

    const userRef = ref(db, 'users/' + user.uid);
    get(userRef).then((snapshot) =>{
      if(!snapshot.exists()) {
        writeUserData(user.uid, currentuser.firstName, currentuser.lastName, currentuser.displayName, currentuser.email);
        
        var uservalue = currentuser.displayName;
        document.getElementById('user-profile-name').style.width = ((uservalue.length + 3) * 8) + 'px';
        document.getElementById('user-profile-name').value = uservalue;
        document.getElementById('user-profile-email').style.width = ((snapshot.val().email.length + 1) * 8) + 'px';
        document.getElementById('user-profile-email').value = currentuser.email;
        document.querySelector('.user-image').src = currentuser.photoUrl;
      }
      else
        getUserData(user.uid, currentuser.photoUrl);
    })
  }).catch((error)=>{
    console.log(error.message);
  })
}
const gmail_login_btn = document.querySelector("#gmail-login-btn")
gmail_login_btn.addEventListener('click',loginWithGoogle); 

const signup_gmail_login_btn = document.querySelector("#signup-gmail-login-btn")
signup_gmail_login_btn.addEventListener('click',loginWithGoogle);                       

// FACEBOOK
const ProviderFb = new FacebookAuthProvider();

function loginWithFacebook(){
  signInWithPopup(auth, ProviderFb).then((result)=>{
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
  }).catch((error)=>{
    console.log(error.message);
  })
}
const fb_login_btn = document.querySelector("#fb-login-btn")
fb_login_btn.addEventListener('click',loginWithFacebook);                       

const signup_fb_login_btn = document.querySelector("#signup-fb-login-btn")
signup_fb_login_btn.addEventListener('click',loginWithFacebook); 

// SHOW LOGIN BOX
function showLoginBox(){
  document.querySelector('#main').classList.add('showLoginBoxMain');
  document.querySelector('.user-form').classList.add('showLoginBox');
  document.getElementById("user-form").style.animation = "slideFromTop 1s ease forwards";
  document.querySelector('.signup-form').classList.remove('showLoginBox');
}
const nav_login_button = document.querySelector('.nav-login-button')
nav_login_button.addEventListener('click', showLoginBox)

const signin_here = document.querySelector('#signin-here')
signin_here.addEventListener('click', showLoginBox)

// CLOSE LOGIN BOX
function closeLoginBox(){
  document.getElementById("user-form").style.animation = "slideToDown 1s ease forwards";
  document.querySelector('#main').classList.remove('showLoginBoxMain');
  document.querySelector('#email').value = "";
  document.querySelector('#password').value = "";
}
const form_close = document.querySelector('.form-close')
form_close.addEventListener('click', closeLoginBox)

// SHOW SIGNUP BOX 
function showSignupBox(){
  document.querySelector('#main').classList.add('showLoginBoxMain');
  document.querySelector('.signup-form').classList.add('showLoginBox');
  document.getElementById("signup-form").style.animation = "slideFromTop 1s ease forwards";
  document.querySelector('.user-form').classList.remove('showLoginBox');
}
const nav_signup_button = document.querySelector('.nav-signup-button')
nav_signup_button.addEventListener('click', showSignupBox)

const signup_here = document.querySelector('#signup-here')
signup_here.addEventListener('click', showSignupBox)

// CLOSE SIGNUP BOX
function closeSignupBox(){
  document.getElementById("signup-form").style.animation = "slideToDown 1s ease forwards";
  document.querySelector('#main').classList.remove('showLoginBoxMain');
  document.querySelector('#email').value = "";
  document.querySelector('#password').value = "";
}
const signup_form_close = document.querySelector('.signup-form-close')
signup_form_close.addEventListener('click', closeSignupBox)

function loaderAnimation2() {
  var loader = document.querySelector("#loader-2")
  setTimeout(function () {
      loader.style.top = "-100%"
  }, 1000)
}

// USER PROFILE BOX
function showUserProfileBox() {
  if(document.querySelector('.user-profile-box').style.display == "flex") {
    document.querySelector('.user-profile-box').style.display = "none";
  }
  else {
    document.querySelector('.user-profile-box').style.display = "flex";
    const user = auth.currentUser;
    getUserData(user.uid, user.photoURL);
  }
}
const user_profile_box = document.querySelector('.dropdown-profile-arrow');
user_profile_box.addEventListener('click',showUserProfileBox);

window.onclick = function(event) {
  if (!event.target.matches('.dropdown-profile-arrow') && !event.target.matches('.user-profile-box') && !event.target.matches('.user-profile-name-input') && !event.target.matches('.user-profile-email-input')  && !event.target.matches('.user-profile-box') && !event.target.matches('.userprofile-signout-button') && !event.target.matches('.logout-icon')) {
    document.querySelector('.user-profile-box').style.display = "none";
  }
}