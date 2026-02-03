import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const printfulApi = createApi({
  reducerPath: "printfulApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    getPrintfulProducts: builder.query({
      query: (categoryId) => ({
        url: "/printful/catalog/products",
        params: categoryId ? { category_id: categoryId } : {},
      }),
    }),
    getPrintfulProduct: builder.query({
      query: (productId) => `/printful/catalog/products/${productId}`,
    }),
    getPrintfulCategories: builder.query({
      query: () => "/printful/catalog/categories",
    }),
    getPrintfulLayoutTemplates: builder.query({
      query: (productId) => `/printful/mockup-generator/templates/${productId}`,
    }),
    createPrintfulMockupTask: builder.mutation({
      query: ({ productId, mockupData }) => ({
        url: `/printful/mockup-generator/create-task/${productId}`,
        method: "POST",
        body: mockupData,
      }),
    }),
    getPrintfulMockupTaskResult: builder.query({
      query: (taskKey) => ({
        url: `/printful/mockup-generator/task`,
        params: { task_key: taskKey },
      }),
    }),
    calculatePrintfulShippingRates: builder.mutation({
      query: (shippingData) => ({
        url: `/printful/shipping/rates`,
        method: "POST",
        body: shippingData,
      }),
    }),
  }),
});

export const {
  useGetPrintfulProductsQuery,
  useGetPrintfulProductQuery,
  useGetPrintfulCategoriesQuery,
  useGetPrintfulLayoutTemplatesQuery,
  useCreatePrintfulMockupTaskMutation,
  useGetPrintfulMockupTaskResultQuery,
  useCalculatePrintfulShippingRatesMutation,
} = printfulApi;