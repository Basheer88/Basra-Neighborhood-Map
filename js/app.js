var map;
var marker = [];

/* Model Data */
var locations = [
    {
        id: 0,
        title: 'basra International Hotel',
        location: {
            lat: 30.517917,
            lng: 47.843642
        },
        img : 'img/bih.png'
    },
    {
        id: 1,
        title: 'Shatt Al Arab',
        location: {
            lat: 30.514559,
            lng: 47.849790
        },
        img : 'img/saa.jpg'
    },
    {
        id: 2,
        title: 'Syriac Catholic Church',
        location: {
            lat: 30.518377,
            lng: 47.837077
        },
        img : 'img/shc.jpg'
    },
    {
        id: 3,
        title: 'Basra Governorate',
        location: {
            lat: 30.511450,
            lng: 47.829625
        },
        img : 'img/bgc.jpg'
    },
    {
        id: 4,
        title: 'University of Basra',
        location: {
            lat: 30.520541,
            lng: 47.841552
        },
        img : 'img/bu.jpg'
    }
];

// google map error handler
function mapError() {
    alert('Google Maps Loading Failed!');
}

// google maps initilizing
function initMap() {
	// Night map style
    var styledNight = new google.maps.StyledMapType(
        [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
        ],
            {name: 'Night'});

	// Bright map style
    var styledLight = new google.maps.StyledMapType(
        [
            {
                featureType: "all",
                elementType: "all",
                stylers: [{saturation: "28"},{lightness: "-2"},{visibility: "on"},{weight: "1.20"}]
            },
            {
                featureType: "landscape.man_made",
                elementType: "all",
                stylers: [{saturation: "-60"},{lightness: "14"}]
            },
            {
                featureType: "water",
                elementType: "all",
                stylers: [{saturation: "80"},{lightness: "-14"}]
            },
            {
                featureType: "water",
                elementType: "labels",
                stylers: [{lightness: "12"}]
            }
        ],
            {name: 'Light'});

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.514786, lng: 47.839236},
        zoom: 15,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain','night','light']
            }
        });
    map.mapTypes.set('night', styledNight);
    map.mapTypes.set('light', styledLight);
  
    ko.applyBindings(new ViewModel());
}


/* View Model */
var ViewModel = function() {
    self.isActive = ko.observable(true);
    self.toggleActive = function(){
       self.isActive(!self.isActive()); //toggle the isActive value between true/false
	 }    
    self.toggleUnActive = function(){
       self.isActive(true); //toggle the isActive value between true/false
	 }

  var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < locations.length; i++) {
        // Create a marker per location, and put into markers array.
        marker[i] = new google.maps.Marker({
            map: map,
            position: locations[i].location,
            title: locations[i].title,
            animation: google.maps.Animation.DROP,
            icon: 'img/markerbaseIcon.png',
            id: i
          });

		var Infowindow = new google.maps.InfoWindow();
        // Create an onclick event to open an infowindow at each marker.
        marker[i].addListener('click', (function(marker, i) {
          return function() {
            if (marker[i].getAnimation() != null) {
              marker[i].setAnimation(null);
              }
            else {
              marker[i].setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function(){ marker[i].setAnimation(null); }, 750);
              }
            populateInfoWindow(this, Infowindow);
          }
        })(marker, i));

        // change marker icon 
        marker[i].addListener('mouseover', function(marker, i) {
            this.setIcon('img/markerOverIcon.png');
        });

        marker[i].addListener('mouseout', function(marker, i) {
            this.setIcon('img/markerbaseIcon.png');
        });
        bounds.extend(marker[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
    
    this.show = function() {
    	google.maps.event.trigger(self.marker[this.id], 'click');
    };

    // Search and filter
    this.inputLocation = ko.observable("");
    this.locationItem = ko.computed(() => {
        var txt = this.inputLocation().toLowerCase();
        return ko.utils.arrayFilter(locations, loca => {
        	// Close any currently opened infowindow.
            if (Infowindow) {
                Infowindow.close();
            }
            // If place is found, then show it in the list as well as on the map.
            var found = loca.title.toLowerCase().indexOf(txt) !== -1;
            marker[loca.id].setVisible(found);
            return found;
        });
    });
};

// function to return wikipedia article
function wikiArticle(cityStr) {
	var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&prop=extracts&exintro&explaintext&callback=wikiCallback';
  // set timeout to prevent waiting forever
  var wikiRequestTimeout = setTimeout(function(){
     $("#here").text('Error Retrieving Wiki Data');
  }, 8000);
  $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      jsonp: "callback",
      success: function( response ) {
          clearTimeout(wikiRequestTimeout);
          $("#here").text(response[2][0]);
      },
      error: function() {
          $("#here").text('Error Retrieving Wiki Data');
      }
  });
};

// populateInfoWindow function
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        wikiArticle(marker.title);
        var WikipediaUrl = marker.title;
        WikipediaUrl = WikipediaUrl.replace(/\s/gi,"_");
        WikipediaUrl = 'https://en.wikipedia.org/wiki/' + WikipediaUrl;
        infowindow.setContent("<div class='infoContainer'><p class='infoTitle'>" + marker.title + "</p><img class='infoImage' src='" + locations[marker.id].img + "'><p class='info' id='here'></p><p class='info'> Source <a target='_blank' href='"+WikipediaUrl+"'>WikiWiki</a></p></div>");
        infowindow.open(map, marker);

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
        	infowindow.marker = null;
        });
    } 
};