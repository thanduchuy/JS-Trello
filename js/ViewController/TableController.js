let timeout = null;
let idTable = new URL(location.href).searchParams.get("id");

function addTaskWork() {
  addTableData().then((id) => {
    addNewTaskHTML(id, null);
  });
}

function addNewItemOfTask(id) {
  let container = document.getElementById(`kanban-drag-${id}`);
  addTaskItemData(id).then((data) => {
    container.insertAdjacentHTML(
      "beforeend",
      `<form class="itemform not-draggable">
  <div class="form-group">
    <textarea
      id="area-item-${data}"
      class="form-control add-new-item"
      rows="2"
      autofocus=""
      required=""
    ></textarea>
  </div>
  <div class="form-group">
    <button type="button" class="btn btn-primary btn-sm mr-50" onclick="changeContentItem('${data}', '${id}')">
      Submit</button
    ><button type="button" id="CancelBtn" class="btn btn-sm btn-danger" onclick="resetContentItem('${data}')">
      Cancel
    </button>
  </div>
</form>`
    );
  });
}

function changeContentItem(id, idTask) {
  setItemData(id, document.getElementById(`area-item-${id}`).value, idTask);
}

function resetContentItem(id) {
  document.getElementById(`area-item-${id}`).value = "";
}

function changeTitleTask(task) {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    setTableData(task.getAttribute("idTask"), task.value);
  }, 1000);
}

function addNewTaskHTML(id, title) {
  let container = document.getElementsByClassName("kanban-container")[0];
  let titleTask = title == null ? "Title Task" : title;
  container.insertAdjacentHTML(
    "beforeend",
    `<div
  data-id="kanban-${id}"
  data-order="4"
  class="kanban-board"
  style="width: 250px; margin-left: 15px; margin-right: 15px"
>
  <header class="kanban-board-header">
  <input
  type="text"
  class="form-control"
  id="email"
  value= "${titleTask}"
  idTask = "${id}"
  onkeyup="changeTitleTask(this)"
/>
    <button class="kanban-title-button btn btn-default btn-xs" onclick="addNewItemOfTask('${id}')">
      + Add New Item
    </button>
    <div class="dropdown">
      <div
        class="dropdown-toggle cursor-pointer"
        role="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i class="feather icon-more-vertical"></i>
      </div>
      <div
        class="dropdown-menu dropdown-menu-right"
        aria-labelledby="dropdownMenuButton"
      >
        <a class="dropdown-item kanban-delete" id="kanban-delete" onclick="deleteTask('${id}')"
          ><i class="feather icon-trash-2 mr-50"></i>Delete</a
        >
      </div>
    </div>
  </header>
  <main class="kanban-drag" id="kanban-drag-${id}"></main>
  <footer></footer>
</div>`
  );
}

function addTableData() {
  return new Promise((resolve, reject) => {
    db.collection("Tasks")
      .add({
        id: idTable,
        title: "Title Task",
      })
      .then(function (data) {
        resolve(data.id);
      })
      .catch(function (error) {
        alert(error.message);
      });
  });
}

function setTableData(id, newTitle) {
  db.collection("Tasks")
    .doc(id)
    .set({
      id: idTable,
      title: newTitle,
    })
    .catch(function (error) {
      alert(error.message);
    });
}

function addTaskItemData(id) {
  return new Promise((resolve, reject) => {
    db.collection("Items")
      .add({
        idTask: id,
        idTable: idTable,
        content: "",
      })
      .then(function (data) {
        resolve(data.id);
      })
      .catch(function (error) {
        alert(error.message);
      });
  });
}

function setItemData(id, newContent, idTask) {
  db.collection("Items")
    .doc(id)
    .set({
      idTask: idTask,
      idTable: idTable,
      content: newContent,
    })
    .catch(function (error) {
      alert(error.message);
    });
}

loadData();

function loadData() {
  getListTaskOfTable().then((tasks) => {
    getItemsOfTable().then((items) => {
      tasks.forEach((item) => {
        addNewTaskHTML(item.idTask, item.title);
      });
      items.forEach((item) => {
        loadItemOFTask(item);
      });
    });
  });
}

function loadItemOFTask(data) {
  let container = document.getElementById(`kanban-drag-${data.idTask}`);
  if (container != null) {
    container.insertAdjacentHTML(
      "beforeend",
      `<form class="itemform not-draggable" idItem='${data.idItem}'>
  <div class="form-group">
    <textarea
      id="area-item-${data.idItem}"
      class="form-control add-new-item"
      rows="2"
      autofocus=""
      required=""
    >${data.content}</textarea>
  </div>
  <div class="form-group">
    <button type="button" class="btn btn-primary btn-sm mr-50" onclick="changeContentItem('${data.idItem}', '${data.idTask}')">
      Submit</button
    ><button type="button" id="CancelBtn" class="btn btn-sm btn-danger" onclick="resetContentItem('${data.idItem}')">
      Cancel
    </button>
  </div>
  </form>`
    );
  }
}

function getListTaskOfTable() {
  return new Promise((resolve, reject) => {
    db.collection("Tasks")
      .where("id", "==", idTable)
      .get()
      .then((querySnapshot) => {
        let result = [];
        querySnapshot.forEach((doc) => {
          let object = doc.data();
          object.idTask = doc.id;
          result.push(object);
        });
        resolve(result);
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

function getItemsOfTable() {
  return new Promise((resolve, reject) => {
    db.collection("Items")
      .where("idTable", "==", idTable)
      .get()
      .then((querySnapshot) => {
        let result = [];
        querySnapshot.forEach((doc) => {
          let object = doc.data();
          object.idItem = doc.id;
          result.push(object);
        });
        resolve(result);
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

function deleteTask(id) {
  let container = document.getElementById(`kanban-drag-${id}`);
  let itemOfTask = Array.from(container.children).map((item) => {
    return item.getAttribute("idItem");
  });
  let itemDeleteLast = itemOfTask[itemOfTask.length - 1];
  itemOfTask.forEach((element) => {
    deleteDocFromCollection("Items", element).then((data) => {
      if (data == itemDeleteLast) {
        deleteDocFromCollection("Tasks", id).then((res) => {
          location.reload();
        });
      }
    });
  });
}

function deleteDocFromCollection(nameCollection, id) {
  return new Promise((resolve, reject) => {
    db.collection(nameCollection)
      .doc(id)
      .delete()
      .then(function () {
        resolve(id);
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  });
}
