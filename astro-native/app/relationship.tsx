import { View, Text } from 'react-native'
import ScreenWrapper from '../components/layout/ScreenWrapper'
import { globalStyles } from '../layout/global'

const NAVBAR_HEIGHT = 60

const Relationship = () => {
  console.log('RELATIONSHIP SCREEN LOADED')
  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        
        {/* 🔥 spacer για navbar */}
        <View style={{ height: NAVBAR_HEIGHT }} />

        {/* content */}
        <View
          style={{
            padding: 16,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 12,
            margin: 16,
          }}
        >
          <Text style={globalStyles.title}>
            Relationship Analysis
          </Text>

          <Text style={{ color: 'red', fontSize: 30 }}>
            TEST
          </Text>
        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Relationship