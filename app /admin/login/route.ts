import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    const client = await clientPromise
    const db = client.db('purecourt')
    
    // Check if user is the hardcoded administrator
    if (username === 'Proboiz317' && password === 'CrazyNGL123') {
      const token = generateToken({ username, role: 'administrator' })
      return NextResponse.json({ success: true, token, role: 'administrator' })
    }
    
    // Check regular admins
    const admin = await db.collection('admins').findOne({ username })
    if (admin && await verifyPassword(password, admin.password)) {
      const token = generateToken({ username, role: 'admin', id: admin._id })
      return NextResponse.json({ success: true, token, role: 'admin' })
    }
    
    // Check support staff
    const support = await db.collection('support').findOne({ username })
    if (support && await verifyPassword(password, support.password)) {
      const token = generateToken({ username, role: 'support', id: support._id })
      return NextResponse.json({ success: true, token, role: 'support' })
    }
    
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
