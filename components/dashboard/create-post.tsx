'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PenIcon, BriefcaseIcon } from 'lucide-react';
import axiosInstance from '@/utils/api/axiosInstance';
// Import the axios helper

export function CreatePost() {
  const [postType, setPostType] = useState('article');
  const [content, setContent] = useState('');
  const [jobDetails, setJobDetails] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePostCreate = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Prepare the data based on post type
      const postData = postType === 'article' 
        ? { type: 'article', caption: content } 
        : { 
            type: 'job', 
            caption: content,
            job_details: jobDetails 
          };
      
      // Send data to backend using axios helper
      const response = await axiosInstance.post('/posts', postData).then((res) => res.data);

      // Reset form after successful submission
      if (postType === 'article') {
        setContent('');
      } else {
        setJobDetails({
          title: '',
          company: '',
          location: '',
          salary: '',
          description: ''
        });
      }
      
      // You could add a success message or redirect here
      console.log('Post created successfully');
      console.log(response)
      
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Select defaultValue="article" onValueChange={(value) => setPostType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Post type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">
                <div className="flex items-center gap-2">
                  <PenIcon className="h-4 w-4" />
                  <span>Article</span>
                </div>
              </SelectItem>
              <SelectItem value="job">
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="h-4 w-4" />
                  <span>Job Opening</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        {postType === 'article' ? (
          <Textarea 
            placeholder="Share your thoughts..." 
            className="min-h-[100px] mb-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <div className="space-y-4">
            <Input
              placeholder="Job Title"
              value={jobDetails.title}
              onChange={(e) => setJobDetails({ ...jobDetails, title: e.target.value })}
            />
            <Input
              placeholder="Company"
              value={jobDetails.company}
              onChange={(e) => setJobDetails({ ...jobDetails, company: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={jobDetails.location}
              onChange={(e) => setJobDetails({ ...jobDetails, location: e.target.value })}
            />
            <Input
              placeholder="Salary Range"
              value={jobDetails.salary}
              onChange={(e) => setJobDetails({ ...jobDetails, salary: e.target.value })}
            />
            <Textarea 
              placeholder="Job Description..." 
              className="min-h-[100px]"
              value={jobDetails.description}
              onChange={(e) => setJobDetails({ ...jobDetails, description: e.target.value })}
            />
          </div>
        )}
        <Button 
          onClick={handlePostCreate} 
          className="w-full mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </CardContent>
    </Card>
  );
}