"use client";
import React, { useState } from "react";
import { Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import Button from "../ui/button";
import { IUser } from "@/types";
import { updateUserProfile } from "@/actions/profile.actions"; // Server Action import
import { useRouter } from "next/navigation";
import useEditModal from "@/hooks/useEditModal";

interface Props {
  user: IUser;
}

export default function EditForm({ user }: Props) {
  const router = useRouter();
  const editModal = useEditModal();
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [location, setLocation] = useState(user.location || "");
  const [bio, setBio] = useState(user.bio || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await updateUserProfile({
        userId: user._id,
        name,
        username,
        location,
        bio,
      });

      if (!response.status) {
        throw new Error(response.error || "Failed to update profile");
      }

      router.refresh();
      editModal.onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="4">
        <Field>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-gray-500 focus-within:border-blue-600 px-4 text border-[1px]"
          />
        </Field>
        <Field>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-gray-500 focus-within:border-blue-600 px-4 text border-[1px]"
          />
        </Field>
        <Field>
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-gray-500 focus-within:border-blue-600 px-4 text border-[1px]"
          />
        </Field>
        <Field>
          <Input
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border-gray-500 focus-within:border-blue-600 px-4 text border-[1px]"
          />
        </Field>

        {error && <p className="text-red-500">{error}</p>}

        <Button secondary fullWidth disabled={loading}>
          {loading ? "Updating..." : "Submit"}
        </Button>
      </Stack>
    </form>
  );
}
