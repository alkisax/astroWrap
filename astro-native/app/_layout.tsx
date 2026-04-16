import { Stack } from 'expo-router'
import { View } from 'react-native'

const Layout = () => {
  return (
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
  )
}

export default Layout