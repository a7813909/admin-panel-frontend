import React, { type FC, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Title,
  Text,
  List,
  ThemeIcon,
  rem,
  useMantineTheme,
  Stack, 
} from '@mantine/core';

import { IconCat, IconCircleCheck } from '@tabler/icons-react';
import LoginForm from '../components/auth/LoginForm'; // Импортируем LoginForm

// --- КОНСТАНТЫ И ИНТЕРФЕЙСЫ ---
// Можешь использовать здесь API_URL, который у тебя в других файлах.
const LIVE_API_URL = 'http://localhost:3000'; // Для локального тестирования
//const LIVE_API_URL = 'https://admin-panel-backend-18np.onrender.com'; // Замени на свой URL

const WelcomePage: React.FC = () => {
  const theme = useMantineTheme();

  // --- ЛОГИКА "БУДИЛЬНИКА" ---
  // Этот useEffect сработает один раз при загрузке страницы.
  useEffect(() => {
    // 1. Создаем функцию-будильник
    const wakeUpBackend = async () => {
      try {
        // 2. Отправляем простой, легкий GET-запрос.
        // Цель - разбудить сервер на Render.com.
        // Нам неважно, что он вернет, главное - сам факт запроса.
        await fetch(LIVE_API_URL); // Или `${LIVE_API_URL}/health` если есть такой эндпоинт
        console.log('Backend Woke Up');
      } catch (error) {
        // Если что-то пошло не так (например, сервер недоступен),
        // просто логируем ошибку и не паримся, UI не должен сломаться.
        console.warn('Failed to wake up backend, maybe it is unreachable:', error);
      }
    };

    // 3. Запускаем будильник при первой загрузке компонента
    wakeUpBackend();
  }, []); // Пустой массив зависимостей гарантирует, что это сработает один раз при монтировании

  // --- РЕНДЕРИНГ UI ---
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        padding: theme.spacing.xl,
        backgroundImage: 'url("https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Paper
        radius="lg"
        shadow="xl"
        style={{
          display: 'flex',
          maxWidth: 900,
          width: '100%',
          minHeight: 500,
          overflow: 'hidden',
          backgroundColor: theme.white,
        }}
      >
        {/* --- ЛЕВАЯ ЧАСТЬ (Приветствие, фишки, и инфо о разработчике) --- */}
        <Box
          style={{
            flex: 1,
            backgroundColor: 'rgba(70, 130, 180, 0.9)',
            padding: theme.spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: theme.white,
          }}
        >
          <Stack 
            align="center"
            gap={theme.spacing.sm} // Исправлено на gap
          >
            <Box style={{ 
              width: rem(80), height: rem(80),
              borderRadius: theme.radius.xl,
              backgroundColor: 'rgba(255,255,255, 0.2)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}>
              <IconCat 
                style={{ 
                  width: rem(50), 
                  height: rem(50), 
                  color: theme.colors.blue[1]
                }} 
              />
            </Box>

            <Title order={2} style={{ color: theme.white, fontWeight: 700 }}>
              Добро пожаловать!
            </Title>
            <Text size="md" style={{ color: theme.white, opacity: 0.8 }}>
              Это ваша СРМ для учета персонала
            </Text>
            <Title order={3} style={{ color: theme.white, opacity: 0.9 }}>
              ТЕСТИРОВАНИЕ ОАО "SOLONOE UNLIMITED"
            </Title>
            
            <List
              spacing="sm" // Если Mantine ругается на "sm", попробуй gap="sm" или spacing={theme.spacing.sm}
              size="sm"
              icon={
                <ThemeIcon size={rem(20)} radius="xl" color="white" >
                  <IconCircleCheck style={{ width: rem(12), height: rem(12), color: theme.colors.blue[7] }} />
                </ThemeIcon>
              }
              center
            >
              <List.Item>Удобное ведение кадрового учета</List.Item>
              <List.Item>Быстрый доступ к информации о сотрудниках</List.Item>
              <List.Item>Оптимизация рабочих процессов</List.Item>
            </List>
          </Stack> 

          <Text size="xs" style={{ color: theme.white, opacity: 0.6, marginTop: 'auto' }}>
            Разработчик: "Yanikov" ltd.
          </Text>
        </Box>

        {/* --- ПРАВАЯ ЧАСТЬ (Всегда только Форма Логина) --- */}
        <Box
          style={{
            flex: 1,
            padding: theme.spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <LoginForm /> 
        </Box>
      </Paper>
    </Box>
  );
};

export default WelcomePage;