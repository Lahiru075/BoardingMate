import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, FontAwesome6, Ionicons } from '@expo/vector-icons'
import useLoader from '@/hooks/useLoader'
import { distributeBills } from '@/services/tenant'

const BillManager = () => {
  const { showLoader, hideLoader } = useLoader();
  const [selectedRoom, setSelectedRoom] = useState('Room 01');
  const [totalElec, setTotalElec] = useState('');
  const [totalWater, setTotalWater] = useState('');

  const rooms = ['Room 01', 'Room 02', 'Room 03', 'Room 04', 'Room 05'];

  const handleDistribute = async () => {
    if (!totalElec || !totalWater) {
      Alert.alert("Input Error", "Please enter total bill amounts.");
      return;
    }

    showLoader();
    try {
      await distributeBills(selectedRoom, Number(totalElec), Number(totalWater));
      Alert.alert("Success", `Bills split among tenants in ${selectedRoom}`);
      setTotalElec('');
      setTotalWater('');
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerIconBox}>
          <FontAwesome6 name="file-invoice-dollar" size={24} color="white" />
        </View>
        <Text style={styles.headerTitle}>Bill Splitter</Text>
        <Text style={styles.headerSub}>Divide electricity & water bills easily</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.card}>
          {/* 1. SELECT ROOM */}
          <Text style={styles.label}>SELECT TARGET ROOM</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomList}>
            {rooms.map((room) => (
              <TouchableOpacity
                key={room}
                onPress={() => setSelectedRoom(room)}
                style={[styles.roomItem, selectedRoom === room && styles.roomItemActive]}
              >
                <Text style={[styles.roomText, selectedRoom === room && styles.roomTextActive]}>{room}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.divider} />

          {/* 2. ELECTRICITY BILL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>TOTAL ELECTRICITY BILL (RS)</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="bolt" size={22} color="#eab308" />
              <TextInput
                style={styles.input}
                placeholder="Ex: 4500"
                keyboardType="numeric"
                value={totalElec}
                onChangeText={setTotalElec}
              />
            </View>
          </View>

          {/* 3. WATER BILL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>TOTAL WATER BILL (RS)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="water" size={22} color="#3b82f6" />
              <TextInput
                style={styles.input}
                placeholder="Ex: 1200"
                keyboardType="numeric"
                value={totalWater}
                onChangeText={setTotalWater}
              />
            </View>
          </View>

          {/* INFO BOX */}
          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={18} color="#64748b" />
            <Text style={styles.infoText}>
              The app will automatically detect tenants in {selectedRoom} and split the cost equally.
            </Text>
          </View>

          {/* DISTRIBUTE BUTTON */}
          <TouchableOpacity style={styles.actionBtn} onPress={handleDistribute}>
            <Text style={styles.actionBtnText}>SPLIT & UPDATE</Text>
            <MaterialIcons name="send" size={20} color="white" />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#2563eb', paddingTop: 60, paddingBottom: 40,
    alignItems: 'center', borderBottomLeftRadius: 40, borderBottomRightRadius: 40
  },
  headerIconBox: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 20, marginBottom: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: 'white' },
  headerSub: { fontSize: 13, color: '#bfdbfe', fontWeight: '500' },

  scrollContent: { padding: 25 },
  card: { backgroundColor: 'white', borderRadius: 35, padding: 25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15 },
  label: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1, marginBottom: 12 },

  roomList: { flexDirection: 'row', marginBottom: 10 },
  roomItem: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#f1f5f9', borderRadius: 15, marginRight: 10 },
  roomItemActive: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#2563eb' },
  roomText: { color: '#64748b', fontWeight: 'bold' },
  roomTextActive: { color: '#2563eb' },

  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 20 },
  inputGroup: { marginBottom: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 18, paddingHorizontal: 15, height: 60, borderWidth: 1, borderColor: '#f1f5f9' },
  input: { flex: 1, marginLeft: 12, fontSize: 18, color: '#1e293b', fontWeight: 'bold' },

  infoBox: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 15, borderRadius: 15, marginBottom: 25, alignItems: 'center' },
  infoText: { flex: 1, marginLeft: 10, fontSize: 12, color: '#64748b', lineHeight: 18 },

  actionBtn: { backgroundColor: '#2563eb', height: 65, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 8 },
  actionBtnText: { color: 'white', fontSize: 16, fontWeight: '900', marginRight: 10 }
});

export default BillManager