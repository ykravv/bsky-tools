import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(handle: User["handle"]) {
  return prisma.user.create({
    data: {
      handle,
    },
  });
}

export async function verifyLogin(
  handle: User["handle"],
  password: string
) {
  return null
}
