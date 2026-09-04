package com.sentinelassess.config;

import com.sentinelassess.entity.*;
import com.sentinelassess.entity.Role;
import com.sentinelassess.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
 @Bean CommandLineRunner seed(UserRepository users,
                              PracticeQuestionRepository qs,
                              PracticeTestCaseRepository ts,
                              AssessmentRepository assessments,
                              AssessmentQuestionRepository assessmentQuestions,
                              AssessmentSubmissionRepository submissions,
                              PasswordEncoder encoder){
  return args->{
   if(users.findByEmail("admin@assessx.local").isEmpty())
    users.save(User.builder().username("Admin").email("admin@assessx.local").password(encoder.encode("Admin@123")).role(Role.ROLE_ADMIN).build());
   if(users.findByEmail("student@assessx.local").isEmpty())
    users.save(User.builder().username("Student").email("student@assessx.local").password(encoder.encode("Student@123")).role(Role.ROLE_STUDENT).build());
   if(users.findByEmail("admin@sentinelassess.local").isEmpty())
    users.save(User.builder().username("Admin").email("admin@sentinelassess.local").password(encoder.encode("Admin@123")).role(Role.ROLE_ADMIN).build());
   if(users.findByEmail("student@sentinelassess.local").isEmpty())
    users.save(User.builder().username("Student").email("student@sentinelassess.local").password(encoder.encode("Student@123")).role(Role.ROLE_STUDENT).build());
   
   // Refresh assessments with rich MCQs and clean, unsolved coding questions
   submissions.deleteAll();
   assessmentQuestions.deleteAll();
   assessments.deleteAll();
   seedAssessments(assessments, assessmentQuestions);

   if(qs.count()>0)return;
   seedQuestion(qs,ts,"Reverse a String","Strings","Easy","Java",
     "Reverse the characters of the given string.","hello","olleh",
     "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Reverse string\n    }\n}",
     "5\nhello","olleh");
   seedQuestion(qs,ts,"Count Vowels","Strings","Easy","Java","Count vowels in a string.","education","5",
     "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Count vowels\n    }\n}",
     "education","5");
   seedQuestion(qs,ts,"Largest Element","Arrays","Easy","Java","Find the largest integer in an array.","5\n2 8 3 10 4","10",
     "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Find largest element\n    }\n}",
     "5\n2 8 3 10 4","10");
   seedQuestion(qs,ts,"Second Largest Element","Arrays","Easy","Java","Find the second largest distinct element.","5\n10 5 8 10 3","8",
     "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Find second largest\n    }\n}",
     "5\n10 5 8 10 3","8");
   seedQuestion(qs,ts,"Palindrome Check","Strings","Easy","Java","Check whether a string is a palindrome.","madam","YES",
     "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: Check palindrome\n    }\n}",
     "madam","YES");
  };
 }

 private void seedAssessments(AssessmentRepository assessments, AssessmentQuestionRepository questions) {
   // Assessment 1: Core Java & Data Structures Proctored Assessment (MCQs + Coding)
   Assessment a1 = Assessment.builder()
     .title("AssessX Core Java & Data Structures Proctored Assessment")
     .description("Comprehensive proctored assessment evaluating Core Java, Collections, OOPs, and Problem Solving. Includes MCQs and Coding problems. Strict camera proctoring enabled.")
     .durationMinutes(45)
     .published(true)
     .build();
   assessments.save(a1);

   // MCQ 1
   questions.save(AssessmentQuestion.builder()
     .assessment(a1)
     .type("MCQ")
     .title("Java Memory Model & Heap Allocation")
     .description("Which JVM memory region is shared across all concurrent application threads and stores all instantiated objects?")
     .marks(15)
     .optionsJson("[\"A) Java Thread Stack\", \"B) Program Counter (PC) Register\", \"C) Heap Memory\", \"D) Native Method Stack\"]")
     .correctOption("C")
     .build());

   // MCQ 2
   questions.save(AssessmentQuestion.builder()
     .assessment(a1)
     .type("MCQ")
     .title("Collections Framework Ordering")
     .description("Which Java Set implementation maintains elements in the exact order in which they were inserted?")
     .marks(15)
     .optionsJson("[\"A) HashSet\", \"B) TreeSet\", \"C) LinkedHashSet\", \"D) EnumSet\"]")
     .correctOption("C")
     .build());

   // CODING 1 (Clean unsolved boilerplate)
   questions.save(AssessmentQuestion.builder()
     .assessment(a1)
     .type("CODING")
     .title("Balanced Parentheses & Brackets Validator")
     .description("Given a string containing only '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nInput format: String on standard input.\nOutput format: Print 'true' if valid, 'false' otherwise.\n\nSample Input: {[()]}\nSample Output: true")
     .marks(35)
     .starterCode("import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) return;\n        String s = sc.nextLine().trim();\n        \n        // TODO: Implement your bracket validation logic here\n        \n    }\n}")
     .referenceSolution("import java.util.*;\npublic class Main { public static void main(String[] args){ Scanner sc=new Scanner(System.in); String s=sc.nextLine(); Stack<Character> st=new Stack<>(); for(char c:s.toCharArray()){ if(c=='(') st.push(')'); else if(c=='{') st.push('}'); else if(c=='[') st.push(']'); else if(st.isEmpty() || st.pop()!=c){ System.out.println(\"false\"); return; } } System.out.println(st.isEmpty()); } }")
     .build());

   // CODING 2 (Clean unsolved boilerplate)
   questions.save(AssessmentQuestion.builder()
     .assessment(a1)
     .type("CODING")
     .title("Longest Substring Without Repeating Characters")
     .description("Given a string s, find the length of the longest contiguous substring without repeating characters.\n\nSample Input: abcabcbb\nSample Output: 3")
     .marks(35)
     .starterCode("import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine() : \"\";\n        \n        // TODO: Implement sliding window logic to find the longest unique substring length\n        \n    }\n}")
     .referenceSolution("import java.util.*;\npublic class Main { public static void main(String[] args){ Scanner sc=new Scanner(System.in); String s=sc.hasNextLine()?sc.nextLine():\"\"; int maxLen=0, left=0; Map<Character,Integer> map=new HashMap<>(); for(int r=0; r<s.length(); r++){ char c=s.charAt(r); if(map.containsKey(c)) left=Math.max(left, map.get(c)+1); map.put(c, r); maxLen=Math.max(maxLen, r-left+1); } System.out.println(maxLen); } }")
     .build());

   // Assessment 2: Advanced Full-Stack & System Logic Challenge
   Assessment a2 = Assessment.builder()
     .title("Advanced Full-Stack & System Logic Proctored Challenge")
     .description("Senior engineer assessment evaluating high-performance algorithmic execution, concurrency, and system design patterns.")
     .durationMinutes(60)
     .published(true)
     .build();
   assessments.save(a2);

   // MCQ 1
   questions.save(AssessmentQuestion.builder()
     .assessment(a2)
     .type("MCQ")
     .title("Spring Transaction Rollback Behavior")
     .description("By default, what causes a method annotated with Spring's @Transactional to roll back its database transaction?")
     .marks(15)
     .optionsJson("[\"A) Any checked Exception thrown\", \"B) Only RuntimeException (Unchecked) or Error\", \"C) Returning null from the method\", \"D) Exceeding HTTP request timeout\"]")
     .correctOption("B")
     .build());

   // MCQ 2
   questions.save(AssessmentQuestion.builder()
     .assessment(a2)
     .type("MCQ")
     .title("Time Complexity of Balanced BST Operations")
     .description("What is the average time complexity for searching, insertion, and deletion in a balanced Binary Search Tree (such as Red-Black Tree)?")
     .marks(15)
     .optionsJson("[\"A) O(1)\", \"B) O(log N)\", \"C) O(N)\", \"D) O(N log N)\"]")
     .correctOption("B")
     .build());

   // CODING 1 (Clean unsolved boilerplate)
   questions.save(AssessmentQuestion.builder()
     .assessment(a2)
     .type("CODING")
     .title("Sliding Window Maximum")
     .description("Given an array of integers and a window size k, output the maximum value in each sliding window of size k from left to right.\n\nSample Input:\n8 3\n1 3 -1 -3 5 3 6 7\nSample Output:\n3 3 5 5 6 7")
     .marks(35)
     .starterCode("import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int k = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        \n        // TODO: Compute sliding window maximum for each window of size k\n        \n    }\n}")
     .referenceSolution("import java.util.*;\npublic class Main { public static void main(String[] args){ Scanner sc=new Scanner(System.in); int n=sc.nextInt(), k=sc.nextInt(), a[]=new int[n]; for(int i=0;i<n;i++) a[i]=sc.nextInt(); Deque<Integer> q=new ArrayDeque<>(); StringBuilder sb=new StringBuilder(); for(int i=0; i<n; i++){ while(!q.isEmpty() && q.peekFirst() <= i-k) q.pollFirst(); while(!q.isEmpty() && a[q.peekLast()] <= a[i]) q.pollLast(); q.offerLast(i); if(i >= k-1) sb.append(a[q.peekFirst()]).append(i==n-1?\"\":\" \"); } System.out.println(sb.toString()); } }")
     .build());

   // CODING 2 (Clean unsolved boilerplate)
   questions.save(AssessmentQuestion.builder()
     .assessment(a2)
     .type("CODING")
     .title("Container With Most Water")
     .description("Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container containing the maximum amount of water.\n\nSample Input:\n9\n1 8 6 2 5 4 8 3 7\nSample Output:\n49")
     .marks(35)
     .starterCode("import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] h = new int[n];\n        for (int i = 0; i < n; i++) h[i] = sc.nextInt();\n        \n        // TODO: Calculate maximum water trapped between two vertical lines\n        \n    }\n}")
     .referenceSolution("import java.util.*;\npublic class Main { public static void main(String[] args){ Scanner sc=new Scanner(System.in); int n=sc.nextInt(), h[]=new int[n]; for(int i=0;i<n;i++) h[i]=sc.nextInt(); int l=0, r=n-1, maxA=0; while(l<r){ maxA=Math.max(maxA, Math.min(h[l], h[r])*(r-l)); if(h[l]<h[r]) l++; else r--; } System.out.println(maxA); } }")
     .build());

   // Assessment 3: Software Engineering & Algorithms Fast-Track Test
   Assessment a3 = Assessment.builder()
     .title("Software Engineering & Algorithms Fast-Track Test")
     .description("Fast-paced evaluation focusing on core algorithmic efficiency, string anagrams, and array transformations.")
     .durationMinutes(30)
     .published(true)
     .build();
   assessments.save(a3);

   // MCQ 1
   questions.save(AssessmentQuestion.builder()
     .assessment(a3)
     .type("MCQ")
     .title("HTTP Status Code for Authentication Failure")
     .description("Which standard HTTP status code signifies that the client request lacks valid authentication credentials for the requested target resource?")
     .marks(20)
     .optionsJson("[\"A) 400 Bad Request\", \"B) 401 Unauthorized\", \"C) 403 Forbidden\", \"D) 404 Not Found\"]")
     .correctOption("B")
     .build());

   // CODING 1 (Clean unsolved boilerplate)
   questions.save(AssessmentQuestion.builder()
     .assessment(a3)
     .type("CODING")
     .title("First Non-Repeating Character")
     .description("Find the index (0-indexed) of the first non-repeating character in a lowercase string. Print -1 if none exists.\n\nSample Input:\nleetcode\nSample Output:\n0")
     .marks(40)
     .starterCode("import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine().trim() : \"\";\n        \n        // TODO: Find and print index of first non-repeating character\n        \n    }\n}")
     .referenceSolution("import java.util.*;\npublic class Main { public static void main(String[] args){ Scanner sc=new Scanner(System.in); String s=sc.nextLine(); int[] f=new int[26]; for(char c:s.toCharArray()) f[c-'a']++; for(int i=0;i<s.length();i++) if(f[s.charAt(i)-'a']==1){ System.out.println(i); return; } System.out.println(-1); } }")
     .build());

   // CODING 2 (Clean unsolved boilerplate)
   questions.save(AssessmentQuestion.builder()
     .assessment(a3)
     .type("CODING")
     .title("Rotate Array by K Positions")
     .description("Given an array of N integers, rotate the array to the right by K positions.\n\nSample Input:\n7 3\n1 2 3 4 5 6 7\nSample Output:\n5 6 7 1 2 3 4")
     .marks(40)
     .starterCode("import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int k = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        \n        // TODO: Rotate array to the right by k positions and print result\n        \n    }\n}")
     .referenceSolution("import java.util.*;\npublic class Main { public static void main(String[] args){ Scanner sc=new Scanner(System.in); int n=sc.nextInt(), k=sc.nextInt()%n, a[]=new int[n]; for(int i=0;i<n;i++) a[i]=sc.nextInt(); int[] res=new int[n]; for(int i=0;i<n;i++) res[(i+k)%n]=a[i]; for(int i=0;i<n;i++) System.out.print(res[i]+(i==n-1?\"\":\" \")); } }")
     .build());
 }

 private void seedQuestion(PracticeQuestionRepository qs,PracticeTestCaseRepository ts,String title,String cat,String diff,String lang,
   String desc,String sampleIn,String sampleOut,String starter,String hiddenIn,String hiddenOut){
   PracticeQuestion q=PracticeQuestion.builder().title(title).description(desc).category(cat).subcategory(cat)
    .difficulty(Difficulty.valueOf(diff.toUpperCase())).language(lang).starterCode(starter)
    .constraints("Use standard input and output. Avoid unnecessary prompts.").inputFormat("Input is provided on standard input.")
    .outputFormat("Print the required answer to standard output.").sampleInput(sampleIn).sampleOutput(sampleOut)
    .explanation("Practice problem with visible examples and private evaluation tests.")
    .referenceSolution(starter).active(true).build();
   qs.save(q);
   ts.save(PracticeTestCase.builder().practiceQuestion(q).input(sampleIn).expectedOutput(sampleOut).hidden(false).points(
      diff.equalsIgnoreCase("Easy")?5:diff.equalsIgnoreCase("Medium")?10:15).build());
   ts.save(PracticeTestCase.builder().practiceQuestion(q).input(hiddenIn).expectedOutput(hiddenOut).hidden(true).points(
      diff.equalsIgnoreCase("Easy")?5:diff.equalsIgnoreCase("Medium")?10:15).build());
 }
}
