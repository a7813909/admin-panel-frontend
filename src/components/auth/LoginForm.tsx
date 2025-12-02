import React, { useCallback, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Stack,
  Title,
  Group,
  Text,
  Modal,
} from '@mantine/core';
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginPayload } from '../../schemas/authSchema';
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react"; // Убедись, что эти иконки импортированы!
import API from "../../api/axios"; // Убедись, что путь к axios правильный!
import { useDisclosure } from '@mantine/hooks';

import RegistrationForm from './RegistrationForm';

import { useAuth } from '../../context/AuthContext'; // <--- Убедись, что путь к AuthContext правильный!


const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth(); // Получаем setIsAuthenticated из контекста!

  const [openedRegisterModal, { open: openRegisterModal, close: closeRegisterModal }] = useDisclosure(false);

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ' ',
    },
    mode: "onBlur"
  });

  // !!! НОВОЕ: useEffect для сброса формы при монтировании !!!
  useEffect(() => {
    form.reset({ email: '', password: '' });
  }, [form]); // form является стабильной ссылкой после инициализации useForm, поэтому эта зависимость безопасна.

  const onSubmit = useCallback(async (values: LoginPayload) => {
    try {
      const response = await API.post("/auth/login", {
        email: values.email,
        password: values.password,
      });

      const authToken = response.data?.token;
      // const user = response.data?.user; // Если бэкенд возвращает данные пользователя

      if (authToken) {
        localStorage.setItem('authToken', authToken);
        // if (user?.role) localStorage.setItem('userRole', user.role); // Если сохраняешь роль

        setIsAuthenticated(true); // Обновляем состояние аутентификации через контекст!

        notifications.show({
            title: "Успешный вход!",
            message: "Добро пожаловать в систему.", // Можете добавить имя пользователя: `Добро пожаловать, ${user?.name}!`,
            color: "teal",
            icon: <IconCheck size="1rem" />,
            autoClose: 5000,
            onClose: () => navigate('/dashboard') // Перенаправить на дашборд
        });

        form.reset({ email: '', password: '' }); // Явно сбрасываем форму после успешного входа
      } else {
        notifications.show({
            title: "Ошибка",
            message: "Не удалось получить токен авторизации.",
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

      // При ошибке: сбрасываем пароль, но оставляем введенный email
      form.reset({ ...values, password: '' });
      form.setError('password', { type: "server", message: message }); // Можно также привязать ошибку к полю пароля
    }
  }, [navigate, form, setIsAuthenticated]); // Добавляем setIsAuthenticated в зависимости useCallback


  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off"> {/* <--- autoComplete="off" для формы */}
        <Stack>
          <Title order={3} ta="center" mb="md">
            Войти в аккаунт</Title>
          <TextInput
            label="Рабочий Email"
            placeholder="your@email.com"
            required
            mt="md" // <-- mt="md" было вне Stack, перенес сюда
            {...form.register('email')}
            error={form.formState.errors.email?.message}
            autoComplete="username" // <--- Подсказка браузеру для email
          />
          <PasswordInput
            label="Пароль"
            placeholder="Ваш пароль"
            required // <--- Вот здесь был 'required' на новой строке, теперь он пропс
            mt="md" // <-- mt="md" было вне Stack, перенес сюда
            {...form.register('password')}
            error={form.formState.errors.password?.message}
            autoComplete="current-password" // <--- Подсказка браузеру для текущего пароля
          />
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
          <Button
            type="submit"
            fullWidth
            mt="xl"
            loading={form.formState.isSubmitting} // <--- Кнопка блокируется во время отправки
          >
            Войти
          </Button>
        </Stack>
      </form>

      <Text c="dimmed" size="sm" ta="center" mt="md">
        Нет аккаунта?{' '}
        <Anchor component="button" type="button" size="sm" onClick={openRegisterModal}>
          Зарегистрироваться
        </Anchor>
      </Text>

      <Modal opened={openedRegisterModal} onClose={closeRegisterModal} title="Регистрация нового пользователя" centered>
        <RegistrationForm onClose={closeRegisterModal} />
      </Modal>
    </>
  );
};
export default LoginForm;