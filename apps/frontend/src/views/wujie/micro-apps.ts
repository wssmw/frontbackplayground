/**
 * Wujie 子应用定义
 * 使用内联 HTML 字符串模拟子应用
 */

export const counterApp = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .counter-app {
      padding: 40px;
      text-align: center;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .counter-display {
      font-size: 72px;
      font-weight: bold;
      color: #3b82f6;
      margin: 30px 0;
    }
    .counter-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
    }
    .counter-btn {
      padding: 12px 30px;
      font-size: 18px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .counter-btn-inc {
      background: #3b82f6;
      color: white;
    }
    .counter-btn-dec {
      background: #ef4444;
      color: white;
    }
    .counter-btn-reset {
      background: #6b7280;
      color: white;
    }
  </style>
</head>
<body>
  <div class="counter-app">
    <h2>计数器应用 (Wujie)</h2>
    <div class="counter-display" id="counter-display">0</div>
    <div class="counter-buttons">
      <button class="counter-btn counter-btn-dec" id="counter-dec">-1</button>
      <button class="counter-btn counter-btn-reset" id="counter-reset">重置</button>
      <button class="counter-btn counter-btn-inc" id="counter-inc">+1</button>
    </div>
  </div>

  <script>
    let count = 0;
    const display = document.getElementById('counter-display');
    const incBtn = document.getElementById('counter-inc');
    const decBtn = document.getElementById('counter-dec');
    const resetBtn = document.getElementById('counter-reset');

    incBtn.onclick = () => {
      count++;
      display.textContent = count;
    };

    decBtn.onclick = () => {
      count--;
      display.textContent = count;
    };

    resetBtn.onclick = () => {
      count = 0;
      display.textContent = count;
    };
  </script>
</body>
</html>
`;

export const todoApp = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .todo-app {
      padding: 40px;
      max-width: 600px;
      margin: 0 auto;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .todo-input-group {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    .todo-input {
      flex: 1;
      padding: 12px;
      font-size: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
    }
    .todo-add-btn {
      padding: 12px 24px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    .todo-list {
      list-style: none;
      padding: 0;
    }
    .todo-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .todo-text {
      flex: 1;
    }
    .todo-delete-btn {
      padding: 6px 12px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="todo-app">
    <h2>待办事项 (Wujie)</h2>
    <div class="todo-input-group">
      <input type="text" class="todo-input" id="todo-input" placeholder="输入待办事项..." />
      <button class="todo-add-btn" id="todo-add">添加</button>
    </div>
    <ul class="todo-list" id="todo-list"></ul>
  </div>

  <script>
    let todos = [];
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('todo-add');
    const list = document.getElementById('todo-list');

    function renderTodos() {
      list.innerHTML = todos.map((todo, index) => \`
        <li class="todo-item">
          <span class="todo-text">\${todo}</span>
          <button class="todo-delete-btn" onclick="deleteTodo(\${index})">删除</button>
        </li>
      \`).join('');
    }

    window.deleteTodo = function(index) {
      todos.splice(index, 1);
      renderTodos();
    };

    addBtn.onclick = () => {
      const text = input.value.trim();
      if (text) {
        todos.push(text);
        input.value = '';
        renderTodos();
      }
    };

    input.onkeypress = (e) => {
      if (e.key === 'Enter') addBtn.click();
    };
  </script>
</body>
</html>
`;

export const chartApp = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .chart-app {
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .chart-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      justify-content: center;
    }
    .chart-btn {
      padding: 10px 20px;
      background: #8b5cf6;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    .chart-container {
      background: #f9fafb;
      border-radius: 12px;
      padding: 30px;
      min-height: 300px;
    }
    .chart-bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 250px;
      gap: 10px;
    }
    .chart-bar {
      flex: 1;
      background: linear-gradient(to top, #8b5cf6, #a78bfa);
      border-radius: 8px 8px 0 0;
      transition: all 0.3s ease;
      position: relative;
      min-width: 40px;
    }
    .chart-bar-value {
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
      font-weight: bold;
      color: #8b5cf6;
    }
  </style>
</head>
<body>
  <div class="chart-app">
    <h2>数据图表 (Wujie)</h2>
    <div class="chart-controls">
      <button class="chart-btn" id="chart-random">随机数据</button>
      <button class="chart-btn" id="chart-reset">重置</button>
    </div>
    <div class="chart-container">
      <div class="chart-bars" id="chart-bars"></div>
    </div>
  </div>

  <script>
    let data = [30, 50, 80, 45, 70, 60];
    const barsContainer = document.getElementById('chart-bars');
    const randomBtn = document.getElementById('chart-random');
    const resetBtn = document.getElementById('chart-reset');

    function renderChart() {
      barsContainer.innerHTML = data.map((value, index) => \`
        <div class="chart-bar" style="height: \${value}%">
          <span class="chart-bar-value">\${value}</span>
        </div>
      \`).join('');
    }

    randomBtn.onclick = () => {
      data = data.map(() => Math.floor(Math.random() * 90) + 10);
      renderChart();
    };

    resetBtn.onclick = () => {
      data = [30, 50, 80, 45, 70, 60];
      renderChart();
    };

    renderChart();
  </script>
</body>
</html>
`;
