"use client";

import { Button, Box, Text } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

const Demo = () => {
  const { toggleColorMode } = useColorMode();
  const { data: session } = useSession();

  return (
    <>
      <Button variant="outline" onClick={toggleColorMode}>
        Toggle Mode
      </Button>

      <Box mt={4} p={4} borderWidth={1} borderRadius="md" textAlign="center">
        {session ? (
          <>
            <Box display="flex" alignItems="center" flexDirection="column">
              <img
                src={session.user?.image || "/default-avatar.png"}
                alt="User Avatar"
                width={50}
                height={50}
                style={{ borderRadius: "50%" }}
              />
              <Text mt={2} fontWeight="bold">
                {session.user?.name}
              </Text>
              <Button colorScheme="red" mt={2} onClick={() => signOut()}>
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <Button colorScheme="blue" onClick={() => signIn()}>
            Login
          </Button>
        )}
      </Box>
    </>
  );
};

export default Demo;
