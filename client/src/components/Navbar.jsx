import { useState, useEffect } from 'react'
import api from '../api/axios'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function Navbar() {

    const { user, logout } = useAuthStore()
    const [plan, setPlan] = useState(null)

    useEffect(() => {
        if (user?.role === 'member'){
            api.get('/subscriptions/me')
                .then((res) => setPlan(res.data)) // will be null if they've never subscribed
                .catch(() => setPlan(null))
        }
    }, [user])

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
            <Link to="/" className="font-display text-2xl text-text">
                NutriFlex
            </Link>

            <div className='hidden md:flex gap-8 text-sm text-text-muted'>
                <span>Yoga</span>
                <span>Strength</span>
                <span>Meditation</span>
                <span>Therapy</span>
                <Link to="/payment">Pricing</Link>
            </div>

            {user ? (
                <div className='flex items-center gap-4'>
                    {plan && (
                        <span className="text-xs font-semibold bg-accent-2 text-surface px-3 py-1 rounded-full capitalize">
                            {plan.plan} plan
                        </span>
                    )}
                    <span className='text-sm text-text-muted sm:inline'>
                        Hi, {user.name.split(' ')[0]}
                    </span>

                    {user.role === 'member' && (
                        <Link to="/my-bookings" className="text-sm font-semibold text-text-muted">
                            My Bookings
                        </Link>
                    )}

                    {user.role == 'practitioner' && (
                        <>
                            <Link 
                                to="/dashboard"
                                className='text-sm font-semibold text-accent'    
                            >
                                Dashboard
                            </Link>
                            <Link to="/profile-setup" className="text-sm font-semibold text-text-muted">
                                My profile
                            </Link>
                        </>
                    )}

                    <button
                        onClick={handleLogout}
                        className='px-5 py-2.5 rounded-brand text-sm font-semibold border border-border text-text hover:bg-surface-2'
                    >
                        Log out
                    </button>
                </div>
            ) : (
                <Link to="/login">
                    <button className="px-6 py-2.5 rounded-brand text-sm font-semibold bg-accent text-surface hover:opacity-90">
                        Get started
                    </button>
                </Link>
            )}
        </nav>
    )
}

export default Navbar