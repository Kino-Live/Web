import { API_BASE_URL } from "@/app/lib/config";
import SeatSelection from "@/app/components/movie-components/seat-selection";
import InfoCard from "@/app/components/movie-components/info-card";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { ClockIcon } from "@heroicons/react/24/outline";

export default async function SeatsPage({
    params,
}: {
    params: Promise<{ id: string; sessionId: string }>;
}) {
    const { id, sessionId } = await params;

    // Загружаем данные параллельно
    const [movieRes, sessionRes] = await Promise.all([
        fetch(`${API_BASE_URL}/movies/${id}`),
        fetch(`${API_BASE_URL}/sessions/${sessionId}`),
    ]);

    const movie = await movieRes.json();
    const session = await sessionRes.json();

    const hallRes = await fetch(`${API_BASE_URL}/halls/${session.hallId}`);
    const hall = await hallRes.json();
    const getDayName = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { weekday: "long" });
    };
    return (
        <main className="container mx-auto p-8">
            <div className="flex mb-6 gap-6">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="rounded-lg max-w-45"
                />
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {movie.title}
                    </h1>
                    <div className="inline-block w-fit items-center rounded-md bg-green-400/10 px-3 py-1 font-medium text-green-400 inset-ring inset-ring-green-500/20 mb-3">
                        {session.format}
                    </div>
                    <div className="flex gap-3">
                        <InfoCard
                            icon={<MapPinIcon className="h-8 w-8" />}
                            primaryText={hall.name}
                            secondaryText='Kharkiv, Mall "Nikolsky"'
                        />
                        <InfoCard
                            icon={<CalendarDaysIcon className="h-8 w-8" />}
                            primaryText={new Date(session.date).toLocaleDateString(
                                "ru-RU",
                                {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "2-digit",
                                }
                            )}
                            secondaryText={getDayName(session.date)}
                        />
                        <InfoCard
                            icon={<ClockIcon className="h-8 w-8" />}
                            primaryText={<div className="text-md">Time</div>}
                            secondaryText={
                                <div className="text-md font-bold">
                                    {session.time}
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="flex gap-8">
                <div className="flex-1">
                    <SeatSelection
                        sessionId={Number(sessionId)}
                        session={session}
                        hall={hall}
                    />
                </div>
            </div>
        </main>
    );
}
