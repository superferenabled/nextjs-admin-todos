import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import * as yup from "yup";

interface Params {
  id: string;
}

interface Segments {
  params: Promise<Params>;
}

export async function GET(request: Request, { params }: Segments) {
  const { id } = await params;

  const found = await prisma.todo.findUnique({ where: { id } });

  if (!found)
    return NextResponse.json({ message: "Entry not found" }, { status: 404 });

  return NextResponse.json(found);
}

const putSchema = yup.object({
  description: yup.string().optional(),
  complete: yup.boolean().optional().default(false),
});

interface UpdateTodos {
  description: string | null;
  complete: boolean | null;
}

export async function PUT(request: Request, { params }: Segments) {
  const { id } = await params;
  try {
    const { description, complete } = await putSchema.validate(
      await request.json(),
    );

    const found = await prisma.todo.findUnique({ where: { id } });

    const updateData: UpdateTodos = {
      description: null,
      complete: null,
    };

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        description: updateData.description || found?.description,
        complete: updateData.complete || found?.complete
      },
    });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
