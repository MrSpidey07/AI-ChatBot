import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import rehypeRaw from "rehype-raw";

const MessageContent = ({ content }) => {
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        components={{
          code({ inline, children, className, ...props }) {
            const language = className?.replace("language-", "");
            return !inline ? (
              <div className="relative">
                <pre
                  className="bg-black p-3 rounded-md overflow-x-auto my-4 text-white"
                  {...props}
                >
                  <code
                    className={`text-sm ${
                      language ? `language-${language}` : ""
                    }`}
                  >
                    {children}
                  </code>
                </pre>
                <button
                  className="absolute top-2 right-2 bg-gray-700 text-white text-xs py-1 px-2 rounded hover:bg-gray-600"
                  onClick={() => handleCopyCode(children)}
                >
                  Copy
                </button>
              </div>
            ) : (
              <code className="bg-gray-200 rounded px-1">{children}</code>
            );
          },
          p({ children }) {
            return <p className="my-2">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold my-4">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-semibold my-3">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-medium my-2">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 my-2">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 my-2">{children}</ol>;
          },
          li({ children }) {
            return <li className="my-1">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 pl-4 my-4 text-gray-600 italic">
                {children}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          img({ src, alt }) {
            return (
              <img src={src} alt={alt} className="my-4 max-w-full h-auto" />
            );
          },
        }}
        rehypePlugins={[rehypeRaw]} // Allow raw HTML rendering
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

MessageContent.propTypes = {
  content: PropTypes.string.isRequired,
};

export default MessageContent;
