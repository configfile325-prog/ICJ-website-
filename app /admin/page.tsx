'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Users, FileText, CheckCircle, XCircle, LogOut, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [applications, setApplications] = useState([])
  const [courtCases, setCourtCases] = useState([])
  const [activeTab, setActiveTab] = useState('applications')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loggedIn) {
      fetchData()
    }
  }, [loggedIn])

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken')
    const res1 = await fetch('/api/staff-apply', { headers: { 'Authorization': token || '' } })
    const res2 = await fetch('/api/court-request', { headers: { 'Authorization': token || '' } })
    
    if (res1.ok) setApplications(await res1.json())
    if (res2.ok) setCourtCases(await res2.json())
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    
    const data = await res.json()
    
    if (res.ok) {
      localStorage.setItem('adminToken', data.token)
      setLoggedIn(true)
    } else {
      alert('Invalid credentials')
    }
    setLoading(false)
  }

  const handleApprove = async (id: string, type: string) => {
    const token = localStorage.getItem('adminToken')
    await fetch(`/api/${type}/${id}/approve`, {
      method: 'POST',
      headers: { 'Authorization': token || '' }
    })
    fetchData()
  }

  const handleDelete = async (id: string, type: string) => {
    const token = localStorage.getItem('adminToken')
    await fetch(`/api/${type}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': token || '' }
    })
    fetchData()
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-12 rounded-3xl w-full max-w-md mx-4"
        >
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-court-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold neon-text">Admin Panel</h1>
            <p className="text-gray-400 text-sm">Staff & Court Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="input-field rounded-xl"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="input-field rounded-xl pr-12"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full btn-primary rounded-xl py-3 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Panel'}
            </motion.button>
          </form>

          <Link href="/" className="block text-center mt-6 text-court-primary hover:text-court-accent">
            Return to Home
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cyber-grid p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold neon-text">Admin Dashboard</h1>
            <p className="text-gray-400">Manage applications and court cases</p>
          </div>
          <div className="flex gap-4">
            <Link href="/">
              <button className="px-4 py-2 glass-panel rounded-lg hover:bg-court-primary/20">Home</button>
            </Link>
            <button 
              onClick={logout}
              className="px-4 py-2 glass-panel rounded-lg hover:bg-red-500/20 flex items-center gap-2 text-red-400"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition ${activeTab === 'applications' ? 'bg-court-primary text-black' : 'glass-panel'}`}
          >
            <Users className="w-5 h-5" /> Staff Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('court')}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition ${activeTab === 'court' ? 'bg-court-gold text-black' : 'glass-panel'}`}
          >
            <FileText className="w-5 h-5" /> Court Cases ({courtCases.length})
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'applications' && applications.map((app: any) => (
            <motion.div 
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-court-primary">{app.discordUsername}</h3>
                  <p className="text-sm text-gray-400">ID: {app.discordId} | Age: {app.age}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${app.status === 'approved' ? 'bg-green-500/20 text-green-400' : app.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {app.status || 'pending'}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                <div className="glass-panel p-3 rounded-lg">
                  <p className="text-court-primary font-semibold mb-1">Position:</p>
                  <p className="text-gray-300">{app.question}</p>
                </div>
                <div className="glass-panel p-3 rounded-lg">
                  <p className="text-court-primary font-semibold mb-1">Experience:</p>
                  <p className="text-gray-300">{app.experience}</p>
                </div>
              </div>
              
              <div className="glass-panel p-3 rounded-lg mb-4">
                <p className="text-court-primary font-semibold mb-1">Reason:</p>
                <p className="text-gray-300">{app.reason}</p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleApprove(app._id, 'staff-apply')}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button 
                  onClick={() => handleDelete(app._id, 'staff-apply')}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          ))}

          {activeTab === 'court' && courtCases.map((case_: any) => (
            <motion.div 
              key={case_._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl border-l-4 border-court-gold"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-court-gold">Case: {case_.user1} vs {case_.user2}</h3>
                  <p className="text-sm text-gray-400">Ticket ID: {case_.ticketId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${case_.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {case_.status || 'open'}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                <div className="glass-panel p-3 rounded-lg">
                  <p className="text-court-primary font-semibold mb-1">Plaintiff:</p>
                  <p className="text-gray-300">{case_.user1} ({case_.user1Id})</p>
                </div>
                <div className="glass-panel p-3 rounded-lg">
                  <p className="text-court-accent font-semibold mb-1">Defendant:</p>
                  <p className="text-gray-300">{case_.user2} ({case_.user2Id})</p>
                </div>
              </div>
              
              <div className="glass-panel p-3 rounded-lg mb-4">
                <p className="text-court-gold font-semibold mb-1">Reason:</p>
                <p className="text-gray-300">{case_.reason}</p>
              </div>
              
              {case_.evidence && (
                <div className="glass-panel p-3 rounded-lg mb-4">
                  <p className="text-court-primary font-semibold mb-1">Evidence:</p>
                  <p className="text-gray-300 text-sm">{case_.evidence}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={() => handleApprove(case_._id, 'court-request')}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Resolved
                </button>
                <button 
                  onClick={() => handleDelete(case_._id, 'court-request')}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
