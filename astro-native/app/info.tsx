// astro-native/app/info.tsx

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import ScreenWrapper from '@/components/layout/ScreenWrapper'
import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'
import { router } from 'expo-router'

const Info = () => {
  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>

        <Text
          style={[
            globalStyles.title,
            styles.title,
          ]}
        >
          Astro Lark
        </Text>

        <Text style={globalStyles.paragraph}>
          Astro Lark is an astrology application focused on
          natal chart analysis, relationship analysis,
          prediction techniques and LLM-assisted interpretation.
        </Text>

        {/* account */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.sectionTitle}>
            👤 Account
          </Text>

          <Text style={globalStyles.paragraph}>
            You can login or register from the account icon in the navbar.
          </Text>

          <Text style={globalStyles.paragraph}>
            Inside your account page you can quickly access:
          </Text>

          <Text style={globalStyles.bullet}>
            • your saved natal chart
          </Text>

          <Text style={globalStyles.bullet}>
            • your astrological calculations
          </Text>

          <Text style={globalStyles.bullet}>
            • your latest LLM interpretation
          </Text>

          <Text style={globalStyles.paragraph}>
            These features exist both for quick access and to avoid unnecessary
            repeated LLM calls and rewarded ads.
          </Text>

          <Text style={globalStyles.paragraph}>
            To save a chart and interpretation,
            use the save button located at the end of the
            Single Chart LLM interpretation section.
          </Text>
        </View>

        {/* single chart */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.sectionTitle}>
            ☀️ Single Chart
          </Text>

          <Text style={globalStyles.paragraph}>
            In Single Chart you can generate a natal chart
            using date, time and coordinates.
          </Text>

          <Text style={globalStyles.paragraph}>
            Date input format:
          </Text>

          <Text style={styles.code}>
            yyyy-mm-dd hh:mm
          </Text>

          <Text style={globalStyles.paragraph}>
            Default coordinates are set to Athens.
          </Text>

          <Text style={globalStyles.paragraph}>
            If you do not know your coordinates,
            a helper link exists below the form.
          </Text>
        </View>

        {/* controls */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.sectionTitle}>
            🎛 Controls
          </Text>

          <Text style={globalStyles.bullet}>
            • Increase/decrease hour, day, month and year
          </Text>

          <Text style={globalStyles.bullet}>
            • Hide or show planets in the chart
          </Text>

          <Text style={globalStyles.bullet}>
            • Adjust aspect orb sensitivity
          </Text>

          <Text style={globalStyles.paragraph}>
            These controls affect both chart rendering
            and aspect calculations.
          </Text>
        </View>

        {/* chart info */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.sectionTitle}>
            🦅 Astrological Information
          </Text>

          <Text style={globalStyles.subTitle}>
            Planet / House / Sign Table
          </Text>

          <Text style={globalStyles.paragraph}>
            Shows planetary placements by zodiac sign and house.
          </Text>

          <Text style={globalStyles.paragraph}>
            Calculated from astronomical planetary positions
            and the selected house system.
          </Text>

          <Text style={globalStyles.subTitle}>
            Chart Ruler
          </Text>

          <Text style={globalStyles.paragraph}>
            The ruling planet of the Ascendant sign.
          </Text>

          <Text style={globalStyles.paragraph}>
            Calculated from the Ascendant zodiac sign ruler.
          </Text>

          <Text style={globalStyles.subTitle}>
            Main Aspects
          </Text>

          <Text style={globalStyles.paragraph}>
            Important angular relationships between planets.
          </Text>

          <Text style={globalStyles.paragraph}>
            Calculated by angular distance and orb tolerance.
          </Text>

          <Text style={globalStyles.subTitle}>
            House Rulers
          </Text>

          <Text style={globalStyles.paragraph}>
            Shows which planets rule each astrological house.
          </Text>

          <Text style={globalStyles.paragraph}>
            Calculated from house cusp zodiac signs and planetary rulerships.
          </Text>

          <Text style={globalStyles.subTitle}>
            Essential Dignities
          </Text>

          <Text style={globalStyles.paragraph}>
            Shows planetary strength based on sign placement.
          </Text>

          <Text style={globalStyles.paragraph}>
            Calculated using domicile, exaltation,
            detriment and fall systems.
          </Text>

          <Text style={globalStyles.subTitle}>
            Dispositor Tree
          </Text>

          <Text style={globalStyles.paragraph}>
            Displays chains of planetary rulerships.
          </Text>

          <Text style={globalStyles.paragraph}>
            Calculated by following sign rulers
            from one planet to another.
          </Text>
        </View>

        {/* relationship */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.sectionTitle}>
            💞 Relationship Analysis
          </Text>

          <Text style={globalStyles.paragraph}>
            Relationship Analysis compares two charts using
            synastry aspects, overlays and compatibility calculations.
          </Text>

          <Text style={globalStyles.paragraph}>
            LLM interpretation is generated after a rewarded ad.
          </Text>
        </View>

        {/* prediction */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.sectionTitle}>
            🔮 Prediction With Aspects
          </Text>

          <Text style={globalStyles.paragraph}>
            Prediction mode uses transit-to-natal aspects
            inspired by the Eagle & Lark approach
            and Bernadette Brady methods.
          </Text>

          <Text style={globalStyles.paragraph}>
            You can ask focused questions about topics such as:
          </Text>

          <Text style={globalStyles.bullet}>
            • career
          </Text>

          <Text style={globalStyles.bullet}>
            • relationships
          </Text>

          <Text style={globalStyles.bullet}>
            • emotional state
          </Text>

          <Text style={globalStyles.bullet}>
            • life changes
          </Text>
        </View>

        {/* disclaimer */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.sectionTitle}>
            ⚠ Disclaimer
          </Text>

          <Text style={globalStyles.paragraph}>
            This application is intended for educational,
            experimental and entertainment purposes.
          </Text>

          <Text style={globalStyles.paragraph}>
            LLM interpretations may contain inaccuracies.
          </Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={globalStyles.sectionTitle}>
            👨‍💻 Developer
          </Text>

          <Text style={globalStyles.paragraph}>
            More information about the developer,
            project background and portfolio links.
          </Text>

          <Pressable
            style={globalStyles.button}
            onPress={() => router.push('/developer-info')}
          >
            <Text style={globalStyles.buttonText}>
              Developer Info
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}

export default Info

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },

  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },

  code: {
    color: colors.text,
    fontSize: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
})