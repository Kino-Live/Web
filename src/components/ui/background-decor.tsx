export function BackgroundDecor() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
            {/* Первый круг */}
            <div className="absolute top-[-10%] right-[50%] h-[450px] w-[450] rounded-full bg-green-500/70 blur-[200px]" />
            {/* Второй круг */}
            <div className="absolute bottom-[-10%] left-[-10%] h-[450] w-[450] rounded-full bg-green-500/70 blur-[200px]" />
        </div>
    );
}
