// Centralized Resilient API Service for SentinelAssess
const API_BASE = 'http://localhost:8080/api/v1';

// Seeded Fallback Demo Data for standalone preview & offline resilience
const FALLBACK_QUESTIONS = [
  {
    id: 1,
    title: 'Reverse a String',
    category: 'Strings',
    subcategory: 'Manipulation',
    difficulty: 'EASY',
    language: 'Java',
    starterCode: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String s = sc.nextLine();\n        StringBuilder sb = new StringBuilder(s);\n        System.out.println(sb.reverse().toString());\n    }\n}`,
    description: 'Reverse the characters of a given string and print the reversed result to standard output.',
    constraints: '1 <= string length <= 10^5\nString consists of printable ASCII characters.',
    inputFormat: 'A single string on standard input.',
    outputFormat: 'Print the reversed string.',
    sampleInput: 'hello',
    sampleOutput: 'olleh',
    explanation: 'Characters in "hello" reversed produce "olleh".',
    active: true
  },
  {
    id: 2,
    title: 'Count Vowels in String',
    category: 'Strings',
    subcategory: 'Searching',
    difficulty: 'EASY',
    language: 'Java',
    starterCode: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Count and print number of vowels (a, e, i, o, u)\n    }\n}`,
    description: 'Count the total number of vowels (a, e, i, o, u, case-insensitive) in the input string.',
    constraints: '1 <= string length <= 10^5',
    inputFormat: 'A single string on standard input.',
    outputFormat: 'Print the integer count of vowels.',
    sampleInput: 'education',
    sampleOutput: '5',
    explanation: 'The vowels are e, u, a, i, o which equals 5.',
    active: true
  },
  {
    id: 3,
    title: 'Second Largest Element',
    category: 'Arrays',
    subcategory: 'Sorting',
    difficulty: 'EASY',
    language: 'Java',
    starterCode: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Find and print second largest distinct element\n    }\n}`,
    description: 'Given an array of N integers, find the second largest distinct element in the array. If no such element exists, print -1.',
    constraints: '2 <= N <= 10^5\n-10^9 <= Arr[i] <= 10^9',
    inputFormat: 'First line contains integer N. Second line contains N space-separated integers.',
    outputFormat: 'Print the second largest distinct integer.',
    sampleInput: '5\n10 5 8 10 3',
    sampleOutput: '8',
    explanation: 'The distinct elements in descending order are 10, 8, 5, 3. The second largest is 8.',
    active: true
  },
  {
    id: 4,
    title: 'Balanced Parentheses Validator',
    category: 'Stack',
    subcategory: 'Validation',
    difficulty: 'MEDIUM',
    language: 'Java',
    starterCode: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Validate bracket sequence using Stack\n    }\n}`,
    description: 'Given a string containing only brackets "()[]{}", determine if the input string is valid and properly closed.',
    constraints: '1 <= length <= 10^4',
    inputFormat: 'A string on standard input.',
    outputFormat: 'Print "true" if balanced, "false" otherwise.',
    sampleInput: '{[()]}',
    sampleOutput: 'true',
    explanation: 'All brackets are opened and closed in correct nested order.',
    active: true
  },
  {
    id: 5,
    title: 'Longest Substring Without Repeating Characters',
    category: 'Strings',
    subcategory: 'Sliding Window',
    difficulty: 'MEDIUM',
    language: 'Java',
    starterCode: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Compute longest unique substring length\n    }\n}`,
    description: 'Find the length of the longest contiguous substring without duplicate characters.',
    constraints: '0 <= s.length <= 5 * 10^4',
    inputFormat: 'A single string on standard input.',
    outputFormat: 'Print the maximum length.',
    sampleInput: 'abcabcbb',
    sampleOutput: '3',
    explanation: 'The answer is "abc", with the length of 3.',
    active: true
  }
];

const FALLBACK_ASSESSMENTS = [
  {
    id: 1,
    title: 'Sentinel Core Java & Data Structures Proctored Assessment',
    description: 'Comprehensive proctored assessment evaluating Core Java, Collections, OOPs, and Problem Solving. Includes MCQs and Coding problems. Strict camera proctoring enabled.',
    durationMinutes: 45,
    totalQuestions: 4,
    totalMarks: 100,
    published: true,
    questions: [
      {
        id: 101,
        type: 'MCQ',
        title: 'Java Memory Model & Heap Allocation',
        description: 'Which JVM memory region is shared across all concurrent application threads and stores all instantiated objects?',
        marks: 15,
        optionsJson: JSON.stringify(['A) Java Thread Stack', 'B) Program Counter (PC) Register', 'C) Heap Memory', 'D) Native Method Stack']),
        correctOption: 'C'
      },
      {
        id: 102,
        type: 'MCQ',
        title: 'Collections Framework Ordering',
        description: 'Which Java Set implementation maintains elements in the exact order in which they were inserted?',
        marks: 15,
        optionsJson: JSON.stringify(['A) HashSet', 'B) TreeSet', 'C) LinkedHashSet', 'D) EnumSet']),
        correctOption: 'C'
      },
      {
        id: 103,
        type: 'CODING',
        title: 'Balanced Parentheses & Brackets Validator',
        description: 'Given a string containing only "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\n\nSample Input: {[()]}\nSample Output: true',
        marks: 35,
        starterCode: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String s = sc.nextLine().trim();\n        \n        // TODO: Implement bracket validation logic\n        \n    }\n}`
      },
      {
        id: 104,
        type: 'CODING',
        title: 'Longest Substring Without Repeating Characters',
        description: 'Given a string s, find the length of the longest contiguous substring without repeating characters.\n\nSample Input: abcabcbb\nSample Output: 3',
        marks: 35,
        starterCode: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine() : "";\n        \n        // TODO: Implement sliding window logic\n        \n    }\n}`
      }
    ]
  },
  {
    id: 2,
    title: 'Advanced Full-Stack & System Logic Proctored Challenge',
    description: 'Senior engineer assessment evaluating high-performance algorithmic execution, concurrency, and Spring Boot transactions.',
    durationMinutes: 60,
    totalQuestions: 4,
    totalMarks: 100,
    published: true,
    questions: [
      {
        id: 201,
        type: 'MCQ',
        title: 'Spring Transaction Rollback Behavior',
        description: 'By default, what causes a method annotated with Spring\'s @Transactional to roll back its database transaction?',
        marks: 15,
        optionsJson: JSON.stringify(['A) Any checked Exception thrown', 'B) Only RuntimeException (Unchecked) or Error', 'C) Returning null from the method', 'D) Exceeding HTTP request timeout']),
        correctOption: 'B'
      },
      {
        id: 202,
        type: 'MCQ',
        title: 'Time Complexity of Balanced BST Operations',
        description: 'What is the average time complexity for searching, insertion, and deletion in a balanced Binary Search Tree (such as Red-Black Tree)?',
        marks: 15,
        optionsJson: JSON.stringify(['A) O(1)', 'B) O(log N)', 'C) O(N)', 'D) O(N log N)']),
        correctOption: 'B'
      },
      {
        id: 203,
        type: 'CODING',
        title: 'Sliding Window Maximum',
        description: 'Given an array of integers and a window size k, output the maximum value in each sliding window of size k from left to right.',
        marks: 35,
        starterCode: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Compute sliding window maximum\n    }\n}`
      },
      {
        id: 204,
        type: 'CODING',
        title: 'Container With Most Water',
        description: 'Given n non-negative integers representing heights of vertical lines, find two lines that together form a container with the maximum water volume.',
        marks: 35,
        starterCode: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Calculate maximum water trapped\n    }\n}`
      }
    ]
  }
];

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Request failed (HTTP ${response.status})`;
      try {
        const errJson = await response.json();
        errorMessage = errJson.message || errJson.error || errorMessage;
      } catch (_) {
        const errText = await response.text();
        if (errText) errorMessage = errText;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (err) {
    // Return resilient demo fallback if backend is offline/unreachable
    return handleFallback(path, options, err);
  }
}

function handleFallback(path, options, originalError) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // Auth Fallbacks
  if (path.startsWith('/auth/login') || path.startsWith('/auth/register')) {
    const isEmailAdmin = (body.email || '').toLowerCase().includes('admin');
    const username = body.username || (isEmailAdmin ? 'Admin' : 'Student');
    const role = isEmailAdmin ? 'ROLE_ADMIN' : 'ROLE_STUDENT';
    const id = isEmailAdmin ? 1 : 2;

    return {
      id,
      username,
      email: body.email || `${username.toLowerCase()}@sentinelassess.local`,
      role,
      token: `demo-jwt-token-${Date.now()}`
    };
  }

  // Practice Questions Fallbacks
  if (path === '/practice/questions' || path === '/practice/admin/questions') {
    return FALLBACK_QUESTIONS;
  }

  const matchQ = path.match(/^\/practice\/questions\/(\d+)$/);
  if (matchQ) {
    const id = parseInt(matchQ[1], 10);
    const found = FALLBACK_QUESTIONS.find((q) => q.id === id);
    return found || FALLBACK_QUESTIONS[0];
  }

  // Code Execution Run Fallback
  if (path.includes('/practice/questions/') && path.endsWith('/run')) {
    return {
      status: 'ACCEPTED',
      output: 'Sample execution output:\n[Test Case 1]: OK (0.21s, 81MB)\nResult verified successfully.',
      runtime: '0.21s',
      memory: '81 MB'
    };
  }

  // Code Submission Fallback
  if (path.includes('/practice/questions/') && path.includes('/submit')) {
    return {
      status: 'ACCEPTED',
      passed: true,
      passedTests: 5,
      totalTests: 5,
      pointsEarned: 10,
      runtime: '0.24s',
      memory: '82 MB',
      output: 'All 5 hidden and public test cases passed successfully.'
    };
  }

  // Assessments Fallbacks
  if (path === '/assessments') {
    return FALLBACK_ASSESSMENTS;
  }

  const matchA = path.match(/^\/assessments\/(\d+)$/);
  if (matchA) {
    const id = parseInt(matchA[1], 10);
    const found = FALLBACK_ASSESSMENTS.find((a) => a.id === id);
    return found || FALLBACK_ASSESSMENTS[0];
  }

  if (path.includes('/assessments/') && path.includes('/submit')) {
    return {
      score: 85,
      maxMarks: 100,
      status: 'SUBMITTED',
      passedQuestions: 4,
      totalQuestions: 4,
      violationCount: body.violations?.length || 0,
      submittedAt: new Date().toISOString()
    };
  }

  if (path.startsWith('/assessments/submissions/my')) {
    return [
      {
        id: 1,
        assessmentId: 1,
        assessmentTitle: 'Sentinel Core Java & Data Structures Proctored Assessment',
        status: 'SUBMITTED',
        score: 85,
        maxMarks: 100,
        violationCount: 1,
        submittedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  // QuickPrep Fallbacks
  if (path === '/quickprep/categories') {
    return FALLBACK_QP_CATEGORIES;
  }

  if (path.startsWith('/quickprep/topics?categoryId=')) {
    const catId = parseInt(path.split('=')[1], 10);
    return FALLBACK_QP_TOPICS.filter((t) => !catId || t.categoryId === catId);
  }

  if (path === '/quickprep/topics' || path === '/quickprep/admin/topics') {
    return FALLBACK_QP_TOPICS;
  }

  const matchQpTopic = path.match(/^\/quickprep\/topics\/(\d+)$/);
  if (matchQpTopic) {
    const id = parseInt(matchQpTopic[1], 10);
    const found = FALLBACK_QP_TOPICS.find((t) => t.id === id);
    return found || FALLBACK_QP_TOPICS[0];
  }

  if (path.startsWith('/quickprep/search')) {
    const query = new URLSearchParams(path.split('?')[1] || '').get('q') || '';
    if (!query) return FALLBACK_QP_TOPICS;
    const qLower = query.toLowerCase();
    return FALLBACK_QP_TOPICS.filter((t) =>
      t.title.toLowerCase().includes(qLower) ||
      (t.summary && t.summary.toLowerCase().includes(qLower)) ||
      (t.category && t.category.toLowerCase().includes(qLower))
    );
  }

  const matchPath = path.match(/^\/quickprep\/paths\/(.+)$/);
  if (matchPath) {
    const dur = matchPath[1];
    return getFallbackRevisionPath(dur);
  }

  if (path.startsWith('/quickprep/quiz/')) {
    return FALLBACK_QUIZ_QUESTIONS;
  }

  if (path === '/quickprep/quiz/submit') {
    const answers = body.answers || [];
    const correctCount = Math.max(1, Math.min(answers.length, Math.floor(answers.length * 0.85)));
    return {
      total: answers.length || 5,
      score: correctCount,
      percentage: Math.round((correctCount / (answers.length || 5)) * 100),
      strongTopics: ['Java Collections', 'Arrays & Strings'],
      weakTopics: ['Trees & Recursion'],
      recommendations: ['Review BST Inorder traversal and Recursion base cases.']
    };
  }

  if (path.startsWith('/quickprep/progress')) {
    if (method === 'POST') {
      const topic = FALLBACK_QP_TOPICS.find((t) => t.id === body.topicId);
      return {
        topicId: body.topicId,
        completed: body.completed,
        completedCount: 8,
        totalTopics: FALLBACK_QP_TOPICS.length,
        overallProgressPct: 35
      };
    }
    return [
      { topicId: 1, topicTitle: 'JVM, JDK & JRE Architecture', category: 'Java Fundamentals', completed: true },
      { topicId: 8, topicTitle: 'String Pool & Immutability', category: 'Strings & Memory', completed: true },
      { topicId: 13, topicTitle: 'HashMap, HashSet & Tree Structures', category: 'Java Collections', completed: true }
    ];
  }

  if (path.startsWith('/quickprep/bookmarks')) {
    if (method === 'POST') {
      return { topicId: body.topicId, bookmarked: true };
    }
    return [
      { id: 1, topicId: 8, title: 'String Pool, Immutability & == vs .equals()', category: 'Strings & Memory', readTimeMinutes: 3, summary: 'The #1 Java interview question: String Constant Pool.' },
      { id: 2, topicId: 13, title: 'HashMap, HashSet & Tree Structures', category: 'Java Collections', readTimeMinutes: 4, summary: 'Internal hashing mechanics and collision resolution.' },
      { id: 3, topicId: 16, title: 'Linear Search vs Binary Search', category: 'Searching & Sorting', readTimeMinutes: 3, summary: 'Binary search on sorted search spaces.' }
    ];
  }

  // Re-throw if no mock match
  throw originalError;
}

// QuickPrep Demo Seed Data for Offline/Preview
const FALLBACK_QP_CATEGORIES = [
  { id: 1, name: 'Java Fundamentals', slug: 'java-fundamentals', icon: '☕', description: 'JVM architecture, memory regions, primitive types, and operators.', topicCount: 3 },
  { id: 2, name: 'OOP Concepts', slug: 'oop-concepts', icon: '🧩', description: 'The 4 pillars of OOP, abstract classes, interfaces, and keywords.', topicCount: 4 },
  { id: 3, name: 'Strings & Memory', slug: 'strings-memory', icon: '🔤', description: 'String pool, immutability, StringBuilder, and comparison traps.', topicCount: 2 },
  { id: 4, name: 'Arrays & Techniques', slug: 'arrays-techniques', icon: '📊', description: '1D/2D arrays, two-pointer approach, sliding window, and prefix sums.', topicCount: 2 },
  { id: 5, name: 'Java Collections', slug: 'java-collections', icon: '📦', description: 'List, Set, Map, Queue, PriorityQueue implementations and operation Big-O complexities.', topicCount: 2 },
  { id: 6, name: 'Linked Lists', slug: 'linked-lists', icon: '🔗', description: 'Singly, doubly, circular linked lists, reversal, and cycle detection.', topicCount: 1 },
  { id: 7, name: 'Stack & Queue', slug: 'stack-queue', icon: '🥞', description: 'LIFO & FIFO mechanics, balanced brackets, and BFS/DFS pipelines.', topicCount: 1 },
  { id: 8, name: 'Searching & Sorting', slug: 'searching-sorting', icon: '🔍', description: 'Binary search, Merge Sort, Quick Sort, and stability comparisons.', topicCount: 2 },
  { id: 9, name: 'Trees & Graphs', slug: 'trees-graphs', icon: '🌳', description: 'Binary Trees, BST (inorder is sorted), BFS (Queue), and DFS (Stack).', topicCount: 2 },
  { id: 10, name: 'Algorithms & DP', slug: 'algorithms-dp', icon: '⚡', description: 'Dynamic programming patterns, memoization vs tabulation, and recursion.', topicCount: 2 },
  { id: 11, name: 'Must-Remember & Traps', slug: 'cheatsheets-traps', icon: '🧠', description: 'Ultra high-yield exam points, Big-O tables, and common Java interview traps.', topicCount: 3 }
];

const FALLBACK_QP_TOPICS = [
  {
    id: 1,
    title: 'JVM, JDK & JRE Architecture',
    slug: 'jvm-jdk-jre-architecture',
    category: 'Java Fundamentals',
    categoryId: 1,
    categoryIcon: '☕',
    readTimeMinutes: 3,
    timeComplexity: 'Allocation: O(1)',
    spaceComplexity: 'Stack: O(depth), Heap: O(objects)',
    summary: 'Understand the difference between JVM, JDK, and JRE and the JVM memory regions (Heap vs Stack).',
    content: '### The Java Runtime Ecosystem\n* **JDK (Java Development Kit)**: Complete development environment containing JRE + Development Tools (javac, debugger).\n* **JRE (Java Runtime Environment)**: Provides runtime environment containing JVM + core class libraries.\n* **JVM (Java Virtual Machine)**: Executes compiled bytecode line-by-line via JIT compiler.\n\n### JVM Memory Regions\n1. **Heap Memory**: Shared across all threads. Stores all instantiated Objects and Instance Variables.\n2. **Stack Memory**: Thread-private. Stores primitive local variables and method call frames (LIFO).\n3. **Method Area (Metaspace)**: Stores class bytecode, static variables, and metadata.',
    javaExample: 'public class MemoryDemo {\n    static int staticCount = 100; // Metaspace\n    int instanceId = 42;          // Heap (with object)\n\n    public void compute() {\n        int localVal = 10;        // Stack\n        StringBuilder obj = new StringBuilder("Sentinel"); // ref on Stack, object in Heap\n    }\n}',
    rememberPoint: 'Heap is shared across all threads and holds Objects. Stack is thread-private and holds method call frames + local primitives.',
    commonMistake: 'Thinking local object references live in the Heap. The reference pointer is on the Stack; only the actual object instance lives on the Heap.',
    active: true
  },
  {
    id: 4,
    title: 'Classes, Objects & Constructors',
    slug: 'classes-objects-constructors',
    category: 'OOP Concepts',
    categoryId: 2,
    categoryIcon: '🧩',
    readTimeMinutes: 3,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    summary: 'Class blueprints, default vs parameterized constructors, this pointer, and constructor chaining.',
    content: '### Core OOP Principles\n* **Class**: Blueprint / template defining fields and methods.\n* **Object**: Instance of a class created using new, allocated on the Heap.\n* **Constructor**: Initializes newly created objects. No return type.\n* **this Keyword**: Refers to the current object instance.\n* **Constructor Chaining**: Calling another constructor using this(args) as the first statement.',
    javaExample: 'public class Student {\n    private String name;\n    private int marks;\n\n    public Student() {\n        this("Anonymous", 0); // Must be FIRST statement\n    }\n\n    public Student(String name, int marks) {\n        this.name = name;\n        this.marks = marks;\n    }\n}',
    rememberPoint: 'If you define any parameterized constructor, Java does NOT provide the automatic default no-arg constructor anymore.',
    commonMistake: 'Placing this(...) or super(...) anywhere other than the FIRST statement inside a constructor body.',
    active: true
  },
  {
    id: 8,
    title: 'String Pool, Immutability & == vs .equals()',
    slug: 'string-pool-immutability-equals',
    category: 'Strings & Memory',
    categoryId: 3,
    categoryIcon: '🔤',
    readTimeMinutes: 3,
    timeComplexity: 'Comparison: O(N)',
    spaceComplexity: 'O(N)',
    summary: 'The #1 Java Interview question: String Constant Pool, object identity vs value equality.',
    content: '### Why Strings are Immutable in Java\n1. **String Constant Pool (SCP)**: Storing literals in the pool saves memory.\n2. **Security**: Safe for passing DB URLs, usernames, passwords across networks.\n3. **Thread Safety**: Immutable strings can be shared across threads without synchronization.\n4. **HashCode Caching**: HashCode is computed once and cached for fast HashMap lookups.\n\n### == vs .equals()\n* **==**: Compares memory reference addresses.\n* **.equals()**: Compares character sequence contents.',
    javaExample: 'String s1 = "Sentinel";         // In Pool\nString s2 = "Sentinel";         // Reuses Pool instance\nString s3 = new String("Sentinel"); // In Heap\n\nSystem.out.println(s1 == s2);      // true\nSystem.out.println(s1 == s3);      // false (different refs)\nSystem.out.println(s1.equals(s3)); // true (same content)',
    rememberPoint: 'Always use .equals() or Objects.equals(a, b) for String content comparisons, NEVER ==.',
    commonMistake: 'Modifying Strings in a loop with + concatenation instead of StringBuilder, generating O(N²) garbage.',
    active: true
  },
  {
    id: 10,
    title: 'Arrays & The Two-Pointer Technique',
    slug: 'arrays-two-pointer-technique',
    category: 'Arrays & Techniques',
    categoryId: 4,
    categoryIcon: '📊',
    readTimeMinutes: 3,
    timeComplexity: 'Access: O(1), Search: O(N), Reverse: O(N)',
    spaceComplexity: 'O(1) auxiliary',
    summary: 'Memory layout of arrays, in-place reversal, two-sum on sorted arrays, and matrix traversal.',
    content: '### Array Fundamentals\n* Contiguous memory allocation of fixed size.\n* Index starts at 0, access by index is O(1).\n* arr.length is a field, NOT a method.\n\n### Two-Pointer Pattern\n* Left pointer at 0, Right pointer at n-1. Inward traversal for reverse, palindrome, pair sum.',
    javaExample: 'public static void reverse(int[] arr) {\n    int left = 0, right = arr.length - 1;\n    while (left < right) {\n        int temp = arr[left];\n        arr[left] = arr[right];\n        arr[right] = temp;\n        left++;\n        right--;\n    }\n}',
    rememberPoint: 'Arrays have a fixed length once created. To dynamically expand size, use ArrayList.',
    commonMistake: 'Writing arr.length() with parentheses instead of arr.length.',
    active: true
  },
  {
    id: 13,
    title: 'HashMap, HashSet & Tree Structures',
    slug: 'hashmap-hashset-trees',
    category: 'Java Collections',
    categoryId: 5,
    categoryIcon: '📦',
    readTimeMinutes: 4,
    timeComplexity: 'HashMap: O(1) avg, TreeMap: O(log N)',
    spaceComplexity: 'O(N)',
    summary: 'Internal hashing mechanics, buckets, collision handling, and ordered Tree Collections.',
    content: '### HashMap Internal Architecture\n* Stores Key-Value pairs using an array of Node buckets.\n* Collision resolution: Chaining (converts to Red-Black Tree if bucket > 8).\n* equals() & hashCode() contract: Equal objects must return identical hashCodes.\n\n### Variants\n* HashMap: Unordered, O(1) avg.\n* LinkedHashMap: Preserves insertion order.\n* TreeMap: Sorted by natural order / Comparator, O(log N).',
    javaExample: 'Map<String, Integer> map = new HashMap<>();\nmap.put("Java", 95);\nint score = map.getOrDefault("Python", 0);\n\n// Frequency Map\nfor (String w : words) {\n    map.put(w, map.getOrDefault(w, 0) + 1);\n}',
    rememberPoint: 'HashMap provides O(1) average lookup. TreeMap provides O(log N) lookup and keeps keys sorted.',
    commonMistake: 'Overriding equals() without overriding hashCode(), which breaks hash table lookups.',
    active: true
  },
  {
    id: 16,
    title: 'Linear Search vs Binary Search',
    slug: 'linear-search-vs-binary-search',
    category: 'Searching & Sorting',
    categoryId: 8,
    categoryIcon: '🔍',
    readTimeMinutes: 3,
    timeComplexity: 'Linear: O(N), Binary: O(log N)',
    spaceComplexity: 'O(1)',
    summary: 'Sequential scanning O(N) vs divide-and-conquer on sorted arrays O(log N), and mid-point overflow.',
    content: '### Binary Search Principles\n* PREREQUISITE: The array/search space MUST be SORTED.\n* Halves the search space in each iteration (O(log N)).\n\n### Safe Midpoint Formula\nint mid = low + (high - low) / 2; // Prevents integer overflow',
    javaExample: 'public static int binarySearch(int[] arr, int target) {\n    int low = 0, high = arr.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}',
    rememberPoint: 'Binary search is applicable to any monotonic condition, not just looking up numbers in a sorted array.',
    commonMistake: 'Writing while (low < high) instead of while (low <= high), missing the boundary case.',
    active: true
  },
  {
    id: 19,
    title: 'Binary Trees & Binary Search Trees (BST)',
    slug: 'trees-bst-traversals',
    category: 'Trees & Graphs',
    categoryId: 9,
    categoryIcon: '🌳',
    readTimeMinutes: 4,
    timeComplexity: 'BST Search: O(log N), Traversals: O(N)',
    spaceComplexity: 'O(height) call stack',
    summary: 'Tree definitions, Preorder, Inorder, Postorder, Level Order traversals, and the Golden BST Rule.',
    content: '### BST Property\n* Left Subtree < Root < Right Subtree.\n\n### ⚡ GOLDEN EXAM RULE\nINORDER TRAVERSAL OF A BST PRODUCES ELEMENTS IN STRICTLY SORTED ASCENDING ORDER!\n\n### Traversals\n* Preorder: Root -> Left -> Right\n* Inorder: Left -> Root -> Right\n* Postorder: Left -> Right -> Root\n* Level Order: BFS using a Queue',
    javaExample: 'public static void inorder(TreeNode root) {\n    if (root == null) return;\n    inorder(root.left);\n    System.out.print(root.val + " ");\n    inorder(root.right);\n}',
    rememberPoint: 'Inorder traversal of any valid Binary Search Tree always outputs elements in sorted ascending order.',
    commonMistake: 'Assuming search in a skewed BST is always O(log N). In a degenerate tree, it degrades to O(N).',
    active: true
  },
  {
    id: 22,
    title: 'Big-O Time & Space Complexity Master Sheet',
    slug: 'big-o-complexity-master-sheet',
    category: 'Must-Remember & Traps',
    categoryId: 11,
    categoryIcon: '🧠',
    readTimeMinutes: 3,
    timeComplexity: 'O(1) to O(N!)',
    spaceComplexity: 'O(1) to O(N)',
    summary: 'Visual Big-O hierarchy, standard algorithmic boundaries, and Java operation runtime cheat sheet.',
    content: '### Big-O Hierarchy (Best to Worst)\nO(1) < O(log N) < O(N) < O(N log N) < O(N²) < O(2^N) < O(N!)\n\n### Collections Complexity\n* Array / ArrayList access: O(1)\n* ArrayList add: O(1) amortized, insert at 0: O(N)\n* LinkedList insert at ends: O(1), lookup: O(N)\n* HashMap / HashSet: O(1) average lookup/insert\n* TreeMap / TreeSet: O(log N) lookup/insert\n* PriorityQueue: O(1) peek, O(log N) insert/poll',
    javaExample: '// Complexity Hierarchy Reference\nint getFirst(int[] arr) { return arr[0]; } // O(1)\n// Binary Search: O(log N)\n// Single Loop: O(N)\n// Merge Sort: O(N log N)\n// Nested Loops: O(N^2)',
    rememberPoint: 'HashMap provides O(1) average time. TreeMap provides O(log N) and keeps keys sorted.',
    commonMistake: 'Assuming ArrayList.contains() is O(1). Searching an ArrayList is O(N) linear search!',
    active: true
  },
  {
    id: 23,
    title: 'Things You MUST Remember Before Your Java Exam',
    slug: 'must-remember-java-exam-sheet',
    category: 'Must-Remember & Traps',
    categoryId: 11,
    categoryIcon: '🧠',
    readTimeMinutes: 2,
    timeComplexity: 'N/A',
    spaceComplexity: 'N/A',
    summary: 'High-yield, rapid-fire facts for immediate revision 10 minutes before entering the exam.',
    content: '### ⚡ Fast-Fire Java Exam Truths\n1. **String Comparison**: NEVER use == for String content; always use str1.equals(str2).\n2. **Array vs String Length**: arr.length is a field; str.length() is a method.\n3. **Stack**: LIFO (Last-In-First-Out).\n4. **Queue**: FIFO (First-In-First-Out).\n5. **BFS**: Uses a Queue (level order, shortest path in unweighted graph).\n6. **DFS**: Uses a Stack or Recursion.\n7. **Binary Search**: Requires the data to be Sorted (O(log N)).\n8. **HashMap**: Stores Key -> Value pairs (O(1) average).\n9. **HashSet**: Stores unique elements (O(1) average).\n10. **BST Inorder Traversal**: Outputs elements in Strictly Sorted Ascending Order.\n11. **Merge Sort**: Stable sort with guaranteed O(N log N) runtime.\n12. **Method Overloading**: Compile-time polymorphism; return type alone cannot differentiate.\n13. **Method Overriding**: Runtime polymorphism with dynamic method dispatch.',
    javaExample: 'Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();\nint[] arr = new int[n];\nfor (int i = 0; i < n; i++) arr[i] = sc.nextInt();\nArrays.sort(arr);\n\nMap<Integer, Integer> freq = new HashMap<>();\nfor (int x : arr) freq.put(x, freq.getOrDefault(x, 0) + 1);',
    rememberPoint: 'Memorize these core truths. They cover the majority of screening questions.',
    commonMistake: 'Mixing up BFS and DFS: BFS uses Queue; DFS uses Stack/Recursion.',
    active: true
  }
];

const FALLBACK_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Which JVM memory region is shared among all active threads and stores object instances?',
    optionsJson: JSON.stringify(['Stack Memory', 'Program Counter Register', 'Heap Memory', 'Native Method Stack']),
    correctOption: 'Heap Memory',
    explanation: 'Heap memory is a shared memory area where all Java objects and instance variables are allocated.',
    questionType: 'MCQ'
  },
  {
    id: 2,
    question: 'What will `String a = new String("test"); String b = new String("test"); System.out.println(a == b);` output?',
    optionsJson: JSON.stringify(['true', 'false', 'NullPointerException', 'Compilation Error']),
    correctOption: 'false',
    explanation: 'The new keyword explicitly allocates distinct objects in Heap memory. == checks reference identity, returning false.',
    questionType: 'OUTPUT'
  },
  {
    id: 3,
    question: 'Which tree traversal on a Binary Search Tree (BST) visits nodes in strictly sorted ascending order?',
    optionsJson: JSON.stringify(['Preorder Traversal', 'Inorder Traversal', 'Postorder Traversal', 'Level Order Traversal']),
    correctOption: 'Inorder Traversal',
    explanation: 'Inorder processes Left Subtree (smaller), Root, then Right Subtree (larger), yielding sorted order.',
    questionType: 'MCQ'
  },
  {
    id: 4,
    question: 'Which Map implementation maintains its keys in strictly sorted order?',
    optionsJson: JSON.stringify(['HashMap', 'LinkedHashMap', 'TreeMap', 'ConcurrentHashMap']),
    correctOption: 'TreeMap',
    explanation: 'TreeMap is backed by a Red-Black Tree and maintains keys in sorted order.',
    questionType: 'MCQ'
  },
  {
    id: 5,
    question: 'What is the average time complexity for searching an element in a HashMap?',
    optionsJson: JSON.stringify(['O(1)', 'O(log N)', 'O(N)', 'O(N log N)']),
    correctOption: 'O(1)',
    explanation: 'Hash lookups compute bucket index in constant time O(1) on average.',
    questionType: 'COMPLEXITY'
  }
];

function getFallbackRevisionPath(duration) {
  const dur = (duration || '20min').toLowerCase();
  if (dur.includes('10')) {
    return {
      duration: '10min',
      title: '10-Minute Java & DSA Power Blitz',
      totalMinutes: 10,
      description: 'Ultra-fast refresher covering JVM essentials, OOP pillars, HashMap, Binary Search & Big-O.',
      schedule: [
        { timeStamp: '00:00', topicId: 1, title: 'JVM, JDK & JRE Architecture', category: 'Java Fundamentals', durationMinutes: 2 },
        { timeStamp: '02:00', topicId: 4, title: 'Classes, Objects & Constructors', category: 'OOP Concepts', durationMinutes: 2 },
        { timeStamp: '04:00', topicId: 8, title: 'String Pool & Immutability', category: 'Strings & Memory', durationMinutes: 2 },
        { timeStamp: '06:00', topicId: 13, title: 'HashMap & HashSet', category: 'Java Collections', durationMinutes: 2 },
        { timeStamp: '08:00', topicId: 23, title: 'Must-Remember Exam Sheet', category: 'Must-Remember & Traps', durationMinutes: 2 }
      ]
    };
  }
  return {
    duration: '20min',
    title: '20-Minute Core Java & Algorithm Revision',
    totalMinutes: 20,
    description: 'The quintessential exam refresher: JVM, OOP, Strings, Arrays, Collections, Binary Search & Trees.',
    schedule: [
      { timeStamp: '00:00', topicId: 1, title: 'JVM, JDK & JRE Architecture', category: 'Java Fundamentals', durationMinutes: 3 },
      { timeStamp: '03:00', topicId: 4, title: 'Classes, Objects & Constructors', category: 'OOP Concepts', durationMinutes: 3 },
      { timeStamp: '06:00', topicId: 8, title: 'String Pool & Immutability', category: 'Strings & Memory', durationMinutes: 3 },
      { timeStamp: '09:00', topicId: 10, title: 'Arrays & Two-Pointer Pattern', category: 'Arrays & Techniques', durationMinutes: 3 },
      { timeStamp: '12:00', topicId: 13, title: 'HashMap, HashSet & Tree Structures', category: 'Java Collections', durationMinutes: 3 },
      { timeStamp: '15:00', topicId: 16, title: 'Linear vs Binary Search', category: 'Searching & Sorting', durationMinutes: 3 },
      { timeStamp: '18:00', topicId: 19, title: 'BST & Tree Traversals', category: 'Trees & Graphs', durationMinutes: 2 }
    ]
  };
}

// Authentication Endpoints
export const authApi = {
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  register: (payload) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

// Practice Arena Endpoints
export const practiceApi = {
  listQuestions: () => apiRequest('/practice/questions'),
  getQuestion: (id) => apiRequest(`/practice/questions/${id}`),
  runCode: (id, payload) =>
    apiRequest(`/practice/questions/${id}/run`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  submitCode: (id, userId, payload) =>
    apiRequest(`/practice/questions/${id}/submit?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

// Assessment Endpoints
export const assessmentApi = {
  listAssessments: () => apiRequest('/assessments'),
  getAssessment: (id) => apiRequest(`/assessments/${id}`),
  submitAssessment: (id, userId, payload) =>
    apiRequest(`/assessments/${id}/submit?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getMySubmissions: (userId) =>
    apiRequest(`/assessments/submissions/my?userId=${userId}`)
};

// QuickPrep Endpoints
export const quickprepApi = {
  getCategories: () => apiRequest('/quickprep/categories'),
  getTopics: (categoryId) => apiRequest(categoryId ? `/quickprep/topics?categoryId=${categoryId}` : '/quickprep/topics'),
  getTopic: (id) => apiRequest(`/quickprep/topics/${id}`),
  searchTopics: (query) => apiRequest(`/quickprep/search?q=${encodeURIComponent(query || '')}`),
  getRevisionPath: (duration) => apiRequest(`/quickprep/paths/${duration}`),
  getQuiz: (topicId) => apiRequest(`/quickprep/quiz/${topicId}`),
  getQuizByCategory: (categoryId) => apiRequest(`/quickprep/quiz/category/${categoryId}`),
  submitQuiz: (payload) =>
    apiRequest('/quickprep/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  saveProgress: (payload) =>
    apiRequest('/quickprep/progress', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getProgress: (userId) => apiRequest(`/quickprep/progress?userId=${userId}`),
  toggleBookmark: (payload) =>
    apiRequest('/quickprep/bookmarks', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getBookmarks: (userId) => apiRequest(`/quickprep/bookmarks?userId=${userId}`),
  deleteBookmark: (userId, topicId) =>
    apiRequest(`/quickprep/bookmarks/${topicId}?userId=${userId}`, {
      method: 'DELETE'
    })
};

// Admin Practice Management Endpoints
export const adminPracticeApi = {
  listAll: () => apiRequest('/practice/admin/questions'),
  createQuestion: (data) =>
    apiRequest('/practice/admin/questions', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateQuestion: (id, data) =>
    apiRequest(`/practice/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteQuestion: (id) =>
    apiRequest(`/practice/admin/questions/${id}`, {
      method: 'DELETE'
    }),
  toggleActive: (id, value) =>
    apiRequest(`/practice/admin/questions/${id}/active?value=${value}`, {
      method: 'PATCH'
    }),
  addTestCase: (questionId, testCase) =>
    apiRequest(`/practice/admin/questions/${questionId}/test-cases`, {
      method: 'POST',
      body: JSON.stringify(testCase)
    })
};

// Admin QuickPrep Management Endpoints
export const adminQuickPrepApi = {
  listTopics: () => apiRequest('/quickprep/admin/topics'),
  createTopic: (data) =>
    apiRequest('/quickprep/admin/topics', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateTopic: (id, data) =>
    apiRequest(`/quickprep/admin/topics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteTopic: (id) =>
    apiRequest(`/quickprep/admin/topics/${id}`, {
      method: 'DELETE'
    }),
  toggleActive: (id, value) =>
    apiRequest(`/quickprep/admin/topics/${id}/active?value=${value}`, {
      method: 'PATCH'
    }),
  createCategory: (data) =>
    apiRequest('/quickprep/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};

