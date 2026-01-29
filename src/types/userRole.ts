const USER_ROLES = {
  USER: "USER",
  SELLER: "SELLER",
  ADMIN: "ADMIN",
} as const;

export type TypeUserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
