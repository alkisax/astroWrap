npx create-expo-app staff-tables-pda
npm start
npm run reset-project

<image /> <ScrollView /> <FlatList /> <TouchableOpacity /> <TextInput /> <Button /> <Switch /> 

έχουμε δύο αρχείο _layout και index
κανουμε import StyleSheet στο index → 
  const styles = StyleSheet = StyleSheet.create({
    container:
  })
και μετά 
<View 
  style={ styles.container }
>

npm install socket.io-client
npm i expo-av → audio
npm i jwt-decode
npx expo install @react-native-async-storage/async-storage
npm i react-native-webview
npm i react-native-paper
npm i react-native-safe-area-context


αυτές είναι οι παλιές σημειώσεις

- ετσι διωχνω το ts error στα νέα Paths
```bash
rm -rf .expo node_modules/.cache
npx expo start --tunnel --clear
```

# apk
```bash
npm i -g eas-cli
eas --version
eas login
# https://expo.dev
eas init
# αφού βάλω env
eas build --platform android --profile production
```

🤖 Android app:
https://expo.dev/artifacts/eas/t5344LW6Sm2pXd6m3bUEyw.aab

🤖 Android app:
https://expo.dev/artifacts/eas/6nVuvteXGncLQRnR5fzdya.apk

δεν θέλω .aab
αλλαξα το production στο eas.json σε
```json
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "apk"
      }
    }
```