import React, { useState, useCallback } from 'react';
    import { useNavigate } from 'react-router-dom';
    import {
        Container, Title, Text, TextInput, Button, Anchor, Paper, Group, Stack
    } from '@mantine/core'; // Добавил Stack
    import { useForm } from 'react-hook-form'; // Используешь react-hook-form
    import { zodResolver } from '@hookform/resolvers/zod'; // Zod
    import { z } from 'zod'; // Zod
    import { notifications } from "@mantine/notifications"; // Уведомления Mantine
   import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
    import API from "../api/axios"; // Твой настроенный Axios

    // Схема валидации для формы восстановления пароля
    const forgotPasswordSchema = z.object({
        email: z.string().email('Неправильный email'),
    });
    type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

    const ForgotPasswordPage: React.FC = () => {
      const navigate = useNavigate();
      const form = useForm<ForgotPasswordPayload>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
        mode: "onBlur"
      });
      const [message, setMessage] = useState(''); // Для сообщений пользователю

      const onSubmit = useCallback(async (values: ForgotPasswordPayload) => {
        setMessage(''); // Сбрасываем предыдущие сообщения
        console.log('Запрос на сброс пароля для email:', values.email);

        // TODO: Здесь должна быть реальная логика отправки запроса на твой бэкенд для сброса пароля
        try {
            await API.post('/auth/forgot-password', { email: values.email }); // Предполагаемый эндпоинт
            notifications.show({
                title: "Отправлено",
                message: "Если этот email существует, ссылка для сброса отправлена.",
                color: "teal",
                icon: <IconCheck size="1rem" />,
                autoClose: 5000,
                onClose: () => navigate('/login') // После отправки можно на логин
            });
            form.reset();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Произошла ошибка при отправке запроса.";
            notifications.show({
                title: "Ошибка",
                message: msg,
                color: "red",
                icon: <IconAlertCircle size="1rem" />,
                autoClose: 5000,
            });
            form.setError('email', { type: "server", message: msg });
        }
      }, [form, navigate]);
      

      return (
        <Container size={420} my={40}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Title
              order={2}
              ta="center" // Исправлено на ta="center"
              mb="md"
            >
              Забыли пароль?
            </Title>
            <Text color="dimmed" size="sm" ta="center" mt={5} mb="xl"> {/* Исправлено ta="center" */}
              Мы поможем вам. Введите свой email.
            </Text>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Stack> {/* Использование Stack */}
                <TextInput
                  label="Ваша электронная почта"
                  placeholder="vasya.pupkin@example.com"
                  required
                  {...form.register('email')}
                  error={form.formState.errors.email?.message}
                />
                
                <Group justify="apart" mt="lg"> {/* Исправлено justify="apart" */}
                  <Anchor component="button" type="button" color="dimmed" size="xs" onClick={() => navigate('/login')}>
                    Вспомнили? Вернуться ко входу!
                  </Anchor>
                </Group>
                
                <Button type="submit" fullWidth mt="xl">
                  Сбросить пароль
                </Button>
              </Stack>
            </form>

            {/* Сообщение об успешной отправке или ошибке. Можно убрать, если используешь Mantine Notifications */}
            {message && (
              <Text color="blue" size="sm" ta="center" mt="md"> {/* Исправлено ta="center" */}
                {message}
              </Text>
            )}
          </Paper>
        </Container>
      );
    };

    export default ForgotPasswordPage;