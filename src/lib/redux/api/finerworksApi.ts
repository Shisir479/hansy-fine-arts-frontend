import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface FinerworksImage {
  guid: string;
  title: string;
  description?: string;
  public_preview_uri?: string;
  public_thumbnail_uri?: string;
  // You should likely add products here to satisfy TypeScript in your component
  products?: any[]; 
}

export interface LibraryPayload {
  name: string;
  session_id: string;
  site_id: number;
  account_key?: string;
}

interface ListImagesApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    images: FinerworksImage[];
    page_number: number;
    per_page: number;
    count: number;
  };
}

export interface ListImagesQueryArg {
  library: LibraryPayload;
  page?: number;
  // 1. Add this optional property
  list_products?: boolean; 
}

export const finerworksApi = createApi({
  reducerPath: "finerworksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    listFinerworksImages: builder.query<ListImagesApiResponse["data"], ListImagesQueryArg>({
      // 2. Destructure list_products and default it to true (or false)
      query: ({ library, page = 1, list_products = true }) => ({
        url: "/finerworks/images/list",
        method: "POST",
        body: {
          library,
          page_number: page,
          per_page: 10,
          // 3. Pass the flag to the API
          list_products: list_products, 
        },
      }),
      transformResponse: (response: ListImagesApiResponse) => response.data,
    }),
  }),
});

export const { useListFinerworksImagesQuery } = finerworksApi;