import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { getTest } from "./Api";

function App() {
  const [serverStatus, setServerStatus] = useState<string>("");

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await getTest();
        setServerStatus("Server is running");
      } catch (error) {
        setServerStatus("Server is offline");
      }
    };

    checkServerStatus();
  }, []);

  console.log(serverStatus);

  return (
    <>
      <div className="bg-gray-800 min-w-full min-h-screen p-10 text-white">
        <Outlet context={"asd"} />
      </div>
    </>
  );
}

export default App;
