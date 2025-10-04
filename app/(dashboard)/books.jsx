import { StyleSheet, FlatList, Pressable, View } from 'react-native'
import { useState } from 'react'
import { useBooks } from '../../hooks/useBooks'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedCard from "../../components/ThemedCard"
import ThemedTextInput from "../../components/ThemedTextInput"
import ThemedButton from "../../components/ThemedButton"

const Books = () => {
  const { books } = useBooks()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("none") // none, rating-high, rating-low

  // Debug logs
  console.log("Books array:", books)
  console.log("Number of books:", books.length)
  
  // Remove duplicates by $id
  const uniqueBooks = books.filter((book, index, self) => 
    index === self.findIndex((b) => b.$id === book.$id)
  )
  
  console.log("Unique books:", uniqueBooks.length)
  if (books.length !== uniqueBooks.length) {
    console.warn(`⚠️ Found ${books.length - uniqueBooks.length} duplicate books!`)
  }

  // Filter books based on search query
  const filteredBooks = uniqueBooks.filter((book) => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    const titleMatch = book.title?.toLowerCase().includes(query) || false
    const authorMatch = book.author?.toLowerCase().includes(query) || false
    const genreMatch = book.genre?.toLowerCase().includes(query) || false
    
    return titleMatch || authorMatch || genreMatch
  })

  // Sort filtered books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "rating-high") {
      // Highest rating first
      return (b.rating || 0) - (a.rating || 0)
    } else if (sortBy === "rating-low") {
      // Lowest rating first
      return (a.rating || 0) - (b.rating || 0)
    }
    // Default: no sorting (original order)
    return 0
  })

  const handleSortChange = (newSort) => {
    setSortBy(newSort === sortBy ? "none" : newSort)
  }

  return (
    <ThemedView style={styles.container} safe={true}>

      <ThemedText title={true} style={styles.heading}>
        Your Reading List
      </ThemedText>

      <Spacer height={10}/>
      
      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <ThemedTextInput
          style={styles.searchInput}
          placeholder="Search by title, author, or genre..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </ThemedView>

      {/* Sort Buttons */}
      <ThemedView style={styles.sortContainer}>
        <ThemedText style={styles.sortLabel}>Sort by:</ThemedText>
        <View style={styles.sortButtons}>
          <Pressable 
            style={[
              styles.sortButton, 
              sortBy === "rating-high" && styles.sortButtonActive
            ]}
            onPress={() => handleSortChange("rating-high")}
          >
            <ThemedText style={[
              styles.sortButtonText,
              sortBy === "rating-high" && styles.sortButtonTextActive
            ]}>
              ⭐ Highest
            </ThemedText>
          </Pressable>

          <Pressable 
            style={[
              styles.sortButton, 
              sortBy === "rating-low" && styles.sortButtonActive
            ]}
            onPress={() => handleSortChange("rating-low")}
          >
            <ThemedText style={[
              styles.sortButtonText,
              sortBy === "rating-low" && styles.sortButtonTextActive
            ]}>
              ☆ Lowest
            </ThemedText>
          </Pressable>

          {sortBy !== "none" && (
            <Pressable 
              style={styles.clearButton}
              onPress={() => setSortBy("none")}
            >
              <ThemedText style={styles.clearButtonText}>✕ Clear</ThemedText>
            </Pressable>
          )}
        </View>
      </ThemedView>

      <FlatList
        data={sortedBooks}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/books/${item.$id}`)}>
            <ThemedCard style={styles.card}>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.title} numberOfLines={2}>
                  {item.title}
                </ThemedText>
                <View style={styles.badges}>
                  {item.genre && (
                    <View style={styles.genreBadge}>
                      <ThemedText style={styles.genreText}>{item.genre}</ThemedText>
                    </View>
                  )}
                  {item.rating > 0 && (
                    <View style={styles.ratingBadge}>
                      <ThemedText style={styles.ratingBadgeText}>
                        ⭐ {item.rating}
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>
              <ThemedText style={styles.author}>Written by {item.author}</ThemedText>
            </ThemedCard>
          </Pressable>
        )}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No books found</ThemedText>
          </ThemedView>
        }
      />

    </ThemedView>
  )
}

export default Books

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  searchContainer: {
    paddingHorizontal: "5%",
    marginTop: 10,
  },
  searchInput: {
    width: "100%",
    marginBottom: 10,
  },
  sortContainer: {
    paddingHorizontal: "5%",
    marginTop: 5,
    marginBottom: 10,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  sortButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    marginTop: 10,
    paddingBottom: 20,
  },
  card: {
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 10,
    paddingLeft: 14,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  author: {
    fontSize: 14,
  },
  badges: {
    flexDirection: 'column',
    gap: 5,
    alignItems: 'flex-end',
  },
  genreBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  genreText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  ratingBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
})