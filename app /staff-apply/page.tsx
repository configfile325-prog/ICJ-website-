'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, User, Hash, Briefcase, MessageCircle, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function StaffApply() {
  const [formData, setFormData] = useState({
    question: '',
    age: '',
    discordId: '',
    discordUsername: '',
    experience: '',
    reason: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/staff-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-12 rounded-3xl text-center max-w-md mx-4"
        >
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 neon-text">Application Submitted!</h2>
          <p className="text-gray-400 mb-8">Your staff application has been received. We will review it and contact you via Discord.</p>
          <Link href="/">
            <button className="btn-primary rounded-xl">Return Home</button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cyber-grid py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <motion.button 
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-court-primary mb-8 hover:text-court-accent transition"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </motion.button>
        </Link>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <Briefcase className="w-16 h-16 text-court-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2 neon-text">Staff Application</h1>
            <p className="text-gray-400">Join the International Court of Justice team</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-court-primary mb-2 text-sm font-semibold">
                  <MessageCircle className="w-4 h-4" /> Question
                </label>
                <input
                  type="text"
                  required
                  placeholder="What position are you applying for?"
                  className="input-field rounded-xl"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-court-primary mb-2 text-sm font-semibold">
                  <Hash className="w-4 h-4" /> Age
                </label>
                <input
                  type="number"
                  required
                  min="13"
                  max="100"
                  placeholder="Your age"
                  className="input-field rounded-xl"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-court-primary mb-2 text-sm font-semibold">
                  <Hash className="w-4 h-4" /> Discord User ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="123456789012345678"
                  className="input-field rounded-xl"
                  value={formData.discordId}
                  onChange={(e) => setFormData({...formData, discordId: e.target.value})}
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-court-primary mb-2 text-sm font-semibold">
                  <User className="w-4 h-4" /> Discord Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="username#0000 or @username"
                  className="input-field rounded-xl"
                  value={formData.discordUsername}
                  onChange={(e) => setFormData({...formData, discordUsername: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-court-primary mb-2 text-sm font-semibold">
                <Briefcase className="w-4 h-4" /> Previous Experience
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your previous moderation/staff experience..."
                className="input-field rounded-xl resize-none"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-court-primary mb-2 text-sm font-semibold">
                <MessageCircle className="w-4 h-4" /> Why should we choose you?
              </label>
              <textarea
                required
                rows={4}
                placeholder="Explain why you want to join and what you can contribute..."
                className="input-field rounded-xl resize-none"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full btn-primary rounded-xl py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" /> Submit Application
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
