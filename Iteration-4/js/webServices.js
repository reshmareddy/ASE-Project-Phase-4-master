var MyMap = function () {
    this.name = 'megha';
    this.latitude = 0;
    this.longitude = 0;
    this.center = 0;
    this.zip = '66223';
    this.zoom = 15;
    //this.mapTypeId = google.maps.MapTypeId.ROADMAP;
    //this.mapTypeId = google.maps.MapType.G_NORMAL_MAP;
    this.mapOptions = '';
    this.nearMeType = '';
    this.radius = 5000;
    this.source = '';
    this.destination = '';
    this.soapContainer = '';
    this.wunder = new Object();
    this.wunder.key = 'f8c3066322c719fa';
    this.wunder.keyMegha = 'f34104476d53986f';
    this.wunder.features = 'conditions';

    google.load("visualization", "1", {
        packages: ["corechart"]
    });
    google.load('visualization', '1', {
        packages: ['gauge']
    });
}


MyMap.prototype = {
    init: function (containerId, which, type, fromId, toId) {
        var args = [];
        args.push(containerId);
        args.push(which);
        args.push(type);
        args.push(fromId);
        args.push(toId);
        this.setCurrentLocation(this.initMap, args);
    },
    setCurrentLocation: function (callbackFunc, args) {
        var that = this;
        if (this.zip) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': this.zip
            }, function (location, status) {
                if (status == 'OK') {
                    that.latitude = location[0].geometry.location.lat();
                    that.longitude = location[0].geometry.location.lng();
                    callbackFunc.apply(that, args);
                }
            });
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                that.latitude = position.coords.latitude;
                that.longitude = position.coords.longitude;
                callbackFunc.apply(that, args);
            });
        }
    },
    initMap: function (containerId, which, type, fromId, toId) {
        var container = document.getElementById(containerId);;
        var that = this;
        that.center = new google.maps.LatLng(that.latitude, that.longitude);
        that.mapOptions = {
            zoom: that.zoom,
            //mapTypeId: that.mapTypeId,
            center: that.center
        }
        switch (which) {
       
        case 'n':
            that.nearMeType = type;
            if (container) {
                that.nearMe(container);
            }
            break;
        case 'w':
            if (container) {
                that.weather(container);
            }
            break;
        case 'l':

            var userName = document.getElementById('userid').value;
            var password = document.getElementById('password').value;
            $.ajax({
                url: "http://192.168.1.9/aspnet_client/WcfService1/WcfService1/WcfService1/Service1.svc/data/" + userName + "/" + password
            }).then(function (data) {
                if (data != 'false') {
                    document.getElementById('userName').innerHTML = data;
                }
            });

        }
    },
    weather: function (container) {

        var myOptions = {
            zoom: 8,
            //mapTypeId: this.mapTypeId,
            center: this.mapOptions.center
        }
        var weatherLayer = new google.maps.weather.WeatherLayer({
            temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
        });
        var map = new google.maps.Map(container, myOptions);
        weatherLayer.setMap(map);

        var cloudLayer = new google.maps.weather.CloudLayer();
        cloudLayer.setMap(map);
    },
    nearMe: function (container) {
        var request = {
            location: this.mapOptions.center,
            radius: this.radius,
            types: [this.nearMeType]
        };

        var myOptions = {
            zoom: 12,
            //mapTypeId: this.mapTypeId,
            center: this.mapOptions.center
        }
        var map = new google.maps.Map(container, myOptions);
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
    charts: function (containerId) {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Los Angeles', 15],
            ['Vegas', 20]
        ]);

        var options = {
            title: 'Most Economic',
            width: 400,
            height: 240,
            colors: ['#e0440e', '#e6693e']

        };

        var chart = new google.visualization.PieChart(document.getElementById(containerId));
        chart.draw(data, options);
    },
    drawGauge: function (containerId, ci) {
        var data = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['C.I.', ci]
        ]);

        var options = {
            width: 400,
            height: 400,
            redFrom: -2,
            redTo: -0.5,
            greenFrom: -0.5,
            greenTo: 0.5,
            yellowFrom: 0.5,
            yellowTo: 2,
            redColor: '#FF9900',
            minorTicks: 20,
            min: -2,
            max: 2
        };

        var chart = new google.visualization.Gauge(document.getElementById(containerId));
        chart.draw(data, options);
    },
    currentTemperature: function (updateExternalData) {


        var externalData = new Object();
        var that = this;
        this.setCurrentLocation(function () {

            var urlI = "http://api.wunderground.com/api/" + that.wunder.keyMegha + "/" + that.wunder.features +
                "/q/" + that.latitude + "," + that.longitude + ".json";

            $.ajax({
                url: urlI,
                dataType: "jsonp",
                success: function (parsed_json) {
                    // var location = parsed_json['location']['city'];
                    var location = "";
                    var temp_f = parsed_json['current_observation']['temp_f'];
                    var relative_humidity = parsed_json['current_observation']['relative_humidity'];

                    externalData.temperature = temp_f;
                    externalData.humidity = relative_humidity;
                    updateExternalData.call(undefined, externalData);

                }
            });
        }, []);
    },

    internalTemperature: function (updateInternalData) {

        var internalData = new Object();


        $.ajax({
            url: 'http://php2.umkc.edu/sce/e-save/demo/esavedemo/getRemoteSensorData.php',

            type: 'get',
            dataType: 'json',
            //headers: { 'Access-Control-Allow-Origin': '*' },
            //crossDomain: true,
            success: function (data) {
                $.each(data, function (key, val) {
                    temp = val.Temperature;
                    var volt = val.Humidity;
                    humidity = parseFloat(((volt / 3000) - 0.1515) / .00636).toFixed(0);

                    internalData.temperature = temp;
                    internalData.humidity = humidity;

                    updateInternalData.call(undefined, internalData)



                });

            }


        });
    }
}
var myMap = new MyMap();

var Utils = function () {
    
}


Utils.prototype = {
    init: function (containerId, which, type, fromId, toId) {
        var args = [];
        args.push(containerId);
        args.push(which);
        args.push(type);
        args.push(fromId);
        args.push(toId);
        this.setCurrentLocation(this.initMap, args);
    },
    setCurrentLocation: function (callbackFunc, args) {
        var that = this;
        if (this.zip) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': this.zip
            }, function (location, status) {
                if (status == 'OK') {
                    that.latitude = location[0].geometry.location.lat();
                    that.longitude = location[0].geometry.location.lng();
                    callbackFunc.apply(that, args);
                }
            });
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                that.latitude = position.coords.latitude;
                that.longitude = position.coords.longitude;
                callbackFunc.apply(that, args);
            });
        }
    }
	}
	
	var utils = new Utils();


var GoogleMap = function () {
    this.name = 'megha';
    this.address = '';
    this.latitude = 0;
    this.longitude = 0;
    this.center = 0;
    this.zip = '66223';
    this.zoom = 15;
    //this.mapTypeId = google.maps.MapTypeId.ROADMAP;
    this.mapOptions = '';
    this.nearMeType = '';
    this.radius = 5000;
    this.source = '';
    this.destination = '';
	this.directionContainer='';
	this.callback='';

    google.load("visualization", "1", {
        packages: ["corechart"]
    });
    google.load('visualization', '1', {
        packages: ['gauge']
    });
}


GoogleMap.prototype = {
    setLongitudeLatitude: function (address) {
        
		var that = this;
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, function (location, status) {
                if (status == 'OK') {
                    that.address = address;
                    that.latitude = location[0].geometry.location.lat();
                    that.longitude = location[0].geometry.location.lng();
                    that.callback.call(that);
                }
            });
        }
    ,
    centeredMap: function (container, center) {
var mapOptions = {
            zoom: 8,
            //mapTypeId: this.mapTypeId,
            center: center
        }       
	   var map = new google.maps.Map(container, mapOptions);
        var infowindow = new google.maps.InfoWindow({
            map: map,
            position: center,
            content: 'I am here'
        });
    },
    direction: function (mapContainer, directionContainer, source, destination, places) {
        mapContainer.innerHTML='';
        directionContainer.innerHTML='';
		var myOptions = {
            zoom: 8,
            //mapTypeId: this.mapTypeId,
            center: new google.maps.LatLng(0, 0)
        }
        var map2 = new google.maps.Map(mapContainer, myOptions);

        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map2);
		
		var waypts = [];
  
		if(places){
		
		for (var i = 0; i < places.length; i++) {
		var place = places[i];
      waypts.push({
          location:place,
          stopover:true
      });
    }
	}
  
  
        var request = {
            origin: source,
            destination: destination,
      waypoints: waypts,
      optimizeWaypoints: false,
  
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        var directionsService = new google.maps.DirectionsService();
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
                if (directionContainer) {
                    directionContainer.innerHTML = instructions;
                }

            }
        });
    },
    weather: function (container) {

        var myOptions = {
            zoom: 8,
            //mapTypeId: this.mapTypeId,
            center: this.mapOptions.center
        }
        var weatherLayer = new google.maps.weather.WeatherLayer({
            temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
        });
        var map = new google.maps.Map(container, myOptions);
        weatherLayer.setMap(map);

        var cloudLayer = new google.maps.weather.CloudLayer();
        cloudLayer.setMap(map);
    },
    nearMe: function (container) {
        var request = {
            location: this.mapOptions.center,
            radius: this.radius,
            types: [this.nearMeType]
        };

        var myOptions = {
            zoom: 12,
            //mapTypeId: this.mapTypeId,
            center: this.mapOptions.center
        }
        var map = new google.maps.Map(container, myOptions);
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
    charts: function (containerId) {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Los Angeles', 15],
            ['Vegas', 20]
        ]);

        var options = {
            title: 'Most Economic',
            width: 400,
            height: 240,
            colors: ['#e0440e', '#e6693e']

        };

        var chart = new google.visualization.PieChart(document.getElementById(containerId));
        chart.draw(data, options);
    },
    drawGauge: function (containerId, ci) {
        var data = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['C.I.', ci]
        ]);

        var options = {
            width: 400,
            height: 400,
            redFrom: -2,
            redTo: -0.5,
            greenFrom: -0.5,
            greenTo: 0.5,
            yellowFrom: 0.5,
            yellowTo: 2,
            redColor: '#FF9900',
            minorTicks: 20,
            min: -2,
            max: 2
        };

        var chart = new google.visualization.Gauge(document.getElementById(containerId));
        chart.draw(data, options);
    }
}
var googleMap = new GoogleMap();












/*
var Place = function () {
        this.id = '';
        this.name = '';
        this.latitude = '';
        this.longitude = '';
        this.additionalInfo = '';
        this.image = '';
    }

Place.prototype = {
    init: function (id, name, latitude, longitude, additionalInfo, image) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.additionalInfo = additionalInfo;
        this.image = image;
    }

}

var place = new Place();

var Route = function () {
        this.id = '';
        this.name = '';
        this.price = 0;
        this.rating = 0;
        this.createdBy = '';
        this.source = '';
        this.destination = '';
        this.places = [];
		this.currentPlace = 0;
		this.allRoutes = [];
		this.callback='';
		this.published=false;
		
    }

Route.prototype = {
    addPlace: function (id, name, latitude, longitude, additionalInfo, image) {
        var place = new Place();
        place.init(id, name, latitude, longitude, additionalInfo, image);
        this.places.push(place);
        if (this.places.length == 1) {
            this.source = place;
        }
        this.destination = place;
    },
    publish: function () {
       this.published=false;
	   for (var i = 0; i < this.places.length; i++) {
            var place = this.places[i];
            var soap = new Soap();
            soap.soapClientParameters.add("routeName", this.name);
            
            soap.soapClientParameters.add("routeRating", this.rating);
            soap.soapClientParameters.add("routePrice", this.price);
			soap.soapClientParameters.add("placeName", place.name);
            soap.soapClientParameters.add("latitude", place.latitude);
            soap.soapClientParameters.add("longitude", place.longitude);
            soap.soapClientParameters.add("imageUrl", place.image);
            soap.soapClientParameters.add("additionalInfo", place.additionalInfo);
            soap.soapClientParameters.add("createdBy", this.createdBy);
            soap.invoke('insertPlaces', this.getPublishResponse,this);
			if(i==this.places.length-1){
			
		this.published=true;
			}
        }

    },

    getPublishResponse: function (response) {
	this.callback.call(this,response);
    },
    Trace: function (routeName){
	 var soap = new Soap();
            soap.soapClientParameters.add("", '' );
            soap.invoke('insert', publishSuccess, place);
	
	},
	
	getRoute: function (tit){
	 var soap = new Soap();
     soap.soapClientParameters.add("routeName", routeName );
            
	 soap.invoke('GetRoute', this.getRouteResponse, this);
	
	},
	getRouteResponse: function(response){
	this.places=[];
	var routeJson = jQuery.parseJSON(response)[0];
	this.id=routeJson.Id;
	this.name=routeJson.Name;
	var places = routeJson.Places;
	for(var i=0;i<places.length;i++){
	this.addPlace(places[i].Id, places[i].Name, places[i].Latitude, places[i].Longitude, places[i].AdditionalInfo, places[i].ImageUrl);
	
	}
	
	this.callback.call(this);
	
	
	},
    getAllRoutes: function (){
	 var soap = new Soap();
     soap.invoke('GetRoutes', this.getAllRoutesResponse, this);
	 
	},
	getAllRoutesResponse: function(response){
	var json = jQuery.parseJSON(response);
	this.allRoutes=[];	
	for(var j=0;j<json.length;j++){
	var route = new Route();
	route.id=json[j].Id;
	route.name=json[j].Name;
	route.price=json[j].Price;
	route.rating=json[j].Rating;
	var places = json[j].Places;
	for(var i=0;i<places.length;i++){
	route.addPlace(places[i].Id, places[i].Name, places[i].Latitude, places[i].Longitude, places[i].AdditionalInfo, places[i].ImageUrl);
	}
	this.allRoutes.push(route);
	}
	
	
	this.callback.call(this);
	
	
	
	}



}


var route = new Route();
*/



/*
var Twitter = function () {
    this.consumerKey = 'mQ1Lf9xmdAI8YtRN7HdFHQ';
    this.consumerSecret = '2pi1AvqnCzjFSmRzKSgo8cTDmHvPa7SQAroSCmWnAU';
    this.accessToken = '2315844691-ROnNOpaoTecDHq2zMChJZPxMzUiNGx11IGfzYuP';
    this.accessTokenSecret = 'OAWJbdnpu8DOvhzJKuOSlCFIsLzEtlSLWRd8fjZ9nLml8';
    //this.getToken();
}

Twitter.prototype = {

    encodeRfc1738: function (string) {
        return encodeURIComponent(string);

    },

    getToken: function () {
        var keySecret = this.key + ':' + this.secret;
        var encodedKeySecret = window.btoa(keySecret);

        $.ajax({
            type: "GET",
            url: 'https://api.twitter.com/1.1/statuses/user_timeline.json?count=100&screen_name=twitterapi',
            dataType: 'json',
            //beforeSend: function(xhrObj){
            //    xhrObj.setRequestHeader("Authorization","Bearer " + this.accessTokenSecret);
            // },
            error: function () {
                alert("Fail");
            },
            success: function () {
                alert("Success");
            }
        });

    },

    getTweet: function (tweetId, containerId) {

       // tweetId = '446478364551827457';
        var url1 = 'https://api.twitter.com/1/statuses/oembed.json?id=' + tweetId;

        $.ajax({
            type: "GET",
            url: url1,
            dataType: 'jsonp',
            error: function () {
                alert("Fail");
            },
            success: function (data) {
                var html = data['html'];
                $("#" + containerId).html(html);
            }
        });

    },
    getTweetIds: function () {
        var url1 = 'http://localhost/Twitter/WcfService1/Service1.svc/data/10';
        var that = this;
        $.ajax({
            type: "GET",
            url: url1,
            dataType: 'json',
            error: function () {
                alert("Fail");
            },
            success: function (data) {
                //var d = data['statuses']['metadata']['id'];
                var obj = jQuery.parseJSON(data);
                var ids = [];
                for (var i = 0; i < obj.statuses.length; i++) {
                    ids.push(obj.statuses[i].id);
                }
                that.populateTweets(ids);

            }
        });
    },
    populateTweets: function (ids) {
        $('#tweet').html('');
        for (var i = 0; i < ids.length; i++) {
            $('#tweet').html($('#tweet').html() + "<div id='twitter" + i + "'></div>");
        }

        for (var i = 0; i < ids.length; i++) {
            this.getTweet(ids[i], "twitter" + i);
        }
    }




}

var twitter = new Twitter();
*/


var Twitter = function () {
    this.consumerKey = 'mQ1Lf9xmdAI8YtRN7HdFHQ';
    this.consumerSecret = '2pi1AvqnCzjFSmRzKSgo8cTDmHvPa7SQAroSCmWnAU';
    this.accessToken = '2315844691-ROnNOpaoTecDHq2zMChJZPxMzUiNGx11IGfzYuP';
    this.accessTokenSecret = 'OAWJbdnpu8DOvhzJKuOSlCFIsLzEtlSLWRd8fjZ9nLml8';
    //this.getToken();
}

Twitter.prototype = {

    encodeRfc1738: function (string) {
        return encodeURIComponent(string); 

    },

    getToken: function () {
        var keySecret = this.key + ':' + this.secret;
        var encodedKeySecret = window.btoa(keySecret);

        $.ajax({
            type: "GET",
            url: 'https://api.twitter.com/1.1/statuses/user_timeline.json?count=100&screen_name=twitterapi',
            dataType: 'json',
            //beforeSend: function(xhrObj){
            //    xhrObj.setRequestHeader("Authorization","Bearer " + this.accessTokenSecret);
            // },
            error: function () {
                alert("Fail");
            },
            success: function () {
                alert("Success");
            }
        });

    }, 
	
	getTweet: function (tweetId, containerId) {
		
       // tweetId='446478364551827457';
		var url1 = 'https://api.twitter.com/1/statuses/oembed.json?id=' + tweetId; 
		
		$.ajax({
            type: "GET",
            url: url1,
            dataType: 'jsonp',
            error: function () {
                alert("Fail");
            },
            success: function (data) {
			    var html = data['html'];
                $("#"+containerId).html(html);
            }
        });

    },
	createTweets: function () {                                                                
        var url1 = 'http://localhost/Twitter/WcfService1/Service1.svc/data/10'; 
		var that = this; 
		$.ajax({
            type: "GET",                                                            
            url: url1,
            dataType: 'json',
            error: function () {
                alert("Fail");
            },
            success: function (data) {
			    var obj = jQuery.parseJSON(data);
				var ids=[];
			    for(var i =0 ; i< obj.statuses.length;i++){
				ids.push(obj.statuses[i].id_str);
				}
				that.populateTweets(ids);
				
            }
        });
		},
	populateTweets: function (ids) {                                                                
        $('#tweet').html('');
		for(var i =0 ; i< ids.length;i++){
				$('#tweet').html($('#tweet').html() + "<div id='twitter"+i+"'></div>");
				}
				var count=0;
				for(var i =0 ; i< ids.length && count<6;i++){
				this.getTweet(ids[i], "twitter"+i);
				count++;
				}
				
				
				

    }




}

var twitter = new Twitter();

var FourSquare = function () {
    this.owner = 'Megha Sharma';
    this.clientId1 = 'QSQI4BKJRGKV0NPDNBNAECRP0U3YKX2KMZIY01HZYDIKVSST';
    this.clientSecret1 = 'BUQC5DBCRYTQPR3KHFOLNMHPE1Z2MYD0BW4Z1CO1V2NFK21S';
    this.redirectUri = 'http://192.168.56.1/html/destinations.html';
    this.accessToken1 = '0WS4RAHRWBBSIWAFKIUXJRED1CUVFEAYLUKDNDMHY2WERL4N';
	this.clientId2= 'JHQXGEMU4IRCKSW5YITRWY5T1R2E0NNI0B3Y5B2ZMCUEOJSW';
    this.clientSecret2 = 'IU0WFMRIZJ5P0LTXDBPUKKQBWH0YWENXMDIXO4QJPMQLGLFX';
    this.accessToken2 = 'ZMFOV5NZT5FMGNASDA25RJQV4G00S0HK1IK12VOAFVRC1K3J';
	this.clientId = 'UN3Q2X2HIPPLBTLEXRJA2JR5QGZ30DVMDVPEBOVLR0O4PP0N';
    this.clientSecret = 'HSFI2PFCHUQEWKQ4NVXDBC0TEVCEE12HWK2V1VB1SIM1C1MJ';
    this.accessToken ='5LHQKNQPAZDPKUQY0WGWOVLOMMSTXPXCO5J2VJ5FOBGLU5IH';
	
    this.ll = '';
    this.near = 'Kansas City, MO';
	this.query='Hilton President Kansas City'
	this.callback='';

}

FourSquare.prototype = {

    encodeRfc1738: function (string) {
        return encodeURIComponent(string);

    },

    getToken: function () {
        window.location = 'https://foursquare.com/oauth2/authenticate?client_id=' + this.clientId + '&response_type=token&redirect_uri=' + this.redirectUri;

    },

    explore: function (latitude, longitude, query, limit) {


        var url1 = 'https://api.foursquare.com/v2/venues/explore?v=20140403&oauth_token=' + this.accessToken + '&ll=' + latitude + ',' + longitude;
if(query){
		//url1+="&intent=match&query="+query;
		url1+="&query="+query;
		}
		if(limit){
		url1+="&limit="+limit;
		}
        var that = this;
		$.ajax({
             type: "GET",
            url: url1,
            dataType: 'jsonp',
            error: function () {
                alert("Fail");
            },
            success: function (data) {
			that.callback.call(undefined, data);
            }

        });

    },
	
	match: function (latitude, longitude, query, limit) {
        var url1 = 'https://api.foursquare.com/v2/venues/search?v=20140403&oauth_token=' + this.accessToken + '&ll=' + latitude + ',' + longitude;
		if(query){
		//url1+="&intent=match&query="+query;
		url1+="&query="+query;
		}
		if(limit){
		url1+="&limit="+limit;
		}
        var that = this;
        $.ajax({
            type: "GET",
            url: url1,
            dataType: 'jsonp',
            error: function () {
                alert("Fail");
            },
            success: function (data) {
			that.callback.call(undefined, data);
            }

        });

    }




}

var fourSquare = new FourSquare();
//fourSquare.match();