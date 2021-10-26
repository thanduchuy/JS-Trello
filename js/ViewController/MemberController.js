let idTable = new URL(location.href).searchParams.get("id");
let table = null;
getDocFromCollection("Tables", idTable).then((data) => {
  table = data;
  document.getElementById("listUser").innerHTML = "";
  data.users.forEach((element) => {
    getProfileOfUser(element).then((response) => {
      addHTMLTableUser(response);
    });
  });
});

function addHTMLTableUser(data) {
  let container = document.getElementById("listUser");
  container.insertAdjacentHTML(
    "beforeend",
    `  <tr>
  <td>
    <input type="checkbox" class="input-chk check" />
  </td>
  <td>
    <div class="media">
      <div class="media-left pr-1">
        <span
          class="
            avatar avatar-sm avatar-online
            rounded-circle
          "
          ><img
            src="${data.avatar}"
            alt="avatar" /><i></i
        ></span>
      </div>
      <div class="media-body media-middle">
        <a class="media-heading name"
          >${data.name}</a
        >
      </div>
    </div>
  </td>
  <td class="text-center">
    <a class="email" href="mailto:email@example.com"
      >${data.email}</a
    >
  </td>
  <td class="text-center">
    <div class="favorite active">
      <i class="feather icon-star"></i>
    </div>
  </td>
  <td>
    <a class="danger delete mr-1"
    onclick="deleteUser('${data.email}')"
      ><i class="fa fa-trash-o"></i
    ></a>
  </td>
</tr>`
  );
}

function deleteUser(email) {
  let index = table.users.indexOf(email);
  table.users.splice(index, 1);
  updateTableData(table);
}

function getDocFromCollection(nameCollection, id) {
  return new Promise((resolve, reject) => {
    var ref = db.collection(nameCollection).doc(id);
    ref
      .get()
      .then(function (doc) {
        if (doc.exists) {
          resolve(doc.data());
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  });
}

function getProfileOfUser(email) {
  return new Promise((resolve, reject) => {
    db.collection("Profile")
      .where("email", "==", email)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          reject("not found");
        }
        querySnapshot.forEach((doc) => {
          let object = doc.data();
          object.idItem = doc.id;
          resolve(object);
        });
      })
      .catch((error) => {
        console.log(error.message);
        alert(error.message);
      });
  });
}

function addNewMember() {
  getProfileOfUser(addMember.email.value)
    .then((data) => {
      if (table.users.includes(data.email)) {
        alert("User này đã đc thêm vào rồi");
      } else {
        table.users.push(data.email);
        updateTableData(table);
      }
    })
    .catch((error) => {
      alert("Không tìm thấy user nào với email trên");
    });
}

function updateTableData(table) {
  db.collection("Tables")
    .doc(idTable)
    .set({
      name: table.name,
      users: table.users,
      title: table.title,
    })
    .then(function () {
      location.reload();
    })
    .catch(function (error) {
      alert(error.message);
    });
}
