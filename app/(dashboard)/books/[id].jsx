import { StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView } from "react-native"
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router"
import { useEffect, useState, useCallback } from "react"
import { useBooks } from "../../../hooks/useBooks"
import { Colors } from "../../../constants/Colors"

// themed components
import ThemedText from "../../../components/ThemedText"
import ThemedButton from "../../../components/ThemedButton"
import ThemedView from "../../../components/ThemedView"
import Spacer from "../../../components/Spacer"
import ThemedCard from "../../../components/ThemedCard"
import ThemedLoader from "../../../components/ThemedLoader"

// Star Rating Component
const StarRating = ({ rating, onRatingChange, editable = true }) => {
  const stars = [1, 2, 3, 4, 5]

  return (
    <View style={styles.starContainer}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => editable && onRatingChange(star)}
          disabled={!editable}
          style={styles.starButton}
        >
          <Text style={styles.star}>
            {star <= rating ? '⭐' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
      <ThemedText style={styles.ratingText}>
        {rating > 0 ? `${rating}/5` : 'Not rated'}
      </ThemedText>
    </View>
  )
}

const BookDetails = () => {
  const [book, setBook] = useState(null)
  const [rating, setRating] = useState(0)
  const [status, setStatus] = useState("Want to Read")

  const { id } = useLocalSearchParams()
  const { fetchBookById, deleteBook, updateBook } = useBooks()
  const router = useRouter()

  const handleRatingChange = async (newRating) => {
    setRating(newRating)
    // Update the rating in the database
    try {
      await updateBook(id, { rating: newRating })
      console.log("Rating updated successfully")
    } catch (error) {
      console.error("Error updating rating:", error)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus)
    // Update the status in the database
    try {
      await updateBook(id, { status: newStatus })
      console.log("Status updated successfully")
      Alert.alert("Success", `Status changed to "${newStatus}"`)
    } catch (error) {
      console.error("Error updating status:", error)
      Alert.alert("Error", "Failed to update status")
    }
  }

  const handleDelete = async () => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteBook(id)
            setBook(null)
            router.replace('/books')
          }
        }
      ]
    )
  }

  const handleEdit = () => {
    router.push(`/books/edit/${id}`)
  }

  // Reload book details every time screen gains focus to reflect changes (e.g. after editing)
  useFocusEffect(
    useCallback(() => {
      async function loadBook() {
        try {
          const bookData = await fetchBookById(id)
          if (bookData) {
            setBook(bookData)
            setRating(bookData.rating || 0)
            setStatus(bookData.status || "Want to Read")
          } else {
            Alert.alert("Error", "Book not found", [
              { text: "OK", onPress: () => router.replace('/books') }
            ])
          }
        } catch (error) {
          console.error("Error loading book:", error)
          Alert.alert("Error", "Failed to load book details", [
            { text: "OK", onPress: () => router.replace('/books') }
          ])
        }
      }
      loadBook()
      return () => setBook(null)
    }, [id])
  )

  if (!book) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    )
  }

  return (
    <ThemedView safe={true} style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedCard style={styles.card}>
          <ThemedText style={styles.title}>{book.title}</ThemedText>

          <ThemedText>Genre: {book.genre}</ThemedText>
          <Spacer height={10} />

          <ThemedText>Written by {book.author}</ThemedText>
          <Spacer height={15} />

          {/* Status Section */}
          <View style={styles.statusSection}>
            <ThemedText style={styles.statusLabel}>Reading Status:</ThemedText>
            <View style={styles.statusButtons}>
              <ThemedButton
                style={[
                  styles.statusButton,
                  status === "Want to Read" && { backgroundColor: '#FF9800' }
                ]}
                onPress={() => handleStatusChange("Want to Read")}
              >
                <Text style={styles.statusButtonText}>
                  📚 To Read
                </Text>
              </ThemedButton>

              <ThemedButton
                style={[
                  styles.statusButton,
                  status === "Currently Reading" && { backgroundColor: '#4CAF50' }
                ]}
                onPress={() => handleStatusChange("Currently Reading")}
              >
                <Text style={styles.statusButtonText}>
                  📖 Reading
                </Text>
              </ThemedButton>

              <ThemedButton
                style={[
                  styles.statusButton,
                  status === "Finished" && { backgroundColor: '#2196F3' }
                ]}
                onPress={() => handleStatusChange("Finished")}
              >
                <Text style={styles.statusButtonText}>
                  ✓ Done
                </Text>
              </ThemedButton>
            </View>
          </View>
          <Spacer height={15} />

          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <ThemedText style={styles.ratingLabel}>Your Rating:</ThemedText>
            <StarRating 
              rating={rating} 
              onRatingChange={handleRatingChange}
              editable={true}
            />
          </View>
          <Spacer />

          <ThemedText title={true}>Book description:</ThemedText>
          <Spacer height={10} />

          <ThemedText>{book.description}</ThemedText>
        </ThemedCard>

        {/* Action Buttons Container */}
        <View style={styles.actionButtons}>
          <ThemedButton onPress={handleEdit} style={styles.editButton}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Edit Book</Text>
          </ThemedButton>

          <ThemedButton onPress={handleDelete} style={styles.delete}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Delete Book</Text>
          </ThemedButton>
        </View>

        <Spacer height={30} />
      </ScrollView>
    </ThemedView>
  )
}

export default BookDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    marginVertical: 10,
  },
  card: {
    margin: 20
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  editButton: {
    backgroundColor: Colors.primary,
    width: 150,
    flex: 1,
  },
  delete: {
    backgroundColor: Colors.warning,
    width: 150,
    flex: 1,
  },
  statusSection: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 15,
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusButton: {
    flex: 1,
    minWidth: 90,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  ratingSection: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 32,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
})
