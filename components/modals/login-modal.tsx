"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import Modal from "../ui/modal";
import { Input, Stack, Text } from "@chakra-ui/react";
import Button from "../ui/button";
import { useAuthStore } from "@/store/auth.store";

export default function LoginModal() {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState(
    "This field is required"
  );
  const [passwordErrorText, setPasswordErrorText] = useState(
    "This field is required"
  );
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => password.length >= 6;

  const onToggle = useCallback(() => {
    loginModal.onClose();
    setTimeout(() => {
      registerModal.onOpen();
    }, 300);
  }, [loginModal, registerModal]);

  const onSubmit = () => {
    setErrorEmail(false);
    setErrorPassword(false);

    if (!email) {
      setErrorEmail(true);
      setEmailErrorText("This field is required");
    } else if (!isValidEmail(email)) {
      setErrorEmail(true);
      setEmailErrorText("Invalid email format");
    }

    if (!password) {
      setErrorPassword(true);
      setPasswordErrorText("This field is required");
    } else if (!isValidPassword(password)) {
      setErrorPassword(true);
      setPasswordErrorText("Password must be at least 6 characters");
    }

    if (email && isValidEmail(email) && password && isValidPassword(password)) {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        loginModal.onClose();
        router.push("/"); // Bosh sahifaga yo‘naltirish
      }, 300);
      // Login funksiyasini to'g'ri chaqirish
      useAuthStore.getState().login(); // To'g'ri ishlash uchun useAuthStore.getState() orqali chaqirish
    }

    // clearInput
    setEmail("");
    setPassword("");
  };

  const bodyContent = (
    <Stack gap={4} className="form-control">
      <Input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrorEmail(false);
        }}
        size="2xl"
        placeholder="Email"
        className={`${
          errorEmail ? "border-red-600" : "border-gray-800"
        } focus-within:border-blue-600 px-4 text-lg border-[1px]`}
      />
      {errorEmail && (
        <Text color="red.500" fontSize="sm">
          {emailErrorText}
        </Text>
      )}

      <Input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrorPassword(false);
        }}
        size="2xl"
        placeholder="Password"
        className={`${
          errorPassword ? "border-red-600" : "border-gray-800"
        } focus-within:border-blue-600 px-4 text-lg border-[1px]`}
      />
      {errorPassword && (
        <Text color="red.500" fontSize="sm">
          {passwordErrorText}
        </Text>
      )}

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

  const footer = (
    <div className="text-neutral-400 text-center mb-4">
      <p className="flex gap-2 justify-center">
        <span>First time using X?</span>
        <span
          className="text-white cursor-pointer hover:underline"
          onClick={onToggle}
        >
          Create an account
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={loginModal.isOpen}
      onClose={loginModal.onClose}
      body={bodyContent}
      footer={footer}
    />
  );
}
