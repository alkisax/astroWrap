// frontend\src\components\controls\userOrbPicker.tsx
// απο εδω ξεκινάει το userOrb που καταλήγει στο getAngleAspects.ts. Το state του είναι στο useHome
import { Paper } from '@mantine/core'
import { colors } from '../../constants/constants'

type Props = {
  userOrb: number
  setUserOrb: (v: number) => void
}

const UserOrbPicker = ({ userOrb, setUserOrb }: Props) => {
  return (
    <Paper
      p='sm'
      radius='md'
      style={{
        width: 235,
        margin: '5px auto',
        background: colors.panel,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: colors.text,
      }}
    >
      <div
        style={{
          marginBottom: 6,
          fontSize: 12,
          textAlign: 'center',
          color: colors.dim,
        }}
      >
        orb
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        {[0.1, 0.2, 0.8, 1, 1.5, 2].map(v => (
          <button
            key={v}
            onClick={() => setUserOrb(v)}
            style={{
              width: '30%', // 3 κουμπιά ανά γραμμή → αποφεύγουμε overflow
              background: userOrb === v ? colors.primary : 'transparent',
              color: colors.text,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 4,
              padding: '6px 4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {v * 100}%
          </button>
        ))}
      </div>
    </Paper>
  )
}

export default UserOrbPicker