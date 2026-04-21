// components/DeleteAccountButton.tsx
import { Button } from '@mui/material'
import axios from 'axios'
import { backendUrl } from '../constants/constants'

type Props = {
  userId: number
}

const DeleteAccountButton = ({ userId }: Props) => {
  const handleDelete = async () => {
    const confirm = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.'
    )

    if (!confirm) return

    try {
      const token = localStorage.getItem('token')

      await axios.delete(`${backendUrl}/api/sqlite/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      alert('Account deleted')

      localStorage.removeItem('token')
      window.location.href = '/'
    } catch (err) {
      console.error(err)
      alert('Error deleting account')
    }
  }

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleDelete}
      sx={{ mt: 3 }}
    >
      Delete Account
    </Button>
  )
}

export default DeleteAccountButton