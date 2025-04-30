
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-banking-primary">Client Onboarding & KYC</h1>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="w-64 rounded-full bg-background pl-8"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-banking-danger text-[10px] text-white">
              3
            </span>
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-banking-primary text-primary-foreground">
              <User size={18} />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-muted-foreground">Compliance Officer</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
