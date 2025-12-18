/**
 * Утилиты для форматирования данных билетов
 */

/**
 * Форматирует дату в длинном формате (например, "19 November, 2023")
 */
export function formatDateLong(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

/**
 * Форматирует время в формате 12-часового формата (например, "4.50 PM")
 */
export function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}.${minutes} ${ampm}`;
}

/**
 * Форматирует длительность фильма (например, "2h 46m")
 */
export function formatDuration(minutes: number | undefined): string {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

/**
 * Преобразует номер ряда в букву (1 -> A, 2 -> B, и т.д.)
 */
export function getSeatLetter(row: number): string {
    return String.fromCharCode(64 + row);
}

/**
 * Форматирует ID билета с ведущими нулями (например, "#00000001")
 */
export function formatTicketId(ticketId: string | number, length: number = 8): string {
    return `#${String(ticketId).padStart(length, "0")}`;
}

/**
 * Форматирует номер ссылки билета (например, "No. A0000000000001")
 */
export function formatReferenceNumber(ticketId: string | number, length: number = 13): string {
    return `No. A${String(ticketId).padStart(length, "0")}`;
}
