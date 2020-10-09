require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const Auth = require('./firebase.js');
const ejs = require('ejs');

const app = express();

let publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/style', express.static(__dirname + '/style/')); // redirect CSS bootstrap
app.set('view engine', 'ejs');

let userLogged;

firebase.auth().onAuthStateChanged((user) => {
   if (user) {
      userLogged = user;
      console.log(`User UID ${userLogged.uid}`);
      console.log(`User log in ${JSON.stringify(userLogged)}`);
   } else {
      userLogged = null;
   }
});

app.get("/", (req, resp) => {
   resp.render('index', {errorMsg: '', code: 0});
});

app.post("/createuser", (req, resp) => {
    const body = req.body;
    Auth.SignUpWithEmailAndPassword(body.email, body.password)
        .then((login) => {
            if (login.err) {
                resp.render('index', {errorMsg: login.err, code: 2});
            } else {
                resp.redirect('dashboard');
            }
        });
});

app.get("/dashboard", (req, resp) => {
   if (userLogged) {
      resp.render('dashboard', {user: userLogged});
   } else {
      resp.redirect('/');
   }
});

app.post("/login", (req, resp) => {
   const body = req.body;
   Auth.SignInWithEmailAndPassword(body.email, body.password)
       .then((login) => {
          if (login.err) {
              console.log("Error....", login.err)
              resp.render('index', {errorMsg: login.err, code: 1});
          } else {
              //console.log(login);
              resp.redirect('dashboard');
          }
       });
});

app.post("/changepassword", (req, resp) => {
    const body = req.body;
    Auth.SendPasswordResetEmail(body.email)
        .then((data) => {
            if (data) {
                resp.render('index', {errorMsg: data.err, code: 3});
            } else {
                resp.render('index', {message: 'Email enviado com sucesso!', code: 4});
            }
        });
});

app.listen(3000);