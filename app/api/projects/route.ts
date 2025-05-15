import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Project from "@/models/Project"

// GET all projects
export async function GET() {
  try {
    await connectToDatabase()
    const projects = await Project.find({}).sort({ createdAt: -1 })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

// POST create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json()

    await connectToDatabase()

    // Set default categories if not provided
    if (!body.categories || body.categories.length === 0) {
      body.categories = [
        "Fall Ceiling",
        "Electrical Work",
        "Painting",
        "Wood Work",
        "Hardware",
        "Glasswork",
        "CNC",
        "Stone Work",
        "AC",
        "Fabrication",
        "Mesh",
        "miscellaneous",
      ]
    }

    const newProject = new Project({
      customerName: body.customerName,
      location: body.location,
      squareFeet: body.squareFeet,
      quotedPrice: body.quotedPrice,
      payments: [],
      expenses: [],
      categories: body.categories,
    })

    const savedProject = await newProject.save()

    return NextResponse.json(savedProject, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
