import { useState } from 'react';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
}

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) => {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof T, value: any) => {
    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: value,
      },
    }));
  };

  const handleBlur = (field: keyof T) => {
    setFormState((prev) => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: true,
      },
    }));

    if (validate) {
      const errors = validate(formState.values);
      setFormState((prev) => ({
        ...prev,
        errors,
      }));
    }
  };

  const handleSubmit = async () => {
    const allTouched = Object.keys(formState.values).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {} as Partial<Record<keyof T, boolean>>
    );

    setFormState((prev) => ({
      ...prev,
      touched: allTouched,
    }));

    if (validate) {
      const errors = validate(formState.values);
      setFormState((prev) => ({
        ...prev,
        errors,
      }));

      if (Object.keys(errors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formState.values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
    });
  };

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};
