-- Create classes table
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  professor_id UUID NOT NULL,
  department TEXT NOT NULL,
  semester TEXT NOT NULL,
  room TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_schedules table
CREATE TABLE public.class_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  day TEXT NOT NULL CHECK (day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_enrollments table
CREATE TABLE public.class_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(class_id, student_id)
);

-- Create attendance_sessions table
CREATE TABLE public.attendance_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIME NOT NULL,
  end_time TIME,
  qr_secret TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  method_used TEXT NOT NULL CHECK (method_used IN ('face', 'qr', 'proximity', 'manual')),
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  verification_score NUMERIC,
  UNIQUE(session_id, student_id)
);

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Classes policies
CREATE POLICY "Professors can manage their own classes"
  ON public.classes FOR ALL
  USING (professor_id = auth.uid());

CREATE POLICY "Students can view classes they're enrolled in"
  ON public.classes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.class_enrollments
      WHERE class_enrollments.class_id = classes.id
      AND class_enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all classes"
  ON public.classes FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Class schedules policies
CREATE POLICY "Anyone can view schedules for accessible classes"
  ON public.class_schedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_schedules.class_id
      AND (
        classes.professor_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.class_enrollments
          WHERE class_enrollments.class_id = classes.id
          AND class_enrollments.student_id = auth.uid()
        )
        OR has_role(auth.uid(), 'admin'::app_role)
      )
    )
  );

CREATE POLICY "Professors can manage schedules for their classes"
  ON public.class_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_schedules.class_id
      AND classes.professor_id = auth.uid()
    )
  );

-- Class enrollments policies
CREATE POLICY "Students can view their enrollments"
  ON public.class_enrollments FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Professors can manage enrollments for their classes"
  ON public.class_enrollments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_enrollments.class_id
      AND classes.professor_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all enrollments"
  ON public.class_enrollments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Attendance sessions policies
CREATE POLICY "Professors can manage sessions for their classes"
  ON public.attendance_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = attendance_sessions.class_id
      AND classes.professor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view active sessions for their classes"
  ON public.attendance_sessions FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.class_enrollments
      WHERE class_enrollments.class_id = attendance_sessions.class_id
      AND class_enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all sessions"
  ON public.attendance_sessions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Attendance records policies
CREATE POLICY "Students can view their own records"
  ON public.attendance_records FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own records"
  ON public.attendance_records FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Professors can view records for their classes"
  ON public.attendance_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = attendance_records.class_id
      AND classes.professor_id = auth.uid()
    )
  );

CREATE POLICY "Professors can manage records for their classes"
  ON public.attendance_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = attendance_records.class_id
      AND classes.professor_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all records"
  ON public.attendance_records FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_sessions_updated_at
  BEFORE UPDATE ON public.attendance_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();