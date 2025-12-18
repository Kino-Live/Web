import Header from "@/app/components/layout/header";
import ProfileContent from "@/app/components/profile/profile-content";

export default function ProfilePage() {
    return (
        <div>
            <Header />
            <main className="container mx-auto p-8">
                <h1 className="text-4xl font-bold text-white mb-8">My Profile</h1>
                <ProfileContent />
            </main>
        </div>
    );
}
