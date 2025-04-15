"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Trash, Edit, Calendar, Tag } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Todo } from "./todo-app"
import EditTodoDialog from "./edit-todo-dialog"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (todo: Todo) => void
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const priorityColors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} className="mt-1" />

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className={`font-medium text-base ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                {todo.title}
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                {todo.category && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {todo.category}
                  </Badge>
                )}

                <Badge className={priorityColors[todo.priority]}>
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </Badge>

                {todo.dueDate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(todo.dueDate), "MMM d, yyyy")}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)}>
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>

      <EditTodoDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} todo={todo} onUpdateTodo={onUpdate} />
    </Card>
  )
}
