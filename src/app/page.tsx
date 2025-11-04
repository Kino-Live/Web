import Header from "@/app/components/layout/header";

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow flex items-center justify-center text-white text-4xl">
                Welcome to the KinoLive Ticketing Platform
            </div>
        </main>
    );
}
