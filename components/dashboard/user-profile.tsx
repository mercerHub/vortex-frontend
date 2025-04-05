'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit2Icon, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export function UserProfile() {
  const [isUploading, setIsUploading] = useState(false);
  
  const user = {
    name: 'John Doe',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    connections: 500,
    profileViews: 50,
    image: 'https://source.unsplash.com/random/200x200?face',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    skillScore: 85,
    resumeLastUpdated: '2024-03-15',
  };

  const handleResumeUpload = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-1">
          <h2 className="font-semibold text-xl">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.title}</p>
          <p className="text-sm text-gray-500">{user.company}</p>
          <p className="text-sm text-gray-500">{user.location}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Button variant="outline" className="w-full">
            <Edit2Icon className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Skills Score</span>
                <span className="text-sm font-semibold">{user.skillScore}%</span>
              </div>
              <Progress value={user.skillScore} className="h-2" />
            </div>

            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Connections</span>
              <span className="font-semibold">{user.connections}+</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Profile views</span>
              <span className="font-semibold">{user.profileViews}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Resume</p>
              {isUploading ? (
                <div className="space-y-2">
                  <Progress value={45} className="h-2" />
                  <p className="text-xs text-gray-500">Uploading...</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-500">
                    Last updated: {user.resumeLastUpdated}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleResumeUpload}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Update Resume
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}