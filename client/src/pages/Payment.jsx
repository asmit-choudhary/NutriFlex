import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const plans = [
    {
        id: 'basic',
        name: 'Basic',
        price: '499',
        features: ['On-demand yoga & meditation', '1 strength program', 'Community support'],
    },
    {
        id: 'pro',
        name: 'Pr0',
        price: '999',
        features: ['Everything in basic', 'Live classes, all tracks', '2 PT consultation / mo'],
    },
    {
        id: 'elite',
        name: 'Elite',
        price: '1799',
        features: ['Everything in Pro', 'Utilmited PT & coaching', 'Priority booking'],
    },
]

function Payment() {
    const [selectedPlan, setSelectedPlan] = useState(plans[1]) 
    const [card, setCard] = useState(({ number: '', expiry: '', cvv: '', name: '' }))
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleChange = (e) => {
        setCard({ ...card, [e.target.name]: e.target.value })
    }

    const handlePlay = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try{
            // this is a MOCK payment — no real card processing happens here.
            // we're just recording "this member picked this plan" on the backend.
            await api.post('/subscriptions/mock', { plan: selectedPlan.id })
            setSuccess(true)
        } catch(err){
            setError(err.response?.data?.message || 'Payment failed')
        } finally {
            setLoading(false)
        }
    }

    if(success){
        return (
            <div className="min-h-screen bg-bg">
                <Navbar />
                <div className="max-w-md mx-auto text-center py-24 px-8">
                    <h1 className="font-display text-3xl text-text mb-3">You're all set!</h1>
                    <p className="text-text-muted text-sm mb-8">
                        You're now on the {selectedPlan.name} plan. This was a demo payment - no real charge was made.
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-accent text-surface px-7 py-3 rounded-brand text-sm font-semibold"
                    >
                        Back to home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg">
            <Navbar />

            <div className="max-w-6xl mx-auto px-8 pt-10 pb-2">
                <h1 className="font-display text-4xl text-text mb-2">Choose your plan</h1>
                <p className="text-text-muted text-sm">Cancel or switch anytime. This is a demo — no real payment is processed.</p>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-8 grid sm:grid-cols-3 gap-4">
                {plans.map((p) => (
                    <div 
                        key={p.id}
                        onClick={() => setSelectedPlan(p)}
                        className={`bg-surface border rounded-brand p-6 cursor-pointer 
                            ${selectedPlan.id === p.id ? 'border-accent border-2' :'border-border'}`}
                    >
                        {p.featured && (
                            <span className="inline-block text-xs bg-accent text-surface px-2.5 py-1 rounded-full font-bold mb-3">
                                Most Popular
                            </span>
                        )}
                        <h3 className="font-display text-lg text-text">{p.name}</h3>
                        <div className="text-3xl font-bold text-text my-3">
                            ₹{p.price}<span className="text-sm font-normal text-text-muted">/mo</span>
                        </div>
                        <ul className="text-sm text-text-muted space-y-2">
                            {p.features.map((f) => (
                                <li key={f}>{f}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="max-w-6xl mx-auto px-8 pb-16 grid md:grid-cols-[1.2fr_0.8fr] gap-6">
                <form onSubmit={handlePlay} className="bg-surface border border-border rounded-brand p-6">
                    <h4 className="font-display text-text text-base mb-5">Payment details</h4>

                    <div className="mb-4">
                        <label className="block text-xs text-text-muted mb-1.5">Card number</label>
                        <input 
                            name="number"
                            value={card.number}
                            onChange={handleChange}
                            placeholder="1234 1234 1234 1234"
                            required
                            className="w-full px-3.5 py-3 rounded-lg border border-border bg-bg text-text text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <label className="block text-xs text-text-muted mb-1.5">Expiry</label>
                        <input 
                            name="expiry"
                            value={card.expiry}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            required
                            className="w-full px-3.5 py-3 rounded-lg border border-border bg-bg text-text text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-text-muted mb-1.5">CVV</label>
                        <input 
                            name="cvv"
                            value={card.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            required
                            className="w-full px-3.5 py-3 rounded-lg border border-border bg-bg text-text text-sm"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-xs text-text-muted mb-1.5">Name on card</label>
                        <input 
                            name="name"
                            value={card.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                            className="w-full px-3.5 py-3 rounded-lg border border-border bg-bg text-text text-sm"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-surface py-3 rounded-brand text-sm font-semibold disabled:opacity-60"
                    >
                        {loading ? 'Processing...' : `Pay ₹${selectedPlan.price}`}
                    </button>
                </form>

                <div className="bg-surface-2 rounded-brand p-6 h-fit text-sm">
                    <div className="flex justify-between py-2 border-b border-border text-text-muted">
                        <span>{selectedPlan.name} plan</span>
                        <span>₹{selectedPlan.price}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border text-text-muted">
                        <span>Tax</span>
                        <span>₹0</span>
                    </div>
                    <div className="flex justify-between py-4 font-bold text-text">
                        <span>Total</span>
                        <span>₹{selectedPlan.price} /mo</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment