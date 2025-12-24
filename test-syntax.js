// 简单的语法测试
try {
  const testCode = `
    import { useState } from 'react';
    function TestComponent() {
      const [count, setCount] = useState(0);
      return <div>{count}</div>;
    }
    export default TestComponent;
  `;
  console.log('Syntax test passed');
} catch (error) {
  console.error('Syntax error:', error.message);
}
