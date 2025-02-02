import { useCallback, useState } from "react";
import useLoginModal from "@/hooks/useLoginModal";
import Modal from "../ui/modal";
import { Input, Stack, Text } from "@chakra-ui/react";
import Button from "../ui/button";
import useRegisterModal from "@/hooks/useRegisterModal";

export default function LoginModal() {
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


//   modal switching
const loginModal = useLoginModal();
const registerModal = useRegisterModal();

const onToggle = useCallback(() => {
  loginModal.onClose();
  setTimeout(() => {
	registerModal.onOpen();
  }, 300); // 300ms kutish
}, [loginModal, registerModal]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => password.length >= 6;

  const onSubmit = () => {
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
      alert("Login successful!"); // Bu joyda API chaqirishingiz mumkin
      loginModal.onClose();
    }
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
		className={`${ errorEmail ? 'border-red-600' : 'border-gray-800' } focus-within:border-blue-600 px-4 text-lg  border-[1px]`}
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
		className={`${ errorPassword ? 'border-red-600' : 'border-gray-800' } focus-within:border-blue-600 px-4 text-lg  border-[1px]`}
      />
      {errorPassword && (
        <Text color="red.500" fontSize="sm">
          {passwordErrorText}
        </Text>
      )}

      <Button onClick={onSubmit} classNames="text-xl" fullWidth>
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
          {" "}
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
