import { useEffect, useState } from "react";
import searchIcon from "./assets/searchIcon.svg";
import axios from "axios";
import {WEATHER_API, GEOCODE_API} from "./config.js";

function App() {
  const [location, setLocation] = useState({
    lat: 28.9010899,
    lon: 76.5801935,
    display_name : "Rohtak"
  });
  const [address, setAddress] = useState("");
  const [data, setData] = useState(null);

  
  const fetchWeatherData = async (latitude,longitude) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const searchCoOrdinates = async (inputValue) => {
    try {
      const response = await axios.get(
        `https://geocode.maps.co/search?q=${inputValue}&api_key=${GEOCODE_API}`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        setLocation({ lat, lon, display_name });
        fetchWeatherData(lat, lon);
      } else {
        alert("No results found for the specified location!!");
        console.warn("No results found for the specified city.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };


  const handleSearch = async (event) => {
    event.preventDefault();
    if(address){
    await searchCoOrdinates(address);
    }
  };

  useEffect(() => {
    searchCoOrdinates("Rohtak");
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[url('./assets/weather.jpg')] bg-cover bg-center bg-fixed">
      <div className="relative w-full max-w-xs mx-auto my-4">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search City"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-full w-full px-4 py-2 pl-10 pr-4 text-lg font-semibold"
          />
          <button
            type="submit"
            className="w-6 h-6 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <img src={searchIcon} alt="search" />
          </button>
        </form>
      </div>
      <div className="flex flex-col items-start mx-5 my-3 justify-center gap-4">
        <span className="text-white text-xl font-semibold">{location?.display_name}</span>
        <h1 className="text-white text-8xl font-extrabold">{Math.ceil(((data?.main?.temp-273.15) * 100)/100)}°C</h1>
      </div>
      <div class="flex items-center justify-around absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4 w-full lg:w-1/2 max-w-lg p-2 bg-white/20 rounded-3xl shadow-lg">
        <div className="flex flex-col items-center">
          <span className="text-white font-semibold text-2xl">{Math.ceil(((data?.main?.feels_like-273.15) * 100)/100)}°C</span>
          <span className="text-gray-500 font-semibold  text-xl">Feels Like</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white font-semibold text-2xl">{data?.main?.humidity}%</span>
          <span className="text-gray-500 font-semibold text-xl">Humidity</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white font-semibold text-2xl">{Math.ceil(data?.wind?.speed*3.6)} km/h</span>
          <span className="text-gray-500 font-semibold text-xl">Wind Speed</span>
        </div>
      </div>
      <span className="absolute right-0 top-1/3 transform -translate-y-1/2 -rotate-90 text-white text-2xl font-bold">
      {data?.weather?.[0].main}
      </span>
    </div>
  );
}

export default App;
