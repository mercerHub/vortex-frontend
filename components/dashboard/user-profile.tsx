'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit2Icon, Loader2, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axiosInstance from '@/utils/api/axiosInstance';
import { toast } from '@/hooks/use-toast';

export function UserProfile() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLastUpdated, setResumeLastUpdated] = useState('');
  // Create a reference to the file input element
  const fileInputRef = useRef(null);
  
  let user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  user = {
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    connections: 500,
    profileViews: 50,
    image: 'https://source.unsplash.com/random/200x200?face',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    skillScore: 85,
    resumeLastUpdated: '2024-03-15',
    ...user
  };

  // Function to trigger the file input click
  const triggerFileInput = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    
    // Save the file info
    setResumeFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Create a FormData object with the resume file
    const formData = new FormData();
    formData.append('resume', file);

    try {
      // Make the API call to upload the resume using axiosInstance
      const response = await axiosInstance.post('/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setUploadProgress(percentCompleted);
        },
      });
      
      // Update the last updated date
      const today = new Date().toISOString().split('T')[0];
      setResumeLastUpdated(today);
      
      // Show success message
      toast({
        title: "Resume uploaded successfully",
        description: `Your resume '${file.name}' has been updated.`,
        variant: "default",
      });

    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Set progress to 100% when done (either success or failure)
      setUploadProgress(100);
      
      // Reset after a short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // Format the file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profile_picture_url} />
            <AvatarFallback>{user.first_name ? user.first_name[0] : ''}</AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-1">
          <h2 className="font-semibold text-xl">{user?.first_name +" "+ user?.last_name}</h2>
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
              {user?.job_profile?.info?.map((skill) => (
                <Badge key={skill.name} variant="secondary">
                  {skill.name}
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
              <p className="text-sm font-medium">Resume</p>
              {isUploading ? (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-500">Uploading... {uploadProgress}%</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col space-y-2">
                    <p className="text-xs text-gray-500">
                      Last updated: {resumeLastUpdated || user.resumeLastUpdated}
                    </p>
                    
                    {resumeFile && (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium truncate max-w-xs">
                            {resumeFile.name}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(resumeFile.size)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Hidden file input referenced by useRef */}
                    <input
                      type="file"
                      accept="application/pdf,.doc,.docx"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleResumeUpload(e.target.files[0]);
                        }
                      }}
                    />
                    
                    {/* Direct button that triggers the file input */}
                    <Button
                      variant="outline"
                      className="w-full"
                      type="button"
                      onClick={triggerFileInput}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {resumeFile ? 'Update Resume' : 'Upload Resume'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}