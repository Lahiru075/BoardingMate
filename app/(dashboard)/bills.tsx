import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, FontAwesome6, Ionicons } from '@expo/vector-icons'
import useLoader from '@/hooks/useLoader'
import { distributeBills } from '@/services/tenant'
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const BillManager = () => {
  const { showLoader, hideLoader } = useLoader();
  const [selectedRoom, setSelectedRoom] = useState('Room 01');
  const [totalElec, setTotalElec] = useState('');
  const [totalWater, setTotalWater] = useState('');

  const rooms = ['Room 01', 'Room 02', 'Room 03', 'Room 04', 'Room 05'];

  const handleDistribute = async () => {

    const numberRegex = /^\d+(\.\d+)?$/;

    if (!totalElec || !totalWater) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all required fields!'})
      return;
    }

    if (!numberRegex.test(totalElec) || !numberRegex.test(totalWater)) {
      Toast.show({ type: 'error', text1: 'Invalid Input', text2: 'Please enter valid numeric values only! 🔢'});
      return;
    }

    if (Number(totalElec) < 0 || Number(totalWater) < 0) {
      Toast.show({ type: 'error', text1: 'Logical Error', text2: 'Bill amounts cannot be negative values! ❌'});
      return;
    }

    showLoader();

    try {
      await distributeBills(selectedRoom, Number(totalElec), Number(totalWater));

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Bills distributed successfully! ✅',
      })

      setTotalElec('');
      setTotalWater('');
    } catch (error: any) {
      console.log(error.message)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong! ❌',
      })
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* BACKGROUND DECORATIONS (Consistent with Brand) */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      {/* 1. TOP NAVIGATION BAR */}
      <View style={styles.topBar}>
        <Text style={styles.headerTitleText}>Bill <Text style={{color: '#FF5A5F'}}>Splitter</Text></Text>
        <View style={styles.headerIconBox}>
          <FontAwesome6 name="file-invoice-dollar" size={18} color="#FF5A5F" />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.formWrapper}>
            <View style={styles.card}>
              
              {/* Card Inner Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.welcomeText}>Split Bills</Text>
                <Text style={styles.subText}>Distribute costs among room residents</Text>
              </View>

              {/* 1. SELECT ROOM */}
              <View style={styles.inputGroup}>
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
              </View>

              <View style={styles.divider} />

              {/* 2. ELECTRICITY BILL */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>TOTAL ELECTRICITY BILL (RS)</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="bolt" size={20} color="#FFD93D" />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 4500"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="numeric"
                    value={totalElec}
                    onChangeText={setTotalElec}
                  />
                </View>
              </View>

              {/* 3. WATER BILL */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>TOTAL WATER BILL (RS)</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="water" size={20} color="#3b82f6" />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 1200"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="numeric"
                    value={totalWater}
                    onChangeText={setTotalWater}
                  />
                </View>
              </View>

              {/* INFO BOX */}
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={18} color="#FF5A5F" />
                <Text style={styles.infoText}>
                  System will automatically detect residents in {selectedRoom} and split costs equally.
                </Text>
              </View>

              {/* DISTRIBUTE BUTTON */}
              <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleDistribute}>
                <Text style={styles.saveBtnText}>SPLIT & UPDATE</Text>
                <MaterialIcons name="send" size={18} color="white" />
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
  headerTitleText: { fontSize: 22, fontWeight: '900', color: '#2D3436' },
  headerIconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },

  scrollContent: { paddingBottom: 100 },

  // Form Card
  formWrapper: { paddingHorizontal: 25, marginTop: 10 },
  card: {
    backgroundColor: 'white', borderRadius: 40, paddingHorizontal: 25, paddingVertical: 35,
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.08, shadowRadius: 20,
    elevation: 10, borderWidth: 1, borderColor: '#F2F2F2',
  },
  cardHeader: { alignItems: 'center', marginBottom: 25 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#2D3436' },
  subText: { fontSize: 13, color: '#A0A0A0', marginTop: 5, textAlign: 'center' },

  // Inputs Area
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 9, fontWeight: '900', color: '#A0A0A0', letterSpacing: 1.5, marginBottom: 10, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F8FA',
    borderRadius: 15, paddingHorizontal: 15, height: 52, borderWidth: 1, borderColor: '#ECECEC'
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#2D3436', fontWeight: 'bold' },

  // Room Selector
  roomList: { flexDirection: 'row', marginBottom: 5 },
  roomItem: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: '#F7F8FA', borderRadius: 12, marginRight: 10, borderWidth: 1, borderColor: '#ECECEC' },
  roomItemActive: { backgroundColor: '#FFF1F1', borderColor: '#FF5A5F' },
  roomText: { color: '#A0A0A0', fontWeight: 'bold', fontSize: 12 },
  roomTextActive: { color: '#FF5A5F' },

  divider: { height: 1, backgroundColor: '#F7F8FA', marginVertical: 20 },

  infoBox: { flexDirection: 'row', backgroundColor: '#FFF1F1', padding: 15, borderRadius: 15, marginTop: 5, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#FFDADA' },
  infoText: { flex: 1, marginLeft: 10, fontSize: 11, color: '#FF5A5F', fontWeight: '600', lineHeight: 16 },

  // Action Button
  saveBtn: {
    backgroundColor: '#FF5A5F', flexDirection: 'row', height: 55, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
    shadowColor: '#FF5A5F', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
  },
  saveBtnText: { color: 'white', fontSize: 15, fontWeight: 'bold', letterSpacing: 1, marginRight: 10 }
});

export default BillManager;