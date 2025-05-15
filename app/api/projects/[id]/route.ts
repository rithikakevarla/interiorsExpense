import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Project from "@/models/Project"

// GET a single project by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const project = await Project.findById(params.id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

// PUT update a project
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    await connectToDatabase()
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true },
    )

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE a project
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const deletedProject = await Project.findByIdAndDelete(params.id)

    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
