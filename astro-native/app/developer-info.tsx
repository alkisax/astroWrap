// astro-native/app/developer-info.tsx

import {
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native'

import ScreenWrapper from '@/components/layout/ScreenWrapper'
import { globalStyles } from '@/layout/global'
import LibrariesDevInfo from '@/components/devInfoComponents/librariesDevInfo'
import PlanetTableDevInfo from '@/components/devInfoComponents/PlanetTableDevInfo'
import ChartRulerDevInfo from '@/components/devInfoComponents/ChartRulerDevInfo'
import BalanceSummaryDevInfo from '@/components/devInfoComponents/BalanceSummaryDevInfo'
import MostImportantAspectsDevInfo from '@/components/devInfoComponents/MostImportantAspectsDevInfo'
import HouseRulersDevInfo from '@/components/devInfoComponents/HouseRulersDevInfo'
import EssentialDignitiesDevInfo from '@/components/devInfoComponents/EssentialDignitiesDevInfo'
import BiwheelDevInfo from '@/components/devInfoComponents/BiwheelDevInfo'
import DispositorTreeDevInfo from '@/components/devInfoComponents/DispositorTreeDevInfo'
import HouseOverlayDevInfo from '@/components/devInfoComponents/HouseOverlayDevInfo'
import SingleChartLlmDevInfo from '@/components/devInfoComponents/SingleChartLlmDevInfo'
import BiwheelLlmDevInfo from '@/components/devInfoComponents/BiwheelLlmDevInfo'
import EagleLarkLlmDevInfo from '@/components/devInfoComponents/EagleLarkLlmDevInfo'

const DeveloperInfo = () => {
  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>

        <Text
          style={[
            globalStyles.title,
            styles.title,
          ]}
        >
          Developer Info
        </Text>

        <Text style={globalStyles.paragraph}>
          Developed on React Native / node js / sqlite by Pelopidas Kopakakis as a learning project
        </Text>
        <Text style={globalStyles.paragraph}>
          you can report bugs and suggestions at alkisax@gmail.com
        </Text>

        <Text style={globalStyles.paragraph}>
          Technical implementation details,
          architecture notes and internal tools used by Astro Lark.
        </Text>

        <LibrariesDevInfo />

        {/* <PlanetTableDevInfo /> */}

        {/* <ChartRulerDevInfo /> */}

        {/* <BalanceSummaryDevInfo /> */}

        {/* <MostImportantAspectsDevInfo /> */}

        {/* <HouseRulersDevInfo /> */}

        {/* <EssentialDignitiesDevInfo /> */}

        {/* <DispositorTreeDevInfo /> */}

        {/* <BiwheelDevInfo /> */}

        {/* <HouseOverlayDevInfo /> */}

        <SingleChartLlmDevInfo />

        <BiwheelLlmDevInfo />

        <EagleLarkLlmDevInfo />

      </ScrollView>
    </ScreenWrapper>
  )
}

export default DeveloperInfo

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
})