import { baseApi } from './baseApi';
import { Order } from '@/types/order';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Orders'],
    }),
    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ['Orders'],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderByIdQuery } = ordersApi;
