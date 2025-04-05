'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PenIcon, BriefcaseIcon } from 'lucide-react';

export function CreatePost() {
  const [postType, setPostType] = useState('article');
  const [jobDetails, setJobDetails] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
  });

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
        {postType === 'article' ? (
          <Textarea placeholder="Share your thoughts..." className="min-h-[100px] mb-4" />
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
            <Textarea placeholder="Job Description..." className="min-h-[100px]" />
          </div>
        )}
        <Button className="w-full mt-4">Post</Button>
      </CardContent>
    </Card>
  );
}