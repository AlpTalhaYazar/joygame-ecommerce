export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  parentId: number | null;
  parentName: string | null;
  status: number;
  imageUrl: string;
}

export interface CategoryWithHierarchy {
  id: number;
  name: string;
  description: string;
  slug: string;
  parentId: number | null;
  hierarchy: string;
  level: number;
  imageUrl: string;
}
