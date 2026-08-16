function Button({ children, variant = 'primary', ...props }) {
    const base = 'inline-block px-7 py-3 rounded-brand text-sm font-semibold cursor-pointer border transition-colors'
    const styles = {
        primary: 'bg-accent text-surface border-accent hover:opacity-90',
        ghost: 'bg-transparent text-text border-border hover:bg-surface-2', 
    }

    return (
        <button className={`${base} ${styles[variant]}`} {...props}>
            {children}
        </button>
    )
}

export default Button