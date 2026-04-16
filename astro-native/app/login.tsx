// astro-native\app\login.tsx

import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { useState, useContext, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { UserAuthContext } from '../authLogin/context/UserAuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { backendUrl, colors } from '../constants/constants'
import ScreenWrapper from '../components/layout/ScreenWrapper'
import GlassPanel from '@/components/ui/GlassPanel'

const Login = () => {
  const { user, setUser } = useContext(UserAuthContext)
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // reveal password toggle
  const [showPassword, setShowPassword] = useState(false)

  // αν είναι ήδη logged in → redirect
  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [router, user])

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/sqlite/auth`,
        { username, password }
      )

      if (res.data.status) {
        const token = res.data.data.token

        console.log('TOKEN:', token)

        // 🔥 save token (RN)
        await AsyncStorage.setItem('token', token)

        // 🔥 trigger context refresh (temporary hack)
        setUser(null)

        console.log('LOGIN OK')

        // 🔥 redirect μετά login
        router.replace('/')
      }
    } catch (err) {
      console.log('LOGIN ERROR', err)
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <GlassPanel>
          <Text style={styles.title}>Login</Text>

          {/* username */}
          <TextInput
            placeholder='Username'
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />

          {/* password + reveal */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />

            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.toggle}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </Pressable>
          </View>

          {/* login button */}
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </GlassPanel>

      </View>
    </ScreenWrapper>

  )
}

export default Login

// 🔥 styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    // backgroundColor: '#f5f5f5',
  },

  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
  },

  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: colors.text,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  passwordInput: {
    flex: 1,
    padding: 12,
    color: colors.text,
  },

  toggle: {
    color: colors.secondary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.secondary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
})