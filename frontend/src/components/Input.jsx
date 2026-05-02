// ============================================================
// COMPONENTE: Input reutilizable
// Props: label, name, value, onChange, type, placeholder, error, required
// ============================================================

const Input = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-input ${error ? 'input-error' : ''}`}
      />
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
};

export default Input;
