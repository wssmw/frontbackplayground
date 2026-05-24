/**
 * 子应用定义
 * 包含 3 个示例子应用：Counter、Todo、Chart
 */

export const counterApp = `
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
  .counter-btn-inc:hover {
    background: #2563eb;
  }
  .counter-btn-dec {
    background: #ef4444;
    color: white;
  }
  .counter-btn-dec:hover {
    background: #dc2626;
  }
  .counter-btn-reset {
    background: #6b7280;
    color: white;
  }
  .counter-btn-reset:hover {
    background: #4b5563;
  }
</style>

<div class="counter-app">
  <h2>计数器应用</h2>
  <div class="counter-display" id="counter-display">0</div>
  <div class="counter-buttons">
    <button class="counter-btn counter-btn-dec" id="counter-dec">-1</button>
    <button class="counter-btn counter-btn-reset" id="counter-reset">重置</button>
    <button class="counter-btn counter-btn-inc" id="counter-inc">+1</button>
  </div>
</div>

<script>
  (function() {
    let count = 0;
    let display, incBtn, decBtn, resetBtn;

    window.__MICRO_APP_LIFECYCLE__ = {
      async bootstrap() {
        console.log('[Counter] bootstrap');
      },
      async mount(container) {
        console.log('[Counter] mount');
        display = container.querySelector('#counter-display');
        incBtn = container.querySelector('#counter-inc');
        decBtn = container.querySelector('#counter-dec');
        resetBtn = container.querySelector('#counter-reset');

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
      },
      async unmount() {
        console.log('[Counter] unmount');
        count = 0;
      }
    };
  })();
</script>
`;

export const todoApp = `
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
    font-size: 16px;
  }
  .todo-add-btn:hover {
    background: #059669;
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
  .todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #9ca3af;
  }
  .todo-checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .todo-text {
    flex: 1;
    font-size: 16px;
  }
  .todo-delete-btn {
    padding: 6px 12px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .todo-delete-btn:hover {
    background: #dc2626;
  }
</style>

<div class="todo-app">
  <h2>待办事项</h2>
  <div class="todo-input-group">
    <input type="text" class="todo-input" id="todo-input" placeholder="输入待办事项..." />
    <button class="todo-add-btn" id="todo-add">添加</button>
  </div>
  <ul class="todo-list" id="todo-list"></ul>
</div>

<script>
  (function() {
    let todos = [];
    let input, addBtn, list;

    function renderTodos() {
      list.innerHTML = todos.map((todo, index) => \`
        <li class="todo-item \${todo.completed ? 'completed' : ''}">
          <input type="checkbox" class="todo-checkbox" data-index="\${index}" \${todo.completed ? 'checked' : ''} />
          <span class="todo-text">\${todo.text}</span>
          <button class="todo-delete-btn" data-index="\${index}">删除</button>
        </li>
      \`).join('');

      list.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const index = parseInt(e.target.dataset.index);
          todos[index].completed = e.target.checked;
          renderTodos();
        });
      });

      list.querySelectorAll('.todo-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          todos.splice(index, 1);
          renderTodos();
        });
      });
    }

    window.__MICRO_APP_LIFECYCLE__ = {
      async bootstrap() {
        console.log('[Todo] bootstrap');
      },
      async mount(container) {
        console.log('[Todo] mount');
        input = container.querySelector('#todo-input');
        addBtn = container.querySelector('#todo-add');
        list = container.querySelector('#todo-list');

        const addTodo = () => {
          const text = input.value.trim();
          if (text) {
            todos.push({ text, completed: false });
            input.value = '';
            renderTodos();
          }
        };

        addBtn.onclick = addTodo;
        input.onkeypress = (e) => {
          if (e.key === 'Enter') addTodo();
        };

        renderTodos();
      },
      async unmount() {
        console.log('[Todo] unmount');
        todos = [];
      }
    };
  })();
</script>
`;

export const chartApp = `
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
    font-size: 14px;
  }
  .chart-btn:hover {
    background: #7c3aed;
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
  .chart-bar-label {
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #6b7280;
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

<div class="chart-app">
  <h2>数据图表</h2>
  <div class="chart-controls">
    <button class="chart-btn" id="chart-random">随机数据</button>
    <button class="chart-btn" id="chart-reset">重置</button>
  </div>
  <div class="chart-container">
    <div class="chart-bars" id="chart-bars"></div>
  </div>
</div>

<script>
  (function() {
    let data = [30, 50, 80, 45, 70, 60];
    let barsContainer, randomBtn, resetBtn;

    function renderChart() {
      barsContainer.innerHTML = data.map((value, index) => \`
        <div class="chart-bar" style="height: \${value}%">
          <span class="chart-bar-value">\${value}</span>
          <span class="chart-bar-label">项目\${index + 1}</span>
        </div>
      \`).join('');
    }

    window.__MICRO_APP_LIFECYCLE__ = {
      async bootstrap() {
        console.log('[Chart] bootstrap');
      },
      async mount(container) {
        console.log('[Chart] mount');
        barsContainer = container.querySelector('#chart-bars');
        randomBtn = container.querySelector('#chart-random');
        resetBtn = container.querySelector('#chart-reset');

        randomBtn.onclick = () => {
          data = data.map(() => Math.floor(Math.random() * 90) + 10);
          renderChart();
        };

        resetBtn.onclick = () => {
          data = [30, 50, 80, 45, 70, 60];
          renderChart();
        };

        renderChart();
      },
      async unmount() {
        console.log('[Chart] unmount');
        data = [30, 50, 80, 45, 70, 60];
      }
    };
  })();
</script>
`;
