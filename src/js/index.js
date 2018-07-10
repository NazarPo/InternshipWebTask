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

function loadClients(){
    return fetch(clientsUrl)
        .then(res => res.json());
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

function renderClientPage(client) {
    let template = document.getElementById('client-services-template');
    let clientServicesElement = template.content.querySelector('.client-services');
    let clientServicesTableBody = document.getElementById('client-services-body');
    clientServicesTableBody.innerHTML = "";

    let container = document.getElementById("client-container");
    let clientInfo = client.firstname + " " + client.lastname;
    container.children[0].getElementsByTagName("span")[0].innerHTML = clientInfo;

    for(let service of client.services) {
        let clientServicesClone = clientServicesElement.cloneNode(true);
        updateClientServiceElement(clientServicesClone, service);
        clientServicesTableBody.appendChild(clientServicesClone);
    }
}

/*Update functions*/
function updateClientElement(element, client) {
    element.querySelector('.id').innerHTML = client.id;
    element.querySelector('.firstname').innerHTML = client.firstname;
    element.querySelector('.lastname').innerHTML = client.lastname;
    element.querySelector('.order-date').innerHTML = client.orderDate;
}

function updateClientServiceElement(element, service){
    element.querySelector('.name').innerHTML = service.name;
    element.querySelector('.category').innerHTML = service.category;
    element.querySelector('.price').innerHTML = service.price.toLocaleString() + " $";
}

/*Render functions*/
function renderHomePage() {
    clearAllDivs();
    document.getElementById("home-container").style.display = "block";
}

function renderServicesPage() {
    clearAllDivs();
}

function renderJournalPage() {
    clearAllDivs();
    document.getElementById("journal-container").style.display = "block";
    fetch(clientsUrl)
        .then(res => res.json())
        .then(renderClients);
}

function clickClientRow(elem){
    clearAllDivs();
    document.getElementById("client-container").style.display = "block";
    fetch(clientsUrl + "/" + elem.children[0].textContent)
        .then(res => res.json())
        .then(renderClientPage)
}


/*Additional functions*/
function clearAllDivs() {
    let divs = document.body.children;
    for(let i = 0; i < divs.length; i++){
        if(divs[i] instanceof HTMLDivElement)
            divs[i].style.display = "none";
    }
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
    let navList = document.getElementById("nav-list");
    let links = navList.getElementsByTagName("a");
    for(let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function() {
            let current = document.getElementsByClassName(" active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        })
    }
}