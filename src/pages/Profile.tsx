import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bike,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

const menuItems = [
  { icon: Bike, label: "My Vehicles", desc: "Manage your bikes" },
  { icon: CreditCard, label: "Payment Methods", desc: "Cards & wallets" },
  { icon: Bell, label: "Notifications", desc: "Alerts & reminders" },
  { icon: HelpCircle, label: "Help & Support", desc: "FAQs & contact" },
];

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-10 rounded-b-3xl">
        <h1 className="text-xl font-display font-bold text-primary-foreground mb-6">Profile</h1>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-primary-foreground">
              John Doe
            </h2>
            <p className="text-sm text-primary-foreground/70">Premium Member</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="px-6 -mt-5">
        <div className="glass-card rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">john@example.com</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">+91 98765 43210</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Bangalore, India</span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 mt-6 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="px-6 mt-6">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="w-full h-12 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/5 font-semibold"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
