// astro-native\app\register.tsx
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { backendUrl, colors } from '../constants/constants'
import ScreenWrapper from '../components/layout/ScreenWrapper'
import GlassPanel from '@/components/ui/GlassPanel'

import {
  frontendValidatePassword,
  frontEndValidateEmail,
} from '../authLogin/utils/registerBackend'

const Register = () => {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async () => {
    setError(null)

    // 🔥 validation (reuse 100%)
    const passError = frontendValidatePassword(password)
    if (passError) return setError(passError)

    const emailError = frontEndValidateEmail(email)
    if (emailError) return setError(emailError)

    if (!username || !name || !email || !password || !confirmPassword) {
      return setError('Please fill in all fields')
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    try {
      setLoading(true)

      const res = await axios.post(`${backendUrl}/api/sqlite/users`, {
        username,
        name,
        email,
        password,
      })

      if (res.data.status) {
        Alert.alert('Success 🚀', 'Account created successfully')

        // 👉 redirect to login
        router.replace('/login')
      } else {
        setError(
          res.data.error || res.data.data || 'Registration failed'
        )
      }
    } catch (err: any) {
      const backendMsg =
        err?.response?.data?.error || err?.response?.data?.message

      if (backendMsg) {
        setError(Array.isArray(backendMsg) ? backendMsg.join(', ') : backendMsg)
      } else {
        setError('Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <GlassPanel>
              <Text style={styles.title}>Register</Text>

              <TextInput
                placeholder='Username'
                value={username}
                onChangeText={setUsername}
                style={styles.input}
              />

              <TextInput
                placeholder='Full Name'
                value={name}
                onChangeText={setName}
                style={styles.input}
              />

              <TextInput
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize='none'
              />

              <TextInput
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />

              <TextInput
                placeholder='Confirm Password'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />

              {error && (
                <Text style={styles.error}>{error}</Text>
              )}

              <Pressable style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>
                  {loading ? 'Loading...' : 'Register'}
                </Text>
              </Pressable>

              <Pressable onPress={() => router.replace('/login')}>
                <Text style={styles.link}>
                  Already have an account? Login
                </Text>
              </Pressable>
            </GlassPanel>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.container}>
      </View>
    </ScreenWrapper>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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

  button: {
    backgroundColor: colors.secondary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },

  link: {
    marginTop: 12,
    textAlign: 'center',
    color: colors.secondary,
    fontWeight: '600',
  },
})