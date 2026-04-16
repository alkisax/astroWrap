import { Stack } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const Layout = () => {
  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </View>
    </SafeAreaProvider>

  )
}

export default Layout