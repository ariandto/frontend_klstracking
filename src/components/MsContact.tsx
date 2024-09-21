import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiurl } from "./api/config";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import ContactSalesModal from "./ContactSalesModal.tsx";

const MsContact = () => {
  const [contactSales, setContactSales] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchContactSales = async () => {
      try {
        const response = await axios.get(`${apiurl}/contactsales`);
        setContactSales(response.data.data);
      } catch (error) {
        console.error("Error fetching contact sales:", error);
      }
    };

    fetchContactSales();
  }, []);

  const handleDelete = async () => {
    if (contactToDelete) {
      try {
        await axios.delete(`${apiurl}/contactsales/${contactToDelete}`);
        setContactSales(contactSales.filter(contact => contact.ID !== contactToDelete));
        setIsConfirmModalOpen(false);
        setContactToDelete(null);
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  // Filter dan paginasi data
  const filteredContactSales = contactSales.filter(contact =>
    Object.values(contact).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastContact = currentPage * itemsPerPage;
  const indexOfFirstContact = indexOfLastContact - itemsPerPage;
  const currentContacts = filteredContactSales.slice(indexOfFirstContact, indexOfLastContact);

  const totalPages = Math.ceil(filteredContactSales.length / itemsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mt-20 text-sky-700">Contact Sales</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => {
            setSelectedContact(null);
            setIsEditing(false);
            setIsModalOpen(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mt-10 font-extrabold"
        >
          Add New Contact+
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-lg px-4 py-2 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "BU", "SALES", "NOSALES", "TRADINGPARTNER", "MS", "AREA", "AREADIVISI", "KONTAKMS", "Actions"].map(header => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentContacts.length > 0 ? (
              currentContacts.map(contact => (
                <tr key={contact.ID}>
                  {Object.keys(contact).map((key) => (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(contact as any)[key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedContact(contact);
                        setIsEditing(true);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setContactToDelete(contact.ID);
                        setIsConfirmModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                  No contacts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Contact Sales Modal */}
      {isModalOpen && (
        <ContactSalesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isEditing={isEditing}
          contact={selectedContact}
          onSave={(updatedContact) => {
            if (isEditing) {
              // Update contact logic
              setContactSales(contactSales.map(contact =>
                contact.ID === updatedContact.ID ? updatedContact : contact
              ));
            } else {
              // Create contact logic
              setContactSales([...contactSales, updatedContact]);
            }
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Confirm Delete Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
            <p className="mt-2 text-gray-600">Are you sure you want to delete this contact? This action cannot be undone.</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, delete it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MsContact;
