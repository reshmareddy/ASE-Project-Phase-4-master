document.write('<script type="text/javascript" src="../js/soap.js" ></script>');
document.write('<script type="text/javascript" src="../js/soapclient.js" ></script>');
document.write('<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>');
document.write('<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>');

var geocoder = new google.maps.Geocoder();

function initialize() {
    //Geocode Address to obtin Lat and Long coordinates for the starting point of our map
    
	
    geocode(geocoder, function(results) {
        // This function gets called by the geocode function on success
        makeMap(results[0].geometry.location.lat(), results[0].geometry.location.lng());        
    });
};

function geocode1(callback) {
    //do geocoding here...
alert('results');
    var address = "3630 University Street, Montreal, QC, Canada";
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // Call the callback function instead of returning
            callback(results);
			alert(results)
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
   });

};
