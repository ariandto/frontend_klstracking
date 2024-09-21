import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import CircularProgress from "./CircularProgress.tsx";
import { apiurl } from "./api/config";
import {
  FaCheckCircle,
  FaTruck,
  FaCalendarAlt,
  FaClipboardList,
  FaPercentage,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./Home.css";
import KLSLogo from "./images/Kawanlamasolusi.png";
import KrisbowLogo from "./images/krisbow.png";
import DetailPending from "./DetailPending.tsx";
import AutoRefresh from "./AutoRefresh.tsx";

// Define interfaces for the data types
interface DashboardItem {
  ID: string;
  DeliveryDate: string;
  Order_Customer: string;
  Cust_Delivered: number;
  Cust_On_Delivery: number;
  Percent_Delivered: number;
  Percent_OnDelivery: number;
  Customer_Pending: number;
}

interface DeliveryItem {
  ARMADA: string;
}

interface ArmadaItem {
  Armada: string;
}

interface DecodedToken {
  exp: number;
}

const Home: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [expire, setExpire] = useState<number>(0);
  const [dashboardData, setDashboardData] = useState<DashboardItem[]>([]);
  const [deliveryData, setDeliveryData] = useState<DeliveryItem[]>([]);
  const [armadaData, setArmadaData] = useState<ArmadaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [animate, setAnimate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (token) {
        try {
          const dashboardResponse = await axios.get<DashboardItem[]>(
            `${apiurl}/dashboard`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setDashboardData(dashboardResponse.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load data");
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [token]);

  const fetchDeliveryData = async () => {
    if (token) {
      try {
        const deliveryResponse = await axios.get<DeliveryItem[]>(
          `${apiurl}/deliveries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDeliveryData(deliveryResponse.data);
      } catch (error) {
        console.error("Error fetching delivery data:", error);
        setError("Failed to load delivery data");
      }
    }
  };

  useEffect(() => {
    fetchDeliveryData();
  }, [token]);

  const fetchArmadaData = async () => {
    if (token) {
      try {
        const armadaResponse = await axios.get<ArmadaItem[]>(
          `${apiurl}/armada`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setArmadaData(armadaResponse.data);
      } catch (error) {
        console.error("Error fetching armada data:", error);
        setError("Failed to load armada data");
      }
    }
  };

  useEffect(() => {
    fetchArmadaData();
  }, [token]);

   // Show armada data
  const showArmadaData = new Set(armadaData.map((item) => item.Armada));

  // Calculate total delivered and on delivery from dashboard data
  const totalDelivered = dashboardData.reduce(
    (total, item) => total + item.Cust_Delivered,
    0
  );
  const totalOnDelivery = dashboardData.reduce(
    (total, item) => total + item.Cust_On_Delivery,
    0
  );

 

  return (
    <div className="container mx-auto p-6 flex flex-col gap-8 mb-10">
  <div className="rounded-lg p-6">
    <div className="flex flex-col items-start mb-4">
      <div className="flex items-center justify-between w-full">
      <img src={KLSLogo} alt="KLS Logo" className="klslogo h-16 md:h-28 w-auto" />
        <h2 className="textdashboard text-lg sm:text-xl md:text-2xl font-bold text-orange-600">
          Delivery Monitoring Customer Industrial Jababeka
        </h2>
        <img src={KrisbowLogo} alt="Krisbow Logo" className="krisbowlogo h-12 md:h-20 w-auto" />
        
      </div>
      
    </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="tabledashboard w-full bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-4 border text-center text-blue-700 font-extrabold">
                      <FaCalendarAlt className="inline-block mr-2 text-blue-700 font-extrabold" /> Delivery
                      Date
                    </th>
                    <th className="py-2 px-4 border text-center text-red-700 font-extrabold">
                      <FaClipboardList className="inline-block mr-2 text-red-700 font-extrabold" /> Order
                    </th>
                    <th className="py-2 px-4 border text-center text-green-700 font-extrabold">
                      <FaCheckCircle className="inline-block mr-2 text-green-700 font-extrabold" /> Delivered
                    </th>
                    <th className="py-2 px-4 border text-center text-orange-500 font-extrabold">
                      <FaTruck className="inline-block mr-2 text-orange-500 font-extrabold" /> On Delivery
                    </th>
                    <th className="py-2 px-4 border text-center text-green-500 font-extrabold">
                      <FaPercentage className="inline-block mr-2 text-green-500 font-extrabold" /> % Delivered
                    </th>
                    <th className="py-2 px-4 border text-center text-blue-500 font-extrabold">
                      <FaPercentage className="inline-block mr-2 text-blue-500 font-extrabold" /> % On Delivery
                    </th>
                    <th className="py-2 px-4 border text-center text-red-500 font-extrabold">
                      <FaExclamationTriangle className="inline-block mr-2 text-red-500 font-extrabold" /> Pending
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.length > 0 ? (
                    dashboardData.map((item) => (
                      <tr key={item.ID} className="text-gray-700">
                        <td className="py-2 px-4 border text-center font-extrabold">
                          {formatDate(item.DeliveryDate)}
                        </td>
                        <td className="py-2 px-4 border text-center font-extrabold">
                          {item.Order_Customer}
                        </td>
                        <td className="py-2 px-4 border text-center font-extrabold">
                          {item.Cust_Delivered}
                        </td>
                        <td className="py-2 px-4 border text-center font-extrabold">
                          {item.Cust_On_Delivery}
                        </td>
                        <td className="py-2 px-4 border text-center font-extrabold">
                          {`${(item.Percent_Delivered * 100).toFixed(2)}%`}
                        </td>
                        <td className="py-2 px-4 border text-center font-extrabold">
                          {`${(item.Percent_OnDelivery * 100).toFixed(2)}%`}
                        </td>
                        <td className="py-2 px-4 border text-center font-extrabold">
                          {item.Customer_Pending}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

    
            
            <div className="relative mb-6 flex items-center justify-center space-x-6">
  <div className="relative flex items-center">
  <FaTruck className="text-blue-500 text-6xl md:text-9xl ml-6 mt-4" /> {/* Ikon truk besar */}
    <span className="absolute inset-0 flex items-center justify-center text-white text-4xl font-extrabold mr-2">
      {[...showArmadaData].join(", ")} {/* Gabungkan dan tampilkan data ARMADA */}
    </span>
  </div>
  
  <div className="flex space-x-6">
    {dashboardData.map((item) => (
      <React.Fragment key={item.ID}>
        <div className="py-2 px-4 text-center mt-5">
          <CircularProgress
            percentage={item.Percent_Delivered * 100}
            size={150}
            color="#4dbd74"
            trailColor="#d9d9d9"
          />
          <div className="mt-2 text-sm font-bold text-center">Delivered</div>
        </div>
        <div className="py-2 px-4 text-center mt-5">
          <CircularProgress
            percentage={item.Percent_OnDelivery * 100}
            size={150}
            color="#4dbd74"
            trailColor="#d9d9d9"
          />
          <div className="mt-2 text-sm font-bold">On Delivery</div>
        </div>
      </React.Fragment>
    ))}
  </div>
</div>



            {dashboardData.map((item) => (
              <div key={item.ID}>
                {/* Delivered Progress Bar */}
                <div className="flex items-center mb-4">
            <FaCheckCircle className="text-green-500 mr-3" size={24} />
            <span className="mr-5 w-32">Delivered</span>
            <div className="relative flex-grow bg-gray-200 rounded-full h-4">
              <div
                className="absolute top-0 left-0 bg-green-500 h-full rounded-full text-dark"
                style={{
                  width: `${(item.Cust_Delivered / item.Order_Customer) * 100}%`,
                }}
              ></div>
              <div
                className="absolute"
                style={{
                  left: `${(item.Cust_Delivered / item.Order_Customer) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <FaCheckCircle className="text-green-500" size={24} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center font-bold">
                {`${((item.Cust_Delivered / item.Order_Customer) * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
  
                {/* On Delivery Progress Bar */}
                <div className="flex items-center">
                <FaTruck className="text-orange-500 mr-3" size={24} />
            <span className="mr-5 w-32">On Delivery</span>
            <div className="relative flex-grow bg-gray-200 rounded-full h-4">
              <div
                className="absolute top-0 left-0 bg-orange-500 h-full rounded-full"
                style={{
                  width: `${(item.Cust_On_Delivery / item.Order_Customer) * 100}%`,
                }}
              ></div>
              <div
                className="absolute"
                style={{
                  left: `calc(${(item.Cust_On_Delivery / item.Order_Customer) * 100}% + 10px)`, // Shift slightly to the right
                  transform: 'translateX(-50%)',
                }}
              >
                <FaTruck className="text-orange-500" size={24} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-dark">
                {`${((item.Cust_On_Delivery / item.Order_Customer) * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
        </div>
            ))}
          </>
        )}
      </div>

      <DetailPending />
    </div>
  );
};

// Helper function to format the date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default Home;
