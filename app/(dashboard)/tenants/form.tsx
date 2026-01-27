import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, Alert, StatusBar, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import useLoader from '@/hooks/useLoader'
import { addTenant } from '@/services/tenant'
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

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

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all required fields!'
      })

      return;
    }
    showLoader();
    try {
      const tenantData = {
        name,
        phone,
        roomNo,
        rentAmount: Number(rent),
        keyMoneyAmount: Number(keyMoney) || 0,
        isKeyMoneyPaid,
      };

      await addTenant(tenantData);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Tenant registered successfully! ✅'
      });

      router.back();
    } catch (error) {

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Tenant registration failed! ❌'
      });

    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* BACKGROUND DECORATIONS */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      {/* 1. TOP NAVIGATION BAR (FIXED HEADER) */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="arrow-back" size={22} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>Register <Text style={{ color: '#FF5A5F' }}>Tenant</Text></Text>
        <View style={{ width: 42 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Card Wrapper */}
          <View style={styles.formWrapper}>
            <View style={styles.card}>

              {/* Card Inner Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.welcomeText}>New Resident</Text>
                <Text style={styles.subText}>Fill in the details to onboard</Text>
              </View>

              <View style={styles.inputsArea}>
                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>FULL NAME</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="person-outline" size={20} color="#A0A0A0" />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: Kasun Perera"
                      placeholderTextColor="#A0A0A0"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>

                {/* Phone Number */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>PHONE NUMBER</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="phone-iphone" size={20} color="#A0A0A0" />
                    <TextInput
                      style={styles.input}
                      placeholder="07x xxxxxxx"
                      placeholderTextColor="#A0A0A0"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>
                </View>

                {/* Room Selection */}
                <View style={styles.inputGroup}>
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
                </View>

                {/* Monthly Rent */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>MONTHLY RENT (RS)</Text>
                  <View style={styles.inputContainer}>
                    <FontAwesome6 name="money-bill-1" size={18} color="#A0A0A0" />
                    <TextInput
                      style={styles.input}
                      placeholder="8500"
                      placeholderTextColor="#A0A0A0"
                      keyboardType="numeric"
                      value={rent}
                      onChangeText={setRent}
                    />
                  </View>
                </View>

                {/* Key Money */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>KEY MONEY AMOUNT (RS)</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="key-outline" size={18} color="#A0A0A0" />
                    <TextInput
                      style={styles.input}
                      placeholder="20000"
                      placeholderTextColor="#A0A0A0"
                      keyboardType="numeric"
                      value={keyMoney}
                      onChangeText={setKeyMoney}
                    />
                  </View>
                </View>

                {/* Key Money Paid Toggle */}
                <View style={styles.switchRow}>
                  <View>
                    <Text style={styles.switchTitle}>Key Money Paid</Text>
                    <Text style={styles.switchSub}>Is the deposit settled?</Text>
                  </View>
                  <Switch
                    value={isKeyMoneyPaid}
                    onValueChange={setIsKeyMoneyPaid}
                    trackColor={{ false: "#F2F2F2", true: "#FFDADA" }}
                    thumbColor={isKeyMoneyPaid ? "#FF5A5F" : "#A0A0A0"}
                  />
                </View>
              </View>

              {/* SAVE BUTTON */}
              <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Register Tenant</Text>
                <MaterialIcons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFDFD' },

  // Background Decorations
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

  // Fixed Navigation Header
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 15,
    zIndex: 10
  },
  navBtn: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: 'white',
    alignItems: 'center', justifyContent: 'center', elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.05
  },
  headerTitleText: { fontSize: 20, fontWeight: '900', color: '#2D3436' },

  scrollContent: { paddingBottom: 50 },

  // Form Card
  formWrapper: { paddingHorizontal: 25, marginTop: 10 },
  card: {
    backgroundColor: 'white', borderRadius: 40, paddingHorizontal: 25, paddingVertical: 35,
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.08, shadowRadius: 20,
    elevation: 10, borderWidth: 1, borderColor: '#F2F2F2',
  },
  cardHeader: { alignItems: 'center', marginBottom: 25 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#2D3436' },
  subText: { fontSize: 13, color: '#A0A0A0', marginTop: 5 },

  // Inputs Area
  inputsArea: { gap: 12 },
  inputGroup: { marginBottom: 5 },
  label: { fontSize: 9, fontWeight: '900', color: '#A0A0A0', letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F8FA',
    borderRadius: 15, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#ECECEC'
  },
  input: { flex: 1, marginLeft: 10, fontSize: 14, color: '#2D3436', fontWeight: '600' },

  // Room Selector
  roomList: { flexDirection: 'row', marginBottom: 5 },
  roomItem: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: '#F7F8FA', borderRadius: 12, marginRight: 10, borderWidth: 1, borderColor: '#ECECEC' },
  roomItemActive: { backgroundColor: '#FFF1F1', borderColor: '#FF5A5F' },
  roomText: { color: '#A0A0A0', fontWeight: 'bold', fontSize: 12 },
  roomTextActive: { color: '#FF5A5F' },

  // Switch Row
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F7F8FA' },
  switchTitle: { fontSize: 14, fontWeight: 'bold', color: '#2D3436' },
  switchSub: { fontSize: 11, color: '#A0A0A0' },

  // Save Button
  saveBtn: {
    backgroundColor: '#FF5A5F', flexDirection: 'row', height: 55, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginTop: 30,
    shadowColor: '#FF5A5F', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 1, marginRight: 10 }
});

export default AddTenant;