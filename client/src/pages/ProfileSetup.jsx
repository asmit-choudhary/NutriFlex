import { useState, useEffect } from "react"
import api from "../api/axios"
import Navbar from "../components/Navbar"

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const specialties = [
    { value: 'yoga', label: 'Yoga' },
    { value: 'strength_training', label: 'Strength training' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'physical_therapy', label: 'Physical therapy' },
]

function ProfileSetup() {
    const [form, setForm] = useState({
        specialty: 'yoga',
        bio: '',
        ratePerSession: '',
        yearsExperience: '',
    })
 
    const [slots, setSlots] = useState({})  // {Mon: '10:00, 11:30', Wed: '09:00'}
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    // load an existing profile into the from, if one exist
    useEffect(() => {
        api.get('/practitioners/profile/me')
            .then((res) => {
                const p = res.data
                if(p) {
                    setForm({
                        specialty: p.specialty,
                        bio: p.bio || '',
                        ratePerSession: p.ratePerSession,
                        yearsExperience: p.yearsExperience,
                    })
                    const loaded = {}
                    p.availability.forEach((a) => {
                        loaded[a.day] = a.slots.join(', ')
                    })
                    setSlots(loaded)
                }
            })
            .finally(() => setLoading(false))    
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')

        // turn { Mon: '10:00, 11:30' } into [{ day: 'Mon', slots: ['10:00', '11:30'] }]
        const availability = days
            .filter((d) => slots[d] && slots[d].trim())
            .map((d) => ({
                day: d,
                slots: slots[d].split(',').map((s) => s.trim()).filter(Boolean),
            }))

        try{
            await api.post('/practitioners/profile', {
                ...form,
                ratePerSession: Number(form.ratePerSession),
                yearsExperience: Number(form.yearsExperience) || 0,
                availability,
            })    
            setMessage('Profile saved. Member can now find and book now.')
        } catch(err) {  
            setMessage(err.response?.data?.message || 'Could not save profile')
        } finally{
            setSaving(false)
        }
    }

    const inputClass = 'w-full px-3.5 py-3 rounded-lg border border-border bg-surface text-text text-sm'

    return (
        <div className="min-h-screen bg-bg">
            <Navbar />
            <div className="max-w-2xl mx-auto px-8 py-10">
                <h1 className="font-display text-4xl text-text mb-2">Your practitioner profile</h1>
                <p className="text-text-muted text-sm mb-8">
                    This is what members see when they browse and book you.
                </p>

                {loading ? (
                    <p className="text-text-muted">Loading...</p>
                ):(
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-xs text-text-muted mb-1.5">Specialty</label>
                            <select name="specialty" value={form.specialty} onChange={handleChange} className={inputClass}>
                                {specialties.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs text-text-muted mb-1.5">Bio (max 500 characters)</label>
                            <textarea 
                                name="bio" 
                                value={form.bio}
                                onChange={handleChange}
                                maxLength={500}
                                rows={4}
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-xs text-text-muted mb-1.5">Rate per session (₹)</label>
                                <input 
                                    type="number"
                                    name="ratePerSession"
                                    value={form.ratePerSession}
                                    onChange={handleChange}
                                    required
                                    min={0}
                                    className={inputClass} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1.5">Years of experience</label>
                                <input 
                                    type="number"
                                    name="yearsExperience"
                                    value={form.yearsExperience}
                                    onChange={handleChange}
                                    min={0}
                                    className={inputClass} 
                                />
                            </div>
                        </div>

                        <h4 className="font-display text-text text-base mb-1">Weekly availability</h4>
                        <p className="text-xs text-text-muted mb-4">
                            Enter times in 24-hour format, separated by commas (for example 10:00, 11:30, 15:00). Leave a day blank if you're unavailable.
                        </p>

                        {days.map((d) => (
                            <div key={d} className="flex items-center gap-3 mb-3">
                                <span className="w-10 text-sm text-text-muted">{d}</span>
                                <input 
                                    value={slots[d] || ''}
                                    onChange={(e) => setSlots({ ...slots, [d]: e.target.value })}
                                    placeholder="10:00, 11:30, 15:00"
                                    className={inputClass}
                                />
                            </div>
                        ))}

                        {message && <p className="text-sm text-accent-2 mt-4">{message}</p>}

                        <button 
                            type="submit"
                            disabled={saving}
                            className="mt-6 w-full bg-accent text-surface py-3 rounded-brand text-sm font-semibold disabled:opacity-60"
                        >
                            {saving? 'Saving...': 'Save profile'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ProfileSetup