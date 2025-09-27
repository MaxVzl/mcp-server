import type { Components } from 'react-markdown'
import React from 'react'
 
export const components: Components = {
  // Titres
  h1: ({ children, ...props }) => (
    <h1 className="text-lg font-bold text-gray-900 mb-2 mt-4 first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-base font-semibold text-gray-800 mb-2 mt-3 first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-sm font-medium text-gray-700 mb-1 mt-2 first:mt-0" {...props}>
      {children}
    </h3>
  ),
  
  // Paragraphes
  p: ({ children, ...props }) => (
    <p className="mb-1 last:mb-0 text-gray-700 leading-relaxed whitespace-pre-line" {...props}>
      {children}
    </p>
  ),
  
  // Listes
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside mb-2 space-y-1 text-gray-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-700" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-sm" {...props}>
      {children}
    </li>
  ),
  
  // Code
  code: ({ children, className, ...props }) => {
    const isInline = !className?.includes('language-')
    
    if (isInline) {
      return (
        <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono" {...props}>
          {children}
        </code>
      )
    }
    
    return (
      <code className="block bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono overflow-x-auto" {...props}>
        {children}
      </code>
    )
  },
  
  pre: ({ children, ...props }) => (
    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono overflow-x-auto mb-2" {...props}>
      {children}
    </pre>
  ),
  
  // Liens
  a: ({ children, href, ...props }) => (
    <a 
      href={href} 
      className="text-blue-600 hover:text-blue-800 underline" 
      target="_blank" 
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  
  // Citations
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-600 mb-2" {...props}>
      {children}
    </blockquote>
  ),
  
  // Tableaux
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-2">
      <table className="min-w-full border-collapse border border-gray-300 text-xs" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-gray-300 bg-gray-100 px-2 py-1 text-left font-medium" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-gray-300 px-2 py-1" {...props}>
      {children}
    </td>
  ),
  
  // Séparateurs
  hr: ({ ...props }) => (
    <hr className="border-gray-300 my-3" {...props} />
  ),
  
  // Texte fort et emphase
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-gray-700" {...props}>
      {children}
    </em>
  ),
}
 
export function useMDXComponents(): Components {
  return components
}