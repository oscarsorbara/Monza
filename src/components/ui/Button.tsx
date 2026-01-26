import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children: React.ReactNode;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    children,
    ...props
}: ButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.1, y: middleY * 0.1 }); // Magnetic strength
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-monza-red disabled:pointer-events-none disabled:opacity-50 tracking-wide";

    const variants = {
        primary: "bg-white text-black hover:bg-gray-200 border-none", // Cuberto: Black/White usage
        secondary: "bg-carbon-800 text-white hover:bg-carbon-700",
        outline: "border border-white/20 text-white hover:bg-white hover:text-black hover:border-transparent backdrop-blur-sm",
        ghost: "hover:bg-white/10 text-white",
    };

    const sizes = {
        sm: "h-9 px-4 text-xs rounded-full",
        md: "h-11 px-8 text-sm rounded-full",
        lg: "h-14 px-10 text-base rounded-full",
        icon: "h-10 w-10 rounded-full",
    };

    return (
        <motion.button
            ref={ref}
            className={clsx(baseStyles, variants[variant], sizes[size], className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            {...(props as any)}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    );
}
