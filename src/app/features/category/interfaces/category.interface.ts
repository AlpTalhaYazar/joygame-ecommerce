export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  parentId: number | null;
  hierarchy: string;
  level: number;
  imageUrl: string;
}
