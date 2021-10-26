function tapBtnLogin() {
  let email = form.email.value;
  let pass = form.password.value;
  if (email != "" && pass != "") {
    loginUser(email, pass);
  } else {
    alert("Không được bỏ trống trường nào !!!");
  }
}

function loginUser(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      sessionStorage.setItem("UserLoged", user.user.uid);
      sessionStorage.setItem("Email", email);
      document.location.href = "http://127.0.0.1:5500/index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}
