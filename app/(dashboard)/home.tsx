import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Alert } from 'react-native'
import React, { useState, useCallback } from 'react' // useState සහ useCallback එකතු කළා
import { MaterialIcons, FontAwesome6, Feather, Ionicons } from '@expo/vector-icons'
import { auth } from '@/services/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router'; // useFocusEffect එකතු කළා
import { logout } from '@/services/auth';
import { getAllTenantsByUserId } from '@/services/tenant'; // Service එක import කරගන්න

const { width, height } = Dimensions.get('window');

const Home = () => {
  const user = auth.currentUser;
  const router = useRouter();

  const [stats, setStats] = useState({
    totalTenants: 0,
    expectedIncome: 0,
    pendingAmount: 0,
    pendingCount: 0
  });

  const fetchAndCalculateStats = async () => {
    try {
      const data = await getAllTenantsByUserId();

      let totalTenants = data.length;
      let rentOnlyIncome = 0;
      let unpaidTotalAmount = 0;
      let unpaidCount = 0;

      const now = new Date();
      const currentMonthStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

      data.forEach((item: any) => {
        const rent = Number(item.rentAmount) || 0;
        const elec = Number(item.electricityShare) || 0;
        const water = Number(item.waterShare) || 0;

        rentOnlyIncome += rent;

        const hasPaidThisMonth = (item.lastPaidMonth === currentMonthStr);

        if (!hasPaidThisMonth) {
          unpaidCount += 1;
          unpaidTotalAmount += (rent + elec + water);
        }
      });

      setStats({
        totalTenants,
        expectedIncome: rentOnlyIncome,
        pendingAmount: unpaidTotalAmount,
        pendingCount: unpaidCount
      });

    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // refresh stats 
  useFocusEffect(
    useCallback(() => {
      fetchAndCalculateStats();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error("Logout error", error);
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* BACKGROUND DECORATIONS */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >

        {/* 2. TOP NAVIGATION BAR */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brandTitle}>
              Boarding<Text style={{ color: '#FF5A5F' }}>Mate</Text>
            </Text>
            <Text style={styles.brandSub}>SMART PROPERTY MANAGEMENT</Text>
          </View>
          <View style={styles.topIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="bell" size={20} color="#2D3436" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.profileCircle}>
              <FontAwesome6 name="user-tie" size={18} color="#FF5A5F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. WELCOME SECTION */}
        <View style={styles.greetingSection}>
          <Text style={styles.welcomeText}>{getGreeting()},</Text>
          <Text style={styles.nameText}>Mr. {user?.displayName || 'Landlord'} 👋</Text>
        </View>

        {/* 4. REVENUE HERO CARD - Updated with Live Data */}
        <View style={styles.mainCardContainer}>
          <LinearGradient
            colors={['#FF5A5F', '#FF7E82']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainCard}
          >
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            <View style={styles.cardHeader}>
              <Text style={styles.mainCardLabel}>Total Expected Revenue</Text>
              <TouchableOpacity onPress={fetchAndCalculateStats}>
                <MaterialIcons name="refresh" size={22} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>

            <Text style={styles.mainCardValue}>Rs. {stats.expectedIncome.toLocaleString()}</Text>

            <View style={styles.mainCardFooter}>
              <View style={styles.growthBadge}>
                <MaterialIcons name="trending-up" size={14} color="#FF5A5F" />
                <Text style={styles.growthText}>Active Status</Text>
              </View>
              <Text style={styles.updateText}>Live Syncing...</Text>
            </View>
          </LinearGradient>
        </View>

        {/* 5. QUICK STATS ROW - Updated with Live Data */}
        <View style={styles.statsRow}>
          <StatCard icon="people" color="#FF5A5F" val={stats.totalTenants.toString()} label="Tenants" />
          <StatCard icon="door-open" color="#FF5A5F" val="05" label="Rooms" isFA6 />
        </View>

        {/* 6. URGENT ALERTS - Updated with Live Data */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Urgent Alerts</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.alertCard} onPress={() => router.push('/(dashboard)/tenants')}>
          <View style={styles.alertContent}>
            <View style={styles.alertIconBg}>
              <Ionicons name="warning" size={22} color="#FF5A5F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertMainText}>Rs. {stats.pendingAmount.toLocaleString()} Unpaid</Text>
              <Text style={styles.alertSubText}>{stats.pendingCount} tenants pending payment</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A0A0A0" />
          </View>
        </TouchableOpacity>

        {/* 7. QUICK ACTIONS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Management</Text>
        </View>

        <View style={styles.actionGrid}>
          <ActionItem
            icon="person-add"
            color="#FF5A5F"
            text="Add Tenant"
            onPress={() => router.push('/(dashboard)/tenants/form')}
          />
          <ActionItem
            icon="receipt"
            color="#FF5A5F"
            text="Split Bills"
            onPress={() => router.push('/(dashboard)/bills')}
          />
          <ActionItem
            icon="groups"
            color="#FF5A5F"
            text="Tenants"
            onPress={() => router.push('/(dashboard)/tenants')}
          />
        </View>

      </ScrollView>
    </View>
  )
}

// Sub-components
const StatCard = ({ icon, color, val, label, isFA6 }: any) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconBox, { backgroundColor: '#FFF1F1' }]}>
      {isFA6 ? <FontAwesome6 name={icon} size={18} color={color} /> : <Ionicons name={icon} size={22} color={color} />}
    </View>
    <View>
      <Text style={styles.statValue}>{val}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const ActionItem = ({ icon, color, text, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.actionBtn}>
    <View style={[styles.actionIcon, { backgroundColor: '#FFF1F1' }]}>
      <MaterialIcons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.actionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFDFD', overflow: 'hidden' },
  bgCircleTop: { position: 'absolute', top: -height * 0.05, right: -width * 0.2, width: width * 0.8, height: width * 0.8, borderRadius: width, backgroundColor: '#FFF1F1', opacity: 0.6 },
  bgCircleBottom: { position: 'absolute', bottom: -height * 0.1, left: -width * 0.2, width: width * 0.9, height: width * 0.9, borderRadius: width, backgroundColor: '#FFF1F1', opacity: 0.5 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 50 },
  brandTitle: { fontSize: 24, fontWeight: '900', color: '#2D3436' },
  brandSub: { fontSize: 8, color: '#A0A0A0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 },
  topIcons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginRight: 15 },
  profileCircle: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#F2F2F2' },
  greetingSection: { paddingHorizontal: 25, paddingTop: 30, paddingBottom: 20 },
  welcomeText: { color: '#A0A0A0', fontSize: 16, fontWeight: '500' },
  nameText: { color: '#2D3436', fontSize: 28, fontWeight: '900', marginTop: 2 },
  mainCardContainer: { paddingHorizontal: 25, marginBottom: 25 },
  mainCard: { padding: 25, borderRadius: 35, elevation: 8, shadowColor: '#FF5A5F', shadowOpacity: 0.2, shadowRadius: 15, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mainCardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5 },
  mainCardValue: { color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 10 },
  mainCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 },
  growthBadge: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  growthText: { color: '#FF5A5F', fontWeight: '800', fontSize: 12, marginLeft: 5 },
  updateText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },
  circle1: { position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.08)' },
  circle2: { position: 'absolute', bottom: -20, left: -20, width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.08)' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 25, justifyContent: 'space-between', marginBottom: 30 },
  statCard: { backgroundColor: '#fff', width: (width - 65) / 2, padding: 18, borderRadius: 30, flexDirection: 'row', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#F2F2F2' },
  statIconBox: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  statValue: { fontSize: 20, fontWeight: '900', color: '#2D3436' },
  statLabel: { fontSize: 11, color: '#A0A0A0', fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#2D3436' },
  alertCard: { marginHorizontal: 25, backgroundColor: '#fff', borderRadius: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.05, shadowRadius: 10, marginBottom: 30, borderWidth: 1, borderColor: '#F2F2F2', overflow: 'hidden' },
  alertContent: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 18 },
  alertIconBg: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FFF1F1', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  alertMainText: { fontSize: 16, fontWeight: '800', color: '#2D3436' },
  alertSubText: { fontSize: 12, color: '#A0A0A0', fontWeight: '600', marginTop: 2 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25 },
  actionBtn: { backgroundColor: 'white', width: (width - 80) / 3, padding: 18, borderRadius: 25, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#F2F2F2' },
  actionIcon: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionText: { fontSize: 11, fontWeight: '800', color: '#2D3436' }
});

export default Home;