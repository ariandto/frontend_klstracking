import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiurl } from "./api/config"; // Pastikan path ini benar
import jwtDecode from "jwt-decode";
import { FaSpinner } from "react-icons/fa"; // Import icon loading dari react-icons
import { useNavigate } from "react-router-dom";

interface ContactSales {
  ID?: string; // ID bersifat opsional untuk record baru
  BU: string;
  SALES: string;
  NOSALES: string;
  TRADINGPARTNER: string;
  MS: string;
  AREA: string;
  AREADIVISI: string;
  KONTAKMS: string;
}

interface ContactSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: ContactSales; // Kontak yang ada untuk editing
  isEditing: boolean;
  fetchContacts: () => void; // Fungsi untuk mengambil kontak setelah simpan/perbarui
}

const ContactSalesModal: React.FC<ContactSalesModalProps> = ({
  isOpen,
  onClose,
  contact,
  isEditing,
//   fetchContacts
}) => {
  const [formData, setFormData] = useState<ContactSales>({
    ID: "",
    BU: "",
    SALES: "",
    NOSALES: "",
    TRADINGPARTNER: "",
    MS: "",
    AREA: "",
    AREADIVISI: "",
    KONTAKMS: ""
  });
  const [token, setToken] = useState<string>("");
  const [expire, setExpire] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false); // State untuk loading
  const navigate = useNavigate();

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    } else {
      setFormData({
        ID: "",
        BU: "",
        SALES: "",
        NOSALES: "",
        TRADINGPARTNER: "",
        MS: "",
        AREA: "",
        AREADIVISI: "",
        KONTAKMS: ""
      });
    }
  }, [contact]);

  const refreshToken = async () => {
    try {
      const response = await axios.get<{ accessToken: string }>(`${apiurl}/token`);
      const newToken = response.data.accessToken;
      setToken(newToken);
      const decoded: { exp: number } = jwtDecode(newToken);
      setExpire(decoded.exp);
    } catch (error) {
      console.error("Error refreshing token:", error);
      alert("Session expired. Please log in again.");
      window.location.href = "/"; // Redirect to login page
    }
  };

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        await refreshToken();
      }
    };

    checkTokenExpiration();
  }, [expire]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.BU || !formData.SALES || !formData.NOSALES || !formData.TRADINGPARTNER) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true); // Tampilkan loading

    try {
      if (isEditing && formData.ID) {
        await axios.put(`${apiurl}/contactsales/${formData.ID}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${apiurl}/contactsales`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setTimeout(() => {
        // fetchContacts();
        onClose();
        setLoading(false);
        navigate("/contactms");
        window.location.href = "/contactms";
      }, 500); // Delay selama 3 detik

    } catch (error) {
      if (error.response?.status === 401) {
        // Token mungkin kedaluwarsa atau tidak valid, refresh token dan coba lagi
        await refreshToken();
        handleSubmit(e); // Coba submit lagi setelah refresh token
      } else {
        console.error("Error saving contact:", error);
        alert("An error occurred while saving the contact. Please try again.");
        setLoading(false); // Sembunyikan loading jika ada error
      }
    }
  };

  if (!isOpen) {
    return null; // Jika modal tidak terbuka, render tidak ada
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Modal content */}
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md mx-auto z-10">
        <h2 className="text-xl font-bold text-blue-500">
          {isEditing ? "Edit Contact Sales" : "Add Contact Sales"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          {/* <div className="mb-4">
            <label className="block text-gray-700">ID</label>
            <input
              type="text"
              name="ID"
              value={formData.ID || ''} // Tampilkan ID jika sedang mengedit
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              disabled={isEditing} // Nonaktifkan field ID saat editing
            />
          </div> */}
          <div className="mb-4">
            <label className="block text-gray-700">BU</label>
            <input
              type="text"
              name="BU"
              value={formData.BU}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">SALES</label>
            <input
              type="text"
              name="SALES"
              value={formData.SALES}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">NOSALES</label>
            <input
              type="text"
              name="NOSALES"
              value={formData.NOSALES}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">TRADING PARTNER</label>
            <input
              type="text"
              name="TRADINGPARTNER"
              value={formData.TRADINGPARTNER}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">MS</label>
            <input
              type="text"
              name="MS"
              value={formData.MS}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">AREA</label>
            <input
              type="text"
              name="AREA"
              value={formData.AREA}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">AREADIVISI</label>
            <input
              type="text"
              name="AREADIVISI"
              value={formData.AREADIVISI}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">KONTAKMS</label>
            <input
              type="text"
              name="KONTAKMS"
              value={formData.KONTAKMS}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading} // Nonaktifkan tombol saat loading
              >
              {loading ? <FaSpinner className="animate-spin" /> : isEditing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactSalesModal;
