import AuthImagePattern from '@/components/ui/AuthImagePattern'
import { useAuthStore } from '@/store/useAuthStore'
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

type RegisterPageProps = {}

const RegisterPage: React.FC<RegisterPageProps> = ({}) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: {
      firstName: '',
      lastName: '',
    },
  })
  const { register, isRegistering } = useAuthStore()
  const validateForm = () => {
    if (!formData.name.firstName.trim())
      return toast.error('First name is required')
    if (!formData.name.lastName.trim())
      return toast.error('Last name is required')
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error('Email is required')
    if (formData.password.length < 6) return toast.error('Password is required')
    return true
  }
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const success = validateForm()
    if (success) {
      register(formData)
    }
  }

  return (
    <div className="RegisterPage min-h-screen grid lg:grid-cols-2">
      {/* Left side */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare
                  size={48}
                  className="text-primary"
                />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create your account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>
          <form
            onSubmit={handleRegister}
            className="space-y-6"
          >
            <div className="form-control">
              <label
                htmlFor="firstName"
                className="label"
              >
                <span className="label-text font-medium">First Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John"
                  required
                  value={formData.name.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: {
                        ...formData.name,
                        firstName: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label
                htmlFor="lastName"
                className="label"
              >
                <span className="label-text font-medium">Last Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John"
                  required
                  value={formData.name.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: {
                        ...formData.name,
                        lastName: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label
                htmlFor="email"
                className="label"
              >
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="example@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label
                htmlFor="password"
                className="label"
              >
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input input-bordered w-full pl-10 ${
                    showPassword
                      ? 'text-base-content/60'
                      : 'text-base-content/40'
                  }`}
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{' '}
              <Link
                to="/login"
                className="link link-primary"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends"
      />
    </div>
  )
}

export default RegisterPage
