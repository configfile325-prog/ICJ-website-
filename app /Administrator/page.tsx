'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, Plus, Trash2, Users, LogOut, Key } from 'lucide-react'
import Link from 'next/link'

export default function Administrator() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [admins, setAdmins] = useState([])
  const [support, setSupport] = useState([])
  const [activeTab, setActiveTab] = useState('admins')
  const [newUser, setNewUser] = useState({ username: '', password: '' })

  // Fixed credentials for administrator
  const ADMIN_USERNAME = 'Proboiz317'
  const ADMIN_PASSWORD = 'CrazyNGL123'

  useEffect(() => {
    if (loggedIn) {
      fetchUsers()
    }
  }, [loggedIn])

  const fetchUsers = async () => {
    const token = localStorage.getItem('administratorToken')
    const res = await fetch('/api/administrator/users', {
      headers: { 'Authorization': token || '' }
    })
    if (res.ok) {
      const data = await res.json()
      setAdmins(data.admins || [])
      setSupport(data.support || [])
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('administratorToken', 'administrator-jwt-token')
      setLoggedIn(true)
    } else {
      alert('Invalid administrator password')
    }
  }

  const addUser = async (type: string) => {
    const token = localStorage.getItem('administratorToken')
    await fetch('/api/administrator/users', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token || ''
      },
      body: JSON.stringify({ ...newUser, type })
    })
    setNewUser({ username: '', password: '' })
    fetchUsers()
  }

  const deleteUser = async (id: string, type: string) => {
    const token = localStorage.getItem('administratorToken')
    await fetch(`/api/administrator/users/${id}?type=${type}`, {
      method: 'DELETE',
      headers: { 'Authorization': token || '' }
    })
    fetchUsers()
  }

  const logout = () => {
    localStorage.removeItem('administratorToken')
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-12 rounded-3xl w-full max-w-md mx-4 border-2 border-court-secondary"
        >
          <div className="text-center mb-8">
            <Shield className="w-20 h-20 text-court-secondary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-court-secondary drop-shadow-[0_0_10px_rgba(112,0,255,0.8)]">Administrator</h1>
            <p className="text-gray-400 text-sm">Super Admin Control Panel</p>
            <p className="text-xs text-court-primary mt-2">Username: {ADMIN_USERNAME}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Administrator Password"
                className="input-field rounded-xl pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              type="submit"
              className="w-full bg-gradient-to-r from-court-secondary to-court-accent rounded-xl py-3 font-bold text-white"
            >
              Access Administrator Panel
            </motion.button>
          </form>

          <Link href="/" className="block text-center mt-6 text-court-secondary hover:text-court-accent">
            Return to Home
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cyber-grid p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-court-secondary drop-shadow-[0_0_10px_rgba(112,0,255,0.8)]">Administrator Panel</h1>
            <p className="text-gray-400">Manage admin and support accounts</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin">
              <button className="px-4 py-2 glass-panel rounded-lg hover:bg-court-primary/20">Admin Panel</button>
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
            onClick={() => setActiveTab('admins')}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition ${activeTab === 'admins' ? 'bg-court-primary text-black' : 'glass-panel'}`}
          >
            <Shield className="w-5 h-5" /> Admin Accounts ({admins.length})
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition ${activeTab === 'support' ? 'bg-court-accent text-white' : 'glass-panel'}`}
          >
            <Users className="w-5 h-5" /> Support Accounts ({support.length})
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl mb-6"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-court-primary" /> 
            Add New {activeTab === 'admins' ? 'Admin' : 'Support'} Account
          </h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Username"
              className="input-field rounded-xl flex-1"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field rounded-xl flex-1"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addUser(activeTab === 'admins' ? 'admin' : 'support')}
              className="px-6 py-2 bg-court-primary text-black font-bold rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </motion.button>
          </div>
        </motion.div>

        <div className="space-y-3">
          {(activeTab === 'admins' ? admins : support).map((user: any) => (
            <motion.div 
              key={user._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-4 rounded-xl flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === 'admins' ? 'bg-court-primary/20' : 'bg-court-accent/20'}`}>
                  {activeTab === 'admins' ? <Shield className="w-5 h-5 text-court-primary" /> : <Users className="w-5 h-5 text-court-accent" />}
                </div>
                <div>
                  <p className="font-bold">{user.username}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Key className="w-3 h-3" /> {user.password ? 'Has password' : 'No password'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => deleteUser(user._id, activeTab === 'admins' ? 'admin' : 'support')}
                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
