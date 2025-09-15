import React from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useLocation } from "react-router"

interface AppLayoutProps {
  children: React.ReactNode
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = [{ name: 'Dashboard', path: '/' }]
  
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    breadcrumbs.push({ name, path: currentPath })
  })
  
  return breadcrumbs
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(location.pathname)

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.path}>{crumb.name}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}