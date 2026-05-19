import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await prisma.todo.deleteMany(); // delete * from todo
  const todo = await prisma.todo.createManyAndReturn({
    data: [
      { description: "soul stone", complete: true },
      { description: "time stone" },
      { description: "power stone" },
      { description: "space stone" },
      { description: "mind stone" },
      { description: "reality stone" },
    ],
  });
  console.log(todo);

  return NextResponse.json({ message: "seed executed bitch" });
}
