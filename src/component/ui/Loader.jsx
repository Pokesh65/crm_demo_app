function Loader() {
    return (
        <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-gray-950/40 backdrop-blur-sm">
            <div className="relative">
                <div className="relative h-24 w-24">

                    {/* Outer spinning ring */}
                    <div
                        className="absolute inset-0 h-full w-full rounded-full border-[3px] border-white/10 border-r-blue-500 border-b-blue-500 animate-spin"
                        style={{ animationDuration: "3s" }}
                    />

                    {/* Inner spinning ring */}
                    <div
                        className="absolute inset-0 h-full w-full rounded-full border-[3px] border-white/10 border-t-blue-400 animate-spin"
                        style={{
                            animationDuration: "2s",
                            animationDirection: "reverse",
                        }}
                    />

                    {/* Center glow */}
                    <div className="absolute inset-3 rounded-full bg-blue-500/10 blur-md animate-pulse" />
                </div>

                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl animate-pulse" />
            </div>
        </div>
    );
}

export default Loader;