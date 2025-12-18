import Header from "@/app/components/layout/header";
import TicketsList from "@/app/components/profile/tickets-list";

export default function ProfilePage() {
    return (
        <div>
            <Header />
            <main className="container mx-auto p-8">
                <h1 className="text-4xl font-bold text-white mb-8">My Tickets</h1>
                <TicketsList />
            </main>
        </div>
    );
}
