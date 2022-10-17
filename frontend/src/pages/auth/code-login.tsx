import Link from "next/link";
import React from "react";
import {
  Button,
  Flex,
  Heading,
  useColorModeValue,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { NextPageWithLayout } from "../../types/next.types";
import { useRouter } from "next/router";
import AuthRoute from "../../components/Authenticated/AuthRoute";
import { queryKeys } from "../../utils/constants";
import { authApi } from "../../services/authApi";

const CodeLogin: NextPageWithLayout = () => {
  const toast = useToast();
  const router = useRouter();
  const { status, data, refetch } = useQuery(
    [queryKeys.GET_WS_KEY],
    authApi.getWsCode,
    {
      select: (data) => data.data,
      staleTime: 1000 * 60,
    }
  );

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex
        direction="column"
        alignItems="center"
        background={useColorModeValue("gray.100", "gray.700")}
        p={12}
        rounded={6}
      >
        <Heading mb={6}>Code Login</Heading>
        {status === "loading" && <Spinner />}
        {status === "success" && data && (
          <Heading color="green">{data.ws_token}</Heading>
        )}
        {status === "error" && (
          <>
            <Heading color="red">Error getting code</Heading>
            <Button colorScheme="red" onClick={() => refetch()}>
              Retry
            </Button>
          </>
        )}
        <Link href="/auth/login">
          <Button width="100%" colorScheme="gray" variant="outline" mt={6}>
            Back
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};

CodeLogin.getLayout = (page: React.ReactNode) => {
  return <AuthRoute>{page}</AuthRoute>;
};

export default CodeLogin;
