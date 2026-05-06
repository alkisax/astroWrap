// astro-native/components/chartInfo/biwheel/CompatibilityViewer.tsx

import {
  View,
  Text,
  StyleSheet,
} from 'react-native'

import { colors } from '@/constants/constants'

type AspectItem = {
  type: string
  text: string
  score: number
}

type Compatibility = {
  scores: Record<string, number>
  explanations: Record<string, AspectItem[]>
}

type Props = {
  compatibility: Compatibility
}

const sectionTitles: Record<string, string> = {
  emotional: '💓 Emotional',
  attraction: '🔥 Attraction',
  communication: '🗣 Communication',
  stability: '🧱 Stability',
  overall: '🌍 Overall',
}

/*
  🤝 COMPATIBILITY VIEWER

  Δείχνει:
  - normalized compatibility scores
  - explanatory astro interactions

  Τα scores παράγονται από:
  - synastry aspects
  - overlays
  - weighted rules
  - orb strength
*/

const CompatibilityViewer = ({
  compatibility,
}: Props) => {

  if (!compatibility) return null

  const {
    scores,
    explanations,
  } = compatibility

  return (
    <View style={styles.card}>

      {/* 📊 scores */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          📊 Scores
        </Text>

        {Object.entries(scores).map(([key, value]) => (
          <Text
            key={key}
            style={styles.scoreText}
          >
            {sectionTitles[key] || key}: {value.toFixed(2)}
          </Text>
        ))}

      </View>

      {/* 📖 explanations */}
      {Object.entries(explanations).map(([key, items]) => (

        <View
          key={key}
          style={styles.section}
        >

          <Text style={styles.sectionTitle}>
            {sectionTitles[key] || key}
          </Text>

          {items.length === 0 ? (

            <Text style={styles.emptyText}>
              No significant interactions
            </Text>

          ) : (

            items.map((item, i) => (
              <Text
                key={i}
                style={styles.itemText}
              >
                • {item.text} ({item.score.toFixed(2)})
              </Text>
            ))

          )}

        </View>
      ))}

    </View>
  )
}

export default CompatibilityViewer

const styles = StyleSheet.create({
  card: {
    gap: 14,
  },

  section: {
    gap: 6,
  },

  sectionTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },

  scoreText: {
    color: colors.text,
    fontSize: 12,
  },

  itemText: {
    color: colors.dim,
    fontSize: 12,
    lineHeight: 18,
  },

  emptyText: {
    color: colors.dim,
    fontSize: 12,
    fontStyle: 'italic',
  },
})