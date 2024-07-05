import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Context/loginStatus";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faTemperatureLow, faTachometerAlt,faUser } from '@fortawesome/free-solid-svg-icons';
import 'remixicon/fonts/remixicon.css';
import debounce from 'lodash.debounce';

function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState(null);
  const [searchData, setSearchData] = useState(null); // Separate state for search data
  const [city, setCity] = useState("mumbai");
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null); // Separate state for search error
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false); // Separate state for search loading
  const [loggedData, setLoggedData] = useState(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return JSON.parse(localStorage.getItem(currentUser.email)) || [];
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
        // searchLoading(true)
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
      const newData = [...loggedData, searchData];
      setLoggedData(newData);
      localStorage.setItem(currentUser.email, JSON.stringify(newData));
    }
  };

  const handleDeleteLog = (index) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const newData = loggedData.filter((_, i) => i !== index);
    setLoggedData(newData);
    localStorage.setItem(currentUser.email, JSON.stringify(newData));
  };

  return (
    <div className="bg-[#f0f0f0] h-screen relative">
      <h1>Home Page</h1>
      <div className="absolute top-0 right-0 m-4 mr-9 group">
      <FontAwesomeIcon icon={faUser} size="lg" className="w-8 h-8 rounded-full bg-white p-2 text-gray-800" style={{ color: "rgb(246,164,31)",cursor: "pointer" }} />  <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-lg transition-opacity duration-300 transition-delay-150 ease-in-out opacity-0 group-hover:opacity-100 visibility-hidden group-hover:visibility-visible">
    <div className="p-2 border-b">
      Username {/* Replace with dynamic username if available */}
    </div>
    <button onClick={handleLogout} className="w-full text-left p-2 hover:bg-gray-100">Logout</button>
  </div>
</div>
      <form className="flex items-center w-fit mx-auto">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
              />
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            value={searchCity}
            onChange={handleSearchChange}
            className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search city name..."
            required
          />{" "}
        </div>
        <button
  onClick={handleLogData}
  className="p-2.5 w-32 ms-2 text-sm font-medium text-white rounded-lg border border-[rgb(246,164,31)] bg-[rgb(246,164,31)] hover:bg-[rgb(236,154,21)] focus:ring-4 focus:outline-none focus:ring-[rgb(246,164,31)] dark:focus:ring-[rgb(236,154,21)]"
>
  Log Data
</button>
      </form>

      {loading && <div className="text-center mt-4">Fetching data...</div>}
      {error && !loading && <div className="text-red-500 text-center mt-4">{error}</div>}
      {apiData && !loading && (
        <div className="mt-4 p-4 bg-white flex rounded-lg shadow-md max-w-sm mx-auto">
          <div className="text-xl font-bold mb-2">{apiData.name}</div>
          <div className="flex items-center justify-between">
            <div>
              <i className="ri-celsius-line text-xl"></i> {apiData.main.temp} °C
            </div>
            <div>
              <FontAwesomeIcon icon={faWind} /> {apiData.wind.speed} m/s
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <FontAwesomeIcon icon={faTachometerAlt} /> {apiData.main.pressure} hPa
            </div>
            <div>
              <i className="ri-water-percent-line text-xl"></i> {apiData.main.humidity} %
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <FontAwesomeIcon icon={faTemperatureLow} style={{ color: "#e5ae38" }} /> {apiData.wind.deg} °
            </div>
          </div>
        </div>
      )}

{/* preview data */}
       {searchLoading && <div className="text-center mt-4">Fetching data...</div>} 
       {searchError && !searchLoading && <div className="text-red-500 text-center mt-4">{searchError}</div>} 
      {searchData && !searchLoading && (
        <div className="mt-4 p-4 bg-white  rounded-lg shadow-md max-w-sm mx-auto">
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
       <h2 className="text-xl  font-bold mb-2">Logged Data</h2>
      <div className="mt-4 p-4   bg-white rounded-lg shadow-md flex-wrap flex gap-4 w-fit mx-auto">
     
      <br>
      </br>

        {loggedData.map((data, index) => (
         <div key={index} className="mt-4 p-4 bg-white rounded-lg shadow-md">
         <div className="text-xl font-bold mb-2">{data.name}</div>
         <div className="flex items-center gap-5 justify-between ">
           <div className="child-container">
             <i className="ri-celsius-line text-xl"></i> temp:{data.main.temp} °C
           </div>
           <div className="child-container">
             <FontAwesomeIcon icon={faWind} /> wind:{data.wind.speed} m/s
           </div>
         </div>
         <div className="flex items-center gap-5 justify-between mt-2 ">
           <div className="child-container">
             <FontAwesomeIcon icon={faTachometerAlt} /> pressure: {data.main.pressure} hPa
           </div>
           <div className="child-container">
             <i className="ri-water-percent-line text-xl"></i> humidity :{data.main.humidity} %
           </div>
         </div>
         <div  className="flex items-center gap-5 justify-between mt-2 ">
           <div className="child-container">
             <FontAwesomeIcon icon={faTemperatureLow} style={{ color: "#e5ae38" }} />wind deg: {data.wind.deg} °
           </div>
         </div>
         <button
           onClick={() => handleDeleteLog(index)}
           className="p-2.5 ms-2 text-sm font-medium text-white rounded-lg border border-red-500 bg-red-500 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-400 mt-4"
         >
           Delete
         </button>
       </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
