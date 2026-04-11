import { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../constants/constants'

type UserData = {
  id: number
  username: string
  email?: string
  role: string
  natalChart?: string
}

const UserOnlyPage = () => {

  const [user, setUser] = useState<UserData | null>(null)
  console.log("userpage");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("USER PAGE RENDER");

        const token = localStorage.getItem('token')

        const res = await axios.get(
          `${backendUrl}/api/sqlite/users/1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setUser(res.data.data)
      } catch (err) {
        console.error('❌ fetch user error', err)
      }
    }

    fetchUser()
  }, [])

  if (!user) return <div style={{ color: 'white' }}>Loading...</div>

  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>👤 User Dashboard</h1>

      <p><b>ID:</b> {user.id}</p>
      <p><b>Username:</b> {user.username}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>

      <h3>📊 Natal Chart (raw)</h3>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {user.natalChart}
      </pre>
    </div>
  )
}


export default UserOnlyPage