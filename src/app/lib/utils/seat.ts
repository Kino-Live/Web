import { Seat, SeatStatus, Ticket, SeatPosition } from "../types/movie";

/**
 * Преобразует номер ряда в букву (1 -> A, 2 -> B, и т.д.)
 * @param row - номер ряда (начиная с 1)
 * @returns буква ряда
 */
export function rowToLetter(row: number): string {
    return String.fromCharCode(64 + row);
}

/**
 * Генерирует сетку мест для зала
 * @param rows - количество рядов
 * @param cols - количество мест в ряду
 * @param occupiedSeats - массив занятых мест
 * @param selectedSeats - массив выбранных мест
 * @returns двумерный массив мест
 */
export function generateSeatGrid(
    rows: number,
    cols: number,
    occupiedSeats: Ticket[],
    selectedSeats: Seat[]
): Seat[][] {
    const seats: Seat[][] = [];

    for (let row = 1; row <= rows; row++) {
        const rowSeats: Seat[] = [];
        for (let col = 1; col <= cols; col++) {
            const status = getSeatStatus(row, col, occupiedSeats, selectedSeats);
            rowSeats.push({ row, col, status });
        }
        seats.push(rowSeats);
    }

    return seats;
}

/**
 * Определяет статус места
 * @param row - номер ряда
 * @param col - номер места
 * @param occupiedSeats - массив занятых мест
 * @param selectedSeats - массив выбранных мест
 * @returns статус места
 */
export function getSeatStatus(
    row: number,
    col: number,
    occupiedSeats: Ticket[],
    selectedSeats: Seat[]
): SeatStatus {
    const isOccupied = occupiedSeats.some(
        (ticket) => ticket.row === row && ticket.col === col
    );
    if (isOccupied) return "occupied";

    const isSelected = selectedSeats.some(
        (seat) => seat.row === row && seat.col === col
    );
    if (isSelected) return "selected";

    return "available";
}

/**
 * Проверяет, выбрано ли место
 * @param row - номер ряда
 * @param col - номер места
 * @param selectedSeats - массив выбранных мест
 * @returns true, если место выбрано
 */
export function isSeatSelected(
    row: number,
    col: number,
    selectedSeats: Seat[]
): boolean {
    return selectedSeats.some((seat) => seat.row === row && seat.col === col);
}

/**
 * Переключает выбор места
 * @param row - номер ряда
 * @param col - номер места
 * @param selectedSeats - текущий массив выбранных мест
 * @returns новый массив выбранных мест
 */
export function toggleSeatSelection(
    row: number,
    col: number,
    selectedSeats: Seat[]
): Seat[] {
    const isSelected = isSeatSelected(row, col, selectedSeats);

    if (isSelected) {
        return selectedSeats.filter(
            (seat) => !(seat.row === row && seat.col === col)
        );
    }

    return [...selectedSeats, { row, col, status: "selected" }];
}

/**
 * Преобразует массив мест в массив позиций для API
 * @param seats - массив мест
 * @returns массив позиций
 */
export function seatsToPositions(seats: Seat[]): SeatPosition[] {
    return seats.map((seat) => ({ row: seat.row, col: seat.col }));
}

