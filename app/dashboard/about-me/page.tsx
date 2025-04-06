'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import { BriefcaseIcon, PhoneIcon, MailIcon, User2Icon, AwardIcon } from 'lucide-react';
import axiosInstance from '@/utils/api/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfile {
  name: string;
  contact: string;
  summary: string;
  experience: string[];
  app_dev: string;
  front_end: string;
  back_end: string;
  ml: string;
  ats_score: string;
  projects: string[];
  working: boolean;
}

export default function AboutMePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/users/me-llm').then((res) => res.data);
        if (response.status !== 200) {
          throw new Error('Failed to fetch profile');
        }
        console.log('Profile data:', response.data);
        setProfile(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-3xl">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>
      
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="w-24 h-24">
            <AvatarImage src={user.profile_picture_url} alt="Profile Picture" className="w-24 h-24 rounded-full border-2 border-gray-300" />
            <AvatarFallback className="w-24 h-24 rounded-full border-2 border-gray-300">
              {user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0).toUpperCase()}
            </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.first_name +" "+ user.last_name}</h2>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-1" /> {profile.contact}
                </span>
                <span className="flex items-center text-gray-600">
                  <MailIcon className="h-4 w-4 mr-1" /> {profile.contact}
                </span>
              </div>
              {profile.working && (
                <Badge className="mt-2 bg-green-500">Currently Employed</Badge>
              )}
            </div>
            <div className="flex flex-col items-center border-2 p-4 rounded-lg">
              <span className="text-sm">ATS Score</span>
              <span className="text-3xl font-bold">{profile.ats_score}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Professional Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User2Icon className="h-5 w-5 mr-2" /> Professional Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">{profile.summary}</p>
        </CardContent>
      </Card>
      
      {/* Skills */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AwardIcon className="h-5 w-5 mr-2" /> Skills & Proficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">App Development</span>
                  <span className="text-sm">{profile.app_dev}%</span>
                </div>
                <Progress value={parseInt(profile.app_dev)} className="h-2" />
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Front End</span>
                  <span className="text-sm">{profile.front_end}%</span>
                </div>
                <Progress value={parseInt(profile.front_end)} className="h-2" />
              </div>
            </div>
            <div>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Back End</span>
                  <span className="text-sm">{profile.back_end}%</span>
                </div>
                <Progress value={parseInt(profile.back_end)} className="h-2" />
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Machine Learning</span>
                  <span className="text-sm">{profile.ml}%</span>
                </div>
                <Progress value={parseInt(profile.ml)} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Experience */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BriefcaseIcon className="h-5 w-5 mr-2" /> Professional Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.experience.map((exp, index) => (
            <div key={index}>
              <p className="font-medium">{exp}</p>
              {index < profile.experience.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.projects.map((project, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800">{project}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}