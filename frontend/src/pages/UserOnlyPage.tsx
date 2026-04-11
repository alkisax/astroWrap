import { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, colors } from '../constants/constants'
import ReactMarkdown from 'react-markdown'
import { Paper } from '@mantine/core'

type UserData = {
  id: number
  username: string
  email?: string
  role: string
  natalChart?: string
  natalDelineation?: string
}

const UserOnlyPage = () => {

  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {

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
    <Paper
      p='md'
      radius='md'
      style={{
        width: '100%',
        maxWidth: '1700px',
        margin: '20px auto',
        background: colors.panel,
        backdropFilter: 'blur(1px)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: colors.text
      }}
    >
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
        <h3>🧠 LLM Interpretation</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          <ReactMarkdown>
            {user.natalDelineation}
          </ReactMarkdown>

        </pre>
      </div>
    </Paper>
  )
}


export default UserOnlyPage