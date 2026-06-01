import { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma.service";

export type PrismaDbClient = PrismaService | Prisma.TransactionClient;
