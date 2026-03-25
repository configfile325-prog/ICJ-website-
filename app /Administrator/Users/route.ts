import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

// GET - Fetch all users
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('purecourt')
    
    const admins = await db.collection('admins').find({}).toArray()
    const support = await db.collection('support').find({}).toArray()
    
    return NextResponse.json({ admins, support })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST - Add new user
export async function POST(request: NextRequest) {
  try {
    const { username, password, type } = await request.json()
    const client = await clientPromise
    const db = client.db('purecourt')
    
    const hashedPassword = await hashPassword(password)
    
    const user = {
      _id: uuidv4(),
      username,
      password: hashedPassword,
      createdAt: new Date()
    }
    
    if (type === 'admin') {
      await db.collection('admins').insertOne(user)
    } else if (type === 'support') {
      await db.collection('support').insertOne(user)
    }
    
    return NextResponse.json({ success: true, user: { ...user, password: undefined } })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

// DELETE - Remove user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    
    if (!id || !type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db('purecourt')
    
    const collection = type === 'admin' ? 'admins' : 'support'
    await db.collection(collection).deleteOne({ _id: id })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
