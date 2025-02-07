"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { signIn } from "next-auth/react";
import { Input, Stack, Text } from "@chakra-ui/react";
import Button from "../ui/button";

import Modal from "../ui/modal";
import { loginUser } from "@/actions/auth.actions";

export default function LoginModal() {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => password?.length >= 6;

  const onSubmit = async () => {
    setErrorMessage("");

    if (!email || !isValidEmail(email)) {
      setErrorMessage("Yaroqli email kiriting");
      return;
    }

    if (!password || !isValidPassword(password)) {
      setErrorMessage("Parol kamida 6 ta belgidan iborat bo‘lishi kerak");
      return;
    }

    setIsLoading(true);
    
    let formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    
    const response = await loginUser(formData);

    if (!response.success) {
      setErrorMessage(response.message);
      setIsLoading(false);
      return;
    }

    // NextAuth orqali tizimga kirish
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setErrorMessage("Login xatosi: " + result.error);
    } else {
      router.refresh();
      loginModal.onClose();
    }

    setIsLoading(false);
  };

  const bodyContent = (
    <Stack gap={4} className="form-control">
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}

      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="2xl"
        placeholder="Email"
        className="border-gray-800 focus-within:border-blue-600 px-4 text-lg border-[1px]"
      />

      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        size="2xl"
        placeholder="Password"
        className="border-gray-800 focus-within:border-blue-600 px-4 text-lg border-[1px]"
      />

      <Button
        classNames="text-xl"
        onClick={onSubmit}
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Login
      </Button>
    </Stack>
  );

  return (
    <Modal
      isOpen={loginModal.isOpen}
      onClose={loginModal.onClose}
      body={bodyContent}
    />
  );
}
