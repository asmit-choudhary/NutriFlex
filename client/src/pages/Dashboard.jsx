import { useState, useEffect, use } from "react"
import api from '../api/axios'
import Navbar from '../components/Navbar'

function Dashboard(){
    const [ bookings, setBookings] = useState([])
    const [ loading, setLoading ] = useState(true)

    const featchBookings = () => {
        setLoading(true)
        api.get('/bookings/practitioner')
            .then((res) => setBookings(res.data))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        featchBookings()
    }, [])

    const updateStatus = async (id, status) => {
        try{
            await api.patch(`/bookings/${id}`, {status})
            featchBookings()
        }catch(err){
            alert(err.response?.data?.message || 'Could not update booking')
        }
    }

    const statusColor = {
        pending: 'text-yellow-700 bg-yellow-100',
        confirmed: 'text-accent-2 bg-green-100',
        completed: 'text-text-muted bg-surface-2',
        cancelled: 'text-red-600 bg-red-100',
    }

    return (
        <div className="min-h-screen bg-bg">
            <Navbar />
            <div className="max-w-4xl mx-auto px-8 py-10">
                <h1 className="font-display text-4xl text-text mb-2">Your Bookings</h1>
                <p className="text-text-muted text-sm mb-8">Manage sessions your clients have booked.</p>

                {loading && <p className="text-text-muted">Loading...</p>}
                {!loading && bookings.length == 0 && (
                    <p className="text-text-muted">No booking yet.</p>
                )}

                {bookings.map((b) => 
                    <div key={b._id} className="bg-surface border border-border rounded-brand p-5 mb-4 flex items-center justify-center flex-wrap gap-4">
                        <div>
                            <h4 className="font-display text-text text-base">{b.member?.name}</h4>
                            <p className="text-xs text-text-muted">{b.member?.email}</p>
                            <p className="text-sm text-text mt-1">
                                {new Date(b.date).toLocaleDateString()} at {b.timeSlot}
                            </p>
                            {b.notes && <p className="text-xs text-text-muted mt-1">{b.notes}</p>}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColor[b.status]}`}>
                                {b.status}
                            </span>

                            {b.status === 'pending' && (
                                <>
                                    <button 
                                        onClick={() => updateStatus(b._id, 'confirmed')}
                                        className="text-xs px-3 py-2 rounded-lg bg-accent text-surface font-semibold"
                                    >   
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => updateStatus(b._id, 'cancelled')}
                                        className="text-xs px-3 py-2 rounded-lg border border-border text-text-muted"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}

                            {b.status === 'confirmed' && (
                                <button
                                    onClick={() => updateStatus(b._id, 'completed')}
                                    className="text-xs px-3 py-2 rounded-lg border border-border text-text-muted"
                                >
                                    Mark Completed
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard