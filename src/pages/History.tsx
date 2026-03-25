import { useEffect, useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const History = () => {
  const [historyData, setHistoryData] = useState([]);

  // ✅ Fetch history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("https://vawashbackend.onrender.com/history");
        const data = await res.json();
        setHistoryData(data);
      } catch {
        console.log("Backend not running");
      }
    };

    fetchHistory();
  }, []);

  const totalSpent = historyData.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Wash History</h1>
        <p className="text-sm text-muted-foreground">Your recent bike washes</p>
      </div>

      {/* Summary */}
      <div className="px-6 mb-6">
        <div className="gradient-primary rounded-2xl p-5 text-white">
          <div className="flex justify-between">
            <div>
              <p>Total Washes</p>
              <h2 className="text-2xl font-bold">{historyData.length}</h2>
            </div>
            <div>
              <p>Total Spent</p>
              <h2 className="text-2xl font-bold">₹{totalSpent}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="px-6 space-y-3">
        { historyData
  .sort((a: any, b: any) => b.id - a.id) // 🔥 newest first
  .map((item) => (
          <div key={item.id} className="bg-card p-4 rounded-xl border">

            <div className="flex justify-between">
              <h3 className="font-semibold">{item.packageName}</h3>
              <span>₹{item.price}</span>
            </div>

            <p className="text-xs text-muted-foreground">{item.location}</p>

            <div className="flex justify-between mt-2 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(item.id).toLocaleString()}
              </div>

              <div className="flex items-center gap-1 text-green-500">
                <CheckCircle2 className="w-3 h-3" />
                Done
              </div>
            </div>

          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default History;