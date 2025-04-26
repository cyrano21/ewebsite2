import dbConnect from '@/lib/dbConnect'
import { NextResponse } from 'next/server'

// Remplacez par votre modèle réel
export async function GET() {
  await dbConnect()
  return NextResponse.json({ message: "GET user" })
}

export async function POST(request) {
  await dbConnect()
  const body = await request.json()
  return NextResponse.json({ message: "POST user", body })
}

export async function PUT(request) {
  await dbConnect()
  const body = await request.json()
  return NextResponse.json({ message: "PUT user", body })
}

export async function DELETE(request) {
  await dbConnect()
  return NextResponse.json({ message: "DELETE user" })
}