package com.sentinelassess.config;

import com.sentinelassess.entity.*;
import com.sentinelassess.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
public class QuickPrepSeeder {

    @Bean
    @Order(10)
    CommandLineRunner seedQuickPrep(QuickPrepCategoryRepository catRepo,
                                   QuickPrepTopicRepository topicRepo,
                                   QuickPrepQuizQuestionRepository quizRepo) {
        return args -> {
            if (catRepo.count() > 0 && topicRepo.count() > 0) {
                return;
            }

            // 1. Categories
            QuickPrepCategory catFund = catRepo.save(QuickPrepCategory.builder()
                .name("Java Fundamentals")
                .slug("java-fundamentals")
                .icon("☕")
                .description("JVM architecture, memory regions, primitive types, operators, and control flow.")
                .displayOrder(1)
                .build());

            QuickPrepCategory catOop = catRepo.save(QuickPrepCategory.builder()
                .name("OOP Concepts")
                .slug("oop-concepts")
                .icon("🧩")
                .description("The 4 pillars of OOP, abstract classes, interfaces, polymorphism, and keywords.")
                .displayOrder(2)
                .build());

            QuickPrepCategory catStrings = catRepo.save(QuickPrepCategory.builder()
                .name("Strings & Memory")
                .slug("strings-memory")
                .icon("🔤")
                .description("String pool, immutability, StringBuilder, StringBuffer, and comparison traps.")
                .displayOrder(3)
                .build());

            QuickPrepCategory catArrays = catRepo.save(QuickPrepCategory.builder()
                .name("Arrays & Techniques")
                .slug("arrays-techniques")
                .icon("📊")
                .description("1D/2D arrays, two-pointer approach, sliding window, prefix sums, and transformations.")
                .displayOrder(4)
                .build());

            QuickPrepCategory catCollections = catRepo.save(QuickPrepCategory.builder()
                .name("Java Collections")
                .slug("java-collections")
                .icon("📦")
                .description("List, Set, Map, Queue, PriorityQueue implementations and operation Big-O complexities.")
                .displayOrder(5)
                .build());

            QuickPrepCategory catLinkedList = catRepo.save(QuickPrepCategory.builder()
                .name("Linked Lists")
                .slug("linked-lists")
                .icon("🔗")
                .description("Singly, doubly, circular linked lists, pointer reversal, cycle detection, and merging.")
                .displayOrder(6)
                .build());

            QuickPrepCategory catStackQueue = catRepo.save(QuickPrepCategory.builder()
                .name("Stack & Queue")
                .slug("stack-queue")
                .icon("🥞")
                .description("LIFO & FIFO mechanics, balanced brackets, Next Greater Element, and BFS/DFS pipelines.")
                .displayOrder(7)
                .build());

            QuickPrepCategory catSearchSort = catRepo.save(QuickPrepCategory.builder()
                .name("Searching & Sorting")
                .slug("searching-sorting")
                .icon("🔍")
                .description("Binary search on sorted space, Merge Sort, Quick Sort, and stability comparisons.")
                .displayOrder(8)
                .build());

            QuickPrepCategory catTreesGraphs = catRepo.save(QuickPrepCategory.builder()
                .name("Trees & Graphs")
                .slug("trees-graphs")
                .icon("🌳")
                .description("Binary Trees, BST (inorder is sorted), BFS (Queue), DFS (Stack), and adjacency structures.")
                .displayOrder(9)
                .build());

            QuickPrepCategory catAlgos = catRepo.save(QuickPrepCategory.builder()
                .name("Algorithms & DP")
                .slug("algorithms-dp")
                .icon("⚡")
                .description("Dynamic programming patterns, memoization vs tabulation, greedy choice, and recursion.")
                .displayOrder(10)
                .build());

            QuickPrepCategory catCheatsheets = catRepo.save(QuickPrepCategory.builder()
                .name("Must-Remember & Traps")
                .slug("cheatsheets-traps")
                .icon("🧠")
                .description("Ultra high-yield exam points, Big-O tables, and common Java interview trap questions.")
                .displayOrder(11)
                .build());

            // 2. Topics Seeding

            // Topic 1: JVM, JDK, and JRE Architecture
            QuickPrepTopic t1 = topicRepo.save(QuickPrepTopic.builder()
                .title("JVM, JDK & JRE Architecture")
                .slug("jvm-jdk-jre-architecture")
                .category(catFund)
                .summary("Understand the difference between JVM, JDK, and JRE and the JVM memory regions (Heap vs Stack).")
                .content("""
                    ### The Java Runtime Ecosystem
                    * JDK (Java Development Kit): Complete development environment containing JRE + Development Tools (javac, debugger, javadoc).
                    * JRE (Java Runtime Environment): Provides runtime environment to execute Java bytecode. Contains JVM + core Java class libraries.
                    * JVM (Java Virtual Machine): Abstract machine that executes compiled .class bytecode line-by-line via JIT (Just-In-Time) compiler.

                    ### JVM Memory Areas
                    1. Heap Memory: Shared across all threads. Stores all instantiated Objects and Instance Variables. Garbage Collector runs here.
                    2. Stack Memory: Thread-private. Stores primitive local variables and method execution frames (LIFO).
                    3. Method Area (Metaspace): Stores class-level data, bytecode, static variables, and method definitions.
                    4. PC Register: Holds address of currently executing JVM instruction.
                    """)
                .javaExample("""
                    public class MemoryDemo {
                        // Stored in Metaspace
                        static int staticCount = 100;

                        // Instance variable -> stored in HEAP with object
                        int instanceId = 42;

                        public void compute() {
                            // Local primitive -> stored in STACK
                            int localVal = 10;

                            // 'obj' reference is in STACK, the new Object is in HEAP
                            StringBuilder obj = new StringBuilder("Sentinel");
                        }
                    }
                    """)
                .rememberPoint("Heap is shared across all threads and holds Objects. Stack is thread-private and holds method call frames + local primitives.")
                .commonMistake("Thinking local object references live in the Heap. The reference pointer is on the Stack; only the actual object instance lives on the Heap.")
                .timeComplexity("Allocation: O(1)")
                .spaceComplexity("Stack: O(depth), Heap: O(objects)")
                .readTimeMinutes(3)
                .displayOrder(1)
                .active(true)
                .build());

            quizRepo.save(QuickPrepQuizQuestion.builder()
                .topic(t1)
                .question("Which JVM memory region is shared among all active threads and stores object instances?")
                .optionsJson("[\"Stack Memory\", \"Program Counter Register\", \"Heap Memory\", \"Native Method Stack\"]")
                .correctOption("Heap Memory")
                .explanation("Heap memory is a shared memory area in the JVM where all Java objects and their instance variables are allocated.")
                .questionType("MCQ")
                .build());

            quizRepo.save(QuickPrepQuizQuestion.builder()
                .topic(t1)
                .question("What does JIT in Java stand for and what is its primary role?")
                .optionsJson("[\"Java Interface Tool: handles UI rendering\", \"Just-In-Time Compiler: compiles hot bytecode into native machine code at runtime\", \"Java Iterator Thread: manages garbage collection\", \"Joint Instruction Translator: translates C to Java\"]")
                .correctOption("Just-In-Time Compiler: compiles hot bytecode into native machine code at runtime")
                .explanation("The JIT compiler improves execution speed by compiling frequently executed bytecode sections (hot spots) directly into native machine code.")
                .questionType("MCQ")
                .build());

            // Topic 2: Variables, Data Types & Type Casting
            QuickPrepTopic t2 = topicRepo.save(QuickPrepTopic.builder()
                .title("Variables, Primitives & Type Casting")
                .slug("variables-primitives-type-casting")
                .category(catFund)
                .summary("8 Primitive types, widening vs narrowing type casting, and integer overflow caveats.")
                .content("""
                    ### Java's 8 Primitive Data Types
                    * byte (8-bit, -128 to 127)
                    * short (16-bit)
                    * int (32-bit, default integer literal)
                    * long (64-bit, suffix L)
                    * float (32-bit, suffix f)
                    * double (64-bit, default floating point)
                    * char (16-bit Unicode character)
                    * boolean (true or false)

                    ### Type Casting Rules
                    * Implicit / Widening (Automatic): Small type to Large type: byte -> short -> int -> long -> float -> double. No data loss.
                    * Explicit / Narrowing (Manual): Large type to Small type: (int) 3.99 evaluates to 3. Potential truncation or overflow!
                    """)
                .javaExample("""
                    public class CastingDemo {
                        public static void main(String[] args) {
                            // Widening (automatic)
                            int x = 100;
                            double d = x; // 100.0

                            // Narrowing (explicit cast)
                            double pi = 3.14159;
                            int intPi = (int) pi; // 3 (truncated, not rounded!)

                            // Integer Overflow Trap
                            int max = Integer.MAX_VALUE;
                            System.out.println(max + 1); // Prints -2147483648 (wraps around!)
                        }
                    }
                    """)
                .rememberPoint("Explicit casting from double/float to int truncates the decimal portion towards zero; it does NOT round.")
                .commonMistake("Writing float f = 3.5; without the 'f' suffix. Floating-point literals default to double, causing a compilation error.")
                .timeComplexity("O(1)")
                .spaceComplexity("O(1)")
                .readTimeMinutes(2)
                .displayOrder(2)
                .active(true)
                .build());

            // Topic 3: Methods, Overloading & Scanner Input
            QuickPrepTopic t3 = topicRepo.save(QuickPrepTopic.builder()
                .title("Methods, Overloading & Scanner Input")
                .slug("methods-overloading-scanner-input")
                .category(catFund)
                .summary("Method signatures, compile-time polymorphism (overloading), and fast Scanner parsing.")
                .content("""
                    ### Method Overloading Rules
                    Two or more methods in the same class can have the same name IF:
                    1. They have a different number of parameters, OR
                    2. They have different types of parameters, OR
                    3. They have a different sequence of parameter types.

                    NOTE: Changing ONLY the return type is NOT valid overloading and causes a compile error!

                    ### Input with Scanner
                    * sc.nextInt(), sc.nextDouble(), sc.next() (single word)
                    * sc.nextLine() (reads entire rest of line)
                    """)
                .javaExample("""
                    import java.util.Scanner;

                    public class MethodDemo {
                        // Overloaded methods: same name, different signatures
                        public static int add(int a, int b) { return a + b; }
                        public static double add(double a, double b) { return a + b; }
                        public static int add(int a, int b, int c) { return a + b + c; }

                        public static void main(String[] args) {
                            Scanner sc = new Scanner(System.in);
                            if (sc.hasNextInt()) {
                                int n = sc.nextInt();
                                sc.nextLine(); // Consume leftover newline trap!
                                String s = sc.nextLine();
                            }
                        }
                    }
                    """)
                .rememberPoint("Method overloading is resolved at compile time (Static Polymorphism). Return type alone cannot differentiate overloaded methods.")
                .commonMistake("Calling sc.nextLine() immediately after sc.nextInt() without consuming the leftover newline character in the buffer.")
                .timeComplexity("O(1)")
                .spaceComplexity("O(1)")
                .readTimeMinutes(3)
                .displayOrder(3)
                .active(true)
                .build());

            // Topic 4: OOP: Class, Object, Constructor & this
            QuickPrepTopic t4 = topicRepo.save(QuickPrepTopic.builder()
                .title("Classes, Objects & Constructors")
                .slug("classes-objects-constructors")
                .category(catOop)
                .summary("Class blueprints, default vs parameterized constructors, this pointer, and constructor chaining.")
                .content("""
                    ### Core OOP Principles: Creation
                    * Class: Blueprint / template defining state (fields) and behavior (methods).
                    * Object: Instance of a class created using 'new', allocated on the Heap.
                    * Constructor: Special method called when instantiating an object. Same name as class, no return type.
                    * 'this' Keyword: Refers to current object instance. Used to disambiguate field names from parameter names (this.name = name).
                    * Constructor Chaining: Calling another constructor in the same class using this(args) as the very first line.
                    """)
                .javaExample("""
                    public class Student {
                        private String name;
                        private int marks;

                        // Default constructor chaining
                        public Student() {
                            this("Anonymous", 0); // Must be FIRST statement
                        }

                        // Parameterized constructor
                        public Student(String name, int marks) {
                            this.name = name;
                            this.marks = marks;
                        }
                    }
                    """)
                .rememberPoint("If you define any parameterized constructor, Java does NOT provide the automatic default no-arg constructor anymore.")
                .commonMistake("Placing this(...) or super(...) anywhere other than the FIRST statement inside a constructor body.")
                .timeComplexity("O(1)")
                .spaceComplexity("O(1)")
                .readTimeMinutes(3)
                .displayOrder(4)
                .active(true)
                .build());

            // Topic 5: static, final, and Encapsulation
            QuickPrepTopic t5 = topicRepo.save(QuickPrepTopic.builder()
                .title("static, final & Access Modifiers")
                .slug("static-final-access-modifiers")
                .category(catOop)
                .summary("Class-level vs instance-level variables, constant immutability, and public/private/protected visibility.")
                .content("""
                    ### 'static' Keyword
                    * Belongs to the Class, not instances.
                    * Shared across all objects of that class.
                    * Static methods cannot access non-static (this) variables directly!

                    ### 'final' Keyword
                    * Final Variable: Constant value, cannot be reassigned once initialized.
                    * Final Method: Cannot be overridden by subclasses.
                    * Final Class: Cannot be extended / subclassed (e.g. java.lang.String).

                    ### Access Modifiers Matrix
                    * private: Same Class only
                    * default (no modifier): Same Package
                    * protected: Same Package + Subclasses in other packages
                    * public: Accessible Everywhere
                    """)
                .javaExample("""
                    public class Config {
                        public static final double PI = 3.1415926535; // Global constant
                        private static int instanceCount = 0;

                        public Config() {
                            instanceCount++;
                        }

                        public static int getInstanceCount() {
                            return instanceCount;
                        }
                    }
                    """)
                .rememberPoint("final reference variables cannot point to a new object, but the internal state of the referenced object CAN be mutated.")
                .commonMistake("Attempting to access 'this' or instance fields from a 'static' method without instantiating an object.")
                .timeComplexity("O(1)")
                .spaceComplexity("O(1)")
                .readTimeMinutes(3)
                .displayOrder(5)
                .active(true)
                .build());

            // Topic 6: Inheritance, Method Overriding & super
            QuickPrepTopic t6 = topicRepo.save(QuickPrepTopic.builder()
                .title("Inheritance & Method Overriding")
                .slug("inheritance-method-overriding")
                .category(catOop)
                .summary("Code reusability via extends, runtime polymorphism (dynamic method dispatch), and super.")
                .content("""
                    ### Key Concepts
                    * Inheritance (extends): Subclass inherits fields and methods of Superclass. (IS-A relationship).
                    * Java does NOT support Multiple Inheritance of classes (avoids the Diamond Problem).
                    * Method Overriding: Subclass provides a specific implementation of a method declared in superclass.
                    * Runtime Polymorphism: Parent obj = new Child(); obj.speak(); calls Child's version at runtime!
                    * 'super' keyword: Invokes superclass constructor or superclass methods (super.makeSound()).
                    """)
                .javaExample("""
                    class Animal {
                        void speak() { System.out.println("Animal sound"); }
                    }

                    class Dog extends Animal {
                        @Override
                        void speak() {
                            super.speak(); // Call parent
                            System.out.println("Bark!");
                        }
                    }

                    public class Main {
                        public static void main(String[] args) {
                            Animal a = new Dog(); // Dynamic Method Dispatch
                            a.speak(); // Calls Dog's overridden speak()
                        }
                    }
                    """)
                .rememberPoint("Overriding requires the exact same method signature and a return type that is identical or a covariant subtype.")
                .commonMistake("Thinking static methods can be overridden. Static methods are hidden (shadowed), not overridden dynamically.")
                .timeComplexity("Dispatch: O(1)")
                .spaceComplexity("O(1)")
                .readTimeMinutes(3)
                .displayOrder(6)
                .active(true)
                .build());

            // Topic 7: Abstraction: Abstract Classes vs Interfaces
            QuickPrepTopic t7 = topicRepo.save(QuickPrepTopic.builder()
                .title("Abstract Classes vs Interfaces")
                .slug("abstract-classes-vs-interfaces")
                .category(catOop)
                .summary("Comparison matrix, default & static interface methods, and achieving multiple inheritance.")
                .content("""
                    ### Abstract Class vs Interface Comparison
                    * Abstract Class: Single inheritance (extends), can have constructors, instance state, abstract + concrete methods.
                    * Interface: Multiple inheritance (implements), no constructors, only public static final constants, abstract, default, static methods.
                    * Use Abstract Class for closely related hierarchies sharing state.
                    * Use Interface for defining behavioral contracts across unrelated classes.
                    """)
                .javaExample("""
                    interface Drivable {
                        void drive(); // Implicitly public abstract

                        // Default method (since Java 8)
                        default void horn() { System.out.println("Beep beep!"); }
                    }

                    abstract class Vehicle {
                        protected String model;
                        public Vehicle(String model) { this.model = model; }
                        public abstract void refuel();
                    }

                    class ElectricCar extends Vehicle implements Drivable {
                        public ElectricCar(String m) { super(m); }
                        public void refuel() { System.out.println("Charging battery..."); }
                        public void drive() { System.out.println("Driving silently..."); }
                    }
                    """)
                .rememberPoint("All fields in an interface are automatically public static final. A class can implement multiple interfaces.")
                .commonMistake("Trying to instantiate an abstract class or interface using 'new Animal()' without an anonymous class body.")
                .timeComplexity("O(1)")
                .spaceComplexity("O(1)")
                .readTimeMinutes(4)
                .displayOrder(7)
                .active(true)
                .build());

            // Topic 8: Strings: String Pool, Immutability & == vs .equals()
            QuickPrepTopic t8 = topicRepo.save(QuickPrepTopic.builder()
                .title("String Pool, Immutability & == vs .equals()")
                .slug("string-pool-immutability-equals")
                .category(catStrings)
                .summary("The #1 Java Interview question: String Constant Pool, object identity vs value equality.")
                .content("""
                    ### Why Strings are Immutable
                    1. String Constant Pool (SCP): Storing literals in the pool saves heap memory.
                    2. Security: Safe for passing DB URLs, usernames, passwords across network connections.
                    3. Thread Safety: Immutable strings can be shared across threads without synchronization.
                    4. Hash Caching: HashCode is computed once and cached, enabling high-performance HashMap keys.

                    ### == vs .equals()
                    * == operator compares memory reference addresses (object identity).
                    * .equals() method compares character contents / values.
                    """)
                .javaExample("""
                    public class StringTrap {
                        public static void main(String[] args) {
                            String s1 = "Sentinel";         // In String Constant Pool
                            String s2 = "Sentinel";         // Reuses pool instance!
                            String s3 = new String("Sentinel"); // New object in Heap!

                            System.out.println(s1 == s2);      // TRUE (Same pool reference)
                            System.out.println(s1 == s3);      // FALSE (Different references!)
                            System.out.println(s1.equals(s3)); // TRUE (Same contents)

                            // .intern() puts heap string reference into pool
                            System.out.println(s1 == s3.intern()); // TRUE
                        }
                    }
                    """)
                .rememberPoint("Always use .equals() or Objects.equals(a, b) for String content comparisons, NEVER ==.")
                .commonMistake("Modifying Strings in a tight loop with '+' concatenation. Each '+' creates a new String object, creating O(N^2) garbage.")
                .timeComplexity("Comparison: O(N)")
                .spaceComplexity("O(N)")
                .readTimeMinutes(3)
                .displayOrder(8)
                .active(true)
                .build());

            quizRepo.save(QuickPrepQuizQuestion.builder()
                .topic(t8)
                .question("What will String a = new String(\"test\"); String b = new String(\"test\"); System.out.println(a == b); output?")
                .optionsJson("[\"true\", \"false\", \"NullPointerException\", \"Compilation Error\"]")
                .correctOption("false")
                .explanation("The new keyword explicitly forces two separate objects to be allocated in Heap memory. == checks reference equality, which returns false.")
                .questionType("OUTPUT")
                .build());

            // Topic 9: StringBuilder vs StringBuffer
            QuickPrepTopic t9 = topicRepo.save(QuickPrepTopic.builder()
                .title("StringBuilder vs StringBuffer & Essential Methods")
                .slug("stringbuilder-vs-stringbuffer")
                .category(catStrings)
                .summary("Mutable character sequences, thread safety comparison, and essential String API methods.")
                .content("""
                    ### StringBuilder vs StringBuffer
                    * StringBuilder: Mutable, Not Synchronized (Not Thread-Safe). Fast and preferred for single-threaded usage.
                    * StringBuffer: Mutable, Synchronized (Thread-Safe). Slower due to locking overhead.

                    ### Core String API Cheat Sheet
                    * s.length(): Number of chars (O(1)).
                    * s.charAt(i): Char at index i (O(1)).
                    * s.substring(start, end): [start, end) exclusive of end (O(K)).
                    * s.indexOf(sub) / s.contains(sub): Substring search.
                    * s.toCharArray(): Converts to char[].
                    * s.trim(): Strips leading and trailing whitespaces.
                    * s.split(regex): Splits string by delimiter into String[].
                    """)
                .javaExample("""
                    public class StringOps {
                        public static void main(String[] args) {
                            StringBuilder sb = new StringBuilder("Sentinel");
                            sb.append("Assess");
                            sb.reverse(); // Reverse in-place!
                            sb.delete(0, 3);
                            String res = sb.toString();

                            // Fast Character Frequency Array
                            String str = "programming";
                            int[] freq = new int[26];
                            for (char c : str.toCharArray()) {
                                freq[c - 'a']++;
                            }
                        }
                    }
                    """)
                .rememberPoint("Use StringBuilder inside loops for appending or reversing characters to ensure O(N) linear runtime.")
                .commonMistake("Assuming s.substring(1, 4) includes index 4. The end index is ALWAYS exclusive in Java.")
                .timeComplexity("Append: O(1) amortized, Reverse: O(N)")
                .spaceComplexity("O(N)")
                .readTimeMinutes(3)
                .displayOrder(9)
                .active(true)
                .build());

            // Topic 10: Arrays: 1D, 2D & Fast Two-Pointer Technique
            QuickPrepTopic t10 = topicRepo.save(QuickPrepTopic.builder()
                .title("Arrays & The Two-Pointer Technique")
                .slug("arrays-two-pointer-technique")
                .category(catArrays)
                .summary("Memory layout of arrays, in-place reversal, two-sum on sorted arrays, and matrix traversal.")
                .content("""
                    ### Array Fundamentals
                    * Contiguous memory allocation of fixed size.
                    * Index starts at 0, access by index is O(1).
                    * arr.length is a field, NOT a method (unlike s.length()).

                    ### The Two-Pointer Pattern
                    * Opposite Ends: Left pointer at 0, Right pointer at n-1. Used for array reversal, palindrome check, Pair Sum on Sorted Array.
                    * Fast & Slow: Fast pointer moves 2 steps, slow pointer moves 1 step (cycle detection, middle element).
                    """)
                .javaExample("""
                    public class ArrayRev {
                        // In-place reverse using Two Pointers: O(N) time, O(1) space
                        public static void reverse(int[] arr) {
                            int left = 0, right = arr.length - 1;
                            while (left < right) {
                                int temp = arr[left];
                                arr[left] = arr[right];
                                arr[right] = temp;
                                left++;
                                right--;
                            }
                        }

                        // 2D Array / Matrix traversal
                        public static int sum2D(int[][] matrix) {
                            int total = 0;
                            for (int r = 0; r < matrix.length; r++) {
                                for (int c = 0; c < matrix[r].length; c++) {
                                    total += matrix[r][c];
                                }
                            }
                            return total;
                        }
                    }
                    """)
                .rememberPoint("Arrays have a fixed length once created. To dynamically expand size, use ArrayList.")
                .commonMistake("Writing arr.length() with parentheses instead of arr.length.")
                .timeComplexity("Access: O(1), Search: O(N), Reverse: O(N)")
                .spaceComplexity("O(1) auxiliary")
                .readTimeMinutes(3)
                .displayOrder(10)
                .active(true)
                .build());

            // Topic 11: Sliding Window Basics & Prefix Sum
            QuickPrepTopic t11 = topicRepo.save(QuickPrepTopic.builder()
                .title("Sliding Window & Prefix Sum Patterns")
                .slug("sliding-window-prefix-sum")
                .category(catArrays)
                .summary("Convert O(N^2) nested loops into O(N) single-pass linear time using window boundaries and prefix arrays.")
                .content("""
                    ### Sliding Window Technique
                    * Fixed Window (Size K): Maintain sum of current K elements. Slide window right by adding arr[i] and subtracting arr[i-k].
                    * Variable Window: Expand right pointer to satisfy condition, shrink left pointer when condition is violated.

                    ### Prefix Sum Technique
                    * prefix[i] = prefix[i-1] + arr[i]
                    * Range sum query [L, R] = prefix[R] - prefix[L-1] in O(1) time!
                    """)
                .javaExample("""
                    public class WindowDemo {
                        // Max sum of subarray of size K: O(N)
                        public static int maxSubarraySum(int[] arr, int k) {
                            int windowSum = 0;
                            for (int i = 0; i < k; i++) windowSum += arr[i];

                            int maxSum = windowSum;
                            for (int i = k; i < arr.length; i++) {
                                windowSum += arr[i] - arr[i - k]; // Slide
                                maxSum = Math.max(maxSum, windowSum);
                            }
                            return maxSum;
                        }
                    }
                    """)
                .rememberPoint("Sliding window is ideal for contiguous subarray problems looking for min/max sum, length, or distinct elements.")
                .commonMistake("Recomputing the entire window sum in every step instead of adding incoming element and subtracting outgoing element.")
                .timeComplexity("Time: O(N)")
                .spaceComplexity("O(1) for window, O(N) for prefix sum")
                .readTimeMinutes(4)
                .displayOrder(11)
                .active(true)
                .build());

            // Topic 12: Java Collections: Framework Architecture & List Implementations
            QuickPrepTopic t12 = topicRepo.save(QuickPrepTopic.builder()
                .title("Java Collections Framework & Lists")
                .slug("java-collections-framework-lists")
                .category(catCollections)
                .summary("Architecture hierarchy: Iterable -> Collection -> List / Set / Queue. ArrayList vs LinkedList comparison.")
                .content("""
                    ### Collection Hierarchy
                    Iterable -> Collection -> (List, Set, Queue)
                    Map is a separate hierarchy (HashMap, LinkedHashMap, TreeMap).

                    ### ArrayList vs LinkedList
                    * ArrayList: Dynamic Array, O(1) random access by index, O(1) amortized append, O(N) insert at beginning.
                    * LinkedList: Doubly-Linked Nodes, O(N) get by index, O(1) insertion at head/tail, higher memory per element.
                    """)
                .javaExample("""
                    import java.util.*;

                    public class ListDemo {
                        public static void main(String[] args) {
                            List<Integer> list = new ArrayList<>();
                            list.add(10);
                            list.add(20);
                            list.add(1, 15); // Inserts 15 at index 1: [10, 15, 20]

                            int val = list.get(0); // O(1)
                            list.remove(Integer.valueOf(20)); // Removes element 20

                            // LinkedList as Deque
                            Deque<String> deq = new LinkedList<>();
                            deq.addFirst("Front");
                            deq.addLast("Back");
                        }
                    }
                    """)
                .rememberPoint("For random lookups (get(i)), use ArrayList. For heavy insertions/deletions at both ends without random indexing, use LinkedList or ArrayDeque.")
                .commonMistake("Calling list.remove(10) on an ArrayList<Integer> expecting to remove value 10 instead of index 10. Use list.remove(Integer.valueOf(10)).")
                .timeComplexity("ArrayList get: O(1), add: O(1) amortized")
                .spaceComplexity("O(N)")
                .readTimeMinutes(4)
                .displayOrder(12)
                .active(true)
                .build());

            // Topic 13: Java Collections: HashMap, HashSet & Trees
            QuickPrepTopic t13 = topicRepo.save(QuickPrepTopic.builder()
                .title("HashMap, HashSet & Tree Structures")
                .slug("hashmap-hashset-trees")
                .category(catCollections)
                .summary("Internal hashing mechanics, buckets, collision handling, and ordered Tree Collections.")
                .content("""
                    ### HashMap Internal Architecture
                    * Stores Key-Value pairs using an array of Node buckets.
                    * Default capacity: 16, Default Load Factor: 0.75.
                    * Collision Resolution: Chaining. In Java 8+, if bucket exceeds 8 elements, converts to Red-Black Tree (O(log N)).
                    * equals() and hashCode() contract: If a.equals(b) is true, their hashCode() MUST be identical!

                    ### Collection Map & Set Variants
                    * HashSet / HashMap: Unordered, allows 1 null key, O(1) average operations.
                    * LinkedHashSet / LinkedHashMap: Preserves insertion order.
                    * TreeSet / TreeMap: Sorted by natural order or Comparator, based on Red-Black Tree, O(log N) operations.
                    """)
                .javaExample("""
                    import java.util.*;

                    public class MapDemo {
                        public static void main(String[] args) {
                            Map<String, Integer> map = new HashMap<>();
                            map.put("Java", 95);
                            map.put("DSA", 90);

                            // Safe retrieval with default
                            int score = map.getOrDefault("Python", 0);

                            // Frequency Counter Pattern
                            String[] words = {"apple", "banana", "apple"};
                            Map<String, Integer> freq = new HashMap<>();
                            for (String w : words) {
                                freq.put(w, freq.getOrDefault(w, 0) + 1);
                            }

                            // TreeMap (Sorted by Key)
                            Map<Integer, String> tree = new TreeMap<>();
                            tree.put(3, "Three");
                            tree.put(1, "One"); // Stored as: 1 -> 3
                        }
                    }
                    """)
                .rememberPoint("HashMap provides O(1) average lookup/insertion. TreeMap provides O(log N) lookup and keeps keys in sorted order.")
                .commonMistake("Overriding equals() without overriding hashCode(). This breaks HashMap/HashSet lookups.")
                .timeComplexity("HashMap: O(1) avg, TreeMap: O(log N)")
                .spaceComplexity("O(N)")
                .readTimeMinutes(4)
                .displayOrder(13)
                .active(true)
                .build());

            quizRepo.save(QuickPrepQuizQuestion.builder()
                .topic(t13)
                .question("Which Java Map implementation maintains its keys in strictly sorted ascending order?")
                .optionsJson("[\"HashMap\", \"LinkedHashMap\", \"TreeMap\", \"ConcurrentHashMap\"]")
                .correctOption("TreeMap")
                .explanation("TreeMap uses a Red-Black Tree backing structure to keep keys sorted naturally according to their Comparable implementation or a custom Comparator.")
                .questionType("MCQ")
                .build());

            // Topic 14: Linked Lists: Core Algorithms & Fast/Slow Pointers
            QuickPrepTopic t14 = topicRepo.save(QuickPrepTopic.builder()
                .title("Linked List Algorithms: Reversal & Cycle Detection")
                .slug("linked-list-reversal-cycle-detection")
                .category(catLinkedList)
                .summary("Node pointers, in-place reversal, Floyd's cycle detection algorithm, and finding the middle node.")
                .content("""
                    ### Singly Linked List Node
                    Each node contains data and a reference to the 'next' node.

                    ### 1. In-Place Reversal Algorithm
                    Use 3 pointers: prev = null, curr = head, next = null.
                    1. Save next = curr.next
                    2. Reverse pointer: curr.next = prev
                    3. Advance: prev = curr, curr = next

                    ### 2. Floyd's Tortoise & Hare (Fast & Slow Pointers)
                    * Find Middle: Slow moves 1 step, fast moves 2 steps. When fast reaches end, slow is at middle!
                    * Detect Cycle: If fast and slow meet, a loop exists.
                    """)
                .javaExample("""
                    class ListNode {
                        int val;
                        ListNode next;
                        ListNode(int val) { this.val = val; }
                    }

                    public class LinkedListOps {
                        // Reverse Linked List: O(N) Time, O(1) Space
                        public static ListNode reverseList(ListNode head) {
                            ListNode prev = null;
                            ListNode curr = head;
                            while (curr != null) {
                                ListNode next = curr.next;
                                curr.next = prev;
                                prev = curr;
                                curr = next;
                            }
                            return prev;
                        }

                        // Find Middle Node: O(N) Time, O(1) Space
                        public static ListNode findMiddle(ListNode head) {
                            ListNode slow = head, fast = head;
                            while (fast != null && fast.next != null) {
                                slow = slow.next;
                                fast = fast.next.next;
                            }
                            return slow;
                        }
                    }
                    """)
                .rememberPoint("Always check 'fast != null && fast.next != null' in the while loop to prevent NullPointerExceptions.")
                .commonMistake("Losing the reference to the rest of the list during pointer assignment. Always store curr.next in a temporary variable first.")
                .timeComplexity("Reverse: O(N), Middle: O(N)")
                .spaceComplexity("O(1) auxiliary")
                .readTimeMinutes(4)
                .displayOrder(14)
                .active(true)
                .build());

            // Topic 15: Stack & Queue: LIFO, FIFO & Classic Problems
            QuickPrepTopic t15 = topicRepo.save(QuickPrepTopic.builder()
                .title("Stack & Queue Mechanics & Classic Problems")
                .slug("stack-queue-mechanics-problems")
                .category(catStackQueue)
                .summary("LIFO vs FIFO, Balanced Parentheses check, Next Greater Element, and PriorityQueue.")
                .content("""
                    ### Stack (LIFO: Last In First Out)
                    * push(x): Add to top (O(1))
                    * pop(): Remove & return top (O(1))
                    * peek(): View top element without removing (O(1))
                    * Classic uses: Function call stack, Undo button, Balanced Parentheses, DFS.

                    ### Queue (FIFO: First In First Out)
                    * offer(x): Enqueue at back (O(1))
                    * poll(): Dequeue from front (O(1))
                    * peek(): View front element (O(1))
                    * Best Java implementation: Deque<T> queue = new ArrayDeque<>()
                    * Classic uses: Task scheduling, Printer spooling, BFS Traversal.
                    """)
                .javaExample("""
                    import java.util.*;

                    public class StackQueueDemo {
                        // Balanced Parentheses Validator
                        public static boolean isValid(String s) {
                            Deque<Character> st = new ArrayDeque<>();
                            for (char c : s.toCharArray()) {
                                if (c == '(') st.push(')');
                                else if (c == '{') st.push('}');
                                else if (c == '[') st.push(']');
                                else if (st.isEmpty() || st.pop() != c) return false;
                            }
                            return st.isEmpty();
                        }

                        // PriorityQueue (Min-Heap by default)
                        public static void pqExample() {
                            PriorityQueue<Integer> minHeap = new PriorityQueue<>();
                            minHeap.offer(30);
                            minHeap.offer(10);
                            minHeap.offer(20);
                            System.out.println(minHeap.poll()); // Prints 10 (smallest first)
                        }
                    }
                    """)
                .rememberPoint("Java's PriorityQueue is a Min-Heap by default (smallest item at top). Use Collections.reverseOrder() for Max-Heap.")
                .commonMistake("Using java.util.Stack class in modern Java. It extends legacy Vector and has synchronized lock overhead; use ArrayDeque instead.")
                .timeComplexity("Push/Pop/Offer/Poll: O(1), PQ insertion: O(log N)")
                .spaceComplexity("O(N)")
                .readTimeMinutes(4)
                .displayOrder(15)
                .active(true)
                .build());

            // Topic 16: Searching Algorithms: Linear vs Binary Search
            QuickPrepTopic t16 = topicRepo.save(QuickPrepTopic.builder()
                .title("Linear Search vs Binary Search")
                .slug("linear-search-vs-binary-search")
                .category(catSearchSort)
                .summary("Sequential scanning O(N) vs divide-and-conquer on sorted arrays O(log N), and mid-point overflow.")
                .content("""
                    ### Binary Search Principles
                    * PREREQUISITE: The array/search space MUST be SORTED.
                    * Halves the search space in each iteration (N -> N/2 -> N/4 -> ... -> 1).
                    * Time Complexity: O(log N), Space Complexity: O(1) iterative.

                    ### Midpoint Calculation Safe Formula
                    int mid = low + (high - low) / 2; (Prevents integer addition overflow).
                    """)
                .javaExample("""
                    public class SearchAlgo {
                        public static int binarySearch(int[] arr, int target) {
                            int low = 0, high = arr.length - 1;
                            while (low <= high) {
                                int mid = low + (high - low) / 2; // Avoid overflow!
                                if (arr[mid] == target) return mid;
                                else if (arr[mid] < target) low = mid + 1; // Search right
                                else high = mid - 1; // Search left
                            }
                            return -1; // Not found
                        }
                    }
                    """)
                .rememberPoint("Binary search is applicable to any monotonic condition, not just looking up numbers in a sorted array.")
                .commonMistake("Writing 'while (low < high)' instead of 'while (low <= high)', missing the single-element boundary case.")
                .timeComplexity("Linear: O(N), Binary Search: O(log N)")
                .spaceComplexity("O(1)")
                .readTimeMinutes(3)
                .displayOrder(16)
                .active(true)
                .build());

            // Topic 17: Sorting Algorithms & Comparison Table
            QuickPrepTopic t17 = topicRepo.save(QuickPrepTopic.builder()
                .title("Sorting Algorithms & Big-O Comparison")
                .slug("sorting-algorithms-comparison")
                .category(catSearchSort)
                .summary("Bubble, Selection, Insertion, Merge, Quick, and Heap Sort complexity, stability, and use cases.")
                .content("""
                    ### Sorting Algorithms Master Table
                    * Bubble Sort: Best O(N), Avg O(N^2), Worst O(N^2), Space O(1), Stable: YES
                    * Selection Sort: Best O(N^2), Avg O(N^2), Worst O(N^2), Space O(1), Stable: NO
                    * Insertion Sort: Best O(N), Avg O(N^2), Worst O(N^2), Space O(1), Stable: YES
                    * Merge Sort: Best O(N log N), Avg O(N log N), Worst O(N log N), Space O(N), Stable: YES
                    * Quick Sort: Best O(N log N), Avg O(N log N), Worst O(N^2), Space O(log N), Stable: NO
                    * Heap Sort: Best O(N log N), Avg O(N log N), Worst O(N log N), Space O(1), Stable: NO

                    * Stable Sort: Maintains relative order of equal elements (Merge Sort, Insertion Sort).
                    * Java Arrays.sort(): Uses Dual-Pivot Quicksort for primitives and TimSort for Objects.
                    """)
                .javaExample("""
                    import java.util.Arrays;

                    public class MergeSortDemo {
                        static void merge(int[] a, int l, int m, int r) {
                            int[] temp = new int[r - l + 1];
                            int i = l, j = m + 1, k = 0;
                            while (i <= m && j <= r) temp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
                            while (i <= m) temp[k++] = a[i++];
                            while (j <= r) temp[k++] = a[j++];
                            System.arraycopy(temp, 0, a, l, temp.length);
                        }
                    }
                    """)
                .rememberPoint("Merge Sort always runs in O(N log N) time in all cases (best, average, worst) and is stable, but requires O(N) auxiliary memory.")
                .commonMistake("Assuming QuickSort always runs in O(N log N). In the worst case (already sorted array with first/last element chosen as pivot), QuickSort degrades to O(N^2).")
                .timeComplexity("Merge Sort: O(N log N), Selection: O(N^2)")
                .spaceComplexity("Merge: O(N), Quick: O(log N)")
                .readTimeMinutes(4)
                .displayOrder(17)
                .active(true)
                .build());

            // Topic 18: Recursion & Call Stack Mechanics
            QuickPrepTopic t18 = topicRepo.save(QuickPrepTopic.builder()
                .title("Recursion & Call Stack Mechanics")
                .slug("recursion-call-stack-mechanics")
                .category(catAlgos)
                .summary("Base cases, recursive steps, StackOverflowError prevention, and tree-branching recursion.")
                .content("""
                    ### The Anatomy of Recursion
                    Every recursive function MUST have two parts:
                    1. Base Case: The stopping condition that returns directly without making further recursive calls.
                    2. Recursive Step: Shrinks the problem size towards the base case.

                    ### The Call Stack
                    Every function call pushes a stack frame onto the Call Stack.
                    If the base case is missing or unreachable, frames accumulate until java.lang.StackOverflowError is thrown!
                    """)
                .javaExample("""
                    public class RecursionDemo {
                        // Factorial: O(N) Time, O(N) Call Stack
                        public static int factorial(int n) {
                            if (n <= 1) return 1; // Base case
                            return n * factorial(n - 1); // Recursive step
                        }

                        // Fibonacci with Memoization (Top-Down DP): O(N) Time
                        static int[] memo = new int[100];
                        public static int fib(int n) {
                            if (n <= 1) return n;
                            if (memo[n] != 0) return memo[n];
                            return memo[n] = fib(n - 1) + fib(n - 2);
                        }
                    }
                    """)
                .rememberPoint("Every recursive call consumes Stack space. If recursion depth exceeds JVM stack limit (~10,000 frames), use iteration or DP.")
                .commonMistake("Forgetting the base case or failing to decrease parameters (e.g. calling f(n) instead of f(n-1)).")
                .timeComplexity("Linear: O(N), Binary Tree Rec: O(2^N) unmemoized")
                .spaceComplexity("O(depth) call stack")
                .readTimeMinutes(3)
                .displayOrder(18)
                .active(true)
                .build());

            // Topic 19: Trees & BST: Traversals & Key Properties
            QuickPrepTopic t19 = topicRepo.save(QuickPrepTopic.builder()
                .title("Binary Trees & Binary Search Trees (BST)")
                .slug("trees-bst-traversals")
                .category(catTreesGraphs)
                .summary("Tree definitions, Preorder, Inorder, Postorder, Level Order traversals, and the Golden BST Rule.")
                .content("""
                    ### BST Property
                    For every node in a Binary Search Tree:
                    * All keys in the Left Subtree are strictly smaller than the node's key.
                    * All keys in the Right Subtree are strictly greater than the node's key.

                    ### GOLDEN EXAM RULE:
                    INORDER TRAVERSAL OF A BST PRODUCES ELEMENTS IN STRICTLY SORTED ASCENDING ORDER!

                    ### Tree Traversals
                    1. Preorder (Root -> Left -> Right): Used for cloning / serializing a tree.
                    2. Inorder (Left -> Root -> Right): Gives sorted order for BST.
                    3. Postorder (Left -> Right -> Root): Used for deleting tree / bottom-up calculations.
                    4. Level Order (Breadth-First): Explores level-by-level using a Queue.
                    """)
                .javaExample("""
                    class TreeNode {
                        int val;
                        TreeNode left, right;
                        TreeNode(int val) { this.val = val; }
                    }

                    public class TreeTraversals {
                        // Inorder Traversal: Left -> Root -> Right
                        public static void inorder(TreeNode root) {
                            if (root == null) return;
                            inorder(root.left);
                            System.out.print(root.val + " ");
                            inorder(root.right);
                        }

                        // Search in BST: O(h) where h is tree height
                        public static boolean searchBST(TreeNode root, int target) {
                            if (root == null) return false;
                            if (root.val == target) return true;
                            return target < root.val ? searchBST(root.left, target) : searchBST(root.right, target);
                        }
                    }
                    """)
                .rememberPoint("Inorder traversal of any valid Binary Search Tree always outputs elements in sorted ascending order.")
                .commonMistake("Assuming search in a skewed BST is always O(log N). In a degenerate skewed tree, search degrades to O(N). Balanced BSTs guarantee O(log N).")
                .timeComplexity("Search/Insert in Balanced BST: O(log N), Traversals: O(N)")
                .spaceComplexity("O(height) call stack")
                .readTimeMinutes(4)
                .displayOrder(19)
                .active(true)
                .build());

            quizRepo.save(QuickPrepQuizQuestion.builder()
                .topic(t19)
                .question("Which tree traversal algorithm on a Binary Search Tree (BST) visits nodes in strictly sorted ascending order?")
                .optionsJson("[\"Preorder Traversal\", \"Inorder Traversal\", \"Postorder Traversal\", \"Level Order Traversal\"]")
                .correctOption("Inorder Traversal")
                .explanation("Because Inorder traversal processes the Left Subtree (smaller values), then the Root (current value), then the Right Subtree (larger values), it naturally visits all keys in sorted order.")
                .questionType("MCQ")
                .build());

            // Topic 20: Graphs: Adjacency, BFS & DFS
            QuickPrepTopic t20 = topicRepo.save(QuickPrepTopic.builder()
                .title("Graph Representations, BFS (Queue) & DFS (Stack)")
                .slug("graphs-bfs-dfs-representations")
                .category(catTreesGraphs)
                .summary("Adjacency List vs Matrix, Breadth-First Search shortest path, and Depth-First Search connectivity.")
                .content("""
                    ### Graph Representations
                    * Adjacency Matrix (int[][] matrix): O(1) edge check, but consumes O(V^2) space.
                    * Adjacency List (List<List<Integer>> adj): Preferred for sparse graphs, consumes O(V + E) space.

                    ### BFS vs DFS Comparison
                    * BFS (Breadth-First Search): Uses a QUEUE. Explores closest neighbours level-by-level. Computes Shortest Path in unweighted graphs.
                    * DFS (Depth-First Search): Uses a STACK or Recursion. Explores as deep as possible along each branch before backtracking.
                    """)
                .javaExample("""
                    import java.util.*;

                    public class GraphTraversals {
                        // BFS using Queue: O(V + E)
                        public static void bfs(int start, List<List<Integer>> adj, int v) {
                            boolean[] visited = new boolean[v];
                            Queue<Integer> q = new ArrayDeque<>();

                            visited[start] = true;
                            q.offer(start);

                            while (!q.isEmpty()) {
                                int curr = q.poll();
                                for (int neighbor : adj.get(curr)) {
                                    if (!visited[neighbor]) {
                                        visited[neighbor] = true;
                                        q.offer(neighbor);
                                    }
                                }
                            }
                        }
                    }
                    """)
                .rememberPoint("BFS uses a Queue (FIFO) and finds shortest path in unweighted graphs. DFS uses Stack/Recursion.")
                .commonMistake("Forgetting to mark nodes as 'visited' when offering them to the Queue in BFS, which causes infinite loops in cyclic graphs.")
                .timeComplexity("Time: O(V + E)")
                .spaceComplexity("Space: O(V)")
                .readTimeMinutes(4)
                .displayOrder(20)
                .active(true)
                .build());

            // Topic 21: Algorithms: Dynamic Programming & Patterns
            QuickPrepTopic t21 = topicRepo.save(QuickPrepTopic.builder()
                .title("Dynamic Programming Patterns & Memoization")
                .slug("dynamic-programming-patterns")
                .category(catAlgos)
                .summary("Overlapping subproblems, optimal substructure, Memoization (Top-Down) vs Tabulation (Bottom-Up).")
                .content("""
                    ### What is Dynamic Programming (DP)?
                    An algorithmic optimization technique used when a problem has:
                    1. Optimal Substructure: Solution to optimal problem can be constructed from optimal solutions to subproblems.
                    2. Overlapping Subproblems: The same subproblems are solved repeatedly (e.g. Fibonacci).

                    ### DP Approaches
                    * Top-Down (Memoization): Write natural recursive solution and cache results in an array/HashMap.
                    * Bottom-Up (Tabulation): Solve smallest base cases first in an iterative table and build up to target answer.
                    """)
                .javaExample("""
                    public class DPDemo {
                        // 0/1 Knapsack Problem (Bottom-Up Tabulation)
                        public static int knapSack(int W, int[] wt, int[] val, int n) {
                            int[][] dp = new int[n + 1][W + 1];
                            for (int i = 1; i <= n; i++) {
                                for (int w = 1; w <= W; w++) {
                                    if (wt[i - 1] <= w)
                                        dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
                                    else
                                        dp[i][w] = dp[i - 1][w];
                                }
                            }
                            return dp[n][W];
                        }
                    }
                    """)
                .rememberPoint("Start by identifying the state variables (e.g., index i and remaining capacity w), then define the recurrence relation.")
                .commonMistake("Attempting DP when subproblems are independent. If subproblems do NOT overlap, standard Divide and Conquer (like Merge Sort) is appropriate.")
                .timeComplexity("Knapsack: O(N * W)")
                .spaceComplexity("O(N * W) or O(W) space optimized")
                .readTimeMinutes(4)
                .displayOrder(21)
                .active(true)
                .build());

            // Topic 22: Time & Space Complexity Master Reference
            QuickPrepTopic t22 = topicRepo.save(QuickPrepTopic.builder()
                .title("Big-O Time & Space Complexity Master Sheet")
                .slug("big-o-complexity-master-sheet")
                .category(catCheatsheets)
                .summary("Visual Big-O hierarchy, standard algorithmic boundaries, and Java operation runtime cheat sheet.")
                .content("""
                    ### Big-O Hierarchy (Best to Worst)
                    O(1) < O(log N) < O(N) < O(N log N) < O(N^2) < O(2^N) < O(N!)

                    ### Java Collections Complexity Table
                    * Array: Access O(1), Search O(N), Insert O(N), Delete O(N)
                    * ArrayList: Access O(1), Search O(N), Insert O(1) amortized, Delete O(N)
                    * LinkedList: Access O(N), Search O(N), Insert O(1) at ends, Delete O(1) at ends
                    * Stack (ArrayDeque): Access O(1), Search O(N), Insert O(1), Delete O(1)
                    * Queue (ArrayDeque): Access O(1), Search O(N), Insert O(1), Delete O(1)
                    * HashMap / HashSet: Search O(1) avg, Insert O(1) avg, Delete O(1) avg
                    * TreeMap / TreeSet: Search O(log N), Insert O(log N), Delete O(log N)
                    * PriorityQueue: Access O(1) peek, Insert O(log N), Delete O(log N) poll
                    """)
                .javaExample("""
                    public class ComplexityExamples {
                        // O(1) - Constant
                        int getFirst(int[] arr) { return arr[0]; }

                        // O(log N) - Logarithmic (Binary Search)
                        // O(N) - Linear (Single Loop)
                        // O(N log N) - Linearithmic (Merge Sort, Arrays.sort)
                        // O(N^2) - Quadratic (Nested Loops, Bubble Sort)
                        // O(2^N) - Exponential (Recursive Fibonacci without DP)
                    }
                    """)
                .rememberPoint("HashMap provides O(1) average time, but worst case O(N) if all keys hash to the same bucket (or O(log N) in Java 8+ treeified buckets).")
                .commonMistake("Assuming ArrayList.contains() is O(1). Searching in an ArrayList is O(N) linear search! Use HashSet for O(1) membership tests.")
                .timeComplexity("O(1) to O(N!)")
                .spaceComplexity("O(1) to O(N)")
                .readTimeMinutes(3)
                .displayOrder(22)
                .active(true)
                .build());

            // Topic 23: Things You MUST Remember Before Your Exam
            QuickPrepTopic t23 = topicRepo.save(QuickPrepTopic.builder()
                .title("Things You MUST Remember Before Your Java Exam")
                .slug("must-remember-java-exam-sheet")
                .category(catCheatsheets)
                .summary("High-yield, rapid-fire facts for immediate revision 10 minutes before entering the exam.")
                .content("""
                    ### Fast-Fire Java Exam Truths
                    1. String Comparison: NEVER use == for String content; always use str1.equals(str2).
                    2. Array vs String Length: Arrays use field arr.length; Strings use method str.length().
                    3. Stack: LIFO (Last-In-First-Out).
                    4. Queue: FIFO (First-In-First-Out).
                    5. BFS: Uses a Queue (level order traversal, shortest path).
                    6. DFS: Uses a Stack or Recursion.
                    7. Binary Search: Requires the data array to be Sorted (O(log N)).
                    8. HashMap: Stores Key -> Value pairs (O(1) average).
                    9. HashSet: Stores unique keys (O(1) average).
                    10. BST Inorder Traversal: Outputs elements in Strictly Sorted Ascending Order.
                    11. Merge Sort: Stable sort with guaranteed O(N log N) worst-case runtime.
                    12. Method Overloading: Same name, different parameters (Resolved at compile time).
                    13. Method Overriding: Subclass provides specific implementation of parent method (Runtime polymorphism).
                    14. abstract Class vs interface: A class can extend only one class, but can implement multiple interfaces.
                    """)
                .javaExample("""
                    import java.util.*;

                    public class Solution {
                        public static void main(String[] args) {
                            Scanner sc = new Scanner(System.in);
                            int n = sc.nextInt();
                            int[] arr = new int[n];
                            for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

                            // Fast Sort
                            Arrays.sort(arr);

                            // Fast HashMap
                            Map<Integer, Integer> map = new HashMap<>();
                            for (int x : arr) map.put(x, map.getOrDefault(x, 0) + 1);
                        }
                    }
                    """)
                .rememberPoint("Memorize these 14 points. They account for over 70% of multiple-choice and conceptual screening questions.")
                .commonMistake("Mixing up BFS and DFS data structures: BFS uses Queue; DFS uses Stack.")
                .timeComplexity("N/A")
                .spaceComplexity("N/A")
                .readTimeMinutes(2)
                .displayOrder(23)
                .active(true)
                .build());

            // Topic 24: Common Java Interview Traps & Antipatterns
            QuickPrepTopic t24 = topicRepo.save(QuickPrepTopic.builder()
                .title("Common Java Interview Traps & Pitfalls")
                .slug("common-java-interview-traps")
                .category(catCheatsheets)
                .summary("10 classic trap questions interviewers use to test deep Java understanding.")
                .content("""
                    ### Trap 1: == vs .equals() on Integer Objects
                    Integer a = 100, b = 100; a == b is TRUE (Integer Cache -128 to 127).
                    Integer c = 200, d = 200; c == d is FALSE (Outside cache range, new objects created)!

                    ### Trap 2: Modifying Collections During Iteration
                    Using for (String s : list) { list.remove(s); } throws ConcurrentModificationException.
                    FIX: Use Iterator.remove() or list.removeIf(predicate).

                    ### Trap 3: Java is Strictly Pass-By-Value
                    Java passes everything by value. For objects, it passes a copy of the reference address, NOT the object itself!

                    ### Trap 4: Substring Out of Bounds
                    s.substring(0, s.length()) is VALID and returns the full string because end index is exclusive.

                    ### Trap 5: finally Block Execution
                    The finally block ALWAYS executes, even if return is called inside try or catch (except on System.exit(0)).
                    """)
                .javaExample("""
                    public class TrapsDemo {
                        public static void main(String[] args) {
                            // Trap 1: Integer Caching
                            Integer x = 127, y = 127;
                            System.out.println(x == y); // true (cached)

                            Integer p = 128, q = 128;
                            System.out.println(p == q); // false (different objects!)

                            // Trap 2: Pass-by-Value Reference Reassignment
                            int[] arr = {1, 2, 3};
                            modify(arr);
                            System.out.println(arr[0]); // 99 (mutated inside!)
                        }

                        static void modify(int[] a) {
                            a[0] = 99; // Mutates content
                            a = new int[]{500}; // Reassigning local pointer does NOT affect caller!
                        }
                    }
                    """)
                .rememberPoint("Integer objects between -128 and 127 are cached by the JVM. Always use .equals() to compare boxed primitive wrapper objects.")
                .commonMistake("Thinking Java has Pass-By-Reference like C++. Java is 100% Pass-By-Value.")
                .timeComplexity("N/A")
                .spaceComplexity("N/A")
                .readTimeMinutes(3)
                .displayOrder(24)
                .active(true)
                .build());

            quizRepo.save(QuickPrepQuizQuestion.builder()
                .topic(t24)
                .question("What happens when you run Integer a = 200; Integer b = 200; System.out.println(a == b); in Java?")
                .optionsJson("[\"Prints true because 200 equals 200\", \"Prints false because 200 is outside the JVM Integer cache (-128 to 127)\", \"Throws NullPointerException\", \"Compilation error\"]")
                .correctOption("Prints false because 200 is outside the JVM Integer cache (-128 to 127)")
                .explanation("The JVM caches Integer objects from -128 to 127. Values outside this range (like 200) instantiate distinct object instances on the Heap, so == evaluates to false.")
                .questionType("MCQ")
                .build());
        };
    }
}
