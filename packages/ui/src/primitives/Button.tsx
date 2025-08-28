import * as React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'primary', className = '', ...props }, ref) {
    const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:pointer-events-none transition-colors'
    const styles = variant === 'primary'
      ? 'bg-black text-white hover:bg-neutral-800'
      : 'bg-white text-black border border-neutral-200 hover:bg-neutral-50'

    return (
      <button ref={ref} className={`${base} ${styles} ${className}`} {...props} />
    )
  }
)
