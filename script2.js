const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';


async function weatherFn(cName) {
    const temp = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(temp);
        const data = await res.json();
        if (res.ok) {
            weatherShowFn(data);
        } else {
            showToast('Sorry', 'City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
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

    console.log(`Updating icon to: ${iconSrc}`); // Debugging line
    $('#weather-icon').attr('src', iconSrc);
    console.log(`Icon src attribute is now: ${$('#weather-icon').attr('src')}`); // Debugging line
}


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
  

//   -----
const temperatureElement = document.getElementById('temperature');

function updateTemperatureColor(temperature) {
    if (temperature < 24) {
        temperatureElement.style.color = '#0066b2';
    } else if (temperature >= 24 && temperature <= 29) {
        temperatureElement.style.color = '#2a52be';
    } else if (temperature >= 30 && temperature <= 35) {
        temperatureElement.style.color = '#FF4500';
    } else if (temperature > 35) {
        temperatureElement.style.color = '#B22222';
    }
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
            const newTemperature = parseInt(temperatureElement.textContent, 10);
            if (!isNaN(newTemperature)) {
                updateTemperatureColor(newTemperature);
            }
        }
    });
});

observer.observe(temperatureElement, {
    characterData: true,
    childList: true,
    subtree: true
});

// Initial color update
updateTemperatureColor(parseInt(temperatureElement.textContent, 10));


// toast notification
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
        }, 500); // Allow for the exit transition before removing from DOM
    }, 3000); // Display for 3 seconds

    toast.find('.toast-close').click(() => {
        toast.removeClass('active');
        setTimeout(() => {
            toast.remove();
        }, 500); // Allow for the exit transition before removing from DOM
    });
}