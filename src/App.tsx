import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { getAllCards, getTest } from "./Api";
import type { ICard } from "./types";

function App() {
  const [serverStatus, setServerStatus] = useState<string>("Checking...");
  const [cards, setCards] = useState<ICard[]>([]);

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

    const fetchAllCards = async () => {
      try {
        const response = await getAllCards();
        setCards(response);
      } catch (err) {
        console.error("Failed to fetch cards:", err);
      }
    };

    fetchAllCards();
    checkServerStatus();
  }, []);

  return (
    <div className="bg-gray-800 min-w-full min-h-screen p-10 text-white">
      <div className="mb-4">
        <span>{serverStatus}</span>
      </div>
      <Outlet context={{ cards, setCards }} />
    </div>
  );
}

export default App;
