import { API_BASE_URL } from "@/app/lib/config";
import { Movie, Session, Hall } from "@/app/lib/types/movie";
import SeatSelection from "@/app/components/movie-components/booking/seat-selection";
import InfoCard from "@/app/components/movie-components/movie-ui/info-card";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { ClockIcon } from "@heroicons/react/24/outline";
import { formatDateShort, getDayName } from "@/app/lib/utils/date";

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

    const movie: Movie = await movieRes.json();
    const session: Session = await sessionRes.json();

    const hallRes = await fetch(`${API_BASE_URL}/halls/${session.hallId}`);
    const hall: Hall = await hallRes.json();
    return (
        <main className="container mx-auto p-8">
            <div className="flex gap-6">
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
                            primaryText={formatDateShort(session.date)}
                            secondaryText={getDayName(session.date, "long")}
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
            <div className="flex">
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
