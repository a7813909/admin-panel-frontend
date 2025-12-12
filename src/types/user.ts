import type { RoleType } from '../shared/userRoles'; // Импортируем только тип

/**
 * Интерфейс пользователя.
 * Определяет структуру объекта пользователя, который приходит с бэкенда.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: RoleType; // Используем импортированный тип для ролей
  departmentName: string;
  createdAt: string; // Обычно приходит как ISO-строка, преобразуется позже в Date
  updatedAt: string;
}