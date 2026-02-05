import { baseApi } from './baseApi';

export const artsyProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllArtsyProducts: builder.query({
      query: (params) => ({
        url: '/artsy-product',
        method: 'GET',
        params,
      }),
      providesTags: ['ArtsyProduct'],
    }),
    getSingleArtsyProduct: builder.query({
      query: (id) => ({
        url: `/artsy-product/${id}`,
        method: 'GET',
      }),
      providesTags: ['ArtsyProduct'],
    }),
  }),
});

export const { useGetAllArtsyProductsQuery, useGetSingleArtsyProductQuery } = artsyProductApi;
