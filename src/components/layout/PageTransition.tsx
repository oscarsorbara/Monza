import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Instant swap + subtle fade-in for the incoming page.
// The exit is made instantaneous so the user never sees the outgoing page
// in a half-faded state during navigation (prevents "flicker").
const variants = {
    initial: {
        opacity: 0,
        y: 4
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1]
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0 // instant unmount — no ghost fade
        }
    }
};

export default function PageTransition({ children }: { children: ReactNode }) {
    return (
        <motion.div
            variants={variants as any}
            initial="initial"
            animate="enter"
            exit="exit"
            className="w-full"
            style={{ willChange: 'opacity, transform' }}
        >
            {children}
        </motion.div>
    );
}
