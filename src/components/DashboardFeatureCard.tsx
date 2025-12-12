import { type FC, type ComponentProps } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Text, Button, } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react'; // Импортируем любую иконку для примера, чтобы извлечь тип пропсов.

// --- Исправление ошибки 'TablerIconsProps' ---

// Определяем пропсы для нашего компонента.
// Вместо того, чтобы импортировать TablerIconsProps, который не существует:
// interface DashboardCardProps { icon: FC<TablerIconsProps>; ... }

// Мы используем ComponentProps<typeof IconUsers> чтобы автоматически получить тип пропсов.
// Это говорит TypeScript: "Возьми все пропсы, которые принимают TablerIcons, и используй их как тип для нашего icon".
// Это надежный и 'феншуйный' способ.
interface DashboardCardProps {
  icon: FC<ComponentProps<typeof IconUsers>>; // Теперь тип иконки - это FC с пропсами, которые принимает IconUsers
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  linkTo: string;
}

const DashboardFeatureCard: FC<DashboardCardProps> = ({
  icon: IconComponent,
  title,
  description,
  buttonText,
  buttonColor,
  linkTo,
}) => {
  const navigate = useNavigate();
  const ICON_SIZE = 36; // Используем общую константу для размера иконки

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {/* Иконка. IconComponent - это React компонент,
          который был передан в пропсах. */}
      <IconComponent size={ICON_SIZE} style={{ marginBottom: 10 }} />

      {/* Заголовок */}
      <Text fw={500} size="lg" mb="xs">
        {title}
      </Text>

      {/* Описание */}
      <Text fz="sm" c="dimmed">
        {description}
      </Text>

      {/* Кнопка */}
      <Button
        color={buttonColor}
        variant="light"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => navigate(linkTo)}
      >
        {buttonText}
      </Button>
    </Card>
  );
};

export default DashboardFeatureCard;