/* TODO: Flesh this out to connect the form to the API and render results
   in the #address-results div. */
// first the form action will need to be referenced and set up 
let form = document.querySelector("form");
form.action = "api/parse/";

// now i need to create a url to use for the api from the html form
function htmlFormUrl(form) {
  newFormData = new FormData(form);
  newFormData.delete('csrfmiddlewaretoken');
  let values = new URLSearchParams(newFormData);
  let newUrl = form.action.toString() + '?' + values.toString();
  // console.log(values.toString());
  console.log(newFormData.get('address'));
  return newUrl;
};
let tableShown = document.getElementById("address-results");
let addressType = document.getElementById("parse-type");
// i need to create a function to fill the table in the html file when an address comes back as parsed
function returnHtmlTable(newAddress) {
  let insertedError = document.querySelector('.alert');
  if(insertedError) {
     insertedError.parentNode.removeChild(insertedError);
  };
  let tableBody = document.querySelector('tbody');
  tableBody.innerHTML = "";
  for (let [addressPart, tag] of Object.entries(newAddress)) {
     let row = document.createElement('tr');
     for (let i of [addressPart, tag]) {
        let tableData = document.createElement('td');
        let dataText = document.createTextNode(i);
        tableData.appendChild(dataText);
        row.appendChild(tableData);
     };
     tableBody.appendChild(row);
  };
};
// if an error occurs, there is no need for a table so I will just create a seperate div for any errors that may occur
function errorDiv() {
  let errorDivv = document.createElement("div");
  errorDivv.className = "alert alert-danger";
  let insertedError = document.querySelector('.alert');
  if(insertedError) {
     insertedError.parentNode.removeChild(insertedError);
  };
  let text = "The request you made did not work. Did you put in the correct address formatting?";
  let errorText = document.createTextNode(text);
  errorDivv.appendChild(errorText);
  tableShown.insertAdjacentElement('beforebegin',errorDivv);
  tableShown.style.display = 'none';
};
// add a event listener for when submit button is clicked on to collect form data and send to api
form.addEventListener("submit",(event) => {
  event.preventDefault();
  let apiUrl = htmlFormUrl(event.target);
  console.log('event listener is running');
  fetch(apiUrl)
  .then(response => {
     if (!response.ok) {
        throw new Error(`Server Error ${response.code}`)
     };
     console.log('first .then is running');
     return response.json();
  }).then((data) => {
     console.log(data);
     if (data['status'] == 'success') {
        console.log('this is running');
        addressType.textContent = data['address_type'];
        returnHtmlTable(data['address_components']);
        tableShown.style.display = 'inline';
     } else if (data['status'] == 'RepeatedLabelError') {
        errorDiv();
     };
  });
});