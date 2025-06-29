interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
}

export function Button({ children, onClick, variant = 'primary', className = '' }: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-xl font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95'
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm'
  }
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export { default as Navigation } from './Navigation'
export { default as SlidingUnderline } from './SlidingUnderline'
export { default as Slideshow } from './Slideshow'
export { default as Card } from './Card'
