import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationPayload } from "../../schemas/authSchema"; 
import { TextInput, PasswordInput, Button, Select, Stack, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
 import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom"; // Для возможного редиректа после регистрации

// Определяем пропсы для компонента: нужна функция для закрытия модалки
interface RegistrationFormProps {
  onClose: () => void; 
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose }) => { 
  const navigate = useNavigate();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  const form = useForm<RegistrationPayload>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched" 
  });

  const onSubmit = useCallback(async (values: RegistrationPayload) => {
    if (!selectedDepartmentId) { 
      notifications.show({
        title: "Ошибка",
        message: "Пожалуйста, выберите департамент.",
        color: "red",
        icon: <IconAlertCircle size="1rem" />
      });
      return;
    }

    try {
      await API.post("/auth/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: "USER", // <-- ПОКА ЧТО РЕГИСТРИРУЕМ КАК USER, АДАПТИРУЙ ПОД ТВОЙ БЭКЕНД ИЛИ РОЛИ
        departamentId: selectedDepartmentId,
      });

      notifications.show({
        title: "Отлично!",
        message: "Вы успешно зарегистрировались. Теперь вы можете войти.", 
        color: "teal",
        icon: <IconCheck size="1rem" />,
        autoClose: 5000,
        onClose: () => {
             onClose(); // Закрываем модалку после успешной регистрации
             // После регистрации можно сразу залогинить пользователя или попросить его ввести данные снова.
             // Если хочешь сразу залогинить (бэкенд должен вернуть токен после signup):
             // navigate('/dashboard'); 
             // В этом сценарии, предполагаем, что юзер просто закроет модалку и использует LoginForm для входа.
        },
      });

      form.reset(); // Сбрасываем форму
      setSelectedDepartmentId(null); 
    } catch (error: any) {
      if (error.response?.data?.errors) {
        (error.response.data.errors as { path: string[], message: string }[]).forEach(err => {
          form.setError(err.path[0] as RegistrationPayloadFieldNames, { type: "server", message: err.message });
        });
      }
      const message = error.response?.data?.message || "Не удалось связаться с сервером.";
      notifications.show({
        title: "Ошибка регистрации",
        message: message,
        color: "red",
        icon: <IconAlertCircle size="1rem" />,
        autoClose: 5000,
      });
    }
  }, [form, selectedDepartmentId, onClose, navigate]);

  type RegistrationPayloadFieldNames = keyof RegistrationPayload;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Stack> 
        <Title order={3} ta="center" mb="lg"> 
          Создать новый аккаунт
        </Title>
        <TextInput label="Имя и Фамилия" placeholder="Иван Иванов" {...form.register("name")} error={form.formState.errors.name?.message} mb="sm" />
        <TextInput label="Рабочий Email" type="email" placeholder="user@example.com" {...form.register("email")} error={form.formState.errors.email?.message} mb="sm" autoComplete="email" />
        <PasswordInput label="Пароль" placeholder="Не менее 8 символов" {...form.register("password")} error={form.formState.errors.password?.message} mb="sm" autoComplete="new-password" />
        <PasswordInput label="Подтвердите пароль" placeholder="Повторите пароль" {...form.register("confirmPassword")} error={form.formState.errors.confirmPassword?.message} mb="lg" autoComplete="new-password" />
        <Select
          label="Департамент"
          placeholder="Выберите отдел"
          data={[
            { value: 'b4f3e72d-29db-4b1d-b8a7-42bbc4af3d2d', label: 'Администрация' },
            { value: '6b6071f3-e29c-4933-aedd-4079e1c9db2b', label: 'IT-отдел' },
            { value: 'c865f83d-fa19-4920-95a3-d78ca836dea0', label: 'Бухгалтерия' },
          ]}
          value={selectedDepartmentId}
          onChange={setSelectedDepartmentId}
          required
          mb="lg"
          error={!selectedDepartmentId && form.formState.isSubmitted ? "Пожалуйста, выберите департамент" : undefined}
        />
        <Button type="submit" fullWidth mt="xl">
          Зарегистрироваться
        </Button>
      </Stack>
    </form>
  );
};
export default RegistrationForm;