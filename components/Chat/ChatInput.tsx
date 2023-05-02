import { Message } from "@/types";
import { IconArrowUp } from "@tabler/icons-react";
import { FC, FormEventHandler, KeyboardEvent, useRef } from "react";

interface Props {
  onSend: (message: Message) => void;
}

export const ChatInput: FC<Props> = ({ onSend }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Automatically update height of text area as user types
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      // Adding 4 because min-height is 44px when textarea would normally be
      // 40px so this just adds the extra space there usually is and removes the
      // need for a scrollbar
      let newHeight = `${textareaRef.current?.scrollHeight + 4}px`;
      // Max height is 70% of the screen height
      if (textareaRef.current?.scrollHeight > 0.7 * window.innerHeight) {
        newHeight = `${0.7 * window.innerHeight + 4}px`;
      }
      textareaRef.current.style.height = newHeight;
    }

    const value = e.target.value;
    if (value.length > 4000) {
      alert("Message limit is 4000 characters");
      return;
    }
  };

  const handleSend = ({ content }: Message) => {
    if (!content) {
      alert("Please enter a message");
      return;
    }
    onSend({ role: "user", content });
  };

  // Enter doesn't submit a textarea by default. Mimic that behavior here
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleSubmit: FormEventHandler<
    HTMLFormElement | HTMLTextAreaElement
  > = async (e) => {
    e.preventDefault();
    if (textareaRef.current) {
      handleSend({
        content: textareaRef.current.value,
        role: "user",
      });
      textareaRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <form ref={formRef} onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="flex items-center min-h-[44px] rounded-lg pl-4 pr-12 p-2 w-full focus:outline-none focus:ring-1 focus:ring-neutral-300 border-2 border-neutral-200 resize-none"
          placeholder="Type a message..."
          rows={1}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          name="text-prompt"
        />
        <div className="flex items-center space-x-3 absolute right-2 top-1/2 -translate-y-1/2 justify-end">
          <button type="submit" className="h-8 w-8">
            <IconArrowUp className="right-2 bottom-3 h-8 w-8 hover:cursor-pointer rounded-full p-1 bg-accent text-white hover:opacity-80 self-end" />
          </button>
        </div>
      </form>
    </div>
  );
};
