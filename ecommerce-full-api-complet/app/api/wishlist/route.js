import dbConnect from '@/lib/dbConnect'
import { NextResponse } from 'next/server'

// Remplacez par votre modèle réel
export async function GET() {
  await dbConnect()
  return NextResponse.json({ message: "GET wishlist" })
}

export async function POST(request) {
  await dbConnect()
  const body = await request.json()
  return NextResponse.json({ message: "POST wishlist", body })
}

export async function PUT(request) {
  await dbConnect()
  const body = await request.json()
  return NextResponse.json({ message: "PUT wishlist", body })
}

export async function DELETE(request) {
  await dbConnect()
  return NextResponse.json({ message: "DELETE wishlist" })
}