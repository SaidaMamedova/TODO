//We call what we need from the html side
const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const clear = document.querySelector("#clearButton");
const ul = document.querySelector(".list-group");
const filterInput = document.querySelector("#filtering");

//Global key to add to storage
let todos = [];

runEvents();
function runEvents() {
    //if submit is clicked
    form.addEventListener("submit", addTodo);
    //if the page is loaded
    document.addEventListener("DOMContentLoaded", pageLoaded);
    ul.addEventListener("click", removeTodoFromUI);
    clear.addEventListener("click", deleteAllTodosFromBoth);
    filterInput.addEventListener("keyup", filtering);

}
function pageLoaded() {
    checkTodosOnStorage();
    todos.forEach(function (todo) {
        addTodoToUI(todo)
        console.log(todo)
    })
}

function addTodo(e) {
    e.preventDefault();
    const InputValue = addInput.value.trim()
    if (InputValue == null || InputValue == "") {
        createAlert("warning", "No todo entered!");
    }
    else {
        //calling functions
        addTodoToUI(InputValue);
        addTodoToStorage(InputValue);
        createAlert("success", "Added successfully!");
    }
}

function addTodoToUI(newTodo) {
    /*
        <li class="list-group-item d-flex justify-content-between">todo 1
                                        <a href="#" >
                                        <i class="fa fa-remove"></i>
                                        </a>
                                    </li>
    */
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between"
    li.textContent = newTodo;

    const a = document.createElement("a");
    a.href = "#";

    const i = document.createElement("i");
    i.className = "fa fa-remove";


    a.appendChild(i);
    li.appendChild(a);
    ul.appendChild(li);

    addInput.value = "";
}

function addTodoToStorage(newTodo) {
    checkTodosOnStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}
function checkTodosOnStorage() {
    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
}
function createAlert(type, message) {
    // <div class="alert alert-success mt-3" role="alert">
    //                     Your todo has successfully added!
    //                   </div> 
    const div = document.createElement("div");
    div.className = "alert alert-" + type;
    div.role = "alert";
    div.textContent = message;
    firstCardBody.appendChild(div);

    setTimeout(function () {
        div.remove();
    }, 1500);
}
function removeTodoFromUI(e) {
    if (e.target.className === "fa fa-remove") {
        const todo = e.target.parentElement.parentElement;
        todo.remove();
        todoName = todo.textContent;
        createAlert("success", "todo successfully deleted!")
    }
    removeTodoFromStorage(todoName);
}
function removeTodoFromStorage(todoName) {
    todos.forEach(function (todo, index) {
        if (todo === todoName) {
            //splice is used to delete
            todos.splice(index, 1);
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos))
}
//function to keep all the 'todos' on the screen up to date, then call it wherever we want
function getAllTodos() {
    return document.querySelectorAll(".list-group-item")
}
//clear todos both ui and storage
function deleteAllTodosFromBoth() {
    if (getAllTodos().length > 0) {
        //delete from UI
        getAllTodos().forEach(function (todo) {
            todo.remove();
        })
        //delete from storage
        todos = [];
        localStorage.setItem("todos", JSON.stringify(todos));
        //just alert
        createAlert("success", "All todos have successfully deleted!");

    }
    else {
        createAlert("warning", "For deleting there should be at least one to do!")
    }
}
//searching through todos
function filtering(e) {
    const inputValue = e.target.value.toLowerCase().trim();
    if (getAllTodos().length > 0) {
        getAllTodos().forEach(function (todo) {
            if (todo.textContent.toLowerCase().includes(inputValue)) {
                todo.setAttribute("style", "display: block")
            }
            else {
                todo.setAttribute("style", "display: none !important")
            }
        });
    }
    else {
        createAlert("warning", "You should have at least one todo for filtering!")
    }
}

