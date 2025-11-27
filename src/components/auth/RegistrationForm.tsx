import React, { useCallback, useState } from "react";
    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { registrationSchema, type RegistrationPayload } from "../../schemas/authSchema"; // ИСПРАВЛЕНО
    import { TextInput, PasswordInput, Button, Select} from "@mantine/core";
    import { notifications } from "@mantine/notifications";
    import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
    import API from "../../api/axios"; // Наш настроенный apiClient
    import { useNavigate } from "react-router-dom";

    const RegistrationForm: React.FC = () => {
      const navigate = useNavigate();
      // Используем null, чтобы показать, что ничего не выбрано, или реальный ID с бэкенда.
      const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

      const form = useForm<RegistrationPayload>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
      });

      const onSubmit = useCallback(async (values: RegistrationPayload) => {
        // Проверка на выбранный департамент, так как бэкенд его требует
        if (!selectedDepartmentId || selectedDepartmentId === 'placeholder-id') { // 'placeholder-id' на всякий случай
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
            role: "USER", 
            departamentId: selectedDepartmentId, // Отправляем выбранный ID
          });

          notifications.show({
            title: "Отлично!",
            message: "Вы успешно зарегистрировались. Теперь войдите в систему.",
            color: "teal",
            icon: <IconCheck size="1rem" />,
            autoClose: 5000,
            onClose: () => navigate("/login"), // Перенаправляем на /login
          });

          form.reset();
        } catch (error: any) {
          const message = error.response?.data?.message || "Не удалось связаться с сервером.";
          notifications.show({
            title: "Ошибка регистрации",
            message: message,
            color: "red",
            icon: <IconAlertCircle size="1rem" />,
            autoClose: 5000,
          });
        }
      }, [navigate, form, selectedDepartmentId]); // Добавляем зависимости

      return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TextInput
            label="Имя и Фамилия"
            placeholder=""
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            mb="sm"
          />

          <TextInput
            label="Рабочий Email"
            type="email"
            placeholder=""
            {...form.register("email")}
            error={form.formState.errors.email?.message}
            mb="sm"
          />

          <PasswordInput
            label="Пароль"
            placeholder="Не менее 8 символов"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
            mb="sm"
          />

          <PasswordInput
            label="Подтвердите пароль"
            placeholder="Проверка пароля"
            {...form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword?.message}
            mb="lg"
          />

          {/* Mantine Select для выбора департамента */}
          <Select
            label="Департамент"
            placeholder="Выберите отдел"
            data={[
                // TODO: Здесь будут реальные данные из API.
                // Пока используй реальные ID из своей БД, чтобы бэкенд пропустил!
                { value: 'b4f3e72d-29db-4b1d-b8a7-42bbc4af3d2d', label: 'Администрация' },
                { value: '6b6071f3-e29c-4933-aedd-4079e1c9db2b', label: 'IT-отдел' },
                { value: 'c865f83d-fa19-4920-95a3-d78ca836dea0', label: 'Бухгалтерия' },
            ]}
            value={selectedDepartmentId}
            onChange={setSelectedDepartmentId}
            required
            mb="lg"
          />

          <Button
            type="submit"
            fullWidth
            loading={form.formState.isSubmitting}
            color="teal"
          >
            Зарегистрироваться
          </Button>
        </form>
      );
    };

    export default RegistrationForm;