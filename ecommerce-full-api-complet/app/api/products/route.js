import dbConnect from '@/lib/dbConnect'
import { NextResponse } from 'next/server'

// Remplacez par votre modèle réel
export async function GET() {
  await dbConnect()
  return NextResponse.json({ message: "GET products" })
}

export async function POST(request) {
  await dbConnect()
  const body = await request.json()
  return NextResponse.json({ message: "POST products", body })
}

export async function PUT(request) {
  await dbConnect()
  const body = await request.json()
  return NextResponse.json({ message: "PUT products", body })
}

export async function DELETE(request) {
  await dbConnect()
  return NextResponse.json({ message: "DELETE products" })
}