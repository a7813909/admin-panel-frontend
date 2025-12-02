import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom'; // Добавляем Link
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Container,
  Paper,
  Title,
  Button,
  PasswordInput,
  Group,
  Anchor,
  Center,
  Loader,
  Stack,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck } from "@tabler/icons-react"; // Добавляем иконки
import API from '../api/axios'; // Используем твой настроенный Axios-клиент

// !!! ВАЖНО: Убедись, что эти Zod-схемы определены в твоем файле src/schemas/authSchemas.ts
// Если у тебя еще нет, то добавь туда ResetPasswordFormInput и resetPasswordSchema
// (Я давал их в предыдущем сообщении)
import { resetPasswordSchema, type ResetPasswordFormInput  } from '../schemas/authSchema';


const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); // Извлекаем токен из URL

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '', // Передаем токен в форму для валидации Zod и отправки
      password: '',
      confirmPassword: '',
    },
  });

  // Логика проверки наличия токена и редиректа
  useEffect(() => {
    if (!token) {
      notifications.show({
        color: 'red',
        title: 'Ошибка',
        message: 'Токен сброса пароля отсутствует в ссылке.',
        icon: <IconAlertCircle size="1rem" />,
        autoClose: 5000,
      });
      navigate('/login'); // Перенаправляем на страницу входа
    }
  }, [token, navigate]);

  // Обработчик отправки формы
  const onSubmit: SubmitHandler<ResetPasswordFormInput> = async (data) => {
    try {
      // Отправляем запрос на бэкенд
      await API.post('/auth/reset-password', {
        token: data.token!, // Токен из формы
        newPassword: data.password, // Новый пароль
      });

      notifications.show({
        color: 'green',
        title: 'Успех!',
        message: 'Ваш пароль успешно обновлен. Теперь вы можете войти, используя новый пароль.',
        icon: <IconCheck size="1rem" />,
        autoClose: 5000,
      });
      navigate('/login'); // Перенаправляем на страницу входа

    } catch (error: any) {
      console.error('Ошибка сброса пароля:', error);
      const errorMessage = error.response?.data?.message || 'Не удалось сбросить пароль. Попробуйте снова.';

      notifications.show({
        color: 'red',
        title: 'Ошибка',
        message: errorMessage,
        icon: <IconAlertCircle size="1rem" />,
        autoClose: 5000,
      });

      // Если бэкенд возвращает ошибки валидации по конкретным полям, можно их установить:
      // if (error.response?.data?.errors?.password) {
      //   setError('password', { type: 'manual', message: error.response.data.errors.password });
      // }
    }
  };

  // Покажем лоадер, если токена нет (чтобы избежать мелькания ошибки до редиректа)
  if (!token) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title order={2} style={{ textAlign: 'center' }} mb="lg">
          Сброс пароля
        </Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack> {/* Используем Stack для вертикального расположения элементов Mantine */}
            <PasswordInput
              label="Новый пароль"
              placeholder="Введите новый пароль"
              required
              {...register('password')}
              error={errors.password?.message}
            />
            <PasswordInput
              label="Подтвердите новый пароль"
              placeholder="Повторите новый пароль"
              required
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </Stack>

          <Button type="submit" fullWidth mt="xl" loading={isSubmitting}>
            Сбросить пароль
          </Button>
        </form>

        <Group justify="flex-end" mt="md">
          {/* Используем компонент Link из react-router-dom */}
          <Anchor component={Link} to="/login" size="sm">
            Вернуться ко входу
          </Anchor>
        </Group>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;