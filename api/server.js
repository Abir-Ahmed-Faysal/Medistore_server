var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express7 from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum ORDER_STATUS {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nenum UserRole {\n  ADMIN\n  USER\n  SELLER\n}\n\nmodel User {\n  id            String     @id\n  name          String\n  email         String\n  emailVerified Boolean    @default(false)\n  image         String?\n  role          UserRole   @default(USER)\n  banned        Boolean    @default(false)\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  profile       Profile?\n  orders        Order[]\n  medicines     Medicine[]\n  reviews       Review[]\n\n  phone String?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Profile {\n  id          String    @id @default(uuid())\n  bio         String?\n  dateOfBirth DateTime?\n  userId      String    @unique\n  userRef     User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n}\n\nmodel Order {\n  id          String       @id @default(uuid())\n  userId      String\n  userRef     User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  address     String       @db.VarChar(255)\n  totalAmount Decimal      @default(0) @db.Decimal(10, 2)\n  status      ORDER_STATUS @default(PLACED)\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  orderItems  Order_item[]\n\n  @@index([userId])\n  @@map("order")\n}\n\nmodel Order_item {\n  id           String   @id @default(uuid())\n  orderId      String\n  userOrderRef Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  medicineId   String\n  medicineRef  Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  quantity     Int\n  reviews      Review[]\n\n  @@index([orderId])\n  @@index([medicineId])\n  @@map("order_item")\n}\n\nmodel Medicine {\n  id           String       @id @default(uuid())\n  title        String       @unique\n  description  String       @db.Text\n  manufacturer String\n  price        Decimal      @db.Decimal(10, 2)\n  stock        Int\n  sellerId     String\n  sellerRef    User         @relation(fields: [sellerId], references: [id], onDelete: Cascade)\n  categoryId   String\n  categoryRef  Category     @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  orderItems   Order_item[]\n  reviews      Review[]\n\n  @@index([sellerId])\n  @@index([categoryId])\n  @@map("medicine")\n}\n\nmodel Category {\n  id            String     @id @default(uuid())\n  category_name String     @unique\n  medicines     Medicine[]\n\n  @@map("category")\n}\n\nmodel Review {\n  id            String     @id @default(uuid())\n  content       String\n  medicineId    String\n  medicineRef   Medicine   @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  userId        String\n  userRef       User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  order_itemId  String\n  rating        Int\n  order_itemRef Order_item @relation(fields: [order_itemId], references: [id], onDelete: Cascade)\n\n  @@index([medicineId])\n  @@index([userId])\n  @@index([order_itemId])\n  @@map("review")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"banned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"phone","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"userRef","kind":"object","type":"User","relationName":"ProfileToUser"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"userRef","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"address","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"ORDER_STATUS"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"Order_item","relationName":"OrderToOrder_item"}],"dbName":"order"},"Order_item":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"userOrderRef","kind":"object","type":"Order","relationName":"OrderToOrder_item"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicineRef","kind":"object","type":"Medicine","relationName":"MedicineToOrder_item"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"reviews","kind":"object","type":"Review","relationName":"Order_itemToReview"}],"dbName":"order_item"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"sellerRef","kind":"object","type":"User","relationName":"MedicineToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"categoryRef","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"orderItems","kind":"object","type":"Order_item","relationName":"MedicineToOrder_item"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"}],"dbName":"medicine"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"category_name","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":"category"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicineRef","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"userId","kind":"scalar","type":"String"},{"name":"userRef","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"order_itemId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"order_itemRef","kind":"object","type":"Order_item","relationName":"Order_itemToReview"}],"dbName":"review"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MedicineScalarFieldEnum: () => MedicineScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  Order_itemScalarFieldEnum: () => Order_itemScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProfileScalarFieldEnum: () => ProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Profile: "Profile",
  Order: "Order",
  Order_item: "Order_item",
  Medicine: "Medicine",
  Category: "Category",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  role: "role",
  banned: "banned",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  phone: "phone"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProfileScalarFieldEnum = {
  id: "id",
  bio: "bio",
  dateOfBirth: "dateOfBirth",
  userId: "userId"
};
var OrderScalarFieldEnum = {
  id: "id",
  userId: "userId",
  address: "address",
  totalAmount: "totalAmount",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var Order_itemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  medicineId: "medicineId",
  quantity: "quantity"
};
var MedicineScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  manufacturer: "manufacturer",
  price: "price",
  stock: "stock",
  sellerId: "sellerId",
  categoryId: "categoryId"
};
var CategoryScalarFieldEnum = {
  id: "id",
  category_name: "category_name"
};
var ReviewScalarFieldEnum = {
  id: "id",
  content: "content",
  medicineId: "medicineId",
  userId: "userId",
  order_itemId: "order_itemId",
  rating: "rating"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/enums.ts
var ORDER_STATUS = {
  PLACED: "PLACED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// src/generated/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/modules/users/user.route.ts
import express from "express";

// src/middleware/auth.ts
import { fromNodeHeaders } from "better-auth/node";
var auth2 = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });
      if (!session?.user?.id) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          role: true,
          banned: true
        }
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      if (user.banned) {
        res.status(403).json({ message: "Account suspended" });
        return;
      }
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        banned: user.banned
      };
      next();
    } catch (err) {
      console.error("Auth error:", err);
      res.status(401).json({ message: "Authentication failed" });
    }
  };
};

// src/middleware/sendRes.ts
var sendResponse = (res, payload, statusCode = 200) => {
  res.status(statusCode).json(payload);
};

// src/modules/users/user.service.ts
var getAllUser = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      banned: true,
      role: true
    }
  });
  return users;
};
var banUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, banned: true }
  });
  if (!user) {
    throw Error("User not found");
  }
  if (user.banned) {
    throw new Error("User already banned");
  }
  return prisma.user.update({
    where: { id },
    data: { banned: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true
    }
  });
};
var unBanUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { banned: true }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (!user.banned) {
    throw new Error("User is not banned");
  }
  return prisma.user.update({
    where: { id },
    data: { banned: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true
    }
  });
};
var userService = {
  getAllUser,
  banUser,
  unBanUser
};

// src/modules/users/user.controller.ts
var getAllUser2 = async (req, res) => {
  try {
    const users = await userService.getAllUser();
    if (!users) {
      return sendResponse(res, { success: false, message: "no user found" });
    }
    return sendResponse(res, { success: true, message: "users data fetch successfully", data: users }, 200);
  } catch (error) {
    const errorM = error instanceof Error ? error.message : "something went wrong !";
    return sendResponse(res, { success: true, message: "users data fetch successfully", errors: errorM }, 200);
  }
};
var banUser2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new Error("id not found");
    }
    const user = await userService.banUser(id);
    return sendResponse(res, {
      success: true,
      message: "User banned successfully",
      data: user
    }, 200);
  } catch (error) {
    next(error);
  }
};
var unBanUser2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new Error("id not found");
    }
    const user = await userService.unBanUser(id);
    return sendResponse(res, {
      success: true,
      message: "User unbanned successfully",
      data: user
    }, 200);
  } catch (error) {
    next(error);
  }
};
var userController = {
  getAllUser: getAllUser2,
  banUser: banUser2,
  unBanUser: unBanUser2
};

// src/modules/users/user.route.ts
var router = express.Router();
router.get("/", auth2("ADMIN"), userController.getAllUser);
router.patch("/:id/ban", auth2("ADMIN"), userController.banUser);
router.patch("/:id/unban", auth2("ADMIN"), userController.unBanUser);
var userRouter = router;

// src/modules/auth/auth.route.ts
import express2 from "express";

// src/modules/auth/auth.services.ts
var registerUser = async ({ name, email, password, image, phone, role }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const safeRole = role === "SELLER" ? "SELLER" : "USER";
  const payload = {
    role: safeRole
  };
  if (phone) {
    payload.phone = phone;
  }
  const result = await prisma.$transaction(async (tx) => {
    const user = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        image,
        phone
      }
    });
    const updatedUser = await tx.user.update({
      where: { id: user.user.id },
      data: { ...payload }
    });
    return updatedUser;
  });
  return result;
};
var registerService = {
  registerUser
};

// src/modules/auth/auth.controller.ts
var getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const { id, email, name, role, banned } = req.user;
  return res.status(200).json({ id, email, name, role, banned });
};
var registerUser2 = async (req, res, next) => {
  try {
    const { name, email, password, image, phone, role } = req.body;
    const newUser = await registerService.registerUser({
      name,
      email,
      password,
      image,
      phone,
      role
    });
    return sendResponse(res, {
      success: true,
      message: "Registered successfully",
      data: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    }, 201);
  } catch (error) {
    if (error.message.includes("Email already exists")) {
      return sendResponse(res, {
        success: false,
        message: "Email already registered"
      }, 400);
    }
    next(error);
  }
};
var authController = {
  getCurrentUser,
  registerUser: registerUser2
};

// src/middleware/hitChecker.ts
var hitApi = (req, res, next) => {
  console.log("hit the api middleware \n ", "body is here: \n", req.body, "url here:\n", req.url);
  next();
};

// src/modules/auth/auth.route.ts
var router2 = express2.Router();
router2.post("/email", hitApi, authController.registerUser);
router2.get("/", auth2(), authController.getCurrentUser);
var authRouter = router2;

// src/middleware/notFound.ts
function notFoundHandler(req, res, _) {
  res.status(404).json({
    message: "The requested resource was not found.",
    path: req.originalUrl,
    date: (/* @__PURE__ */ new Date()).toISOString()
  });
}

// src/middleware/universalError.ts
function universalErrorHandler(err, __, res, _) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Your provided data is invalid.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "An operation failed it depends on one or more records that were required but not found.";
    }
    if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Duplicate key or attribute.";
    }
    if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constrain failed.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Database connection failed due to Authentication failed.Please  check your credential.";
    }
    if (err.errorCode === "P1001") {
      statusCode = 503;
      errorMessage = "Database connection failed due to the database server is not running or is unreachable.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "An unknown error occurred while processing the request.";
  }
  res.status(statusCode).json({
    message: errorMessage,
    error: errorDetails
  });
}

// src/modules/medicines/medicine.route.ts
import express3 from "express";

// src/helper/PaginationHelperFunction.ts
var PaginationHelperFunction = (option) => {
  const search = option.search || void 0;
  const category = option.category || void 0;
  const minPrice = Math.ceil(Number(option.minPrice) || 1);
  const maxPrice = Number(option.maxPrice) || 50;
  const manufacturer = option.manufacturer || void 0;
  const page = Number(option.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;
  return {
    search,
    category,
    minPrice,
    maxPrice,
    manufacturer,
    page,
    skip,
    limit
  };
};

// src/modules/medicines/medicine.service.ts
var getAllMedicine = async ({
  search,
  category,
  minPrice,
  maxPrice,
  manufacturer,
  page,
  skip,
  limit
}) => {
  const andCondition = [];
  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          categoryRef: {
            category_name: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      ]
    });
  }
  if (category) {
    andCondition.push({
      categoryRef: {
        category_name: {
          equals: category,
          mode: "insensitive"
        }
      }
    });
  }
  if (manufacturer) {
    andCondition.push({
      manufacturer: {
        contains: manufacturer,
        mode: "insensitive"
      }
    });
  }
  if (minPrice !== void 0 || maxPrice !== void 0) {
    andCondition.push({
      price: {
        gte: minPrice,
        lte: maxPrice
      }
    });
  }
  const allMedicine = await prisma.medicine.findMany({
    where: {
      AND: andCondition
    },
    skip,
    take: limit,
    include: {
      categoryRef: true
    }
  });
  const total = await prisma.medicine.count({
    where: {
      AND: andCondition
    }
  });
  return {
    data: allMedicine,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit)
    }
  };
};
var getMedicine = async (id) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: {
      categoryRef: {
        select: {
          category_name: true
        }
      }
    }
  });
  if (!medicine) {
    throw new Error("Medicine not found");
  }
  return medicine;
};
var addMedicine = async ({
  title,
  description,
  manufacturer,
  convertPrice,
  convertStock,
  sellerId,
  categoryId
}) => {
  const findCategory = await prisma.category.findUnique({
    where: {
      id: categoryId
    },
    select: {
      id: true
    }
  });
  if (!findCategory) {
    throw new Error("category Not found");
  }
  return prisma.medicine.create({
    data: {
      title,
      description,
      manufacturer,
      price: convertPrice,
      stock: convertStock,
      sellerId,
      categoryId
    },
    include: {
      categoryRef: { select: { category_name: true } }
    }
  });
};
var updateMedicine = async (id, sellerId, payload) => {
  console.log(payload);
  const medicine = await prisma.medicine.findFirst({
    where: { id, sellerId }
  });
  if (!medicine) throw new Error("Unauthorized");
  const result = await prisma.medicine.update({
    where: { id },
    data: payload
  });
  return result;
};
var removeMedicine = async (id, sellerId) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id, sellerId },
    select: { id: true }
  });
  if (!medicine) {
    throw new Error("Medicine not found");
  }
  const result = await prisma.medicine.delete({
    where: { id }
  });
  return result;
};
var medicineService = {
  getAllMedicine,
  getMedicine,
  addMedicine,
  updateMedicine,
  removeMedicine
};

// src/modules/medicines/medicine.controller.ts
var getAllMedicines = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      manufacturer,
      page,
      skip,
      limit
    } = PaginationHelperFunction(req.query);
    const allMedicine = await medicineService.getAllMedicine({
      search,
      category,
      minPrice,
      maxPrice,
      manufacturer,
      page,
      skip,
      limit
    });
    if (!allMedicine) {
      return sendResponse(res, { success: false, message: "no medicine found" }, 404);
    }
    return sendResponse(res, { success: true, message: "medicine data retrieve successfully", data: allMedicine }, 200);
  } catch (error) {
    next(error);
  }
};
var getMedicine2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new Error("id not found");
    }
    const findMedicine = await medicineService.getMedicine(id);
    if (!findMedicine) {
      return sendResponse(res, { success: false, message: "medicine not found" }, 404);
    }
    return sendResponse(res, { success: true, message: "medicine data retrieve successfully", data: findMedicine }, 200);
  } catch (error) {
    next(error);
  }
};
var addMedicine2 = async (req, res, next) => {
  console.log("hit the add medicine route");
  try {
    const { title, description, manufacturer, price, stock, categoryId } = req.body;
    const { id: sellerId } = req.user;
    if (!sellerId || typeof sellerId !== "string") {
      throw new Error("seller id not found");
    }
    if (!title || !description || !manufacturer || !price || !stock || !sellerId || !categoryId) {
      return sendResponse(res, { success: false, message: "All fields are required" }, 400);
    }
    const convertStock = Number(stock);
    const convertPrice = Number(price);
    console.log(convertStock, convertPrice);
    const newMedicine = await medicineService.addMedicine({
      title,
      description,
      manufacturer,
      convertPrice,
      convertStock,
      sellerId,
      categoryId
    });
    return sendResponse(res, {
      success: true,
      message: "Medicine added successfully",
      data: newMedicine
    }, 201);
  } catch (error) {
    next(error);
  }
};
var updateMedicine2 = async (req, res, next) => {
  try {
    const { id: sellerId } = req?.user;
    const { id } = req.params;
    const payload = req.body;
    if (!sellerId || typeof sellerId !== "string") {
      throw new Error("seller not found");
    }
    if (!id || typeof id !== "string" || !payload) {
      throw new Error("id updated data not found");
    }
    console.log(payload);
    if (payload.price) {
      payload.price = Number(payload.price);
    }
    if (payload.stock) {
      payload.stock = Number(payload.stock);
    }
    const result = await medicineService.updateMedicine(id, sellerId, payload);
    sendResponse(res, {
      success: true,
      message: "Medicine updated successfully",
      data: result
    }, 200);
  } catch (error) {
    next(error);
  }
};
var removeMedicine2 = async (req, res, next) => {
  try {
    const { id: sellerId } = req?.user;
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new Error("id not found");
    }
    if (!sellerId || typeof sellerId !== "string") {
      throw new Error("seller not found");
    }
    const result = await medicineService.removeMedicine(id, sellerId);
    if (!result) {
      return sendResponse(res, { success: false, message: "medicine not found" }, 404);
    }
    sendResponse(res, {
      success: true,
      message: "Medicine removed successfully",
      data: result
    }, 200);
  } catch (error) {
    next(error);
  }
};
var medicineController = {
  getAllMedicines,
  getMedicine: getMedicine2,
  addMedicine: addMedicine2,
  updateMedicine: updateMedicine2,
  removeMedicine: removeMedicine2
};

// src/modules/medicines/medicine.route.ts
var router3 = express3.Router();
router3.get("/", medicineController.getAllMedicines);
router3.get("/:id", hitApi, medicineController.getMedicine);
router3.post("/", auth2("SELLER"), medicineController.addMedicine);
router3.patch("/:id", auth2("SELLER"), medicineController.updateMedicine);
router3.delete("/:id", auth2("SELLER"), medicineController.removeMedicine);

// src/modules/categories/category.route.ts
import express4 from "express";

// src/modules/categories/category.service.ts
var getAllCategories = async () => {
  return prisma.category.findMany({
    select: {
      id: true,
      category_name: true
    }
  });
};
var createCategory = async (category_name) => {
  return prisma.category.create({
    data: {
      category_name
    }
  });
};
var updateCategory = async (id, category_name) => {
  return prisma.category.update({
    where: { id },
    data: { category_name }
  });
};
var deleteCategory = async (id) => {
  return prisma.category.delete({
    where: { id }
  });
};
var categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

// src/modules/categories/category.controller.ts
var getAllCategory = async (req, res, next) => {
  try {
    const allCategories = await categoryService.getAllCategories();
    if (!allCategories) {
      res.status(404).json({ success: false, message: "no category found" });
    }
    res.status(200).json({ success: true, message: "category data retrieve successfully", data: allCategories });
  } catch (error) {
    next(error);
  }
};
var createCategory2 = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    const newCategory = await categoryService.createCategory(category_name);
    res.status(201).json({ success: true, message: "category create successfully", data: newCategory });
  } catch (error) {
    next(error);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    const updatedCategory = await categoryService.updateCategory(id, category_name);
    res.status(200).json({ success: true, message: "category data update successfully", data: updatedCategory });
  } catch (error) {
    next(error);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
var categoryController = {
  getAllCategory,
  createCategory: createCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/categories/category.route.ts
var router4 = express4.Router();
router4.get("/", categoryController.getAllCategory);
router4.post("/", auth2("ADMIN"), categoryController.createCategory);
router4.patch("/:id", auth2("ADMIN"), categoryController.updateCategory);
router4.delete("/:id", auth2("ADMIN"), categoryController.deleteCategory);

// src/modules/orders/order.route.ts
import express5 from "express";

// src/modules/orders/order.service.ts
var createNewOrder = async (userId, address, items) => {
  return prisma.$transaction(async (tx) => {
    const medicineIds = items.map((i) => i.medicineId);
    const medicines = await tx.medicine.findMany({
      where: { id: { in: medicineIds } }
    });
    if (medicines.length !== items.length) {
      throw new Error("Some medicines not found");
    }
    const medicineMap = new Map(medicines.map((m) => [m.id, m]));
    let totalAmount = 0;
    for (const item of items) {
      if (item.quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
      }
      const medicine = medicineMap.get(item.medicineId);
      if (!medicine) {
        throw new Error("Medicine not found");
      }
      if (medicine.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${medicine.title}`);
      }
      totalAmount += medicine.price.toNumber() * Number(item.quantity);
    }
    const order = await tx.order.create({
      data: {
        userId,
        address,
        totalAmount
      }
    });
    for (const item of items) {
      const updated = await tx.medicine.updateMany({
        where: {
          id: item.medicineId,
          stock: { gte: item.quantity }
        },
        data: {
          stock: { decrement: item.quantity }
        }
      });
      if (updated.count === 0) {
        throw new Error("Stock changed, please retry");
      }
      await tx.order_item.create({
        data: {
          orderId: order.id,
          medicineId: item.medicineId,
          quantity: item.quantity
        }
      });
    }
    return order;
  });
};
var getUserOrders = async (userId) => {
  const data = prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      status: true,
      totalAmount: true,
      orderItems: {
        select: {
          id: true,
          quantity: true,
          medicineRef: {
            select: {
              id: true,
              title: true,
              price: true,
              manufacturer: true,
              categoryRef: {
                select: { category_name: true }
              }
            }
          },
          reviews: {
            select: {
              id: true,
              content: true,
              rating: true,
              userRef: {
                select: { name: true }
              }
            }
          }
        }
      }
    }
  });
  if (!data) {
    throw new Error("No order found");
  }
  return data;
};
var getOrderDetails = async (userId, orderId) => {
  const order = await prisma.order.findFirstOrThrow({
    where: {
      id: orderId,
      userId
    },
    select: {
      id: true,
      address: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      orderItems: {
        select: {
          id: true,
          quantity: true,
          medicineRef: {
            select: {
              id: true,
              title: true,
              price: true,
              description: true,
              manufacturer: true
            }
          }
        }
      }
    }
  });
  return order;
};
var getSellerOrders = async ({ page = 1, limit = 20 }) => {
  const orders = await prisma.order.findMany({
    include: {
      userRef: {
        select: { id: true, name: true, email: true }
      },
      orderItems: {
        include: {
          medicineRef: {
            select: { id: true, title: true, price: true, stock: true }
          }
        }
      }
    }
  });
  if (!orders) {
    throw new Error("no order placed");
  }
  const totalOrders = await prisma.order.count();
  return {
    data: orders,
    meta: {
      total: totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit)
    }
  };
};
var updateOrderStatus = async (orderId, status) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });
  console.log(order);
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.status === status) {
    throw new Error("order status already updated");
  }
  if (order.status === ORDER_STATUS.CANCELLED) {
    throw new Error("Cancelled orders cannot be updated");
  }
  const data = prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
  console.log(data);
  return data;
};
var cancelUserOrder = async (orderId, userId) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId }
  });
  if (order.userId !== userId) {
    throw new Error("Unauthorized");
  }
  if (order.status !== ORDER_STATUS.PLACED) {
    throw new Error("Only placed orders can be cancelled");
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status: ORDER_STATUS.CANCELLED }
  });
};
var orderService = {
  getUserOrders,
  getOrderDetails,
  createNewOrder,
  getSellerOrders,
  updateOrderStatus,
  cancelUserOrder
};

// src/modules/orders/order.controller.ts
var createNewOrder2 = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const payload = req.body;
    const { address, items, quantity } = payload;
    if (!userId) {
      return sendResponse(res, { success: false, message: "Unauthorized" }, 401);
    }
    if (!address || typeof address !== "string" || !Array.isArray(items) || items.length === 0) {
      return sendResponse(res, { success: false, message: "Invalid input data" }, 400);
    }
    const order = await orderService.createNewOrder(userId, address, items);
    return sendResponse(
      res,
      { success: true, message: "Order placed successfully", data: order },
      201
    );
  } catch (error) {
    next(error);
  }
};
var getUserOrders2 = async (req, res, next) => {
  try {
    console.log("hit here vvvvv");
    const { id: userId } = req.user;
    if (!userId) {
      return sendResponse(res, { success: false, message: "Unauthorized" }, 401);
    }
    const orders = await orderService.getUserOrders(userId);
    return sendResponse(
      res,
      { success: true, message: "Orders fetched successfully", data: orders },
      200
    );
  } catch (error) {
    next(error);
  }
};
var getOrderDetails2 = async (req, res, next) => {
  console.log("man hit ehr");
  try {
    const { id: userId } = req.user;
    const { id: orderId } = req.params;
    console.log("hti the detail");
    if (!orderId || typeof orderId !== "string") {
      return sendResponse(
        res,
        { success: false, message: "Order ID is required" },
        400
      );
    }
    const order = await orderService.getOrderDetails(userId, orderId);
    return sendResponse(
      res,
      { success: true, message: "Order details fetched", data: order },
      200
    );
  } catch (error) {
    next(error);
  }
};
var updateUserOrderStatus = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id: orderId } = req.params;
    const status = "CANCELLED";
    if (!userId || typeof userId !== "string" || !orderId || typeof orderId !== "string") {
      return sendResponse(res, { success: false, message: "Invalid request" }, 400);
    }
    if (status !== ORDER_STATUS.CANCELLED) {
      return sendResponse(
        res,
        { success: false, message: "Only CANCELLED status allowed" },
        400
      );
    }
    const updatedOrder = await orderService.cancelUserOrder(orderId, userId);
    return sendResponse(
      res,
      { success: true, message: "Order cancelled successfully", data: updatedOrder },
      200
    );
  } catch (error) {
    next(error);
  }
};
var getSellerOrders2 = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const orders = await orderService.getSellerOrders({ page, limit });
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      ...orders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders"
    });
  }
};
var updateOrderStatusBySeller = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const status = req.body.status;
    if (!orderId || !Object.values(ORDER_STATUS).includes(status)) {
      return sendResponse(res, { success: false, message: "Invalid input" }, 400);
    }
    if (status === ORDER_STATUS.CANCELLED) {
      return sendResponse(
        res,
        { success: false, message: "Seller cannot cancel orders" },
        400
      );
    }
    const updatedOrder = await orderService.updateOrderStatus(
      orderId,
      status
    );
    return sendResponse(
      res,
      { success: true, message: "Order status updated", data: updatedOrder },
      200
    );
  } catch (error) {
    next(error);
  }
};
var orderController = {
  getUserOrders: getUserOrders2,
  getOrderDetails: getOrderDetails2,
  createNewOrder: createNewOrder2,
  getSellerOrders: getSellerOrders2,
  updateOrderStatusBySeller,
  updateUserOrderStatus
};

// src/modules/orders/order.route.ts
var router5 = express5.Router();
router5.get("/user", hitApi, auth2("USER"), orderController.getUserOrders);
router5.get("/user/:id", auth2("USER"), orderController.getOrderDetails);
router5.post("/user", auth2("USER"), orderController.createNewOrder);
router5.patch("/user/:id/cancel", auth2("USER"), orderController.updateUserOrderStatus);
router5.get("/seller", hitApi, auth2("SELLER"), orderController.getSellerOrders);
router5.patch("/seller/:id", hitApi, auth2("SELLER"), orderController.updateOrderStatusBySeller);
router5.get("/admin", auth2("ADMIN"));
router5.get("/admin/:id", auth2("ADMIN"));
router5.patch("/admin/:id", auth2("ADMIN"));
router5.delete("/admin/:id", auth2("ADMIN"));

// src/modules/reviews/review.route.ts
import express6 from "express";

// src/modules/reviews/review.service.ts
var createReview = async (payload) => {
  const { medicineId, orderItemId, content, numberRating, userId } = payload;
  return prisma.$transaction(async (tx) => {
    const orderItem = await tx.order_item.findUnique({
      where: { id: orderItemId },
      select: {
        id: true,
        medicineId: true,
        userOrderRef: {
          select: { userId: true }
        }
      }
    });
    if (!orderItem) {
      throw new Error("Order item not found");
    }
    if (orderItem.userOrderRef.userId !== userId) {
      throw new Error("You are not allowed to review this order item");
    }
    if (orderItem.medicineId !== medicineId) {
      throw new Error("Medicine does not match order item");
    }
    return tx.review.create({
      data: {
        content,
        rating: numberRating,
        medicineId,
        userId,
        order_itemId: orderItemId
      }
    });
  });
};
var getReviewsByMedicine = async (medicineId) => {
  return prisma.review.findMany({
    where: { medicineId },
    orderBy: { id: "desc" },
    include: {
      userRef: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  });
};
var getMyReviews = async (userId) => {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { id: "desc" },
    include: {
      medicineRef: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });
};
var reviewService = {
  createReview,
  getReviewsByMedicine,
  getMyReviews
};

// src/modules/reviews/reviews.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { medicineId, orderItemId, content, rating } = req.body;
    console.log(req.body);
    const numberRating = Number(rating);
    console.log("hit here");
    const review = await reviewService.createReview({
      medicineId,
      orderItemId,
      content,
      numberRating,
      userId
    });
    console.log("hit her by under review ", review);
    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review
    });
  } catch (error) {
    next(error);
  }
};
var reviewController = {
  createReview: createReview2
};

// src/modules/reviews/review.route.ts
var router6 = express6.Router();
router6.post("/", auth2(), reviewController.createReview);

// src/app.ts
var app = express7();
app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }));
app.all("/api/auth/sign-in/*splat", toNodeHandler(auth));
app.use(express7.json());
app.get("/", (_, res) => {
  res.send("MediStore server is running");
});
app.use("/api/auth/me", authRouter);
app.use("/api/auth/sign-up", authRouter);
app.use("/api/admin/users", userRouter);
app.use("/api/admin/users", userRouter);
app.use("/api/categories", router4);
app.use("/api/admin/categories", router4);
app.use("/api/medicines", router3);
app.use("/api/seller/medicines", router3);
app.use("/api/orders", router5);
app.use("/api/reviews", router6);
app.use(notFoundHandler);
app.use(universalErrorHandler);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 4e3;
async function bootstrap() {
  try {
    await prisma.$connect();
    console.log("Connected to database");
    app_default.listen(PORT, () => {
      console.log(`MediStore server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
bootstrap();
//!  /api/medicines?search=napa&category=painkiller&minPrice=50&maxPrice=200&manufacturer=Square
