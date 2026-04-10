import axios from 'axios'
import { useState } from 'react'
import { interpretationUrl } from '../../constants/constants'

type Props = {
  shaken: unknown
}

const TestInputNatalChart = ({ shaken }: Props) => {
  const [result, setResult] = useState(null)

  const handleSave = async () => {
    try {
      // 1️⃣ save
      await axios.put(`${interpretationUrl}/api/sqlite/users/1`, {
        natalChart: JSON.stringify(shaken),
      })

      // 2️⃣ fetch updated user
      const res = await axios.get(
        `${interpretationUrl}/api/sqlite/users/1`
      )

      // 3️⃣ parse nested JSON
      const data = res.data

      if (data?.data?.natalChart) {
        data.data.natalChart = JSON.parse(data.data.natalChart)
      }

      setResult(data)

      console.log('✅ saved + fetched')
    } catch (err) {
      console.error('❌ error', err)
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <button
        onClick={handleSave}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        save natal chart (test)
      </button>

      {/* 👇 pretty JSON render */}
      {result && (
        <pre
          style={{
            textAlign: 'left',
            marginTop: '20px',
            background: '#111',
            color: '#0f0',
            padding: '12px',
            borderRadius: '8px',
            overflowX: 'auto',
            fontSize: '12px',
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default TestInputNatalChart