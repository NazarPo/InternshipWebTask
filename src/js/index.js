const clientsUrl = 'http://localhost:4000/clients';

window.onload = init;

function init(){
    changeActive();

    fetch(clientsUrl)
        .then(res => res.json())
        .then(renderClients);

    let addClientForm = document.getElementById('add-client-form');
    addClientForm.addEventListener('submit', (e) => {
       e.preventDefault();
       createClient()
           .then(closeAddForm)
           .then(loadClients)
           .then(renderClients)
    });
}
function renderClients(clients) {
    let template = document.getElementById('client-template');
    let clientElement = template.content.querySelector('.client');
    let clientsTableBody = document.getElementById('clients-body');
    clientsTableBody.innerHTML = "";

    for(let client of clients){
        let clientClone = clientElement.cloneNode(true);
        updateClientElement(clientClone, client);
        clientsTableBody.appendChild(clientClone);
    }
}

function createClient(){
    let client = {};
    let form = document.getElementById('add-client-form');
    client.firstname = form.firstname.value;
    client.lastname = form.lastname.value;
    client.orderDate = new Date().toUTCString();

    return fetch(clientsUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(client)
    });
}

function loadClients(){
    return fetch(clientsUrl)
        .then(res => res.json());
}


function updateClientElement(element, client) {
    element.querySelector('.firstname').innerHTML = client.firstname;
    element.querySelector('.lastname').innerHTML = client.lastname;
    element.querySelector('.order-date').innerHTML = client.orderDate;
}

function clickClientRow(){
   cleanContainer();
}

function cleanContainer(){
    let container = document.getElementById('container');
    container.innerHTML = "";
}


function openAddForm(){
    document.getElementById("add-client-div").style.display = "block";
    document.getElementById("container").style.display = "none";
}

function closeAddForm(){
    document.getElementById("add-client-div").style.display = "none";
    document.getElementById("container").style.display = "block";
}

function changeActive() {
   let navUl = document.getElementById("nav-ul");
   let lis = navUl.getElementsByTagName("li");
   for(let i = 0; i < lis.length; i++) {
       lis[i].addEventListener("click", function() {
           let current = document.getElementsByClassName("active");
           current[0].className = current[0].className.replace("active", "");
           this.className += "active";
       })
   }
}