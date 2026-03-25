import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('purecourt')
    
    const ticketId = `COURT-${Date.now()}`
    
    const courtCase = {
      _id: uuidv4(),
      ...body,
      ticketId,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.collection('court_cases').insertOne(courtCase)
    
    // Send Discord notification for ticket creation
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/discord/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'court_request',
          data: courtCase
        })
      })
    } catch (e) {
      console.error('Discord alert failed:', e)
    }
    
    return NextResponse.json({ success: true, id: courtCase._id, ticketId })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit court request' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('purecourt')
    const cases = await db.collection('court_cases')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json(cases)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch court cases' }, { status: 500 })
  }
}
