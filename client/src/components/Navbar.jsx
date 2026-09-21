import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function Navbar() {

    const { user, logout } = useAuthStore()
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
                <span>Pricing</span>
            </div>

            {user ? (
                <div className='flex items-center gap-4'>
                    <span className='text-sm text-text-muted sm:incline'>
                        Hi, {user.name.split(' ')[0]}
                    </span>
                    {user.role == 'practitioner' && (
                        <Link 
                            to="/dashboard"
                            className='text-sm font-semibold text-accent'    
                        >
                            Dashboard
                        </Link>
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