import { useState } from "react";
import { PieChart, Pie, Label, Tooltip } from "recharts";

const COLORS = ["#6366f1", "#f59e0b", "#10b981"];

function StatsPanel(props) {
  const [activeIndex, setActiveIndex] = useState(null);

  const allTodos = Object.values(props.todo_list).flat();
  const total = allTodos.length;

  const statusCounts = allTodos.reduce(
    (acc, todo) => {
      if (todo.status === "Yet to Start") acc.yetToStart++;
      if (todo.status === "In Progress") acc.pending++;
      if (todo.status === "Done") acc.done++;
      return acc;
    },
    { yetToStart: 0, pending: 0, done: 0 }
  );

  const rawData = [
    { name: "Yet to Start", value: statusCounts.yetToStart },
    { name: "Pending", value: statusCounts.pending },
    { name: "Done", value: statusCounts.done }
  ];

  const data = rawData.map((entry, index) => ({
    ...entry,
    fill: COLORS[index],
    outerRadius: activeIndex === index ? 100 : 90,
    fillOpacity:
      activeIndex === null ? 1 : activeIndex === index ? 1 : 0.55
  }));

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Todo Stats</h2>
      <h4 style={{ marginBottom: "20px" }}>Overall Task Status</h4>


      <PieChart width={260} height={260}>
        <Tooltip
          formatter={(value, name) => [value, name]}
        />

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          isAnimationActive={true}
        >
          <Label
            value={total}
            position="center"
            style={{ fontSize: "20px", fontWeight: "bold" }}
          />
        </Pie>
      </PieChart>

      <div style={{ marginTop: "12px" }}>
        {data.map((d, i) => (
          <div
            key={i}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
              cursor: "pointer",
              opacity: activeIndex === null || activeIndex === i ? 1 : 0.6
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: d.fill,
                display: "inline-block"
              }}
            />
            <span>
              {d.name} {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsPanel;