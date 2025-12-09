import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/common/StatsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  BookOpen, 
  GraduationCap,
  UserCog,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  BarChart3,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockStudents, mockClasses, generateWeeklyTrendData } from '@/data/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const weeklyTrendData = generateWeeklyTrendData();

const lowAttendanceStudents = [
  { id: '1', name: 'John Doe', rollNumber: 'CS2024010', attendance: 68, photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
  { id: '2', name: 'Jane Smith', rollNumber: 'CS2024015', attendance: 72, photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
  { id: '3', name: 'Bob Wilson', rollNumber: 'CS2024022', attendance: 74, photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
];

const recentActivity = [
  { action: 'New student registered', user: 'Emily Chen', time: '5 min ago', type: 'student' },
  { action: 'Class created', user: 'Prof. Williams', time: '1 hour ago', type: 'class' },
  { action: 'Attendance exported', user: 'Dr. Miller', time: '2 hours ago', type: 'report' },
  { action: 'Faculty added', user: 'Admin', time: '3 hours ago', type: 'faculty' },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your institution's attendance system</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/admin/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link to="/admin/students">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Students"
            value="1,248"
            subtitle="Active enrollments"
            icon={GraduationCap}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatsCard
            title="Faculty Members"
            value="86"
            subtitle="Across departments"
            icon={UserCog}
            variant="accent"
          />
          <StatsCard
            title="Active Classes"
            value="124"
            subtitle="This semester"
            icon={BookOpen}
            variant="default"
          />
          <StatsCard
            title="System Health"
            value="99.9%"
            subtitle="Uptime this month"
            icon={Shield}
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Attendance Trend */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Institution Attendance Trend</h3>
                <p className="text-sm text-muted-foreground">Average attendance across all classes</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/analytics">Detailed View</Link>
              </Button>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrendData}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
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
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Attendance Alert */}
          <div className="rounded-2xl border border-warning/50 bg-warning/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-lg">Low Attendance Alert</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Students with attendance below 75%
            </p>
            <div className="space-y-3">
              {lowAttendanceStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.photoURL} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                  </div>
                  <Badge variant="outline" className="text-warning border-warning/50 bg-warning/10">
                    {student.attendance}%
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/admin/students">
                View All Students
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats & Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Department Overview */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">Department Overview</h3>
            <div className="space-y-4">
              {[
                { name: 'Computer Science', students: 320, faculty: 24, attendance: 89 },
                { name: 'Electrical Engineering', students: 280, faculty: 20, attendance: 85 },
                { name: 'Mechanical Engineering', students: 260, faculty: 18, attendance: 82 },
                { name: 'Business Administration', students: 200, faculty: 15, attendance: 88 },
              ].map((dept) => (
                <div key={dept.name} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="flex-1">
                    <p className="font-medium">{dept.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {dept.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserCog className="w-3.5 h-3.5" />
                        {dept.faculty}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      dept.attendance >= 85 ? 'text-success' : 'text-warning'
                    }`}>
                      {dept.attendance}%
                    </p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === 'student' ? 'bg-primary/10 text-primary' :
                    activity.type === 'class' ? 'bg-accent/10 text-accent' :
                    activity.type === 'faculty' ? 'bg-success/10 text-success' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {activity.type === 'student' && <GraduationCap className="w-5 h-5" />}
                    {activity.type === 'class' && <BookOpen className="w-5 h-5" />}
                    {activity.type === 'faculty' && <UserCog className="w-5 h-5" />}
                    {activity.type === 'report' && <BarChart3 className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: GraduationCap, label: 'Manage Students', path: '/admin/students', color: 'primary' },
            { icon: UserCog, label: 'Manage Faculty', path: '/admin/faculty', color: 'accent' },
            { icon: BookOpen, label: 'Manage Classes', path: '/admin/classes', color: 'success' },
            { icon: BarChart3, label: 'View Analytics', path: '/admin/analytics', color: 'warning' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                action.color === 'primary' ? 'gradient-bg' :
                action.color === 'accent' ? 'bg-accent' :
                action.color === 'success' ? 'bg-success' :
                'bg-warning'
              }`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium group-hover:text-primary transition-colors">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
