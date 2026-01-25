import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, Alert, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useRouter, Stack } from 'expo-router'
import useLoader from '@/hooks/useLoader'
import { addTenant } from '@/services/tenant'

const AddTenant = () => {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roomNo, setRoomNo] = useState('Room 01');
  const [rent, setRent] = useState('');
  const [keyMoney, setKeyMoney] = useState('');
  const [isKeyMoneyPaid, setIsKeyMoneyPaid] = useState(false);

  const rooms = ['Room 01', 'Room 02', 'Room 03', 'Room 04', 'Room 05'];

  const handleSave = async () => {
    if (!name || !phone || !rent) {
      Alert.alert("Missing Details", "Full name, phone number and rent are required.");
      return;
    }
    showLoader();
    try {

      const tenantData = {
        name,
        phone,
        roomNo,
        rentAmount: Number(rent),
        keyMoneyAmount: Number(keyMoney),
        isKeyMoneyPaid,
      };

      await addTenant(tenantData);

      Alert.alert("Success", "Tenant registered successfully!");

      router.back();

    } catch (error) {

      Alert.alert("Error", "Failed to register tenant.");

    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. CUSTOM PREMIUM HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerIconBox}>
            <FontAwesome6 name="user-plus" size={18} color="white" />
          </View>
        </View>
        <Text style={styles.headerTitle}>Register Tenant</Text>
        <Text style={styles.headerSub}>Add a new resident to your boarding house</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* 2. FORM CONTAINER (Overlap with header) */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.formScroll}
        >
          <View style={styles.formCard}>
            {/* Basic Info */}
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info" size={18} color="#2563eb" />
              <Text style={styles.sectionTitle}>General Info</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person" size={20} color="#94a3b8" />
                <TextInput style={styles.input} placeholder="Ex: Kasun Perera" value={name} onChangeText={setName} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="phone" size={20} color="#94a3b8" />
                <TextInput style={styles.input} placeholder="07x xxxxxxx" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
              </View>
            </View>

            {/* Room Selection */}
            <View style={[styles.sectionHeader, { marginTop: 15 }]}>
              <FontAwesome6 name="door-closed" size={16} color="#2563eb" />
              <Text style={styles.sectionTitle}>Room Assignment</Text>
            </View>
            <Text style={styles.label}>SELECT ROOM</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomList}>
              {rooms.map((room) => (
                <TouchableOpacity
                  key={room}
                  onPress={() => setRoomNo(room)}
                  style={[styles.roomItem, roomNo === room && styles.roomItemActive]}
                >
                  <Text style={[styles.roomText, roomNo === room && styles.roomTextActive]}>{room}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Financial Info */}
            <View style={[styles.sectionHeader, { marginTop: 20 }]}>
              <MaterialIcons name="payments" size={18} color="#2563eb" />
              <Text style={styles.sectionTitle}>Rental Terms</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>MONTHLY RENT (RS)</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome6 name="money-bill-1" size={18} color="#94a3b8" />
                <TextInput style={styles.input} placeholder="8500" keyboardType="numeric" value={rent} onChangeText={setRent} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>KEY MONEY AMOUNT (RS)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="key" size={18} color="#94a3b8" />
                <TextInput style={styles.input} placeholder="20000" keyboardType="numeric" value={keyMoney} onChangeText={setKeyMoney} />
              </View>
            </View>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchTitle}>Key Money Paid</Text>
                <Text style={styles.switchSub}>Is the deposit settled?</Text>
              </View>
              <Switch
                value={isKeyMoneyPaid}
                onValueChange={setIsKeyMoneyPaid}
                trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                thumbColor={isKeyMoneyPaid ? "#2563eb" : "#94a3b8"}
              />
            </View>

          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave}>
            <Text style={styles.saveBtnText}>REGISTER TENANT</Text>
            <MaterialIcons name="arrow-forward" size={22} color="white" />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  // Header Styles
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 14 },
  headerIconBox: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 14 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: '900' },
  headerSub: { color: '#bfdbfe', fontSize: 13, fontWeight: '500', marginTop: 5 },

  // Form Content
  formScroll: { flex: 1, marginTop: -40 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 50 },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 35,
    padding: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b', marginLeft: 8 },

  inputGroup: { marginBottom: 18 },
  label: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  input: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1e293b', fontWeight: '600' },

  roomList: { flexDirection: 'row', marginBottom: 10 },
  roomItem: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#f1f5f9', borderRadius: 15, marginRight: 10 },
  roomItemActive: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#2563eb' },
  roomText: { color: '#64748b', fontWeight: 'bold', fontSize: 13 },
  roomTextActive: { color: '#2563eb' },

  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  switchTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  switchSub: { fontSize: 12, color: '#94a3b8' },

  saveBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    height: 65,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    elevation: 8,
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 1, marginRight: 10 }
});

export default AddTenant