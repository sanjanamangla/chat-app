import { Message, User } from "@/types";

export const currentUser: User = {
  id: "user-1",
  name: "You",
  avatar: "/placeholder.svg",
  status: "online",
};

export const aiUser: User = {
  id: "ai-1",
  name: "Edu",
  avatar: "/placeholder.svg",
  status: "online",
};

export const initialMessages: Message[] = [
  {
    id: "msg-1",
    content: "Hello! I'm your educational AI assistant. How can I help you with front-end development today?",
    sender: "ai",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    status: "read",
  },
  {
    id: "msg-2",
    content: "What is the difference between CSS Grid and Flexbox?",
    sender: "user",
    timestamp: Date.now() - 23 * 60 * 60 * 1000,
    status: "read",
  },
  {
    id: "msg-3",
    content: "CSS Grid is best for creating two-dimensional layouts (rows and columns), while Flexbox is ideal for one-dimensional layouts (either row or column).\n\n**CSS Grid**:\n- Allows precise control over rows and columns.\n- Great for complex layouts like dashboards.\n\n**Flexbox**:\n- Focuses on distributing space within a single row or column.\n- Useful for aligning items or creating navigation bars.\n\nWould you like examples of when to use each?",
    sender: "ai",
    timestamp: Date.now() - 22 * 60 * 60 * 1000,
    status: "read",
    formatted: true,
  },
  {
    id: "msg-4",
    content: "Can you explain the virtual DOM in React?",
    sender: "user",
    timestamp: Date.now() - 5 * 60 * 1000,
    status: "read",
  },
];

export const aiResponses: { [key: string]: string } = {
  "Hi": "Hello! How can I assist you today?",
  "Hello": "Hi there! What can I help you with?",
  "redux": "Redux is a state management library often used with React. It provides a centralized store for managing the state of your application. Redux uses actions and reducers to update the state in a predictable way. For example:\n\n```javascript\nconst initialState = { count: 0 };\n\nfunction reducer(state = initialState, action) {\n  switch (action.type) {\n    case 'INCREMENT':\n      return { count: state.count + 1 };\n    default:\n      return state;\n  }\n}\n\nconst store = createStore(reducer);\nstore.dispatch({ type: 'INCREMENT' });\nconsole.log(store.getState()); // { count: 1 }\n```",
  "state management": "State management refers to the process of managing the state of an application. Libraries like Redux, Zustand, and MobX are commonly used for state management in React applications. They help centralize and organize state, making it easier to share data across components.",
  "CSS Grid and Flexbox": "CSS Grid is best for creating two-dimensional layouts, while Flexbox is ideal for one-dimensional layouts. Use Grid for complex layouts like dashboards and Flexbox for aligning items or creating navigation bars.",
  "virtual DOM": "The virtual DOM is a lightweight copy of the real DOM. React uses it to optimize updates by comparing the virtual DOM with the real DOM and applying only the necessary changes. This process is called 'reconciliation' and ensures efficient rendering.",
  "React Context API": "React's Context API allows you to share state across components without prop drilling. It works by creating a context, providing it at a higher level, and consuming it in child components. For example:\n\n```jsx\nconst ThemeContext = React.createContext();\n\nfunction App() {\n  const theme = 'dark';\n  return (\n    <ThemeContext.Provider value={theme}>\n      <ChildComponent />\n    </ThemeContext.Provider>\n  );\n}\n\nfunction ChildComponent() {\n  const theme = React.useContext(ThemeContext);\n  return <div>The theme is {theme}</div>;\n}\n```",
  "What is React?": "React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and manage the state of their applications efficiently. React uses a declarative approach, meaning you describe what the UI should look like, and React takes care of updating the DOM to match that description.",
  "What is JSX?": "JSX stands for JavaScript XML. It is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript. For example:\n\n```jsx\nconst element = <h1>Hello, world!</h1>;\n```\nJSX makes it easier to write and visualize the structure of your components. Under the hood, JSX is transpiled into JavaScript function calls like `React.createElement`.",
  "What are React hooks?": "React hooks are functions that let you use state and other React features in functional components. Common hooks include:\n\n- `useState`: For managing state.\n- `useEffect`: For side effects like data fetching or subscriptions.\n- `useContext`: For accessing context values.\n\nFor example:\n\n```jsx\nimport React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}\n```",
  "What is TypeScript?": "TypeScript is a superset of JavaScript that adds static typing. It helps catch errors during development and improves code readability and maintainability. For example:\n\n```typescript\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\nconst result = add(2, 3); // TypeScript ensures the arguments are numbers.\n```",
};

export const getTypingDelay = (message: string): number => {
  const wordCount = message.length / 5;
  const readingTimeMinutes = wordCount / 250;

  return Math.max(1500, readingTimeMinutes * 60 * 1000);
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: 'long' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};
