 import { z } from 'zod';

    export const registrationSchema = z.object({
      name: z.string().min(1, "Имя и фамилия обязательны").max(100, "Имя слишком длинное"),
      email: z.string().email("Неверный формат email").min(1, "Email обязателен"),
      password: z.string().min(8, "Пароль должен быть не менее 8 символов"),
      confirmPassword: z.string(), // Валидация совпадения будет ниже
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Пароли не совпадают",
      path: ["confirmPassword"], // Указываем, к какому полю привязать ошибку
    });

    export type RegistrationPayload = z.infer<typeof registrationSchema>;

    // Опционально: схема для логина, если понадобится в будущем
    export const loginSchema = z.object({
      email: z.string().email("Неверный формат email").min(1, "Email обязателен"),
      password: z.string().min(1, "Пароль обязателен"),
    });
    export type LoginPayload = z.infer<typeof loginSchema>;