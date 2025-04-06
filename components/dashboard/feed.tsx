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
import axiosInstance from '@/utils/api/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const jobPostTemplates = [
  {
    jobDetails: {
      title: "Frontend Developer",
      company: "TechNova Inc.",
      location: "Remote",
      salary: "$70k - $90k"
    },
    content: "We’re looking for a passionate Frontend Developer to join our team!"
  },
  {
    jobDetails: {
      title: "Backend Engineer",
      company: "CodeCrush Labs",
      location: "Bangalore, India",
      salary: "₹15L - ₹22L"
    },
    content: "Join us in building scalable microservices and RESTful APIs."
  },
  {
    jobDetails: {
      title: "DevOps Specialist",
      company: "CloudPilot",
      location: "Berlin, Germany",
      salary: "€60k - €80k"
    },
    content: "Ensure CI/CD pipelines and cloud infra are always flying smooth."
  },
  {
    jobDetails: {
      title: "Full Stack Engineer",
      company: "StackHive",
      location: "San Francisco, USA",
      salary: "$100k - $130k"
    },
    content: "We're building cutting-edge platforms using modern stacks like React and Node.js."
  },
  {
    jobDetails: {
      title: "Product Designer",
      company: "UXForge",
      location: "Amsterdam, Netherlands",
      salary: "€50k - €70k"
    },
    content: "Design beautiful and functional user experiences with our award-winning team."
  },
  {
    jobDetails: {
      title: "Data Scientist",
      company: "InSight AI",
      location: "Toronto, Canada",
      salary: "$90k - $120k"
    },
    content: "Analyze data, build ML models, and uncover insights that drive smarter decisions."
  },
  {
    jobDetails: {
      title: "Mobile App Developer",
      company: "AppGlider",
      location: "Singapore",
      salary: "SGD 80k - 110k"
    },
    content: "Build sleek and performant cross-platform mobile apps using Flutter or React Native."
  },
  {
    jobDetails: {
      title: "QA Automation Engineer",
      company: "BugSquashers",
      location: "London, UK",
      salary: "£40k - £55k"
    },
    content: "Develop automation suites and ensure software quality with cutting-edge tools."
  }
];

export interface JobDetails {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
}

interface Post {
  post_id: number;
  caption: string;
  author_image: string;
  created_at: string; // ISO date string
  media_url: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_id: number;
  type: number;
  users_applied : [];
  interactions: {
    like: number;
    comment: number;
    share: number;
  };
  job_details: JobDetails
}


export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();
  const [showApplicants, setShowApplicants] = useState(false);
  const [dialogOpenFor, setDialogOpenFor] = useState<number>(0);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleShowApplicants = (post: Post, index: number) => {
    if(!user) return;
    setDialogOpenFor(index);
    setShowApplicants(true);
  }

  const handleReferralRequest = async (post: Post, index: number) => {
    if(!user) return;
    setDialogOpenFor(index);
    const response = await axiosInstance.put(`/posts/${post.post_id}/request_referral`).then((res) => {
      return res.data;
    }).catch((err) => {
      console.log(err);
    });
    console.log(response)
    if(response.status == 200) {
      post.users_applied = response.data.users_applied;
      setPosts((prev) => [...prev]);
      setShowApplicants(false);
    }
  }

  const handleLike = async (post: Post) => {
    const response = await axiosInstance.post(`/posts/${post.post_id}/like`).then((res) => {
      return res.data;
    }).catch((err) => {
      console.log(err);
    });
    console.log(post);
    if(response.status == 200) {
      post.interactions.like = response.data.likes;
      setPosts((prev) => [...prev]);
    }
  }


  const fetchPosts = async () => {
    const newPosts = await axiosInstance.post('/users/feed',{
      page: page,
      limit: 5,
    }).then((res) => {
      return res.data.data
    }).catch((err) => {
      console.log(err);
    })
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
      {posts.map((post, index) => (
        <Card key={post.post_id}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={post.author_image} />
                <AvatarFallback>{post.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{post.username}</h3>
                  {post.type == 1 && (
                    <Badge variant="secondary">
                      <BriefcaseIcon className="h-3 w-3 mr-1" />
                      Hiring
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{post.caption}</p>
                <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {post.type == 1 ? (
              <div className="space-y-4">
              {post.job_details ? (
                // Render actual job details if present in response
                <div>
                  <h4 className="text-xl font-semibold">{post.job_details.title}</h4>
                  <p className="text-gray-600">{post.job_details.company}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>{post.job_details.location}</span>
                    <span>{post.job_details.salary}</span>
                  </div>
                  <p className="text-gray-700">{post.content || post.job_details.description}</p>
                </div>
              ) : (
                // Fallback to template if job details not present
                <div>
                  <h4 className="text-xl font-semibold">{jobPostTemplates[index % jobPostTemplates.length].jobDetails.title}</h4>
                  <p className="text-gray-600">{jobPostTemplates[index % jobPostTemplates.length].jobDetails.company}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>{jobPostTemplates[index % jobPostTemplates.length].jobDetails.location}</span>
                    <span>{jobPostTemplates[index % jobPostTemplates.length].jobDetails.salary}</span>
                  </div>
                  <p className="text-gray-700">{jobPostTemplates[index % jobPostTemplates.length].content}</p>
                </div>
              )}
            </div>
            ) : (
              <p className="mb-4">{jobPostTemplates[index % jobPostTemplates.length].content}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={() => handleLike(post)} variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                {post.interactions.like}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                {post.interactions.comment}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            {post.type == 1 && (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => handleShowApplicants(post, index)}>
                  <Users className="h-4 w-4 mr-2" />
                  {post.users_applied.length} Applicants
                </Button>
                <Button onClick={() => handleReferralRequest(post, index)} variant="default" size="sm">
                  {(post.users_applied.length == 0 || post.users_applied.filter((_user) => _user.id === user?.id).length != 0) ? "Request Referral" : "Requested"}
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
            {posts.length && posts[dialogOpenFor || 0].users_applied.length == 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">No applicants yet.</p>
              </div>
            )}
            {posts.length && posts[dialogOpenFor || 0].users_applied.map(({ user_id, created_at }) => (
              <div key={user_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://source.unsplash.com/random/100x100?face=${2}`} />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{user?.first_name+" "+user?.last_name}</h4>
                    <p className="text-sm text-gray-500">Senior Developer • 8 years exp.</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">Node.js</Badge>
                      <Badge variant="secondary">AWS</Badge>
                    </div>
                  </div>
                </div>
                <Badge variant="default" className="ml-auto">
                  {Math.floor(Math.random() * (99 - 50 + 1)) + 50}% Match
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}