"use client";

interface TimePickerProps {
    times: string[];
    selectedTime: string | null;
    onTimeSelect: (time: string) => void;
}

export default function TimePicker({
    times,
    selectedTime,
    onTimeSelect,
}: TimePickerProps) {
    return (
        <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4">Time</h2>
            <div className="grid grid-cols-4 gap-3">
                {times.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                        <button
                            key={time}
                            onClick={() => onTimeSelect(time)}
                            className={`
                                py-3 rounded-lg border-2
                                font-medium transition-all text-lg
                                ${
                                    isSelected
                                        ? "bg-green-400 border-green-400"
                                        : "border-white hover:border-green-400"
                                }
                            `}>
                            {time}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

