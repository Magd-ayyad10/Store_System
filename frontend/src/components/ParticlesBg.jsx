import { useMemo } from 'react';

export default function ParticlesBg() {
    const particles = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 20}s`,
            duration: `${15 + Math.random() * 15}s`,
            size: `${2 + Math.random() * 4}px`,
        }));
    }, []);

    return (
        <div className="particles-bg" aria-hidden="true">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        animationDelay: p.delay,
                        animationDuration: p.duration,
                    }}
                />
            ))}
        </div>
    );
}
