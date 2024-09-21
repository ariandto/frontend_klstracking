import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AutoRefresh = () => {
  const [isAutoRefreshOn, setIsAutoRefreshOn] = useState(() => {
    // Initialize state from localStorage, defaulting to false if not set
    return localStorage.getItem("isAutoRefreshOn") === "true";
  });

  const [showNotification, setShowNotification] = useState("");
  const navigate = useNavigate();
  const [isHomePage, setIsHomePage] = useState(window.location.pathname === "/home");

  useEffect(() => {
    // Save the current state to localStorage whenever it changes
    localStorage.setItem("isAutoRefreshOn", isAutoRefreshOn.toString());

    // Update isHomePage state whenever the path changes
    setIsHomePage(window.location.pathname === "/home");

    if (isAutoRefreshOn && isHomePage) {
      // Set up the auto-refresh interval when the toggle is on
      const intervalId = setInterval(() => {
        window.location.reload();
      }, 30000); // 10 seconds

      // Clear the interval on component unmount or if the state changes
      return () => clearInterval(intervalId);
    }
  }, [isAutoRefreshOn, isHomePage, navigate]);

  useEffect(() => {
    if (showNotification) {
      // Hide the notification after 3 seconds
      const timeoutId = setTimeout(() => {
        setShowNotification("");
      }, 3000);

      // Clear the timeout if the component unmounts or the state changes
      return () => clearTimeout(timeoutId);
    }
  }, [showNotification]);

  const handleToggle = () => {
    if (isHomePage) {
      setIsAutoRefreshOn(prevState => !prevState); // Toggle the state
      setShowNotification(isAutoRefreshOn ? "Auto-refresh disabled" : "Auto-refresh enabled"); // Show the notification
    } else {
      setShowNotification("Auto-refresh can only be enabled on the home page"); // Show warning
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-transparent rounded shadow w-20 mx-auto mt-0">
      {showNotification && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className={`p-3 ${isHomePage ? "bg-blue-500" : "bg-red-500"} text-white rounded shadow`}>
            {showNotification}
          </div>
        </div>
      )}
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isAutoRefreshOn}
          onChange={handleToggle}
          className="sr-only"
        />
        <div className="w-9 h-5 bg-white rounded-full relative">
          <div
            className={`absolute w-4 h-4 bg-yellow-500 border rounded-full transition-transform ${
              isAutoRefreshOn ? "transform translate-x-4 bg-green-600" : ""
            }`}
          ></div>
        </div>
        <span className={`ml-2 text-sm text-left ${isAutoRefreshOn ? "text-white" : "text-gray-100"}`}>
          {isAutoRefreshOn ? "ON" : "OFF"}
        </span>
      </label>
    </div>
  );
};

export default AutoRefresh;
