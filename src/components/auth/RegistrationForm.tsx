import React, { useCallback, useState, useEffect } from "react";
// Импортируем Controller из react-hook-form
import { useForm, Controller, type UseFormReturn } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
// Убедись, что путь к твоим схемам верный
import { registrationSchema, type RegistrationPayload } from "../../schemas/authSchema"; 

// Компоненты из Mantine
import {
  TextInput,
  PasswordInput,
  Button,
  Select,
  Stack,
  Title,
  Loader, // Для индикатора загрузки
} from "@mantine/core";
// Уведомления
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
// API клиент (предполагаем, что он настроен)
import API from "../../api/axios"; 
// Навигация (для редиректа, если нужно)
import { useNavigate } from "react-router-dom";

// --- Интерфейс для данных, которые возвращает API при запросе департаментов ---
// Предполагаем, что API возвращает массив объектов с id и name
interface ApiDepartmentResponse {
  id: string;
  name: string;
}
// --- /Интерфейс для данных API ---

// ---- Интерфейс для опций компонента Select — стандартный формат ----
interface SelectDepartmentOption {
  value: string; // ID департамента
  label: string; // Название департамента для отображения
}
// ---- /Интерфейс для опций Select ----

// --- Интерфейс для имен полей формы (нужен для form.setError) ---
// Убедись, что departamentId тут есть, если он в RegistrationPayload
type RegistrationPayloadFieldNames = keyof RegistrationPayload;

// --- Пропсы компонента ---
interface RegistrationFormProps {
  onClose: () => void; // Функция для закрытия модалки, например
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose }) => {
  const navigate = useNavigate();


  // --- Состояния для списка департаментов ---
  const [departments, setDepartments] = useState<SelectDepartmentOption[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState<boolean>(true);
  // Ошибка, которая может возникнуть при загрузке самого СПИСКА департаментов
  const [departmentLoadError, setDepartmentLoadError] = useState<string | null>(null);


  // --- Хук useEffect для загрузки списка департаментов при первом рендере ---
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoadingDepartments(true);
      setDepartmentLoadError(null); // Сбрасываем ошибку перед новой загрузкой

      try {
        // !!! ЗАМЕНИ "/departments" НА ПРАВИЛЬНЫЙ URL, ЕСЛИ ОН ДРУГОЙ !!!
        const response = await API.get<ApiDepartmentResponse[]>("/departments");

        // --- Преобразуем данные из формата API в формат, нужный для Mantine Select ---
        setDepartments(response.data.map((dept: ApiDepartmentResponse) => ({
          value: dept.id,       // ID департамента идет в 'value'
          label: dept.name,     // Название идет в 'label'
        })));
        // --- Конец преобразования ---

        setIsLoadingDepartments(false);
      } catch (error: any) {
        console.error("Ошибка при загрузке списка департаментов:", error);
        // Показываем уведомление пользователю, если список не подгрузился
        notifications.show({
          title: "Ошибка загрузки",
          message: "Не удалось получить список департаментов. Попробуйте обновить страницу.",
          color: "red",
          icon: <IconAlertCircle size="1rem" />,
          autoClose: 7000,
        });
        setDepartmentLoadError("Не удалось загрузить список департаментов."); // Сохраняем ошибку для возможного отображения
        setIsLoadingDepartments(false);
        setDepartments([]); // Очищаем список, если получили ошибку
      }
    };

    fetchDepartments();
  }, []); // Пустой массив зависимостей означает, что этот эффект выполнится только один раз

  // --- Настройка React Hook Form ---
  const form: UseFormReturn<RegistrationPayload> = useForm<RegistrationPayload>({
    // Используем zodResolver для валидации схемы RegistrationPayload
    resolver: zodResolver(registrationSchema), 
    defaultValues: {
      name: "",
      email: "@",
      password: "",
      confirmPassword: "",
      // !!! ВАЖНО: Должно быть в defaultValues, еслиdepartamentId есть в схеме !!!
      // Если схема ожидает string(), то "" - лучший вариант.
      // Если схема допускает null, то null.
      departamentId: "", 
    },
    //mode: "onTouched" // Валидация запускается после потери фокуса полем
  });

  // --- ОБРАБОТЧИК САБМИТА ФОРМЫ ---
  // Используем useCallback для оптимизации, чтобы функция не пересоздавалась при каждом рендере
  const onSubmit = useCallback(async (values: RegistrationPayload) => {
    try {
      // --- Отправка данных на бэкенд ---
      // Убедись, что "/auth/signup" – правильный эндпоинт
      await API.post("/auth/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: "ADMIN", // <-- ПОКА ЧТО ЗАХАРДКОЖЕНА РОЛЬ 'USER'. АДАПТИРУЙ ПОД СВОИ НУЖДЫ.
        // !!! БЕРЕМ departamentId НАПРЯМУЮ ИЗ ДАННЫХ ФОРМЫ, КОТОРЫЕ ВАЛИДИРОВАЛ ZOD !!!
        departamentId: values.departamentId, 
      });

      // --- Уведомление об успехе ---
      notifications.show({
        title: "Отлично!",
        message: "Вы успешно зарегистрировались. Теперь можете войти.",
        color: "teal",
        icon: <IconCheck size="1rem" />,
        autoClose: 2000, 
        onClose: () => { 
             onClose(); // Закрываем модалку
             // Если нужно перенаправить пользователя после регистрации:
             //navigate('/dashboard'); 
        },
      });

      form.reset(); // Сбрасываем все поля формы
      // !!! УБРАЛИ setSelectedDepartmentId(null);, этого стейта больше нет !!!

    } catch (error: any) {
      // --- Обработка ошибок от сервера ---
      // Проверяем, есть ли в ответе сервера массив конкретных ошибок по полям
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        (error.response.data.errors as { path: string[], message: string }[]).forEach(err => {
          // Пытаемся установить ошибку на конкретное поле в react-hook-form
          if (err.path && err.path.length > 0) {
             // err.path[0] должен быть названием поля (например, 'name', 'email', 'departamentId')
             form.setError(err.path[0] as RegistrationPayloadFieldNames, { type: "server", message: err.message });
          } else {
            // Если path отсутствует, но есть сообщение, показываем общее уведомление
            notifications.show({
              title: "Ошибка",
              message: err.message,
              color: "red",
              icon: <IconAlertCircle size="1rem" />,
              autoClose: 5000,
            });
          }
        });
      } else {
        // Если нет конкретных ошибок, показываем общее сообщение
        const message = error.response?.data?.message || "Не удалось связаться с сервером. Попробуйте позже.";
        notifications.show({
          title: "Ошибка регистрации",
          message: message,
          color: "red",
          icon: <IconAlertCircle size="1rem" />,
          autoClose: 7000,
        });
      }
    }
  }, [form, onClose, navigate]); // Зависимости useCallback

  // --- Render JSX ---
  return (
    // Форма должна быть обернута в <form> с onSubmit
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Title order={2}>Создать новый аккаунт</Title> 

        <TextInput
          label="Имя и Фамилия"
          placeholder="Введите ваше имя и фамилию"
          {...form.register("name")} 
          error={form.formState.errors.name?.message} 
        />

        <TextInput
          label="Рабочий Email"placeholder="Введите ваш email"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />

        <PasswordInput
          label="Пароль"
          placeholder="Придумайте надежный пароль"
          {...form.register("password")}
          error={form.formState.errors.password?.message}
        />

        <PasswordInput
          label="Подтвердите пароль"
          placeholder="Повторите пароль"
          {...form.register("confirmPassword")}
          error={form.formState.errors.confirmPassword?.message}
        />

        {/* --- Компонент Select, управляемый через Controller --- */}
        <Controller
          name="departamentId" // !!! Имя поля должно ТОЧНО совпадать с ключом в RegistrationPayload и zodSchema !!!
          control={form.control} // Подключаем к react-hook-form
          render={({ field, fieldState }) => ( // field и fieldState предоставляют всю нужную информацию
            <Select
              label="Департамент *" 
              placeholder="Выберите департамент"
              data={departments} // Массив опций [{value: 'id', label: 'Name'}, ...]
              
              // --- Эти пропсы передаются напрямую в Mantine Select ---
              {...field} 
              // --- /Пропсы ---

              // --- Обработка ошибки поля и состояния загрузки ---
              error={fieldState.error?.message} // Показываем ошибку от Zod или сервера для этого поля
              searchable // Добавляем поиск, если список большой
              disabled={isLoadingDepartments || departments.length === 0 || !!departmentLoadError} // Дизимблим, если грузим, нет департаментов, или была ошибка загрузки списка
              leftSection={isLoadingDepartments ? <Loader size="xs" /> : null} // Индикатор загрузки
              
              // Mantine Select может возвращать null. Если схема НЕ nullable, передаем пустую строку.
              onChange={(value) => {
                field.onChange(value ?? ""); // <-- Это ОБНОВЛЯЕТ state ВНУТРЯ react-hook-form
                // !!! Больше не нужноsetSelectedDepartmentId(value); !!!
              }}
            />
          )}
        />
         {/* Можно показать ошибку загрузки списка, если она была */}
         {departmentLoadError && <div style={{ color: 'red', fontSize: '0.875rem' }}>{departmentLoadError}</div>}
        {/* --- /Controller для Select --- */}

        <Button 
          type="submit" 
          mt="md" // Отступ сверху
          leftSection={<IconCheck size="1rem" />} // Иконка слева
          loading={form.formState.isSubmitting} // Показываем спиннер на кнопке, когда форма сабмитится
          disabled={form.formState.isSubmitting || departments.length === 0 || !!departmentLoadError} // Дизимблим, если сабмитится или была ошибка загрузки списка
        >
          Зарегистрироваться
        </Button>
      </Stack>
    </form>
  );
};

export default RegistrationForm;