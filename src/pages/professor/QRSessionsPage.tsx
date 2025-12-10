import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QRCodeDisplay } from '@/components/attendance/QRCodeDisplay';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useClasses } from '@/hooks/useClasses';
import { useAttendanceSessions } from '@/hooks/useAttendanceSessions';
import { useToast } from '@/hooks/use-toast';
import { 
  QrCode, 
  Play, 
  StopCircle, 
  Users,
  Clock,
  Loader2,
} from 'lucide-react';

export default function QRSessionsPage() {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isStarting, setIsStarting] = useState(false);
  const { classes, isLoading: classesLoading } = useClasses();
  const { sessions, createSession, endSession, refreshSessions } = useAttendanceSessions();
  const { toast } = useToast();

  const activeSession = sessions.find(s => s.is_active && s.class_id === selectedClassId);
  const selectedClass = classes.find(c => c.id === selectedClassId);

  const handleStartSession = async () => {
    if (!selectedClassId) {
      toast({ title: 'Error', description: 'Please select a class first', variant: 'destructive' });
      return;
    }

    setIsStarting(true);
    try {
      await createSession(selectedClassId);
      toast({ title: 'Session started', description: 'QR code is now active for students' });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({ title: 'Error', description: 'Failed to start session', variant: 'destructive' });
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;

    try {
      await endSession(activeSession.id);
      toast({ title: 'Session ended', description: 'Attendance session has been closed' });
    } catch (error) {
      console.error('Error ending session:', error);
      toast({ title: 'Error', description: 'Failed to end session', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <QrCode className="w-4 h-4" />
            QR Attendance
          </div>
          <h1 className="text-3xl font-bold mb-2">Generate QR Code</h1>
          <p className="text-muted-foreground">Create a QR code for students to check in</p>
        </div>

        {/* Class Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Class
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={classesLoading ? 'Loading classes...' : 'Select a class'} />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.subject} ({cls.code}) - Room {cls.room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {classes.length === 0 && !classesLoading && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No classes found. Create a class first to generate QR codes.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Session Control */}
        {selectedClassId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Session Control
                </span>
                {activeSession && (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    Active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!activeSession ? (
                <Button 
                  onClick={handleStartSession} 
                  disabled={isStarting}
                  className="w-full"
                  size="lg"
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Attendance Session
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-600 font-medium">
                      Session is active. Students can now scan the QR code below.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Started at {activeSession.start_time}
                    </p>
                  </div>
                  <Button 
                    onClick={handleEndSession} 
                    variant="destructive"
                    className="w-full"
                    size="lg"
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    End Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* QR Code Display */}
        {activeSession && selectedClass && (
          <QRCodeDisplay 
            sessionId={activeSession.id} 
            className={`${selectedClass.subject} (${selectedClass.code})`}
          />
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Select a class from the dropdown above</li>
              <li>Click "Start Attendance Session" to generate a QR code</li>
              <li>Display the QR code on your screen for students to scan</li>
              <li>The QR code auto-refreshes every 30 seconds for security</li>
              <li>Students scan with their phone camera to check in</li>
              <li>Click "End Session" when done taking attendance</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
