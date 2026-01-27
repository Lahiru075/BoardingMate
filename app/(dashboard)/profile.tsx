import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, Alert, ScrollView } from 'react-native'
import React from 'react'
import { MaterialIcons, Ionicons, FontAwesome6 } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { auth } from '@/services/firebase'
import { logout } from '@/services/auth'
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const Settings = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to exit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();

            Toast.show({
              type: 'success',
              text1: 'Logged Out',
              text2: 'See you again soon! 👋',
            });

            router.replace('/login');
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Logout Failed',
              text2: 'Could not complete the request. ❌',
            });
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* BACKGROUND DECORATIONS */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      {/* 1. HEADER (Fixed) */}
      <View style={styles.header}>
        <Text style={styles.headerTitleText}>My <Text style={{ color: '#FF5A5F' }}>Profile</Text></Text>
        <View style={styles.iconBox}>
          <Ionicons name="person" size={20} color="#FF5A5F" />
        </View>
      </View>

      {/* 2. SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* PROFILE INFO CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <FontAwesome6 name="user-tie" size={40} color="#FF5A5F" />
          </View>
          <Text style={styles.userName}>{user?.displayName || 'Landlord Name'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VERIFIED OWNER</Text>
          </View>
        </View>

        {/* SETTINGS OPTIONS (Essential only) */}
        <View style={styles.optionsContainer}>
          <SettingItem icon="notifications-none" label="App Notifications" />
          <SettingItem icon="info-outline" label="About BoardingMate" />
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="white" />
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>

      </ScrollView>
    </View>
  )
}

const SettingItem = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.itemLeft}>
      <View style={styles.itemIconBg}>
        <MaterialIcons name={icon} size={20} color="#FF5A5F" />
      </View>
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={22} color="#E0E0E0" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFDFD' },

  bgCircleTop: { position: 'absolute', top: -height * 0.05, right: -width * 0.15, width: width * 0.7, height: width * 0.7, borderRadius: width, backgroundColor: '#FFF1F1', opacity: 0.7 },
  bgCircleBottom: { position: 'absolute', bottom: -height * 0.05, left: -width * 0.15, width: width * 0.6, height: width * 0.6, borderRadius: width, backgroundColor: '#FFF1F1', opacity: 0.5 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 55, paddingBottom: 15, zIndex: 10 },
  headerTitleText: { fontSize: 22, fontWeight: '900', color: '#2D3436' },
  iconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },

  scrollContent: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 100, alignItems: 'center' },

  profileCard: {
    backgroundColor: 'white', width: '100%', borderRadius: 35, padding: 30, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.08, shadowRadius: 15,
    elevation: 8, borderWidth: 1, borderColor: '#F2F2F2', marginBottom: 25
  },
  avatarCircle: { width: 85, height: 85, borderRadius: 30, backgroundColor: '#FFF1F1', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#F2F2F2' },
  userName: { fontSize: 22, fontWeight: '900', color: '#2D3436' },
  userEmail: { fontSize: 13, color: '#A0A0A0', marginTop: 4, fontWeight: '600' },
  badge: { backgroundColor: '#FF5A5F', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, marginTop: 15 },
  badgeText: { color: 'white', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },

  optionsContainer: { width: '100%', gap: 10 },
  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'white', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#F8F8F8',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 2
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemIconBg: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFF1F1', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemLabel: { fontSize: 14, fontWeight: '700', color: '#2D3436' },

  logoutBtn: {
    backgroundColor: '#FF5A5F', width: '100%', height: 55, borderRadius: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30,
    shadowColor: '#FF5A5F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5
  },
  logoutText: { color: 'white', fontSize: 15, fontWeight: 'bold', marginLeft: 10, letterSpacing: 1 },

  versionText: { marginTop: 25, color: '#E0E0E0', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 }
});

export default Settings;