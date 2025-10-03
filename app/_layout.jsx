import { Stack } from "expo-router"
import { Colors } from "../constants/Colors"
import { useColorScheme } from "react-native"
import { StatusBar } from "expo-status-bar"
import { UserProvider } from "../contexts/UserContext"
import { BooksProvider } from "../contexts/BooksContext"
import { ProfileProvider } from "../contexts/ProfileContext"

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <UserProvider>
      <ProfileProvider>
        <BooksProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: theme.navBackground },
              headerTintColor: theme.title,
            }}
          />
        </BooksProvider>
      </ProfileProvider>
    </UserProvider>
  )
}
