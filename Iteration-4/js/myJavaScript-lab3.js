var MyMap = function () {
    this.name = 'megha';
    this.latitude = 0;
    this.longitude = 0;
    this.center = 0;
    this.address = "";
    this.zoom = 15;
    this.mapTypeId = google.maps.MapTypeId.ROADMAP;
    this.mapOptions = '';
    this.nearMeType = '';
    this.radius = 5000;
    this.source = '';
    this.destination = '';
      google.load("visualization", "1", {packages:["corechart"]});
}


MyMap.prototype = {
    init: function (which, type,fromId,toId,address) {
        var that = this;
        if (address) {
		this.address=address;
		}
		if(this.address){
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': that.address }, function (location, status) {
                if (status == 'OK') {
                    that.latitude = location[0].geometry.location.lat();
                    that.longitude = location[0].geometry.location.lng();
                    that.initMap(which, type,fromId,toId);
                }
            });
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                that.latitude = position.coords.latitude;
                that.longitude = position.coords.longitude;
                that.initMap(which, type,fromId,toId);
            });
        }
    },
    initMap: function (which, type,fromId,toId) {
        var that = this;
        that.center = new google.maps.LatLng(that.latitude, that.longitude);
        that.mapOptions = {
            zoom: that.zoom,
            mapTypeId: that.mapTypeId,
            center: that.center
        }
        switch (which) {
            case 'r':
			document.getElementById('mapRegular').style.display = "block";
                var mapContainer = document.getElementById('mapRegular');
                if (mapContainer) {
                    that.centeredMap(mapContainer);
								

    }
					
               
                break;
            case 'd':
                var directionContainer = document.getElementById('mapDirection');
                if (directionContainer) {
					var fromElement=document.getElementById(fromId);
					if(fromElement){
					var from=fromElement.value;
					that.source=from;
					var toElement=document.getElementById(toId);
					if(toElement){
					var to=toElement.value;
					that.destination=to;					
					}
					}
					
                    that.direction(directionContainer);
                }
                break;
            case 'n':
                that.nearMeType = type;
                var nearMeContainer = document.getElementById('mapNearMe');
                if (nearMeContainer) {
                    that.nearMe(nearMeContainer);
                }
                break;
            case 'w':
                var weatherContainer = document.getElementById('mapWeather');
                if (weatherContainer) {
                    that.weather(weatherContainer);
                }
                break;
        }
    },
    centeredMap: function (mapContainer) {
        var map = new google.maps.Map(mapContainer, this.mapOptions);
        var pos = new google.maps.LatLng(this.latitude, this.longitude);
		var that=this;
        var infowindow = new google.maps.InfoWindow({
            map: map,
            position: pos,
            content: that.address
        });
    },
    direction: function (directionContainer) {
        var myOptions = {
            zoom: 8,
            mapTypeId: this.mapTypeId,
            center: new google.maps.LatLng(0, 0)
        }
        var map2 = new google.maps.Map(directionContainer, myOptions);

        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map2);
        var request =
    {
        origin: this.source,
        destination: this.destination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

        var directionsService = new google.maps.DirectionsService();
        var directionInstructions = document.getElementById('directionInstructions');
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                var leg = route.legs[0]
                var steps = leg.steps;
                var instructions = '';
                for (var i = 0; i < steps.length; i++) {
                    var step = steps[i];
                    instructions = instructions + step.instructions + '<br/>';
                }
                if (directionInstructions) {
                    directionInstructions.innerHTML = instructions;
                }

            }
        });
    },
    weather: function (weatherContainer) {

        var myOptions = {
            zoom: 8,
            mapTypeId: this.mapTypeId,
            center: this.mapOptions.center
        }
        var weatherLayer = new google.maps.weather.WeatherLayer({
            temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
        });
        var map = new google.maps.Map(weatherContainer, myOptions);
        weatherLayer.setMap(map);

        var cloudLayer = new google.maps.weather.CloudLayer();
        cloudLayer.setMap(map);
    },
    nearMe: function (nearMeContainer) {
        var request = {
            location: this.mapOptions.center,
            radius: this.radius,
            types: [this.nearMeType]
        };

        var myOptions = {
            zoom: 12,
            mapTypeId: this.mapTypeId,
            center: this.mapOptions.center
        }
        var map = new google.maps.Map(nearMeContainer, myOptions);
        var that = this;
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    that.createMarker(map, results[i]);
                }
            }
        });

    },
    createMarker: function (map, result) {
        var marker = new google.maps.Marker({
            map: map,
            position: result.geometry.location
        });
    },
    charts: function (map, result) {

      var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Los Angeles',     15],
          ['Vegas',     20 ],
          ['Paris',  30],
          ['Seattle', 10],
          ['Washington',    15]
        ]);

        var options = {
          title: 'Most Economic'
		  
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart2'));
        chart.draw(data, options);
		
		var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Los Angeles',     20],
          ['Vegas',     20 ],
          ['Paris',  20],
          ['Seattle', 30],
          ['Washington',    10]
        ]);

        var options = {
          title: 'Most Visited'
		  
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart1'));
        chart.draw(data, options);
      
    }
}
var myMap = new MyMap();

		
