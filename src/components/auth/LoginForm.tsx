import React, { useCallback } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Stack,
  Title,
  Group,
  Text,
  Modal, // Mantine Modal для всплывающего окна
} from '@mantine/core';
import { useForm } from 'react-hook-form'; // React Hook Form
import { zodResolver } from '@hookform/resolvers/zod'; // ZodResolver для RHF
import { loginSchema, type LoginPayload } from '../../schemas/authSchema'; // Схемы валидации
import { notifications } from "@mantine/notifications"; // Уведомления Mantine
 import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import API from "../../api/axios"; // Настроенный Axios клиент
import { useNavigate } from 'react-router-dom'; // Хук для навигации
import { useDisclosure } from '@mantine/hooks'; // Хук для управления состоянием модалки

// Импортируем RegistrationForm, которую будем показывать в модалке
import RegistrationForm from './RegistrationForm'; 


const LoginForm: React.FC = () => { 
  const navigate = useNavigate();
  // Хук для управления состоянием модального окна регистрации
  const [openedRegisterModal, { open: openRegisterModal, close: closeRegisterModal }] = useDisclosure(false); 

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: "onBlur" // Режим валидации при потере фокуса
  });

  const onSubmit = useCallback(async (values: LoginPayload) => {
    try {
      const response = await API.post("/auth/login", {
        email: values.email,
        password: values.password,
      });

      const authToken = response.data?.token; 
      if (authToken) {
        localStorage.setItem('authToken', authToken);
        notifications.show({
            title: "Успешный вход!",
            message: "Добро пожаловать в систему.",
            color: "teal",
            icon: <IconCheck size="1rem" />,
            autoClose: 5000,
            onClose: () => navigate('/dashboard') // Перенаправить на дашборд
        });
      } else {
        notifications.show({
            title: "Ошибка",
            message: "Не удалось получить токен авторизации.",
            color: "red",
            icon: <IconAlertCircle size="1rem" />
        });
      }

      form.reset(); // Сброс формы после успешного входа
    } catch (error: any) {
      const message = error.response?.data?.message || "Неверный email или пароль.";
      notifications.show({
        title: "Ошибка входа",
        message: message,
        color: "red",
        icon: <IconAlertCircle size="1rem" />,
        autoClose: 5000,
      });
      form.setError('password', { type: "server", message: message }); // Привязка ошибки к полю пароля
    }
  }, [navigate, form]);


  return (
    <> {/* Fragment для рендеринга нескольких элементов (формы и модалки) */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack>
          {/* Заголовок формы логина */}
          <Title order={3} ta="center" mb="md">
            Войти в аккаунт
          </Title>
          {/* Поле для email */}
          <TextInput
            label="Рабочий Email"
            placeholder="your@email.com"
            required
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />
          {/* Поле для пароля */}
          <PasswordInput
            label="Пароль"
            placeholder="Ваш пароль"
            required
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
          {/* Группа для ссылки "Забыли пароль?" */}
          <Group justify="apart" mt="sm">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              size="xs"
              onClick={() => navigate('/forgot-password')}
            >
              Забыли пароль?
            </Anchor>
          </Group>
          {/* Кнопка входа */}
          <Button type="submit" fullWidth mt="xl">
            Войти
          </Button>

          {/* Ссылка "Нет аккаунта? Зарегистрироваться", открывающая модалку */}
          <Text color="dimmed" size="sm"  mt="md">
            Нет аккаунта?{' '}
            <Anchor component="button" type="button" onClick={openRegisterModal}> 
              Зарегистрироваться
            </Anchor>
          </Text>

        </Stack>
      </form>

      {/* Модальное окно для регистрации */}
      <Modal opened={openedRegisterModal} onClose={closeRegisterModal} title="Регистрация">
        {/* Рендерим RegistrationForm внутри модалки. Передаем onClose для её закрытия. */}
        <RegistrationForm onClose={closeRegisterModal} />
      </Modal>
    </>
  );
};

export default LoginForm;