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

//TikTok API Integration: Detailed Documentation
1. Introduction
This document outlines the process of integrating TikTok's API to fetch and display recent videos on a website. It covers the necessary steps, including obtaining access tokens via OAuth 2.0, making API requests, and handling the data.

Objective
To display a company's recent TikTok videos on a webpage by fetching the data using the TikTok API.

2. Overview of TikTok API
TikTok offers a variety of APIs that allow developers to interact with TikTok's platform. The most commonly used APIs include:

API Endpoints
User Authorization: https://www.tiktok.com/auth/authorize/
Access Token: https://www.tiktok.com/auth/token/
Fetch User Videos: /v2/video/list/
Core Concepts
OAuth 2.0: A protocol used to authorize and authenticate users.
Access Token: A token that grants access to a user's data.
Bearer Token: A type of access token used to authenticate requests to the TikTok API.
3. OAuth 2.0: Authorization Process
What is OAuth 2.0?
OAuth 2.0 is an industry-standard protocol used for authorization. It allows third-party applications to obtain limited access to user accounts on an HTTP service, like TikTok, without exposing the user's credentials.

Steps to Obtain an Access Token
User Authorization:

The user is redirected to TikTok's authorization page.
The user logs in and grants permission to the application.
Example URL for Authorization Request:

bash
Copy code
https://www.tiktok.com/auth/authorize/?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=user.info.basic,user.info.email,user.video.list
Receive Authorization Code:

After the user grants permission, TikTok redirects to your specified redirect_uri with an authorization code.
Example:

bash
Copy code
https://yourapp.com/auth?code=AUTH_CODE_FROM_TIKTOK
Exchange Authorization Code for Access Token:

Use the authorization code to request an access token from TikTok.
Example Request:

bash
Copy code
curl -X POST 'https://www.tiktok.com/auth/token/' \
-H 'Content-Type: application/x-www-form-urlencoded' \
-d 'client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code=AUTH_CODE_FROM_TIKTOK&grant_type=authorization_code&redirect_uri=YOUR_REDIRECT_URI'
Example Response:

json
Copy code
{
    "access_token": "YOUR_ACCESS_TOKEN",
    "refresh_token": "YOUR_REFRESH_TOKEN",
    "expires_in": 86400
}
Use the Access Token to Make API Requests:

The access token is included in the Authorization header as a Bearer token to authenticate API requests.
4. TikTok API: Fetching User Videos
Endpoint: /v2/video/list/
This endpoint allows you to fetch a list of the user's most recent videos.

Parameters
fields: Specifies the video details to be retrieved (e.g., id, title, duration, etc.).
max_count: Defines the maximum number of videos to retrieve.
Example API Request
bash
Copy code
curl -L -X POST 'https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
-H 'Content-Type: application/json' \
--data-raw '{
    "max_count": 20
}'
Response Structure
json
Copy code
{
    "data": {
        "videos": [
            {
                "id": "VIDEO_ID",
                "title": "Video Title",
                "video_description": "Video Description",
                "duration": 30,
                "cover_image_url": "https://link-to-cover-image",
                "embed_link": "https://www.tiktok.com/embed/video-id"
            }
        ]
    },
    "error": {
        "code": "ok",
        "message": "",
        "log_id": "20220829194722CBE87ED59D524E727021"
    }
}
Handling the Response
videos: Array containing the video objects with the requested fields.
embed_link: A URL to embed the video on your webpage.
5. Example Implementation: Fetching and Displaying TikTok Videos
Here’s a simple program to fetch TikTok videos using the API and display them on a webpage.

HTML Structure
html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TikTok Video Feed</title>
</head>
<body>
    <div id="tiktok-videos"></div>

    <script src="tiktok.js"></script>
</body>
</html>
JavaScript Code (tiktok.js)
javascript
Copy code
async function fetchTikTokVideos() {
    const response = await fetch('https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "max_count": 5
        })
    });

    const data = await response.json();
    const videoContainer = document.getElementById('tiktok-videos');

    if (data.data && data.data.videos) {
        data.data.videos.forEach(video => {
            const videoElement = document.createElement('iframe');
            videoElement.src = video.embed_link;
            videoElement.width = "300";
            videoElement.height = "400";
            videoContainer.appendChild(videoElement);
        });
    } else {
        videoContainer.innerHTML = "<p>No videos found.</p>";
    }
}

fetchTikTokVideos();
Explanation:
HTML: Creates a container (#tiktok-videos) to hold the video iframes.
JavaScript:
Fetches videos using the TikTok API.
Loops through the videos array and creates an iframe for each video using the embed_link.
Appends each iframe to the container.
6. Token Refresh Process
Tokens expire after a certain period, so it’s essential to refresh them using the refresh_token.

Refresh Token Request
bash
Copy code
curl -X POST 'https://www.tiktok.com/auth/token/' \
-H 'Content-Type: application/x-www-form-urlencoded' \
-d 'client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&refresh_token=YOUR_REFRESH_TOKEN&grant_type=refresh_token'
Refresh Response Example
json
Copy code
{
    "access_token": "NEW_ACCESS_TOKEN",
    "expires_in": 86400
}
7. Security Considerations
Keep Access Tokens Secure: Store tokens securely and avoid exposing them in client-side code.
Regular Token Rotation: Regularly refresh tokens to maintain access without requiring the user to reauthorize.
8. Conclusion
This document provides a comprehensive guide to integrating the TikTok API for fetching and displaying videos on a website. By following the outlined steps and using the provided example code, you can seamlessly incorporate TikTok content into your web application.







1. What is an API?
Definition
API stands for Application Programming Interface. It is a set of rules and tools that allow different software applications to communicate with each other. Think of it as a bridge that connects two applications, enabling them to exchange data and functionality without knowing the details of each other's code.

Real-World Example
Imagine you’re at a restaurant. The menu represents the API, where you can request a dish. You don't need to know how the chef prepares it; you just place your order (make a request), and the server (the API) delivers your dish (response) back to you.

2. How to Fetch Data from an API
Fetching data from an API means making a request to the API server and getting a response, usually in a structured format like JSON or XML.

Different Ways to Fetch API Data
1. Using fetch() in JavaScript
The fetch() function is a modern way to make API requests in JavaScript. It is built into most browsers and allows you to make network requests to retrieve data.

Example:

javascript
Copy code
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
Explanation:

fetch('URL'): Sends a request to the API.
.then(response => response.json()): Converts the response to JSON format.
.then(data => console.log(data)): Logs the received data to the console.
.catch(error => console.error('Error:', error)): Handles any errors that occur during the request.
2. Using axios Library
axios is a popular JavaScript library for making HTTP requests, offering more features and easier syntax compared to fetch().

Example:

javascript
Copy code
axios.get('https://api.example.com/data')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
Explanation:

axios.get('URL'): Sends a GET request to the API.
.then(response => console.log(response.data)): Logs the data from the response.
.catch(error => console.error('Error:', error)): Handles any errors.
3. Using XMLHttpRequest
Before fetch() and axios, XMLHttpRequest was commonly used to make API requests. It's older and more complex but still useful in certain situations.

Example:

javascript
Copy code
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', true);
xhr.onload = function() {
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  } else {
    console.error('Error:', xhr.statusText);
  }
};
xhr.send();
Explanation:

xhr.open('GET', 'URL', true): Initializes a GET request.
xhr.onload: Executes when the request completes successfully.
JSON.parse(xhr.responseText): Converts the response to a JavaScript object.
4. Using cURL in Command Line
cURL is a command-line tool for making network requests. It's often used in server environments.

Example:

bash
Copy code
curl -X GET "https://api.example.com/data"
Explanation:

curl -X GET "URL": Sends a GET request to the API using the command line.
3. Understanding Client Key, Client Secret, and API Key
When working with APIs, you often need to authenticate yourself to access the data. This is where client keys, client secrets, and API keys come in.

1. What is an API Key?
An API key is a unique identifier used to authenticate a request to an API. It's like a password that tells the API that the request is coming from a legitimate source.

Example:

javascript
Copy code
fetch('https://api.example.com/data?api_key=YOUR_API_KEY')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
Explanation:

api_key=YOUR_API_KEY: Includes the API key in the request URL to authenticate.
2. What is a Client Key?
A Client Key is a public identifier for an application. It is used along with the client secret to authenticate API requests, especially in OAuth 2.0 flows.

Example Scenario:

When an app needs to access a user’s data on another service (like accessing Google Drive files), the app first identifies itself using the client key.
3. What is a Client Secret?
A Client Secret is a private key used in conjunction with the client key to secure API requests. It should never be shared publicly and is used to authenticate the identity of the application making the request.

Example Scenario:

The app uses both the client key and client secret to exchange for an access token, which is then used to access the API securely.
Difference Between API Key, Client Key, and Client Secret
API Key: Simple key for identifying the requesting application. Used for straightforward API requests.
Client Key: Public identifier for an application, used in more secure OAuth flows.
Client Secret: Private key that, along with the client key, helps authenticate and secure API requests in OAuth flows.
Example of Using Client Key and Client Secret in OAuth 2.0
Request Authorization Code:
The app redirects the user to the API provider's authorization server with the client key.

Exchange Code for Access Token:
The app exchanges the authorization code for an access token using both the client key and client secret.

Example Request:

bash
Copy code
curl -X POST "https://api.example.com/token" \
-d "client_id=YOUR_CLIENT_KEY" \
-d "client_secret=YOUR_CLIENT_SECRET" \
-d "code=AUTHORIZATION_CODE" \
-d "grant_type=authorization_code"
4. Conclusion
Understanding APIs, how to fetch data, and the role of keys in API authentication is crucial for developers. APIs allow different systems to communicate, and secure access is ensured using API keys, client keys, and client secrets. Depending on the API and the level of security required, you might use simple methods like an API key or more complex methods like OAuth 2.0.

This document provides a comprehensive overview and examples to help you understand these concepts and apply them effectively in your projects.