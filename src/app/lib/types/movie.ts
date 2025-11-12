export interface Movie {
    id: number | string;
    title: string;
    poster: string;
    "Age Restrictions"?: string;
    Year?: number;
    Original?: string;
    Director?: string;
    Language?: string;
    Genre?: string;
    Duration?: number;
    Producer?: string;
    Starring?: string;
    description?: string;
}

export interface Hall {
    id: number;
    name: string;
    rows: number;
    cols: number;
}

export interface Session {
    id: number;
    movieId: number;
    hallId: number;
    date: string;
    time: string;
    format: "2D" | "3D";
    price: number;
}

export interface Ticket {
    id: number | string;
    sessionId: number;
    row: number;
    col: number;
    userId: string | null;
}

export type SeatStatus = "available" | "selected" | "occupied";

export interface Seat {
    row: number;
    col: number;
    status: SeatStatus;
}

export interface SeatPosition {
    row: number;
    col: number;
}

