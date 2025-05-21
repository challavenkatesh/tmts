'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  Home,
  Users,
  Calendar,
  BarChart2,
  Settings,
  Bell,
  UserCircle,
  X,
  Shield,
  Folder,
  UserPlus2,
  Group,
  FileSearch,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', icon: <Home />, href: '/AdminPage/admin' },
  { name: 'Employees', icon: <Users />, href: '/AdminPage/employees' },
  { name: 'Trainings', icon: <Calendar />, href: '/trainings' },
  { name: 'Reports', icon: <BarChart2 />, href: '/reports' },
  { name: 'Settings', icon: <Settings />, href: '/settings' },
  { name: 'Manage Users', icon: <UserPlus2 />, href: '/manage-users' },
  { name: 'Manage Groups', icon: <Group />, href: '/manage-groups' },
  { name: 'Assign Roles', icon: <Shield />, href: '/assign-roles' },
  { name: 'Assign Groups', icon: <Folder />, href: '/assign-groups' },
  { name: 'Review Reports', icon: <FileSearch />, href: '/review-reports' },
]
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 bg-black text-white flex-col p-4">
        <div className="text-2xl font-bold text-green-400 mb-8">Admin Panel</div>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-green-600 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-0 left-0 w-64 h-full bg-black text-white z-50 p-4 md:hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-green-400 text-xl font-bold">Admin Panel</span>
              <X
                className="text-white cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-green-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow md:pl-6 relative">
          <div className="flex items-center gap-4">
            <Menu
              className="md:hidden text-gray-800 cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            />
            <h1 className="text-xl font-semibold text-gray-800">Training Management</h1>
          </div>
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <Bell className="w-5 h-5 text-gray-700 hover:text-red-500 cursor-pointer" />
            <UserCircle
              className="w-7 h-7 text-gray-700 cursor-pointer"
              onClick={() => setUserDropdownOpen((prev) => !prev)}
            />

            {/* Dropdown menu */}
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-10 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false)
                      router.push('/loginpage') 
                    
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto flex-1">{children}</main>
      </div>
    </div>
  )
}
