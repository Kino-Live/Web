export default function BackgroundDecor() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-green-500/60 blur-[200px]" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-green-500/60 blur-[200px]" />
        </div>
    );
}
