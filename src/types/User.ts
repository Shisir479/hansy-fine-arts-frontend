export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Password is not always returned
  role: string;      // Role is required in backend enum with default
  gender?: string;
  contactNo?: string;
  bio?: string;
  status?: string;
  orders?: number;
  walletPoint?: number;
  createdAt?: string;
  updatedAt?: string;
  commissionBalance?: number;
  totalPaidOrders?: number; // Made optional as it wasn't in schema directly
  image?: string;
}
