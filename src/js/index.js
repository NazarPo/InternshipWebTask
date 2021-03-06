const clientsUrl = 'http://localhost:4000/clients';
const servicesUrl = 'http://localhost:4000/services';

window.onload = init;

function init(){
    removeErrorClass('validate-service');
    removeErrorClass('validate-client');
    removeErrorClass('validate-edited-service');

    changeActive();
    renderHomePage();
    getAvailableServices();

    let createClientForm = document.getElementById('add-client-form');
    createClientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        removeErrorClass('validate-client');
        if(!validation('validate-client'))
            return;
        createClient()
            .then(loadClients)
            .then(renderClients)
    });

    let createNewServiceForm = document.getElementById('add-new-service-form');
    createNewServiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        removeErrorClass('validate-service');
        if(!validation('validate-service') || !fileInputValidation('service-image', 'add-service-error-container'))
            return;
        createNewService()
            .then(loadServices)
            .then(renderServices)
    });

    let editCurrentServiceForm = document.getElementById('edit-service-form');
    editCurrentServiceForm.addEventListener('submit', (e) => {
       e.preventDefault();
       removeErrorClass('validate-edited-service');
       if(!validation('validate-edited-service') || !fileInputValidation('edited-service-image', 'edit-service-error-container'))
           return;
        editService()
            .then(loadServices)
            .then(renderServices)
    });

    let addServiceForm = document.getElementById('add-service-form');
    addServiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getClientFromDB()
            .then(addServiceToClient)
            .then(getClientFromDB)
            .then(renderClientPage)
    });
}

function loadClients() {
    return fetch(clientsUrl)
        .then(res => res.json());
}

function loadServices() {
    return fetch(servicesUrl)
        .then(res => res.json())
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

function editService() {
    let service ={};
    let form = document.getElementById('edit-service-form');
    service.name = form.name.value;
    service.category = form.category.value;
    service.price = parseInt(form.price.value);
    service.img = 'img/' + form.image.files[0].name;

    let serviceId =  document.getElementById('edit-service-div').querySelector('.add-button').id;

    return fetch(servicesUrl + '/' + serviceId, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(service)
    });
}

function createNewService() {
    let service ={};
    let form = document.getElementById('add-new-service-form');
    service.name = form.name.value;
    service.category = form.category.value;
    service.price = parseInt(form.price.value);
    service.img = 'img/' + form.image.files[0].name;

    return addServiceToDB(service);
}

/*Create functions*/
function createClient() {
    let client = {};
    let form = document.getElementById('add-client-form');
    client.firstname = form.firstname.value;
    client.lastname = form.lastname.value;
    client.orderDate = new Date().toUTCString();
    client.services = [];

    return addClientToDB(client);
}

/*Add to database functions*/
function addClientToDB(client) {
    return fetch(clientsUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(client)
    })
}

function addServiceToDB(service) {
    return fetch(servicesUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(service)
    })
}

/*Get from database functions*/
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

function renderServices(services) {
    let template = document.getElementById('service-template');
    let serviceElement = template.content.querySelector('.col-md-4');
    let servicesContainer = document.getElementById('services-body');
    servicesContainer.innerHTML = "";

    for(let service of services) {
        let serviceClone = serviceElement.cloneNode(true);
        updateServiceElement(serviceClone, service);
        servicesContainer.appendChild(serviceClone);
    }
}

function editServiceBtnClickHandler(button) {
    addServiceBtnClickHandler();
    removeErrorClass('validate-edited-service');

    let serviceId = button.id;
    document.getElementById('edit-service-error-container').innerHTML = "";
    document.getElementById('edit-service-div').querySelector('.add-button').setAttribute('id', button.id);

    fetch(servicesUrl + "/" + serviceId)
        .then(res => res.json())
        .then(setServiceDataToEditForm);
}

function setServiceDataToEditForm(service) {
    let editForm = document.getElementById('edit-service-form');
    editForm.querySelector('.service-name').value = service.name;
    editForm.querySelector('.service-category').value = service.category;
    editForm.querySelector('.service-price').value = service.price;
    editForm.querySelector('.service-img').files[0].src = service.img;
}

function deleteService(button) {
    let serviceId = button.id;
    return fetch(servicesUrl + "/" + serviceId, {
        method: 'DELETE'
    })
        .then(renderServicesPage)
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

function updateServiceElement(element, service) {
    element.querySelector(".name").innerHTML = service.name;
    element.querySelector(".category").innerHTML = service.category;
    element.querySelector(".price").innerHTML = service.price.toLocaleString() + " $";
    element.querySelector(".card-img-top").setAttribute("src", service.img);
    element.querySelector(".delete-service-btn").setAttribute("id", service.id);
    element.querySelector(".edit-service-btn").setAttribute("id", service.id);
}

/*Render functions*/
function renderHomePage() {
    clearAllDivs();
    document.getElementById("home-container").style.display = "block";
}

function renderServicesPage() {
    clearAllDivs();
    document.getElementById("services-container").style.display = "block";
    fetch(servicesUrl)
        .then(res => res.json())
        .then(renderServices);
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

function isNumberKey(event) {
    let charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57));
}

function closeModal() {
    if(validation('validate-client') ||
        (validation('validate-service') && fileInputValidation('service-image',  'add-service-error-container')) ||
        (validation('validate-edited-service') && fileInputValidation('edited-service-image', 'edit-service-error-container')) ) {
        $('#add-service-div').modal('hide');
        $('#add-client-div').modal('hide');
        $('#edit-service-div').modal('hide');
    }
}

function validation(validateClass) {
    let validationFields = document.getElementsByClassName(validateClass);
    let regexp = /^[\s]+$/;
    let result = true;
    for(let field of validationFields) {
        if(regexp.test(field.value) || field.value === '') {
            field.className += ' error-validate';
            result = false;
        }
    }
    return result;
}

function fileInputValidation(inputId, containerId) {
    let container = document.getElementById(containerId);
    container.innerHTML = "";
    let input = document.getElementById(inputId);
    if(input.files[0] === undefined) {
        let errorLine = document.createElement('p');
        errorLine.innerHTML = "*You haven't chosen any image...";
        errorLine.style.color = 'red';
        container.appendChild(errorLine);
        return false;
    }
    return true;
}

function removeErrorClass(validateClass) {
    let validationFields = document.getElementsByClassName(validateClass);
    for(let field of validationFields) {
        field.classList.remove('error-validate');
    }
}

function addClientBtnClickHandler() {
    removeErrorClass('validate-client');
    let validationFields = document.getElementsByClassName('validate-client');
    for(let field of validationFields) {
        field.value = "";
    }
}

function addServiceBtnClickHandler() {
    removeErrorClass('validate-service');
    let validationFields = document.getElementsByClassName('validate-service');
    for(let field of validationFields) {
        field.value = "";
    }
}