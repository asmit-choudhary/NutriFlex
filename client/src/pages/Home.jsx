import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Button from "../components/Button"

const pillers = [
    { tag: 'Yoga', title: 'Flow & flexibility', desc: 'Live and on-demand classes across styles and levels.' },
    { tag: 'Strength', title: 'Programmed training', desc: 'Coach-built strength plans that adapt to your progress.' },
    { tag: 'Meditation' , title: 'Guided stillness', desc: 'Short daily sessions for focus, sleep and stress.' },
    {tag: 'Therapy', title: 'Physical Therapy', desc: 'Licensed therapists for recovery and pain management.' },
]

function Home() {
    return (
        <div className="min-h-screen bg-bg">
            <Navbar />

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 className="font-display text-5xl md:text-6xl leading-tight text-text mb-6">
                        One space for your body and mind.
                    </h1>
                    <p className="text-text-muted text-lg mb-8 max-w-md">
                        Yoga classes, strength coaching, guided meditation and licensed 
                        physical therapy - in a single app built around how you actually
                        move through a week.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="primary">Start a free trial</Button>
                        <Link to="/booking">
                            <Button variant="ghost">Book a consultation</Button>
                        </Link>
                    </div>
                </div>
                <div className="bg-surface-2 border border-border rounded-brand h-80 flex items-center justify-center text-text-muted text-sm">
                    hero image / class preview
                </div>
            </section>

            {/* Four Pillers*/}
            <section className="max-w-6xl mx-auto px-8 py-10">
                <h2 className="font-display text-3xl text-text mb-8">
                    Four practices, one plan
                </h2>
                <div className="grid sm:grid-cols-2 mb:grid-cols-4 gap-5">
                    {pillers.map((p) => (
                        <div 
                            key={p.tag}
                            className="bg-surface border border-border rounded-brand p-6"
                        >
                            <div className="text-xs font-bold uppercase tracking-wide text-accent mb-2">
                                {p.tag}
                            </div>
                            <h3 className="font-display text-xl text-text mb-2">{p.title}</h3>
                            <p className="text-sm text-text-muted">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer CTA*/}
            <section className="text-center py-20 px-8">
                <h2 className="font-display text-3xl text-text mb-6">Ready to begin?</h2>
                <Link to="/login">
                    <Button variant="primary">Create your account</Button>
                </Link>
            </section>
        </div>
    )
}

export default Home