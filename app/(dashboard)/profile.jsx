import { StyleSheet, Text, View } from 'react-native'
import { useUser } from '../../hooks/useUser'
import { useProfile } from '../../hooks/useProfile'
import { useState } from 'react'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'

const Profile = () => {
  const { logout, user } = useUser()
  const { profile, updateReadingGoal } = useProfile()
  const [goalInput, setGoalInput] = useState('')

  const handleSetGoal = () => {
    if (goalInput && !isNaN(goalInput)) {
      updateReadingGoal(parseInt(goalInput))
      setGoalInput('')
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText title={true} style={styles.heading}>
        {user.email}
      </ThemedText>
      <Spacer />

      <View style={styles.goalContainer}>
        <ThemedText style={styles.goalText}>
          Monthly Reading Goal: {profile?.readingGoal || 0} books
        </ThemedText>
        <Spacer />
        
        <ThemedTextInput
          style={styles.input}
          placeholder="Set new goal"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={goalInput}
          onChangeText={setGoalInput}
        />
        <Spacer />
        
        <ThemedButton onPress={handleSetGoal} style={styles.button}>
          <Text style={{ color: '#f2f2f2', textAlign: 'center' }}>Update Goal</Text>
        </ThemedButton>
      </View>

      <ThemedButton onPress={logout} style={styles.button}>
        <Text style={{ color: '#f2f2f2', textAlign: 'center' }}>Logout</Text>
      </ThemedButton>

      <Spacer />
      <ThemedText>Time to start reading some books...</ThemedText>
      <Spacer />

    </ThemedView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  goalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '80%',
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    minWidth: 120,
  },
})