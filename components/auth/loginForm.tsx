'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormStatus, loginUser } from "@/utils/api/api";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface LoginFormValues {
  email: string;
  password: string;
}


function LoginForm() {

  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [formStatus,setFormStatus] = useState<FormStatus>({
    pending: false,
    submitting: false,
  }) 
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    loginUser(formValues.email, formValues.password, setFormStatus, setError)
      .then((response) => {
        console.log("Login successful:", response);
        // Handle successful login (e.g., redirect, show success message)
      });
  };

  return (
    <div
      className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0  bg-no-repeat bg-cover relative bg-black/90"
    >
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100 my-2"
        style={{
          backgroundImage:
            "url('/assets/illustrations/Creative_thinking-bro.png')",
        }}
      ></div>
      <div className="w-full z-20 bg-cover bg-center bg-no-repeat">
        {/* <Image
          src="/assets/auth/logo.png"
          alt="Vortex Logo"
          width={200}
          height={200}
          className="mx-auto"
          style={{ filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))" }}
        /> */}
        <div className="items-center justify-center flex flex-col">
          <Card className="isolate aspect-video rounded-xl bg-black/40 ring-1 ring-black/5 backdrop-blur-md hover:scale-105 transition-transform duration-300 w-[90%] font-sans">
            <CardHeader className={`text-center text-purple-400`}>
              <div className="text-3xl font-semibold"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >Welcome Back !!!</div>
            </CardHeader>
            <CardContent className="px-6">
              <form action={handleSubmit} className="flex flex-col">
                <Label htmlFor="email" className="text-left text-gray-200" 
                  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setFormValues({ ...formValues, email: e.target.value })
                  }
                  value={formValues.email}
                  required

                  className={`mt-2 mb-4 border-white placeholder:text-stone-200 placeholder:font-light text-purple-100 ${error ? "focus-visible:ring-red-500 ring-1 ring-red-500" : "focus-visible:ring-cyan-100"}`}
                />
                <Label htmlFor="password" className="text-left text-gray-200"
                  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setFormValues({ ...formValues, password: (e.target.value) })
                  }
                  value={formValues.password}
                  required
                  className={`mt-2 mb-2 border-white placeholder:text-stone-200 placeholder:font-light text-purple-100 ${error ? "focus-visible:ring-red-500 ring-1 ring-red-500" : "focus-visible:ring-cyan-100"}`}
                />
                {error && (
                  <p className="text-red-800 text-xl text-center"
                    style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                  >
                    {error}
                  </p>
                )}
                <Button type="submit" className="w-full mt-2 cursor-pointer" variant={"secondary"}>
                  {formStatus.submitting ? <Loader2 className="animate-spin"/> : "Sign In"}
                </Button>
              </form>
              <p className="text-white mt-4 flex items-center justify-center gap-2">
                Don&apos;t have an account?{" "}
                <a href="/auth/sign-up" className="text-blue-400 hover:underline"
                  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
                  Sign Up
                </a>
              </p>
              <p className="text-white mt-2">
                <a href="#" className="text-blue-400 hover:underline">
                  Forgot Password?
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
