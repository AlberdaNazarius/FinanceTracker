"use client"

import React, {useId, useState} from "react"
import {X} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Tag} from "@/types/tag"

type Props = {
  value: string[]
  suggestions: Tag[]
  onChange: (tags: string[]) => void
}

const normalise = (raw: string) => raw.trim().replace(/^#/, "").slice(0, 40)

const TagInput: React.FC<Props> = ({value, suggestions, onChange}) => {
  const [draft, setDraft] = useState("")
  const listId = useId()

  const add = (raw: string) => {
    const name = normalise(raw)
    if (!name) return

    const alreadyThere = value.some(
      (tag) => tag.toLowerCase() === name.toLowerCase()
    )

    if (!alreadyThere) onChange([...value, name])
    setDraft("")
  }

  const remove = (name: string) =>
    onChange(value.filter((tag) => tag !== name))

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      // Enter would otherwise submit the whole form.
      event.preventDefault()
      add(draft)
      return
    }

    if (event.key === "Backspace" && !draft && value.length > 0) {
      remove(value[value.length - 1])
    }
  }

  const unused = suggestions.filter(
    (tag) => !value.some((name) => name.toLowerCase() === tag.name.toLowerCase())
  )

  return (
    <div className="space-y-2">
      <Label htmlFor="tag-draft">Tags</Label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pl-2.5 pr-1.5 text-xs font-medium text-primary"
            >
              #{name}
              <button
                type="button"
                aria-label={`Remove ${name}`}
                onClick={() => remove(name)}
                className="cursor-pointer rounded-full p-0.5 hover:bg-primary/20"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Input
        id="tag-draft"
        list={listId}
        placeholder="coffee, then Enter"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => add(draft)}
      />

      <datalist id={listId}>
        {unused.map((tag) => (
          <option key={tag.id} value={tag.name} />
        ))}
      </datalist>
    </div>
  )
}

export default TagInput;
