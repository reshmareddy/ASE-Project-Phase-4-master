var returnMsg;
var stores = [];

function saveStatusLocally() {

    //var inputField = document.getElementById('inputString');
    //var stringToSave = inputField.value;

    var fromElement = document.getElementById('From');
    if (fromElement) {
        var from = fromElement.value;
    }
    var toElement = document.getElementById('To');
    if (toElement) {
        var to = toElement.value;

    }
    if ((from != null) && (to != null)) {

        var currentdate = new Date();

        stores.push(currentdate);
        window.localStorage.setItem("1", stores.join("@ From: "));
        stores.push(from);
        window.localStorage.setItem("1", stores.join("To  "));
        //clear the input field for visual
        stores.push(to);
        //print that value into the local storage named database and joing by a non-breaking space
        window.localStorage.setItem("1", stores.join("  "));
        //confirm write
        //document.getElementById('myPlaces').innerHTML = "data stored.";

    }
}


// read the string
function readStatus() {

    //print the value of the local storage "database" key

    if (window.localStorage.getItem("1") == null) {
        document.getElementById('myPlaces').innerHTML = "nothing stored.";

    } else {
        document.getElementById('myPlaces').innerHTML = window.localStorage.getItem("1");
    }
}