"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Users, Loader2, UserCheck } from "lucide-react";
import axiosInstance from "@/utils/api/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type User = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
};

export default function ConnectionsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [type, setType] = useState<"followers" | "following">("followers");

  const LIMIT = 8;

  const fetchUsers = async (selectedType = type, nextPage = 0) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/users/${selectedType}`, {
         limit: LIMIT, 
         page: nextPage
      });

      const newUsers = res.data.data || [];

      if (newUsers.length < LIMIT) setHasMore(false);

      if (nextPage === 0) {
        setUsers(newUsers);
      } else {
        setUsers((prev) => [...prev, ...newUsers]);
      }

      setPage(nextPage + 1);
    } catch (err) {
      console.error(`Failed to fetch ${selectedType}`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUsers([]);
    setPage(0);
    setHasMore(true);
    fetchUsers(type, 0);
  }, [type]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Users className="text-muted-foreground" />
              <CardTitle className="text-2xl">Your Connections</CardTitle>
            </div>
            <Select value={type} onValueChange={(val) => setType(val as "followers" | "following")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="followers">Followers</SelectItem>
                <SelectItem value="following">Following</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>

          <CardContent>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {type === "followers" ? <UserPlus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </h3>

            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 bg-muted">
                    <AvatarImage src={user?.profile_picture_url} alt="Profile Picture" className="rounded-full" />
                    <AvatarFallback className="rounded-full">
                      {user.first_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>

            {loading && (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin h-5 w-5" />
              </div>
            )}

            {!loading && hasMore && (
              <div className="flex justify-center mt-6">
                <Button onClick={() => fetchUsers(type, page)}>See More</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
