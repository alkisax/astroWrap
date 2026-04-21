import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { backendUrl, colors } from '../constants/constants'
import { UserAuthContext } from '../authLogin/context/UserAuthContext'
import ReactMarkdown from 'react-markdown'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Paper,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteAccountButton from '../components/DeleteAccountButton'

type UserData = {
  id: number
  username: string
  email?: string
  role: string
  natalChart?: string
  natalDelineation?: string
}

// 🔹 typed chart (basic, όχι full strict για να μην μπλέξεις τώρα)
type Chart = {
  meta: {
    date: string
    location: { lat: number; lng: number }
    zodiac: string
    houseSystem: string
  }
  planets: { planet: string; sign: string; house: number }[]
  houses: { house: number; sign: string; longitude: number }[]
  chartRuler: { planet: string; sign: string; house: number }
  balance: {
    elements: Record<string, number>
    modalities: Record<string, number>
  }
  aspects: {
    point1: string
    point2: string
    type: string
    orb: number
  }[]
}

const UserOnlyPage = () => {
  const [user, setUser] = useState<UserData | null>(null)
  const { user: authUser } = useContext(UserAuthContext)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const userId = authUser?.id || authUser?._id

        const res = await axios.get(
          `${backendUrl}/api/sqlite/users/${userId}`,
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
  }, [authUser?._id, authUser?.id])

  if (!user) return <div style={{ color: 'white' }}>Loading...</div>

  // 🔹 safe parse
  let chart: Chart | null = null
  try {
    chart = user.natalChart ? (JSON.parse(user.natalChart) as Chart) : null
  } catch {
    console.error('Invalid natalChart JSON')
  }

  return (

    <>
      <Paper
        sx={{
          width: '100%',
          maxWidth: '1200px',
          margin: '20px auto',
          p: 3,
          borderRadius: 3,
          background: colors.panel,
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: colors.text,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          👤 User Dashboard
        </Typography>

        {/* USER INFO */}
        <Box sx={{ mb: 4 }}>
          <Typography>ID: {user.id}</Typography>
          <Typography>Username: {user.username}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Role: {user.role}</Typography>
        </Box>

        {/* CHART */}
        {chart && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            color: colors.secondary,
          }}>
            {/* META */}
            <Paper sx={{ p: 2, background: 'rgba(255,255,255,0.05)', color: colors.text, }}>
              <Typography variant="h6">📅 Meta</Typography>
              <Typography>
                Date: {new Date(chart.meta.date).toLocaleString()}
              </Typography>
              <Typography>
                Location: {chart.meta.location.lat},{' '}
                {chart.meta.location.lng}
              </Typography>
              <Typography>Zodiac: {chart.meta.zodiac}</Typography>
              <Typography>System: {chart.meta.houseSystem}</Typography>
            </Paper>

            {/* PLANETS */}
            <Paper sx={{ p: 2, background: 'rgba(255,255,255,0.05)', color: colors.text, }}>
              <Typography variant="h6">🪐 Planets</Typography>
              {chart.planets.map((p) => (
                <Typography key={p.planet}>
                  {p.planet} - {p.sign} (House {p.house})
                </Typography>
              ))}
            </Paper>

            {/* HOUSES */}
            <Paper sx={{ p: 2, background: 'rgba(255,255,255,0.05)', color: colors.text, }}>
              <Typography variant="h6">🏠 Houses</Typography>
              {chart.houses.map((h) => (
                <Typography key={h.house}>
                  House {h.house} - {h.sign}
                </Typography>
              ))}
            </Paper>

            {/* CHART RULER */}
            <Paper sx={{ p: 2, background: 'rgba(255,255,255,0.05)', color: colors.text, }}>
              <Typography variant="h6">👑 Chart Ruler</Typography>
              <Typography>
                {chart.chartRuler.planet} - {chart.chartRuler.sign} (House{' '}
                {chart.chartRuler.house})
              </Typography>
            </Paper>

            {/* BALANCE */}
            <Paper sx={{ p: 2, background: 'rgba(255,255,255,0.05)', color: colors.text, }}>
              <Typography variant="h6">⚖️ Balance</Typography>

              <Typography sx={{ mt: 1 }}>Elements:</Typography>
              {Object.entries(chart.balance.elements).map(([k, v]) => (
                <Typography key={k}>
                  {k}: {v}
                </Typography>
              ))}

              <Typography sx={{ mt: 1 }}>Modalities:</Typography>
              {Object.entries(chart.balance.modalities).map(([k, v]) => (
                <Typography key={k}>
                  {k}: {v}
                </Typography>
              ))}
            </Paper>

            {/* ASPECTS */}
            <Paper sx={{ p: 2, background: 'rgba(255,255,255,0.05)', color: colors.text, }}>
              <Typography variant="h6">🔗 Aspects</Typography>
              {chart.aspects.map((a, i) => (
                <Typography key={i}>
                  {a.point1} - {a.point2} ({a.type}, orb{' '}
                  {a.orb.toFixed(2)})
                </Typography>
              ))}
            </Paper>
          </Box>
        )}

        {/* LLM */}
        <Accordion
          sx={{
            mt: 4,
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          >
            <Typography>🧠 LLM Interpretation</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <ReactMarkdown>{user.natalDelineation || ''}</ReactMarkdown>
          </AccordionDetails>
        </Accordion>
      </Paper>
      <DeleteAccountButton userId={user.id} />
    </>
  )
}

export default UserOnlyPage