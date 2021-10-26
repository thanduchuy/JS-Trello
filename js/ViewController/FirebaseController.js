var firebaseConfig = {
  apiKey: "AIzaSyDjcnrRsjmo3MgIqKvcykl7EPjH5TpejRY",
  authDomain: "quanlycongviec-30321.firebaseapp.com",
  projectId: "quanlycongviec-30321",
  storageBucket: "quanlycongviec-30321.appspot.com",
  messagingSenderId: "463402441776",
  appId: "1:463402441776:web:4bd08f03026b5d3c19a1f5",
  measurementId: "G-VP6LN1X2RS",
};
firebase.initializeApp(firebaseConfig);
// Variable Cloud FireStore
var db = firebase.firestore();
var storage = firebase.storage();

// FIREBASE AUTH
function getUserLogged() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user);
    } else {
      console.log("NAN");
    }
  });
}
function loginUser() {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {})
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}
function logoutUser() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("sucess");
    })
    .catch(function (error) {
      console.log("fail");
    });
}
function changePasswordUser(newPassword) {
  var user = firebase.auth().currentUser;

  user
    .updatePassword(newPassword)
    .then(function () {
      console.log("sucess");
    })
    .catch(function (error) {
      console.log(error);
    });
}
function registerUser(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    });
}
function setProfileUser(id, user) {
  db.collection("Profile")
    .doc(id)
    .set({
      name: user.name,
      phone: user.phone,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      status: user.status,
      address: user.address,
      nation: user.nation,
      city: user.city,
      district: user.district,
      role: "User",
    })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

// get data collection

function getDocFromCollection(nameCollection, id) {
  var ref = db.collection(nameCollection).doc(id);
  ref
    .get()
    .then(function (doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
      } else {
        console.log("No such document!");
      }
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });
}
function getAllDocFromCollection(nameCollection) {
  db.collection(nameCollection)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, " => ", doc.data());
      });
    });
}
function deleteDocFromCollection(nameCollection, id) {
  db.collection(nameCollection)
    .doc(id)
    .delete()
    .then(function () {
      console.log("Document successfully deleted!");
    })
    .catch(function (error) {
      console.error("Error removing document: ", error);
    });
}
