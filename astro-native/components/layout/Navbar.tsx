import { View, Text, Pressable, StyleSheet, Modal } from 'react-native'
import { useState, useContext } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { UserAuthContext } from '../../authLogin/context/UserAuthContext'
import { handleLogout } from '../../authLogin/authFunctions'

const Navbar = () => {
  const { user, setUser } = useContext(UserAuthContext)
  const router = useRouter()

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <View style={styles.navbar}>
        {/* LOGO */}
        <Pressable onPress={() => router.push('/')}>
          <Text style={styles.logo}>Astro App</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        {/* USER */}
        <View style={styles.actions}>
          {user ? (
            <>
              <Pressable
                style={styles.iconBtn}
                onPress={() => router.push('/user')}
              >
                <Ionicons name="person-circle-outline" size={28} />
              </Pressable>

              <Pressable
                style={styles.iconBtn}
                onPress={() => {
                  handleLogout(setUser)
                  router.replace('/login')
                }}
              >
                <Ionicons name="log-out-outline" size={26} />
              </Pressable>
            </>
          ) : (
            <Pressable
              style={styles.iconBtn}
              onPress={() => router.push('/login')}
            >
              <Ionicons name="log-in-outline" size={26} />
            </Pressable>
          )}
        </View>
      </View>
    </>
  )
}

export default Navbar

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fffdf7',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e0d8',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
  },
  menu: {
    backgroundColor: 'white',
    padding: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // 👈 spacing
  },

  iconBtn: {
    padding: 6, // 👈 bigger touch area
  },
})