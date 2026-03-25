'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gavel, User, AlertTriangle, MessageSquare, ArrowLeft, CheckCircle, Scale } from 'lucide-react'
import Link from 'next/link'

export default function CourtRequest() {
  const [formData, setFormData] = useState({
    user1: '',
    user2: '',
    user1Id: '',
    user2Id: '',
    reason: '',
    evidence: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/court-request', {
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
          <h2 className="text-3xl font-bold mb-4 neon-text">Court Request Filed!</h2>
          <p className="text-gray-400 mb-4">A Discord ticket will be created automatically.</p>
          <p className="text-sm text-court-primary mb-8">Case ID: COURT-{Date.now()}</p>
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
            <Scale className="w-16 h-16 text-court-gold mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2 text-court-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Request Court Decision</h1>
            <p className="text-gray-400">File a case with the International Court of Justice</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel p-4 rounded-xl border-l-4 border-court-primary">
                <label className="flex items-center gap-2 text-court-primary mb-2 text-sm font-semibold">
                  <User className="w-4 h-4" /> Your Discord Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="@yourusername"
                  className="input-field rounded-lg"
                  value={formData.user1}
                  onChange={(e) => setFormData({...formData, user1: e.target.value})}
                />
                <input
                  type="text"
                  required
                  placeholder="Your User ID"
                  className="input-field rounded-lg mt-2 text-sm"
                  value={formData.user1Id}
                  onChange={(e) => setFormData({...formData, user1Id: e.target.value})}
                />
              </div>
              
              <div className="glass-panel p-4 rounded-xl border-l-4 border-court-accent">
                <label className="flex items-center gap-2 text-court-accent mb-2 text-sm font-semibold">
                  <User className="w-4 h-4" /> Other Party Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="@otheruser"
                  className="input-field rounded-lg"
                  value={formData.user2}
                  onChange={(e) => setFormData({...formData, user2: e.target.value})}
                />
                <input
                  type="text"
                  required
                  placeholder="Their User ID"
                  className="input-field rounded-lg mt-2 text-sm"
                  value={formData.user2Id}
                  onChange={(e) => setFormData({...formData, user2Id: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-court-gold mb-2 text-sm font-semibold">
                <AlertTriangle className="w-4 h-4" /> Reason for Court Case
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the dispute or issue that requires court intervention..."
                className="input-field rounded-xl resize-none"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-court-primary mb-2 text-sm font-semibold">
                <MessageSquare className="w-4 h-4" /> Evidence / Additional Info
              </label>
              <textarea
                rows={4}
                placeholder="Links to screenshots, messages, or any supporting evidence..."
                className="input-field rounded-xl resize-none"
                value={formData.evidence}
                onChange={(e) => setFormData({...formData, evidence: e.target.value})}
              />
            </div>

            <div className="glass-panel p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                A Discord ticket will be automatically created with ID: COURT-{Date.now()}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-court-gold to-yellow-600 text-black font-bold rounded-xl py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-50 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Gavel className="w-5 h-5" /> File Court Case
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
