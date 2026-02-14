import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const tasks = [
  { id: "a", duration: 7, predecessors: [] },
  { id: "b", duration: 7, predecessors: ["a"] },
  { id: "c", duration: 15, predecessors: ["b"] },
  { id: "d", duration: 30, predecessors: ["c"] },
  { id: "e", duration: 45, predecessors: ["d"] },
  { id: "f", duration: 15, predecessors: ["d"] },
  { id: "g", duration: 45, predecessors: ["d"] },
  { id: "h", duration: 60, predecessors: [] },
  { id: "i", duration: 20, predecessors: ["h"] },
  { id: "j", duration: 30, predecessors: ["i"] },
  { id: "k", duration: 30, predecessors: ["f"] },
  { id: "l", duration: 15, predecessors: ["k"] },
  { id: "m", duration: 30, predecessors: ["g"] },
  { id: "n", duration: 15, predecessors: ["j"] },
  { id: "o", duration: 30, predecessors: ["m"] },
  { id: "p", duration: 15, predecessors: ["n"] },
  { id: "q", duration: 15, predecessors: ["m"] },
  { id: "r", duration: 15, predecessors: ["o"] },
  { id: "s", duration: 30, predecessors: ["q"] },
  { id: "t", duration: 7, predecessors: ["q"] },
  { id: "u", duration: 4, predecessors: ["p"] },
  { id: "v", duration: 2, predecessors: ["r"] },
  { id: "w", duration: 7, predecessors: ["t"] },
];

function AdjacencyMatrix({ tasks }) {
  const taskIds = tasks.map(t => t.id);
  const matrix = taskIds.map(rowId =>
    taskIds.map(colId => {
      const task = tasks.find(t => t.id === colId);
      return task.predecessors.includes(rowId) ? 1 : 0;
    })
  );

  return (
    <Card className="p-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Tableau d'adjacence</h2>
        <table className="table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1">Tâche</th>
              {taskIds.map(id => (
                <th key={id} className="border border-gray-400 px-2 py-1">
                  {id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={taskIds[i]}>
                <td className="border border-gray-400 px-2 py-1 font-bold">
                  {taskIds[i]}
                </td>
                {row.map((cell, j) => (
                  <td key={j} className="border border-gray-400 px-2 py-1 text-center">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export default function OrdonnancementApp() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Projet d'Ordonnancement - Graphe Orienté</h1>
      <AdjacencyMatrix tasks={tasks} />
    </div>
  );
}
