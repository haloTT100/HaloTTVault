export interface ICardFormData {
  code: string;
  name: string;
  series: string;
  gen: string;
  event: string;
  version: number | "";
  gif: boolean;
  image: string;
}

export interface ICard {
  id?: string;
  code?: string;
  name: string;
  series: string;
  gen: string;
  event: string;
  version: number | "";
  gif: boolean;
  image: string;
}
