
export interface Room {
  id: string;
  name: string;
  floor: number;
  inCharge: string;
  type: 'Lab' | 'Classroom' | 'Office' | 'Seminar Hall' | 'Hostel' | 'Sports';
  coordinates: { x: number; y: number };
}

export interface Block {
  id: string;
  name: string;
  description: string;
  rooms: Room[];
  coordinates: { x: number; y: number };
  dimensions: { width: number; height: number };
  category: 'Academic' | 'Administrative' | 'Recreational' | 'Residential';
}

export interface User {
  username: string;
  email: string;
  avatar: string;
}

export enum AppState {
  LOGIN = 'LOGIN',
  WELCOME = 'WELCOME',
  DASHBOARD = 'DASHBOARD'
}
