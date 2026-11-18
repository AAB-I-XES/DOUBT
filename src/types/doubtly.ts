export type NavTab =
  | 'overview'
  | 'ask'
  | 'community'
  | 'resources'
  | 'mentors'
  | 'profile';

export type SubjectName =
  | 'Calculus'
  | 'Data Structures'
  | 'Physics'
  | 'Linear Algebra'
  | 'Digital Logic'
  | 'General';

export interface AISolutionStep {
  heading: string;
  explanation: string;
  math?: string;
}

export interface PracticeQuestion {
  prompt: string;
  hint: string;
}

export interface AIStructuredAnswer {
  subject: string;
  conceptSummary: string;
  steps: AISolutionStep[];
  commonPitfall: string;
  citedSources: string[];
  practiceQuestion?: PracticeQuestion;
  followUpPrompts: string[];
}

export interface AttachmentPreview {
  name: string;
  mimeType: string;
  sizeLabel: string;
  data: string;
}

export interface DoubtExchange {
  id: string;
  question: string;
  subject: SubjectName;
  createdAt: string;
  attachmentName?: string;
  hintFirst?: boolean;
  answer: AIStructuredAnswer;
  helpfulVote?: 'up' | 'down' | null;
  escalatedTo?: string | null;
  reportedReason?: string | null;
}

export interface RecentDoubtSummary {
  id: string;
  title: string;
  subject: SubjectName;
  timestamp: string;
  status: 'Resolved by AI' | 'Answered by Mentor' | 'Open in Community';
  exchangeId?: string;
  communityId?: string;
}

export interface CommunityReply {
  id: string;
  authorName: string;
  authorRole: 'Student' | 'Senior Mentor' | 'Faculty';
  content: string;
  timestamp: string;
  isVerified?: boolean;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  body: string;
  studentName: string;
  isAnonymous: boolean;
  subject: Exclude<SubjectName, 'General'>;
  timestamp: string;
  upvotes: number;
  upvotedByMe?: boolean;
  isAnswered: boolean;
  verifiedByFaculty?: boolean;
  replies: CommunityReply[];
}

export interface Mentor {
  id: string;
  name: string;
  role: 'Faculty' | 'Senior Mentor';
  department: string;
  yearOrTitle: string;
  expertise: string[];
  availability: string;
  isAvailableNow: boolean;
  avatarUrl: string;
  initials: string;
  officeHours: string;
}

export interface MentorHelpRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  topic: string;
  note: string;
  createdAt: string;
}

export type ResourceDocType = 'PDF' | 'Notes' | 'Slides' | 'Problem Set' | 'Cheat Sheet';

export interface ResourceItem {
  id: string;
  title: string;
  subject: Exclude<SubjectName, 'General'>;
  docType: ResourceDocType;
  meta: string;
  author: string;
  summary: string;
  keyEquations: string[];
}

export interface StudentProfile {
  name: string;
  program: string;
  university: string;
  semester: string;
  rollNumber: string;
  avatarUrl: string;
  courses: string[];
  weeklyGoalDoubts: number;
  weeklyCompletedDoubts: number;
  studyDays: { day: string; active: boolean; count: number }[];
}
