import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Context/loginStatus";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faTemperatureLow, faTachometerAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import 'remixicon/fonts/remixicon.css';
import debounce from 'lodash.debounce';

function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [city, setCity] = useState("mumbai");
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loggedData, setLoggedData] = useState(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return JSON.parse(localStorage.getItem(currentUser.email)) || {};
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchWeatherData = async (city, setData, setError, setLoading) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fe9a4eca9695123b1540b7dfe4d7a691&units=metric`);
      const data = await response.json();
      if (data.cod === 200) {
        setData(data);
        setError(null);
      } else {
        setData(null);
        setError("City not found");
      }
    } catch (error) {
      setData(null);
      setError("An error occurred");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeatherData(city, setApiData, setError, setLoading);
    const interval = setInterval(() => {
      fetchWeatherData(city, setApiData, setError, setLoading);
    }, 2000);
    return () => clearInterval(interval);
  }, [city]);

  const debouncedFetchWeatherData = useCallback(
    debounce((city) => {
      setSearchLoading(true);
      setSearchError(null);
      fetchWeatherData(city, setSearchData, setSearchError, setSearchLoading);
    }, 1000),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchCity(value);
    debouncedFetchWeatherData(value);
  };

  const handleLogData = () => {
    if (searchData) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const timestamp = new Date().toLocaleString();
      const newData = { ...loggedData };
      const cityName = searchData.name.toString(); // Ensure city name is a string
      if (!newData[cityName]) {
        newData[cityName] = [];
      }
      newData[cityName].push({ ...searchData, timestamp });
      setLoggedData(newData);
      localStorage.setItem(currentUser.email, JSON.stringify(newData));
    }
  };

  const handleDeleteLog = (city, index) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const newData = { ...loggedData };
    newData[city].splice(index, 1);
    if (newData[city].length === 0) {
      delete newData[city];
    }
    setLoggedData(newData);
    localStorage.setItem(currentUser.email, JSON.stringify(newData));
  };

  const [user, setUser] = useState(null);
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userEmail = currentUser?.email;
    fetch(`http://localhost:3000/users?email=${userEmail}`, { method: 'GET' })
      .then((response) => response.json())
      .then((data) => setUser(data[0]?.name || 'Guest'));
  }, []);

  return (
    <div className="bg-[#f0f0f0] pb-4 min-h-screen relative">
      <h1 style={{ color: 'rgb(246,164,31)', margin: '0', padding: '10px', textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', backgroundColor: '#f0f0f0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Weather App
        <span style={{ fontSize: '1rem', fontStyle: 'italic', marginLeft: '10px', verticalAlign: 'sub' }}>powered by Eduvance</span>
      </h1>
      <div className="absolute top-0 right-0 m-4 mr-9 group">
        <FontAwesomeIcon
          icon={faUser}
          size="lg"
          className="w-8 h-8 rounded-full bg-white p-2 text-gray-800"
          style={{ color: "rgb(246,164,31)", cursor: "pointer" }}
        />
        <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-lg transition-opacity duration-300 transition-delay-150 ease-in-out opacity-0 group-hover:opacity-100 visibility-hidden group-hover:visibility-visible">
          <div className="p-2 border-b">{user}</div>
          <button onClick={handleLogout} className="w-full text-left p-2 hover:bg-gray-100">Logout</button>
        </div>
      </div>
      <form className="flex items-center w-fit mx-auto mt-16">
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <i class="ri-map-pin-2-line"></i>
          </div>
          <input
            type="text"
            id="simple-search"
            value={searchCity}
            onChange={handleSearchChange}
            className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search city name..."
            required
          />
        </div>
        <button
          onClick={handleLogData}
          className="p-2.5 w-32 ms-2 text-sm font-medium text-white rounded-lg border border-[rgb(246,164,31)] bg-[rgb(246,164,31)] hover:bg-[rgb(236,154,21)] focus:ring-4 focus:outline-none focus:ring-[rgb(246,164,31)] dark:focus:ring-[rgb(236,154,21)]"
        >
          Log Data
        </button>
      </form>
      {!searchLoading && !searchError && !searchData && (
        <div className="text-center mt-4 text-gray-500 italic">Search preview will be shown here...</div>
      )}

      {searchLoading && <div className="text-center mt-4">Fetching data...</div>}
      {searchError && !searchLoading && <div className="text-red-500 text-center mt-4">{searchError}</div>}
      {searchData && !searchLoading && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md max-w-sm mx-auto">
          <div className="text-xl font-bold mb-2">{searchData.name}</div>
          <div className="flex items-center justify-between">
            <div>
              <i className="ri-celsius-line text-xl"></i> {searchData.main.temp} °C
            </div>
            <div>
              <FontAwesomeIcon icon={faWind} /> {searchData.wind.speed} m/s
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <FontAwesomeIcon icon={faTachometerAlt} /> {searchData.main.pressure} hPa
            </div>
            <div>
              <i className="ri-water-percent-line text-xl"></i> {searchData.main.humidity} %
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <FontAwesomeIcon icon={faTemperatureLow} style={{ color: "#e5ae38" }} /> {searchData.wind.deg} °
            </div>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-2 ml-12">Logged Data</h2>

      <div className="mt-4 p-4 min-w-[20rem] min-h-[20rem] bg-white rounded-lg shadow-md flex justify-center flex-wrap gap-4 w-fit mx-auto">
       <div className="parent-contianer flex-wrap justify-center flex gap-x-4">
       {Object.entries(loggedData).map(([city, data]) => (
          <div key={city}>
            <h3 className=" heading-city text-xl font-semibold border border-gray-400 pt-2.5 p-2.5  bg-[rgb(246,164,31)] text-white text-center mb-2">{city}</h3>
            {Array.isArray(data) && data.map((entry, index) => (
              <div key={index} className="mt-4 p-4 bg-white rounded-lg shadow-md">
                {/* <div className="text-sm font-light mb-2">{entry.name}</div> */}
                <div className="flex items-center gap-5 justify-between ">
                  <div className="child-container">
                    <i className="ri-celsius-line text-xl"></i> temp:{entry.main.temp} °C
                  </div>
                  <div className="child-container">
                    <FontAwesomeIcon icon={faWind} /> wind:{entry.wind.speed} m/s
                  </div>
                </div>
                <div className="flex items-center gap-5 justify-between mt-2 ">
                  <div className="child-container">
                    <FontAwesomeIcon icon={faTachometerAlt} /> pressure: {entry.main.pressure} hPa
                  </div>
                  <div className="child-container">
                    <i className="ri-water-percent-line text-xl"></i> humidity :{entry.main.humidity} %
                  </div>
                </div>
                <div className="flex items-center gap-5 justify-between mt-2 ">
                  <div className="child-container">
                    <FontAwesomeIcon icon={faTemperatureLow} style={{ color: "#e5ae38" }} />wind deg: {entry.wind.deg} °
                  </div>
                </div>
                <div className="flex items-center gap-5 justify-between mt-2 ">
                  <div className="child-container">
                    Timestamp: {entry.timestamp}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteLog(city, index)}
                  className="p-2.5 ms-2 text-sm font-medium text-white rounded-lg border border-red-500 bg-red-500 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-400 mt-4"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ))}
       </div>
      
      </div>
    </div>
  );
}

export default Home;
