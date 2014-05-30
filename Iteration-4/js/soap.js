document.write('<script type="text/javascript" src="../js/soapclient.js" ></script>');

/*	document.write('<script type="text/javascript" src="../js/globalize.min.js"></script>');
	document.write('<script type="text/javascript" src="../js/dx.chartjs.js"></script>');

	document.write('<script type="text/javascript" src="../js/module/dx.module-core.js"></script>');
	document.write('<script type="text/javascript" src="../js/module/dx.module-viz-core.js"></script>');
	document.write('<script type="text/javascript" src="../js/module/dx.module-viz-charts.js"></script>');
	document.write('<script type="text/javascript" src="../js/module/dx.module-viz-gauges.js"></script>');
	document.write('<script type="text/javascript" src="../js/module/dx.module-viz-rangeselector.js"></script>');
	document.write('<script type="text/javascript" src="../js/module/dx.module-viz-sparklines.js"></script>');
	document.write('<script type="text/javascript" src="../js/module/dx.module-viz-vectormap.js"></script> ');
	
	document.write('<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>');
*/


var MyMap = function () {
    this.soapContainer = '';
    this.pl='';
	this.userNameMain='';
}


MyMap.prototype = 
{
	// Coded by Pavani
	// Converts words to Initcap format
	Initcap:function(word) {
	var retWord = word.substring(0,1).toUpperCase()
	+ word.substring(1,word.length).toLowerCase();
	return retWord;
	},

//Password Validation.
	pwdvalidation:function()
	{
		var password;
		var confpassword;
		password =	document.getElementById("password").value;
			
		var passw =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,150}$/; 
		if(password.length < 8)   
		{  
			document.getElementById("valPassword").innerHTML = 'Password should be atleast 8 characters';
			document.getElementById("password").focus();
		}
		else if (!password.match(passw))
		{
			document.getElementById("valPassword").innerHTML = 'Invalid Password!!';
			document.getElementById("password").focus();
		}
		else
		{
			document.getElementById("valPassword").innerHTML = '';
		}
	},

// To Check Password match.
	confirmpwd:function()
	{
		var password;
		var confpassword;
		password =	document.getElementById("password").value;
		confpassword =	document.getElementById("password_confirm").value;
		if(!password.match(confpassword))   
		{
			document.getElementById("conPassword").innerHTML = 'Passwords does not match. Please re-enter';
			document.getElementById("password_confirm").focus();
		}
		else
		{
			document.getElementById("conPassword").innerHTML = '';
		}

	}, 
// User Registration.
	soapRegister: function (containerId, functionName) 
	{
        var that = this;
        var url = "http://134.193.136.38/aspnet_client/Group5/WebSite5/WebService.asmx";
		var pl = new SOAPClientParameters();
        this.soapMethod = functionName;

		pl = this.soapRefresh(false, true, pl);

		SOAPClient.invoke(url, functionName, pl, false, function (r) 
		{
			if (that.soapContainer) 
			{
				that.soapContainer.innerHTML = r;
            }
        });
		
		var url = location.href;
		var baseURL = url.replace('register.htm','');
		window.location.href = baseURL + "login.htm";
	},
// User Login.
	soapLogin: function (containerId, functionName) 
	{
        var that = this;
        var url = "http://134.193.136.38/aspnet_client/Group5/WebSite5/WebService.asmx";
		var pl = new SOAPClientParameters();
        this.soapMethod = functionName;
		var result;
		var userNameMain;
		
		localStorage.clear('userNameMain');
		userNameMain =	document.getElementById('username').value;
		localStorage.setItem( 'userNameMain',userNameMain);
		
		pl = this.soapRefresh(false, true, pl);

		SOAPClient.invoke(url, functionName, pl, false, function (r) 
		{
			result = r;

            if (that.soapContainer) 
			{
                that.soapContainer.innerHTML = r;
            }
        });

		this.pwdverify(result);
	},
	
	// To Join MyCommunity
	soapJoinMyCommunity: function (containerId, functionName) 
	{
        var that = this;
        var url = "http://134.193.136.38/aspnet_client/Group5/WebSite5/WebService.asmx";
		var pl = new SOAPClientParameters();
		var householdsize1;
		var housetype1;
		var street;
		var city;
		var state;
		var zipcode1;
		var community1;
		
		var txtAddress;
		var geolatlong;
		
		street = document.getElementById('streetaddress').value;
		city =	document.getElementById('city').value;
		state =	document.getElementById('state').value;
		zipcode1 =	document.getElementById('zipcode').value;
		
		txtAddress = street + ' ' + city + ' ' + state + ' ' + zipcode1;
		//txtAddress = '421 w 87th st';
            var geocoder = new google.maps.Geocoder();
            
			geocoder.geocode({ 'address': txtAddress }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
					
					geolatlong = '[{"latitude":"'  + latitude + '","longitude":"' + longitude + '"}]';
					
				var llArr = [];
				llArr = JSON.parse(geolatlong);
			
				document.getElementById('latitude').value = latitude;		
				document.getElementById('longitude').value = longitude;

				myMap.soaptest(functionName);
		}
		
		});
       
},
soaptest: function(functionName)
{
       var that = this;
        var url = "http://134.193.136.38/aspnet_client/Group5/WebSite5/WebService.asmx";
		var pl = new SOAPClientParameters();
		var householdsize1;
		var housetype1;
		var street;
		var city;
		var state;
		var zipcode1;
		var community1;
		
		var txtAddress;
		var geolatlong;
		
		street = document.getElementById('streetaddress').value;
		city =	document.getElementById('city').value;
		state =	document.getElementById('state').value;
		zipcode1 =	document.getElementById('zipcode').value;

		this.soapMethod = functionName;

		
			pl = this.soapRefresh(false, true, pl);
				
			SOAPClient.invoke(url, functionName, pl, false, function (r) 
				{
					if (that.soapContainer) 
					{
						that.soapContainer.innerHTML = r;
					}
				});
					
				localStorage.clear('utilitybill');
				localStorage.clear('year');
				localStorage.clear('month');
				localStorage.clear('householdsize1');
				localStorage.clear('housetype1');
				localStorage.clear('zipcode1');
				localStorage.clear('community1');

				userNameMain =	document.getElementById('userNameCommunity').value;
				localStorage.clear('userNameMain');
				localStorage.setItem( 'userNameMain',userNameMain);

				localStorage.setItem( 'householdsize1',document.getElementById("householdsize").value);
				localStorage.setItem( 'housetype1',document.getElementById("housetype").value);
				localStorage.setItem( 'zipcode1',document.getElementById("zipcode").value);
				localStorage.setItem( 'community1',document.getElementById("community").value);
				
				var url = location.href;
				var baseURL = url.replace('JoinCommunity.htm','');
				window.location.href = baseURL + "ComputeRewards.htm";
						
				
},

// Navigates to respective page depending on whether user already part of MyCommunity or not.
	soapMyCommunity: function (containerId, functionName) 
	{
        var that = this;
        var url = "http://134.193.136.38/aspnet_client/Group5/WebSite5/WebService.asmx";
		var pl = new SOAPClientParameters();
        var result;
		var utilitybill;
		var month;
		var year;
		
		this.soapMethod = functionName;
		
		pl = this.soapRefresh(false, true, pl);

		SOAPClient.invoke(url, functionName, pl, false, function (r) 
		{
			result = r;
            if (that.soapContainer) 
			{
                that.soapContainer.innerHTML = r;
            }
        });
	
		if (result == 'User not in MyCommunity')
		{
			localStorage.clear('utilitybill');
			localStorage.clear('year');
			localStorage.clear('month');
			
			userNameMain =	document.getElementById('userNameCommunity').value;
			localStorage.clear('userNameMain');
			localStorage.setItem( 'userNameMain',userNameMain);


			var url = location.href;
			var baseURL = url.replace('index.html','');
			window.location.href = baseURL + "JoinCommunity.htm";
		}
		else 
		{
			if (result == 'no utilitybill for current month')
			{
				localStorage.clear('utilitybill');
				localStorage.clear('year');
				localStorage.clear('month');
		
				userNameMain =	document.getElementById('userNameCommunity').value;
				localStorage.clear('userNameMain');
				localStorage.setItem( 'userNameMain',userNameMain);

				var url = location.href;
				var baseURL = url.replace('index.html','');
				window.location.href = baseURL + "ComputeRewards.htm?";

			}
			else
			{
				var utilitydetails = [];
				utilitydetails = result.split(',');

				utilitybill = utilitydetails[0];
				year = utilitydetails[1];
				month = utilitydetails[2];

				localStorage.clear('utilitybill');
				localStorage.clear('year');
				localStorage.clear('month');
				localStorage.setItem( 'utilitybill',utilitybill);
				localStorage.setItem( 'year',year);
				localStorage.setItem( 'month',month);

				userNameMain =	document.getElementById('userNameCommunity').value;
				localStorage.clear('userNameMain');
				localStorage.setItem( 'userNameMain',userNameMain);

				var url = location.href;
				var baseURL = url.replace('index.html?','');
				window.location.href = baseURL + "ComputeRewards.htm";

			}
		}
		
	},
	
	//Compute Reward Points.
	soapRewardPoints: function (containerId, functionName) 
	{
        var that = this;
        var url = "http://134.193.136.38/aspnet_client/Group5/WebSite5/WebService.asmx";
		var pl = new SOAPClientParameters();
        var result;
		this.soapMethod = functionName;

		pl = this.soapRefresh(false, true, pl);

		SOAPClient.invoke(url, functionName, pl, false, function (r) 
		{
			result = r;
            if (that.soapContainer) 
			{
                that.soapContainer.innerHTML = r;
            }
        });

		document.getElementById('month').value='January';
		document.getElementById('year').value='2013';
		
		//document.getElementById('divCompute1').value ='';
		document.getElementById('divCompute1').style.display = 'block';		
		document.getElementById('divGrid').style.display = 'none';			
		document.getElementById('divCompute').style.display = 'block';
		
		if(result == 5 || result == 4)
		{
			$("#divCompute").igLinearGauge({
				height: "50px",
				width: "60px",
				backingInnerExtent:"0.4",
				backingOuterExtent:"0.8",
				maximumValue: 5,
				value: result,
				needleBrush: "black",
				needleOutline: "black",                    
				labelInterval: 1,
				interval: 1,
				ranges: [{
				 name: 'range1',
				 brush:'green',
				 startValue:"0",
				 endValue: result
				},
				{
				 name: 'range2',
				 brush:'grey',
				 startValue: result,
				 endValue:"5"
				}]
			});
		} 
		else if(result == 3)
		{	
		$("#divCompute").igLinearGauge({
				height: "50px",
				width: "60px",
				brush:"red",
				backingInnerExtent:"0.4",
				backingOuterExtent:"0.8",
				maximumValue: 5,
				value: result,
				needleBrush: "black",
				needleOutline: "black",                    
				labelInterval: 1,
				interval: 1,
				ranges: [{
				 name: 'range1',
				 brush:'orange',
				 startValue:"0",
				 endValue: result
				},
				{
				 name: 'range2',
				 brush:'grey',
				 startValue: result,
				 endValue:"5"
				}]
			});
		}
		else if(result == 2 || result == 1)
		{
			$("#divCompute").igLinearGauge({
				height: "50px",
				width: "60px",
				backingInnerExtent:"0.4",
				backingOuterExtent:"0.8",
				maximumValue: 5,
				value: result,
				needleBrush: "black",
				needleOutline: "black",                    
				labelInterval: 1,
				interval: 1,
				ranges: [{
				 name: 'range1',
				 brush:'red',
				 startValue:"0",
				 endValue: result
				},
				{
				 name: 'range2',
				 brush:'grey',
				 startValue: result,
				 endValue:"5"
				}]
			});
		}

	},

	// Community Reward Points.
	soapCommunityRewardPoints: function (containerId, functionName) 
	{
        var that = this;
        var url = "http://134.193.136.38/aspnet_client/Group5/WebSite5/WebService.asmx";
		var pl = new SOAPClientParameters();
        var result;
		this.soapMethod = functionName;

		pl = this.soapRefresh(false, true, pl);

		SOAPClient.invoke(url, functionName, pl, false, function (r) 
		{
			result = r;
            if (that.soapContainer) 
			{
                that.soapContainer.innerHTML = r;
            }
        });
		
		var householdsize1 = localStorage.getItem("householdsize");
		var zipcode1 = localStorage.getItem("zipcode");
		
		document.getElementById('utilitybilluser').value='';
		document.getElementById('monthuser').value='January';
		document.getElementById('yearuser').value='2013';
		
		document.getElementById('divCompute').style.display = 'none';
		document.getElementById('divCompute1').style.display = 'none';
				
		document.getElementById('divGrid').style.display = 'block';

		
		//var arr = [];
		//arr = JSON.parse(result);
		//result = '[{"user_name1":"pavani1","community":"lions","housetype":"Condo","RewardPoints":"5"},{"user_name1":"pavani2","community":"lions","housetype":"Apartment","RewardPoints":"5"},{"user_name1":"pavani3","community":"lions","housetype":"Apartment","RewardPoints":"5"},{"user_name1":"pavani4","community":"lions","housetype":"Apartment","RewardPoints":"1"}]';
		var data = [];
		var winner;
		data = JSON.parse(result);
		
		var text = '';
		community = data[0].community;
				
		if(community == null)
		{
		text = '';
		}
		else{
		text = 'Reward points of houses in your Community: ' + community;
		}
            $("#grid").igGrid({
                height: 400,
				columns: [
                    { headerText: "Houses", key: "Time", template: "<img class = 'house-image'  width='40' height='40'></img>", width: 80 },
                    { headerText: "User Name", key: "user_name1", dataType: "string", width: 100 },
					{ headerText: "House Type", key: "housetype", dataType: "string", width: 100 },
					{ headerText: "HouseHold Size", key: "householdsize", dataType: "number", width: 120 },
					{ headerText: "Members Live-in", key: "householdmembers", dataType: "number", width: 150 },
                    { headerText: "Reward Points", key: "gauge", width: 180, template: "<div class='linear-gauge' ></div>" },
					{ headerText: "Rank", key: "rank", template: "<img class = 'award-image'  width='100' height='100'></img>", width: 110 },
                ],
                dataSource: data,
                autoGenerateColumns: false,
                rowsRendered: function (evt, ui) {
				$(".award-image").each(function (i) {				 
				 var image10;
				if(i == 0)
				{
					image10 = "../images/awardRank1.jpg";
				} else
				{
					image10 = "../images/goodluck.jpg";
				}
				
				$(this).attr("src", image10);
				 });
				 $(".house-image").each(function (i) {				 
				  var item = data[i];
				 var image1;
				if(item.housetype == 'Apartment')
				{
					image1 = "../images/apartment.jpg";
				}
				else if(item.housetype == 'Single Family Home')
				{
					image1 = "../images/sfhome.jpg";
				}
				else if(item.housetype == 'Condo')
				{
					image1 = "../images/condo.jpg";
				}
				else if(item.housetype == 'Townhome')
				{
					image1 = "../images/townhome.jpg";
				}
				
				$(this).attr("src", image1);
				 });
                    $(".linear-gauge").each(function (i) {
                        var item = data[i];
						if(item.RewardPoints == 5 || item.RewardPoints == 4)
						{
                        $(this).igLinearGauge({
                            height: "50px",
                            width: "120px",
							backingInnerExtent:"0.4",
							backingOuterExtent:"0.8",
                            maximumValue: 5,
                            value: item.RewardPoints,
                            needleBrush: "black",
                            needleOutline: "black",                    
                            labelInterval: 1,
                            interval: 1,
							ranges: [{
							 name: 'range1',
							 brush:'green',
							 startValue:"0",
							 endValue: item.RewardPoints
							},
							{
							 name: 'range2',
							 brush:'grey',
							 startValue: item.RewardPoints,
							 endValue:"5"
							}]
                        });
						}
						else if(item.RewardPoints == 3)
						{
                        $(this).igLinearGauge({
                            height: "50px",
                            width: "120px",
							backingInnerExtent:"0.4",
							backingOuterExtent:"0.8",
                            maximumValue: 5,
                            value: item.RewardPoints,
                            needleBrush: "black",
                            needleOutline: "black",                    
                            labelInterval: 1,
                            interval: 1,
							ranges: [{
							 name: 'range1',
							 brush:'orange',
							 startValue:"0",
							 endValue: item.RewardPoints
							},
							{
							 name: 'range2',
							 brush:'grey',
							 startValue: item.RewardPoints,
							 endValue:"5"
							}]
                        });
						}
						else if(item.RewardPoints == 2 || item.RewardPoints == 1)
						{
                        $(this).igLinearGauge({
                            height: "50px",
                            width: "120px",
							backingInnerExtent:"0.4",
							backingOuterExtent:"0.8",
                            maximumValue: 5,
                            value: item.RewardPoints,
                            needleBrush: "black",
                            needleOutline: "black",                    
                            labelInterval: 1,
                            interval: 1,
							ranges: [{
							 name: 'range1',
							 brush:'red',
							 startValue:"0",
							 endValue: item.RewardPoints
							},
							{
							 name: 'range2',
							 brush:'grey',
							 startValue: item.RewardPoints,
							 endValue:"5"
							}]
                        });
						}
                    });
                },                
                caption: text
            });
			
	},
	
	// Community-wise Reward Points.
	soapRewardsByCommunity: function (containerId, functionName) 
	{
        var that = this;
        var url = "http://134.193.136.38/aspnet_client/Group5/WebSite5/WebService.asmx";
		var pl = new SOAPClientParameters();
        var result;
		this.soapMethod = functionName;

		pl = this.soapRefresh(false, true, pl);

		SOAPClient.invoke(url, functionName, pl, false, function (r) 
		{
			result = r;
            if (that.soapContainer) 
			{
                that.soapContainer.innerHTML = r;
            }
        });
		
		var householdsize1 = localStorage.getItem("householdsize");
		var zipcode1 = localStorage.getItem("zipcode");
		
		document.getElementById('utilitybilluser').value='';
		document.getElementById('monthuser').value='January';
		document.getElementById('yearuser').value='2013';
		
		document.getElementById('divCompute').style.display = 'none';
		document.getElementById('divCompute1').style.display = 'none';
				
		document.getElementById('divGrid').style.display = 'none';

		
		//var arr = [];
		//arr = JSON.parse(result);
		//result = '[{"user_name1":"pavani1","community":"lions","housetype":"Condo","RewardPoints":"5"},{"user_name1":"pavani2","community":"lions","housetype":"Apartment","RewardPoints":"5"},{"user_name1":"pavani3","community":"lions","housetype":"Apartment","RewardPoints":"5"},{"user_name1":"pavani4","community":"lions","housetype":"Apartment","RewardPoints":"1"}]';
		var data = [];
		var winner;
		data = JSON.parse(result);
		localStorage.clear('communityDetails');
		localStorage.setItem( 'communityDetails', JSON.stringify(data));
		
		var url = location.href;
		var baseURL = url.replace('ComputeRewards.htm','');
		window.location.href = baseURL + "CommunitiesOnMap.htm";

	},

	// Username and Password Verification.
	pwdverify: function(result)
	{
		var that = this;
		var res;
		//var displayname = 'pslp';
		
		
		if (result == 'user not exists')
		{
			document.getElementById("res").innerHTML = '* Invalid ID or Password. Please re-enter';
		}
		else
		{
			var url = location.href;
			var baseURL = url.replace('login.htm','');
			window.location.href = baseURL + "index.html";
		}

	},

	soapRefresh: function (load, displayResult, pl) 
	{				

        switch (this.soapMethod) 
		{
			case "GetUserData":
					
					pl.add("user_name1", document.getElementById("username").value);
					pl.add("password", document.getElementById("password").value);
			break;
			
			case "InsertUserData":

					pl.add("user_name1", document.getElementById("username").value);
					pl.add("email", document.getElementById("email").value);
					pl.add("password", document.getElementById("password").value);
					pl.add("password_confirm", document.getElementById("password_confirm").value);
					pl.add("address", document.getElementById("address").value);
					pl.add("phonenumber", document.getElementById('phonenumber').value);
			break;

			case "SelectMyCommunity":
					
					pl.add("user_name1", document.getElementById("userNameCommunity").value);
					pl.add("month", document.getElementById("month").value);
					pl.add("year", document.getElementById("year").value);
			break;
			
			case "InsertMyCommunity":
			
					pl.add("user_name1", document.getElementById("userNameCommunity").value);
					pl.add("householdsize", document.getElementById("householdsize").value);
					pl.add("householdmembers", document.getElementById("householdmembers").value);
					pl.add("housetype", document.getElementById("housetype").value);
					pl.add("community", document.getElementById("community").value);
					
					pl.add("street", document.getElementById("streetaddress").value);
					pl.add("city", document.getElementById("city").value);
					pl.add("state", document.getElementById("state").value);
					pl.add("zipcode", document.getElementById("zipcode").value);
					pl.add("latitude", document.getElementById("latitude").value);
					pl.add("longitude", document.getElementById("longitude").value);
					
			break;
			
			case "selectCommunity":
					
					pl.add("user_name1", document.getElementById("userNameCommunity").value);
			
			break;
			
			case "CalculateRewardPoints":
					
					pl.add("user_name1", document.getElementById("userNameCommunity").value);
					pl.add("utilitybill", document.getElementById("utilitybilluser").value);
					pl.add("month", document.getElementById("monthuser").value);
					pl.add("year", document.getElementById("yearuser").value);
					
			break;
			
			case "CommunityRewardPoints":
					
					pl.add("username", document.getElementById("userNameCommunity").value);
					pl.add("month", document.getElementById("month").value);
					pl.add("year", document.getElementById("year").value);
					
			break;

			case "RewardPointsByCommunity":
					
					pl.add("month", document.getElementById("monthcomn").value);
					pl.add("year", document.getElementById("yearcomn").value);
					
			break;
			
		}
		return pl;
	}
}
	
var myMap = new MyMap();
