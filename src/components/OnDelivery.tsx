import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

interface DeliveryData {
  ID: string;
  ORDER_INFO: string;
  CUSTOMER: string;
  DELIVERY_DATE: string;
  DRIVER: string;
  ARMADA: string;
  Delivery_Status: string;
  WA_DRV: string;
  KETERANGAN: string;
}

interface DecodedToken {
  exp: number;
}

const OnDelivery: React.FC = () => {
  const [deliveryData, setDeliveryData] = useState<DeliveryData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [expire, setExpire] = useState<number>(0);
  const [editingItem, setEditingItem] = useState<DeliveryData | null>(null);
  const [keteranganInput, setKeteranganInput] = useState('');
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Refresh token and update state
  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get<{ accessToken: string }>(
        `${apiurl}/token`
      );
      const newToken = response.data.accessToken;
      setToken(newToken);
      const decoded: DecodedToken = jwtDecode(newToken);
      setExpire(decoded.exp);
    } catch (error) {
      console.error("Error refreshing token:", error);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      refreshToken();
    }
  }, [expire, refreshToken]);

  // Fetch delivery data
  const fetchDeliveryData = useCallback(async () => {
    try {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        await refreshToken();
      }
      const response = await axios.get(`${apiurl}/deliveries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeliveryData(response.data);
    } catch (error) {
      console.error('Error fetching delivery data:', error);
    }
  }, [token, expire, refreshToken]);

  useEffect(() => {
    if (token) {
      fetchDeliveryData();
    } else {
      // Retrieve token from somewhere or prompt user to log in
    }
  }, [token, fetchDeliveryData]);

  const handleEdit = (item: DeliveryData) => {
    setEditingItem(item);
    setKeteranganInput(item.KETERANGAN);
  };

  const handleUpdate = async () => {
    if (editingItem) {
      try {
        await axios.put(
          `${apiurl}/deliveries/${editingItem.ORDER_INFO}/keterangan`,
          { KETERANGAN: keteranganInput },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchDeliveryData();
        setEditingItem(null);
        setKeteranganInput('');
      } catch (error) {
        console.error('Error updating keterangan:', error);
      }
    }
  };

  const handleDelete = async (orderInfo: string) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      try {
        await axios.delete(`${apiurl}/deliveries/${orderInfo}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchDeliveryData();
      } catch (error) {
        console.error('Error deleting delivery:', error);
      }
    }
  };

  // Filter items based on search query
  const filteredItems = deliveryData
    .filter((item) => item.Delivery_Status === 'ON DELIVERY') // Only include "On Delivery" items
    .filter((item) =>
      item.ORDER_INFO.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">On Delivery</h1>
      
      <div className="mb-4 flex items-center">
        <div className="relative w-full">
          <FaSearch className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 text-3xl align-baseline mt-1.5" />
          <input
            type="text"
            placeholder="Search by Order Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {['Order Number', 'Customer', 'Delivery Date', 'Driver', 'Armada', 'Delivery Status', 'Keterangan', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 border border-gray-300 text-left text-sm leading-4 font-medium text-gray-700 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.ID}>
                <td className="px-6 py-4 whitespace-no-wrap border border-gray-300">
                  {item.ORDER_INFO}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border border-gray-300">
                  {item.CUSTOMER}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border border-gray-300">
                  {item.DELIVERY_DATE}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border border-gray-300">
                  {item.DRIVER}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border border-gray-300">
                  {item.ARMADA}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border border-gray-300">
                  {item.Delivery_Status}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border border-gray-300">
                  {editingItem?.ID === item.ID ? (
                    <input
                      type="text"
                      value={keteranganInput}
                      onChange={(e) => setKeteranganInput(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    item.KETERANGAN
                  )}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border border-gray-300 text-center">
                  {editingItem?.ID === item.ID ? (
                    <button
                      onClick={handleUpdate}
                      className="text-green-500 hover:text-green-700"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.ORDER_INFO)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OnDelivery;
