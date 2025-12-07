import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface FinerworksImage {
  guid: string;
  title: string;
  description?: string;
  public_preview_uri?: string;
  public_thumbnail_uri?: string;
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
    count: number; // total count or current page count (FinerWorks er doc onujayi)
  };
}

export interface ListImagesQueryArg {
  library: LibraryPayload;
  page?: number;
}

export const finerworksApi = createApi({
  reducerPath: "finerworksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    listFinerworksImages: builder.query<ListImagesApiResponse["data"], ListImagesQueryArg>({
      query: ({ library, page = 1 }) => ({
        url: "/finerworks/images/list",
        method: "POST",
        body: {
          library,
          page_number: page,
          per_page: 10, // tumi chaile env/param o korte paro
        },
      }),
      transformResponse: (response: ListImagesApiResponse) => response.data,
    }),
  }),
});

export const { useListFinerworksImagesQuery } = finerworksApi;
