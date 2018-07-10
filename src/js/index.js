const clientsUrl = 'http://localhost:4000/clients';

window.onload = init;

function init(){
    changeActive();
    renderHomePage();
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
    element.querySelector('.id').innerHTML = client.id;
    element.querySelector('.firstname').innerHTML = client.firstname;
    element.querySelector('.lastname').innerHTML = client.lastname;
    element.querySelector('.order-date').innerHTML = client.orderDate;
}

/*Render functions*/
function renderJournalPage(){
    clearAllDivs();
    document.getElementById("journal-container").style.display = "block";
    fetch(clientsUrl)
        .then(res => res.json())
        .then(renderClients);
}

function renderHomePage() {
    clearAllDivs();
    document.getElementById("home-container").style.display = "block";
}

function renderServicesPage() {
    clearAllDivs();
}

function clearAllDivs() {
    let divs = document.body.children;
    console.log(divs);
    for(let i = 0; i < divs.length; i++){
        if(divs[i] instanceof HTMLDivElement)
            divs[i].style.display = "none";
    }
}

function clickClientRow(){
   cleanContainer();
}

function cleanContainer(){
    let container = document.getElementById('journal-container');
    container.innerHTML = "";
}
function openAddForm(){
    clearAllDivs();
    document.getElementById("add-client-div").style.display = "block";
}

function closeAddForm(){
    clearAllDivs();
    document.getElementById("journal-container").style.display = "block";
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