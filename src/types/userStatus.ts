const UserStatus = {
 ACTIVE:"ACTIVE",
 DISABLED:"DISABLED"
} as const;

export type TypeUserStatus = typeof UserStatus[keyof typeof UserStatus];
