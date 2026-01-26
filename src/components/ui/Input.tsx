import { type InputHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={twMerge(clsx(
                        'flex h-10 w-full rounded-md border border-carbon-600 bg-carbon-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-monza-red focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all',
                        {
                            'border-red-500 focus:ring-red-500': error
                        },
                        className
                    ))}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-red-500 font-medium animate-pulse">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"
