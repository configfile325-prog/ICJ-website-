import { NextRequest, NextResponse } from 'next/server'

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const ALERT_CHANNEL_ID = '1482592482356363368'

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()
    
    let embed = {
      title: '',
      description: '',
      color: 0,
      fields: [] as any[],
      timestamp: new Date().toISOString()
    }
    
    if (type === 'staff_application') {
      embed = {
        title: '📝 New Staff Application',
        description: `Application from ${data.discordUsername}`,
        color: 0x00d4ff,
        fields: [
          { name: 'Position', value: data.question, inline: true },
          { name: 'Age', value: data.age, inline: true },
          { name: 'Discord ID', value: data.discordId, inline: true },
          { name: 'Experience', value: data.experience.substring(0, 1000) },
          { name: 'Reason', value: data.reason.substring(0, 1000) }
        ],
        timestamp: new Date().toISOString()
      }
    } else if (type === 'court_request') {
      embed = {
        title: '⚖️ New Court Case Filed',
        description: `Case ID: ${data.ticketId}`,
        color: 0xffd700,
        fields: [
          { name: 'Plaintiff', value: `${data.user1}\nID: ${data.user1Id}`, inline: true },
          { name: 'Defendant', value: `${data.user2}\nID: ${data.user2Id}`, inline: true },
          { name: 'Reason', value: data.reason.substring(0, 1000) },
          { name: 'Evidence', value: data.evidence ? data.evidence.substring(0, 1000) : 'None provided' }
        ],
        timestamp: new Date().toISOString()
      }
    }
    
    // Send to Discord via bot API
    const discordRes = await fetch(`https://discord.com/api/v10/channels/${ALERT_CHANNEL_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: type === 'court_request' ? '@here New court case requires attention!' : '@here New staff application!',
        embeds: [embed]
      })
    })
    
    if (!discordRes.ok) {
      console.error('Discord API error:', await discordRes.text())
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Alert error:', error)
    return NextResponse.json({ error: 'Failed to send alert' }, { status: 500 })
  }
}
