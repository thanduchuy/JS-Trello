if (sessionStorage.getItem("UserLoged") == null) {
  document.location.href = "http://127.0.0.1:5500/login.html";
}

var file = "";
var isSelectedFile = false;

function onLoadPage() {
  getDocFromCollection("Profile", sessionStorage.getItem("UserLoged"));
  const fileInput = document.getElementById("account-upload");
  fileInput.onchange = () => {
    const selectedFile = fileInput.files[0];
    document.getElementById("profile-image").src =
      URL.createObjectURL(selectedFile);
    isSelectedFile = true;
    file = selectedFile;
  };
}

function tapBtnSaveProfile() {
  let name = profile.name.value;
  let email = profile.email.value;
  let company = profile.company.value;
  let avatar = document.getElementById("profile-image").src;
  if (isSelectedFile && file != "") {
    var storageRef = storage.ref(file.name);
    storageRef.put(file).then(function () {
      storageRef.getDownloadURL().then(function (url) {
        setProfileUser(sessionStorage.getItem("UserLoged"), {
          name: name,
          email: email,
          avatar: url,
          company: company,
        });
      });
    });
  } else {
    setProfileUser(sessionStorage.getItem("UserLoged"), {
      name: name,
      email: email,
      avatar: avatar,
      company: company,
    });
  }
}

function tapBtnResetProfile() {
  getDocFromCollection("Profile", sessionStorage.getItem("UserLoged"));
}

function getDocFromCollection(nameCollection, id) {
  var ref = db.collection(nameCollection).doc(id);
  ref
    .get()
    .then(function (doc) {
      if (doc.exists) {
        profile.name.value = doc.data().name;
        profile.email.value = doc.data().email;
        profile.company.value = doc.data().company;
        if (doc.data().avatar != "") {
          file = doc.data().avatar;
          document.getElementById("profile-image").src = file;
        }
      } else {
        console.log("No such document!");
      }
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });
}

function resetImageProfile() {
  document.getElementById("profile-image").src = "/images/avatar-s-18.png";
}

function setProfileUser(id, user) {
  db.collection("Profile")
    .doc(id)
    .set({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      company: user.company,
      id: id,
    })
    .then(function () {
      alert("Bạn đã cập nhật thành công");
      getDocFromCollection("Profile", sessionStorage.getItem("UserLoged"));
    })
    .catch(function (error) {
      alert(error.message);
    });
}

function tapBtnChangePassword() {
  changePasswordUser(changePassword.password.value);
}

function tapCancelChangePassword() {
  changePassword.newPass.value = "";
  changePassword.reNewPass.value = "";
}

function changePasswordUser(newPassword) {
  var user = firebase.auth().currentUser;

  user
    .updatePassword(newPassword)
    .then(function () {
      alert("Bạn đã thay đổi pass thành công");
    })
    .catch(function (error) {
      alert(error.message);
    });
}
