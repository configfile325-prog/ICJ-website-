import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('purecourt')
    
    const application = {
      _id: uuidv4(),
      ...body,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.collection('staff_applications').insertOne(application)
    
    // Send Discord notification
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/discord/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'staff_application',
          data: application
        })
      })
    } catch (e) {
      console.error('Discord alert failed:', e)
    }
    
    return NextResponse.json({ success: true, id: application._id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('purecourt')
    const applications = await db.collection('staff_applications')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}
