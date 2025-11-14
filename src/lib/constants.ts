import {
  ChartColumn,
  Home,
  NotepadText,
  Package,
  PackagePlus,
  Settings,
  ShoppingBag,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';

interface NavLink {
  label: string;
  icon: any;
  path: string;
}

interface NavSection {
  title: string;
  links: NavLink[];
}

export const navbarLinks: NavSection[] = [
  {
    title: 'Dashboard',
    links: [
      {
        label: 'Dashboard',
        icon: Home,
        path: '/dashboard',
      },
      {
        label: 'Analytics',
        icon: ChartColumn,
        path: '/dashboard/analytics',
      },
      {
        label: 'Reports',
        icon: NotepadText,
        path: '/dashboard/reports',
      },
    ],
  },
  {
    title: 'Customers',
    links: [
      {
        label: 'Customers',
        icon: Users,
        path: '/dashboard/customers',
      },
      {
        label: 'New customer',
        icon: UserPlus,
        path: '/dashboard/new-customer',
      },
      {
        label: 'Verified customers',
        icon: UserCheck,
        path: '/dashboard/verified-customers',
      },
    ],
  },
  {
    title: 'Products',
    links: [
      {
        label: 'Products',
        icon: Package,
        path: '/dashboard/products',
      },
      {
        label: 'Add FinerWorks',
        icon: PackagePlus,
        path: '/dashboard/finerworks',
      },
      {
        label: 'Inventory',
        icon: ShoppingBag,
        path: '/dashboard/inventory',
      },
    ],
  },
  {
    title: 'Settings',
    links: [
      {
        label: 'Settings',
        icon: Settings,
        path: '/dashboard/settings',
      },
    ],
  },
];

interface OverviewData {
  name: string;
  total: number;
}

export const overviewData: OverviewData[] = [
  { name: 'Jan', total: 1500 },
  { name: 'Feb', total: 2000 },
  { name: 'Mar', total: 1000 },
  { name: 'Apr', total: 5000 },
  { name: 'May', total: 2000 },
  { name: 'Jun', total: 5900 },
  { name: 'Jul', total: 2000 },
  { name: 'Aug', total: 5500 },
  { name: 'Sep', total: 2000 },
  { name: 'Oct', total: 4000 },
  { name: 'Nov', total: 1500 },
  { name: 'Dec', total: 2500 },
];

interface RecentSale {
  id: number;
  name: string;
  email: string;
  total: number;
}

export const recentSalesData: RecentSale[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    total: 1500,
  },
  {
    id: 2,
    name: 'James Smith',
    email: 'james.smith@email.com',
    total: 2000,
  },
  {
    id: 3,
    name: 'Sophia Brown',
    email: 'sophia.brown@email.com',
    total: 4000,
  },
  {
    id: 4,
    name: 'Noah Wilson',
    email: 'noah.wilson@email.com',
    total: 3000,
  },
  {
    id: 5,
    name: 'Emma Jones',
    email: 'emma.jones@email.com',
    total: 2500,
  },
  {
    id: 6,
    name: 'William Taylor',
    email: 'william.taylor@email.com',
    total: 4500,
  },
  {
    id: 7,
    name: 'Isabella Johnson',
    email: 'isabella.johnson@email.com',
    total: 5300,
  },
];
