import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Project from "@/models/Project"

// POST add a new expense to a project
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    await connectToDatabase()

    const project = await Project.findById(params.id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Add the new expense
    project.expenses.push({
      category: body.category,
      amount: body.amount,
      date: new Date(body.date),
      note: body.note,
    })

    await project.save()

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error adding expense:", error)
    return NextResponse.json({ error: "Failed to add expense" }, { status: 500 })
  }
}
