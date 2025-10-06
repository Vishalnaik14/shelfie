import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
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

  const handleDelete = async () => {
    await deleteBook(id)
    setBook(null)
    router.replace('/books')
  }

  // NEW: Navigate to edit screen
  const handleEdit = () => {
    router.push(`/books/edit/${id}`)
  }

  useEffect(() => {
    async function loadBook() {
      const bookData = await fetchBookById(id)
      setBook(bookData)
      setRating(bookData.rating || 0)
    }

    loadBook()

    return () => setBook(null)
  }, [id])

  if (!book) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    )
  }

  return (
    <ThemedView safe={true} style={styles.container}>
      <ThemedCard style={styles.card}>
        <ThemedText style={styles.title}>{book.title}</ThemedText>
        
        <ThemedText>Genre: {book.genre}</ThemedText>
        <Spacer height={10} />
        
        <ThemedText>Written by {book.author}</ThemedText>
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

      {/* NEW: Action Buttons Container */}
      <View style={styles.actionButtons}>
        <ThemedButton onPress={handleEdit} style={styles.editButton}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Edit Book</Text>
        </ThemedButton>

        <ThemedButton onPress={handleDelete} style={styles.delete}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Delete Book</Text>
        </ThemedButton>
      </View>
    </ThemedView>
  )
}

export default BookDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  title: {
    fontSize: 22,
    marginVertical: 10,
  },
  card: {
    margin: 20
  },
  // NEW: Action buttons container
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  // NEW: Edit button style
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
