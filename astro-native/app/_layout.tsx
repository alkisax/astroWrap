import Navbar from '@/components/layout/Navbar'
import { Stack } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { UserProvider } from '../authLogin/context/UserAuthContext'

const Layout = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <UserProvider>
          <View
            style={{
              flex: 1,
              backgroundColor: 'black',
            }}
          >
            <Navbar />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: 'transparent',
                  paddingTop: 0
                },
              }}
            />
          </View>
        </UserProvider>
      </SafeAreaView>

    </SafeAreaProvider>
  )
}

export default Layout