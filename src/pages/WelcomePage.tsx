import React from 'react';
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

const WelcomePage: React.FC = () => {
  const theme = useMantineTheme();

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
              ОАО "Жлобинмебель"
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
            Разработчик: "Cat ЛУНТИК-Solonce" ltd.
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