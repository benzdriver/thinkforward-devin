import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          
          <style>{`
            /* Base Tailwind styles */
            *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: #e5e7eb; }
            html { line-height: 1.5; -webkit-text-size-adjust: 100%; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }
            body { margin: 0; font-family: inherit; line-height: inherit; background-color: #f9fafb; }
            
            /* Layout */
            main { padding: 1rem; max-width: 1200px; margin: 0 auto; }
            aside { position: fixed; top: 0; left: 0; bottom: 0; width: 240px; background-color: #1e3a8a; color: white; padding: 1rem; z-index: 50; }
            aside nav { display: flex; flex-direction: column; margin-top: 2rem; }
            aside nav a { color: #e2e8f0; padding: 0.5rem 0; text-decoration: none; }
            aside nav a:hover { color: white; }
            
            /* Primary colors */
            .text-primary, a { color: #2563EB; }
            .bg-primary { background-color: #2563EB; }
            .border-primary { border-color: #2563EB; }
            
            /* Text utilities */
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .text-base { font-size: 1rem; line-height: 1.5rem; }
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
            .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
            h1 { font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; margin-bottom: 1rem; }
            h2 { font-size: 1.5rem; line-height: 2rem; font-weight: 600; margin-bottom: 0.75rem; }
            h3 { font-size: 1.25rem; line-height: 1.75rem; font-weight: 600; margin-bottom: 0.5rem; }
            p { margin-bottom: 1rem; }
            
            /* Font weights */
            .font-normal { font-weight: 400; }
            .font-medium { font-weight: 500; }
            .font-semibold { font-weight: 600; }
            .font-bold { font-weight: 700; }
            
            /* Spacing */
            .p-0 { padding: 0; }
            .p-1 { padding: 0.25rem; }
            .p-2 { padding: 0.5rem; }
            .p-4 { padding: 1rem; }
            .p-6 { padding: 1.5rem; }
            .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
            .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
            .m-0 { margin: 0; }
            .m-1 { margin: 0.25rem; }
            .m-2 { margin: 0.5rem; }
            .m-4 { margin: 1rem; }
            .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .my-4 { margin-top: 1rem; margin-bottom: 1rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mt-2 { margin-top: 0.5rem; }
            .mt-4 { margin-top: 1rem; }
            
            /* Flexbox */
            .flex { display: flex; }
            .inline-flex { display: inline-flex; }
            .flex-col { flex-direction: column; }
            .flex-row { flex-direction: row; }
            .flex-wrap { flex-wrap: wrap; }
            .items-center { align-items: center; }
            .items-start { align-items: flex-start; }
            .justify-center { justify-content: center; }
            .justify-between { justify-content: space-between; }
            .justify-start { justify-content: flex-start; }
            .justify-end { justify-content: flex-end; }
            .space-x-2 > * + * { margin-left: 0.5rem; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .gap-2 { gap: 0.5rem; }
            .gap-4 { gap: 1rem; }
            
            /* Borders */
            .rounded { border-radius: 0.25rem; }
            .rounded-md { border-radius: 0.375rem; }
            .rounded-lg { border-radius: 0.5rem; }
            .rounded-full { border-radius: 9999px; }
            .border { border-width: 1px; }
            .border-t { border-top-width: 1px; }
            .border-b { border-bottom-width: 1px; }
            .border-gray-200 { border-color: #e5e7eb; }
            .border-gray-300 { border-color: #d1d5db; }
            
            /* Backgrounds */
            .bg-white { background-color: #ffffff; }
            .bg-gray-50 { background-color: #f9fafb; }
            .bg-gray-100 { background-color: #f3f4f6; }
            .bg-gray-200 { background-color: #e5e7eb; }
            .bg-blue-500 { background-color: #3b82f6; }
            .bg-blue-600 { background-color: #2563eb; }
            .bg-blue-700 { background-color: #1d4ed8; }
            
            /* Text colors */
            .text-white { color: #ffffff; }
            .text-gray-500 { color: #6b7280; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-700 { color: #374151; }
            .text-gray-800 { color: #1f2937; }
            .text-gray-900 { color: #111827; }
            .text-blue-500 { color: #3b82f6; }
            .text-blue-600 { color: #2563eb; }
            .text-blue-700 { color: #1d4ed8; }
            
            /* Shadows */
            .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
            .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
            
            /* Buttons */
            button, .btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; padding: 0.5rem 1rem; font-weight: 500; cursor: pointer; }
            button[disabled], .btn[disabled] { opacity: 0.5; cursor: not-allowed; }
            .btn-primary, button[type="submit"] { background-color: #2563EB; color: white; }
            .btn-primary:hover, button[type="submit"]:hover { background-color: #1D4ED8; }
            .btn-outline { background-color: transparent; border: 1px solid #d1d5db; color: #374151; }
            .btn-outline:hover { background-color: #f3f4f6; }
            
            /* Cards */
            .card, section { background-color: white; border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 1.5rem; margin-bottom: 1.5rem; }
            
            /* Forms */
            input, textarea, select { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background-color: white; }
            input:focus, textarea:focus, select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
            label { display: block; font-weight: 500; margin-bottom: 0.5rem; }
            
            /* Tables */
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { font-weight: 600; background-color: #f9fafb; }
            
            /* Badges */
            .badge { display: inline-flex; align-items: center; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
            .badge-blue { background-color: #dbeafe; color: #1e40af; }
            .badge-green { background-color: #d1fae5; color: #065f46; }
            .badge-yellow { background-color: #fef3c7; color: #92400e; }
            .badge-red { background-color: #fee2e2; color: #991b1b; }
            
            /* Progress */
            .progress { width: 100%; height: 0.5rem; background-color: #e5e7eb; border-radius: 9999px; overflow: hidden; }
            .progress-bar { height: 100%; background-color: #3b82f6; }
            
            /* Utilities */
            .hidden { display: none; }
            .block { display: block; }
            .inline-block { display: inline-block; }
            .w-full { width: 100%; }
            .h-full { height: 100%; }
            .max-w-md { max-width: 28rem; }
            .max-w-lg { max-width: 32rem; }
            .max-w-xl { max-width: 36rem; }
            .max-w-2xl { max-width: 42rem; }
            .max-w-3xl { max-width: 48rem; }
            .max-w-4xl { max-width: 56rem; }
            .max-w-5xl { max-width: 64rem; }
            .max-w-6xl { max-width: 72rem; }
            .max-w-7xl { max-width: 80rem; }
            .overflow-hidden { overflow: hidden; }
            .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .cursor-pointer { cursor: pointer; }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
