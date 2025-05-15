import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Project from "@/models/Project"

// POST add a new payment to a project
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    await connectToDatabase()

    const project = await Project.findById(params.id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Add the new payment
    project.payments.push({
      amount: body.amount,
      date: new Date(body.date),
      note: body.note,
    })

    await project.save()

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error adding payment:", error)
    return NextResponse.json({ error: "Failed to add payment" }, { status: 500 })
  }
}
