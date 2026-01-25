import { Stack } from "expo-router";

export default function TenantsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#f8fafc' }, 
        headerTitleStyle: { fontWeight: '900', fontSize: 20, color: '#1e293b' },
        animation: 'slide_from_right',
        headerShown: false
      }}
    >
      <Stack.Screen name="index" options={{ title: 'My Tenants' }} />
      <Stack.Screen name="form" options={{ title: 'Add New Tenant' }} />
      <Stack.Screen name="[id]" options={{ title: 'Tenant Details' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Edit Tenant' }} />
    </Stack>
  );
}