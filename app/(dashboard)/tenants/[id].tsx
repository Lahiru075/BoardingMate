import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar, Linking, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { MaterialIcons, FontAwesome6, Ionicons, Feather } from '@expo/vector-icons'
import { getTenantById, markAsPaid, deleteTenant } from '@/services/tenant'
import useLoader from '@/hooks/useLoader'
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const TenantDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [tenant, setTenant] = useState<any>(null);

  const loadTenant = async () => {
    if (!id) return;
    showLoader();
    try {
      const data = await getTenantById(id as string);
      setTenant(data);
    } catch (error) {
      Alert.alert("Error", "Could not load tenant details.");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => { loadTenant(); }, [id]);

  const handlePayment = async () => {
    Alert.alert("Confirm Payment", "Mark this month as paid and reset bills?", [
      { text: "Cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          showLoader();
          try {
            await markAsPaid(id as string);
            await loadTenant();

            Toast.show({
              type: 'success',
              text1: 'Payment Updated',
              text2: 'Tenant marked as paid successfully! ✅',
              position: 'bottom'
            });

          } catch (error) {

            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Something went wrong! ❌'
            });

          } finally {
            hideLoader();
          }
        }
      }
    ]);
  };

  const handleDelete = async () => {

    Alert.alert("Delete Tenant", "Are you sure you want to remove this tenant?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: 'destructive', 
        onPress: async () => {
          showLoader();
          try {
            await deleteTenant(id as string);
            hideLoader();

            Toast.show({
              type: 'success',
              text1: 'Tenant Removed',
              text2: 'Record deleted successfully 🗑️',
            });

            router.back(); 
          } catch (error) {
            hideLoader();
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Failed to delete tenant ❌',
            });
          }
        }
      }
    ]);
  };

  if (!tenant) return null;

  const totalDue = (tenant.rentAmount || 0) + (tenant.electricityShare || 0) + (tenant.waterShare || 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* BACKGROUND DECORATIONS (Consistent with Brand) */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      {/* 1. TOP NAVIGATION BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="arrow-back" size={22} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tenant <Text style={{ color: '#FF5A5F' }}>Profile</Text></Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/(dashboard)/tenants/edit', params: { id: id } })}
          style={styles.navBtn}
        >
          <Feather name="edit-3" size={20} color="#FF5A5F" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 2. PROFILE SECTION */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{tenant.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.roomBadge}>
              <Text style={styles.roomBadgeText}>{tenant.roomNo}</Text>
            </View>
          </View>
          <Text style={styles.tenantName}>{tenant.name}</Text>

          {/* Contact Actions */}
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`tel:${tenant.phone}`)}>
              <MaterialIcons name="call" size={20} color="#FF5A5F" />
              <Text style={styles.contactBtnText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`sms:${tenant.phone}`)}>
              <MaterialIcons name="chat-bubble-outline" size={20} color="#FF5A5F" />
              <Text style={styles.contactBtnText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. PAYMENT BREAKDOWN CARD */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>MONTHLY BREAKDOWN</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Base Rent</Text>
            <Text style={styles.rowValue}>Rs. {tenant.rentAmount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Electricity Share</Text>
            <Text style={styles.rowValue}>Rs. {tenant.electricityShare || 0}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Water Share</Text>
            <Text style={styles.rowValue}>Rs. {tenant.waterShare || 0}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>Rs. {totalDue}</Text>
          </View>
        </View>

        {/* 4. KEY MONEY CARD */}
        <View style={[styles.card, styles.keyMoneyCard]}>
          <View style={[styles.keyIconBg, { backgroundColor: tenant.isKeyMoneyPaid ? '#E7F9F0' : '#FFF1F1' }]}>
            <Ionicons name="key" size={20} color={tenant.isKeyMoneyPaid ? "#10B981" : "#FF5A5F"} />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.keyLabel}>Key Money Status</Text>
            <Text style={[styles.keyStatus, { color: tenant.isKeyMoneyPaid ? '#10B981' : '#FF5A5F' }]}>
              {tenant.isKeyMoneyPaid ? "Fully Settled" : "Payment Pending"}
            </Text>
          </View>
          <Text style={styles.keyAmount}>Rs. {tenant.keyMoneyAmount}</Text>
        </View>

        {/* 5. MAIN ACTION BUTTONS */}
        <TouchableOpacity style={styles.mainPayBtn} onPress={handlePayment} activeOpacity={0.8}>
          <MaterialIcons name="verified-user" size={20} color="white" />
          <Text style={styles.mainPayBtnText}>MARK AS PAID</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Remove Tenant from Boarding</Text>
        </TouchableOpacity>

      </ScrollView>
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

  // Top Bar
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 50, marginBottom: 20 },
  navBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#2D3436' },

  scrollContent: { paddingHorizontal: 25, paddingBottom: 50 },

  // Profile Header
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { marginBottom: 15, position: 'relative' },
  avatarCircle: { width: 90, height: 90, borderRadius: 30, backgroundColor: '#FFF1F1', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F2F2F2' },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#FF5A5F' },
  roomBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#FF5A5F', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, borderWidth: 3, borderColor: 'white' },
  roomBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  tenantName: { fontSize: 24, fontWeight: '900', color: '#2D3436' },

  contactRow: { flexDirection: 'row', marginTop: 15 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 15, marginHorizontal: 8, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
  contactBtnText: { marginLeft: 8, fontSize: 13, fontWeight: 'bold', color: '#2D3436' },

  // Card Styles
  card: {
    backgroundColor: 'white', borderRadius: 35, padding: 25, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.08, shadowRadius: 15,
    elevation: 8, borderWidth: 1, borderColor: '#F2F2F2'
  },
  cardHeaderTitle: { fontSize: 10, fontWeight: '900', color: '#A0A0A0', letterSpacing: 1.5, marginBottom: 20, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  rowLabel: { fontSize: 14, color: '#636E72', fontWeight: '500' },
  rowValue: { fontSize: 14, color: '#2D3436', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#F7F8FA', marginVertical: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: '900', color: '#2D3436' },
  totalValue: { fontSize: 20, fontWeight: '900', color: '#FF5A5F' },

  keyMoneyCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20 },
  keyIconBg: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  keyLabel: { fontSize: 13, fontWeight: 'bold', color: '#2D3436' },
  keyStatus: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  keyAmount: { fontSize: 15, fontWeight: '900', color: '#2D3436' },

  // Action Buttons
  mainPayBtn: {
    backgroundColor: '#FF5A5F', height: 60, borderRadius: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
    shadowColor: '#FF5A5F', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5
  },
  mainPayBtnText: { color: 'white', fontSize: 16, fontWeight: '900', marginLeft: 10, letterSpacing: 1 },
  deleteBtn: { marginTop: 20, padding: 15, alignItems: 'center' },
  deleteBtnText: { color: '#A0A0A0', fontSize: 13, fontWeight: 'bold', textDecorationLine: 'underline' }
});

export default TenantDetails;