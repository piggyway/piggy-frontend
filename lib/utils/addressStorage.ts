import { Address } from "@/lib/types/account";

const STORAGE_KEY = "userAddresses";

export const addressStorage = {
  getAll: (): Address[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  save: (addresses: Address[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  },

  add: (address: Omit<Address, "id">): Address => {
    const addresses = addressStorage.getAll();
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // 如果设为默认地址，取消其他地址的默认状态
    if (newAddress.isDefault) {
      addresses.forEach((addr) => (addr.isDefault = false));
    }

    addresses.push(newAddress);
    addressStorage.save(addresses);
    return newAddress;
  },

  update: (id: string, updates: Partial<Address>) => {
    const addresses = addressStorage.getAll();
    const index = addresses.findIndex((addr) => addr.id === id);

    if (index === -1) return;

    // 如果设为默认地址，取消其他地址的默认状态
    if (updates.isDefault) {
      addresses.forEach((addr) => (addr.isDefault = false));
    }

    addresses[index] = { ...addresses[index], ...updates };
    addressStorage.save(addresses);
  },

  delete: (id: string) => {
    const addresses = addressStorage.getAll();
    const filtered = addresses.filter((addr) => addr.id !== id);
    addressStorage.save(filtered);
  },

  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
