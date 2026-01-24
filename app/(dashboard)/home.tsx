import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native'
import React from 'react'
import { MaterialIcons, FontAwesome6, Feather, Ionicons } from '@expo/vector-icons'
import { auth } from '@/services/firebase';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Home = () => {
  const user = auth.currentUser;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. BLUE HEADER OVERLAY */}
      <View style={styles.topHeaderBg} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >

        {/* 2. TOP NAVIGATION BAR */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brandText}>BoardingMate</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN PANEL</Text>
            </View>
          </View>
          <View style={styles.topIcons}>
            <TouchableOpacity style={styles.glassBtn}>
              <Feather name="search" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileCircle}>
              <FontAwesome6 name="user-tie" size={20} color="#2563eb" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. WELCOME SECTION */}
        <View style={styles.greetingSection}>
          <Text style={styles.welcomeText}>Good Morning,</Text>
          <Text style={styles.nameText}>Mr. {user?.displayName || 'Landlord'} 👋</Text>
        </View>

        {/* 4. REVENUE HERO CARD (Slate Gradient Focus) */}
        <View style={styles.mainCardContainer}>
          <LinearGradient
            colors={['#1e293b', '#334155']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainCard}
          >
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            <View style={styles.cardHeader}>
              <Text style={styles.mainCardLabel}>Total Expected Revenue</Text>
              <TouchableOpacity>
                <MaterialIcons name="more-horiz" size={24} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            </View>

            <Text style={styles.mainCardValue}>Rs. 85,000</Text>

            <View style={styles.mainCardFooter}>
              <View style={styles.growthBadge}>
                <MaterialIcons name="trending-up" size={14} color="#fff" />
                <Text style={styles.growthText}>+12.5%</Text>
              </View>
              <Text style={styles.updateText}>Last Update: 2m ago</Text>
            </View>
          </LinearGradient>
        </View>

        {/* 5. QUICK STATS ROW */}
        <View style={styles.statsRow}>
          <StatCard icon="people" color="#2563eb" val="12" label="Tenants" />
          <StatCard icon="door-open" color="#7c3aed" val="08" label="Rooms" isFA6 />
        </View>

        {/* 6. URGENT ALERTS (Enhanced UX) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Urgent Alerts</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.alertCard}>
          <View style={styles.alertIndicator} />
          <View style={styles.alertContent}>
            <View style={styles.alertIconBg}>
              <Ionicons name="warning" size={22} color="#e11d48" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertMainText}>Rs. 12,500.00 Unpaid</Text>
              <Text style={styles.alertSubText}>Pending for January 2026</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </View>
        </TouchableOpacity>

        {/* 7. QUICK ACTIONS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Management</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
        </View>

        <View style={styles.actionGrid}>
          <ActionItem icon="person-add" color="#10b981" text="Add Tenant" />
          <ActionItem icon="receipt" color="#f59e0b" text="Split Bills" />
          <ActionItem icon="groups" color="#3b82f6" text="All Tenants" />
        </View>

      </ScrollView>
    </View>
  )
}

// Sub-components for cleaner code
const StatCard = ({ icon, color, val, label, isFA6 }: any) => (
  <TouchableOpacity style={styles.statCard}>
    <View style={[styles.statIconBox, { backgroundColor: color + '15' }]}>
      {isFA6 ? <FontAwesome6 name={icon} size={18} color={color} /> : <Ionicons name={icon} size={22} color={color} />}
    </View>
    <View>
      <Text style={styles.statValue}>{val}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </TouchableOpacity>
);

const ActionItem = ({ icon, color, text }: any) => (
  <TouchableOpacity style={styles.actionBtn}>
    <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
      <MaterialIcons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.actionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  topHeaderBg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 300,
    backgroundColor: '#2563eb',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 55 },
  brandText: { color: 'white', fontSize: 22, fontWeight: '900', letterSpacing: 0.5 },
  adminBadge: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 2 },
  adminBadgeText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  topIcons: { flexDirection: 'row', alignItems: 'center' },
  glassBtn: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 14, marginRight: 12 },
  profileCircle: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1 },
  greetingSection: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 20 },
  welcomeText: { color: '#bfdbfe', fontSize: 16, fontWeight: '500' },
  nameText: { color: 'white', fontSize: 30, fontWeight: '900', marginTop: 4 },
  mainCardContainer: { paddingHorizontal: 24, marginBottom: 25 },
  mainCard: { padding: 25, borderRadius: 40, elevation: 20, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mainCardLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5 },
  mainCardValue: { color: '#fff', fontSize: 38, fontWeight: '900', marginTop: 12 },
  mainCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 },
  growthBadge: { backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  growthText: { color: 'white', fontWeight: '800', fontSize: 12, marginLeft: 5 },
  updateText: { color: '#64748b', fontSize: 11, fontWeight: '700' },
  circle1: { position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.03)' },
  circle2: { position: 'absolute', bottom: -20, left: -20, width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.03)' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 24, justifyContent: 'space-between', marginBottom: 30 },
  statCard: { backgroundColor: '#fff', width: (width - 64) / 2, padding: 18, borderRadius: 28, flexDirection: 'row', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.05 },
  statIconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  statValue: { fontSize: 22, fontWeight: '900', color: '#1e293b' },
  statLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 15 },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: '#1e293b' },
  viewAllText: { color: '#2563eb', fontWeight: 'bold', fontSize: 14 },
  alertCard: { marginHorizontal: 24, backgroundColor: '#fff', borderRadius: 24, flexDirection: 'row', overflow: 'hidden', elevation: 10, shadowColor: '#e11d48', shadowOpacity: 0.08, marginBottom: 30, borderWidth: 1, borderColor: '#f1f5f9' },
  alertIndicator: { width: 6, backgroundColor: '#e11d48' },
  alertContent: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 18 },
  alertIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff1f2', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  alertMainText: { fontSize: 16, fontWeight: '900', color: '#0f172a' },
  alertSubText: { fontSize: 12, color: '#94a3b8', fontWeight: '600', marginTop: 2 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24 },
  actionBtn: { backgroundColor: 'white', width: (width - 80) / 3, padding: 18, borderRadius: 28, alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.05 },
  actionIcon: { width: 54, height: 54, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionText: { fontSize: 12, fontWeight: '800', color: '#475569' }
});

export default Home;