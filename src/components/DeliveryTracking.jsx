import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';
import { 
  FaTruck, 
  FaUser, 
  FaCalendarAlt, 
  FaIdBadge, 
  FaCar, 
  FaWhatsapp, 
  FaSalesforce 
} from 'react-icons/fa';

const DeliveryTracking = () => {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [expire, setExpire] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/token`);
      const newToken = response.data.accessToken;
      setToken(newToken);
      const decoded = jwtDecode(newToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      refreshToken();
    }
  }, [expire, refreshToken]);

  const handleInputChange = (e) => {
    setOrderNumber(e.target.value);
  };

  const fetchDeliveryData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiurl}/deliveries/order?order_info=${orderNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDeliveryData(response.data);
      setError(null);
    } catch (err) {
      setError('Delivery record not found');
      setDeliveryData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
        <FaTruck className="mr-3 text-blue-600" /> Tracking Delivery
      </h1>
      <div className="flex flex-col items-center mb-6">
        <input 
          type="text" 
          placeholder="Enter Order Number" 
          value={orderNumber}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded w-full max-w-md mb-3 focus:ring focus:border-blue-500"
        />
        <button 
          onClick={fetchDeliveryData} 
          className="bg-blue-500 text-white px-4 py-2 rounded w-full max-w-md hover:bg-blue-600"
        >
          Track Delivery
        </button>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {deliveryData && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">Delivery Details</h2>
          <div className="flex items-center mb-3">
            <FaTruck className="mr-3 text-blue-600" />
            <p><strong>Order Number:</strong> {deliveryData.ORDER_INFO}</p>
          </div>
          <div className="flex items-center mb-3">
            <FaUser className="mr-3 text-blue-600" />
            <p><strong>Customer:</strong> {deliveryData.CUSTOMER}</p>
          </div>
          <div className="flex items-center mb-3">
            <FaCalendarAlt className="mr-3 text-blue-600" />
            <p><strong>Delivery Date:</strong> {deliveryData.DELIVERY_DATE}</p>
          </div>
          <div className="flex items-center mb-3">
            <FaIdBadge className="mr-3 text-blue-600" />
            <p><strong>Driver:</strong> {deliveryData.DRIVER}</p>
          </div>
          <div className="flex items-center mb-3">
            <FaCar className="mr-3 text-blue-600" />
            <p><strong>Kode Armada:</strong> {deliveryData.ARMADA}</p>
          </div>
          <div className="flex items-center mb-3">
            <FaSalesforce className="mr-3 text-blue-600" />
            <p><strong>Status Pengiriman:</strong> {deliveryData.Delivery_Status}</p>
          </div>
          <div className="flex items-center">
            <FaWhatsapp className="mr-3 text-blue-600" />
            <p>
              <strong>Nomor WhatsApp:</strong> 
              <a 
                href={`https://wa.me/${deliveryData.WA_Drv}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline ml-1"
              >
                {deliveryData.WA_Drv}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;
