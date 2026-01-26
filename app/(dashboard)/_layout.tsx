import { Tabs } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"

const tabs = [
  { name: "home", icon: "dashboard", title: "Home" },
  { name: "tenants", icon: "people", title: "Tenants" },
  { name: "bills", icon: "receipt-long", title: "Bills" }, 
  { name: "profile", icon: "person", title: "Settings" },
] as const

const DashboardLayout = () => {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#FF5A5F', 
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
            paddingBottom: 5,
            height: 60,
        }
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={tab.icon as any} size={28} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}

export default DashboardLayout