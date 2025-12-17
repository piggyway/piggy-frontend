"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Address } from "@/lib/types/account";
import { UserService } from "@/lib/services/user";
import { AddressFormDialog, type UpsertAddressInput } from "../AddressFormDialog";
import { Edit2, MapPin, Plus, Trash2 } from "lucide-react";

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await UserService.getAddresses();
        setAddresses(data ?? []);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleAddNew = () => {
    setEditingAddress(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const refresh = async () => {
    const data = await UserService.getAddresses();
    setAddresses(data ?? []);
  };

  const handleSave = async (payload: UpsertAddressInput) => {
    if (payload.id) {
      await UserService.updateAddress(payload.id, payload);
    } else {
      await UserService.createAddress(payload);
    }
    await refresh();
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      await UserService.deleteAddress(id);
      await refresh();
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // 3秒后取消确认状态
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-primary-navy text-2xl font-semibold">
          Address Book
        </h2>
        <Button className="gap-2" onClick={handleAddNew}>
          <Plus className="size-4" />
          Add New Address
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-gray-600">
          Loading addresses...
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No addresses yet
          </h3>
          <p className="mb-4 text-sm text-gray-500">
            Add your first address to get started
          </p>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 size-4" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="relative rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {address.isDefault && (
                <span className="bg-primary-purple/20 text-primary-navy absolute top-4 right-4 rounded-full px-2 py-1 text-xs font-medium">
                  Default
                </span>
              )}
              <div className="mb-4 flex items-start gap-3">
                <div className="mt-1 rounded-full bg-gray-100 p-2">
                  <MapPin className="size-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {address.type.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {address.recipientName ?? "—"}
                  </p>
                </div>
              </div>
              <div className="mb-6 space-y-1 text-sm text-gray-600">
                <p>{address.addressText}</p>
                <p>
                  {address.postalCode} · {address.countryCode}
                </p>
                {address.phoneAu && <p>{address.phoneAu}</p>}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleEdit(address)}
                >
                  <Edit2 className="size-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 gap-2 ${
                    deleteConfirm === address.id
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  }`}
                  onClick={() => void handleDelete(address.id)}
                >
                  <Trash2 className="size-3" />
                  {deleteConfirm === address.id ? "Confirm?" : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Dialog */}
      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
        onSave={handleSave}
      />
    </div>
  );
}
