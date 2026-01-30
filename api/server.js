var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express3 from "express";
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
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum ORDER_STATUS {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nenum UserRole {\n  ADMIN\n  USER\n  SELLER\n}\n\nmodel User {\n  id            String     @id\n  name          String\n  email         String\n  emailVerified Boolean    @default(false)\n  image         String?\n  role          UserRole   @default(USER)\n  banned        Boolean    @default(false)\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  profile       Profile?\n  orders        Order[]\n  medicines     Medicine[]\n  reviews       Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Profile {\n  id          String    @id @default(uuid())\n  bio         String?\n  dateOfBirth DateTime?\n  userId      String    @unique\n  userRef     User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n}\n\nmodel Order {\n  id         String       @id @default(uuid())\n  userId     String       @unique\n  userRef    User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  address    String       @db.VarChar(255)\n  status     ORDER_STATUS @default(PLACED)\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n  orderItems Order_item[]\n\n  @@index([userId])\n  @@map("order")\n}\n\nmodel Order_item {\n  id           String   @id @default(uuid())\n  orderId      String\n  userOrderRef Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  medicineId   String\n  medicineRef  Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  quantity     Int\n  reviews      Review[]\n\n  @@index([orderId])\n  @@index([medicineId])\n  @@map("order_item")\n}\n\nmodel Medicine {\n  id           String       @id @default(uuid())\n  title        String\n  description  String       @db.Text\n  manufacturer String\n  price        Decimal      @db.Decimal(10, 2)\n  stock        Int\n  sellerId     String\n  sellerRef    User         @relation(fields: [sellerId], references: [id], onDelete: Cascade)\n  categoryId   String\n  categoryRef  Category     @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  orderItems   Order_item[]\n  reviews      Review[]\n\n  @@index([sellerId])\n  @@index([categoryId])\n  @@map("medicine")\n}\n\nmodel Category {\n  id            String     @id @default(uuid())\n  category_name String     @unique\n  medicines     Medicine[]\n\n  @@map("category")\n}\n\nmodel Review {\n  id            String     @id @default(uuid())\n  content       String\n  medicineId    String\n  medicineRef   Medicine   @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  userId        String\n  userRef       User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  order_itemId  String\n  order_itemRef Order_item @relation(fields: [order_itemId], references: [id], onDelete: Cascade)\n\n  @@index([medicineId])\n  @@index([userId])\n  @@index([order_itemId])\n  @@map("review")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"banned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"userRef","kind":"object","type":"User","relationName":"ProfileToUser"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"userRef","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"address","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ORDER_STATUS"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"Order_item","relationName":"OrderToOrder_item"}],"dbName":"order"},"Order_item":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"userOrderRef","kind":"object","type":"Order","relationName":"OrderToOrder_item"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicineRef","kind":"object","type":"Medicine","relationName":"MedicineToOrder_item"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"reviews","kind":"object","type":"Review","relationName":"Order_itemToReview"}],"dbName":"order_item"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"sellerRef","kind":"object","type":"User","relationName":"MedicineToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"categoryRef","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"orderItems","kind":"object","type":"Order_item","relationName":"MedicineToOrder_item"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"}],"dbName":"medicine"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"category_name","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":"category"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicineRef","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"userId","kind":"scalar","type":"String"},{"name":"userRef","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"order_itemId","kind":"scalar","type":"String"},{"name":"order_itemRef","kind":"object","type":"Order_item","relationName":"Order_itemToReview"}],"dbName":"review"}},"enums":{},"types":{}}');
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
  updatedAt: "updatedAt"
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
  order_itemId: "order_itemId"
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

// src/modules/auth/auth.controller.ts
var getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const { id, email, name, role, banned } = req.user;
  return res.status(200).json({ id, email, name, role, banned });
};

// src/modules/auth/auth.route.ts
var router2 = express2.Router();
router2.get("/", auth2(), getCurrentUser);
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

// src/app.ts
var app = express3();
app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }));
app.all("/api/auth/sign-up/*splat", toNodeHandler(auth));
app.all("/api/auth/sign-in/*splat", toNodeHandler(auth));
app.use(express3.json());
app.get("/", (req, res) => {
  res.send("MediStore server is running");
});
app.use("/api/auth/me", authRouter);
app.use("/api/admin/users", userRouter);
app.use("/api/admin/users", userRouter);
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
