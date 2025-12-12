import { type FC, useState, useEffect } from 'react';
import { Container, Title, Text, Button, Center, Loader, Box, Table, Group, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react'; // Иконка поиска
import { useNavigate } from 'react-router-dom';

// !!! ВАЖНО: ИМПОРТИРУЙ ТВОЙ ТИП PublicUser С БЭКЕНДА !!!
// Он должен включать departament: { name: string } | null
// Например: import { PublicUser } from '../path/to/types/user-types';
// Если у тебя нет такого импорта, то пока можешь скопировать его сюда временно.
// Предположим, что PublicUser выглядит так:
interface PublicUser {
  id: string; // Или number, как у тебя в Prisma
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  departamentId: string | null; // Если ID департамента включен
  departament: { // <--- ДОБАВЛЕНА СВЯЗАННАЯ СТРУКТУРА ДЕПАРТАМЕНТА
    name: string;
  } | null; // Может быть null, если у пользователя нет отдела
}


// Эндпоинт для получения данных (замени, если нужно)
// const API_URL = 'https://admin-panel-backend-18np.onrender.com';
const API_URL = 'http://localhost:3000'; // Используем твой локальный, как ты указал
const USER_API_ENDPOINT = `${API_URL}/api/users`; // Шаблонная строка


// --- КОМПОНЕНТ СТРАНИЦЫ УПРАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯМИ ---

const UserManagementPage: FC = () => {
  // 1. Состояния компонента
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<PublicUser[]>([]); // Используем твой PublicUser
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 2. Логика загрузки данных (useEffect)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const response = await fetch(USER_API_ENDPOINT, {
          headers: {
            'Authorization': `Bearer ${token}`, // Шаблонная строка
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Не авторизован. Токен недействителен или отсутствует.');
          } else {
            throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
          }
        }

        const data: PublicUser[] = await response.json(); // Теперь data должна соответствовать PublicUser
        setUsers(data);
        setLoading(false);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(String(e));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Пустой массив зависимостей, чтобы запрос выполнялся один раз

  // 3. Условный рендеринг: Лоадер, Ошибка или Контент
  if (loading) {
    return (
      <Center style={{ height: '100vh', flexDirection: 'column' }}>
        <Loader size="xl" />
        <Text mt="md" size="lg" fw={500}>
          Загружаем список пользователей...
        </Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center style={{ height: '100vh', flexDirection: 'column' }}>
        <Text size="lg" c="red" fw={500}>
          {error}
        </Text>
        <Text mt="sm">Попробуйте обновить страницу или проверьте API endpoint.</Text>
      </Center>
    );
  }

  // --- ЛОГИКА ВОЗВРАТА НА ПРЕДЫДУЩУЮ СТРАНИЦУ ---
  const handleBack = () => {
    navigate(-1);
  };

  // --- 4. Основной UI страницы ---
  return (
    <Container size="xl" py="lg">
      <Group justify="space-between" align="center" mb="lg">
        <Title order={2}>Управление пользователями</Title>

        <Group>
          <Button onClick={handleBack} variant="default">Назад</Button>
          <Button onClick={() => console.log('Добавить пользователя')}>
            Добавить нового </Button>
        </Group>
      </Group>

      {/* Поле поиска (пример) */}
      <TextInput
        placeholder="Поиск по имени или email"
        leftSection={<IconSearch size={16} />}
        mb="lg"
      />

      {/* Отображение списка пользователей в таблице (Mantine Table) */}
      <Box style={{ maxHeight: 700, overflowY: 'auto' }}> {/* СКРОЛЛИНГ */}
        <Table stickyHeader highlightOnHover withColumnBorders withRowBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Имя</Table.Th>
              <Table.Th>Email</Table.Th>
              {/* !!! НОВАЯ КОЛОНКА "ОТДЕЛ" !!! */}
              <Table.Th>Отдел</Table.Th> 
              <Table.Th>Роль</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Действия</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>{user.name} </Table.Td>
                <Table.Td>{user.email}</Table.Td>
                {/* !!! НОВАЯ ЯЧЕЙКА ДЛЯ НАЗВАНИЯ ОТДЕЛА !!! */}
                {/* Используем user.departament.name с проверкой на null */}
                <Table.Td>
                  {user.departament ? user.departament.name : '—'}
                </Table.Td>
                <Table.Td>{user.role}</Table.Td>
                <Table.Td>{user.active ? 'Активен' : 'Отключен'}</Table.Td>
                <Table.Td>
                  <Button variant="outline" size="xs">Редактировать</Button>
                  {/* ... другие действия ... */}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
      {/* Если список пуст */}
      {users.length === 0 && !loading && ( // Добавил !loading, чтобы не показывать при загрузке
        <Center style={{ padding: 'lg', marginTop: 'md', border: '1px solid #ddd', borderRadius: '4px' }}>
          <Text c="dimmed">Нет пользователей для отображения.</Text>
        </Center>
      )}
    </Container>
  );
};

export default UserManagementPage;