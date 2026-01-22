import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader } from 'lucide-react';

// Form Field Component - Base reusable field
const FormField = ({ 
  label, 
  name, 
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  placeholder,
  disabled,
  options, // for select/radio
  multiple, // for select
  rows, // for textarea
  accept, // for file input
  min,
  max,
  step,
  pattern,
  inputRef,
  className = '',
  helperText,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const showError = touched && error;

  const baseInputClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
    showError 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:ring-blue-500'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            ref={inputRef}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows || 4}
            className={`${baseInputClasses} ${className}`}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            ref={inputRef}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            multiple={multiple}
            className={`${baseInputClasses} ${className}`}
            {...props}
          >
            <option value="">Select {label}</option>
            {options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  disabled={disabled}
                  required={required}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  {...props}
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              ref={inputRef}
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              required={required}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              {...props}
            />
            <span className="text-gray-700">{label}</span>
          </label>
        );

      case 'password':
        return (
          <div className="relative">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              className={`${baseInputClasses} pr-10 ${className}`}
              {...props}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        );

      case 'file':
        return (
          <input
            ref={inputRef}
            type="file"
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            accept={accept}
            multiple={multiple}
            className={`${baseInputClasses} ${className}`}
            {...props}
          />
        );

      default:
        return (
          <input
            ref={inputRef}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
            className={`${baseInputClasses} ${className}`}
            {...props}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="mb-4">
        {renderInput()}
        {showError && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
        {helperText && !showError && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      {label && type !== 'checkbox' && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {showError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      {helperText && !showError && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

// Main Form Component
const Form = ({
  fields,
  onSubmit,
  validationSchema,
  initialValues = {},
  buttons,
  title,
  description,
  loading = false,
  className = '',
  showSuccessMessage = false,
  successMessage = 'Form submitted successfully!',
  layout = 'vertical', // 'vertical' or 'horizontal' or 'grid'
  gridCols = 2
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fieldRefs = useRef({});

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const validate = (fieldName, value) => {
    if (!validationSchema || !validationSchema[fieldName]) return '';

    const rules = validationSchema[fieldName];
    
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return rules.required;
    }

    if (rules.minLength && value.length < rules.minLength.value) {
      return rules.minLength.message;
    }

    if (rules.maxLength && value.length > rules.maxLength.value) {
      return rules.maxLength.message;
    }

    if (rules.pattern && !rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }

    if (rules.min && parseFloat(value) < rules.min.value) {
      return rules.min.message;
    }

    if (rules.max && parseFloat(value) > rules.max.value) {
      return rules.max.message;
    }

    if (rules.custom) {
      return rules.custom(value, values);
    }

    return '';
  };

  const validateAll = () => {
    const newErrors = {};
    fields.forEach(field => {
      const error = validate(field.name, values[field.name]);
      if (error) newErrors[field.name] = error;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    let fieldValue;
    if (type === 'checkbox') {
      fieldValue = checked;
    } else if (type === 'file') {
      fieldValue = files;
    } else {
      fieldValue = value;
    }

    setValues(prev => ({ ...prev, [name]: fieldValue }));
    
    if (touched[name]) {
      const error = validate(name, fieldValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    
    const allTouched = {};
    fields.forEach(field => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);

    const newErrors = validateAll();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const firstErrorField = fields.find(field => newErrors[field.name]);
      if (firstErrorField && fieldRefs.current[firstErrorField.name]) {
        fieldRefs.current[firstErrorField.name].focus();
      }
    }
  };

  const handleReset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitSuccess(false);
  };

  const getGridClasses = () => {
    if (layout === 'grid') {
      return `grid grid-cols-1 md:grid-cols-${gridCols} gap-4`;
    }
    return '';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {description && (
            <p className="text-gray-600 mt-2">{description}</p>
          )}
        </div>
      )}

      {submitSuccess && showSuccessMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle size={20} />
          {successMessage}
        </div>
      )}

      <div onSubmit={handleSubmit}>
        <div className={getGridClasses()}>
          {fields.map((field, index) => (
            <FormField
              key={field.name}
              {...field}
              value={values[field.name] || (field.type === 'checkbox' ? false : '')}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors[field.name]}
              touched={touched[field.name]}
              disabled={field.disabled || loading || isSubmitting}
              inputRef={(el) => fieldRefs.current[field.name] = el}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          {buttons ? (
            buttons.map((button, index) => (
              <button
                key={index}
                type={button.type || 'button'}
                onClick={button.type === 'submit' ? handleSubmit : button.onClick}
                disabled={button.disabled || loading || isSubmitting}
                className={button.className || 'px-6 py-2 rounded-lg transition-colors'}
              >
                {button.loading && (isSubmitting || loading) ? (
                  <span className="flex items-center gap-2">
                    <Loader className="animate-spin" size={18} />
                    {button.loadingText || 'Processing...'}
                  </span>
                ) : (
                  button.label
                )}
              </button>
            ))
          ) : (
            <>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting || loading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading || isSubmitting}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;