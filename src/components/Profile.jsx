import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { name, email } = response.data;
      setName(name);
      setEmail(email);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response && error.response.status === 401) {
        navigate('/');
      }
    }
  }, [token, navigate]);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/token`);
      const newToken = response.data.accessToken;
      setToken(newToken);
      const decoded = jwtDecode(newToken);
      setName(decoded.name);
      setEmail(decoded.email);
      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const init = async () => {
      const newToken = await refreshToken();
      if (newToken) {
        await fetchProfile();
      }
    };
    init();
  }, [fetchProfile, refreshToken]);

  // Handle profile update submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      // Update username
      const profileData = { name, email };
      await axios.put(`${apiurl}/profile/username`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update password if it's provided
      if (newPassword && newPassword === confirmNewPassword) {
        const passwordData = {
          email,
          newPassword,
          confNewPassword: confirmNewPassword,
        };
        await axios.put(`${apiurl}/profile/password`, passwordData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Password updated successfully!');
      } else if (newPassword !== confirmNewPassword) {
        alert('Passwords do not match!');
        return;
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <form onSubmit={handleProfileUpdate} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Change Username or Password</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-700 font-bold mb-2">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmNewPassword" className="block text-gray-700 font-bold mb-2">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
