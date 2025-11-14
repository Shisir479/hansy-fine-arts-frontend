import { baseApi } from './baseApi';
import { Product } from '@/types/product';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { category?: string; search?: string }>({
      query: ({ category, search }) => {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        return `/products?${params.toString()}`;
      },
      providesTags: ['Products'],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: ['Products'],
    }),
    getFeaturedProducts: builder.query<Product[], void>({
      query: () => '/products?featured=true',
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetFeaturedProductsQuery,
} = productsApi;
