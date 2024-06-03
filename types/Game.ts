export interface HiddenObject {
  x: number;
  y: number;
  radius: number;
}

export interface Game {
  id: number;
  status: string;
  date_created: string;
  date_updated: string;
  image_width: number;
  image_url: string;
  image_height: number;
  hidden_objects: HiddenObject[];
}