import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Register User
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    // Login User
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // Logout User
    logoutUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/auth/logout/${userId}`,
        method: "POST",
      }),
    }),

    // Login with Provider (Google, etc.)
    loginUserUsingProvider: builder.query({
      query: (data) => ({
        url: "/auth/google",
        method: "GET",
      }),
    }),
    googleCallback: builder.query({
      query: (data) => ({
        url: "/auth/google/callback",
        method: "GET",
      }),
    }),

    // Verify Email (OTP)
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    // Resend OTP
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password with OTP
    resetPasswordWithOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password (final step)
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Get Current User (Protected)
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
  }),
});

// Export all hooks
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoginUserUsingProviderQuery,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordWithOtpMutation,
  useResetPasswordMutation,
  useGetMeQuery,
} = authApi;
