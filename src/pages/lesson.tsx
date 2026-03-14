import { useState } from "react";
import { useRoute, Link } from "wouter";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  BookOpen,
  Copy,
  CheckCircle2,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const MOCK_LESSON = {
  title: "The if Statement",
  course: "Learn Go: Conditionals",
  timeRemaining: "6 min",
  content: `
What if...? What if we're hungry? If it's raining? If the alarm's ringing?

We would do something in response to these conditions.

\`if\` statements work very similarly to our own decision-making process. Let's look at Go's \`if\` statement:

\`\`\`go
alarmRinging := true
if alarmRinging {
  fmt.Println("Turn off the alarm!!")
}
\`\`\`

In our example, we have a variable \`alarmRinging\` that has a value of \`true\`. Then we have an \`if\` statement that checks if the condition next to the \`if\` keyword is \`true\`. Then we have an opening curly brace \`{\` with code inside followed by a closing curly brace \`}\`. If the condition is \`true\`, then the code in between the curly braces \`{}\` is executed. In this case, "Turn off the alarm!!" is printed to the console.

In our \`if\` statement we could have provided parentheses, like so:
`,
  defaultCode: `package main

import "fmt"

func main() {
    heistReady := true
    if(heistReady) {
      fmt.Println("Ready to go!")
    }
}
`,
};

export default function Lesson() {
  const [, params] = useRoute("/courses/:courseId/lesson/:lessonId");
  const { toast } = useToast();
  
  const [code, setCode] = useState(MOCK_LESSON.defaultCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("");
    
    // Simulate compilation/execution time
    setTimeout(() => {
      if (code.includes("fmt.Println")) {
        // Simple mock to just print out the strings it finds
        const matches = code.match(/fmt\.Println\("(.*?)"\)/g);
        if (matches) {
          const prints = matches.map(m => m.replace('fmt.Println("', '').replace('")', ''));
          setOutput(prints.join('\n'));
        } else {
          setOutput("Ready to go!");
        }
      } else {
        setOutput("");
      }
      setIsRunning(false);
    }, 800);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(
      `alarmRinging := true\nif alarmRinging {\n  fmt.Println("Turn off the alarm!!")\n}`
    );
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#10162F] text-slate-200 overflow-hidden font-sans">
      
      {/* Top Navigation Bar */}
      <header className="h-[60px] bg-[#1a233a] border-b border-[#2d3748] flex items-center justify-between px-4 shrink-0 shadow-sm z-10 w-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-sm">
            <Link href="/courses">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="h-6 w-px bg-slate-700 mx-2" />
          <h1 className="font-bold text-lg text-white font-display tracking-wide">{MOCK_LESSON.course}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="bg-transparent border-[#2d3748] text-slate-300 hover:text-white hover:bg-slate-800 rounded-sm font-semibold h-9 px-4">
            Get Unstuck
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent border-[#2d3748] text-slate-300 hover:text-white hover:bg-slate-800 rounded-sm font-semibold h-9 px-4">
            Tools
          </Button>
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center border border-indigo-400 font-bold text-white shadow-sm">
            U
          </div>
        </div>
      </header>

      {/* Main Content Area (Resizable Panels) */}
      <main className="flex-1 overflow-hidden flex w-full">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full rounded-none">
          
          {/* Left Panel: Content / Instructions */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="bg-white flex flex-col h-full border-r-2 border-slate-900 border-solid z-20">
            <div className="p-4 border-b border-slate-200 shrink-0 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{MOCK_LESSON.course.toUpperCase()}</span>
              {/* Hamburger menu mock */}
              <button className="text-slate-400 hover:text-slate-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            </div>
            
            <ScrollArea className="flex-1 w-full bg-white">
              <div className="p-6 pb-24 prose prose-slate max-w-none text-slate-800">
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2 mt-0 tracking-tight">{MOCK_LESSON.title}</h2>
                <div className="text-sm font-medium text-slate-500 mb-8 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  {MOCK_LESSON.timeRemaining}
                </div>
                
                <div className="space-y-6 text-[15px] leading-relaxed">
                  <p>What if...? What if we're hungry? If it's raining? If the alarm's ringing?</p>
                  
                  <p>We would do something in response to these conditions.</p>
                  
                  <p>
                    <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] font-mono border border-slate-200">if</code> statements work very similarly to our own decision-making process. Let's look at Go's <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] border border-slate-200">if</code> statement:
                  </p>
                  
                  {/* Mock Code Block in Instructions */}
                  <div className="relative group rounded-md overflow-hidden border-2 border-slate-800 shadow-[4px_4px_0px_0px_#1e293b] my-6">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-8 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm"
                        onClick={handleCopyCode}
                      >
                        {isCopied ? <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> : <Copy className="w-4 h-4 mr-1.5" />}
                        {isCopied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <pre className="m-0 p-4 bg-[#1e293b] text-slate-300 text-[13px] font-mono leading-relaxed overflow-x-auto">
                      <span className="text-blue-300">alarmRinging</span> := <span className="text-orange-300">true</span>{"\n"}
                      <span className="text-purple-400">if</span> <span className="text-blue-300">alarmRinging</span> {"{"}{"\n"}
                      {"  "}fmt.Println(<span className="text-green-300">"Turn off the alarm!!"</span>){"\n"}
                      {"}"}
                    </pre>
                  </div>
                  
                  <p>
                    In our example, we have a variable <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] border border-slate-200">alarmRinging</code> that has a value of <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] border border-slate-200">true</code>. Then we have an <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] border border-slate-200">if</code> statement that checks if the condition next to the <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] border border-slate-200">if</code> keyword is <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] border border-slate-200">true</code>. Then we have an opening curly brace <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] border border-slate-200">{"{"}</code> with code inside followed by a closing curly brace <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] border border-slate-200">{"}"}</code>. If the condition is <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] border border-slate-200">true</code>, then the code in between the curly braces <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] border border-slate-200">{"{}"}</code> is executed. In this case, "Turn off the alarm!!" is printed to the console.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </ResizablePanel>
          
          <ResizableHandle className="w-1.5 bg-[#10162F] hover:bg-indigo-500 active:bg-indigo-600 transition-colors z-30" />
          
          {/* Middle Panel: Code Editor */}
          <ResizablePanel defaultSize={40} minSize={20} className="bg-[#10162F] flex flex-col h-full z-10">
            <div className="h-10 bg-[#1a233a] border-b border-[#2d3748] flex items-center px-4 shrink-0 shadow-sm">
              <div className="flex items-center gap-2 bg-[#2d3748]/50 px-3 py-1 rounded-sm border border-[#2d3748]">
                <span className="text-xs font-mono text-slate-300">main.go</span>
                <button className="text-slate-500 hover:text-slate-300 ml-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full bg-[#1e1e1e] relative">
              <Editor
                height="100%"
                defaultLanguage="go"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineHeight: 24,
                  padding: { top: 16, bottom: 16 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  fontLigatures: true,
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  formatOnPaste: true,
                  renderLineHighlight: "all",
                  scrollbar: {
                    vertical: "hidden",
                    horizontal: "hidden"
                  }
                }}
                className="absolute inset-0"
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle className="w-1.5 bg-[#10162F] hover:bg-indigo-500 active:bg-indigo-600 transition-colors z-30" />
          
          {/* Right Panel: Terminal / Output */}
          <ResizablePanel defaultSize={30} minSize={15} className="bg-[#0d1226] flex flex-col h-full border-l border-[#2d3748] z-10">
            <div className="h-10 border-b border-[#2d3748] flex items-center px-4 shrink-0 bg-[#0d1226]">
              <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Output</span>
            </div>
            <div className="flex-1 p-4 font-mono text-[13px] text-slate-300 overflow-auto whitespace-pre-wrap leading-relaxed">
              {isRunning ? (
                <div className="flex items-center gap-2 text-indigo-400">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  Running...
                </div>
              ) : output ? (
                output
              ) : (
                <span className="text-slate-600 italic">Click Run to execute your code</span>
              )}
            </div>
          </ResizablePanel>
          
        </ResizablePanelGroup>
      </main>

      {/* Bottom Action Bar */}
      <footer className="h-[60px] bg-[#1a233a] border-t border-[#2d3748] px-4 md:px-6 flex items-center justify-between shrink-0 z-30 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4 w-1/3">
          <Button 
            className="bg-[#FFD300] hover:bg-[#e6be00] text-black font-bold border-2 border-[#10162F] shadow-[2px_2px_0px_0px_#10162F] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all rounded-sm px-6 h-10"
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                Running
              </span>
            ) : (
              <span className="flex items-center gap-1.5 tracking-wide">
                Run
              </span>
            )}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 h-10 w-10">
              <BookOpen className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center w-1/3 text-sm font-bold text-slate-400 tracking-wider">
          2/13
        </div>
        
        <div className="flex items-center justify-end gap-3 w-1/3">
          <Button variant="outline" className="bg-transparent border-[#2d3748] text-white hover:bg-slate-800 rounded-sm font-bold h-10 px-5 transition-colors">
            Back
          </Button>
          <Button className="bg-[#1a233a] opacity-50 cursor-not-allowed border border-[#2d3748] text-slate-500 rounded-sm font-bold h-10 px-5">
            Next
          </Button>
        </div>
      </footer>
    </div>
  );
}
