import { prisma, FBStatus } from "./prisma";
import jwt from "jsonwebtoken";
import { compare, hash } from "bcryptjs";
// @types/jsonwebtoken
// @types/bcryptjs

const JWT_SECRET = Bun.env.JWT_SECRET || "feedback_app_secret_key";
// const JWT_SECRET = process.env.JWT_SECRET || "feedback_app_secret_key";

export const register = async (email: string, password: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return JSON.stringify({ token, userId: user.id });
  } catch (error) {
    console.error("Registration error:", error);
    return false;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return false;

    const isValid = await compare(password, user.password);
    if (!isValid) return false;

    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return JSON.stringify({ token, userId: user.id });
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    // Decode base64
    const decoded = Buffer.from(payload, "base64").toString();
    const decodedPayload = JSON.parse(decoded);
    // Get userId from token
    const userId = decodedPayload.userId || 0;
    return Number.parseInt(userId);
  } catch (error) {
    return null;
  }
};
