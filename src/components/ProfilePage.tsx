import { useState } from 'react'
import type { FormEvent } from 'react'
import './ProfilePage.css'

const Ico = ({
  size = 16,
  children,
  className,
}: {
  size?: number
  children: React.ReactNode
  className?: string
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export default function ProfilePage() {

  const [displayName, setDisplayName] = useState('Ashraf Hossain')
  const [phone, setPhone] = useState('+880 1XXX-XXXXXX')
  const [avatarUrl, setAvatarUrl] = useState('https://example.com/avatar.jpg')
  const [currentEmail, setCurrentEmail] = useState('ashrafhossainsohan@gmail.com')

  return (
    <div className="pf-page" id="profile-page">

    </div>
  )
}