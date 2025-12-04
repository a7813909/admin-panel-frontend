import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Button,
  Notification,
  Grid,
  Card,
  Group,
  Badge,
  Stack,
  Flex,
  Divider,
  Loader, // Добавляем Loader для показа загрузки
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCalendarEvent,
  IconMail,
  IconId,
  IconBuilding,
  IconGauge,
  IconUsers,
  IconSettings,
  IconLogout,
  IconUserScan,
  IconListDetails,
  //type IconProps, // <--- ИСПРАВЛЕНО: 'type' для импорта типа!
} from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns'; // npm install date-fns

// Интерфейсы USER (предполагаем, что они здесь или в src/types/User.ts)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'USER'; // Обновленные роли
  departamentId?: string; // Prisma UUID - это строка
  createdAt: Date; // Теперь это Date, так как бэкенд отдает ISO-строку, которую JS парсит
  updatedAt: Date;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  // Получаем состояние аутентификации и пользователя из AuthContext
  const { user: authContextUser, setIsAuthenticated, setUser: setAuthContextUser, isLoadingAuth } = useAuth();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loadingContent, setLoadingContent] = useState(true); // Локальный лоадер для контента дашборда
  const [error, setError] = useState<string | null>(null);

  // Функция для выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Удаляем токен авторизации
    localStorage.removeItem('loggedInUser'); // Удаляем данные пользователя
    setAuthContextUser(null); // Очищаем пользователя в контексте
    setIsAuthenticated(false); // Сбрасываем статус авторизации в контексте
    navigate('/login'); // Перенаправляем на страницу логина
  };

  // useEffect для инициализации и восстановления сессии пользователя
  useEffect(() => {
    // Если AuthContext находится в процессе инициализации, ждем
    if (isLoadingAuth) {
      setLoadingContent(true); // Показываем лоадер, пока ждем AuthContext
      setError(null); // Сбрасываем ошибку при новой попытке загрузки
      return;
    }

    // AuthContext завершил загрузку.
    // Если пользователь есть в контексте, используем его.
    if (authContextUser) {
      // Здесь мы полагаем, что authContextUser уже имеет правильно типизированные даты (Date объекты).
      // Если AuthContext может возвращать строки для дат, то parseUserDates() должна быть в AuthContext
      // или здесь, но в идеале - AuthContext должен быть основным "парсером".
      setLoggedInUser(authContextUser);
      setError(null);
      setLoadingContent(false);
    } else {
      // Если пользователь не в контексте, это означает, что он не авторизован или сессия устарела.
      // AuthContext уже должен был сбросить isAuthenticated.
      // Перенаправляем на логин, чтобы обеспечить защищенность маршрута, если нету токена.
      setError("Сессия истекла или пользователь не авторизован.");
      setLoadingContent(false);
      navigate('/login'); // Перенаправляем на логин
    }
  }, [isLoadingAuth, authContextUser, navigate]); // Зависимости для useEffect

  // Если всё еще ждем загрузку из AuthContext или локального контента
  if (isLoadingAuth || loadingContent) {
    return (
      <Container size="md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader size="lg" />
      </Container>
    );
  }

  // Если пользователь не загружен после всех проверок, но лоадер уже выключен (т.е. ошибка)
  if (!loggedInUser) {
    return (
      <Container size="md" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Notification
          icon={<IconAlertCircle size={18} />}
          color="red"
          title="Ошибка авторизации"
          withCloseButton
          onClose={() => navigate('/login')} // Можно перенаправить на логин при закрытии
          mt="md"
        >
          {error || "Не удалось загрузить данные пользователя. Пожалуйста, войдите снова."}
        </Notification>
        <Button onClick={() => navigate('/login')} mt="md">
          Войти
        </Button>
      </Container>
    );
  }

  // Если все хорошо и пользователь загружен
  return (
    <Container size="md" py="xl">
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={1} fw={700} c="darkblue">
          Добро пожаловать, {loggedInUser.name}!
        </Title>
        <Button variant="light" color="red" leftSection={<IconLogout size={18} />} onClick={handleLogout}>
          Выйти
        </Button>
      </Flex>

      <Text fz="lg" mb="xl" c="darkblue">
        Это ваша персональная панель управления. Здесь вы можете найти всю важную информацию и доступные функции.
      </Text>

      {error && (
          <Notification
              icon={<IconAlertCircle size={18} />}
              color="red"
              title="Ошибка"
              withCloseButton
              onClose={() => setError(null)}
              style={{ marginBottom: '20px' }}
          >
              {error}
          </Notification>
      )}

      <Divider my="lg" />

      <Title order={2} mb="md" c="darkblue">Ваши данные</Title>
      {/* Теперь ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ и НАСТРОЙКИ ПРОФИЛЯ находятся в одном FLEX-контейнере */}
      <Flex mih={50} gap="md" justify="flex-start" align="flex-start" direction="row" wrap="wrap" mb="xl">
        {/* Карточка "Профиль пользователя" */}
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ minWidth: '300px', flex: '1 1 auto' }}>
          <Group justify="space-between" mb="xs">
            <Text fw={500} size="lg">Профиль пользователя</Text>
            <Badge color="blue" variant="light">{loggedInUser.role}</Badge>
          </Group>

          <Stack gap="xs">
            <Group gap="xs">
              <IconId size={16} />
              <Text fz="sm">ИД: {loggedInUser.id}</Text>
            </Group>

            <Group gap="xs">
              <IconMail size={16} />
              <Text fz="sm">Почта: {loggedInUser.email}</Text>
            </Group>

            <Group gap="xs">
              <IconUserScan size={16} /> {/* Более подходящая иконка для имени */}
              <Text fz="sm">Имя: {loggedInUser.name}</Text>
            </Group>

            {loggedInUser.departamentId && (
              <Group gap="xs">
                <IconBuilding size={16} />
                <Text fz="sm">Департамент: {loggedInUser.departamentId}</Text>
              </Group>
            )}

            {/* Форматирование даты с помощью date-fns */}
            <Group gap="xs">
                <IconCalendarEvent size={16} />
                <Text fz="sm">Создан: {format(loggedInUser.createdAt, 'dd.MM.yyyy HH:mm')}</Text>
            </Group>
            <Group gap="xs">
                <IconCalendarEvent size={16} /> {/* Можно другую иконку для обновления, но пойдет */}
                <Text fz="sm">Обновлен: {format(loggedInUser.updatedAt, 'dd.MM.yyyy HH:mm')}</Text>
            </Group>
          </Stack>
        </Card>

        {/* Карточка "Настройки профиля" - теперь рядом с данными пользователя */}
        {(loggedInUser.role === 'ADMIN' || loggedInUser.role === 'EMPLOYEE' || loggedInUser.role === 'USER') && (
          <Card shadow="sm" padding="lg" radius="md" withBorder style={{ minWidth: '300px', flex: '1 1 auto' }}>
            <IconSettings size={ICON_SIZE} style={{ marginBottom: 10 }} />
            <Text fw={500} size="lg" mb="xs">Настройки профиля</Text>
            <Text fz="sm" c="dimmed">
              Меняйте свои данные, пароль и другие персональные настройки.
            </Text>
            <Button variant="light" color="gray" fullWidth mt="md" radius="md" onClick={() => navigate('/profile')}>
              Изменить
            </Button>
          </Card>
        )}
      </Flex> {/* Конец FLEX-контейнера для данных пользователя и настроек */}

      <Divider my="lg" />

      <Title order={2} mb="md" c="darkblue" >Доступные действия</Title>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <IconGauge size={ICON_SIZE} style={{ marginBottom: 10 }} />
            <Text fw={500} size="lg" mb="xs">Просмотр отчетов</Text>
            <Text fz="sm" c="dimmed">
              Получайте актуальные данные и аналитику по вашим проектам и задачам.
            </Text>
            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
              Перейти к отчетам
            </Button>
          </Card>
        </Grid.Col>

        {loggedInUser.role === 'ADMIN' && (
          <>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <IconUsers size={ICON_SIZE} style={{ marginBottom: 10 }} />
                <Text fw={500} size="lg" mb="xs">Управление пользователями</Text>
                <Text fz="sm" c="dimmed">
                  Добавляйте новых сотрудников, изменяйте роли и управляйте доступом.
                </Text>
                <Button variant="light" color="violet" fullWidth mt="md" radius="md" onClick={() => navigate('/admin/users')}>
                  Перейти
                </Button>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <IconListDetails size={ICON_SIZE} style={{ marginBottom: 10 }} />
                <Text fw={500} size="lg" mb="xs">Управление заданиями</Text>
                <Text fz="sm" c="dimmed">
                  Назначайте задания, отслеживайте прогресс и управляйте Вашими проектами.
                </Text>
                <Button variant="light" color="teal" fullWidth mt="md" radius="md">
                  Управление заданиями
                </Button>
              </Card>
            </Grid.Col>
          </>
        )}
        {/* Старая карточка "Настройки профиля" была здесь, теперь она удалена из этой секции */}
      </Grid>
    </Container>
  );
};

// Определяем константу для размера иконок
const ICON_SIZE = 48;

export default DashboardPage;