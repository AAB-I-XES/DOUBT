import {
  CommunityQuestion,
  DoubtExchange,
  Mentor,
  RecentDoubtSummary,
  ResourceItem,
  StudentProfile,
} from '../types/doubtly';

export const SUBJECT_LIST = [
  'Calculus',
  'Data Structures',
  'Physics',
  'Linear Algebra',
  'Digital Logic',
] as const;

export const INITIAL_PROFILE: StudentProfile = {
  name: 'Shristii',
  program: 'B.Tech Computer Science',
  semester: 'First Year · Semester 1',
  rollNumber: '2026CS1042',
  avatarUrl: '',
  courses: [
    'MA101 · Maths & Calculus (Abhishek Sharma)',
    'PH103 · Engineering Physics (Dr. Paragjyoti)',
    'CS101 · C Programming & DSA (Munsifa Khan)',
    'MA104 · Linear Algebra',
    'EC102 · Digital Logic Design',
  ],
  weeklyGoalDoubts: 10,
  weeklyCompletedDoubts: 7,
  studyDays: [
    { day: 'Mon', active: true, count: 2 },
    { day: 'Tue', active: true, count: 1 },
    { day: 'Wed', active: true, count: 3 },
    { day: 'Thu', active: false, count: 0 },
    { day: 'Fri', active: true, count: 1 },
    { day: 'Sat', active: false, count: 0 },
    { day: 'Sun', active: false, count: 0 },
  ],
};

export const INITIAL_DOUBT_EXCHANGES: DoubtExchange[] = [
  {
    id: 'ex-1',
    question:
      'Why does $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$ when direct substitution gives $\\frac{0}{0}$?',
    subject: 'Calculus',
    createdAt: 'Today, 9:14 AM',
    answer: {
      subject: 'Calculus',
      conceptSummary:
        'Direct substitution gives the indeterminate form $\\frac{0}{0}$, which only tells us both numerator and denominator approach zero—it does not tell us their ratio. Geometrically, for small angles measured in radians, the arc length $x$ and vertical sine height $\\sin x$ become nearly indistinguishable.',
      steps: [
        {
          heading: 'Set up the unit circle inequality',
          explanation:
            'For $0 < x < \\frac{\\pi}{2}$, comparing the areas of the inner triangle, the circular sector, and the outer right triangle on a unit circle gives a strict sandwich inequality.',
          math: '\\sin x < x < \\tan x',
        },
        {
          heading: 'Divide through by $\\sin x$ and invert',
          explanation:
            'Since $\\sin x > 0$ on $(0, \\frac{\\pi}{2})$, dividing each term by $\\sin x$ preserves the inequality. Taking reciprocals reverses the inequality signs.',
          math: '\\cos x < \\frac{\\sin x}{x} < 1',
        },
        {
          heading: 'Apply the Squeeze Theorem',
          explanation:
            'As $x \\to 0$, we know $\\lim_{x \\to 0} \\cos x = 1$ and the upper bound is constantly $1$. Therefore, $\\frac{\\sin x}{x}$ is squeezed to $1$. By symmetry, the same bound holds for $-\\frac{\\pi}{2} < x < 0$.',
          math: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
        },
      ],
      commonPitfall:
        'Using L’Hôpital’s rule here creates a circular argument in first-principles calculus, because proving $\\frac{d}{dx}(\\sin x) = \\cos x$ itself depends on knowing $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$. Also make sure $x$ is in radians, not degrees.',
      followUpPrompts: [
        'How does this limit help evaluate $\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2}$?',
        'What changes if $x$ is measured in degrees instead of radians?',
        'Show the Taylor series intuition behind $\\sin x \\approx x$ for small $x$.',
      ],
    },
    helpfulVote: 'up',
  },
  {
    id: 'ex-2',
    question:
      'Why is inserting at the head of a singly linked list $O(1)$ while deleting the tail is $O(n)$?',
    subject: 'Data Structures',
    createdAt: 'Yesterday',
    answer: {
      subject: 'Data Structures',
      conceptSummary:
        'Time complexity depends on whether you already hold a direct pointer to the node right before the edit point. Head insertion only updates the `head` pointer, whereas deleting the tail requires updating the `next` pointer of the second-to-last node.',
      steps: [
        {
          heading: 'Head insertion updates two pointers directly',
          explanation:
            'When inserting a new node at the front, you allocate the node, point `newNode->next = head`, and reassign `head = newNode`. Neither step depends on list length $n$.',
          math: 'T_{\\text{insertHead}}(n) = O(1)',
        },
        {
          heading: 'Tail deletion needs the predecessor node',
          explanation:
            'Even if you maintain a `tail` pointer, a singly linked list cannot step backward from `tail` to the node before it. You must traverse from `head` until `curr->next == tail` so you can set `curr->next = NULL`.',
          math: 'T_{\\text{deleteTail}}(n) = O(n)',
        },
      ],
      commonPitfall:
        'Assuming a `tail` pointer makes tail deletion $O(1)$. A `tail` pointer only makes tail insertion $O(1)$; tail deletion becomes $O(1)$ only in a doubly linked list with `prev` pointers.',
      followUpPrompts: [
        'Write the C pointer steps for deleting a node without losing memory.',
        'Compare memory overhead between singly and doubly linked lists.',
      ],
    },
    helpfulVote: null,
  },
];

export const INITIAL_RECENT_DOUBTS: RecentDoubtSummary[] = [
  {
    id: 'rec-1',
    title: 'Why does lim(x→0) sin(x)/x equal 1 instead of 0/0?',
    subject: 'Calculus',
    timestamp: '2h ago',
    status: 'Resolved by AI',
    exchangeId: 'ex-1',
  },
  {
    id: 'rec-2',
    title: 'Why is deleting the tail of a singly linked list O(n)?',
    subject: 'Data Structures',
    timestamp: 'Yesterday',
    status: 'Resolved by AI',
    exchangeId: 'ex-2',
  },
  {
    id: 'rec-3',
    title: 'Condition for eigenvalues of a real symmetric matrix to be orthogonal',
    subject: 'Linear Algebra',
    timestamp: '2d ago',
    status: 'Answered by Mentor',
    communityId: 'comm-2',
  },
  {
    id: 'rec-4',
    title: 'Damped harmonic oscillator: underdamped vs critically damped boundary',
    subject: 'Physics',
    timestamp: '4d ago',
    status: 'Open in Community',
    communityId: 'comm-3',
  },
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'm-1',
    name: 'Abhishek Sharma',
    role: 'Faculty',
    department: 'Department of Mathematics',
    yearOrTitle: 'Maths & Calculus Faculty',
    expertise: ['Calculus', 'Limits & Derivatives', 'Linear Algebra'],
    availability: 'Available now',
    isAvailableNow: true,
    avatarUrl: '',
    initials: 'AS',
    officeHours: 'Mon & Wed · 4:00 PM – 5:30 PM',
  },
  {
    id: 'm-2',
    name: 'Dr. Paragjyoti',
    role: 'Faculty',
    department: 'Department of Physics',
    yearOrTitle: 'Physics Faculty',
    expertise: ['Engineering Physics', 'Mechanics & Waves', 'Oscillations'],
    availability: 'Available now',
    isAvailableNow: true,
    avatarUrl: '',
    initials: 'DP',
    officeHours: 'Tue & Thu · 3:00 PM – 4:30 PM',
  },
  {
    id: 'm-3',
    name: 'Munsifa Khan',
    role: 'Faculty',
    department: 'Computer Science & Engineering',
    yearOrTitle: 'C Programming Faculty',
    expertise: ['C Programming', 'Pointers & Recursion', 'Data Structures'],
    availability: 'Available at 2:00 PM',
    isAvailableNow: false,
    avatarUrl: '',
    initials: 'MK',
    officeHours: 'Mon–Fri · 2:00 PM – 3:30 PM',
  },
  {
    id: 'm-4',
    name: 'Rohan Sen',
    role: 'Senior Mentor',
    department: 'Computer Science & Engineering',
    yearOrTitle: '3rd Year Undergraduate',
    expertise: ['Digital Logic', 'C Lab Debugging', 'Calculus Practice'],
    availability: 'Available now',
    isAvailableNow: true,
    avatarUrl: '',
    initials: 'RS',
    officeHours: 'Daily · 7:00 PM – 9:00 PM',
  },
];

export const INITIAL_COMMUNITY_QUESTIONS: CommunityQuestion[] = [
  {
    id: 'comm-1',
    title: 'When reversing a singly linked list recursively, why do we set head->next->next = head?',
    body: 'I understand the base case when `head == NULL || head->next == NULL`, and I see that `rest` holds the new head. But I get confused tracing `head->next->next = head` on the stack unwind. Can someone trace it for a 3-node list `1 -> 2 -> 3`?',
    studentName: 'Anonymous',
    isAnonymous: true,
    subject: 'Data Structures',
    timestamp: '1h ago',
    upvotes: 18,
    upvotedByMe: true,
    isAnswered: true,
    verifiedByFaculty: true,
    replies: [
      {
        id: 'rep-1',
        authorName: 'Rohan Sen',
        authorRole: 'Senior Mentor',
        content:
          'When the recursion returns from node `3` back to `head = 2`, `head->next` still points to node `3`. Setting `head->next->next = head` makes node `3` point back to node `2`. Then `head->next = NULL` breaks the old forward link `2 -> 3` so there is no cycle.',
        timestamp: '42m ago',
        isVerified: true,
      },
      {
        id: 'rep-2',
        authorName: 'Munsifa Khan',
        authorRole: 'Faculty',
        content:
          'Verified. A helpful way to picture it: `head->next` is the tail of the already-reversed suffix, so `head->next->next = head` appends the current node to the end of that reversed suffix.',
        timestamp: '25m ago',
        isVerified: true,
      },
    ],
  },
  {
    id: 'comm-2',
    title: 'Why are eigenvectors corresponding to distinct eigenvalues of a symmetric matrix orthogonal?',
    body: 'In Lecture 11 we used $A = A^T$ to prove $v_1 \\cdot v_2 = 0$, but I missed why $(\\lambda_1 - \\lambda_2)(v_1^T v_2) = 0$ forces the dot product to zero.',
    studentName: 'Nadia Patel',
    isAnonymous: false,
    subject: 'Linear Algebra',
    timestamp: '4h ago',
    upvotes: 14,
    isAnswered: true,
    verifiedByFaculty: true,
    replies: [
      {
        id: 'rep-3',
        authorName: 'Abhishek Sharma',
        authorRole: 'Faculty',
        content:
          'Start with $\\lambda_1 (v_1^T v_2) = (A v_1)^T v_2 = v_1^T A^T v_2 = v_1^T A v_2 = \\lambda_2 (v_1^T v_2)$. Subtracting gives $(\\lambda_1 - \\lambda_2)(v_1^T v_2) = 0$. Since the eigenvalues are distinct, $\\lambda_1 - \\lambda_2 \\neq 0$, so $v_1^T v_2$ must be $0$.',
        timestamp: '3h ago',
        isVerified: true,
      },
    ],
  },
  {
    id: 'comm-3',
    title: 'In a damped oscillator, why does critical damping return to equilibrium faster than overdamping?',
    body: 'Intuitively, more damping sounds like it should slow things down, yet the textbook says $\\gamma = \\omega_0$ settles fastest without oscillating. Why does $\\gamma > \\omega_0$ take longer?',
    studentName: 'Anonymous',
    isAnonymous: true,
    subject: 'Physics',
    timestamp: '6h ago',
    upvotes: 11,
    isAnswered: false,
    replies: [],
  },
  {
    id: 'comm-4',
    title: 'How do we handle "don’t care" conditions (X) cleanly in a 4-variable K-map?',
    body: 'When simplifying SOP expressions with `d(1, 5, 12, 15)`, do we have to include all X cells in our groups, or only the ones that enlarge a group of 1s?',
    studentName: 'Samir Rao',
    isAnonymous: false,
    subject: 'Digital Logic',
    timestamp: '1d ago',
    upvotes: 9,
    isAnswered: false,
    replies: [],
  },
  {
    id: 'comm-5',
    title: 'Difference between uniform continuity and ordinary continuity on an open interval $(0, 1)$',
    body: 'Why is $f(x) = \\frac{1}{x}$ continuous on $(0, 1)$ yet not uniformly continuous there?',
    studentName: 'Maya Chen',
    isAnonymous: false,
    subject: 'Calculus',
    timestamp: '1d ago',
    upvotes: 16,
    isAnswered: true,
    replies: [
      {
        id: 'rep-4',
        authorName: 'Rohan Sen',
        authorRole: 'Senior Mentor',
        content:
          'For ordinary continuity, $\\delta$ is allowed to shrink depending on the point $x_0$. Near $x = 0$, the slope of $1/x$ grows unboundedly steep, so no single $\\delta > 0$ can control $|1/x - 1/y| < \\varepsilon$ across the entire interval simultaneously.',
        timestamp: '20h ago',
      },
    ],
  },
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Limits, Continuity & Epsilon-Delta Proofs',
    subject: 'Calculus',
    docType: 'Notes',
    meta: 'MA101 · 14 pages · Abhishek Sharma',
    author: 'Abhishek Sharma',
    summary:
      'Step-by-step lecture notes covering intuitive limits, the Squeeze Theorem, epsilon-delta formal proofs, and standard trigonometric limits.',
    keyEquations: [
      '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
      '0 < |x - c| < \\delta \\implies |f(x) - L| < \\varepsilon',
    ],
  },
  {
    id: 'res-2',
    title: 'Pointers, Dynamic Memory & Linked Lists in C',
    subject: 'Data Structures',
    docType: 'PDF',
    meta: 'CS101 · 22 pages · Munsifa Khan',
    author: 'Munsifa Khan',
    summary:
      'Annotated memory diagrams illustrating stack vs. heap allocation, `malloc`/`free` hygiene, and pointer rewiring for singly and doubly linked lists.',
    keyEquations: ['T_{\\text{insertHead}}(n) = O(1)', 'T_{\\text{search}}(n) = O(n)'],
  },
  {
    id: 'res-3',
    title: 'Eigenvalues, Diagonalization & Spectral Theorem',
    subject: 'Linear Algebra',
    docType: 'Cheat Sheet',
    meta: 'MA104 · 2 pages · Abhishek Sharma',
    author: 'Abhishek Sharma',
    summary:
      'Compact reference sheet for characteristic polynomials, algebraic vs. geometric multiplicity, and orthogonal diagonalization of symmetric matrices.',
    keyEquations: ['\\det(A - \\lambda I) = 0', 'A = Q \\Lambda Q^T'],
  },
  {
    id: 'res-4',
    title: 'Simple, Damped & Forced Harmonic Oscillations',
    subject: 'Physics',
    docType: 'Slides',
    meta: 'PH103 · 34 slides · Dr. Paragjyoti',
    author: 'Dr. Paragjyoti',
    summary:
      'Visual phase-space breakdown of underdamped, critically damped, and overdamped regimes, plus resonance amplitude curves.',
    keyEquations: ['\\ddot{x} + 2\\gamma \\dot{x} + \\omega_0^2 x = 0'],
  },
  {
    id: 'res-5',
    title: 'Boolean Algebra & Karnaugh Map Practice Set',
    subject: 'Digital Logic',
    docType: 'Problem Set',
    meta: 'EC102 · 18 problems · With Solutions',
    author: 'Rohan Sen',
    summary:
      'Graded first-year practice problems covering De Morgan transformations, 4-variable K-maps with don’t-care terms, and minimal SOP/POS forms.',
    keyEquations: ['\\overline{A + B} = \\overline{A} \\cdot \\overline{B}'],
  },
  {
    id: 'res-6',
    title: 'Integration by Parts & Trigonometric Substitutions',
    subject: 'Calculus',
    docType: 'Problem Set',
    meta: 'MA101 · 15 problems · Abhishek Sharma',
    author: 'Abhishek Sharma',
    summary:
      'Curated problem set highlighting LIATE heuristics, reduction formulas, and common sign errors in definite integrals.',
    keyEquations: ['\\int u \\, dv = uv - \\int v \\, du'],
  },
];
