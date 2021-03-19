const addButton = document.getElementById("add");
let id = 1;

//onload show actual to do list
window.addEventListener('DOMContentLoaded', (event) => {
    
    showFullToDoList();

});

addButton.addEventListener('click', function(e) {

    //take user's input, and date
    const input = document.getElementById('input').value;
    const date = new Date();
    const whenAdded = date.getUTCDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();

    if(input != "") {

      //make POST req
        fetch('http://localhost:3000/todos', {
            method: 'POST',
            body: JSON.stringify({
                'what': input, 
                'whenAdded': whenAdded,
                'completed': "false"
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })  //after req, show updated list
            .then(() => showFullToDoList());
        //e.preventDefault();  

    }

    

})

async function showFullToDoList() {

    const toDos = await getToDos();
    //console.log(toDos);

    //Get list and remove the waste
    const list = document.getElementById("list");
    list.innerHTML = null;

    //there comes all items and append it
    const items = createToDoList(toDos);
    list.appendChild(items);

}

//create the list
function createToDoList(toDos) {

    const listFragment = document.createDocumentFragment();

    toDos.forEach(todo => {

        const li = document.createElement('li');
        const what = document.createElement('p');
        const whenAdded = document.createElement('p');
        const checkIcon = document.createElement('i');
        const trashIcon = document.createElement('i');
        const editIcon = document.createElement('i');

        li.setAttribute("id", id);

        what.innerHTML = todo.what
        what.classList.add("what");
        console.log(what);

        whenAdded.innerHTML = todo.whenAdded;
        whenAdded.classList.add("whenAdded");

        checkIcon.classList.add('fas');
        checkIcon.classList.add('fa-check-double');
        checkIcon.setAttribute("onclick", "completeTask(event)");

        trashIcon.classList.add('fas');
        trashIcon.classList.add('fa-trash-alt');
        trashIcon.setAttribute("onclick", "deleteItem(event)");

        editIcon.classList.add('fas');
        editIcon.classList.add('fa-edit');
        editIcon.setAttribute("onclick", "editItem(event)");

        li.appendChild(what);
        li.appendChild(whenAdded);
        li.appendChild(checkIcon);
        li.appendChild(trashIcon);
        li.appendChild(editIcon);

        listFragment.appendChild(li);

        id++;

    });

    return listFragment;

}

//Get list from db
function getToDos() {

    return fetch('http://localhost:3000/todos', {method: 'GET'})
        .then(Response => Response.json());

}

//Complete task
async function completeTask(event) {

    const clickedObject = event.target.parentNode;
    //console.log(clickedObject);
    const childNodes = clickedObject.childNodes;    
    //console.log(childNodes[0].innerHTML);
    //console.log(childNodes[1].innerHTML);
    const clickedId = clickedObject.getAttribute("id");
    const task = childNodes[0];
    //console.log(task);
    let fetchedTask = await getOneTask(clickedId);
    //console.log(fetchedTask.completed);
    if (fetchedTask.completed == "false") {

        fetch("http://localhost:3000/todos/" + clickedId, {

                method: "PATCH",
                body: JSON.stringify({
                    completed: "true"
                }),
                headers: {
                    "Content-type": "application/json"
                }

        });
        task.style.opacity = ".6";

    } else {

        fetch("http://localhost:3000/todos/" + clickedId, {

            method: "PATCH",
            body: JSON.stringify({
                completed: "false"
            }),
            headers: {
                "Content-type": "application/json"
            }

    });
    task.style.opacity = "1";

    }
    

}

function getOneTask(clickedId) {

    return fetch("http://localhost:3000/todos/" + clickedId, {method: "GET"})
            .then(Response => Response.json());

}

//Edit item
function editItem(event) {

    const clickedObject = event.target.parentNode;
    //console.log(clickedObject);
    const childNodes = clickedObject.childNodes;    
    //console.log(childNodes[0].innerHTML);
    //console.log(childNodes[1].innerHTML);

    const clickedId = clickedObject.getAttribute("id");
    console.log(clickedId);

    const input = document.getElementById("input");
    input.value = childNodes[0].innerHTML;

    const date = new Date();
    const whenAdded = date.getUTCDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();

    document.getElementById("edit").addEventListener("click", function(e) {
        
        //e.preventDefault();
        console.log(clickedId);

        if(input.value != "") {

            fetch("http://localhost:3000/todos/" + clickedId, {

                method: 'PATCH',
                body: JSON.stringify({
                    what: input.value,
                    whenAdded: whenAdded
                }), 
                headers: {
                    "Content-type": "application/json"
                }

            })
                .then(Response => Response.json());

        }
            
    });

}

//Delete item
function deleteItem(event) {

    //console.log(event.target.parentNode.nodeName);

    const clickedObject = event.target.parentNode;
    //console.log(clickedObject);
    //clickedObject.style.display = "none";
    clickedObject.style.display = "none";
    const clickedId = clickedObject.getAttribute("id");
    console.log(clickedId);

    deleteFetch(clickedId);

}

function deleteFetch(clickedId) {

    fetch("http://localhost:3000/todos/" + clickedId, {
        method: "DELETE"
    });

}