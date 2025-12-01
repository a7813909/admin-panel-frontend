import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // [ВАЖНО] Link импортируем отсюда
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
import { z } from 'zod';
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import API from "../api/axios"; // [ВАЖНО] Твой настроенный Axios-клиент

// Схема валидации для формы восстановления пароля с использованием Zod
const forgotPasswordSchema = z.object({
    email: z.string().email('Неправильный email адрес'), // Сообщение об ошибке
});

// Тип данных для полезной нагрузки формы
type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate(); // Hook для навигации

  // Инициализация формы с react-hook-form и ZodResolver
  const form = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }, // Начальное значение email
    mode: "onChange", // Режим валидации: при изменении поля
  });

  const [message, setMessage] = useState<string | null>(null); // Для отображения успешных сообщений от бэкенда/фронтенда
  const [error, setError] = useState<string | null>(null);   // Для ошибок

  // Обработчик отправки формы
  const onSubmit = useCallback(async (values: ForgotPasswordPayload) => {
    setMessage(null); // Сбрасываем сообщения при новой попытке
    setError(null);
    console.log('Запрос на сброс пароля для email:', values.email);

    try {
        // [ВАЖНО] Отправка запроса на твой бэкенд для сброса пароля
        await API.post('/auth/forgot-password', { email: values.email }); 
        
        // Уведомление об успехе
        notifications.show({
            title: "Отправлено",
            message: "Если аккаунт с таким email существует, ссылка для сброса пароля отправлена на вашу почту.",
            color: "teal",
            icon: <IconCheck size="1rem" />,
            autoClose: 5000,
            onClose: () => navigate('/login') // Перенаправляем на страницу входа после успешной отправки
        });
        
        form.reset(); // Очищаем форму
    } catch (err: any) {
        console.error('Ошибка запроса сброса пароля:', err);
        const errorMessage = err.response?.data?.message || err.message || "Произошла ошибка при отправке запроса.";
        
        // Показываем уведомление об ошибке
        notifications.show({
            title: "Ошибка",
            message: errorMessage,
            color: "red",
            icon: <IconAlertCircle size="1rem" />,
            autoClose: 5000,
        });

        // Можно установить ошибку прямо в поле email формы
        form.setError('email', { type: "server", message: errorMessage });
        setError(errorMessage); // Также устанавливаем общую ошибку
    }
  }, [form, navigate]); // Зависимости useCallback

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title
          order={2} // h2 заголовок
          ta="center" // Текст по центру
          mb="md"
        >
          Забыли пароль?
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5} mb="xl">
          Мы поможем вам восстановить доступ. Введите адрес электронной почты, указанный при регистрации.
        </Text>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack> {/* Stack для вертикального расположения с отступами */}
            <TextInput
              label="Ваша электронная почта"
              placeholder="vash.email@example.com"
              required // Поле обязательно для заполнения
              {...form.register('email')} // Привязка к react-hook-form
              error={form.formState.errors.email?.message} // Отображение ошибки валидации
            />
            
            {/* Сообщения об успехе или ошибке (опционально, так как есть notifications) */}
            {message && <Text c="green" mt="sm">{message}</Text>}
            {error && <Text c="red" mt="sm">{error}</Text>}

            <Group justify="apart" mt="lg"> {/* Группа для выравнивания элементов по краям */}
              {/* Ссылка на страницу входа */}
              <Anchor 
                component={Link} // [ВАЖНО] Mantine Anchor с Link из react-router-dom
                to="/login" 
                color="dimmed" 
                size="xs"
              >
                Вспомнили? Вернуться ко входу!
              </Anchor>
            </Group>
            
            <Button 
              type="submit" 
              fullWidth 
              mt="xl" 
              loading={form.formState.isSubmitting} // [ВАЖНО] Кнопка загрузки, пока запрос выполняется
            >
              Сбросить пароль
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;