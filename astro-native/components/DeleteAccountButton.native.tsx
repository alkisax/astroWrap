// astro-native\components\DeleteAccountButton.native.tsx

import { Pressable, Text, Alert, Platform } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { backendUrl } from '../constants/constants'
import { handleLogout } from '@/authLogin/authFunctions'
import { useContext } from 'react'
import { UserAuthContext } from '@/authLogin/context/UserAuthContext'
import { router } from 'expo-router'

type Props = {
  userId: number
}

const DeleteAccountButton = ({ userId }: Props) => {

  const { setUser } = useContext(UserAuthContext)

  const handleDelete = () => {
    console.log("PRESS TEST")

    if (Platform.OS === 'web') {
      const confirm = window.confirm(
        'Are you sure you want to delete your account?'
      )

      if (!confirm) return

      executeDelete()
    } else {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: executeDelete,
          },
        ]
      )
    }
  }

  const executeDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('token')

      await axios.delete(
        `${backendUrl}/api/sqlite/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      Alert.alert('Account deleted')

      // 🔥 σωστό logout
      await handleLogout(setUser)

      console.log('User deleted → logged out')

      router.replace('/login')

    } catch (err) {
      console.log(err)
      Alert.alert('Error deleting account')
    }
  }

  return (
    <Pressable
      onPress={handleDelete}
      style={{
        marginTop: 20,
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: 'white', fontWeight: '600' }}>
        Delete Account
      </Text>
    </Pressable>
  )
}

export default DeleteAccountButton