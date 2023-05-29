//import "./styles.css";
import { useEffect, useState } from "react";

export default function HomeLoad() {
  return (
    <div className="App">
      <LoadDataFromServer />
    </div>
  );
}

function LoadDataFromServer() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);

    // Imaginary function that performs an API call to load
    // data from a server
    const data = await apiCall();
    setData(data);

    setLoading(false);
  }

  // loadData is the function that is ran
  // An empty dependency array means this code is ran
  // once when the page loads
  useEffect(() => {
    loadData();
  }, []);

  return <div>{loading ? "Loading..." : data}</div>;
}

async function apiCall() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Hello, from blockchain"), 5000);
  });
}
