import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";

const SearchBar = (
  {
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
      <Input
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 shadow-none bg-white"
      />
    </div>
  );
}

export default SearchBar;