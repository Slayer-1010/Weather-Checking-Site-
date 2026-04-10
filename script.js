const apiKey = "6937126fd7dcba08835557746d5dbb8e";

const button = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const historyList = document.getElementById("historyList");

// EVENTS
button.addEventListener("click", handleSearch);
cityInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        handleSearch();
    }
});

// MAIN FUNCTION
function handleSearch() {
    const city = cityInput.value.trim();
    if (city === "") return;

    showLoading();
    getWeather(city);
    saveSearchHistory(city);
}

// LOADING UI
function showLoading() {
    document.getElementById("city").innerText = "Loading...";
    document.getElementById("temp").innerText = "";
    document.getElementById("desc").innerText = "";
    document.getElementById("humidity").innerText = "";
    document.getElementById("icon").src = "";
}

// FETCH WEATHER
async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error("City not found");
        }

        // UPDATE UI
        document.getElementById("city").innerText = data.name;
        document.getElementById("temp").innerText = `🌡️ ${data.main.temp}°C`;
        document.getElementById("desc").innerText = `🌥️ ${data.weather[0].description}`;
        document.getElementById("humidity").innerText = `💧 ${data.main.humidity}%`;

        // ICON
        const iconCode = data.weather[0].icon;
        document.getElementById("icon").src =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // BACKGROUND CHANGE
        changeBackground(data.weather[0].main);

    } catch (error) {
        document.getElementById("city").innerText = "❌ City not found";
    }
}

// BACKGROUND CHANGE
function changeBackground(weather) {
    if (weather === "Clear") {
        document.body.style.background =
            "linear-gradient(to right, #fceabb, #f8b500)";
    } else if (weather === "Rain") {
        document.body.style.background =
            "linear-gradient(to right, #4b79a1, #283e51)";
    } else if (weather === "Clouds") {
        document.body.style.background =
            "linear-gradient(to right, #bdc3c7, #2c3e50)";
    } else {
        document.body.style.background =
            "linear-gradient(to right, #00c6ff, #0072ff)";
    }
}

// SAVE HISTORY
function saveSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem("weatherHistory", JSON.stringify(history));
    }

    displayHistory();
}

// DISPLAY HISTORY
function displayHistory() {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    historyList.innerHTML = "";

    history.slice(-5).reverse().forEach(city => {
        const li = document.createElement("li");
        li.innerText = city;

        li.addEventListener("click", () => {
            cityInput.value = city;
            handleSearch();
        });

        historyList.appendChild(li);
    });
}

// LOAD HISTORY ON START
displayHistory();