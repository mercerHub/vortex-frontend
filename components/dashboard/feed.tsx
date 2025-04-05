'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, Share2, BriefcaseIcon, Users } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { CreatePost } from './create-post';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Post {
  id: number;
  type: 'article' | 'job';
  author: {
    name: string;
    image: string;
    title: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  jobDetails?: {
    title: string;
    company: string;
    location: string;
    salary: string;
    applicants: number;
  };
}

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();
  const [showApplicants, setShowApplicants] = useState(false);

  const fetchPosts = async () => {
    const newPosts = Array.from({ length: 5 }, (_, i) => ({
      id: posts.length + i + 1,
      type: Math.random() > 0.5 ? 'article' : 'job',
      author: {
        name: `User ${posts.length + i + 1}`,
        image: `https://source.unsplash.com/random/100x100?sig=${posts.length + i + 1}`,
        title: 'Software Developer',
      },
      content: `This is a sample post ${posts.length + i + 1} with some professional content about technology and development.`,
      timestamp: '2h ago',
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      jobDetails: {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'Remote',
        salary: '$120k - $180k',
        applicants: Math.floor(Math.random() * 50),
      },
    }));
    setPosts((prev) => [...prev, ...newPosts]);
  };

  useEffect(() => {
    if (inView) {
      fetchPosts();
      setPage((prev) => prev + 1);
    }
  }, [inView]);

  return (
    <div className="space-y-4">
      <CreatePost />
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={post.author.image} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{post.author.name}</h3>
                  {post.type === 'job' && (
                    <Badge variant="secondary">
                      <BriefcaseIcon className="h-3 w-3 mr-1" />
                      Hiring
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{post.author.title}</p>
                <p className="text-xs text-gray-400">{post.timestamp}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {post.type === 'job' ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-semibold">{post.jobDetails?.title}</h4>
                  <p className="text-gray-600">{post.jobDetails?.company}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>{post.jobDetails?.location}</span>
                    <span>{post.jobDetails?.salary}</span>
                  </div>
                </div>
                <p className="text-gray-700">{post.content}</p>
              </div>
            ) : (
              <p className="mb-4">{post.content}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                {post.comments}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            {post.type === 'job' && (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setShowApplicants(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  {post.jobDetails?.applicants} Applicants
                </Button>
                <Button variant="default" size="sm">
                  Request Referral
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
      <div ref={ref} className="h-10" />

      <Dialog open={showApplicants} onOpenChange={setShowApplicants}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Job Applicants</DialogTitle>
            <DialogDescription>
              Review and manage applicants for this position
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://source.unsplash.com/random/100x100?face=${i}`} />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">Applicant Name</h4>
                    <p className="text-sm text-gray-500">Senior Developer • 8 years exp.</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">Node.js</Badge>
                      <Badge variant="secondary">AWS</Badge>
                    </div>
                  </div>
                </div>
                <Badge variant="default" className="ml-auto">
                  95% Match
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}