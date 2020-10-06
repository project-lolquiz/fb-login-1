const firebase = require('firebase');

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports.SignInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            console.log(error);
            let errorCode = error.code;
            let errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                return {err: 'Wrong password'};
            } else {
                return {err: errorMessage};
            }
            return {err: error};
        });
};

module.exports.SignUpWithEmailAndPassword = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
         return JSON.stringify(user);
      }).catch(function(error) {
          let errorCode = error.code;
          let errorMessage = error.message;
          if (errorCode === 'auth/weak-password') {
              return {err: 'The password is too weak'};
          } else {
              return {err: errorMessage};
          }
          return {err: error};
      });
};

return module.exports;