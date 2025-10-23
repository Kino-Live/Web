import Header from "@/components/layout/header";
export default function ProfilePage() {
    return (
        <div>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold mb-6">
                    Welcome to Your Profile
                </h1>
                <p className="text-lg text-gray-600">
                    This is a protected profile page. Only authenticated users
                    can see this.
                </p>
            </div>
        </div>
    );
}
