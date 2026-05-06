// utils/logToServer.ts
import axios from 'axios'
import { backendUrl } from '@/constants/constants'

export const logToServer = async (data: unknown) => {
  try {
    await axios.post(`${backendUrl}/api/log-from-front`, {
      data,
    })
  } catch (err) {
    console.log('logToServer failed:', err)
  }
}