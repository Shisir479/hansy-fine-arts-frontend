import { baseApi } from './baseApi';
import { BlogResponse, SingleBlogResponse } from '@/types';

export const blogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBlogs: build.query<BlogResponse, Record<string, any>>({
      query: (params) => ({
        url: '/blog',
        method: 'GET',
        params: params,
      }),
      providesTags: ['Blog'],
    }),
    getPublishedBlogs: build.query<BlogResponse, Record<string, any>>({
      query: (params) => ({
        url: '/blog/published',
        method: 'GET',
        params: params,
      }),
      providesTags: ['Blog'],
    }),
    getBlogById: build.query<SingleBlogResponse, string>({
      query: (id) => ({
        url: `/blog/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),
  }),
});

export const { useGetBlogsQuery, useGetBlogByIdQuery, useGetPublishedBlogsQuery } = blogApi;
