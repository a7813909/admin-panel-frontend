export const ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  USER: 'USER',
} as const
export type RoleType = typeof ROLES[keyof typeof ROLES];