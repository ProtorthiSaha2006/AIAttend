import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Class {
  id: string;
  subject: string;
  code: string;
  professor_id: string;
  department: string;
  semester: string;
  room: string;
}

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClasses = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setClasses(data || []);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to fetch classes');
    } finally {
      setIsLoading(false);
    }
  };

  const createClass = async (classData: Omit<Class, 'id' | 'professor_id'>) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error: createError } = await supabase
      .from('classes')
      .insert({
        ...classData,
        professor_id: user.id,
      })
      .select()
      .single();

    if (createError) throw createError;
    
    setClasses((prev) => [data, ...prev]);
    return data;
  };

  useEffect(() => {
    fetchClasses();
  }, [user]);

  return {
    classes,
    isLoading,
    error,
    createClass,
    refreshClasses: fetchClasses,
  };
}
