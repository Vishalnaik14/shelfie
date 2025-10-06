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
  const [statusFilter, setStatusFilter] = useState("all") // all, want-to-read, currently-reading, finished

  // Debug logs
  console.log("Books array:", books)
  console.log("Number of books:", books.length)
  
  // Remove duplicates by $id
  const uniqueBooks = books.filter((book, index, self) => 
    index === self.findIndex((b) => b.$id === book.$id)
  )
  
  console.log("Unique books:", uniqueBooks.length)
  if (books.length !== uniqueBooks.length) {
    console.warn(`Found ${books.length - uniqueBooks.length} duplicate books!`)
  }

  // Filter books based on search query and status
  const filteredBooks = uniqueBooks.filter((book) => {
    // Status filter
    if (statusFilter !== "all") {
      const bookStatus = book.status || "Want to Read"
      if (statusFilter === "want-to-read" && bookStatus !== "Want to Read") return false
      if (statusFilter === "currently-reading" && bookStatus !== "Currently Reading") return false
      if (statusFilter === "finished" && bookStatus !== "Finished") return false
    }

    // Search filter
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
      return (b.rating || 0) - (a.rating || 0)
    } else if (sortBy === "rating-low") {
      return (a.rating || 0) - (b.rating || 0)
    }
    return 0
  })

  const handleSortChange = (newSort) => {
    setSortBy(newSort === sortBy ? "none" : newSort)
  }

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus === statusFilter ? "all" : newStatus)
  }

  const getStatusBadgeStyle = (status) => {
    const normalizedStatus = status || "Want to Read"
    switch (normalizedStatus) {
      case "Currently Reading":
        return { backgroundColor: '#4CAF50', text: '📖 Reading' }
      case "Finished":
        return { backgroundColor: '#2196F3', text: '✓ Done' }
      case "Want to Read":
      default:
        return { backgroundColor: '#FF9800', text: '📚 To Read' }
    }
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

      {/* Status Filter */}
      <ThemedView style={styles.filterContainer}>
        <ThemedText style={styles.filterLabel}>Status:</ThemedText>
        <View style={styles.filterButtons}>
          <Pressable 
            style={[
              styles.filterButton, 
              statusFilter === "want-to-read" && styles.filterButtonActive
            ]}
            onPress={() => handleStatusFilterChange("want-to-read")}
          >
            <ThemedText style={[
              styles.filterButtonText,
              statusFilter === "want-to-read" && styles.filterButtonTextActive
            ]}>
              📚 To Read
            </ThemedText>
          </Pressable>

          <Pressable 
            style={[
              styles.filterButton, 
              statusFilter === "currently-reading" && styles.filterButtonActive
            ]}
            onPress={() => handleStatusFilterChange("currently-reading")}
          >
            <ThemedText style={[
              styles.filterButtonText,
              statusFilter === "currently-reading" && styles.filterButtonTextActive
            ]}>
              📖 Reading
            </ThemedText>
          </Pressable>

          <Pressable 
            style={[
              styles.filterButton, 
              statusFilter === "finished" && styles.filterButtonActive
            ]}
            onPress={() => handleStatusFilterChange("finished")}
          >
            <ThemedText style={[
              styles.filterButtonText,
              statusFilter === "finished" && styles.filterButtonTextActive
            ]}>
              ✓ Done
            </ThemedText>
          </Pressable>

          {statusFilter !== "all" && (
            <Pressable 
              style={styles.clearButton}
              onPress={() => setStatusFilter("all")}
            >
              <ThemedText style={styles.clearButtonText}>✕</ThemedText>
            </Pressable>
          )}
        </View>
      </ThemedView>

      {/* Sort Buttons */}
      <ThemedView style={styles.sortContainer}>
        <ThemedText style={styles.sortLabel}>Sort by Rating:</ThemedText>
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
              Highest
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
              Lowest
            </ThemedText>
          </Pressable>

          {sortBy !== "none" && (
            <Pressable 
              style={styles.clearButton}
              onPress={() => setSortBy("none")}
            >
              <ThemedText style={styles.clearButtonText}>✕</ThemedText>
            </Pressable>
          )}
        </View>
      </ThemedView>

      <FlatList
  data={sortedBooks}
  keyExtractor={(item) => item.$id}
  contentContainerStyle={styles.list}
  showsVerticalScrollIndicator={false}
  renderItem={({ item }) => {
    const statusStyle = getStatusBadgeStyle(item.status)
    return (
      <Pressable 
        onPress={() => router.push(`/books/${item.$id}`)}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressablePressed
        ]}
      >
        <ThemedCard style={styles.card}>
          {/* Top row with status badge */}
          <View style={styles.cardTop}>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
              <ThemedText style={styles.statusText}>{statusStyle.text}</ThemedText>
            </View>
            {item.rating > 0 && (
              <View style={styles.ratingBadge}>
                <ThemedText style={styles.ratingBadgeText}>⭐ {item.rating}</ThemedText>
              </View>
            )}
          </View>

          <Spacer height={12} />

          {/* Book title */}
          <ThemedText style={styles.title} numberOfLines={2}>
            {item.title}
          </ThemedText>

          <Spacer height={8} />

          {/* Author */}
          <View style={styles.authorRow}>
            <ThemedText style={styles.authorIcon}>✍️</ThemedText>
            <ThemedText style={styles.author} numberOfLines={1}>
              {item.author}
            </ThemedText>
          </View>

          {/* Genre tag at bottom */}
          {item.genre && (
            <>
              <Spacer height={12} />
              <View style={styles.genreContainer}>
                <View style={styles.genreBadge}>
                  <ThemedText style={styles.genreText}>{item.genre}</ThemedText>
                </View>
              </View>
            </>
          )}
        </ThemedCard>
      </Pressable>
    )
  }}
  ListEmptyComponent={
    <ThemedView style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <ThemedText style={styles.emptyText}>No books found</ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Try adjusting your filters or add a new book
      </ThemedText>
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
  filterContainer: {
    paddingHorizontal: "5%",
    marginTop: 5,
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
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
    paddingHorizontal: "5%",
  },
  pressable: {
    marginVertical: 8,
    transform: [{ scale: 1 }],
  },
  pressablePressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: "700",
    lineHeight: 26,
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorIcon: {
    fontSize: 14,
  },
  author: {
    fontSize: 15,
    opacity: 0.7,
    flex: 1,
  },
  genreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badges: {
    flexDirection: 'column',
    gap: 5,
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  genreBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  genreText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
})