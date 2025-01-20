export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  parentId: number | null;
  parentName: string | null;
  status: number;
  children?: Category[]; // for nested categories
}
