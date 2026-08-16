import { Link } from 'react-router-dom'

function Navbar() {
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
            <Link to="/login">
                <button className="px-6 py-2.5 rounded-brand text-sm font-semibold bg-accent text-surface hover:opacity-90">
                    Get started
                </button>
            </Link>
        </nav>
    )
}

export default Navbar