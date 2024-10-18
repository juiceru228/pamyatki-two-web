import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';

const ChangePassword = () => {
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      // Отправить запрос на сервер
      const response = await fetch("/api/auth/changepassword/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.status);
        toast({
          title: "Ошибка",
          description: errorData.status,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const data = await response.json();

      if (data.status === "Success") {
        toast({
          title: "Успех",
          description: "Пароль успешно изменен!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
      } else {
        setError(data.status);
        toast({
          title: "Ошибка",
          description: data.status,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      setError("Ошибка при отправке запроса. Попробуйте позже.");
      toast({
        title: "Ошибка",
        description: "Ошибка при отправке запроса. Попробуйте позже.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <div>
      <Helmet>
        <title>Изменить пароль</title>
        <link rel="canonical" href="https://p2w.pro/api/changepassword/" />
      </Helmet>
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={Yup.object({
          currentPassword: Yup.string()
            .required("Введите текущий пароль")
            .min(6, "Пароль должен быть не менее 6 символов"),
          newPassword: Yup.string()
            .required("Введите новый пароль")
            .min(6, "Пароль должен быть не менее 6 символов"),
          confirmPassword: Yup.string()
            .required("Подтвердите новый пароль")
            .oneOf([Yup.ref("newPassword"), null], "Пароли не совпадают"),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <VStack
            as={Form}
            w={{ base: "90%", md: "500px" }}
            m="auto"
            justify="center"
            h="100vh"
            spacing={6}
          >
            <Heading as="h2" size="lg">
              Изменить пароль
            </Heading>
            {error && <Text color="red.500">{error}</Text>}

            <Field name="currentPassword">
              {({ field, form }) => (
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Box as="span" fontSize="2xl">🔒</Box>}
                  />
                  <Input
                    {...field}
                    type="password"
                    placeholder="Текущий пароль"
                    isRequired
                  />
                </InputGroup>
              )}
            </Field>
            {errors.currentPassword && (
              <Text color="red.500">{errors.currentPassword}</Text>
            )}

            <Field name="newPassword">
              {({ field, form }) => (
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Box as="span" fontSize="2xl">🔒</Box>}
                  />
                  <Input
                    {...field}
                    type="password"
                    placeholder="Новый пароль"
                    isRequired
                  />
                </InputGroup>
              )}
            </Field>
            {errors.newPassword && (
              <Text color="red.500">{errors.newPassword}</Text>
            )}

            <Field name="confirmPassword">
              {({ field, form }) => (
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Box as="span" fontSize="2xl">🔒</Box>}
                  />
                  <Input
                    {...field}
                    type="password"
                    placeholder="Подтверждение пароля"
                    isRequired
                  />
                </InputGroup>
              )}
            </Field>
            {errors.confirmPassword && (
              <Text color="red.500">{errors.confirmPassword}</Text>
            )}

            <Button
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Изменить
            </Button>
          </VStack>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;
