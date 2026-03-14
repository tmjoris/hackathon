const fs = require('fs');

let data = fs.readFileSync('./src/lib/mock-data.ts', 'utf8');

// Ensure we have properties on Ticket
if (!data.includes('lessonContent?: string;')) {
  data = data.replace(
    'deliverables?: string[];',
    'deliverables?: string[];\n  lessonContent?: string;\n  starterCode?: string;\n  expectedOutput?: string;'
  );
}

const lessons = {
  "t_py_1": {
    content: "<h1>Python Installation and Environment Setup</h1><p>Welcome to Python! To run Python code, we normally use an IDE like VS Code or the terminal.</p><p>Wait... we have an editor right here! Let's write your very first line of Python code.</p><p>Use the <code>print()</code> function to output 'Hello World!'</p>",
    code: "print('Hello World!')",
    output: "Hello World!"
  },
  "t_py_2": {
    content: "<h1>Variables and Data Types</h1><p>Variables store data. Python has different types like Integers, Floats, Strings, and Booleans.</p><p>Create a variable <code>name</code> and set it to 'Caroline', then print it!</p>",
    code: "name = 'Caroline'\nprint(name)",
    output: "Caroline"
  },
  "t_py_3": {
    content: "<h1>Operators in Python</h1><p>You can perform arithmetic calculations such as addition (+), subtraction (-), and division (/).</p><p>Calculate 15 + 45 and print the result.</p>",
    code: "result = 15 + 45\nprint(result)",
    output: "60"
  },
  "t_py_4": {
    content: "<h1>User Input and Output</h1><p>The <code>input()</code> function gets values from the user. F-strings let us format them nicely.</p><p>For this exercise, we will just format variables using an F-string.</p>",
    code: "city = 'Nairobi'\nprint(f'Welcome to {city}!')",
    output: "Welcome to Nairobi!"
  },
  "t_py_5": {
    content: "<h1>Control Flow (Conditionals)</h1><p><code>if</code>, <code>elif</code>, and <code>else</code> allow our programs to make decisions based on conditions.</p><p>Write an if statement to check if a number is greater than 10.</p>",
    code: "num = 15\nif num > 10:\n    print('Greater than 10!')\nelse:\n    print('10 or less.')",
    output: "Greater than 10!"
  },
  "t_py_6": {
    content: "<h1>Loops</h1><p>Loops allow us to repeat code. Python has <code>for</code> and <code>while</code> loops.</p><p>Write a for loop to print numbers 1 to 3.</p>",
    code: "for i in range(1, 4):\n    print(i)",
    output: "1\n2\n3"
  },
  "t_py_7": {
    content: "<h1>Functions</h1><p>Functions let us reuse blocks of code. Use the <code>def</code> keyword.</p><p>Call the given function <code>greet()</code> to say hi to Amara.</p>",
    code: "def greet(name):\n    return f'Hi, {name}!'\n\nprint(greet('Amara'))",
    output: "Hi, Amara!"
  },
  "t_py_8": {
    content: "<h1>Data Structures</h1><p>Lists, Tuples, Dictionaries and Sets store multiple items.</p><p>Print the 2nd item of the list.</p>",
    code: "fruits = ['Apple', 'Banana', 'Cherry']\nprint(fruits[1])",
    output: "Banana"
  },
  "t_py_9": {
    content: "<h1>String Manipulation</h1><p>We can manipulate text using methods like <code>.upper()</code> or <code>.replace()</code>.</p><p>Convert the string to uppercase.</p>",
    code: "text = 'hello world'\nprint(text.upper())",
    output: "HELLO WORLD"
  },
  "t_py_10": {
    content: "<h1>File Handling</h1><p>We can read/write files using <code>open()</code> in Python.</p><p>For now, just print the name of the function you would use to open a file.</p>",
    code: "print('open')",
    output: "open"
  },
  "t_py_11": {
    content: "<h1>Error Handling</h1><p>Use <code>try</code> and <code>except</code> blocks to catch runtime errors so your program doesn't crash.</p>",
    code: "try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print('Cannot divide by zero!')",
    output: "Cannot divide by zero!"
  },
  "t_py_12": {
    content: "<h1>Basic Modules and Libraries</h1><p>You can import other code files using <code>import math</code> as an example.</p><p>Find the square root of 25.</p>",
    code: "import math\nprint(math.sqrt(25))",
    output: "5.0"
  },
  "t_py_13": {
    content: "<h1>Project: Personal Finance Tracker</h1><p>You have learned the basics of Python! Now, apply your knowledge to build a simple personal finance tracker calculating a final balance from a list of transactions.</p><br/><ul><li>Calculate the sum of incomes</li><li>Subtract the total expenses</li><li>Print the final balance</li></ul>",
    code: "# Finance Tracker\ntransactions = [\n    {'type': 'income', 'amount': 1500},\n    {'type': 'expense', 'amount': 200},\n    {'type': 'expense', 'amount': 50}\n]\n\nbalance = 0\nfor t in transactions:\n    if t['type'] == 'income':\n        balance += t['amount']\n    else:\n        balance -= t['amount']\n\nprint(f'Final Balance: KES {balance}')",
    output: "Final Balance: KES 1250"
  }
};

for (const [id, details] of Object.entries(lessons)) {
  const replacement = `id: "${id}",
            lessonContent: \`${details.content}\`,
            starterCode: \`${details.code}\`,
            expectedOutput: \`${details.output}\`,`;
  
  // Need to replace smartly
  const regex = new RegExp(`id:\\s*"${id}",`, 'g');
  data = data.replace(regex, replacement);
}

fs.writeFileSync('./src/lib/mock-data.ts', data);
console.log('Mock data updated successfully!');
