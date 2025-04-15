import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { verifyCredentials, getUserByPhone, storeOTP, getAllUsers } from "@/lib/mysql";
import { generateOTP, sendSmsOTP, getOTPExpiration } from "@/lib/otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const emailFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const phoneFormSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
});

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [expectedOtp, setExpectedOtp] = useState("");
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [debugMode, setDebugMode] = useState(false);

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onEmailSubmit = async (values: z.infer<typeof emailFormSchema>) => {
    try {
      const allUsers = await getAllUsers();
      console.log("All users in database:", allUsers);
      
      const user = await verifyCredentials(values.email, values.password);
      
      if (user) {
        setUser({
          id: user.id,
          name: user.username,
          email: values.email,
        });
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Invalid credentials",
          description: "Email or password is incorrect. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
    }
  };

  const onPhoneSubmit = async (values: z.infer<typeof phoneFormSchema>) => {
    try {
      setOtpSending(true);
      
      const user = await getUserByPhone(values.phone);
      if (!user) {
        toast({
          variant: "destructive",
          title: "Account not found",
          description: "No account found with this phone number. Please sign up first.",
        });
        setOtpSending(false);
        return;
      }
      
      setTempPhoneNumber(values.phone);
      
      const newOtp = generateOTP();
      console.log("Generated phone OTP:", newOtp);
      setExpectedOtp(newOtp);
      
      const expirationTime = getOTPExpiration();
      await storeOTP(user.id, values.phone, newOtp, expirationTime);
      
      await sendSmsOTP(values.phone, newOtp);
      
      setIsOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${values.phone}`,
      });
      
      setCountdown(30);
    } catch (error: any) {
      console.error("Phone verification error:", error);
      toast({
        variant: "destructive",
        title: "OTP sending failed",
        description: error.message || "Failed to send OTP. Please try again.",
      });
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      console.log("Entered OTP:", otp);
      console.log("Expected OTP:", expectedOtp);
      
      if (otp === expectedOtp) {
        const user = await getUserByPhone(tempPhoneNumber);
        if (user) {
          setUser({
            id: user.id,
            name: user.username,
            phone: tempPhoneNumber,
          });
          
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          navigate("/dashboard");
        } else {
          toast({
            variant: "destructive",
            title: "Account error",
            description: "User account not found. Please try again or sign up.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Invalid OTP",
          description: "The verification code you entered is incorrect. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message || "Failed to verify OTP. Please try again.",
      });
    }
  };

  const resendOtp = async () => {
    if (!tempPhoneNumber) return;
    
    setOtpSending(true);
    try {
      const newOtp = generateOTP();
      setExpectedOtp(newOtp);
      
      const user = await getUserByPhone(tempPhoneNumber);
      if (!user) {
        throw new Error("User not found");
      }
      
      const expirationTime = getOTPExpiration();
      await storeOTP(user.id, tempPhoneNumber, newOtp, expirationTime);
      
      await sendSmsOTP(tempPhoneNumber, newOtp);
      
      toast({
        title: "OTP Resent",
        description: `We've sent a new verification code to ${tempPhoneNumber}`,
      });
      
      setCountdown(30);
    } catch (error: any) {
      console.error("OTP resend error:", error);
      toast({
        variant: "destructive",
        title: "OTP resend failed",
        description: error.message || "Failed to resend OTP. Please try again.",
      });
    } finally {
      setOtpSending(false);
    }
  };

  const [keyPresses, setKeyPresses] = useState<number>(0);
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd') {
        setKeyPresses(prev => {
          const newCount = prev + 1;
          if (newCount === 3) {
            setDebugMode(!debugMode);
            return 0;
          }
          return newCount;
        });
        
        setTimeout(() => setKeyPresses(0), 1000);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [debugMode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md hover-lift">
        <CardHeader>
          <CardTitle>Login {debugMode && "(Debug Mode)"}</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" onValueChange={(value) => setLoginMethod(value as "email" | "phone")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="hover:bg-purple-100">Email</TabsTrigger>
              <TabsTrigger value="phone" className="hover:bg-purple-100">Phone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            placeholder="Enter your email"
                            className="border-2 focus:border-purple-500" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="border-2 focus:border-purple-500 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full hover:bg-purple-100">
                    Login with Email
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="phone">
              {!isOtpSent ? (
                <Form {...phoneForm}>
                  <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                    <FormField
                      control={phoneForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="tel" 
                              placeholder="Enter your phone number"
                              className="border-2 focus:border-purple-500" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full hover:bg-purple-100"
                      disabled={otpSending}
                    >
                      {otpSending ? "Sending..." : "Send OTP"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <p className="text-center mb-4">
                    Enter the verification code sent to {tempPhoneNumber}
                  </p>
                  
                  <div className="p-3 mb-4 bg-orange-100 text-orange-800 rounded-md text-sm">
                    For demo purposes, the verification code is: <span className="font-bold">{expectedOtp}</span>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} {...slot} index={index} />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                  </div>
                  
                  {debugMode && (
                    <div className="mb-2 text-xs text-gray-500">
                      <p>Debug: Input component loaded, current OTP value: "{otp}"</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleVerifyOtp} 
                    className="w-full hover:bg-purple-100"
                    disabled={otp.length !== 6}
                  >
                    Verify OTP
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={resendOtp}
                      disabled={countdown > 0 || otpSending}
                    >
                      {countdown > 0 
                        ? `Resend in ${countdown}s` 
                        : otpSending 
                          ? "Sending..." 
                          : "Resend"}
                    </button>
                  </div>
                  
                  <div className="text-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsOtpSent(false)}
                      className="text-sm"
                    >
                      Go Back
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link
                to="/signup"
                className="text-primary hover:underline hover-lift inline-block"
              >
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
