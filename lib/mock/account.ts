import { Address, Order, PaymentMethod, UserProfile } from "../types/account";

export const mockUserProfile: UserProfile = {
  id: "user_123",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  phone: "+1 (555) 123-4567",
  avatarUrl: "/piggy-icon.png",
};

export const mockAddresses: Address[] = [
  {
    id: "addr_1",
    label: "Home",
    firstName: "Jane",
    lastName: "Doe",
    street: "123 Piggy Lane",
    city: "Guinea Town",
    state: "CA",
    zipCode: "90210",
    country: "USA",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "Work",
    firstName: "Jane",
    lastName: "Doe",
    street: "456 Business Park",
    apartment: "Suite 100",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "USA",
    isDefault: false,
  },
];

export const mockOrders: Order[] = [
  {
    id: "ORD-2023-001",
    date: "2023-10-15",
    status: "Delivered",
    total: 125.5,
    items: [
      {
        productId: "prod_1",
        name: "Premium Guinea Pig Pellets",
        quantity: 2,
        price: 25.0,
        image: "/shop-with-us/default.png",
      },
      {
        productId: "prod_2",
        name: "Cozy Fleece Liner",
        quantity: 1,
        price: 75.5,
        image: "/shop-with-us/default.png",
      },
    ],
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-2023-002",
    date: "2023-11-05",
    status: "Shipped",
    total: 45.0,
    items: [
      {
        productId: "prod_3",
        name: "Timothy Hay",
        quantity: 3,
        price: 15.0,
        image: "/shop-with-us/default.png",
      },
    ],
    trackingNumber: "TRK987654321",
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "Visa",
    last4: "4242",
    expiryDate: "12/24",
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "PayPal",
    isDefault: false,
  },
];
