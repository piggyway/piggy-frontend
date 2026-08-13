"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Address } from "@/lib/types/account";
import { UserService } from "@/lib/services/user";
import {
  AddressFormDialog,
  type UpsertAddressInput,
} from "../AddressFormDialog";
import { MapPin, Plus } from "lucide-react";

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
    <div className="border-neutral-stroke flex flex-col gap-6 rounded-[24px] border bg-white px-6 py-8 sm:px-10 sm:py-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-primary-navy text-lead">
          Address book
        </h2>
        <Button
          onClick={handleAddNew}
          className="text-subtle-semibold h-[42px] gap-1.5 rounded-full px-6"
        >
          <Plus className="size-4" />
          Add new address
        </Button>
      </div>

      {isLoading ? (
        <p className="text-subtle text-slate-400">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div className="border-neutral-stroke rounded-[16px] border-2 border-dashed p-12 text-center">
          <MapPin className="mx-auto mb-4 size-12 text-slate-300" />
          <h3 className="text-primary-navy text-p mb-2 font-semibold">
            No addresses yet
          </h3>
          <p className="text-subtle mb-4 text-slate-400">
            Add your first address to get started
          </p>
          <Button
            onClick={handleAddNew}
            className="text-subtle-semibold h-[42px] gap-1.5 rounded-full px-6"
          >
            <Plus className="size-4" />
            Add address
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border-neutral-stroke relative flex flex-col items-start gap-2.5 rounded-[16px] border bg-white px-6 py-[22px]"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-primary-navy text-detail rounded-full px-3 py-1 font-semibold uppercase ${
                    address.type === "billing"
                      ? "bg-primary-purple"
                      : "bg-secondary-mint"
                  }`}
                >
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="bg-primary-gold/20 text-primary-navy text-detail rounded-full px-3 py-1 font-semibold uppercase">
                    Default
                  </span>
                )}
              </div>
              <p className="text-primary-navy text-p font-semibold">
                {address.recipientName ?? "—"}
              </p>
              <p className="text-subtle text-slate-600">
                {address.addressText} · {address.postalCode} ·{" "}
                {address.countryCode}
              </p>
              {address.phoneAu && (
                <p className="text-subtle text-slate-400">{address.phoneAu}</p>
              )}
              <div className="text-subtle-medium flex items-center gap-[18px] pt-1.5">
                <button
                  type="button"
                  onClick={() => handleEdit(address)}
                  className="text-primary-navy-light underline [text-underline-position:from-font]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(address.id)}
                  className="text-rose-600 underline [text-underline-position:from-font]"
                >
                  {deleteConfirm === address.id ? "Confirm?" : "Delete"}
                </button>
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
