const clientsUrl = 'http://localhost:4000/clients';
const servicesUrl = 'http://localhost:4000/services';

window.onload = init;

function init(){
    changeActive();
    renderHomePage();
    getAvailableServices();

    let addClientForm = document.getElementById('add-client-form');
    addClientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        createClient()
            .then(loadClients)
            .then(renderClients)
    });

    let addServiceForm = document.getElementById('add-service-form');
    addServiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let clientId =  document.getElementById('add-service-form').getElementsByTagName('BUTTON')[0].id;
        getClientFromDB()
            .then(addServiceToClient)
            .then(getClientFromDB)
            .then(renderClientPage)
    })
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

function createClient() {
    let client = {};
    let form = document.getElementById('add-client-form');
    client.firstname = form.firstname.value;
    client.lastname = form.lastname.value;
    client.orderDate = new Date().toUTCString();
    client.services = [];

    return addClientToDB(client);
}

function addClientToDB(client){
    return fetch(clientsUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(client)
    })
}

function getClientFromDB() {
    let clientId =  document.getElementById('add-service-form').getElementsByTagName('BUTTON')[0].id;
    return fetch(clientsUrl + "/" + clientId)
        .then(res => res.json())
}

function getServiceFromDB() {
    let select = document.getElementById('inlineFormCustomSelectPref');
    return fetch(servicesUrl + "/" + select.value)
        .then(res => res.json())
}

function addServiceToClient(client) {
    return getServiceFromDB()
        .then(service => pushService(client, service))
}

function pushService(client, service) {
    if(!isArrayContains(client.services, service))
        client.services.push(service);
    let clientId =  document.getElementById('add-service-form').getElementsByTagName('BUTTON')[0].id;
    return fetch(clientsUrl + "/" + clientId, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(client)
    })
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
    document.getElementById("services-container").style.display = "block";
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

    document.getElementById('add-service-form').getElementsByTagName('BUTTON')[0].setAttribute("id", elem.children[0].textContent);
    let clientId= document.getElementById('add-service-form').getElementsByTagName('BUTTON')[0].id;
    fetch(clientsUrl + "/" + clientId)
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

/*Get services from JSON server*/
function getAvailableServices() {
    fetch(servicesUrl)
        .then(res => res.json())
        .then(setSelectOptionsByServices)
}

function setSelectOptionsByServices(services){
    let select = document.getElementById('inlineFormCustomSelectPref');
    for(let service of services){
        let option = document.createElement("OPTION");
        option.setAttribute("value", service.id);
        option.innerText = service.name;
        select.appendChild(option);
    }
    select.children[0].setAttribute("selected", "selected");
}

function isArrayContains(array, elem) {
   for(let i = 0; i < array.length; i++) {
       if (array[i].id === elem.id)
           return true;
   }
    return false;
}