
function gUrlParm(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}




function formatTimeZone(offset) {
    const hours = Math.floor(Math.abs(offset) / 3600);
    const minutes = Math.floor((Math.abs(offset) % 3600) / 60);
    const sign = offset >= 0 ? '+' : '-';
    return `GMT ${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
}


function degtodic(degrees) {
    const directions = ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Function to fetch and display weather data
function getAndDisplayData() {
    const latitude = parseFloat(gUrlParm('lat'));
    const longitude = parseFloat(gUrlParm('lon'));

    const apiKey = '5877846f0524ff38ab7a9e4bdc96a0fb'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const location = data.name;
            const windSpeed = (data.wind.speed * 3.6).toFixed(2); // Convert m/s to km/h
            const humidity = data.main.humidity;
            const timeOffset = data.timezone;
            const pressure = (data.main.pressure / 1013.25).toFixed(2); // Convert hPa to atm
            const windDirectionDegrees = data.wind.deg;
            const windDirection = degtodic(windDirectionDegrees);

            // Fetch UV Index data
            const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
            fetch(uvUrl)
                .then(uvResponse => uvResponse.json())
                .then(uvData => {
                    const uvIndex = uvData.value;
                    const feelsLike = (data.main.feels_like - 273.15).toFixed(2); // Convert Kelvin to Celsius
                    document.getElementById("lat").innerHTML=`Lat: ${latitude}`;
                    document.getElementById("lon").innerHTML=`Lat: ${longitude}`;

                    document.getElementById("maping").innerHTML=`<iframe 
                    width="1305" 
                    height="683" 
                    frameborder="0" 
                    scrolling="no" 
                    marginheight="0" 
                    marginwidth="0" 
                    src="https://maps.google.com/maps?q=+${latitude}+,+${longitude}+&hl=es&z=14&amp;output=embed"
                   ><br>`;
                   document.getElementById("A").innerHTML=`Location: ${location}`
                   document.getElementById("B").innerHTML=`Wind Speed: : ${windSpeed}`
                   document.getElementById("C").innerHTML=`Humidity : ${humidity}`
                   document.getElementById("D").innerHTML=`Time Zone : ${formatTimeZone(timeOffset)}`
                   document.getElementById("E").innerHTML=`Pressure: ${pressure}`
                   document.getElementById("F").innerHTML=`Wind Direction : ${windDirection}`
                   document.getElementById("G").innerHTML=`UV Index : ${uvIndex}`
                   document.getElementById("H").innerHTML=`Feels like: ${feelsLike}`

                    document.getElementById('weatherData').innerHTML = weatherData;
                })
                .catch(uvError => {
                    console.error('Unable to fetch UV Index data:', uvError);
                });
        })
        .catch(error => {
            console.error('Unable to fetch weather data:', error);
        });
}

function getLocation() {
 
    navigator.geolocation.getCurrentPosition(
        position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            window.location.href = `homepage.html?lat=${latitude}&lon=${longitude}`;
        },
        error => {
            console.error('Error getting location:', error.message);
        }
    );
}


const getLocationButton = document.getElementById('getLocationButton');
if (getLocationButton) {
    getLocationButton.addEventListener('click', getLocation);
}
