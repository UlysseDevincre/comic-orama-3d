export interface Manga {
  id: string;
  title: string;
  author: string;
  totalVolumes: number;
  ownedVolumes: number[];
  status: 'completed' | 'ongoing' | 'planned' | 'dropped';
  startYear: number;
  color: 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'brown';
  description?: string;
}

export interface BookshelfPosition {
  x: number;
  y: number;
  z: number;
}