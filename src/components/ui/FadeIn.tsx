import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    /** Fires on scroll into view. Defaults to true. */
    onView?: boolean;
    /** Percent of element visible before trigger. Default 0.1 */
    amount?: number;
    as?: keyof typeof motion;
}

/**
 * Tiny, consistent fade+rise reveal used site-wide.
 * Transform/opacity only. Runs once. No layout impact.
 */
export function FadeIn({
    children,
    className,
    delay = 0,
    y = 10,
    onView = true,
    amount = 0.1
}: FadeInProps) {
    const initial = { opacity: 0, y };
    const animate = { opacity: 1, y: 0 };
    const transition = {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay
    };

    if (onView) {
        return (
            <motion.div
                initial={initial}
                whileInView={animate}
                viewport={{ once: true, amount }}
                transition={transition}
                className={className}
                style={{ willChange: 'opacity, transform' }}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={initial}
            animate={animate}
            transition={transition}
            className={className}
            style={{ willChange: 'opacity, transform' }}
        >
            {children}
        </motion.div>
    );
}
