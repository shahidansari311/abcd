import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="text-body-sm font-base text-text-muted mb-1">{label}</label>}
      <input
        ref={ref}
        className={`px-4 py-2 border rounded font-base text-body bg-bg-surface focus:outline-none focus:border-accent-600 transition-colors ${
          error ? 'border-red-500' : 'border-border-default'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-caption text-red-500 mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
