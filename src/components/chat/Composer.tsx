import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;
    e.preventDefault();
    handleSend();
  };
  return (
    <div className="p-3 sm:px-6 bg-transparent flex justify-center items-end gap-2">
      <div
        className="flex-1 flex items-center gap-2 bg-card/80 border border-primary/50
                  rounded-4xl px-4 py-1.5 focus-within:ring-1 focus-within:ring-primary/20"
      >
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-transparent! border-0 shadow-none focus-visible:ring-0
                    text-sm py-2 px-0 resize-none min-h-9 max-h-50 overflow-y-auto
                    [unicode-bidi:plaintext] scrollbar-hide wrap-anywhere"
        />
      </div>
      <Button
        size="icon"
        onClick={handleSend}
        className="h-11 w-11 rounded-full shrink-0 p-0 hover:bg-chart-5!
                text-white bg-chart-5 flex items-center justify-center
                  focus-within:ring-1 focus-within:ring-primary/20"
      >
        <Send className="size-6" />
      </Button>
    </div>
  );
}
