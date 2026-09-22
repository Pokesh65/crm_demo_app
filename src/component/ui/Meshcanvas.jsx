import { useEffect, useRef } from "react";

// ── MeshCanvas ───────────────────────────────────────────────
// Full-viewport animated mesh-gradient background, drawn on a
// <canvas> using a handful of soft, slowly-drifting radial
// gradient "blobs". Sits absolutely positioned behind all page
// content (add z-index/positioning to siblings, not to this).

const BLOBS = [
    { color: "132, 94, 247", radius: 0.55, speed: 0.00012, offset: 0 },      // primary purple
    { color: "56, 189, 248", radius: 0.45, speed: 0.00016, offset: 2 },      // secondary blue
    { color: "236, 72, 153", radius: 0.4, speed: 0.0001, offset: 4 },        // accent pink
];

function MeshCanvas() {
    const canvasRef = useRef(null);
    const frameRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let width = 0;
        let height = 0;

        const resize = () => {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        window.addEventListener("resize", resize);

        const draw = (time) => {
            ctx.clearRect(0, 0, width, height);

            BLOBS.forEach((blob, i) => {
                const t = time * blob.speed + blob.offset;
                const x = width * (0.5 + 0.35 * Math.cos(t + i));
                const y = height * (0.5 + 0.35 * Math.sin(t * 1.3 + i));
                const radius = Math.max(width, height) * blob.radius;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, `rgba(${blob.color}, 0.22)`);
                gradient.addColorStop(1, `rgba(${blob.color}, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            });

            frameRef.current = requestAnimationFrame(draw);
        };

        frameRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(frameRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
        />
    );
}

export { MeshCanvas };