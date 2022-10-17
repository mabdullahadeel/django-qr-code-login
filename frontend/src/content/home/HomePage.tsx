import { Button, Center, Heading, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

interface HomePageProps {}

export const HomePageContent: React.FC<HomePageProps> = () => {
  const router = useRouter();

  return (
    <Center>
      <Stack>
        <Heading>Welcome</Heading>
        <Text>You are logged in</Text>
        <Button
          variant="solid"
          colorScheme="red"
          onClick={() => router.push("/auth/qr-login")}
        >
          Login with Code
        </Button>
      </Stack>
    </Center>
  );
};
