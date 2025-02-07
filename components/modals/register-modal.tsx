"use client";

import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import Modal from "../ui/modal";
import { Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import Button from "../ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";  // NextAuth.js import
import { registerUser } from "@/actions/auth.actions";

export default function RegisterModal() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const onToggle = useCallback(() => {
    registerModal.onClose();
    setTimeout(() => {
      loginModal.onOpen();
    }, 300);
  }, [loginModal, registerModal]);

  const bodyContent =
    step === 1 ? (
      <RegisterStep1 setData={setData} setStep={setStep} />
    ) : (
      <RegisterStep2 data={data} />
    );

  const footer = (
    <div className="text-neutral-400 text-center mb-4">
      <p className="flex gap-2 justify-center">
        <span>First time using X?</span>
        <span
          className="text-white cursor-pointer hover:underline"
          onClick={onToggle}
        >
          sign in
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      body={bodyContent}
      footer={footer}
      isOpen={registerModal.isOpen}
      onClose={registerModal.onClose}
      step={step}
      totalSteps={2}
    />
  );
}

function RegisterStep1({
  setStep,
  setData,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setData: Dispatch<
    SetStateAction<{
      name: string;
      email: string;
      username: string;
      password: string;
    }>
  >;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState(
    "This field is required"
  );
  const [isLoading, setIsLoading] = useState(false);

  let router = useRouter();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const onSubmit = async () => {
    if (!name) {
      setErrorName(true);
    }
    if (!email) {
      setErrorEmail(true);
      setEmailErrorText("This field is required");
    } else if (!isValidEmail(email)) {
      setErrorEmail(true);
      setEmailErrorText("Invalid email format");
    }

    if (name && email && isValidEmail(email)) {
      let formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("step", "1"); // 1-qadamni ko'rsatish

      const response = await registerUser(formData);

      if (!response.success) {
        setErrorEmail(true);
        setEmailErrorText(response.message || "Email is already registered");
        return;
      }

      setData((prev) => ({ ...prev, name, email }));
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(2); // Qadamni o'zgartirish
      }, 300);
    }
  };

  return (
    <div>
      <Stack gap={4} className="form-control">
        <Field invalid={errorName} errorText="This field is required">
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorName(false);
            }}
            size="2xl"
            placeholder="Name"
            className={`${
              errorName ? "border-red-600" : "border-gray-800"
            } focus-within:border-blue-600 px-4 text-lg  border-[1px]`}
          />
        </Field>
        <Field invalid={errorEmail} errorText={emailErrorText}>
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
            } focus-within:border-blue-600 px-4 text-lg  border-[1px]`}
          />
        </Field>

        <Button
          onClick={onSubmit}
          isLoading={isLoading}
          disabled={isLoading}
          fullWidth
          classNames="bg-white min-h-[40px] text-xl !text-black"
        >
          Next
        </Button>
      </Stack>
    </div>
  );
}

function RegisterStep2({ data }: { data: { name: string; email: string } }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState(
    "This field is required"
  );
  const [isLoading, setIsLoading] = useState(false);

  const isValidPassword = (password: string) => password?.length >= 6;



  const onSubmit = async () => {
    setErrorUsername(!username);
    setErrorPassword(!password);
  
    if (!password) {
      setPasswordErrorText("This field is required");
    } else if (!isValidPassword(password)) {
      setErrorPassword(true);
      setPasswordErrorText("Password must be at least 6 characters");
      return;
    }
  
    if (username && password && isValidPassword(password)) {
      setIsLoading(true); // LOADING START
  
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("step", "2");
  
        const response = await registerUser(formData);
  
        if (!response.success) {
          setErrorMessage(response.message || "Registration failed");
          return;
        }
  
  
        // Foydalanuvchini NextAuth bilan tizimga kirgizish
        const signInResponse = await signIn("credentials", {
          redirect: false,
          name: data.name,
          email: data.email,
          username: username,
          password: password,
        });
  
        if (signInResponse?.error) {
          setErrorMessage("Failed to log in after registration.");
        } else {
          // Successful login
          location.reload(); // Reload the page after successful registration and login
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage("Something went wrong");
      } finally {
        setIsLoading(false); // LOADING END
      }
    }
  };
  
  

  return (
    <div>
      <Stack gap={4} className="form-control">
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

        <Field invalid={errorUsername} errorText="This field is required">
          <Input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrorUsername(false);
            }}
            size="2xl"
            placeholder="Username"
            className={`${
              errorUsername ? "border-red-600" : "border-gray-800"
            } focus-within:border-blue-600 px-4 text-lg border-[1px]`}
          />
        </Field>

        <Field invalid={errorPassword} errorText={passwordErrorText}>
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
        </Field>

        <Button
          onClick={onSubmit}
          isLoading={isLoading}
          disabled={isLoading}
          fullWidth
          classNames="bg-white min-h-[40px] text-xl !text-black"
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </Stack>
    </div>
  );
}
