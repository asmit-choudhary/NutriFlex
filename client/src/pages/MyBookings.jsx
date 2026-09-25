import { useState, useEffect, use } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bookings/me")
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = {
    pending: "text-yellow-700 bg-yellow-100",
    confirmed: "text-accent-2 bg-green-100",
    completed: "text-text-muted bg-surface-2",
    cancelled: "text-red-600 bg-red-100",
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-8 py-10">
        <h1 className="font-display text-4xl text-text mb-2">Your sessions</h1>
        <p className="text-text-muted text-sm mb-8">
          Everything you've booked.
        </p>

        {loading && <p className="text-text-muted">Loading...</p>}
        {!loading && bookings.length === 0 && (
          <p className="text-text-muted">
            No bookings yet — head to Consultancy to book one.
          </p>
        )}

        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-surface border border-border rounded-brand p-5 mb-4 flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <h4 className="font-display text-text text-base">
                {b.practitioner?.name}
              </h4>
              <p className="text-sm text-text mt-1">
                {new Date(b.date).toLocaleDateString()} at {b.timeSlot}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[b.status]}`}
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;
