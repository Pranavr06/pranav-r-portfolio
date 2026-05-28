import React, { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
  options?: string[]; // for select
  rows?: number;
}

const FormInput = forwardRef<HTMLElement, FormInputProps>(({ 
  label, 
  error, 
  as = 'input', 
  options, 
  id,
  required,
  ...props 
}, ref) => {
  const isError = Boolean(error);
  const commonClasses = `premium-input ${isError ? 'input-error' : ''}`;

  return (
    <div className="form-group-wrapper">
      <label htmlFor={id}>
        {label} {required && '*'}
      </label>
      
      {as === 'textarea' ? (
        <textarea
          id={id}
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          className={commonClasses}
          aria-invalid={isError}
          aria-describedby={isError ? `${id}-error` : undefined}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === 'select' ? (
        <select
          id={id}
          ref={ref as React.RefObject<HTMLSelectElement>}
          className={commonClasses}
          aria-invalid={isError}
          aria-describedby={isError ? `${id}-error` : undefined}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {props.children}
          {options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          ref={ref as React.RefObject<HTMLInputElement>}
          className={commonClasses}
          aria-invalid={isError}
          aria-describedby={isError ? `${id}-error` : undefined}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      <div className={`error-message-wrapper ${isError ? 'show' : ''}`} aria-live="polite">
        <div className="error-message-content" id={`${id}-error`}>
          {error}
        </div>
      </div>
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
