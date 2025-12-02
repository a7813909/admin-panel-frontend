import { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Title,
    Text,
    TextInput,
    Button,
    Anchor,
    Paper,
    Group,
    Stack // Stack для вертикального расположения элементов
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod'; // Zod теперь не нужен здесь, так как схема импортируется
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import API from "../api/axios"; // Твой настроенный Axios-клиент

// !!! ВАЖНО: Импортируем схему и тип из централизованного файла схем !!!
import { forgotPasswordSchema, type ForgotPasswordFormInput } from '../schemas/authSchema';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Инициализация формы с react-hook-form и ZodResolver
  // Используем ForgotPasswordFormInput, импортированный из authSchema.ts
  const form = useForm<ForgotPasswordFormInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: "onChange",
  });

  // Состояния для отображения сообщений/ошибок (можно использовать только Mantine Notifications)
  

  // Обработчик отправки формы
  const onSubmit = useCallback(async (values: ForgotPasswordFormInput) => {
    
    console.log('Запрос на сброс пароля для email:', values.email);

    try {
        await API.post('/auth/forgot-password', { email: values.email });

        notifications.show({
            title: "Отправлено",
            message: "Если аккаунт с таким email существует, ссылка для сброса пароля отправлена на вашу почту.",
            color: "teal",
            icon: <IconCheck size="1rem" />,
            autoClose: 5000,
            onClose: () => navigate('/login')
        });

        form.reset();
    } catch (err: any) {
        console.error('Ошибка запроса сброса пароля:', err);
        // Исправлена потенциальная ошибка, где `err.message` не всегда корректно срабатывал в `err.message`
        const errorMessage = err.response?.data?.message || err.message || "Произошла ошибка при отправке запроса.";

        notifications.show({
            title: "Ошибка",
            message: errorMessage,
            color: "red",
            icon: <IconAlertCircle size="1rem" />,
            autoClose: 5000,
        });

        form.setError('email', { type: "server", message: errorMessage });
    }
  }, [form, navigate]); // Зависимости useCallback

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title
          order={2}
          ta="center"
          mb="md"
        >
          Забыли пароль?
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb="xl">
          Мы поможем вам восстановить доступ. Введите адрес электронной почты, указанный при регистрации.
        </Text>

        {/* Добавляем форму сюда, она отсутствовала в предыдущем фрагменте */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Ваша электронная почта"
              placeholder="example@mail.com"
              required
              {...form.register('email')}
              error={form.formState.errors.email?.message}
            />
          </Stack>
          <Button type="submit" fullWidth mt="xl" loading={form.formState.isSubmitting}>
            Восстановить пароль
          </Button>
        </form>

        <Group justify="flex-end" mt="md">
            <Anchor component={Link} to="/login" size="sm">
            Вспомнили? Вернуться ко входу!
            </Anchor>
        </Group>

      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;