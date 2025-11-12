/**
 * Форматирует дату для отображения
 * @param dateStr - строка даты в формате YYYY-MM-DD
 * @returns объект с днем и месяцем
 */
export function formatDate(dateStr: string): { day: number; month: string } {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, month };
}

/**
 * Получает название дня недели
 * @param dateStr - строка даты в формате YYYY-MM-DD
 * @param format - формат: "short" (Mon) или "long" (Monday)
 * @returns название дня недели
 */
export function getDayName(
    dateStr: string,
    format: "short" | "long" = "short"
): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        weekday: format,
    });
}

/**
 * Форматирует дату для отображения в формате DD.MM.YY
 * @param dateStr - строка даты в формате YYYY-MM-DD
 * @returns отформатированная дата
 */
export function formatDateShort(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
}

