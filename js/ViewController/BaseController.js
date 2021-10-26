getDocFromCollection("Profile", sessionStorage.getItem("UserLoged")).then(
  (data) => {
    let dropdownUser = document.getElementsByClassName("dropdown-user")[0];
    dropdownUser.children[1].children[4].addEventListener("click", function () {
      sessionStorage.clear();
    });
    dropdownUser.children[0].children[0].children[0].src = data.avatar;
    document.getElementsByClassName("user-name")[0].innerHTML = data.name;
  }
);

getAllDocFromCollection("Tables").then((data) => {
  let container =
    document.getElementsByClassName("main-menu")[0].children[0].children[0];
  container.innerHTML += mapTableToHTML(
    data.filter((element) =>
      element.users.includes(sessionStorage.getItem("Email"))
    )
  );
  container.innerHTML += `
  <li class=" navigation-header"><span>Các Trang</span><i class=" feather icon-minus" data-toggle="tooltip" data-placement="right" data-original-title="Pages"></i>
  </li>
    <li class=" nav-item"><a href="calendar.html"><i class="feather icon-plus-square"></i><span class="menu-title" data-i18n="Calender">Calender</span></a>
    </li>
  `;
});

function mapTableToHTML(data) {
  return data
    .map((element) => {
      return `
      <li class=" nav-item has-sub open"><a href=""><i class="feather icon-users"></i><span class="menu-title" data-i18n="Contacts">${element.title}</span></a>
      <ul class="menu-content"> 
        <li><a class="menu-item" href="table.html?id=${element.id}" data-i18n="Page Layouts">Bảng</a>
        </li>
        <li><a class="menu-item" href="member.html?id=${element.id}" data-i18n="Page Layouts">Thành viên</a>
        </li>
        <li><a class="menu-item" href="todo.html?id=${element.id}" data-i18n="Page Layouts">Việc cần làm</a>
        </li>
      </ul>
    </li> 
      `;
    })
    .join("");
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
          reject("No such document!");
        }
      })
      .catch(function (error) {
        reject("Error getting document:", error);
      });
  });
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
