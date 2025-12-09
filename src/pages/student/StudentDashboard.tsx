import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/common/StatsCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ScanFace, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  TrendingUp,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockClasses } from '@/data/mockData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const attendanceData = [
  { week: 'W1', attendance: 95 },
  { week: 'W2', attendance: 88 },
  { week: 'W3', attendance: 92 },
  { week: 'W4', attendance: 100 },
  { week: 'W5', attendance: 85 },
  { week: 'W6', attendance: 90 },
];

const upcomingClasses = [
  {
    id: '1',
    subject: 'Data Structures & Algorithms',
    code: 'CS201',
    time: '09:00 - 10:30',
    room: 'Room 301',
    status: 'upcoming',
  },
  {
    id: '2',
    subject: 'Machine Learning',
    code: 'CS401',
    time: '14:00 - 15:30',
    room: 'Room 205',
    status: 'later',
  },
];

const recentAttendance = [
  { subject: 'Data Structures', date: 'Today', status: 'present', method: 'face' },
  { subject: 'Machine Learning', date: 'Yesterday', status: 'present', method: 'face' },
  { subject: 'Database Systems', date: 'Dec 6', status: 'late', method: 'qr' },
  { subject: 'Data Structures', date: 'Dec 5', status: 'present', method: 'face' },
];

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-primary/20 shadow-glow-sm">
              <AvatarImage src={user?.photoURL} alt={user?.name} />
              <AvatarFallback className="gradient-bg text-primary-foreground text-xl">
                {user?.name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Good morning, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-muted-foreground">Ready for today's classes? Your attendance is looking great!</p>
            </div>
          </div>
          <Button variant="gradient" size="lg" asChild className="group">
            <Link to="/student/check-in">
              <ScanFace className="w-5 h-5" />
              Quick Check-in
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Overall Attendance"
            value="92%"
            subtitle="This semester"
            icon={TrendingUp}
            trend={{ value: 3, isPositive: true }}
            variant="primary"
          />
          <StatsCard
            title="Classes Today"
            value="3"
            subtitle="2 remaining"
            icon={Calendar}
            variant="default"
          />
          <StatsCard
            title="Present Days"
            value="45"
            subtitle="Out of 49 days"
            icon={CheckCircle2}
            variant="success"
          />
          <StatsCard
            title="Enrolled Courses"
            value="5"
            subtitle="Active courses"
            icon={BookOpen}
            variant="accent"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Classes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">Today's Schedule</h3>
                  <p className="text-sm text-muted-foreground">Your upcoming classes</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/student/schedule">View all</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {upcomingClasses.map((cls, index) => (
                  <div
                    key={cls.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                      cls.status === 'upcoming' 
                        ? 'bg-primary/5 border-2 border-primary/20' 
                        : 'bg-secondary/50 hover:bg-secondary'
                    }`}
                  >
                    <div className={`w-1 h-16 rounded-full ${
                      cls.status === 'upcoming' ? 'gradient-bg' : 'bg-muted-foreground/30'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{cls.subject}</h4>
                        <Badge variant="outline" className="text-xs">{cls.code}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {cls.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {cls.room}
                        </span>
                      </div>
                    </div>
                    {cls.status === 'upcoming' && (
                      <Button variant="gradient" size="sm" asChild>
                        <Link to="/student/check-in">Check In</Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Chart */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">Attendance Trend</h3>
                  <p className="text-sm text-muted-foreground">Weekly attendance percentage</p>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <defs>
                      <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[70, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fill="url(#attendanceGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Course Progress */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg mb-4">Course Progress</h3>
              <div className="space-y-4">
                {mockClasses.slice(0, 3).map((cls) => {
                  const progress = Math.floor(Math.random() * 20) + 75;
                  return (
                    <div key={cls.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium truncate flex-1">{cls.code}</span>
                        <span className={`font-semibold ${
                          progress >= 85 ? 'text-success' : progress >= 75 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {progress}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Attendance */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Recent Activity</h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/student/history">View all</Link>
                </Button>
              </div>
              <div className="space-y-3">
                {recentAttendance.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === 'present' ? 'bg-success/10 text-success' : 
                      item.status === 'late' ? 'bg-warning/10 text-warning' : 
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {item.status === 'present' ? <CheckCircle2 className="w-4 h-4" /> :
                       item.status === 'late' ? <Clock className="w-4 h-4" /> :
                       <Clock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.subject}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {item.method}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
