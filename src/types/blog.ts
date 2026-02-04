export interface Blog {
  _id: string;
  title: string;
  content: string;
  thumbnail: string;

  tags: { tagId: { _id: string; name: string; slug: string }; _id: string }[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  success: boolean;
  data: Blog[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface SingleBlogResponse {
  success: boolean;
  data: Blog;
}
