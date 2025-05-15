import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Project from "@/models/Project"

// POST add a new category to a project
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    await connectToDatabase()

    const project = await Project.findById(params.id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if category already exists
    if (!project.categories.includes(body.category)) {
      project.categories.push(body.category)
      await project.save()
    }

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error adding category:", error)
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 })
  }
}
