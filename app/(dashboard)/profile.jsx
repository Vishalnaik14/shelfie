import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, ScrollView, Modal, FlatList, Alert } from 'react-native'
import { useUser } from '../../hooks/useUser'
import { useProfile } from '../../hooks/useProfile'
import { useBooks } from '../../hooks/useBooks'
import { useState, useEffect } from 'react'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedCard from '../../components/ThemedCard'

const Profile = () => {
  const { logout, user } = useUser()
  const { profile, updateReadingGoal, addReadingReminder, deleteReadingReminder, getReadingReminders } = useProfile()
  const { books } = useBooks()
  const [goalInput, setGoalInput] = useState('')
  
  // Reading reminder states
  const [showBookSelector, setShowBookSelector] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [reminderTime, setReminderTime] = useState('')
  const [reminders, setReminders] = useState([])

  useEffect(() => {
    if (profile) {
      const profileReminders = getReadingReminders()
      setReminders(profileReminders)
    }
  }, [profile])

  const handleSetGoal = () => {
    if (goalInput && !isNaN(goalInput)) {
      updateReadingGoal(parseInt(goalInput))
      setGoalInput('')
      Keyboard.dismiss()
    }
  }

  const handleSelectBook = (book) => {
    setSelectedBook(book)
    setShowBookSelector(false)
  }

  const handleSetReminder = async () => {
    if (!selectedBook) {
      Alert.alert('Error', 'Please select a book first')
      return
    }

    if (!reminderTime) {
      Alert.alert('Error', 'Please enter a reminder time')
      return
    }

    // Validate time format (HH:MM AM/PM)
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/
    if (!timeRegex.test(reminderTime)) {
      Alert.alert('Error', 'Please enter time in 12-hour format (e.g., 09:30 AM or 08:00 PM)')
      return
    }

    try {
      const newReminder = {
        id: Date.now().toString(),
        bookId: selectedBook.$id,
        bookTitle: selectedBook.title,
        bookAuthor: selectedBook.author,
        time: reminderTime.toUpperCase(),
        createdAt: new Date().toISOString()
      }

      await addReadingReminder(newReminder)
      
      setSelectedBook(null)
      setReminderTime('')
      Alert.alert('Success', 'Reading reminder set successfully!')
    } catch (error) {
      console.error('Error setting reminder:', error)
      Alert.alert('Error', 'Failed to set reminder. Please try again.')
    }
  }

  const handleDeleteReminder = async (reminder) => {
    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete the reminder for "${reminder.bookTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReadingReminder(reminder.id)
              Alert.alert('Success', 'Reminder deleted successfully!')
            } catch (error) {
              console.error('Error deleting reminder:', error)
              Alert.alert('Error', 'Failed to delete reminder')
            }
          }
        }
      ]
    )
  }

  const BookSelectorModal = () => (
    <Modal
      visible={showBookSelector}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowBookSelector(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>Select a Book</ThemedText>
          
          <FlatList
            data={books}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => handleSelectBook(item)}>
                <View style={styles.bookItem}>
                  <ThemedText style={styles.bookTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.bookAuthor}>by {item.author}</ThemedText>
                </View>
              </TouchableWithoutFeedback>
            )}
            ListEmptyComponent={
              <ThemedText style={styles.emptyText}>
                No books available. Add books to your library first!
              </ThemedText>
            }
          />
          
          <ThemedButton 
            onPress={() => setShowBookSelector(false)}
            style={styles.cancelButton}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </ThemedButton>
        </View>
      </View>
    </Modal>
  )

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <ThemedText title={true} style={styles.heading}>
              {user.email}
            </ThemedText>
            <Spacer />

            {/* Monthly Reading Goal Section */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                📖 Monthly Reading Goal
              </ThemedText>
              <ThemedText style={styles.goalText}>
                Current Goal: {profile?.readingGoal || 0} books
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
                <Text style={styles.buttonText}>Update Goal</Text>
              </ThemedButton>
            </View>

            <View style={styles.divider} />

            {/* Daily Reading Reminders Section */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                ⏰ Daily Reading Reminders
              </ThemedText>
              <Spacer />
              
              {/* Book Selection */}
              <ThemedText style={styles.label}>Select Book:</ThemedText>
              <ThemedButton 
                onPress={() => setShowBookSelector(true)}
                style={styles.selectButton}
              >
                <Text style={styles.buttonText}>
                  {selectedBook ? selectedBook.title : 'Choose a book'}
                </Text>
              </ThemedButton>
              
              <Spacer />
              
              {/* Time Input */}
              <ThemedText style={styles.label}>Reminder Time (12-hour format):</ThemedText>
              <ThemedTextInput
                style={styles.input}
                placeholder="e.g., 09:30 AM or 08:00 PM"
                placeholderTextColor="#999"
                value={reminderTime}
                onChangeText={setReminderTime}
                autoCapitalize="characters"
              />
              
              <Spacer />
              
              <ThemedButton 
                onPress={handleSetReminder}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Set Reminder</Text>
              </ThemedButton>
              
              <Spacer height={20} />
              
              {/* Active Reminders List */}
              <ThemedText style={styles.subsectionTitle}>Active Reminders:</ThemedText>
              <Spacer />
              
              {reminders.length > 0 ? (
                <View style={styles.remindersList}>
                  {reminders.map((reminder) => (
                    <View key={reminder.id} style={styles.reminderItem}>
                      <View style={styles.reminderInfo}>
                        <ThemedText style={styles.reminderBook}>
                          📚 {reminder.bookTitle}
                        </ThemedText>
                        <ThemedText style={styles.reminderAuthor}>
                          by {reminder.bookAuthor}
                        </ThemedText>
                        <ThemedText style={styles.reminderTime}>
                          🕐 {reminder.time}
                        </ThemedText>
                      </View>
                      <ThemedButton 
                        onPress={() => handleDeleteReminder(reminder)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>✕</Text>
                      </ThemedButton>
                    </View>
                  ))}
                </View>
              ) : (
                <ThemedText style={styles.emptyText}>
                  No reminders set yet
                </ThemedText>
              )}
            </View>

            <View style={styles.divider} />

            <ThemedButton onPress={logout} style={styles.logoutButton}>
              <Text style={styles.buttonText}>Logout</Text>
            </ThemedButton>

            <Spacer />
            <ThemedText style={styles.footerText}>
              Time to start reading some books...
            </ThemedText>
            <Spacer />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      <BookSelectorModal />
    </ThemedView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
  section: {
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    fontSize: 16,
  },
  button: {
    minWidth: 150,
    paddingVertical: 12,
  },
  selectButton: {
    width: '100%',
    paddingVertical: 12,
  },
  logoutButton: {
  width: 150,              // fixed button width
  alignSelf: 'center',     // centers the button horizontally
  paddingVertical: 10,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  backgroundColor: '#ff4d4d', // example color
},
  buttonText: {
    color: '#f2f2f2',
    textAlign: 'center',
    fontWeight: '500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginVertical: 30,
  },
  remindersList: {
    width: '100%',
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  reminderInfo: {
    flex: 1,
    marginRight: 10,
  },
  reminderBook: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  reminderAuthor: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    minWidth: 0,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  bookItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
  cancelButton: {
    backgroundColor: '#666',
    marginTop: 15,
  },
})