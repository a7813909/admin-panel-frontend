import React from 'react';
    import { useNavigate } from 'react-router-dom';
    // Если используешь Mantine
    import { Container, Title, Text, Button } from '@mantine/core';

    const DashboardPage: React.FC = () => {
      const navigate = useNavigate();

      const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login'); // Перенаправляем на страницу логина
        // window.location.reload(); // Можно и так, но navigate лучше в React Router
      };

      return (
        <Container size="md" style={{ textAlign: 'center', marginTop: '50px' }}>
          <Title order={1}>Добро пожаловать на Дашборд!</Title>
          <Text size="lg" style={{ marginTop: '20px' }}>
            Это ваш личный кабинет. Доступен только авторизованным пользователям.
          </Text>
          <Button onClick={handleLogout} color="red" style={{ marginTop: '30px' }}>
            Выйти
          </Button>
        </Container>
      );
    };

    export default DashboardPage;