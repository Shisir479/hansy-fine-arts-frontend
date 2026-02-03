import { baseApi } from './baseApi';

export const customPortraitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCustomPortrait: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/custom-portraits',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useCreateCustomPortraitMutation } = customPortraitApi;
