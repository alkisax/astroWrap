// astro-native\app\login.tsx

import { View, Text, TextInput, Button } from 'react-native'
import { useState, useContext } from 'react'
import { UserAuthContext } from '../authLogin/context/UserAuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { backendUrl } from '../constants/constants'

const Login = () => {
  const { setUser } = useContext(UserAuthContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/sqlite/auth/login`,
        { username, password }
      )

      if (res.data.status) {
        const token = res.data.data.token
        console.log('TOKEN:', token)

        // 🔥 save token (RN)
        await AsyncStorage.setItem('token', token)

        // 🔥 trigger context update
        // easiest: reload user
        setUser(null) // προσωρινό reset

        console.log('LOGIN OK')
      }
    } catch (err) {
      console.log('LOGIN ERROR', err)
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        placeholder='Username'
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />

      <Button title='Login' onPress={handleLogin} />
    </View>
  )
}

export default Login