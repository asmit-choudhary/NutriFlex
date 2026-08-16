import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/axios"
import useAuthStore from "../store/authStore"

function Login() {
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const endpoint = isLoginMode ? '/auth/login' : '/auth/register'
            const payload = isLoginMode
                ? { email: form.email, password: form.password }
                : form

            const res = await api.post(endpoint, payload)
            login(res.data)   // saves user + token to the store
            navigate('/')     // redirect to home after success 
        } catch (err){
            setError(err.response?.data?.message || 'Someting went wrong')
        } finally{
            setLoading(false)
        }
    }

    return(
        <div className="min-h-screen bg-bg grid md:grid-cols-2">
            <div className="hidden md:flex items-center justify-center bg-surface-2 p-16">
                <blockquote className="font-display text-2xl text-text italic leading-snug">
                    "Consistancy, not intensity, is what changes how you feel."
                </blockquote>
            </div>

            <div className="flex items-center justify-center p-8">
                <form onSubmit={handleSubmit} className="w-full max-w-sm">
                    <h2 className="font-display text-3xl text-text mb-2">
                        {isLoginMode ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="text-text-muted text-sm mb-6">
                        {isLoginMode ? 'Login to continue you practice.' : 'Start you practice today.'}
                    </p>

                    <div className="flex gap-6 mb-6 border-b border-border">
                        <button
                            type="button"
                            onClick={() => setIsLoginMode(true)}
                            className={`pb-2 text-sm ${isLoginMode ? 'text-text font-semibold border-b-2 border-accent' : 'text-text-muted'}`}
                        >
                            Log in
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLoginMode(false)}
                            className={`pb-2 text-sm ${isLoginMode ? 'text-text font-semibold border-b-2 border-accent' : 'text-text-muted'}`}
                        >
                            Sign up
                        </button>
                    </div>

                    {!isLoginMode && (
                        <div className="mb-4">
                            <label className="block text-xs text-text-muted mb-1.5">Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3.5 py-3 rounded-lg border border-border bg-surface text-text text-sm"                            
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-xs text-text-muted mb-1.5">Email</label>
                        <input
                            type="email"                                
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3.5 py-3 rounded-lg border border-border bg-surface text-text text-sm"                            
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs text-text-muted mb-1.5">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full px-3.5 py-3 rounded-lg border border-border bg-surface text-text text-sm"                            
                        />
                    </div>

                    {!isLoginMode && (
                        <div className="mb-4">
                            <label className="block text-xs text-text-muted mb-1.5">I am a...</label>
                            <select 
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full px-3.5 py-3 rounded-lg border border-border bg-surface text-text text-sm"
                            >
                                <option value="member">Member</option>
                                <option value="practitioner">Practitioner (trainer/therapist)</option>
                            </select>
                        </div>
                    )}

                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-surface py-3 rounded-brand text-sm font-semibold disabled:opacity-60"
                    >
                        {loading ? 'Please wait...' : isLoginMode ? 'Login' : 'Sig up'}
                    </button>

                    <p className="text-center text-sm text-text-muted mt-6">
                        <Link to="/" className="underline">Back to Home</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login