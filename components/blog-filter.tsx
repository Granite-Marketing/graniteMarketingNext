"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Filter, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tag } from "@/components/ui/tag"

interface BlogFilterProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
}

export function BlogFilter({ categories, selectedCategories, onCategoryChange }: BlogFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleCategory = (category: string) => {
    if (category === "All") {
      onCategoryChange([])
    } else {
      if (selectedCategories.includes(category)) {
        onCategoryChange(selectedCategories.filter((c) => c !== category))
      } else {
        onCategoryChange([...selectedCategories, category])
      }
    }
  }

  const clearFilters = () => {
    onCategoryChange([])
  }

  const isAllSelected = selectedCategories.length === 0

  return (
    <div className="flex flex-col gap-4 mb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by topic</span>
          {!isAllSelected && (
            <Tag variant="category" size="sm">
              {selectedCategories.length} selected
            </Tag>
          )}
        </div>

        {!isAllSelected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
          >
            <X className="w-3 h-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Desktop: Toggle buttons */}
      <div className="hidden md:flex flex-wrap gap-2">
        <Tag
          variant={isAllSelected ? "selected" : "interactive"}
          size="md"
          onClick={() => toggleCategory("All")}
          className="cursor-pointer"
          role="button"
          aria-pressed={isAllSelected}
        >
          All Topics
        </Tag>
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category)
          return (
            <Tag
              key={category}
              variant={isSelected ? "selected" : "interactive"}
              size="md"
              onClick={() => toggleCategory(category)}
              className="cursor-pointer"
              role="button"
              aria-pressed={isSelected}
            >
              {category}
            </Tag>
          )
        })}
      </div>

      {/* Mobile: Dropdown menu with multi-select */}
      <div className="md:hidden w-full sm:w-auto">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between border-border/50 hover:border-primary/50 hover:bg-primary/10 hover:text-foreground bg-card/50 text-foreground transition-colors duration-200"
            >
              <span>
                {isAllSelected
                  ? "All Topics"
                  : `${selectedCategories.length} ${selectedCategories.length === 1 ? "topic" : "topics"} selected`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] bg-card border-border/50">
            <DropdownMenuItem
              onClick={() => toggleCategory("All")}
              className={`cursor-pointer hover:bg-primary/10 hover:text-foreground transition-colors duration-200 ${
                isAllSelected ? "bg-primary/10 text-primary" : "text-foreground"
              }`}
            >
              All Topics
            </DropdownMenuItem>
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category)
              return (
                <DropdownMenuItem
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`cursor-pointer hover:bg-primary/10 hover:text-foreground transition-colors duration-200 ${
                    isSelected ? "bg-primary/10 text-primary" : "text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{category}</span>
                    {isSelected && (
                      <Tag variant="category" size="sm">
                        ✓
                      </Tag>
                    )}
                  </div>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Selected filters display */}
      {!isAllSelected && (
        <div className="flex flex-wrap gap-2" role="region" aria-label="Selected filters">
          {selectedCategories.map((category) => (
            <Tag
              key={category}
              variant="category"
              size="md"
              className="pl-3 pr-1 py-1 cursor-pointer hover:bg-primary/20"
              onClick={() => toggleCategory(category)}
              role="button"
              aria-label={`Remove ${category} filter`}
            >
              {category}
              <X className="w-3 h-3 ml-1" />
            </Tag>
          ))}
        </div>
      )}
    </div>
  )
}
