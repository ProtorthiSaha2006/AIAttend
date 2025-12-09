import { Class, AttendanceRecord, AttendanceSession, Student, DashboardStats } from '@/types';

export const mockClasses: Class[] = [
  {
    id: 'class-1',
    subject: 'Data Structures & Algorithms',
    code: 'CS201',
    professorId: 'professor-1',
    professorName: 'Dr. Sarah Williams',
    department: 'Computer Science',
    semester: 'Fall 2024',
    room: 'Room 301',
    schedule: [
      { day: 'monday', startTime: '09:00', endTime: '10:30' },
      { day: 'wednesday', startTime: '09:00', endTime: '10:30' },
      { day: 'friday', startTime: '09:00', endTime: '10:30' },
    ],
    enrolledStudents: ['student-1', 'student-2', 'student-3', 'student-4', 'student-5'],
  },
  {
    id: 'class-2',
    subject: 'Machine Learning',
    code: 'CS401',
    professorId: 'professor-1',
    professorName: 'Dr. Sarah Williams',
    department: 'Computer Science',
    semester: 'Fall 2024',
    room: 'Room 205',
    schedule: [
      { day: 'tuesday', startTime: '14:00', endTime: '15:30' },
      { day: 'thursday', startTime: '14:00', endTime: '15:30' },
    ],
    enrolledStudents: ['student-1', 'student-3', 'student-5', 'student-6'],
  },
  {
    id: 'class-3',
    subject: 'Database Management Systems',
    code: 'CS301',
    professorId: 'professor-2',
    professorName: 'Prof. James Miller',
    department: 'Computer Science',
    semester: 'Fall 2024',
    room: 'Room 102',
    schedule: [
      { day: 'monday', startTime: '11:00', endTime: '12:30' },
      { day: 'thursday', startTime: '11:00', endTime: '12:30' },
    ],
    enrolledStudents: ['student-1', 'student-2', 'student-4'],
  },
];

export const mockStudents: Student[] = [
  {
    id: 'student-1',
    email: 'alex.johnson@university.edu',
    name: 'Alex Johnson',
    role: 'student',
    rollNumber: 'CS2024001',
    department: 'Computer Science',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    enrolledClasses: ['class-1', 'class-2', 'class-3'],
    attendanceHistory: [],
    createdAt: new Date(),
  },
  {
    id: 'student-2',
    email: 'emma.davis@university.edu',
    name: 'Emma Davis',
    role: 'student',
    rollNumber: 'CS2024002',
    department: 'Computer Science',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    enrolledClasses: ['class-1', 'class-3'],
    attendanceHistory: [],
    createdAt: new Date(),
  },
  {
    id: 'student-3',
    email: 'ryan.smith@university.edu',
    name: 'Ryan Smith',
    role: 'student',
    rollNumber: 'CS2024003',
    department: 'Computer Science',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    enrolledClasses: ['class-1', 'class-2'],
    attendanceHistory: [],
    createdAt: new Date(),
  },
  {
    id: 'student-4',
    email: 'sophia.chen@university.edu',
    name: 'Sophia Chen',
    role: 'student',
    rollNumber: 'CS2024004',
    department: 'Computer Science',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    enrolledClasses: ['class-1', 'class-3'],
    attendanceHistory: [],
    createdAt: new Date(),
  },
  {
    id: 'student-5',
    email: 'michael.brown@university.edu',
    name: 'Michael Brown',
    role: 'student',
    rollNumber: 'CS2024005',
    department: 'Computer Science',
    photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    enrolledClasses: ['class-1', 'class-2'],
    attendanceHistory: [],
    createdAt: new Date(),
  },
  {
    id: 'student-6',
    email: 'olivia.wilson@university.edu',
    name: 'Olivia Wilson',
    role: 'student',
    rollNumber: 'CS2024006',
    department: 'Computer Science',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    enrolledClasses: ['class-2'],
    attendanceHistory: [],
    createdAt: new Date(),
  },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    classId: 'class-1',
    studentId: 'student-1',
    timestamp: new Date(),
    methodUsed: 'face',
    status: 'present',
    verificationScore: 0.94,
  },
  {
    id: 'att-2',
    classId: 'class-1',
    studentId: 'student-2',
    timestamp: new Date(),
    methodUsed: 'face',
    status: 'present',
    verificationScore: 0.91,
  },
  {
    id: 'att-3',
    classId: 'class-1',
    studentId: 'student-3',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    methodUsed: 'qr',
    status: 'late',
  },
  {
    id: 'att-4',
    classId: 'class-1',
    studentId: 'student-4',
    timestamp: new Date(),
    methodUsed: 'face',
    status: 'present',
    verificationScore: 0.89,
  },
];

export const mockActiveSessions: AttendanceSession[] = [
  {
    id: 'session-1',
    classId: 'class-1',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:30',
    isActive: true,
    records: mockAttendanceRecords,
  },
];

export const mockDashboardStats: DashboardStats = {
  totalStudents: 156,
  totalClasses: 12,
  averageAttendance: 87.5,
  todayCheckIns: 89,
};

export const generateAttendanceChartData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  return days.map(day => ({
    day,
    present: Math.floor(Math.random() * 30) + 70,
    absent: Math.floor(Math.random() * 15) + 5,
    late: Math.floor(Math.random() * 10) + 2,
  }));
};

export const generateWeeklyTrendData = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return weeks.map(week => ({
    week,
    attendance: Math.floor(Math.random() * 15) + 80,
  }));
};

export const generateMethodDistribution = () => [
  { method: 'Face Recognition', value: 65, fill: 'hsl(var(--primary))' },
  { method: 'QR Code', value: 25, fill: 'hsl(var(--accent))' },
  { method: 'Proximity', value: 8, fill: 'hsl(var(--success))' },
  { method: 'Manual', value: 2, fill: 'hsl(var(--muted-foreground))' },
];
