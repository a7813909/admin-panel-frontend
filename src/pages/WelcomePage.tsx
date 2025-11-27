import React from 'react';
import {
  Box,
  Paper,
  Title,
  Text,
  Button,
  Anchor,
  TextInput,
  PasswordInput,
  Group,
  List,
  ThemeIcon,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconCat, IconCircleCheck, IconSofa } from '@tabler/icons-react';

// ... (остальной код AuthForm, если он используется)
import RegistrationForm from '../components/auth/RegistrationForm';


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
        //backgroundImage: 'linear-gradient(to bottom right, #a7c6e0, #6a9acb)', // Фон остается прежним
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
          backgroundColor: theme.white, // Фон формы белый
        }}
      >
        {/* --- ЛЕВАЯ ЧАСТЬ (Приветствие, фишки, и инфо о разработчике) --- */}
        <Box
          style={{
            flex: 1,
            backgroundColor: 'rgba(70, 130, 180, 0.9)', // Левая колонка синяя
            padding: theme.spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // <<< Изменили, чтобы "Разработчик" прижимался к низу
            alignItems: 'center',
            color: theme.white, // Текст белый
            //textAlign: 'center',
            // gap: theme.spacing.lg, // Можно убрать gap, если justify-content="space-between"
          }}
        >
          {/* Верхняя часть блока - контент с логотипом, заголовками и списком */}
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: theme.spacing.lg }}>
            {/* Логотип/Иконка - IconSofa, темно-синяя */}
            <Box style={{
              width: rem(80), height: rem(80),
              borderRadius: theme.radius.xl,
              backgroundColor: 'rgba(255,255,255, 0.2)', // Прозрачный белый кружок вокруг иконки
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              marginBottom: theme.spacing.md,
            }}>
              <IconCat 
                style={{ 
                  width: rem(50), 
                  height: rem(50), 
                  color: theme.colors.blue[1] // Темно-синяя иконка
                }} 
              />
            </Box>


            <Title order={2} style={{ color: theme.white, fontWeight: 700 }}>
              Добро пожаловать!
            </Title>
            <Text size="md" style={{ color: theme.white, opacity: 0.8 }}>
              Это ваша СРМ для учета персонала
            </Text>
            <Title order={3} style={{ color: theme.white, opacity: 0.9, marginBottom: theme.spacing.xl }}>
              ОАО "Жлобинмебель"
            </Title>

            <List
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={rem(20)} radius="xl" color="white" >
                  <IconCircleCheck style={{ width: rem(12), height: rem(12), color: theme.colors.blue[7] }} />
                </ThemeIcon>
              }
              center
              mt="xl"
              style={{ }}
            >
              <List.Item>Удобное ведение кадрового учета</List.Item>
              <List.Item>Быстрый доступ к информации о сотрудниках</List.Item>
              <List.Item>Оптимизация рабочих процессов</List.Item>
            </List>
          </Box>

          {/* --- НИЖНЯЯ ЧАСТЬ БЛОКА - ИНФОРМАЦИЯ О РАЗРАБОТЧИКЕ --- */}
          <Box mt="xl"> {/* Отступ сверху, чтобы не прилипало */}
            <Text size="xs" style={{ color: theme.colors.blue[9], opacity: 0.6 }}>
              Разработчик: "Cat ЛУНТИК-Solonoe" ltd.
            </Text>
          </Box>
        </Box>

        {/* --- ПРАВАЯ ЧАСТЬ (Форма регистрации) --- */}
        <Box
          style={{
            flex: 1,
            padding: theme.spacing.xl,
            backgroundColor: theme.white,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
            <RegistrationForm />
        </Box>
      </Paper>
    </Box>
  );
};

export default WelcomePage;