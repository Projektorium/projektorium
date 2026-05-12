import {
  Container,
  Input,
  Text,
  Box
} from "@chakra-ui/react";
import {
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FiLock, FiMail } from "react-icons/fi";


import type { Body_login_login as AccessToken } from "@/client";
import useAuth from "@/hooks/useAuth";
import { isLoggedIn } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { emailPattern, 
  // passwordRules 
} from "@/utils";

import AuthHeader from "@/components/ui/auth-header";
import "@/components/styles/authform.css";

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" });
    }
  },
});


function Login() {
  const { loginMutation, error, resetError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return;
    resetError();
    try {
      await loginMutation.mutateAsync(data);
    } catch {
      // error handled in hook
    }
  };

  return (
    <Container
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      className="login-container"
    >

      <AuthHeader
        greeting="Witaj w"
        title="Projektorium"
      ></AuthHeader>

      <Box className="login-box">
        <Box className="login-input-box">
          <Text className="login-text">Email</Text>
          <Field
            invalid={!!errors.username}
            errorText={errors.username?.message || (error ? "Invalid credentials" : "")}
          >
            <InputGroup w="100%" startElement={<FiMail />}>
              <Input
                id="username"
                {...register("username", {
                  required: "Email jest wymagany",
                  pattern: emailPattern,
                })}
                placeholder="Email"
                type="email"
              />
            </InputGroup>
          </Field>
        </Box>

        <Text className="login-text">Hasło</Text>
        <PasswordInput
          type="password"
          startElement={<FiLock />}
          // {...register("password", passwordRules())}
          {...register("password")}

          placeholder="Hasło"
          errors={errors}
        />

        <Text textAlign="right" mb="12px" mt="20px">
          <ChakraLink 
            color="link"
            _hover={{ color: "linkHover", textDecoration: "underline" }}
            href="/recover-password"
            className="main-link"
            fontWeight="600"
          >
            Zapomniałeś Hasła?
          </ChakraLink>
        </Text>

        <Button
          variant="solid"
          type="submit"
          loading={isSubmitting}
          size="md"
          className="login-button"
        >
          Zaloguj się
        </Button>

        <Text>
          Jesteś nowy?{" "}
          <ChakraLink 
            color="link"
            _hover={{ color: "linkHover", textDecoration: "underline" }}
            href="/signup" 
            className="main-link"
            fontWeight="600"
          >
            Załóż konto
          </ChakraLink>
        </Text>
      </Box>
    </Container>
  );
}

export default Login;
