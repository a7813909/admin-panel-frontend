import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Stack,
  Title,
  Group,
  Modal,
  //Text, // Добавил Text для возможных сообщений
  // Paper, // Если LoginForm рендерит Paper сам
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginPayload } from '../../schemas/authSchema';
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import API from "../../api/axios";
import { useDisclosure } from '@mantine/hooks';

import RegistrationForm from './RegistrationForm';

import { useAuth } from '../../context/AuthContext';
// Импортируем интерфейс User, чтобы правильно типизировать
import { type User } from '../../pages/DashboardPage'; // Или из src/types/User, если вынесли


const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth(); // Получаем user и setUser из контекста

  const [openedRegisterModal, { open: openRegisterModal, close: closeRegisterModal }] = useDisclosure(false);

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ' ',
    },
    mode: "onBlur"
  });

  useEffect(() => {
    form.reset({ email: '', password: '' });
  }, [form]);

  const onSubmit = useCallback(async (values: LoginPayload) => {
    try {
      const response = await API.post("/auth/login", {
        email: values.email,
        password: values.password,
      });

      const authToken = response.data?.token;
      const userRaw = response.data?.user; // Сервер возвращает данные пользователя

      if (authToken && userRaw) {
        localStorage.setItem('authToken', authToken);

        // --- СОХРАНЯЕМ И ПАРСИМ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ---
        // Обрабатываем даты, так как JSON.parse не делает этого автоматически
        const loggedInUser: User = {
            ...userRaw,
            createdAt: userRaw.createdAt ? new Date(userRaw.createdAt) : new Date(), // Если нет, ставить текущую
            updatedAt: userRaw.updatedAt ? new Date(userRaw.updatedAt) : new Date(), // Если нет, ставить текущую
            // Прочие поля, убедиться что в userRaw все есть
            departamentId: userRaw.departamentId || undefined, // Убеждаемся, что если null/undefined, то undefined
        };
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser)); // Сохраняем в localStorage

        setUser(loggedInUser); // Обновляем данные пользователя в AuthContext
        setIsAuthenticated(true); // Обновляем состояние аутентификации через контекст
        // ---------------------------------------------

        notifications.show({
            title: "Успешный вход!",
            message: `Добро пожаловать, ${loggedInUser.name || 'пользователь'}!`,
            color: "teal",
            icon: <IconCheck size="1rem" />,
            autoClose : 3000,
            onClose: () => navigate('/dashboard') // Перенаправить на дашборд
        });

        form.reset({ email: '', password: '' }); // Явно сбрасываем форму после успешного входа
      } else {
        notifications.show({
            title: "Ошибка",
            message: "Не удалось получить токен или данные пользователя.",
            color: "red",
            icon: <IconAlertCircle size="1rem" />
        });
      }

    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Произошла ошибка при входе.";
      notifications.show({
        title: "Ошибка входа",
        message: message,
        color: "red",
        icon: <IconAlertCircle size="1rem" />,
        autoClose: 5000,
      });

      form.reset({ ...values, password: '' }); // Сбрасываем пароль, но оставляем введенный email
      form.setError('password', { type: "server", message: message });
    }
  }, [navigate, form, setIsAuthenticated, setUser]); // Добавили setUser в зависимости useCallback

  return (
    <Stack>
      <Title order={2} c="blue.8" mb="md">Вход</Title> {/* Цвет заголовка */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack gap="md"> {/* Увеличиваем gap между полями */}
          <TextInput
            label="Email"
            placeholder="ваш@email.com"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
            required
            size="md" // Делаем поля немного больше
            variant="filled" // Стиль Mantine
          />
          <PasswordInput
            label="Пароль"
            placeholder="Ваш пароль"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
            required
            size="md" // Делаем поля немного больше
            variant="filled" // Стиль Mantine
          />
          <Group justify="space-between" mt="sm"> {/* mt="sm" */}
            <Anchor component="button" type="button" size="sm" onClick={openRegisterModal} c="blue.6"> {/* Цвет ссылки */}
              Нет аккаунта? Зарегистрироваться
            </Anchor>
            <Anchor component="button" type="button" size="sm" onClick={() => navigate('/forgot-password')} c="blue.6"> {/* Цвет ссылки */}
              Забыли пароль?
            </Anchor>
          </Group>
          <Button type="submit" mt="lg" loading={form.formState.isSubmitting} variant="filled" color="blue" size="lg"> {/* Цвет, размер, filled variant */}
            Войти
          </Button>
        </Stack>
      </form>

      <Modal opened={openedRegisterModal} onClose={closeRegisterModal} title="Регистрация">
        {/* Здесь может быть заголовок для модалки, если RegistrationForm его не рисует */}
        <RegistrationForm onClose={closeRegisterModal} />
      </Modal>
    </Stack>
  );
};

export default LoginForm;