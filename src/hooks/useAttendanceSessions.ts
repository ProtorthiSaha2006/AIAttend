import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AttendanceSession {
  id: string;
  class_id: string;
  date: string;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
  classes: {
    id: string;
    subject: string;
    code: string;
    room: string;
  };
}

export function useAttendanceSessions() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchActiveSessions = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('attendance_sessions')
        .select(`
          id,
          class_id,
          date,
          start_time,
          end_time,
          is_active,
          classes (
            id,
            subject,
            code,
            room
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setSessions(data as AttendanceSession[] || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to fetch attendance sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async (classId: string) => {
    const now = new Date();
    const startTime = now.toTimeString().slice(0, 8);

    const { data, error: createError } = await supabase
      .from('attendance_sessions')
      .insert({
        class_id: classId,
        start_time: startTime,
        is_active: true,
      })
      .select(`
        id,
        class_id,
        date,
        start_time,
        end_time,
        is_active,
        classes (
          id,
          subject,
          code,
          room
        )
      `)
      .single();

    if (createError) throw createError;
    
    setSessions((prev) => [data as AttendanceSession, ...prev]);
    return data as AttendanceSession;
  };

  const endSession = async (sessionId: string) => {
    const now = new Date();
    const endTime = now.toTimeString().slice(0, 8);

    const { error: updateError } = await supabase
      .from('attendance_sessions')
      .update({ is_active: false, end_time: endTime })
      .eq('id', sessionId);

    if (updateError) throw updateError;
    
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, is_active: false, end_time: endTime } : s
      )
    );
  };

  useEffect(() => {
    fetchActiveSessions();
  }, [user]);

  return {
    sessions,
    isLoading,
    error,
    createSession,
    endSession,
    refreshSessions: fetchActiveSessions,
  };
}
