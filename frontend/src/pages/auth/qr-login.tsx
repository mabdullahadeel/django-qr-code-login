import React, { useEffect } from "react";
import {
  Button,
  Flex,
  Heading,
  useColorModeValue,
  useToast,
  FormErrorMessage,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { NextPageWithLayout } from "../../types/next.types";
import { useRouter } from "next/router";
import { authApi } from "../../services/authApi";
import { Authenticated } from "../../components/Authenticated";
import { useForm } from "react-hook-form";

const QRLogin: NextPageWithLayout = () => {
  const router = useRouter();
  const { code } = router.query;
  const qrLoginMutation = useMutation(authApi.qrLogin, {
    retry: 1,
    onSuccess: () => {
      router.push(router.pathname);
    },
  });
  const {
    handleSubmit,
    register,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ws_token: "",
    },
  });
  const toast = useToast();

  useEffect(() => {
    if (code) {
      qrLoginMutation.mutate(code as string);
    }
  }, [code]);

  const onSubmit = async () => {
    try {
      const values = getValues();
      await qrLoginMutation.mutateAsync(values.ws_token);
      toast({
        title: "Success",
        status: "success",
      });
      reset();
    } catch (_error) {
      toast({
        title: "Invalid Code",
        status: "error",
      });
    }
  };
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.ws_token}>
            <Input
              placeholder="Type your code here"
              background={useColorModeValue("gray.300", "gray.600")}
              size="lg"
              mt={6}
              {...register("ws_token", {
                required: "This is required field",
                minLength: {
                  value: 6,
                  message: "Code must be at least 7 characters",
                },
                maxLength: {
                  value: 6,
                  message: "Code must be at most 7 characters",
                },
              })}
            />
            <FormErrorMessage>
              {errors.ws_token && errors.ws_token.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            isLoading={isSubmitting || qrLoginMutation.isLoading}
            loadingText="Logging in..."
            width="100%"
            colorScheme="purple"
            variant="outline"
            mt={6}
            mb={6}
            type="submit"
          >
            Login
          </Button>
        </form>
        <Button
          width="100%"
          colorScheme="gray"
          variant="outline"
          mt={6}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Flex>
    </Flex>
  );
};

QRLogin.getLayout = (page: React.ReactNode) => {
  return <Authenticated>{page}</Authenticated>;
};

export default QRLogin;
