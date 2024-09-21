import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiurl } from "./api/config";
import { FaExclamationCircle } from "react-icons/fa";

interface PendingItem {
  Detail_Pending: string;
}

const DetailPending: React.FC = () => {
  const [pendingData, setPendingData] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        const response = await axios.get<PendingItem[]>(`${apiurl}/datapending`);
        setPendingData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending data:", error);
        setError("Failed to load pending data");
        setLoading(false);
      }
    };

    fetchPendingData();
  }, []);

  const formatDetailPending = (detail: string) => {
    return detail.split("||").map((line, index) => (
      <p key={index} className="text-gray-700 text-sm">{line}</p>
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-3 text-left text-orange-600">Detail Pending</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="rounded-lg p-4 max-h-96 overflow-y-auto">
          {pendingData.length > 0 ? (
            pendingData.map((item, index) => (
              <div key={index} className="mb-3 p-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-orange-100 text-orange-600 rounded-full p-1 mr-3">
                    <FaExclamationCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    {formatDetailPending(item.Detail_Pending)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No pending details available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailPending;
