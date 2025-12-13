import {Category} from "@/types/category";

export const CATEGORIES: Category[] =
  [
    { id: "1", name: "Salary", type: "income", color: "#10b981", icon: "💰" },
    { id: "2", name: "Freelance", type: "income", color: "#3b82f6", icon: "💼" },
    { id: "3", name: "Investment", type: "income", color: "#8b5cf6", icon: "📈" },
    { id: "4", name: "Food", type: "expense", color: "#ef4444", icon: "🍔" },
    { id: "5", name: "Transport", type: "expense", color: "#f59e0b", icon: "🚗" },
    { id: "6", name: "Shopping", type: "expense", color: "#ec4899", icon: "🛍️" },
    { id: "7", name: "Bills", type: "expense", color: "#6366f1", icon: "📄" },
  ];

export const COLOR_OPTIONS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"]

export const ICON_OPTIONS = ["💰", "💼", "📈", "🍔", "🚗", "🛍️", "📄", "🏠", "💊", "🎮", "✈️", "📚"]