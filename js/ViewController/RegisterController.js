if (sessionStorage.getItem("UserLoged") != null) {
  document.location.href = "http://127.0.0.1:5500/index.html";
}

function tapBtnRegister() {
  let name = form.name.value;
  let email = form.email.value;
  let pass = form.password.value;
  if (name != "" && email != "" && pass != "") {
    registerUser(email, pass, name);
  } else {
    alert("Không được bỏ trống trường nào !!!");
  }
}

function registerUser(email, password, name) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      console.log(user);
      addProfileUser(user.user.uid, email, name);
    })
    .catch((error) => {
      console.log(error);
    });
}

function addProfileUser(id, email, name) {
  db.collection("Profile")
    .doc(id)
    .set({
      id: id,
      name: name,
      avatar: "",
      email: email,
      company: "",
    })
    .then(function () {
      sessionStorage.setItem("UserLoged", id);
      sessionStorage.setItem("Email", email);
      document.location.href = "http://127.0.0.1:5500/index.html";
    })
    .catch(function (error) {
      alert(error.message);
    });
}
