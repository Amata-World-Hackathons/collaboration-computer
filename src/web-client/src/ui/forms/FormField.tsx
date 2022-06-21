import classNames from "classnames";
import {
  HTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { FieldError, useFormContext } from "react-hook-form";

export interface BaseFormFieldProps {
  name: string;
  hint?: string;
  label?: string;
  inputId?: string;
  className?: string;
  wrapInput?: (input: React.ReactNode) => React.ReactNode;
  registerOptions?: Record<string, unknown>;
  showOptionalLabel?: boolean;
}

function createFormField<N, T extends HTMLAttributes<N>>(
  renderInput: (props: T) => React.ReactNode,
  inputClassname: string
) {
  const FormField: React.FC<BaseFormFieldProps & T> = ({
    hint,
    name,
    label,
    inputId,
    className,
    wrapInput,
    registerOptions,
    showOptionalLabel,
    ...inputProps
  }) => {
    const { register, getFieldState } = useFormContext();

    const { error } = getFieldState(name);

    const finalProps = {
      className: classNames("input-bordered", inputClassname, {
        // input: inputProps.type !== "textarea",
        // textarea: inputProps.type === "textarea",
        "input-error": !!error,
      }),
      ...register(name, registerOptions),
      ...inputProps,
    };
    const inputEl = renderInput(finalProps as any);
    // inputProps.type === "textarea" ? (
    //   <textarea {...finalProps} />
    // ) : (
    //   <input {...finalProps} />
    // );

    return (
      <div className={classNames("form-control", className)}>
        <label htmlFor={inputId} className="label">
          {label ? <span className="label-text">{label}</span> : null}
          {showOptionalLabel ? (
            <span className="label-text">(Optional)</span>
          ) : null}
        </label>

        {wrapInput ? (
          <label htmlFor={inputId} className="input-group">
            {wrapInput(inputEl)}
          </label>
        ) : (
          inputEl
        )}

        {error ? (
          <label htmlFor={inputId} className="label">
            <span className="label-text text-red-500">
              {formatErrors(error)}
            </span>
          </label>
        ) : hint ? (
          <label htmlFor={inputId} className="label">
            <span className="label-text text-base-content text-xs">{hint}</span>
          </label>
        ) : null}
      </div>
    );
  };

  return FormField;
}

export const FormField = createFormField(
  (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  "input"
);

export const TextareaFormField = createFormField(
  (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} />
  ),
  "textarea"
);

function formatErrors(fieldError: FieldError) {
  if (fieldError.message) return fieldError.message;

  return fieldError.message || "Invalid input";
}

export default FormField;
