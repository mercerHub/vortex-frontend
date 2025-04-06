"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, MapPin, Building, Phone, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/api/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    location: "",
  });

  useEffect(() => {
    if (user) {
      setFormValues({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "+91 9283836736",
        company: user.company || "Google",
        location: user.location || "Bangalore, India",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance
        .put("/users/update", { ...formValues });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      alert("An error occurred while updating profile.");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader2 className="animate-spin" size={40}/>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 h-screen w-screen flex items-center justify-center">
      <div className="w-[80%] mx-auto space-y-8 ">
        <Card>
          <CardHeader className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <div className="flex h-24 w-24 items-center justify-center bg-muted">
                  <AvatarImage src={user?.profile_picture_url} />
                  <AvatarFallback>
                    {user.first_name ? user.first_name[0] : ""}
                  </AvatarFallback>
                  
                </div>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">Profile Settings</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { id: "firstName", label: "First name" },
                  { id: "lastName", label: "Last name" },
                  { id: "email", label: "Email", icon: <Mail /> },
                  { id: "phone", label: "Phone", icon: <Phone /> },
                  { id: "company", label: "Company", icon: <Building /> },
                  { id: "location", label: "Location", icon: <MapPin /> },
                ].map(({ id, label, icon }) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={id}>{label}</Label>
                    <div className="relative">
                      {icon && (
                        <div className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">{icon}</div>
                      )}
                      <Input
                        id={id}
                        type={id === "email" ? "email" : "text"}
                        className={icon ? "pl-10" : ""}
                        placeholder={`Enter your ${label.toLowerCase()}`}
                        value={formValues[id as keyof typeof formValues]}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
