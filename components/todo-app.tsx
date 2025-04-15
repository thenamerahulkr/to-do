"use client"

import { useState, useEffect } from "react"
import { Plus, Moon, Sun, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import TodoItem from "./todo-item"
import AddTodoDialog from "./add-todo-dialog"

export type Todo = {
  id: string
  title: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  dueDate: string | null
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const { theme, setTheme } = useTheme()

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = (todo: Omit<Todo, "id" | "completed">) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      completed: false,
    }
    setTodos([...todos, newTodo])
  }

  const toggleTodoStatus = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
  }

  // Filter and search todos
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.category.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilter === "all") return matchesSearch
    if (activeFilter === "active") return !todo.completed && matchesSearch
    if (activeFilter === "completed") return todo.completed && matchesSearch
    if (activeFilter === "high") return todo.priority === "high" && matchesSearch
    if (activeFilter === "medium") return todo.priority === "medium" && matchesSearch
    if (activeFilter === "low") return todo.priority === "low" && matchesSearch

    return matchesSearch
  })

  // Get unique categories for filtering
  const categories = Array.from(new Set(todos.map((todo) => todo.category))).filter(Boolean)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveFilter}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="high">High</TabsTrigger>
          <TabsTrigger value="medium">Medium</TabsTrigger>
          <TabsTrigger value="low">Low</TabsTrigger>
        </TabsList>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={searchQuery === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSearchQuery(category === searchQuery ? "" : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        )}

        <TabsContent value="all" className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No tasks found. Add a new task to get started!</div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodoStatus}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No active tasks found.</div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodoStatus}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No completed tasks found.</div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodoStatus}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="high" className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No high priority tasks found.</div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodoStatus}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="medium" className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No medium priority tasks found.</div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodoStatus}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="low" className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No low priority tasks found.</div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodoStatus}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      <AddTodoDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddTodo={addTodo} />
    </div>
  )
}
