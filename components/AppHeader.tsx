'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Bot, Dumbbell, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/nutrition', label: 'Nutrition' },
  { href: '/progress', label: 'Progress' },
  { href: '/profile', label: 'Profile' },
]

export function AppHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FitSync</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors',
                  pathname === item.href ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/chat"
              className={cn(
                'transition-colors flex items-center space-x-1',
                pathname === '/chat' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Bot className="h-4 w-4" />
              <span>AI Coach</span>
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{session?.user?.name || session?.user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
        <nav className="md:hidden flex items-center gap-4 mt-4 overflow-x-auto text-sm">
          {[...NAV_ITEMS, { href: '/chat', label: 'AI Coach' }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn('whitespace-nowrap', pathname === item.href ? 'text-gray-900 font-medium' : 'text-gray-600')}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
