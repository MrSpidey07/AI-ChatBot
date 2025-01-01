import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

const MessageContent = ({ content }) => {
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  return (
    <ReactMarkdown
      className="prose max-w-none dark:prose-invert"
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const isCodeBlock = !inline && match;

          return isCodeBlock ? (
            <div className="relative group">
              <SyntaxHighlighter
                language={match[1]}
                style={tomorrow}
                PreTag="div"
                className="rounded-md !bg-gray-800"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
              <button
                onClick={() => handleCopyCode(String(children))}
                className="absolute top-2 right-2 px-2 py-1 text-xs text-gray-400 
                         bg-gray-700 rounded opacity-0 group-hover:opacity-100 
                         transition-opacity duration-200"
              >
                Copy
              </button>
            </div>
          ) : (
            <code
              className="px-1.5 py-0.5 rounded-md bg-gray-200 dark:bg-gray-800 
                           text-gray-800 dark:text-gray-200 text-sm font-mono"
            >
              {children}
            </code>
          );
        },
        // Customize list rendering
        ul({ children }) {
          return <ul className="list-disc pl-6 space-y-2">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-6 space-y-2">{children}</ol>;
        },
        li({ children }) {
          return <li className="mb-1">{children}</li>;
        },
        // Style other elements
        p({ children }) {
          return <p className="mb-4">{children}</p>;
        },
        h1({ children }) {
          return <h1 className="text-2xl font-bold mb-4">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-xl font-bold mb-3">{children}</h2>;
        },
        strong({ children }) {
          return <strong className="font-semibold">{children}</strong>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

MessageContent.propTypes = {
  content: PropTypes.string.isRequired,
};

export default MessageContent;
