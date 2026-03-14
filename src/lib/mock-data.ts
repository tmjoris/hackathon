// Mock Data Store for Fieldwork Platform

export type TicketStatus = "Completed" | "Active" | "Locked";
export type CourseCategory = "Tech" | "Business" | "Design" | "Finance";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Ticket {
  id: string;
  title: string;
  type: "Build" | "Analyze" | "Present" | "Research";
  durationEstimate: string;
  status: TicketStatus;
  isUrgent?: boolean;
  scenario?: string;
  deliverables?: string[];
  lessonContent?: string;
  starterCode?: string;
  expectedOutput?: string;
}

export interface Sprint {
  id: string;
  title: string;
  order: number;
  tickets: Ticket[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: CourseCategory;
  difficulty: Difficulty;
  totalSprints: number;
  totalTickets: number;
  fee: number;
  progressPercent?: number; // 0 if not enrolled
  currentSprint?: number;
  sprints: Sprint[];
  isEnrolled: boolean;
}

export interface Certificate {
  id: string;
  courseTitle: string;
  dateEarned: string;
  sprintsCompleted: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  degree: string;
  institution: string;
  joinDate: string;
  currentStreak: number;
  bestStreak: number;
  feeRefunded: number;
  feeTotal: number;
  ticketsCompleted: number;
  certificates: Certificate[];
}

export const mockUser: User = {
  id: "u_1",
  name: "Amara Osei",
  email: "student@fieldwork.io",
  degree: "B.S. Computer Science",
  institution: "University of Nairobi",
  joinDate: "Jan 2025",
  currentStreak: 12,
  bestStreak: 21,
  feeRefunded: 2100,
  feeTotal: 3000,
  ticketsCompleted: 28,
  certificates: [
    {
      id: "cert_1",
      courseTitle: "Frontend Engineering Fundamentals",
      dateEarned: "2025-02-14",
      sprintsCompleted: 4
    }
  ]
};

export const mockCourses: Course[] = [
  {
    id: "c_python",
    title: "Introduction to Python",
    instructor: "Guido van Rossum",
    category: "Tech",
    difficulty: "Beginner",
    totalSprints: 1,
    totalTickets: 13,
    fee: 1500,
    progressPercent: 0,
    currentSprint: 1,
    isEnrolled: true,
    sprints: [
      {
        id: "s_py_1",
        title: "Module 1: Python Fundamentals",
        order: 1,
        tickets: [
          { id: "t_py_1",
            lessonContent: `<h1>Python Installation and Environment Setup</h1><p>Welcome to Python! To run Python code, we normally use an IDE like VS Code or the terminal.</p><p>Wait... we have an editor right here! Let's write your very first line of Python code.</p><p>Use the <code>print()</code> function to output 'Hello World!'</p>`,
            starterCode: `print('Hello World!')`,
            expectedOutput: `Hello World!`, title: "Python Installation and Environment Setup", type: "Build", durationEstimate: "20 mins", status: "Active" },
          { id: "t_py_2",
            lessonContent: `<h1>Variables and Data Types</h1><p>Variables store data. Python has different types like Integers, Floats, Strings, and Booleans.</p><p>Create a variable <code>name</code> and set it to 'Caroline', then print it!</p>`,
            starterCode: `name = 'Caroline'
print(name)`,
            expectedOutput: `Caroline`, title: "Variables and Data Types", type: "Build", durationEstimate: "30 mins", status: "Locked" },
          { id: "t_py_3",
            lessonContent: `<h1>Operators in Python</h1><p>You can perform arithmetic calculations such as addition (+), subtraction (-), and division (/).</p><p>Calculate 15 + 45 and print the result.</p>`,
            starterCode: `result = 15 + 45
print(result)`,
            expectedOutput: `60`, title: "Operators in Python", type: "Build", durationEstimate: "25 mins", status: "Locked" },
          { id: "t_py_4",
            lessonContent: `<h1>User Input and Output</h1><p>The <code>input()</code> function gets values from the user. F-strings let us format them nicely.</p><p>For this exercise, we will just format variables using an F-string.</p>`,
            starterCode: `city = 'Nairobi'
print(f'Welcome to {city}!')`,
            expectedOutput: `Welcome to Nairobi!`, title: "User Input and Output", type: "Build", durationEstimate: "20 mins", status: "Locked" },
          { id: "t_py_5",
            lessonContent: `<h1>Control Flow (Conditionals)</h1><p><code>if</code>, <code>elif</code>, and <code>else</code> allow our programs to make decisions based on conditions.</p><p>Write an if statement to check if a number is greater than 10.</p>`,
            starterCode: `num = 15
if num > 10:
    print('Greater than 10!')
else:
    print('10 or less.')`,
            expectedOutput: `Greater than 10!`, title: "Control Flow (Conditionals)", type: "Build", durationEstimate: "40 mins", status: "Locked" },
          { id: "t_py_6",
            lessonContent: `<h1>Loops</h1><p>Loops allow us to repeat code. Python has <code>for</code> and <code>while</code> loops.</p><p>Write a for loop to print numbers 1 to 3.</p>`,
            starterCode: `for i in range(1, 4):
    print(i)`,
            expectedOutput: `1
2
3`, title: "Loops", type: "Build", durationEstimate: "45 mins", status: "Locked" },
          { id: "t_py_7",
            lessonContent: `<h1>Functions</h1><p>Functions let us reuse blocks of code. Use the <code>def</code> keyword.</p><p>Call the given function <code>greet()</code> to say hi to Amara.</p>`,
            starterCode: `def greet(name):
    return f'Hi, {name}!'

print(greet('Amara'))`,
            expectedOutput: `Hi, Amara!`, title: "Functions", type: "Build", durationEstimate: "50 mins", status: "Locked" },
          { id: "t_py_8",
            lessonContent: `<h1>Data Structures</h1><p>Lists, Tuples, Dictionaries and Sets store multiple items.</p><p>Print the 2nd item of the list.</p>`,
            starterCode: `fruits = ['Apple', 'Banana', 'Cherry']
print(fruits[1])`,
            expectedOutput: `Banana`, title: "Data Structures", type: "Build", durationEstimate: "60 mins", status: "Locked" },
          { id: "t_py_9",
            lessonContent: `<h1>String Manipulation</h1><p>We can manipulate text using methods like <code>.upper()</code> or <code>.replace()</code>.</p><p>Convert the string to uppercase.</p>`,
            starterCode: `text = 'hello world'
print(text.upper())`,
            expectedOutput: `HELLO WORLD`, title: "String Manipulation", type: "Build", durationEstimate: "35 mins", status: "Locked" },
          { id: "t_py_10",
            lessonContent: `<h1>File Handling</h1><p>We can read/write files using <code>open()</code> in Python.</p><p>For now, just print the name of the function you would use to open a file.</p>`,
            starterCode: `print('open')`,
            expectedOutput: `open`, title: "File Handling", type: "Build", durationEstimate: "40 mins", status: "Locked" },
          { id: "t_py_11",
            lessonContent: `<h1>Error Handling</h1><p>Use <code>try</code> and <code>except</code> blocks to catch runtime errors so your program doesn't crash.</p>`,
            starterCode: `try:
    print(10 / 0)
except ZeroDivisionError:
    print('Cannot divide by zero!')`,
            expectedOutput: `Cannot divide by zero!`, title: "Error Handling", type: "Build", durationEstimate: "30 mins", status: "Locked" },
          { id: "t_py_12",
            lessonContent: `<h1>Basic Modules and Libraries</h1><p>You can import other code files using <code>import math</code> as an example.</p><p>Find the square root of 25.</p>`,
            starterCode: `import math
print(math.sqrt(25))`,
            expectedOutput: `5.0`, title: "Basic Modules and Libraries", type: "Build", durationEstimate: "30 mins", status: "Locked" },
          { 
            id: "t_py_13",
            lessonContent: `<h1>Project: Personal Finance Tracker</h1><p>You have learned the basics of Python! Now, apply your knowledge to build a simple personal finance tracker calculating a final balance from a list of transactions.</p><br/><ul><li>Calculate the sum of incomes</li><li>Subtract the total expenses</li><li>Print the final balance</li></ul>`,
            starterCode: `# Finance Tracker
transactions = [
    {'type': 'income', 'amount': 1500},
    {'type': 'expense', 'amount': 200},
    {'type': 'expense', 'amount': 50}
]

balance = 0
for t in transactions:
    if t['type'] == 'income':
        balance += t['amount']
    else:
        balance -= t['amount']

print(f'Final Balance: KES {balance}')`,
            expectedOutput: `Final Balance: KES 1250`, 
            title: "Project: Personal Finance Tracker", 
            type: "Build", 
            durationEstimate: "120 mins", 
            status: "Locked",
            scenario: "You have learned the basics of Python! Now, apply your knowledge to build a simple personal finance tracker. It should allow a user to add income/expenses, view balance, and save the data to a file so it persists.",
            deliverables: [
              "Python script utilizing functions, loops, and conditionals",
              "File handling to save and load CSV data",
              "Clean runtime execution with proper error handling for user inputs"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "c_ai",
    title: "Introduction to AI",
    instructor: "Andrew Ng",
    category: "Tech",
    difficulty: "Beginner",
    totalSprints: 1,
    totalTickets: 13,
    fee: 1800,
    progressPercent: 0,
    currentSprint: 1,
    isEnrolled: true,
    sprints: [
      {
        id: "s_ai_1",
        title: "Module 1: AI Foundations",
        order: 1,
        tickets: [
          { id: "t_ai_1", title: "What is Artificial Intelligence?", type: "Research", durationEstimate: "20 mins", status: "Active" },
          { id: "t_ai_2", title: "Types of AI", type: "Analyze", durationEstimate: "25 mins", status: "Locked" },
          { id: "t_ai_3", title: "AI vs Machine Learning vs Deep Learning", type: "Analyze", durationEstimate: "30 mins", status: "Locked" },
          { id: "t_ai_4", title: "Applications of AI", type: "Research", durationEstimate: "25 mins", status: "Locked" },
          { id: "t_ai_5", title: "Search Algorithms in AI", type: "Analyze", durationEstimate: "45 mins", status: "Locked" },
          { id: "t_ai_6", title: "Knowledge Representation", type: "Research", durationEstimate: "40 mins", status: "Locked" },
          { id: "t_ai_7", title: "Expert Systems", type: "Analyze", durationEstimate: "35 mins", status: "Locked" },
          { id: "t_ai_8", title: "Natural Language Processing Basics", type: "Research", durationEstimate: "40 mins", status: "Locked" },
          { id: "t_ai_9", title: "Computer Vision Basics", type: "Research", durationEstimate: "40 mins", status: "Locked" },
          { id: "t_ai_10", title: "Ethics and Responsible AI", type: "Analyze", durationEstimate: "45 mins", status: "Locked" },
          { id: "t_ai_11", title: "AI in Industry", type: "Research", durationEstimate: "30 mins", status: "Locked" },
          { id: "t_ai_12", title: "Future Trends in AI", type: "Research", durationEstimate: "30 mins", status: "Locked" },
          { 
            id: "t_ai_13", 
            title: "Project: AI Strategy Proposal", 
            type: "Present", 
            durationEstimate: "90 mins", 
            status: "Locked",
            scenario: "A local retail business wants to adopt AI to improve their operations but they don't know where to start. Using your knowledge of AI applications and ethics, draft a proposal.",
            deliverables: [
              "Identify 3 areas where AI (expert systems, NLP, or computer vision) can assist operations",
              "A risk assessment outlining ethical considerations (bias, transparency)",
              "A brief presentation deck summarizing your recommendation"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "c_ml",
    title: "Introduction to Machine Learning",
    instructor: "Fei-Fei Li",
    category: "Tech",
    difficulty: "Intermediate",
    totalSprints: 1,
    totalTickets: 13,
    fee: 2000,
    progressPercent: 0,
    currentSprint: 1,
    isEnrolled: true,
    sprints: [
      {
        id: "s_ml_1",
        title: "Module 1: ML Basics",
        order: 1,
        tickets: [
          { id: "t_ml_1", title: "What is Machine Learning?", type: "Research", durationEstimate: "20 mins", status: "Active" },
          { id: "t_ml_2", title: "Types of Machine Learning", type: "Analyze", durationEstimate: "25 mins", status: "Locked" },
          { id: "t_ml_3", title: "Data and Features", type: "Analyze", durationEstimate: "35 mins", status: "Locked" },
          { id: "t_ml_4", title: "Data Preprocessing", type: "Build", durationEstimate: "45 mins", status: "Locked" },
          { id: "t_ml_5", title: "Regression Algorithms", type: "Analyze", durationEstimate: "50 mins", status: "Locked" },
          { id: "t_ml_6", title: "Classification Algorithms", type: "Analyze", durationEstimate: "50 mins", status: "Locked" },
          { id: "t_ml_7", title: "Clustering Algorithms", type: "Analyze", durationEstimate: "40 mins", status: "Locked" },
          { id: "t_ml_8", title: "Model Training and Evaluation", type: "Analyze", durationEstimate: "45 mins", status: "Locked" },
          { id: "t_ml_9", title: "Overfitting and Underfitting", type: "Analyze", durationEstimate: "35 mins", status: "Locked" },
          { id: "t_ml_10", title: "Feature Engineering", type: "Build", durationEstimate: "50 mins", status: "Locked" },
          { id: "t_ml_11", title: "Introduction to ML Libraries", type: "Build", durationEstimate: "40 mins", status: "Locked" },
          { id: "t_ml_12", title: "Machine Learning Pipeline", type: "Analyze", durationEstimate: "30 mins", status: "Locked" },
          { 
            id: "t_ml_13", 
            title: "Project: Housing Price Predictor", 
            type: "Build", 
            durationEstimate: "120 mins", 
            status: "Locked",
            scenario: "You've been tasked with estimating house prices in a new city using historical data. You will take raw data, clean it, train a simple regression model, and evaluate its performance.",
            deliverables: [
              "Python notebook containing the data preprocessing steps",
              "A trained Linear Regression model using scikit-learn",
              "Evaluation metrics (e.g. RMSE, R2 Score) with a short interpretative summary"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "c_agile",
    title: "A guide to learning Agile",
    instructor: "Jeff Sutherland",
    category: "Business",
    difficulty: "Beginner",
    totalSprints: 1,
    totalTickets: 13,
    fee: 1200,
    progressPercent: 0,
    currentSprint: 1,
    isEnrolled: true,
    sprints: [
      {
        id: "s_ag_1",
        title: "Module 1: Agile Methodologies",
        order: 1,
        tickets: [
          { id: "t_ag_1", title: "Introduction to Agile", type: "Research", durationEstimate: "20 mins", status: "Active" },
          { id: "t_ag_2", title: "Agile Manifesto and Principles", type: "Analyze", durationEstimate: "30 mins", status: "Locked" },
          { id: "t_ag_3", title: "Agile vs Traditional Development", type: "Analyze", durationEstimate: "25 mins", status: "Locked" },
          { id: "t_ag_4", title: "Scrum Framework", type: "Research", durationEstimate: "30 mins", status: "Locked" },
          { id: "t_ag_5", title: "Scrum Roles", type: "Analyze", durationEstimate: "25 mins", status: "Locked" },
          { id: "t_ag_6", title: "Scrum Artifacts", type: "Analyze", durationEstimate: "30 mins", status: "Locked" },
          { id: "t_ag_7", title: "Scrum Events", type: "Analyze", durationEstimate: "35 mins", status: "Locked" },
          { id: "t_ag_8", title: "User Stories", type: "Build", durationEstimate: "40 mins", status: "Locked" },
          { id: "t_ag_9", title: "Sprint Planning and Iterations", type: "Analyze", durationEstimate: "35 mins", status: "Locked" },
          { id: "t_ag_10", title: "Agile Estimation Techniques", type: "Analyze", durationEstimate: "30 mins", status: "Locked" },
          { id: "t_ag_11", title: "Agile Tools", type: "Build", durationEstimate: "30 mins", status: "Locked" },
          { id: "t_ag_12", title: "Continuous Improvement in Agile", type: "Analyze", durationEstimate: "25 mins", status: "Locked" },
          { 
            id: "t_ag_13", 
            title: "Project: Organize a Mock Sprint", 
            type: "Present", 
            durationEstimate: "90 mins", 
            status: "Locked",
            scenario: "A startup team is creating a new food delivery app and wants you to organize their first Sprint using Agile best practices. You need to write their initial user stories, estimate them, and set up a backlog.",
            deliverables: [
              "A defined Product Backlog with at least 5 prioritized User Stories",
              "Story point estimations for each story using planning poker methodology",
              "A short presentation defining the sprint goal and roles (Scrum Master, Product Owner, Dev Team)"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "c_1",
    title: "Cloud Infrastructure Fundamentals",
    instructor: "David Chen",
    category: "Tech",
    difficulty: "Intermediate",
    totalSprints: 4,
    totalTickets: 12,
    fee: 1000,
    progressPercent: 68,
    currentSprint: 2,
    isEnrolled: true,
    sprints: [
      {
        id: "s_1_1",
        title: "Sprint 1: AWS Core Services",
        order: 1,
        tickets: [
          { id: "t_1", title: "Provision VPC Architecture", type: "Build", durationEstimate: "45 mins", status: "Completed" },
          { id: "t_2", title: "IAM Policy Audit", type: "Analyze", durationEstimate: "30 mins", status: "Completed" },
          { id: "t_3", title: "Deploy EC2 Web Server", type: "Build", durationEstimate: "60 mins", status: "Completed" },
        ]
      },
      {
        id: "s_1_2",
        title: "Sprint 2: High Availability",
        order: 2,
        tickets: [
          { 
            id: "t_4", 
            title: "Configure Auto-Scaling Group", 
            type: "Build", 
            durationEstimate: "45 mins", 
            status: "Completed" 
          },
          { 
            id: "t_5", 
            title: "Load Balancer Routing Fix", 
            type: "Analyze", 
            durationEstimate: "25 mins", 
            status: "Active",
            isUrgent: true,
            scenario: "Production traffic is failing to reach the newly deployed microservices. The application load balancer (ALB) is showing healthy hosts, but 502 Bad Gateway errors are spiking. The engineering lead needs you to audit the listener rules and target group configurations immediately.",
            deliverables: [
              "Identify the misconfigured listener port",
              "Update target group health check path",
              "Draft a post-mortem explanation of the failure"
            ]
          },
          { id: "t_6", title: "Multi-AZ Database Migration", type: "Build", durationEstimate: "90 mins", status: "Locked" },
        ]
      }
    ]
  },
  {
    id: "c_2",
    title: "Financial Modelling for Startups",
    instructor: "Sarah Jenkins",
    category: "Finance",
    difficulty: "Beginner",
    totalSprints: 3,
    totalTickets: 9,
    fee: 1000,
    progressPercent: 40,
    currentSprint: 1,
    isEnrolled: true,
    sprints: [
      {
        id: "s_2_1",
        title: "Sprint 1: Unit Economics",
        order: 1,
        tickets: [
          { id: "t_2_1", title: "Calculate CAC vs LTV", type: "Analyze", durationEstimate: "40 mins", status: "Completed" },
          { id: "t_2_2", title: "Build Cohort Retention Model", type: "Build", durationEstimate: "60 mins", status: "Active" },
          { id: "t_2_3", title: "Board Presentation Draft", type: "Present", durationEstimate: "30 mins", status: "Locked" },
        ]
      }
    ]
  },
  {
    id: "c_3",
    title: "Product Strategy Practicum",
    instructor: "Elena Rodriguez",
    category: "Business",
    difficulty: "Intermediate",
    totalSprints: 5,
    totalTickets: 15,
    fee: 1000,
    progressPercent: 15,
    currentSprint: 1,
    isEnrolled: true,
    sprints: [
       {
        id: "s_3_1",
        title: "Sprint 1: Market Positioning",
        order: 1,
        tickets: [
          { id: "t_3_1", title: "Competitor Feature Matrix", type: "Research", durationEstimate: "45 mins", status: "Active" },
          { id: "t_3_2", title: "Define User Personas", type: "Build", durationEstimate: "50 mins", status: "Locked" },
        ]
      }
    ]
  },
  {
    id: "c_4",
    title: "UX Research in Practice",
    instructor: "Marcus Tay",
    category: "Design",
    difficulty: "Beginner",
    totalSprints: 3,
    totalTickets: 10,
    fee: 800,
    progressPercent: 0,
    isEnrolled: false,
    sprints: []
  },
  {
    id: "c_5",
    title: "Data Analysis with Python",
    instructor: "Wei Lin",
    category: "Tech",
    difficulty: "Intermediate",
    totalSprints: 6,
    totalTickets: 18,
    fee: 1200,
    progressPercent: 0,
    isEnrolled: false,
    sprints: []
  },
  {
    id: "c_6",
    title: "Brand Identity for Founders",
    instructor: "Jessica Walsh",
    category: "Design",
    difficulty: "Beginner",
    totalSprints: 2,
    totalTickets: 6,
    fee: 500,
    progressPercent: 0,
    isEnrolled: false,
    sprints: []
  },
  {
    id: "c_7",
    title: "Growth Marketing Fundamentals",
    instructor: "Tom Hassan",
    category: "Business",
    difficulty: "Beginner",
    totalSprints: 4,
    totalTickets: 12,
    fee: 900,
    progressPercent: 0,
    isEnrolled: false,
    sprints: []
  },
  {
    id: "c_8",
    title: "Cybersecurity Essentials",
    instructor: "Nina Patel",
    category: "Tech",
    difficulty: "Intermediate",
    totalSprints: 5,
    totalTickets: 15,
    fee: 1100,
    progressPercent: 0,
    isEnrolled: false,
    sprints: []
  }
];
