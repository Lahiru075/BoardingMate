import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { MaterialIcons, FontAwesome6, Ionicons, Feather } from '@expo/vector-icons'
import { getTenantById, markAsPaid, deleteTenant } from '@/services/tenant'
import useLoader from '@/hooks/useLoader'

const TenantDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [tenant, setTenant] = useState<any>(null);

  const loadTenant = async () => {
    if (!id) return;
    try {
      const data = await getTenantById(id as string);
      setTenant(data);
    } catch (error) {
      Alert.alert("Error", "Could not load tenant details.");
    }
  };

  useEffect(() => { loadTenant(); }, [id]);

  const handlePayment = async () => {
    Alert.alert("Confirm Payment", "Mark this month as paid and reset bills?", [
      { text: "Cancel" },
      { text: "Confirm", onPress: async () => {
          showLoader();
          await markAsPaid(id as string);
          await loadTenant(); 
          hideLoader();
          Alert.alert("Success", "Payment updated!");
      }}
    ]);
  };

  const handleDelete = async () => {
    Alert.alert("Delete Tenant", "Are you sure you want to remove this tenant?", [
      { text: "Cancel" },
      { text: "Delete", style: 'destructive', onPress: async () => {
          showLoader();
          await deleteTenant(id as string);
          hideLoader();
          router.back();
      }}
    ]);
  };

  if (!tenant) return null;

  const totalDue = (tenant.rentAmount || 0) + (tenant.electricityShare || 0) + (tenant.waterShare || 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* --- NEW BUTTONS START --- */}
      {/* 1. BACK BUTTON */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.topBtnLeft}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* 2. EDIT BUTTON */}
      <TouchableOpacity 
        onPress={() => router.push({ pathname: '/(dashboard)/tenants/edit', params: { id: id } })}
        style={styles.topBtnRight}
      >
        <Feather name="edit-2" size={20} color="white" />
      </TouchableOpacity>
      {/* --- NEW BUTTONS END --- */}
      
      {/* 1. PROFILE HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>{tenant.name.charAt(0)}</Text>
        </View>
        <Text style={styles.nameText}>{tenant.name}</Text>
        <View style={styles.roomBadge}>
           <Text style={styles.roomText}>{tenant.roomNo}</Text>
        </View>

        {/* Contact Actions */}
        <View style={styles.actionRow}>
           <TouchableOpacity style={styles.circleBtn} onPress={() => Linking.openURL(`tel:${tenant.phone}`)}>
              <MaterialIcons name="call" size={22} color="white" />
           </TouchableOpacity>
           <TouchableOpacity style={styles.circleBtn} onPress={() => Linking.openURL(`sms:${tenant.phone}`)}>
              <MaterialIcons name="message" size={22} color="white" />
           </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 2. PAYMENT SUMMARY CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Breakdown</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Base Rent</Text>
            <Text style={styles.detailValue}>Rs. {tenant.rentAmount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Electricity Share</Text>
            <Text style={styles.detailValue}>Rs. {tenant.electricityShare}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Water Share</Text>
            <Text style={styles.detailValue}>Rs. {tenant.waterShare}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>Rs. {totalDue}</Text>
          </View>
        </View>

        {/* 3. KEY MONEY STATUS */}
        <View style={[styles.card, styles.keyMoneyCard]}>
           <View style={styles.keyIconBox}>
              <Ionicons name="key" size={24} color={tenant.isKeyMoneyPaid ? "#16a34a" : "#dc2626"} />
           </View>
           <View style={{flex: 1, marginLeft: 15}}>
              <Text style={styles.cardTitle}>Key Money</Text>
              <Text style={styles.keyStatusText}>
                {tenant.isKeyMoneyPaid ? "Fully Settled" : "Payment Pending"}
              </Text>
           </View>
           <Text style={styles.keyValue}>Rs. {tenant.keyMoneyAmount}</Text>
        </View>

        {/* 4. ACTIONS */}
        <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
           <MaterialIcons name="verified" size={24} color="white" />
           <Text style={styles.payBtnText}>MARK AS PAID</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
           <Text style={styles.deleteBtnText}>Remove Tenant</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  
  // Top Buttons Style
  topBtnLeft: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  topBtnRight: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  header: { 
    backgroundColor: '#2563eb', 
    paddingTop: 80, 
    paddingBottom: 40, 
    alignItems: 'center', 
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50 
  },
  avatarBox: { width: 80, height: 80, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  avatarText: { fontSize: 35, fontWeight: 'bold', color: 'white' },
  nameText: { fontSize: 24, fontWeight: '900', color: 'white' },
  roomBadge: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 12, marginTop: 8 },
  roomText: { color: '#2563eb', fontWeight: 'bold', fontSize: 12 },
  actionRow: { flexDirection: 'row', marginTop: 20 },
  circleBtn: { width: 45, height: 45, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 },

  scrollContent: { padding: 25 },
  card: { backgroundColor: 'white', borderRadius: 30, padding: 25, marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailLabel: { color: '#64748b', fontWeight: '600' },
  detailValue: { color: '#1e293b', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, fontWeight: '900', color: '#1e293b' },
  totalValue: { fontSize: 22, fontWeight: '900', color: '#2563eb' },

  keyMoneyCard: { flexDirection: 'row', alignItems: 'center' },
  keyIconBox: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  keyStatusText: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  keyValue: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },

  payBtn: { backgroundColor: '#2563eb', height: 65, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 8 },
  payBtnText: { color: 'white', fontSize: 16, fontWeight: '900', marginLeft: 10 },
  deleteBtn: { marginTop: 20, alignItems: 'center', padding: 10 },
  deleteBtnText: { color: '#ef4444', fontWeight: 'bold' }
});

export default TenantDetails