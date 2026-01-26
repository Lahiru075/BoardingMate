import { getAllTenantsByUserId } from '@/services/tenant'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { 
  ActivityIndicator, 
  Dimensions, 
  FlatList, 
  StatusBar, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native'

const { width, height } = Dimensions.get('window');

const TenantList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTenants = async () => {
    setLoading(true);
    try {
      const data = await getAllTenantsByUserId();
      setTenants(data);
    } catch (error) {
      console.error("Error loading tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTenants();
    }, [])
  );

  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.roomNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTenantCard = ({ item }: any) => {

    const isPaid = item.lastPaidDate !== null;

    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/(dashboard)/tenants/[id]', params: { id: item.id } })}
        style={styles.card}
      >
        <View style={styles.cardLeft}>
          <View style={[styles.avatar, { backgroundColor: isPaid ? '#E7F9F0' : '#FFF1F1' }]}>
            <Text style={[styles.avatarText, { color: isPaid ? '#10B981' : '#FF5A5F' }]}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.tenantName}>{item.name}</Text>
            <View style={styles.roomBadge}>
              <Text style={styles.roomNo}>{item.roomNo}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.rentText}>Rs. {item.rentAmount}</Text>
          <View style={[styles.statusDot, { backgroundColor: isPaid ? '#10B981' : '#FF5A5F' }]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* BACKGROUND DECORATIONS (Consistent with Brand) */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      {/* 1. CLEAN HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brandTitle}>My <Text style={{ color: '#FF5A5F' }}>Tenants</Text></Text>
            <Text style={styles.headerSub}>MANAGE RESIDENTS</Text>
          </View>
          <TouchableOpacity style={styles.iconBox}>
            <Ionicons name="people-outline" size={24} color="#FF5A5F" />
          </TouchableOpacity>
        </View>

        {/* 2. SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#A0A0A0" />
          <TextInput
            placeholder="Search by name or room..."
            placeholderTextColor="#A0A0A0"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* 3. LIST SECTION */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF5A5F" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={filteredTenants}
            renderItem={renderTenantCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderTitle}>Active Residents</Text>
                <Text style={styles.listHeaderCount}>{filteredTenants.length} Total</Text>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={60} color="#E0E0E0" />
                <Text style={styles.emptyText}>No tenants found</Text>
              </View>
            }
          />
        )}
      </View>

      {/* 4. FAB (Add Button) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/(dashboard)/tenants/form')}
        style={styles.fab}
      >
        <Ionicons name="person-add" size={26} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFDFD' },
  
  // Background Blobs
  bgCircleTop: {
    position: 'absolute', top: -height * 0.05, right: -width * 0.15,
    width: width * 0.7, height: width * 0.7, borderRadius: width,
    backgroundColor: '#FFF1F1', opacity: 0.7,
  },
  bgCircleBottom: {
    position: 'absolute', bottom: -height * 0.05, left: -width * 0.15,
    width: width * 0.6, height: width * 0.6, borderRadius: width,
    backgroundColor: '#FFF1F1', opacity: 0.5,
  },

  // Header Styles
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 25,
    zIndex: 1,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  brandTitle: { fontSize: 26, fontWeight: '900', color: '#2D3436' },
  headerSub: { color: '#A0A0A0', fontSize: 9, fontWeight: 'bold', letterSpacing: 1.5, marginTop: 2 },
  iconBox: { backgroundColor: 'white', padding: 10, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  
  // Search Bar
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F8FA',
    borderRadius: 15, paddingHorizontal: 15, height: 50,
    borderWidth: 1, borderColor: '#ECECEC',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#2D3436', fontWeight: '500' },

  // List Container
  listContainer: { flex: 1 },
  listContent: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 120 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
  listHeaderTitle: { color: '#A0A0A0', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  listHeaderCount: { color: '#FF5A5F', fontSize: 11, fontWeight: 'bold' },

  // Card Styles
  card: {
    backgroundColor: 'white', borderRadius: 25, padding: 15,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 15, borderWidth: 1, borderColor: '#F2F2F2',
    // Soft Glow Shadow
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.05, shadowRadius: 10,
    elevation: 4,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: 'bold' },
  info: { marginLeft: 12 },
  tenantName: { fontSize: 15, fontWeight: 'bold', color: '#2D3436' },
  roomBadge: { backgroundColor: '#F7F8FA', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4, alignSelf: 'flex-start' },
  roomNo: { color: '#A0A0A0', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  cardRight: { alignItems: 'flex-end' },
  rentText: { fontSize: 14, fontWeight: '800', color: '#2D3436' },
  statusDot: { width: 7, height: 7, borderRadius: 4, marginTop: 8 },

  // FAB Styles
  fab: {
    position: 'absolute', bottom: 30, right: 25, backgroundColor: '#FF5A5F',
    width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    elevation: 8, shadowColor: '#FF5A5F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10,
  },

  // Empty State
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#A0A0A0', fontSize: 14, fontWeight: '600', marginTop: 10 }
});

export default TenantList;