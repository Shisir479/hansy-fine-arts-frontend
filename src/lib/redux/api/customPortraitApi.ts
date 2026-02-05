import { baseApi } from './baseApi';

export const customPortraitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCustomPortrait: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/custom-portrait/create-custom-portrait',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useCreateCustomPortraitMutation } = customPortraitApi;
