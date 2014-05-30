var MyMap = function () {
    this.name = 'megha';
    this.latitude = 0;
    this.longitude = 0;
    this.center = 0;
    this.zip = '66223';
    this.zoom = 15;
    this.mapTypeId = google.maps.MapTypeId.ROADMAP;
    this.mapOptions = '';
    this.nearMeType = '';
    this.radius = 5000;
    this.source = '';
    this.destination = '';
    this.soapContainer = '';
    this.pl = '';
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
    initSoap: function (container) {
        this.soapContainer = document.getElementById(container);
        this.pl = new SOAPClientParameters();
        this.soapRefresh(true, false);

    },
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
            mapTypeId: that.mapTypeId,
            center: that.center
        }
        switch (which) {
        case 'r':
            if (container) {
                that.centeredMap(container);
            }
            break;
        case 'd':
            if (container) {
                var fromElement = document.getElementById(fromId);
                if (fromElement) {
                    var from = fromElement.value;
                    that.source = from;
                    var toElement = document.getElementById(toId);
                    if (toElement) {
                        var to = toElement.value;
                        that.destination = to;
                    }
                }

                that.direction(container);
            }
            break;
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
    centeredMap: function (container) {
        var map = new google.maps.Map(container, this.mapOptions);
        var pos = new google.maps.LatLng(this.latitude, this.longitude);
        var infowindow = new google.maps.InfoWindow({
            map: map,
            position: pos,
            content: 'I am here'
        });
    },
    direction: function (container) {
        var myOptions = {
            zoom: 8,
            mapTypeId: this.mapTypeId,
            center: new google.maps.LatLng(0, 0)
        }
        var map2 = new google.maps.Map(container, myOptions);

        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map2);
        var request = {
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
    weather: function (container) {

        var myOptions = {
            zoom: 8,
            mapTypeId: this.mapTypeId,
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
            mapTypeId: this.mapTypeId,
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
    soap: function (containerId, functionName) {
        var that = this;
        var url = "http://localhost:19832/WebService.asmx";
        this.soapMethod = functionName;
        this.soapRefresh(false, true);

        SOAPClient.invoke(url, functionName, this.pl, true, function (r) {
            if (that.soapContainer) {
                that.soapContainer.innerHTML = r;
            }
        });

    },

    soapRefresh: function (load, displayResult) {
        delete this.pl['name'];
        delete this.pl['age'];
        delete this.pl['ssn'];

        switch (this.soapMethod) {
        case "QueryTable":
            this.pl.add("name", document.getElementById("nameSelect").value);
            break;
        case "InsertTable":
            this.pl.add("name", document.getElementById("nameInsert").value);
            this.pl.add("age", document.getElementById("ageInsert").value);
            this.pl.add("ssn", document.getElementById("ssnInsert").value);
            break;
        case "DeleteTable":
            this.pl.add("name", document.getElementById("nameDelete").value);
            break;
        }
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
		
        tweetId='446478364551827457';
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
	getTweetIds: function (id) {                                                                
        var url1 = 'http://localhost/aspnet_client/Twitter/WcfService1/Service1.svc/data/10'; 
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
				var ids=[];
			    for(var i =0 ; i< obj.statuses.length;i++){
				ids.push(obj.statuses[i].id);
				}
				that.populateTweets(ids);
				
            }
        });
		},
	populateTweets: function (ids) {                                                                
        $('#2').html('');
		for(var i =0 ; i< ids.length;i++){
				$('#2').html($('#2').html() + "<div id='twitter"+i+"'></div>");
				}
				
				for(var i =0 ; i< ids.length;i++){
				this.getTweet(ids[i], "twitter"+i);
				}
				
				
				
1
    }




}

var twitter = new Twitter();