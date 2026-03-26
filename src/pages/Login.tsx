import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Droplets } from "lucide-react";
import heroImage from "@/assets/hero-bike.jpg";

// 🔥 Firebase
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// ⚠️ Replace with your Firebase config
const app = initializeApp({
  apiKey: "AIzaSyXXXX",
  authDomain: "vawash.firebaseapp.com",
});

const auth = getAuth(app);

const Login = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  // 📲 Send OTP
  const sendOTP = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});

      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        recaptcha
      );

      (window as any).confirmationResult = confirmation;
      setShowOTP(true);

    } catch (err) {
      alert("Failed to send OTP ❌");
    }
  };

  // ✅ Verify OTP + Login/Signup
  const verifyOTP = async () => {
  try {
    await (window as any).confirmationResult.confirm(otp);

    const url = isLogin ? "/login" : "/signup";

    const res = await fetch(`https://vawashbackend.onrender.com${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        isLogin
          ? { phone } // ✅ login
          : { name, phone } // ✅ signup
      ),
    });

    const user = await res.json();

    // 💾 Save full user (includes name)
    localStorage.setItem("user", JSON.stringify(user));

    alert(isLogin ? `Welcome back ${user.name} 👋` : "Signup successful ✅");

    navigate("/home");

  } catch {
    alert("Invalid OTP ❌");
  }
};

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-10">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
            <Droplets className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground">VaWash</h1>
          <p className="text-sm text-primary-foreground/60">
            Premium Bike Wash Service
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm glass-card rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <div className="space-y-4">

              {/* Name (Signup only) */}
              {!isLogin && (
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}

              {/* Phone */}
              <Input
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {/* OTP */}
              {showOTP && (
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}

              {/* Button */}
              <Button
                onClick={showOTP ? verifyOTP : sendOTP}
                className="w-full gradient-primary text-white"
              >
                {showOTP ? "Verify OTP" : "Send OTP"}
              </Button>
            </div>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setShowOTP(false);
                  }}
                  className="text-primary ml-1"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 🔥 Required for Firebase */}
      <div id="recaptcha"></div>
    </div>
  );
};

export default Login;