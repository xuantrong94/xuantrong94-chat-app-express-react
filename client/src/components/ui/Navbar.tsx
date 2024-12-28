import { useAuthStore } from '@/store/useAuthStore'
import { LogOut, MessageSquare, Settings, User } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

type NavbarProps = {}

const Navbar: React.FC<NavbarProps> = () => {
  const { logout, authUser } = useAuthStore()
  return (
    <header className="Navbar bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover-opacity-80 transition-all"
            >
              <span className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-5 text-primary" />
              </span>
              <h6 className="text-lg font-bold">ChatApp</h6>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className={`btn btn-sm transition-colors`}
            >
              <Settings className="size-4" />
              <span className="hidden md:inline-block">Settings</span>
            </Link>
            {true ? (
              <>
                <Link
                  to="/profile"
                  onClick={logout}
                  className="btn btn-sm gap-2"
                >
                  <User className="size-5" />
                  <span className="hidden md:inline-block">Profile</span>
                </Link>
                <button
                  className="flex gap-2 items-center"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden md:inline-block">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-sm transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
