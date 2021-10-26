let idTable = new URL(location.href).searchParams.get("id");
let table = null;
let users = [];
let todoList = [];
let idUpdate = "";
getDocFromCollection("Tables", idTable).then((data) => {
  table = data;
  data.users.forEach((element) => {
    getProfileOfUser(element).then((response) => {
      users.push(response);
      convertUserToSelectOption(response);
    });
  });
});

getToDoOfTable(idTable).then((data) => {
  todoList = data;
  data.forEach((element) => {
    addTodoHtml(element);
  });
});

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

function getToDoOfTable(idTable) {
  return new Promise((resolve, reject) => {
    db.collection("ToDo")
      .where("idTable", "==", idTable)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          reject("not found");
        }
        let result = [];
        querySnapshot.forEach((doc) => {
          let object = doc.data();
          object.idItem = doc.id;
          result.push(object);
        });
        resolve(result);
      })
      .catch((error) => {
        console.log(error.message);
        alert(error.message);
      });
  });
}

function convertUserToSelectOption(data) {
  if (data.email == sessionStorage.getItem("Email")) {
    document.getElementsByClassName("avatar-user-image")[0].src = data.avatar;
  }
  document.getElementById(
    "select2-users-name"
  ).innerHTML += `<option value="${data.name}">${data.name}</option>`;
}

function addTodoTable() {
  let title = toDo.title.value;
  let selectAssign = toDo.selectAssign.value;
  let datePicker = toDo.datePicker.value;
  setToDOUSER(
    title,
    datePicker,
    users.filter((element) => {
      return element.name == selectAssign;
    })[0]
  ).then((res) => {
    addTodoHtml(res);
  });
}

function setToDOUSER(title, datePicker, user) {
  return new Promise((resolve, reject) => {
    db.collection("ToDo")
      .add({
        idTable: idTable,
        title: title,
        datePicker: datePicker,
        user: user,
      })
      .then(function (doc) {
        let object = doc.data();
        object.idItem = doc.id;
        resolve(object);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  });
}

function updateToDO(title, datePicker, user) {
  return new Promise((resolve, reject) => {
    db.collection("ToDo")
      .doc(idUpdate)
      .set({
        idTable: idTable,
        title: title,
        datePicker: datePicker,
        user: user,
      })
      .then(function () {
        resolve("success");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  });
}

function getIdOfItem(element) {
  idUpdate = element.id;
}

function addTodoHtml(data) {
  let container = document.getElementById("todo-task-list-drag");
  container.insertAdjacentHTML(
    "beforeend",
    `<li class="todo-item" data-name="${data.user.name}" id="${data.idItem}" onclick="getIdOfItem(this)">
                        <div
                          class="
                            todo-title-wrapper
                            d-flex
                            justify-content-sm-between justify-content-end
                            align-items-center
                          "
                        >
                          <div class="todo-title-area d-flex">
                            <i class="feather icon-more-vertical handle"></i>
                            <div class="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                id="checkbox1"
                              />
                              <label
                                class="custom-control-label"
                                for="checkbox1"
                              ></label>
                            </div>
                            <p class="todo-title mx-50 m-0 truncate">
                              ${data.title}
                            </p>
                          </div>
                          <div
                            class="todo-item-action d-flex align-items-center"
                          >
                            <div class="todo-badge-wrapper d-flex">
                              <span class="badge badge-primary badge-pill"
                                >Frontend</span
                              >
                            </div>
                            <div class="avatar ml-1">
                              <img
                                src="${data.user.avatar}"
                                alt="avatar"
                                height="30"
                                width="30"
                              />
                            </div>
                            <a class="todo-item-favorite ml-75"
                              ><i class="feather icon-star"></i
                            ></a>
                            <a class="todo-item-delete ml-75"
                              ><i class="feather icon-trash-2"></i
                            ></a>
                          </div>
                        </div>
                      </li>`
  );
}

function updateDataToDo() {
  let title = toDo.title.value;
  let selectAssign = toDo.selectAssign.value;
  let datePicker = toDo.datePicker.value;
  updateToDO(
    title,
    datePicker,
    users.filter((element) => {
      return element.name == selectAssign;
    })[0]
  ).then((res) => {
    location.reload();
  });
}
