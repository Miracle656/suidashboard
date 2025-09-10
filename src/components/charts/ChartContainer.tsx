import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ChartContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  loading?: boolean
  error?: string
  className?: string
}

export function ChartContainer({
  title,
  description,
  children,
  loading,
  error,
  className
}: ChartContainerProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>Error loading chart: {error}</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}