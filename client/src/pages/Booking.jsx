import { useState, useEffect } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"

const specialties = [
    { value: '', label: 'ALL' },
    { value: 'physical_therapy', label: 'Physical Therapy' },
    { value: 'strength_training', label: 'Strength coaching' },
    { value: 'yoga', label: 'Yoga instructor' },
    { value: 'meditation', label: 'Meditation guide' },
]

// JS's Date.getDay() returns 0 for Sunday, 1 for Monday, etc.
// this maps that number onto the day labels your schema actually stores
const dayIndexToLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Booking() {
    const [practitioners, setPractitioners] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeSpecialty, setActiveSpecialty] = useState('')
    const [selected, setSelected] = useState(null)
    const [date, setDate] = useState('')
    const [timeSlot, setTimeSlot] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        setLoading(true)
        const query = activeSpecialty ? `?specialty=${activeSpecialty}` : ''

        api.get(`/practitioners${query}`)
            .then((res) => setPractitioners(res.data))
            .catch(() => setMessage('Could not load practitioners.'))
            .finally(() => setLoading(false))
    }, [activeSpecialty])

    // whenever the member picks a different practitioner, clear any date/time
    // they'd already chosen — a slot valid for one practitioner means nothing for another
    const handleSelectPractitioner = (p) => {
        setSelected(p)
        setDate('')
        setTimeSlot('')
        setMessage('')
    }

    // whenever the date changes, clear the previously picked time slot —
    // it belonged to whatever day was selected before, not this new one
    const handleDateChange = (e) => {
        setDate(e.target.value)
        setTimeSlot('')
    }

    // figure out which day-of-week label this date falls on, then find
    // that day's slots inside the selected practitioner's availability array
    const getSlotsForSelectedDate = () => {
        if (!selected || !date) return null

        const dayLabel = dayIndexToLabel[new Date(date).getUTCDay()]
        const match = selected.availability.find((a) => a.day === dayLabel)
        return match ? match.slots : []
    }

    const availableSlots = getSlotsForSelectedDate()

    const handleBook = async () => {
        if (!selected || !date || !timeSlot) {
            setMessage('Pick a practitioner, date, and time slot first.')
            return
        }

        try {
            await api.post('/bookings', {
                practitioner: selected.user._id,
                date,
                timeSlot,
            })
            setMessage('Booking confirmed! Check My Bookings.')
            setSelected(null)
            setDate('')
            setTimeSlot('')
        } catch (err) {
            setMessage(err.response?.data?.message || 'Booking failed.')
        }
    }

    // today's date in YYYY-MM-DD, used to stop the date picker from allowing the past
    const todayStr = new Date().toISOString().split('T')[0]

    return (
        <div className="min-h-screen bg-bg">
            <Navbar />

            <div className="max-w-6xl mx-auto px-8 pt-6 pb-2">
                <h1 className="font-display text-4xl text-text mb-2">Book a consultation</h1>
                <p className="text-text-muted text-sm">Choose a specialist and a time that works for you.</p>

                <div className="flex flex-wrap gap-3 mt-6 mb-8">
                    {specialties.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => setActiveSpecialty(s.value)}
                            className={`px-4 py-2 rounded-full text-sm border ${activeSpecialty === s.value
                                ? 'bg-accent text-surface border-accent font-semibold'
                                : 'border-border text-text-muted'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 pb-16 grid md:grid-cols-[1.3fr_0.9fr] gap-6">
                <div>
                    {loading && <p className="text-text-muted">Loading practitioners...</p>}

                    {!loading && practitioners.length === 0 && (
                        <p className="text-text-muted">No practitioners found for this specialty yet.</p>
                    )}

                    {practitioners.map((p) => (
                        <div
                            key={p._id}
                            onClick={() => handleSelectPractitioner(p)}
                            className={`flex gap-4 items-center bg-surface border rounded-brand p-4 mb-3 cursor-pointer ${
                                selected?._id === p._id ? 'border-accent' : 'border-border'
                            }`}
                        >
                            <div className="w-13 h-13 rounded-full bg-surface-2 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="font-display text-text text-base">{p.user?.name}</h4>
                                <p className="text-xs text-text-muted">
                                    {p.specialty.replace('_', ' ')} · {p.yearsExperience} yrs experience
                                </p>
                            </div>
                            <div className="text-accent font-semibold text-sm">₹{p.ratePerSession}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-surface border border-border rounded-brand p-6 h-fit sticky top-6">
                    <h4 className="font-display text-text text-base mb-4">
                        {selected ? `Book with ${selected.user?.name}` : 'Select a practitioner'}
                    </h4>

                    {selected && (
                        <>
                            <div className="mb-4">
                                <label className="block text-xs text-text-muted mb-1.5">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    min={todayStr}
                                    onChange={handleDateChange}
                                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-text text-sm"
                                />
                            </div>

                            {date && (
                                <div className="mb-5">
                                    <label className="block text-xs text-text-muted mb-1.5">Time</label>

                                    {availableSlots.length === 0 ? (
                                        <p className="text-sm text-text-muted bg-surface-2 rounded-lg px-3 py-2.5">
                                            Not available on this day. Try a different date.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableSlots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setTimeSlot(slot)}
                                                    className={`text-center py-2 rounded-lg text-xs border ${
                                                        timeSlot === slot
                                                        ? 'bg-accent text-surface border-accent font-semibold'
                                                        : 'border-border text-text-muted'
                                                    }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleBook}
                                disabled={!timeSlot}
                                className="w-full bg-accent text-surface py-3 rounded-brand text-sm font-semibold disabled:opacity-50"
                            >
                                Confirm Booking
                            </button>
                        </>
                    )}

                    {message && <p className="text-sm text-accent-2 mt-4">{message}</p>}
                </div>
            </div>
        </div>
    )
}

export default Booking