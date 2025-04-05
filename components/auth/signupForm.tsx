'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/utils/api/api";
import { Loader } from "lucide-react";
import Image from "next/image";
import { use, useState } from "react";

interface SignUpFormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username: string;
  password_confirmation: string;
}

function SignupForm() {

  const [error, setError] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState({
    pending: false,
    submitting: false,
  });
  const [formValues, setFormValues] = useState<SignUpFormValues>({
    first_name: "",
    email: "",
    password: "",
    last_name: "",
    username: "",
    password_confirmation: "",
  });
  const handleSubmit = () => {
    registerUser(
      formValues.email,
      formValues.password,
      formValues.first_name,
      formValues.last_name,
      formValues.username,
      formValues.password_confirmation,
      setFormStatus,
      setError
    )
      .then((response) => {
        console.log("Registration successful:", response);
        // Handle successful registration (e.g., redirect, show success message)
      }
      )
  }

  return (
    <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-no-repeat bg-cover relative bg-black/90">
      <div
        className="absolute inset-0 z-2 bg-cover bg-center bg-no-repeat opacity-100 my-2"
        style={{ backgroundImage: "url('/assets/illustrations/Thinking_face-bro.png')" }}
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
        <div className="items-center  flex flex-col">
          <Card className="isolate aspect-video rounded-xl bg-black/40 ring-1 ring-black/5 backdrop-blur-md hover:scale-105 transition-transform duration-300 w-[90%] font-sans ">
            <CardHeader className={`text-center text-purple-400`}>
              <div className="text-3xl font-semibold" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
                Create an Account
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <form action={handleSubmit} className="flex flex-col">
                <div className="gap-2 grid grid-cols-2">
                  <div className="w-full grid">
                    <Label htmlFor="first_name" className="text-left text-gray-200 w-full " style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
                      First Name
                    </Label>
                    <Input 
                    onChange={(e) =>
                      setFormValues({ ...formValues, first_name: e.target.value })
                    }
                    id="first_name" type="text" placeholder="Enter first name" className="mt-2 mb-4 border-white focus-visible:ring-cyan-100 placeholder:text-stone-200 placeholder:font-light text-purple-100" />
                  </div>
                  <div className="w-full flex flex-col">
                    <Label htmlFor="last_name" className="text-left text-gray-200" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
                      Last Name
                    </Label>
                    <Input 
                    onChange={(e) =>
                      setFormValues({ ...formValues, last_name: e.target.value })
                    }
                    id="last_name" type="text" placeholder="Enter last name" className="mt-2 mb-4 border-white focus-visible:ring-cyan-100 placeholder:text-stone-200 placeholder:font-light text-purple-100" />
                  </div>
                </div>
                <Label htmlFor="username" className="text-left text-gray-200" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
                  Username
                </Label>
                <Input 
                onChange={(e) =>
                  setFormValues({ ...formValues, username: e.target.value })
                }
                id="username" type="text" placeholder="Enter your user name" className="mt-2 mb-4 border-white focus-visible:ring-cyan-100 placeholder:text-stone-200 placeholder:font-light text-purple-100" />

                <Label htmlFor="email" className="text-left text-gray-200" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
                  Email
                </Label>
                <Input 
                onChange={(e) =>
                  setFormValues({ ...formValues, email: e.target.value })
                }
                id="email" type="email" placeholder="Enter your email" className="mt-2 mb-4 border-white focus-visible:ring-cyan-100 placeholder:text-stone-200 placeholder:font-light text-purple-100" />

                <Label htmlFor="password" className="text-left text-gray-200" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
                  Password
                </Label>
                <Input 
                onChange={(e) =>
                  setFormValues({ ...formValues, password: e.target.value })
                }
                id="password" type="password" placeholder="Enter your password" className="mt-2 mb-4 border-white focus-visible:ring-cyan-100 placeholder:text-stone-200 placeholder:font-light text-purple-100" />
                <Label htmlFor="password_confirmation" className="text-left text-gray-200" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
                  Confirm Password
                </Label>
                <Input 
                onChange={(e) =>
                  setFormValues({ ...formValues, password_confirmation: e.target.value })
                }
                id="password_confirmation" type="password" placeholder="Confirm  password" className="mt-2 mb-4 border-white focus-visible:ring-cyan-100 placeholder:text-stone-200 placeholder:font-light text-purple-100" />
                {error && (
                  <p className="text-red-800 text-xl text-center"
                    style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                  >
                    {error}
                  </p>
                )}

                <Button className="w-full mt-4 cursor-pointer" variant="secondary">
                  {formStatus.submitting ? <Loader className="animate-spin"/> : "Sign Up"}
                </Button>
              </form>

              <p className="text-white mt-4 flex items-center justify-center gap-2">
                Already have an account? <a href="/auth/login" className="text-blue-400 hover:underline" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>Sign In</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;