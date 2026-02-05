# PayPal Sandbox Testing Guide (Bangladesh Users)

Since you are developing from Bangladesh and using Sandbox (Test Mode), you have two options to fix the login/card issue.

## Option 1: Create a Test Buyer Account (Quickest)
You don't need your real PayPal account to pay in Sandbox.
1. In the PayPal popup window, click **"Create an Account"**.
2. Enter FAKE details (e.g., Name: "Test User", Country: **United States**).
3. Use a fake email (e.g., `test-buyer-1@example.com`) and password.
4. This will create a temporary "Sandbox Personal Account" for you to log in and pay.

## Option 2: Fix "Pay with Card" Option (Recommended)
To make the "Debit or Credit Card" button appear, you need to own the Sandbox Business Account credentials (`CLIENT_ID` & `SECRET`).

1. **Sign Up:** Go to [developer.paypal.com](https://developer.paypal.com) and sign up (It's free).
2. **Create Business Account:**
   - Go to **Testing Tools > Sandbox Accounts**.
   - Click **Create Account**.
   - Select **Business (Merchant Account)**.
   - **IMPORTANT:** Select Country as **United States** (to enable Guest Checkout).
   - Click **Create**.
3. **Enable Guest Checkout:**
   - Find your new account in the list.
   - Click **Options (...) > View/Edit Settings**.
   - Go to **Website preferences** (or Profile > Selling online).
   - **Turn ON "PayPal Account Optional"**.
4. **Get New Keys:**
   - Copy the **Client ID** and **Secret** from the API Credentials tab.
   - Update your `.env` (frontend) and `.env` (backend) files with these new keys.
5. **Restart:** Run `npm run dev` again.

Now the "Pay with Debit or Credit Card" option will appear!
