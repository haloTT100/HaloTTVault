import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { getAllCards, getTest } from "./Api";
import type { ICard } from "./types";

function App() {
  const [serverStatus, setServerStatus] = useState<string>("Checking...");
  const [cards, setCards] = useState<ICard[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAllCards = async () => {
    try {
      const response = await getAllCards();
      setCards(response);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    }
  };

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await getTest();
        console.log("response /get all");
        setServerStatus(response ?? "Server is running");
      } catch (err) {
        setServerStatus("Server is offline");
        console.error(err);
      }
    };

    // Initial load
    fetchAllCards();
    checkServerStatus();

    // Set up polling to check for new cards every 10 seconds
    const cardPollingInterval = setInterval(fetchAllCards, 10000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(cardPollingInterval);
    };
  }, []);

  return (
    <div className="bg-gray-800 min-w-full min-h-screen p-10 text-white">
      <div className="mb-4">
        <div>
          <span className="block">{serverStatus}</span>
          <span className="text-sm text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>
      <Outlet context={{ cards, setCards }} />
    </div>
  );
}

export default App;
