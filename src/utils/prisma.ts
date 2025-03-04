// import { PrismaClient } from '@prisma/client/edge'
import { PrismaClient, FeedbackStatus } from "@prisma/client";

export const prisma = new PrismaClient();

export const FBStatus = FeedbackStatus;
