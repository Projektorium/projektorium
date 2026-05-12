import {Container, Input, Text, Box } from "@chakra-ui/react";
import {
  // Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FiLock, FiMail } from "react-icons/fi";


import type { UserRegister } from "@/client";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import {
  confirmPasswordRules,
  emailPattern,
  passwordRules,
} from "@/utils";
import  AuthHeader from "@/components/ui/auth-header";

import "@/components/styles/authform.css";

export const Route = createFileRoute("/signup")({
  component: SignUp,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" });
    }
  },
});


interface UserRegisterForm extends UserRegister {
  confirm_password: string
}

export function SignUp() {
  const { signUpMutation } = useAuth();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit: SubmitHandler<UserRegisterForm> = (data) => {
    console.log("Signin in");
    console.log(data);
    signUpMutation.mutate({
      email: data.email,
      password: data.password,
      name: data.name,
      last_name: data.last_name,
    });
  };

  return (
    <Container
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      className="signup-container"
    >
      <AuthHeader
        greeting="Zarejestruj się w"
        title="Projektorium"
      ></AuthHeader>

      <Box className="signup-box">
        {/* Name */}
        <Box className="signup-input-box">
          <Text className="signup-text">Imię</Text>
          <Field invalid={!!errors.name} errorText={errors.name?.message}>
            <InputGroup w="100%">
              <Input
                id="firstName"
                {...register("name", {
                  required: "Imię jest wymagane",
                })}
                placeholder="Imię"
                type="text"
              />
            </InputGroup>
          </Field>
        </Box>

        {/* Lastname */}
        <Box className="signup-input-box">
          <Text className="signup-text">Nazwisko</Text>
          <Field invalid={!!errors.last_name} errorText={errors.last_name?.message}>
            <InputGroup w="100%">
              <Input
                id="lastName"
                {...register("last_name", {
                  required: "Nazwisko jest wymagane",
                })}
                placeholder="Nazwisko"
                type="text"
              />
            </InputGroup>
          </Field>
        </Box>

        {/* Email */}
        <Box className="signup-input-box">
          <Text className="signup-text">Email</Text>
          <Field invalid={!!errors.email} errorText={errors.email?.message}>
            <InputGroup w="100%" startElement={<FiMail />}>
              <Input
                id="email"
                {...register("email", {
                  required: "Email jest wymagany",
                  pattern: emailPattern,
                })}
                placeholder="Email"
                type="email"
              />
            </InputGroup>
          </Field>
        </Box>

        {/* Password */}
        <Box className="signup-input-box">
          <Text className="signup-text">Hasło</Text>
          <PasswordInput
            type="password"
            startElement={<FiLock />}
            {...register("password", passwordRules())}
            placeholder="Hasło"
            errors={errors}
          />
        </Box>

        {/* Powtórz hasło */}
        <Box className="signup-input-box">
          <Text className="signup-text">Powtórz hasło</Text>
          <PasswordInput
            type="password"
            startElement={<FiLock />}
            {...register("confirm_password", confirmPasswordRules(getValues))}
            placeholder="Powtórz hasło"
            errors={errors}
          />
        </Box>

        <Button
          variant="solid"
          type="submit"
          loading={isSubmitting}
          size="md"
          className="signup-button"
        >
          Zarejestruj się
        </Button>

        <Text>
          Masz już konto?{" "}
          <ChakraLink
            color="link"
            _hover={{ color: "linkHover", textDecoration: "underline" }}
            href="/login"
            className="main-link"
          >
            Zaloguj się
          </ChakraLink>
        </Text>
      </Box>
    </Container>
  );
};

export default SignUp;
