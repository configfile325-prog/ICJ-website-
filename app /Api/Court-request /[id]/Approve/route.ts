import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('purecourt')
    
    await db.collection('court_cases').updateOne(
      { _id: params.id },
      { $set: { status: 'resolved', updatedAt: new Date() } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve' }, { status: 500 })
  }
}
