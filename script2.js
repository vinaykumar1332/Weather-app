const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const geocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct';
const reverseGeocodeUrl = 'http://api.openweathermap.org/geo/1.0/reverse';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

async function weatherFn(cName) {
    const temp = `${weatherUrl}?q=${cName}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(temp);
        const data = await res.json();
        if (res.ok) {
            weatherShowFn(data);
            await getGeocodeData(cName); // Fetch and display country and state details
        } else {
            showToast('Error', 'City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showToast('Error', 'Failed to fetch weather data.');
    }
}

async function getGeocodeData(city) {
    const geocode = `${geocodeUrl}?q=${city}&limit=1&appid=${apiKey}`;
    try {
        const res = await fetch(geocode);
        const data = await res.json();
        if (data.length > 0) {
            const location = data[0];
            $('#location').text(`${location.state}, ${location.country}`);
        } else {
            showToast('Error', 'Location details not found.');
        }
    } catch (error) {
        console.error('Error fetching geocode data:', error);
        showToast('Error', 'Failed to fetch location details.');
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    updateWeatherIcon(data.weather[0].description);
    $('#weather-info').fadeIn();
}

function updateWeatherIcon(description) {
    let iconSrc;
    description = description.toLowerCase();

    if (description.includes('clear')) {
        iconSrc = 'icons/sun.png'; // Path to your sun icon
    } else if (description.includes('rain') || description.includes('drizzle')) {
        iconSrc = 'icons/rain.png'; // Path to your rain icon
    } else if (description.includes('cloud')) {
        iconSrc = 'icons/cloud.png'; // Path to your cloud icon
    } else if (description.includes('snow')) {
        iconSrc = 'icons/snow.png'; // Path to your snow icon
    } else if (description.includes('thunderstorm')) {
        iconSrc = 'icons/thunderstorm.png'; // Path to your thunderstorm icon
    } else {
        iconSrc = 'icons/default.png'; // Path to a default icon
    }

    $('#weather-icon').attr('src', iconSrc);
}
function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    const temperature = data.main.temp;
    const temperatureElement = $('#temperature');
    temperatureElement.html(`${temperature}°C`);

    // Set temperature color based on value
    if (temperature < 24) {
        temperatureElement.css('color', 'blue');
    } else if (temperature >= 24 && temperature <= 28) {
        temperatureElement.css('color', '#0076CE');
    } else if (temperature >= 29 && temperature <= 34) {
        temperatureElement.css('color', 'orange');
    } else if (temperature >= 35 && temperature <= 40) {
        temperatureElement.css('color', 'darkorange');
        showToast('Warning', 'Temperature is extremely high. Please stay inside.');
    } else if (temperature > 40) {
        temperatureElement.css('color', 'red');
        showToast('Warning', 'Temperature is extremely high. Please stay inside.');
    }

    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    updateWeatherIcon(data.weather[0].description);
    $('#weather-info').fadeIn();
}

function showToast(title, message) {
    const toast = $(`
        <div class="toast">
            <div class="toast-content">
                <i class="fas fa-exclamation-circle toast-check"></i>
                <div class="message">
                    <span class="message-text text-1">${title}</span>
                    <span class="message-text text-2">${message}</span>
                </div>
            </div>
            <i class="fas fa-times toast-close"></i>
            <div class="progress"></div>
        </div>
    `);

    $('#toast-container').append(toast);

    setTimeout(() => {
        toast.addClass('active');
        toast.find('.progress').addClass('active');
    }, 100); // Allow for the DOM to render before adding the class

    setTimeout(() => {
        toast.removeClass('active');
        setTimeout(() => {
            toast.remove();
            repositionToasts(); // Reposition remaining toasts after one is removed
        }, 500); // Allow for the exit transition before removing from DOM
    }, 3000); // Display for 3 seconds

    toast.find('.toast-close').click(() => {
        toast.removeClass('active');
        setTimeout(() => {
            toast.remove();
            repositionToasts(); // Reposition remaining toasts after one is closed
        }, 500); // Allow for the exit transition before removing from DOM
    });
}

function repositionToasts() {
    const toasts = $('#toast-container .toast');
    let offset = 20; // Initial offset from the top

    toasts.each(function() {
        $(this).css('top', `${offset}px`);
        offset += $(this).outerHeight() + 20; // Adjust offset for next toast
    });
}

//-- geo code

$(document).ready(function () {
    $('#get-location').click(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            showToast('Error', 'Geolocation is not supported by this browser.');
        }
    });
});

async function getWeatherByCoords(lat, lon) {
    const temp = `${weatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(temp);
        const data = await res.json();
        if (res.ok) {
            weatherShowFn(data);
            await getReverseGeocodeData(lat, lon);
        } else {
            showToast('Error', 'Weather data not found for your location.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showToast('Error', 'Failed to fetch weather data.');
    }
}

async function getReverseGeocodeData(lat, lon) {
    const geocode = `${reverseGeocodeUrl}?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    try {
        const res = await fetch(geocode);
        const data = await res.json();
        if (data.length > 0) {
            const location = data[0];
            $('#city-name').text(location.name);
            $('#location').text(`${location.state}, ${location.country}`);
        } else {
            
        }
    } catch (error) {
        console.error('Error fetching reverse geocode data:', error);
        showToast('Error', 'Failed to fetch location details.');
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeatherByCoords(lat, lon);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            showToast('Error', 'User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            showToast('Error', 'Location information is unavailable.');
            break;
        case error.TIMEOUT:
            showToast('Error', 'The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            showToast('Error', 'An unknown error occurred.');
            break;
    }
}



//------------------------------reset filter buttons
  // ---Reset filter 
  function resetInputField() {
	document.getElementById("city-input").value = "";
    const weatherCard = document.getElementById('weather-info');
    weatherCard.style.display='none';
  }



  function resetFilters() {
	const allFacetLists = document.querySelectorAll('.facet-single-selection-list');
  
	allFacetLists.forEach(list => {
	  list.querySelectorAll('.facet-search-filter.has-active-facet .facet-value.active-facet')
		.forEach(facetElement => {
		  // Remove "active-facet" class and uncheck the checkbox
		  facetElement.classList.remove('active-facet');
		  const checkbox = list.querySelector(`input[type="checkbox"][id="${facetElement.id}"]`);
		  if (checkbox) {  
			checkbox.checked = false; // Uncheck the corresponding checkbox
		  }
		});
	});
  }
  
  // Attach event listener to the reset button
  const resetButton = document.querySelector('.reset-filter-button');
  if (resetButton) {

	resetButton.addEventListener('click', (event)=>{
        event.preventDefault();
		resetFilters();
	});
  }


// //right click
// $(document).on({
//     "contextmenu": function (e) {
//         console.log("ctx menu button:", e.which); 

//         // Stop the context menu
//         e.preventDefault();
//     },
//     "mousedown": function(e) { 
//         console.log("normal mouse down:", e.which); 
//     },
//     "mouseup": function(e) { 
//         console.log("normal mouse up:", e.which); 
//     }
// });


//----- empty input
let locationButtonClicked = false;
document.addEventListener('DOMContentLoaded', function() {
    const cityInputBtn = document.getElementById('city-input-btn'); // Replace with your button's ID
    const getLocationBtn = document.getElementById('get-location'); // Replace with your button's ID

    cityInputBtn.addEventListener('click', function() {
        const cityInput = document.getElementById('city-input').value.trim();
        if (!cityInput && !locationButtonClicked) {
            showToast('Error', 'City input field is empty. Please enter a city name.');
        } else {
            locationButtonClicked = false; // Reset the flag
            weatherFn(cityInput); // Call your weather function if the input is not empty
        }
    });
});

//--first - one

async function fetchTikTokVideos() {
    const accessToken = 'your_access_token'; // Replace with your actual access token

    try {
        const response = await fetch('https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                max_count: 20
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch TikTok videos');
        }

        const data = await response.json();
        renderTikTokVideos(data.data.videos);

    } catch (error) {
        console.error('Error fetching TikTok videos:', error);
    }
}

function renderTikTokVideos(videos) {
    const tiktokFeed = document.getElementById('tiktokFeed');

    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video-container');

        videoElement.innerHTML = `
            <h2>${video.title}</h2>
            <p>${video.video_description}</p>
            <img src="${video.cover_image_url}" alt="${video.title}">
            <iframe src="${video.embed_link}&autoplay=1&mute=1" frameborder="0" allowfullscreen></iframe>
        `;

        tiktokFeed.appendChild(videoElement);
    });
}

// Call the function to fetch and display the videos
fetchTikTokVideos();

