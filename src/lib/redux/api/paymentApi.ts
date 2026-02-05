import { baseApi } from "./baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Order Management
    createOrder: build.mutation({
      query: (data) => ({
        url: "/payment/orders",
        method: "POST",
        // Hybrid Payload: 'body' for Zod validation, root props for Service extraction
        body: { body: data, ...data }, 
      }),
    }),
    getUserOrders: build.query({
      query: () => ({
        url: "/payment/orders/user",
        method: "GET",
      }),
    }),
    getOrderById: build.query({
      query: (orderId) => ({
        url: "/payment/orders/" + orderId,
        method: "GET",
      }),
    }),
    
    // Payment Processing
    createStripePayment: build.mutation({
      query: (data) => ({
        url: "/payment/payments/stripe",
        method: "POST",
        body: { body: data, ...data },
      }),
    }),
    createPayPalOrder: build.mutation({
      query: (data) => ({
        url: "/payment/payments/paypal",
        method: "POST",
        body: { body: data, ...data },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateStripePaymentMutation,
  useCreatePayPalOrderMutation,
} = paymentApi;
