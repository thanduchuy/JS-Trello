let nameTable = "";
let table = null;
let email = sessionStorage.getItem("Email");
getTableOfUser();

function getDocFromCollection(nameCollection, id) {
  return new Promise((resolve, reject) => {
    var ref = db.collection(nameCollection).doc(id);
    ref
      .get()
      .then(function (doc) {
        if (doc.exists) {
          resolve(doc.data());
        } else {
          reject("No such document!");
        }
      })
      .catch(function (error) {
        reject("Error getting document:", error);
      });
  });
}

function addTableTask() {
  addTableData(addTable.title.value, email);
}

function addTableData(title, email) {
  db.collection("Tables")
    .doc()
    .set({
      name: nameTable,
      users: [email],
      title: title,
    })
    .then(function (data) {
      location.reload();
    })
    .catch(function (error) {
      alert(error.message);
    });
}

function getNameTable(table) {
  nameTable = table.getAttribute("data-table-type");
}

function getTableOfUser() {
  getAllDocFromCollection("Tables").then((data) => {
    table = data.filter((element) => element.users.includes(email));
    document.getElementById("listTable").innerHTML =
      mapTablesToHtml(table) + document.getElementById("listTable").innerHTML;
  });
}

function mapTablesToHtml(data) {
  return data
    .map((element) => {
      return `
      <div class="col-xl-3 col-sm-6 col-12">
        <div class="card">
          <div class="card-content">
            <div class="card-body">
              <div class="media d-flex">
                <div class="media-body text-left">
                  <h3 class="primary"><a href="table.html?id=${element.id}">${element.title}</a></h3>
                </div>
                <div class="align-self-center">
                  <a href="member.html?id=${element.id}"><i class="icon-list primary font-large-2 float-right"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    })
    .join("");
}

function getAllDocFromCollection(nameCollection) {
  return new Promise((resolve, reject) => {
    db.collection(nameCollection)
      .get()
      .then(function (querySnapshot) {
        let result = [];
        querySnapshot.forEach(function (doc) {
          let data = doc.data();
          data.id = doc.id;
          result.push(data);
        });
        resolve(result);
      });
  });
}
