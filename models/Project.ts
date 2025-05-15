import mongoose, { Schema, type Document } from "mongoose"

// Payment interface
interface IPayment extends Document {
  amount: number
  date: Date
  note?: string
}

// Expense interface
interface IExpense extends Document {
  category: string
  amount: number
  date: Date
  note?: string
}

// Project interface
export interface IProject extends Document {
  customerName: string
  location: string
  squareFeet: number
  quotedPrice: number
  payments: IPayment[]
  expenses: IExpense[]
  categories: string[]
  createdAt: Date
  updatedAt: Date
}

// Payment schema
const PaymentSchema = new Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  note: { type: String },
})

// Expense schema
const ExpenseSchema = new Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  note: { type: String },
})

// Project schema
const ProjectSchema = new Schema(
  {
    customerName: { type: String, required: true },
    location: { type: String, required: true },
    squareFeet: { type: Number, required: true },
    quotedPrice: { type: Number, required: true },
    payments: [PaymentSchema],
    expenses: [ExpenseSchema],
    categories: [{ type: String }],
  },
  { timestamps: true },
)

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
