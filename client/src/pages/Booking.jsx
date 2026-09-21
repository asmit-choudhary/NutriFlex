import { useState, useEffect } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"

const specialties = [
    { value: '', label: 'ALL'},
    { value: 'physical_therapy', label: 'Physical Therapy' },
    { value: 'strength_training', label: 'Strength coaching' },
    { value: 'yoga', label: 'Yoga instructor' },
    { value: 'meditation', label: 'Meditation guide' },
]

function Booking() {
    const [practitioners, setPractitioners] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeSpecialty, setActiveSpecialty] = useState('')
    const [selected, setSelected] = useState(null)
    const [date, setDate] = useState('')
    const [timeSlot, setTimeSlot] = useState('')
    const [message, setMessage] = useState('')

    // run once on load page and again whenever activeSpecialty changes
    useEffect(() => {
        setLoading(true)
        const query = activeSpecialty ? `?specialty=${activeSpecialty}` : ''

        api.get(`/practitioners${query}`)
            .then((res) => setPractitioners(res.data))
            .catch(() => setMessage('Could not load practitioners.'))
            .finally(() => setLoading(false))
    }, [activeSpecialty])

    const handleBook = async () => {
        if(!selected || !date || !timeSlot){
            setMessage('Pick a practitioner, date, time slot first.')
            return
        }

        try{
            await api.post('/bookings', {
                practitioner: selected.user._id,
                date,
                timeSlot,
            })
            setMessage('Booking confirmed! check you bookings.')
            setSelected(null)
            setDate('')
            setTimeSlot('')
        } catch(err){
            setMessage(err.response?.data?.message || 'Booking Failed.')
        }
    }

    return(
        <div className="min-h-screen bg-bg">
            <Navbar />

            <div className="max-w-6xl mx-auto px-8 pt-6 pb-2">
                <h1 className="font-display text-4xl text-text mb-2">Book a consultantion</h1>
                <p className="text-text-muted text-sm">Choose a specialtist and a time that works for you.</p>

                <div className="flex flex-wrap gap-3 mt-6 mb-8">
                    {specialties.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => setActiveSpecialty(s.value)}
                            className={`px-4 py-2 rounded-full text-sm border ${activeSpecialty == s.value 
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
                {/*practitioners list*/}
                <div>
                    {loading && <p className="text-text-muted">Loading Practitioners...</p>}

                    {!loading && practitioners.length === 0 && (
                        <p className="text-text-muted">No practitioners found for the specialty yet.</p>
                    )}

                    {practitioners.map((p) => (
                        <div 
                            key={p._id}
                            onClick={() => setSelected(p)}
                            className={`flex gap-4 items-center bg-surface border rounded-brand p-4 mb-3 cursor-pointer ${
                                selected?._id == p._id ? 'border-accent' : 'border-border'
                            }`}
                        >
                            <div className="w-13 h-13 rounded-full bg-surface-2 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="font-display text-text text-base">{p.user?.name}</h4>
                                <p className="text-xs text-text-muted">
                                    {p.specialty.replace('_', ' ')} . {p.yearsExperience} yrs experience
                                </p>
                            </div>
                            <div className="text-accent font-semibold text-sm">₹{p.ratePerSession}</div>
                        </div>
                    ))}
                </div>

                {/* Booking panel */}
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
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-text text-sm"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="block text-xs text-text-muted mb-1.5">Time</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['10:00', '11:30', '1:00', '3:30', '5:00', '6:30'].map((slot) => (
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
                            </div>

                            <button
                                onClick={handleBook}
                                className="w-full bg-accent text-surface py-3 rounded-brand text-sm font-semibold"
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
