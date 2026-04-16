// astro-native\app\index.tsx
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { colors } from '../constants/constants'
import ScreenWrapper from '../components/layout/ScreenWrapper'

const poemText = `
Once upon a time there was a lark who was renowned for her beautiful singing. Her song was judged by all who heard her to be the sweetest sound on earth. From dawn to dusk she would sing her song and as she sang, the beginnings of a desire grew. The desire was to sing for the gods. 

She realized that if she could fly high enough the gods would be able to hear her. So the lark leapt into the air and flew as high as she could, but her wings tired and although she sang, she knew that the gods could not hear her. Determined now more than ever, she decided that she would climb the highest mountain and then fly from the peak. But even this could not get her high enough to be heard in heaven.

One day she saw an eagle soaring high in the sky, far higher then she had ever flown and she knew with unbounded certainty that if she could fly as high as the eagle, the gods would hear her beautiful song. So she watched the eagle and when he landed, she approached the huge bird. The small but brave lark explained her dilemma to the great eagle and asked if he would carry her on his back so that, together, they could entertain the gods.

Now the eagle was aware of the gods because he could fly in their domain and yet, ashamed of his raucous voice, he never had the courage to contact them. Eagerly he agreed to carry the tiny lark.

Tentatively she climbed onto his back and with a stretch and a flap of his mighty wings, he set aloft. Higher and higher they soared. The lark was almost too scared to look down and yet onward still they flew. The lark had never been this high. She could see the whole world spread out beneath her. And then, all of a sudden, they were there. The tiny lark knew that now it was her turn, the eagle having done his part. Firmly she stood up on the eagle’s back and, filling her lungs with air, began to sing. Heaven was filled with her glorious music. The gods were astonished at the power of the eagle and enthralled by the beauty of the lark’s song. The eagle was no longer ashamed and the lark was filled with joy. Together, as a team, they had brought music to the gods.
`

export default function Index() {
  const router = useRouter()

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>

        {/* <Pressable
          onPress={() => router.push('/login')}
        >
          <Text>Go to Login</Text>
        </Pressable> */}

        {/* 🔝 buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.primary]}
            onPress={() => router.push('/single')}
          >
            <Text style={styles.buttonText}>Single Chart</Text>
          </Pressable>

          {/* <Pressable
            style={[styles.button, styles.outline]}
            onPress={() => router.push('/biwheel')}
          >
            <Text style={styles.buttonText}>Relationship Analysis</Text>
          </Pressable> */}
        </View>

        {/* 🔽 content */}
        <View style={styles.card}>
          <Text style={styles.title}>
            THE FABLE OF THE EAGLE AND THE LARK
          </Text>

          <Text style={styles.text}>
            {poemText}
          </Text>
        </View>
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
})