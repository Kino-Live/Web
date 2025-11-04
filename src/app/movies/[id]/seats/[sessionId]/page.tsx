import { API_BASE_URL } from "@/app/lib/config";
import SeatSelection from "@/app/components/movie-components/seat-selection";

export default async function SeatsPage({
    params,
}: {
    params: Promise<{ id: string; sessionId: string }>;
}) {
    const { id, sessionId } = await params;
    const res = await fetch(`${API_BASE_URL}/movies/${id}`);
    const movie = await res.json();

    return (
        <main className="container mx-auto p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                    {movie.title}
                </h1>
                <p className="text-gray-400">
                    Выберите места для просмотра
                </p>
            </div>
            <SeatSelection sessionId={Number(sessionId)} />
        </main>
    );
}

