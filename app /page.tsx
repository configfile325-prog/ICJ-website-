'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Scale, Shield, Gavel, Users, MessageSquare, Lock } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-court-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-court-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-court-accent/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-16"
        >
          <div className="flex items-center gap-3">
            <Scale className="w-10 h-10 text-court-primary" />
            <div>
              <h1 className="text-2xl font-bold neon-text">PURE COURT ENERGY</h1>
              <p className="text-xs text-court-primary/70 tracking-widest">INTERNATIONAL COURT OF JUSTICE</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link href="/admin">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 glass-panel rounded-lg text-sm hover:bg-court-primary/20 transition"
              >
                <Lock className="w-4 h-4" />
                Admin
              </motion.button>
            </Link>
            <Link href="/administrator">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 glass-panel rounded-lg text-sm hover:bg-court-secondary/20 transition"
              >
                <Shield className="w-4 h-4" />
                Administrator
              </motion.button>
            </Link>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-20"
        >
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Scale className="w-32 h-32 mx-auto text-court-primary mb-8 drop-shadow-[0_0_30px_rgba(0,212,255,0.8)]" />
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6 neon-text">
            JUSTICE SYSTEM
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Advanced Discord Court Management Platform. Resolve disputes, manage staff, and maintain order with futuristic precision.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/staff-apply">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,212,255,0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary rounded-xl text-lg"
              >
                Apply for Staff
              </motion.button>
            </Link>
            <Link href="/court-request">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(112,0,255,0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-court-secondary to-court-accent rounded-xl font-bold text-lg transition hover:shadow-[0_0_40px_rgba(112,0,255,0.6)]"
              >
                Request Court
              </motion.button>
            </Link>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <FeatureCard 
            icon={<Gavel className="w-8 h-8" />}
            title="Court System"
            description="Automated ticket creation for disputes between users with role-based access control."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8" />}
            title="Staff Management"
            description="Complete staff application system with experience tracking and approval workflow."
          />
          <FeatureCard 
            icon={<MessageSquare className="w-8 h-8" />}
            title="Discord Integration"
            description="Real-time alerts and ticket management synced with your Discord server."
          />
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          <StatCard number="24/7" label="Active Monitoring" />
          <StatCard number="100+" label="Cases Handled" />
          <StatCard number="50+" label="Staff Members" />
          <StatCard number="99%" label="Resolution Rate" />
        </motion.section>
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,212,255,0.2)' }}
      className="glass-panel p-8 rounded-2xl text-center group cursor-pointer"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-court-primary/30 to-court-secondary/30 flex items-center justify-center text-court-primary group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-court-primary">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

function StatCard({ number, label }: { number: string, label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-court-primary neon-text mb-2">{number}</div>
      <div className="text-sm text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  )
}
