import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../shared/userRoles'; // Импорт константы (значения)
//import type { User } from '../types/user'; // Импорт интерфейса
import { useAuth } from '../context/AuthContext'; // Импорт контекста
import DashboardFeatureCard from '../components/DashboardFeatureCard'; // Импорт компонента карточки

import {
  Container, Title, Text, Button, Notification, Grid, Loader, Divider, Flex, Stack, Group, Badge, Card
} from '@mantine/core';
import {
  IconAlertCircle, IconCalendarEvent, IconMail, IconBuilding, IconGauge, IconUsers, IconLogout, IconUserScan, IconListDetails,
} from '@tabler/icons-react';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  // Получаем состояние аутентификации из AuthContext
  const { user: authContextUser, setIsAuthenticated, setUser: setAuthContextUser, isLoadingAuth } = useAuth();

  // Локальный стейт для ошибок
  const [error] = useState<string | null>(null);

  // --- Выносим логику в useEffect для перенаправления ---
  useEffect(() => {
    // Если AuthContext завершил свою загрузку (isLoadingAuth === false)
    // и при этом нет данных пользователя (authContextUser === null),
    // значит, сессия истекла или токен недействителен. Перенаправляем на логин.
    if (!isLoadingAuth && !authContextUser) {
      navigate('/login');
    }
  }, [isLoadingAuth, authContextUser, navigate]);

  // --- Вспомогательные переменные для условного рендеринга ---
  // Определяем права доступа
  const isAdmin = useMemo(() => authContextUser?.role === ROLES.ADMIN, [authContextUser]);
  const isEmployeeOrAdmin = useMemo(() => authContextUser && (authContextUser.role === ROLES.ADMIN || authContextUser.role === ROLES.EMPLOYEE), [authContextUser]);

  // --- Управление выходом ---
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthContextUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  // --- Рендеринг: Лоадер ---
  if (isLoadingAuth) {
    return (
      <Container size="md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader size="lg" />
      </Container>
    );
  }

  // --- Рендеринг: Ошибка / Неавторизован ---
  if (!authContextUser) {
    return (
      <Container size="md" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Notification icon={<IconAlertCircle size={18} />} color="red" title="Ошибка авторизации" mt="md">
          {error || "Не удалось загрузить данные пользователя. Пожалуйста, войдите снова."}
        </Notification>
        <Button onClick={() => navigate('/login')} mt="md">Войти</Button>
      </Container>
    );
  }

  // --- Рендеринг: Основной контент ---
  return (
    <Container size="xl" py="xl"> {/* Используем xl контейнер, чтобы карточки были видны в ряд */}
      <Grid gutter="xs" align="center" mb="lg">
    {/* Заголовок */}
    <Grid.Col span={{ base: 12, sm: 8 }}> {/* На мобилке 12/12, на компе 8/12 */}
        <Title order={1} fw={700} c="darkblue">
            Добро пожаловать, {authContextUser.name}!
        </Title>
    </Grid.Col>
    {/* Кнопка */}
    <Grid.Col span={{ base: 12, sm: 4 }}> {/* На мобилке 12/12 (ниже заголовка), на компе 4/12 */}
        <Flex justify={{ base: 'flex-start', sm: 'flex-end' }}> {/* На мобилке слева, на компе справа */}
            <Button variant="light" color="red" leftSection={<IconLogout />} onClick={handleLogout}>
                Выйти
            </Button>
        </Flex>
    </Grid.Col>
</Grid>

      <Text fz="lg" mb="xl" c="darkblue">
        Это ваша персональная панель управления. Здесь вы можете найти всю важную информацию и доступные функции.
      </Text>

      {/* --- Секция профиля (для всех) --- */}
      <Title order={2} mb="md" c="darkblue">Ваши данные</Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ minWidth: '300px' }}>
        <Stack gap="xs">
          <Group justify="space-between" mb="xs">
            <Text fw={500} size="lg">Профиль пользователя</Text>
            <Badge color="blue" variant="light">{authContextUser.role}</Badge>
          </Group>
          <Group gap="xs"> <IconUserScan size={16} /><Text fz="sm">Имя: {authContextUser.name}</Text> </Group>
          <Group gap="xs"> <IconMail size={16} /><Text fz="sm">Почта: {authContextUser.email}</Text> </Group>
          {authContextUser.departmentName && (
            <Group gap="xs"> <IconBuilding size={16} /><Text fz="sm">Департамент: {authContextUser.departmentName}</Text> </Group>)}
          <Group gap="xs"> <IconCalendarEvent size={16} /><Text fz="sm">Создан: {format(new Date(authContextUser.createdAt), 'dd.MM.yyyy HH:mm')}</Text> </Group>
        </Stack>
      </Card>

      <Divider my="lg" />

      {/* --- Секция с карточками функций --- */}
      <Title order={2} mb="md" c="darkblue">Доступные функции</Title>
      <Grid gutter="md">
        {/* Карточка 1: Просмотр отчетов (Для всех, у кого есть роль админа или сотрудника) */}
        {isEmployeeOrAdmin && (
          <Grid.Col span={{ base: 12, sm: 12, md: 4 }}>
            <DashboardFeatureCard
              icon={IconGauge}
              title="Просмотр отчетов"
              description="Получайте актуальные данные и аналитику по вашим проектам и задачам."
              buttonText="Перейти к отчетам"
              linkTo="/reports"
              buttonColor="blue"
            />
          </Grid.Col>
        )}

        {/* Карточка 2: Управление заданиями (Для всех, у кого есть роль админа или сотрудника) */}
        {isEmployeeOrAdmin && (
          <Grid.Col span={{ base: 12, sm: 12, md: 4 }}>
            <DashboardFeatureCard
              icon={IconListDetails}
              title="Управление заданиями"
              description="Назначайте задания, отслеживайте прогресс и управляйте Вашими проектами."
              buttonText="Перейти к заданиям"
              linkTo="/tasks"
              buttonColor="teal"
            />
          </Grid.Col>
        )}

        {/* Карточка 3: Управление пользователями (Только для админа) */}
        {isAdmin && (
          <Grid.Col span={{ base: 12, sm: 12, md: 4 }}>
            <DashboardFeatureCard
              icon={IconUsers}
              title="Управление пользователями"
              description="Добавляйте новых сотрудников, изменяйте роли и управляйте доступом."
              buttonText="Перейти"
              linkTo="/admin/users"
              buttonColor="violet"
            />
          </Grid.Col>
        )}
      </Grid>

    </Container>
  );
};

export default DashboardPage;