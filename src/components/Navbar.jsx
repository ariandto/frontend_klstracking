import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';
import jwtDecode from 'jwt-decode';
import {
  HiOutlineHome,
  HiOutlineInbox,
  HiOutlineLogout,
  HiOutlineUser,
} from 'react-icons/hi';
import { FiMenu, FiX } from 'react-icons/fi';
import { LuMonitorPause,LuSettings2 } from "react-icons/lu";
import { MdContactPhone } from "react-icons/md";
import AutoRefresh from './AutoRefresh.tsx';

const Navbar = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDropdownClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/token`);
      const newToken = response.data.accessToken;
      const decoded = jwtDecode(newToken);
      setName(decoded.name);
      setRole(decoded.role);
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const Logout = async () => {
    try {
      await axios.delete(`${apiurl}/logout`);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-800 text-white fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        <img
          src="controltower.png"
          alt="logo"
          className="h-10 cursor-pointer"
          onClick={() => handleMenuClick('/home')}
          aria-label="Home"
        />
        <button
          className="text-white md:hidden text-3xl focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
        <div
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } md:flex md:items-center w-full md:w-auto transition-transform duration-300 ease-in-out`}
        >
          <div className="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0">
            <div className="flex flex-col items-start justify-center md:hidden mt-2">
              <span className="text-sm">{role}</span>
              <span className="text-sm font-semibold">{name}</span>
            </div>
            <button
              onClick={() => handleMenuClick('/home')}
              className="flex items-center text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
              aria-label="Home"
            >
              <HiOutlineHome className="mr-2 text-lg" />
              Home
            </button>
            <button
              onClick={() => handleMenuClick('/trackingdelivery')}
              className="flex items-center text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
              aria-label="Tracking Delivery"
            >
              <HiOutlineInbox className="mr-2 text-lg" />
              Tracking Delivery
            </button>
            <button
              onClick={() => handleMenuClick('/ondelivery')}
              className="flex items-center text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
              aria-label="Monitoring On Delivery"
            >
              <LuMonitorPause className="mr-2 text-lg" />
              Monitoring On Delivery
            </button>
            <button
              onClick={() => handleMenuClick('/contactms')}
              className="flex items-center text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
              aria-label="Contact MS"
            >
              <MdContactPhone className="mr-2 text-lg" />
              Contact MS
            </button>
            <button
              onClick={() => handleMenuClick('/orderkeyparsing')}
              className="flex items-center text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
              aria-label="Parse Order"
            >
              <HiOutlineLogout className="mr-2 text-lg" />
              Parse Order
            </button>
            <div className="relative">
              <button
                className="flex items-center text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors duration-200"
                onClick={handleDropdownClick}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <LuSettings2 className="mr-2 text-lg" />
                Setting
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg z-10">
                  <button
                    onClick={() => handleMenuClick('/myprofile')}
                    className="block w-full text-gray-700 px-4 py-2 text-sm hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
                    aria-label="Profile"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => {
                      Logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-gray-700 px-4 py-2 text-sm hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="hidden md:flex md:flex-col md:items-end">
          <span className="text-sm">{role}</span>
          <span className="text-sm font-semibold">{name}</span>
        </div>
        <div className="md:flex md:flex-col md:items-end">
          <AutoRefresh/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
