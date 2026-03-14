import { Link } from "wouter";
import { motion } from "framer-motion";
import { Flame, BookOpen, CheckCircle2, Wallet, ArrowRight, Lock } from "lucide-react";
import type { Course, Sprint } from "@/lib/domain-types";
import { MainLayout } from "@/components/layout/main-layout";
import { useUser, useEnrolledCoursesWithSprints } from "@/hooks/use-app-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function getYetToBeDoneSprints(courses: Course[]): { course: Course; sprint: Sprint }[] {
  const result: { course: Course; sprint: Sprint }[] = [];
  for (const course of courses) {
    for (const sprint of course.sprints ?? []) {
      const hasPending = sprint.tickets.some((t) => t.status !== "Completed");
      if (hasPending) result.push({ course, sprint });
    }
  }
  return result;
}

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: courses, isLoading: coursesLoading } = useEnrolledCoursesWithSprints();
  const upNextSprints = courses?.length ? getYetToBeDoneSprints(courses) : [];

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (userLoading || coursesLoading) {
    return (
      <MainLayout>
        <div className="p-8 space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 mt-1">Ready to tackle some real-world problems today?</p>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm inline-flex items-center">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={itemVariants}>
            <Card className="hover-elevate border-0 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Current Streak</p>
                  <h3 className="text-2xl font-bold text-slate-900">{user?.currentStreak} Days</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="hover-elevate border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Courses</p>
                  <h3 className="text-2xl font-bold text-slate-900">{courses?.length}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover-elevate border-0 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    <p className="text-sm font-medium text-slate-500">Fee Refunded</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    KES {user?.feeRefunded.toLocaleString()} <span className="text-slate-400 font-normal">/ {user?.feeTotal.toLocaleString()}</span>
                  </span>
                </div>
                <Progress value={(user!.feeRefunded / user!.feeTotal) * 100} className="h-2 bg-slate-100 [&>div]:bg-emerald-500" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover-elevate border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Tickets Completed</p>
                  <h3 className="text-2xl font-bold text-slate-900">{user?.ticketsCompleted}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Ticket - Priority */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-4"
          >
            <h2 className="text-xl font-display font-bold text-slate-900">Up Next</h2>
            
            {upNextSprints.length > 0 ? (
              <div className="space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
                {upNextSprints.map(({ course, sprint }, idx) => {
                  const sprintNumber = (course.sprints?.findIndex((s) => s.id === sprint.id) ?? idx) + 1;
                  const ticketsOrdered = [...sprint.tickets].sort((a, b) => {
                    const order = { Active: 0, Locked: 1, Completed: 2 };
                    return (order[a.status] ?? 2) - (order[b.status] ?? 2);
                  });
                  const firstActiveTicket = sprint.tickets.find((t) => t.status === "Active");
                  return (
                    <Card key={`${course.id}-${sprint.id}`} className="border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-1 bg-gradient-to-r from-primary/80 to-blue-500/80" />
                      <CardHeader className="pb-2 pt-4">
                        <p className="text-slate-500 text-sm font-medium">{course.title}</p>
                        <CardTitle className="text-lg leading-tight">Sprint {sprintNumber}: {sprint.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <ul className="space-y-2">
                          {ticketsOrdered.map((ticket) => (
                            <li key={ticket.id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {ticket.status === "Completed" ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                ) : ticket.status === "Locked" ? (
                                  <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                ) : (
                                  <span className="w-4 h-4 rounded-full bg-primary/20 flex-shrink-0" />
                                )}
                                <span className={`text-sm font-medium truncate ${ticket.status === "Locked" ? "text-slate-400" : "text-slate-900"}`}>
                                  {ticket.title}
                                </span>
                                {ticket.status === "Active" && (
                                  <span className="text-xs text-slate-500 flex-shrink-0">{ticket.durationEstimate}</span>
                                )}
                              </div>
                              {ticket.status === "Active" && (
                                <Button asChild size="sm" className="flex-shrink-0">
                                  <Link href={`/courses/${course.id}/ticket/${ticket.id}`}>
                                    {ticket.hasAttemptedBefore ? "Continue" : "Start"} <ArrowRight className="ml-1 w-3.5 h-3.5" />
                                  </Link>
                                </Button>
                              )}
                            </li>
                          ))}
                        </ul>
                        {firstActiveTicket && (
                          <div className="pt-2">
                            <Button asChild size="lg" className="w-full sm:w-auto shadow-md shadow-primary/20">
                              <Link href={`/courses/${course.id}/ticket/${firstActiveTicket.id}`}>
                                {firstActiveTicket.hasAttemptedBefore ? "Continue" : "Start"} ticket <ArrowRight className="ml-2 w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : courses?.length ? (
              <Card className="border border-slate-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-slate-500 mb-4">You’re all caught up in this course. Pick another to continue.</p>
                  <Button variant="outline" asChild>
                    <Link href="/courses">Browse courses</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-slate-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-slate-500 mb-4">Enroll in a course to see your next sprints and tickets here.</p>
                  <Button asChild>
                    <Link href="/courses">Find courses</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Enrolled Courses */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-display font-bold text-slate-900">Active Courses</h2>
              <Link href="/courses" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
            
            <div className="space-y-4">
              {courses?.length ? (
                courses.map((course) => (
                  <Card key={course.id} className="border-0 shadow-sm hover-elevate transition-all">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="bg-slate-50 text-slate-600">
                          {course.category}
                        </Badge>
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          Sprint {course.currentSprint ?? 1}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 leading-tight mb-4">{course.title}</h3>
                      
                      <div className="space-y-1.5 mb-4">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-primary">{course.progressPercent ?? 0}%</span>
                        </div>
                        <Progress value={course.progressPercent ?? 0} className="h-1.5" />
                      </div>
                      
                      <Button variant="outline" className="w-full text-sm font-medium h-9" asChild>
                        <Link href={`/courses/${course.id}`}>Continue</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <p className="text-slate-500 text-sm mb-3">No active courses yet.</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/courses">Browse courses</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </MainLayout>
  );
}
