import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window');


const dummyTenants = [
  { id: '1', name: 'Kasun Perera', roomNo: 'Room 01', status: 'Paid', rent: '8500' },
  { id: '2', name: 'Nimal Sirisena', roomNo: 'Room 02', status: 'Pending', rent: '8000' },
  { id: '3', name: 'Amal Silva', roomNo: 'Room 01', status: 'Paid', rent: '8500' },
  { id: '4', name: 'Saman Kumara', roomNo: 'Room 03', status: 'Pending', rent: '9000' },
];

const TenantList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const renderTenantCard = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
    //   onPress={() => router.push(`/(dashboard)/tenants/${item.id}`)}
    >
      <View style={styles.cardLeft}>
        <View style={[styles.avatar, { backgroundColor: item.status === 'Paid' ? '#dcfce7' : '#fee2e2' }]}>
          <Text style={[styles.avatarText, { color: item.status === 'Paid' ? '#16a34a' : '#dc2626' }]}>
            {item.name.charAt(0)}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.tenantName}>{item.name}</Text>
          <View style={styles.roomBadge}>
            <Text style={styles.roomText}>{item.roomNo}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.rentText}>Rs. {item.rent}</Text>
        <View style={[styles.statusDot, { backgroundColor: item.status === 'Paid' ? '#10b981' : '#ef4444' }]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      {/* 1. SEARCH BAR */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search by name or room..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
           <Ionicons name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* 2. LIST SECTION */}
      <FlatList
        data={dummyTenants}
        renderItem={renderTenantCard}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No tenants found.</Text>
          </View>
        }
      />

      {/* 3. FLOATING ACTION BUTTON (FAB) */}
      <TouchableOpacity 
        style={styles.fab}
        // onPress={() => router.push('/(dashboard)/tenants/form')}
      >
        <MaterialIcons name="person-add" size={28} color="white" />
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  
  searchSection: { 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 10
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#1e293b' },
  filterBtn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 15 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: 'bold' },
  info: { marginLeft: 15 },
  tenantName: { fontSize: 16, fontWeight: '900', color: '#1e293b' },
  roomBadge: { backgroundColor: '#f1f5f9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 4 },
  roomText: { fontSize: 11, color: '#64748b', fontWeight: 'bold' },

  cardRight: { alignItems: 'flex-end' },
  rentText: { fontSize: 15, fontWeight: '800', color: '#1e293b', marginBottom: 5 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2563eb',
    width: 65,
    height: 65,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  emptyBox: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#94a3b8', fontSize: 16 }
});

export default TenantList