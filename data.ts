
import { Block } from './types';

export const BLOCKS: Block[] = [
  {
    id: 'it',
    name: 'IT Block',
    category: 'Academic',
    description: 'Located immediately to the left of the entrance.',
    coordinates: { x: 80, y: 500 },
    dimensions: { width: 100, height: 60 },
    rooms: [
      { id: 'IT101', name: 'Software Lab', floor: 1, inCharge: 'Dr. Turing', type: 'Lab', coordinates: { x: 100, y: 510 } }
    ]
  },
  {
    id: 'smart',
    name: 'Smart Block',
    category: 'Academic',
    description: 'Adjacent to the IT Block on the left side.',
    coordinates: { x: 80, y: 410 },
    dimensions: { width: 100, height: 60 },
    rooms: [
      { id: 'S101', name: 'IoT Research', floor: 1, inCharge: 'Ms. Ada', type: 'Lab', coordinates: { x: 100, y: 420 } }
    ]
  },
  {
    id: 'autonomous',
    name: 'Autonomous Block',
    category: 'Academic',
    description: 'Next to the Smart Block along the left boundary.',
    coordinates: { x: 80, y: 320 },
    dimensions: { width: 100, height: 60 },
    rooms: [
      { id: 'A101', name: 'Robotics Lab', floor: 1, inCharge: 'Dr. Connor', type: 'Lab', coordinates: { x: 100, y: 330 } }
    ]
  },
  {
    id: 'day',
    name: 'Day Block',
    category: 'Academic',
    description: 'Main academic block reached by turning right from entrance.',
    coordinates: { x: 420, y: 500 },
    dimensions: { width: 100, height: 60 },
    rooms: [
      { id: 'D101', name: 'Lecture Hall 1', floor: 1, inCharge: 'Prof. Day', type: 'Seminar Hall', coordinates: { x: 450, y: 510 } }
    ]
  },
  {
    id: 'evening',
    name: 'Evening Block',
    category: 'Academic',
    description: 'Located directly behind the Day Block.',
    coordinates: { x: 420, y: 410 },
    dimensions: { width: 100, height: 60 },
    rooms: [
      { id: 'E201', name: 'Executive MBA', floor: 1, inCharge: 'Dr. Night', type: 'Classroom', coordinates: { x: 450, y: 420 } }
    ]
  },
  {
    id: 'garden',
    name: 'Garden Block',
    category: 'Recreational',
    description: 'Lush greenery located opposite the Day Block.',
    coordinates: { x: 260, y: 500 },
    dimensions: { width: 80, height: 60 },
    rooms: []
  },
  {
    id: 'gb',
    name: 'GB Block',
    category: 'Administrative',
    description: 'Golden Jubilee Block, located further along the right side.',
    coordinates: { x: 420, y: 320 },
    dimensions: { width: 100, height: 60 },
    rooms: [
      { id: 'GB01', name: 'Admin Hub', floor: 1, inCharge: 'Registrar', type: 'Office', coordinates: { x: 450, y: 330 } }
    ]
  },
  {
    id: 'media',
    name: 'Media Block',
    category: 'Academic',
    description: 'Opposite the GB Block across the main pathway.',
    coordinates: { x: 260, y: 320 },
    dimensions: { width: 80, height: 60 },
    rooms: [
      { id: 'M101', name: 'News Studio', floor: 1, inCharge: 'Mr. Media', type: 'Lab', coordinates: { x: 280, y: 330 } }
    ]
  },
  {
    id: 'auditorium',
    name: 'Main Auditorium',
    category: 'Academic',
    description: 'Grand venue at the far end of the campus.',
    coordinates: { x: 200, y: 80 },
    dimensions: { width: 200, height: 100 },
    rooms: []
  },
  {
    id: 'indoor-stadium',
    name: 'Indoor Stadium',
    category: 'Recreational',
    description: 'State-of-the-art sports facility located near the GB Block area.',
    coordinates: { x: 420, y: 150 },
    dimensions: { width: 120, height: 80 },
    rooms: [
      { id: 'ST-A1', name: 'Basketball Court', floor: 1, inCharge: 'Coach Jordan', type: 'Sports', coordinates: { x: 480, y: 190 } }
    ]
  }
];
