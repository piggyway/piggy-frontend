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
    id: "00000000-0000-0000-0000-000000000001",
    userId: "00000000-0000-0000-0000-0000000000aa",
    type: "shipping",
    isDefault: true,
    recipientName: "Jane Doe",
    addressText: "123 Piggy Lane, Guinea Town CA",
    postalCode: "90210",
    countryCode: "US",
    phoneAu: null,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    userId: "00000000-0000-0000-0000-0000000000aa",
    type: "billing",
    isDefault: false,
    recipientName: "Jane Doe",
    addressText: "456 Business Park, Suite 100, Los Angeles CA",
    postalCode: "90001",
    countryCode: "US",
    phoneAu: null,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
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
