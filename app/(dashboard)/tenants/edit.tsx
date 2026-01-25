import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, Alert, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import useLoader from '@/hooks/useLoader'
import { getTenantById, updateTenant } from '@/services/tenant'

const EditTenant = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { showLoader, hideLoader } = useLoader();

    // States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [roomNo, setRoomNo] = useState('');
    const [rent, setRent] = useState('');
    const [keyMoney, setKeyMoney] = useState('');
    const [isKeyMoneyPaid, setIsKeyMoneyPaid] = useState(false);

    const rooms = ['Room 01', 'Room 02', 'Room 03', 'Room 04', 'Room 05'];

    useEffect(() => {
        const loadData = async () => {
            showLoader();
            try {
                const data = await getTenantById(id as string);
                console.log(data)
                if (data) {
                    setName(data.name);
                    setPhone(data.phone);
                    setRoomNo(data.roomNo);
                    setRent(data.rentAmount.toString());
                    setKeyMoney(data.keyMoneyAmount.toString());
                    setIsKeyMoneyPaid(data.isKeyMoneyPaid);
                }
            } catch (error) {
                Alert.alert("Error", "Failed to load tenant data. " + id as string);
            } finally {
                hideLoader();
            }
        };
        loadData();
    }, [id]);

    const handleUpdate = async () => {
        if (!name || !phone || !rent) {
            Alert.alert("Missing Details", "Full name, phone number and rent are required.");
            return;
        }

        showLoader();
        try {

            await updateTenant(id as string, {
                name,
                phone,
                roomNo,
                rentAmount: Number(rent),
                keyMoneyAmount: Number(keyMoney),
                isKeyMoneyPaid,
            });

            Alert.alert("Success", "Details updated successfully!");
            router.back();
        } catch (error) {
            Alert.alert("Error", "Update failed.");
        } finally {
            hideLoader();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.headerIconBox}>
                        <FontAwesome6 name="user-pen" size={18} color="white" />
                    </View>
                </View>
                <Text style={styles.headerTitle}>Edit Details</Text>
                <Text style={styles.headerSub}>Update information for {name}</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={styles.formScroll}>

                    <View style={styles.formCard}>

                        <Text style={styles.sectionTitle}>Update Information</Text>

                        {/* Name Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>FULL NAME</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="person" size={20} color="#94a3b8" />
                                <TextInput style={styles.input} value={name} onChangeText={setName} />
                            </View>
                        </View>

                        {/* Phone Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PHONE NUMBER</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="phone" size={20} color="#94a3b8" />
                                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                            </View>
                        </View>

                        {/* Room Selection */}
                        <Text style={styles.label}>SELECT ROOM</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomList}>
                            {rooms.map((r) => (
                                <TouchableOpacity key={r} onPress={() => setRoomNo(r)} style={[styles.roomItem, roomNo === r && styles.roomItemActive]}>
                                    <Text style={[styles.roomText, roomNo === r && styles.roomTextActive]}>{r}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Rent Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>MONTHLY RENT (RS)</Text>
                            <View style={styles.inputWrapper}>
                                <FontAwesome6 name="money-bill-1" size={18} color="#94a3b8" />
                                <TextInput style={styles.input} value={rent} onChangeText={setRent} keyboardType="numeric" />
                            </View>
                        </View>

                        {/* Key Money Toggle */}
                        <View style={styles.switchRow}>
                            <View>
                                <Text style={styles.switchTitle}>Key Money Paid</Text>
                            </View>
                            <Switch value={isKeyMoneyPaid} onValueChange={setIsKeyMoneyPaid} />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                        <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
                        <MaterialIcons name="check-circle" size={22} color="white" />
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { backgroundColor: '#2563eb', paddingTop: 60, paddingBottom: 60, paddingHorizontal: 25, borderBottomLeftRadius: 45, borderBottomRightRadius: 45 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    backBtn: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 14 },
    headerIconBox: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 14 },
    headerTitle: { color: 'white', fontSize: 28, fontWeight: '900' },
    headerSub: { color: '#bfdbfe', fontSize: 13, fontWeight: '500', marginTop: 5 },
    formScroll: { flex: 1, marginTop: -40 },
    scrollContent: { paddingHorizontal: 25, paddingBottom: 50 },
    formCard: { backgroundColor: 'white', borderRadius: 35, padding: 25, elevation: 10 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
    inputGroup: { marginBottom: 18 },
    label: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1, marginBottom: 8 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 18, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#f1f5f9' },
    input: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1e293b', fontWeight: '600' },
    roomList: { flexDirection: 'row', marginBottom: 20 },
    roomItem: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#f1f5f9', borderRadius: 15, marginRight: 10 },
    roomItemActive: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#2563eb' },
    roomText: { color: '#64748b', fontWeight: 'bold', fontSize: 13 },
    roomTextActive: { color: '#2563eb' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    switchTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
    saveBtn: { backgroundColor: '#2563eb', flexDirection: 'row', height: 65, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginTop: 25 },
    saveBtnText: { color: 'white', fontSize: 16, fontWeight: '900', marginRight: 10 }
});

export default EditTenant