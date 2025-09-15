import { useState } from "react"
import { NavLink, useLocation } from "react-router"
import {
  ChevronDown,
  Home,
  BarChart3,
  Database,
  Coins,
  Image,
  Shield,
  Calculator,
  MessageSquare,
  TrendingUp,
  Layers,
  Globe,
  Wallet,
  Activity
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const navigationData = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: Home,
        hasDropdown: false,
      },
    ],
  },
  {
    title: "Infrastructure",
    items: [
      {
        name: "Sui Network",
        path: "/sui",
        icon: Layers,
        hasDropdown: true,
        dataPoints: [
          { name: "Validators", path: "/sui/validators" },
          { name: "Chain Info", path: "/sui/chain-info" },
          { name: "Accounts", path: "/sui/accounts" },
          { name: "Block Production", path: "/sui/block-production" },
        ],
      },
      {
        name: "Walrus Storage",
        path: "/walrus",
        icon: Database,
        hasDropdown: true,
        dataPoints: [
          { name: "Accounts", path: "/walrus/accounts" },
          { name: "Blobs", path: "/walrus/blobs" },
          { name: "Storage Analytics", path: "/walrus/storage" },
        ],
      },
      {
        name: "DeepBook",
        path: "/deepbook",
        icon: BarChart3,
        hasDropdown: true,
        dataPoints: [
          { name: "Pools", path: "/deepbook/pools" },
          { name: "Market Summary", path: "/deepbook/market-summary" },
          { name: "Historical Volume", path: "/deepbook/historical-volume" },
          { name: "Order Books", path: "/deepbook/order-book" },
        ],
      },
      {
        name: "SuiNS",
        path: "/suins",
        icon: Globe,
        hasDropdown: true,
        dataPoints: [
          { name: "Name Resolution", path: "/suins/name-resolution" },
          { name: "Active Pricing", path: "/suins/pricing" },
          { name: "Renewals", path: "/suins/renewals" },
        ],
      },
    ],
  },
  {
    title: "Assets",
    items: [
      {
        name: "Coins",
        path: "/coins",
        icon: Coins,
        hasDropdown: true,
        dataPoints: [
          { name: "All Coins", path: "/coins/account-coins" },
          { name: "Coin Details", path: "/coins/coin-details" },
          { name: "Trending Coins", path: "/coins/prices" },
        ],
      },
      {
        name: "NFTs",
        path: "/nfts",
        icon: Image,
        hasDropdown: true,
        dataPoints: [
          { name: "Collections", path: "/nfts/collection-list" },
          { name: "Activity", path: "/nfts/activity" },
          { name: "All NFTs", path: "/nfts/account-nfts" },
          { name: "Marketplace", path: "/nfts/transfers-sales" },
        ],
      },
      {
        name: "Stablecoins",
        path: "/stablecoins",
        icon: TrendingUp,
        hasDropdown: true,
        dataPoints: [
          { name: "Supply", path: "/stablecoins/supply" },
        ],
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        name: "Finance",
        path: "/finance",
        icon: Calculator,
        hasDropdown: true,
        dataPoints: [
          { name: "Transaction Analyzer", path: "/finance/transaction-analyzer" },
        ],
      },
      {
        name: "AI Assistant",
        path: "/chatbot",
        icon: MessageSquare,
        hasDropdown: false,
      },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (itemName: string) => {
    setOpenItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isItemActive = (item: any) => {
    if (item.path === "/" && location.pathname === "/") return true
    if (item.path !== "/" && location.pathname.startsWith(item.path)) return true
    return item.dataPoints?.some((dp: any) => location.pathname === dp.path)
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Activity className="h-6 w-6" />
          <span className="font-bold text-lg">Sui Analytics</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationData.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = isItemActive(item)
                  const isOpen = openItems.includes(item.name)

                  if (!item.hasDropdown) {
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <NavLink to={item.path}>
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  }

                  return (
                    <Collapsible
                      key={item.name}
                      open={isOpen || isActive}
                      onOpenChange={() => toggleItem(item.name)}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={isActive}>
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.dataPoints?.map((dataPoint) => (
                              <SidebarMenuSubItem key={dataPoint.path}>
                                <SidebarMenuSubButton 
                                  asChild
                                  isActive={location.pathname === dataPoint.path}
                                >
                                  <NavLink to={dataPoint.path}>
                                    <span>{dataPoint.name}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground text-center">
          Built with ❤️ by Sui Analytics
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}