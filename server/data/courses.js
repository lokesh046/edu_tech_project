const courses = [
  { 
    id: '1', 
    title: 'Introduction to Python', 
    description: 'Learn the fundamentals of Python, one of the most popular programming languages in the world.',
    detailedDescription: 'This course covers everything from basic syntax to advanced topics like object-oriented programming. It is designed for absolute beginners with no prior programming experience.',
    contents: [
        { module: 1, moduleId: 'py-1', title: 'Introduction to Python and Setup', topics: [ { id: 'py-1-1', text: 'What is Python?' }, { id: 'py-1-2', text: 'Installing Python and VS Code' }, { id: 'py-1-3', text: 'Running your first Python script' }, { id: 'py-1-4', text: 'Understanding the Python interpreter' } ] },
        { module: 2, moduleId: 'py-2', title: 'Variables, Data Types, and Operators', topics: [ { id: 'py-2-1', text: 'Working with Numbers and Strings' }, { id: 'py-2-2', text: 'Understanding Variables' }, { id: 'py-2-3', text: 'Basic Operators (Arithmetic, Comparison)' }, { id: 'py-2-4', text: 'Getting User Input' } ] },
        { module: 3, moduleId: 'py-3', title: 'Control Flow: If Statements and Loops', topics: [ { id: 'py-3-1', text: 'Conditional logic with if, elif, else' }, { id: 'py-3-2', text: 'Repeating tasks with For loops' }, { id: 'py-3-3', text: 'Using While loops' }, { id: 'py-3-4', text: 'Break and Continue statements' } ] },
        { module: 4, moduleId: 'py-4', title: 'Functions and Modules', topics: [ { id: 'py-4-1', text: 'Defining and calling functions' }, { id: 'py-4-2', text: 'Function arguments and return values' }, { id: 'py-4-3', text: 'Understanding variable scope' }, { id: 'py-4-4', text: 'Importing and using modules' } ] },
    ],
    fees: { amount: 49.99, currency: 'USD', paymentLink: '#' }
  },
  { 
    id: '2', 
    title: 'Advanced React', 
    description: 'Deep dive into React hooks, state management, and performance.',
    detailedDescription: 'Take your React skills from intermediate to advanced. This course explores modern state management with Redux Toolkit, advanced hook patterns, and optimization techniques for building high-performance applications.',
    contents: [
        { module: 1, moduleId: 'react-1', title: 'Advanced Hooks', topics: [ { id: 'react-1-1', text: 'Mastering useEffect for data fetching' }, { id: 'react-1-2', text: 'State management with useReducer' }, { id: 'react-1-3', text: 'Optimizing with useCallback and useMemo' }, { id: 'react-1-4', text: 'Creating custom hooks' } ] },
        { module: 2, moduleId: 'react-2', title: 'State Management with Redux Toolkit', topics: [ { id: 'react-2-1', text: 'Understanding the global state problem' }, { id: 'react-2-2', text: 'Setting up Redux Toolkit and the store' }, { id: 'react-2-3', text: 'Creating slices and reducers' }, { id: 'react-2-4', text: 'Dispatching actions and selecting state with useSelector' } ] },
        { module: 3, moduleId: 'react-3', title: 'Advanced Routing', topics: [ { id: 'react-3-1', text: 'Protected routes for authentication' }, { id: 'react-3-2', text: 'Nested routes and layouts' }, { id: 'react-3-3', text: 'Dynamic routing with URL parameters' }, { id: 'react-3-4', text: 'Programmatic navigation with useNavigate' } ] },
    ],
    fees: { amount: 89.99, currency: 'USD', paymentLink: '#' }
  },
  { 
    id: '3', 
    title: 'Node.js for Beginners', 
    description: 'Build fast and scalable backend applications with Node.js and Express.',
    detailedDescription: 'Learn to build a complete REST API from scratch. This course covers the fundamentals of Node.js, building servers with Express, and connecting to a MongoDB database with Mongoose.',
    contents: [
        { module: 1, moduleId: 'node-1', title: 'Introduction to Node.js', topics: [ { id: 'node-1-1', text: 'What is Node.js? The Event Loop' }, { id: 'node-1-2', text: 'Node.js Modules: CommonJS vs ES Modules' }, { id: 'node-1-3', text: 'Working with the File System (fs module)' }, { id: 'node-1-4', text: 'Introduction to NPM (Node Package Manager)' } ] },
        { module: 2, moduleId: 'node-2', title: 'Building a Server with Express', topics: [ { id: 'node-2-1', text: 'Setting up an Express server' }, { id: 'node-2-2', text: 'Understanding routing and handlers' }, { id: 'node-2-3', text: 'Working with middleware' }, { id: 'node-2-4', text: 'Handling POST requests and body parsing' } ] },
        { module: 3, moduleId: 'node-3', title: 'Authentication and Security', topics: [ { id: 'node-3-1', text: 'Password hashing with bcrypt' }, { id: 'node-3-2', text: 'Implementing JSON Web Tokens (JWT)' }, { id: 'node-3-3', text: 'Creating protected routes with middleware' }, { id: 'node-3-4', text: 'Storing secrets in environment variables' } ] }
    ],
    fees: { amount: 69.99, currency: 'USD', paymentLink: '#' }
  },
];

module.exports = courses;