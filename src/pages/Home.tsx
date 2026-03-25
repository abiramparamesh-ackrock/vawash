import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Droplets, Sparkles, Shield, Zap, ChevronRight, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";

import { useEffect } from "react";



const washPackages = [
  {
    id: 1,
    name: "Basic Wash",
    price: 199,
    duration: "20 min",
    icon: Droplets,
    features: ["Exterior wash", "Rinse & dry", "Tire cleaning"],
    popular: false,
  },
  {
    id: 2,
    name: "Premium Wash",
    price: 399,
    duration: "40 min",
    icon: Sparkles,
    features: ["Full exterior", "Interior vacuum", "Chain lube", "Polish"],
    popular: true,
  },
  {
    id: 3,
    name: "Ultimate Detail",
    price: 699,
    duration: "60 min",
    icon: Shield,
    features: ["Complete detailing", "Wax coating", "Engine clean", "Scratch removal"],
    popular: false,
  },
];

const Home = () => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const { toast } = useToast();
  const [manualLocation, setManualLocation] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [location, setLocation] = useState("Detecting...");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
const [partnerCoords, setPartnerCoords] = useState(null);


useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch("http://localhost:5000/partner-location");
    const data = await res.json();
    setPartnerCoords(data);
  }, 5000);

  return () => clearInterval(interval);
}, []);



// const openMap = () => {
//   const finalLocation = manualLocation || location;

//   if (!finalLocation || finalLocation === "Detecting...") return;

//   const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(finalLocation)}`;
//   window.open(url, "_blank");
// };
const openMap = () => {
  // ✅ If GPS available → use exact pin
  if (coords) {
    const url = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    window.open(url, "_blank");
    return;
  }

  // ✅ Fallback → manual or detected name
  const finalLocation = manualLocation || location;

  if (!finalLocation || finalLocation === "Detecting...") return;

  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(finalLocation)}`;
  window.open(url, "_blank");
};


useEffect(() => {
  if (!navigator.geolocation) {
    setLocation("Not supported");
    setShowManualInput(true);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      setCoords({
  lat: latitude,
  lng: longitude,
});
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();

        const place =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.state;

        setLocation(place || "Unknown");
      } catch {
        setLocation("Error");
        setShowManualInput(true);
      }
    },
    () => {
      setLocation("Permission denied");
      setShowManualInput(true); // 👈 IMPORTANT
    }
  );
}, []);


const handleBook = async () => {
  if (!selectedPackage) {
    toast({ title: "Select a package", description: "Please choose a wash package first." });
    return;
  }

  const pkg = washPackages.find((p) => p.id === selectedPackage);
  const finalLocation = manualLocation || location;


  try {
    await fetch("http://localhost:5000/create-ride", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        packageName: pkg?.name,
        price: pkg?.price,
        location: finalLocation,
        lat: coords?.lat,
        lng: coords?.lng,
      }),
    });

    toast({
      title: "Booking Sent 🚀",
      description: `${pkg?.name} request sent to partner.`,
    });

    setSelectedPackage(null);
  } catch (error) {
    toast({
      title: "Error",
      description: "Backend not running!",
    });
  }
};

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/70 text-sm font-body">VaWash</p>
            <h1 className="text-2xl font-display font-bold text-primary-foreground">
              Book a Wash
            </h1>
          </div>
<button
  onClick={() => {
    if (partnerCoords) {
      const url = `https://www.google.com/maps?q=${partnerCoords.lat},${partnerCoords.lng}`;
      window.open(url, "_blank");
    }
  }}
  className="absolute top-14 right-16 px-4 py-2 rounded-full text-sm font-display font-semibold 
             gradient-primary text-primary-foreground shadow-lg 
             hover:opacity-90 transition-all flex items-center gap-2"
>
  Track Partner
</button>
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>

        {/* Location Pill */}
        <div className="flex flex-col gap-2">
  {/* Location Pill */}
<div
  onClick={openMap}
  className="flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2.5 backdrop-blur-sm cursor-pointer hover:bg-primary-foreground/20 transition"
> 
    <MapPin className="w-4 h-4 text-primary-foreground/80" />
    
    <span className="text-sm text-primary-foreground/90 flex-1">
      {location}
    </span>

    <ChevronRight className="w-4 h-4 text-primary-foreground/60" />
  </div>

  {/* Manual Input */}
  {showManualInput && (
    <input
      type="text"
      placeholder="Enter your location manually"
      value={manualLocation}
onChange={(e) => {
  setManualLocation(e.target.value);
  setLocation(e.target.value);
}}
 onBlur={() => {
    if (manualLocation) {
      setShowManualInput(false);
    }
  }}
  className="w-full px-4 py-2 rounded-lg text-sm border border-border outline-none"
    />
  )}
</div>


        
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-4">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-around shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary font-display font-bold text-lg">
              <Zap className="w-4 h-4" />
              15min
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Avg. Wait</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-primary font-display font-bold text-lg">4.9★</p>
            <p className="text-xs text-muted-foreground mt-0.5">Rating</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-primary font-display font-bold text-lg">2K+</p>
            <p className="text-xs text-muted-foreground mt-0.5">Washes</p>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          Choose Package
        </h2>
        <div className="space-y-3">
          {washPackages.map((pkg) => {
            const Icon = pkg.icon;
            const isSelected = selectedPackage === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`w-full text-left rounded-2xl p-4 transition-all duration-200 relative ${
                  isSelected
                    ? "gradient-primary text-primary-foreground shadow-lg scale-[1.02]"
                    : "bg-card border border-border hover:border-primary/40 hover:shadow-md"
                }`}
              >
                {pkg.popular && (
                  <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                    isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-accent/10 text-accent"
                  }`}>
                    POPULAR
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-primary-foreground/20" : "bg-primary/10"
                  }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-semibold">{pkg.name}</h3>
                      <span className="font-display font-bold text-lg">₹{pkg.price}</span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {pkg.duration} • {pkg.features.length} services
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {pkg.features.map((f) => (
                        <span
                          key={f}
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-primary-foreground/15 text-primary-foreground/90"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Book Button */}
      <div className="px-6 mt-6">
        <Button
          onClick={handleBook}
          className="w-full gradient-primary text-primary-foreground font-display font-semibold h-14 rounded-2xl text-base shadow-lg hover:opacity-90 transition-opacity"
        >
          {selectedPackage
            ? `Book Now — ₹${washPackages.find((p) => p.id === selectedPackage)?.price}`
            : "Select a Package"}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;

