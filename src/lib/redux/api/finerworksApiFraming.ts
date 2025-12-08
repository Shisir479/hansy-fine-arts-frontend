import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const finerworksApi = createApi({
  reducerPath: "finerworksApi",
  // আপনার বেস URL অনুযায়ী এটি এডজাস্ট করুন
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/v1/finerworks" }), 
  
  endpoints: (build) => ({
    // আগের ফ্রেমিং এন্ডপয়েন্টগুলো...
    getCollections: build.query({
      query: (body) => ({ url: "/prints/collections", method: "POST", body }),
    }),
    getMats: build.query({
      query: (body) => ({ url: "/prints/mats", method: "POST", body }),
    }),
    getGlazing: build.query({
      query: (body) => ({ url: "/prints/glazing", method: "POST", body }),
    }),

    // 👇👇 নতুন: প্রাইস ক্যালকুলেশন (আপনার দেওয়া ব্যাকএন্ড রাউট অনুযায়ী)
    getPrices: build.mutation({
      query: (data) => ({
        url: "/prints/prices", // আপনার রাউট পাথ: /finerworks/prints/prices
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { 
  useGetCollectionsQuery, 
  useGetMatsQuery, 
  useGetGlazingQuery,
  useGetPricesMutation // 👈 এটা ব্যবহার করব
} = finerworksApi;