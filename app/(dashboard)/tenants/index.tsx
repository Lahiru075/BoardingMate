import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Dimensions, StatusBar, ActivityIndicator } from 'react-native'
import React, { useState, useCallback } from 'react'
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons'
import { useRouter, useFocusEffect } from 'expo-router'
import { getAllTenantsByUserId } from '@/services/tenant'

const { width } = Dimensions.get('window');

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

  // filteredTenants 
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
          <View style={[styles.avatar, { backgroundColor: isPaid ? '#dcfce7' : '#fee2e2' }]}>
            <Text style={[styles.avatarText, { color: isPaid ? '#16a34a' : '#dc2626' }]}>
              {item.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.tenantName}>{item.name}</Text>
            <Text style={styles.roomNo}>{item.roomNo}</Text>
          </View>
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.rentText}>Rs. {item.rentAmount}</Text>
          <View style={[styles.statusDot, { backgroundColor: isPaid ? '#10b981' : '#ef4444' }]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerSub}>MANAGEMENT</Text>
            <Text style={styles.headerTitle}>My Tenants</Text>
          </View>
          <View style={styles.iconBox}>
            <Ionicons name="people" size={24} color="white" />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search by name or room..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* LIST SECTION */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 50 }} />
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
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/(dashboard)/tenants/form')}
        style={styles.fab}
      >
        <Ionicons name="person-add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 60, paddingBottom: 40, paddingHorizontal: 25,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    elevation: 10, shadowColor: '#2563eb', shadowOpacity: 0.2, shadowRadius: 15,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerSub: { color: '#bfdbfe', fontSize: 11, fontWeight: 'bold', letterSpacing: 2 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: '900' },
  iconBox: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 15 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    borderRadius: 20, paddingHorizontal: 15, paddingVertical: 12,
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1e293b', fontWeight: '500' },
  listContainer: { flex: 1, marginTop: -20 },
  listContent: { paddingHorizontal: 25, paddingTop: 30, paddingBottom: 100 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 5 },
  listHeaderTitle: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  listHeaderCount: { color: '#2563eb', fontSize: 12, fontWeight: 'bold' },
  card: {
    backgroundColor: 'white', borderRadius: 25, padding: 15,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 15, elevation: 3, borderWidth: 1, borderColor: '#f1f5f9',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: 'bold' },
  info: { marginLeft: 15 },
  tenantName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  roomNo: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold', marginTop: 2, textTransform: 'uppercase' },
  cardRight: { alignItems: 'flex-end' },
  rentText: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 8 },
  fab: {
    position: 'absolute', bottom: 30, right: 25, backgroundColor: '#2563eb',
    width: 65, height: 65, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    elevation: 8, shadowColor: '#2563eb', shadowOpacity: 0.3, shadowRadius: 10,
  }
});

export default TenantList