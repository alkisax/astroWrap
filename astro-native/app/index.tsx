// astro-native\app\index.tsx
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import { UserAuthContext } from '../authLogin/context/UserAuthContext'
import { backendUrl, colors } from '../constants/constants'
import ScreenWrapper from '../components/layout/ScreenWrapper'
import { IUser } from '@/authLogin/types/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const poemText = `
Once upon a time there was a lark who was renowned for her beautiful singing. Her song was judged by all who heard her to be the sweetest sound on earth. From dawn to dusk she would sing her song and as she sang, the beginnings of a desire grew. The desire was to sing for the gods. 

She realized that if she could fly high enough the gods would be able to hear her. So the lark leapt into the air and flew as high as she could, but her wings tired and although she sang, she knew that the gods could not hear her. Determined now more than ever, she decided that she would climb the highest mountain and then fly from the peak. But even this could not get her high enough to be heard in heaven.

One day she saw an eagle soaring high in the sky, far higher then she had ever flown and she knew with unbounded certainty that if she could fly as high as the eagle, the gods would hear her beautiful song. So she watched the eagle and when he landed, she approached the huge bird. The small but brave lark explained her dilemma to the great eagle and asked if he would carry her on his back so that, together, they could entertain the gods.

Now the eagle was aware of the gods because he could fly in their domain and yet, ashamed of his raucous voice, he never had the courage to contact them. Eagerly he agreed to carry the tiny lark.

Tentatively she climbed onto his back and with a stretch and a flap of his mighty wings, he set aloft. Higher and higher they soared. The lark was almost too scared to look down and yet onward still they flew. The lark had never been this high. She could see the whole world spread out beneath her. And then, all of a sudden, they were there. The tiny lark knew that now it was her turn, the eagle having done his part. Firmly she stood up on the eagle’s back and, filling her lungs with air, began to sing. Heaven was filled with her glorious music. The gods were astonished at the power of the eagle and enthralled by the beauty of the lark’s song. The eagle was no longer ashamed and the lark was filled with joy. Together, as a team, they had brought music to the gods.

Bernadette Brady
`

export default function Index() {
  const router = useRouter()
  const { user } = useContext(UserAuthContext)

  const [showPoem, setShowPoem] = useState(false)
  // είναι άλλο ο user που μας έρχεται απο το auth (που αφορα το reusable login) και αλλο ο full user που έχει και τα αστρολογικά του. και άρα πρέπει να τον κάνουμε fetch
  const [fullUser, setFullUser] = useState<IUser | null>(null)

  // fetch full user για να δουμε αν έχει natal chart info
  useEffect(() => {
    const run = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        const userId = user?._id || user?.id
        if (!token || !userId) return

        const res = await axios.get(
          `${backendUrl}/api/sqlite/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        setFullUser(res.data.data)
      } catch (err) {
        console.log(err)
      }
    }

    run()
  }, [user])

  const hasChartData = (() => {
    try {
      if (!fullUser?.natalChart) return false

      const parsed = JSON.parse(fullUser.natalChart)

      return Boolean(
        parsed?.meta?.date &&
        parsed?.meta?.location?.lat &&
        parsed?.meta?.location?.lng
      )
    } catch {
      return false
    }
  })()

  console.log('user:', user)
  console.log('hasChartData:', hasChartData)

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔝 buttons */}
        <View style={styles.buttonRow}>
          <View>
            <Pressable
              style={[
                styles.button,
                styles.primary,
                { marginBottom: 12 }
              ]}
              onPress={() => router.push('/single')}
            >
              <Text style={styles.buttonText}>Single Chart</Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.outline,
                (!user || !hasChartData) && { opacity: 0.4 },
                { marginBottom: 12 },
              ]}
              disabled={!user || !hasChartData}
              onPress={() => router.push('/relationship')}
            >
              <Text style={styles.buttonText}>
                Relationship Analysis
              </Text>

              {(!user || !hasChartData) && (
                <Text style={{ fontSize: 12, color: colors.dim, marginTop: 4 }}>
                  {!user ? 'Please login' : 'Add birth data'}
                </Text>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.outline,
                (!user || !hasChartData) && { opacity: 0.4 },
              ]}
              disabled={!user || !hasChartData}
              onPress={() => router.push('/prediction')}
            >
              <Text style={styles.buttonText}>
                Prediction With Aspects
              </Text>

              {(!user || !hasChartData) && (
                <Text style={{ fontSize: 12, color: colors.dim, marginTop: 4 }}>
                  {!user ? 'Please login' : 'Add birth data'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* 🔽 content */}
        <View style={styles.card}>
          <View style={{ position: 'relative' }}>
            <Pressable onPress={() => setShowPoem(!showPoem)}>
              <Text style={styles.title}>
                THE FABLE OF THE EAGLE AND THE LARK
              </Text>
            </Pressable>

            <Text style={styles.arrow}>
              {showPoem ? '▲' : '▼'}
            </Text>
          </View>

          {showPoem && (
            <Text style={styles.text}>
              {poemText}
            </Text>
          )}
        </View>
        <Text
          style={{
            paddingTop: 250,
            marginTop: 24,
            fontSize: 12,
            color: colors.dim,
            textAlign: 'center',
            opacity: 0.8,
            maxWidth: 700,
          }}
        >
          Astrology calculations are most accurate for modern birth dates. Historical charts using LMT (Local Mean Time), wartime DST, or pre-standardized time zones may differ slightly between astrology systems, especially for the Ascendant, Midheaven, and house cusps.
        </Text>
        <Text
          style={{
            paddingTop: 1,
            marginTop: 24,
            fontSize: 12,
            color: colors.dim,
            textAlign: 'center',
            opacity: 0.8,
            maxWidth: 700,
          }}
        >
          This app is still in testing. You can report coding or astrological calculation bugs at alkisax@gmail.com
        </Text>
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    minWidth: 160,
    alignItems: 'center',
  },

  primary: {
    backgroundColor: colors.secondary,
  },

  outline: {
    borderWidth: 1,
    borderColor: colors.text,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
  },

  card: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
  },

  title: {
    color: colors.text,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
  },

  text: {
    color: colors.dim,
    lineHeight: 22,
    fontSize: 14,
  },

  arrow: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 16,
    color: colors.dim,
  },
})