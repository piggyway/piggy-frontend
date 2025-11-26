"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUserProfile } from "@/lib/mock/account";
import { useState } from "react";

export function ProfileInfo() {
  const [user, setUser] = useState(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically make an API call to update the user
    console.log("Saving user profile:", user);
  };

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-primary-navy text-2xl font-semibold">
          Profile Information
        </h2>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            First Name
          </label>
          <Input
            disabled={!isEditing}
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Last Name</label>
          <Input
            disabled={!isEditing}
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            disabled={!isEditing}
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <Input
            disabled={!isEditing}
            value={user.phone || ""}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>
    </div>
  );
}
