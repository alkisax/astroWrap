// astro-native\app\login.tsx

import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import { useState, useContext, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { UserAuthContext } from '../authLogin/context/UserAuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { backendUrl, colors } from '../constants/constants'
import ScreenWrapper from '../components/layout/ScreenWrapper'
import GlassPanel from '@/components/ui/GlassPanel'
import { Ionicons } from '@expo/vector-icons'

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
        const { token, user } = res.data.data

        console.log('TOKEN:', token)

        // save token (RN)
        await AsyncStorage.setItem('token', token)

        // trigger context refresh (temporary hack)
        setUser(user)

        console.log('LOGIN OK')

        // redirect μετά login
        setUser(user)

        setTimeout(() => {
          router.replace('/user')
        }, 100)
      }
    } catch (err: unknown) {
      console.log('LOGIN ERROR', err)

      if (err instanceof Error) {
        // axios error check
        if ('response' in err) {
          const axiosErr = err as {
            response?: { status?: number }
          }

          const status = axiosErr.response?.status

          if (status === 401 || status === 400) {
            Alert.alert('Error', 'Wrong username or password')
            return
          }
        }
      }

      Alert.alert('Error', 'Login failed')
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
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              placeholderTextColor='rgba(255,255,255,0.5)'
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: [{ translateY: -10 }],
              }}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.secondary}
              />
            </Pressable>
          </View>

          {/* login button */}
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          {/* register link */}
          <Pressable onPress={() => router.push('/register')}>
            <Text style={styles.link}>
              Don’t have an account? Register
            </Text>
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
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },

  passwordInput: {
    flex: 1,
    padding: 12,
    color: colors.text,
    backgroundColor: 'transparent',
    borderWidth: 0,
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

  link: {
    marginTop: 12,
    textAlign: 'center',
    color: colors.secondary,
    fontWeight: '600',
  }
})