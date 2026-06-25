import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplets, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-white px-4">
      <Droplets className="h-16 w-16 text-primary fill-primary/20 mb-4 animate-pulse" />
      <h1 className="text-7xl font-black text-primary mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
      </p>
      <Button asChild size="lg">
        <Link to="/"><Home className="mr-2 h-4 w-4" />Back to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
