// astro-native\components\ui\GlassPanel.tsx

import { View, StyleSheet } from 'react-native'
import { colors } from '../../constants/constants'

const GlassPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.panel}>
      {children}
    </View>
  )
}

export default GlassPanel

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    padding: 16,
    borderRadius: 16,

    backgroundColor: colors.panel, // 👈 από constants
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',

    // subtle depth
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
})