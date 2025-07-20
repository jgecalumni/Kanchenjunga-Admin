import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hotel } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Hotel className="h-8 w-8" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
