import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ChangeEvent,
  type CompositionEvent,
  type KeyboardEvent,
} from "react";
import type React from "react";

interface UseSearchInputOptions {
  defaultValue: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onClear?: () => void;
}

interface UseSearchInputReturn {
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputProps: {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onCompositionStart: () => void;
    onCompositionEnd: (e: CompositionEvent<HTMLInputElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    "aria-label": string;
    "aria-describedby"?: string;
    role: "searchbox";
    autoComplete: "off";
    lang: "ko";
    inputMode: "text";
  };
  clearButtonProps: {
    onClick: () => void;
    "aria-label": string;
    type: "button";
  };
  hasValue: boolean;
  clear: () => void;
}

export function useSearchInput({
  defaultValue,
  onChange,
  onSubmit,
  onClear,
}: UseSearchInputOptions): UseSearchInputReturn {
  const [inputValue, setInputValue] = useState(defaultValue);
  const isComposingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      onChange(value);
    },
    [onChange],
  );

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(
    (e: CompositionEvent<HTMLInputElement>) => {
      isComposingRef.current = false;
      const value = e.currentTarget.value;
      setInputValue(value);
      onChange(value);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isComposingRef.current) {
        e.preventDefault();
        onSubmit(inputValue);
        inputRef.current?.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setInputValue("");
        onChange("");
        inputRef.current?.blur();
      }
    },
    [inputValue, onSubmit, onChange],
  );

  const handleBlur = useCallback(() => {
    if (!isComposingRef.current) {
      onSubmit(inputValue);
    }
  }, [inputValue, onSubmit]);

  const handleClear = useCallback(() => {
    setInputValue("");
    onChange("");
    onClear?.();
    inputRef.current?.focus();
  }, [onChange, onClear]);

  return {
    inputValue,
    inputRef,
    inputProps: {
      value: inputValue,
      onChange: handleChange,
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      "aria-label": "검색어 입력",
      "aria-describedby": inputValue ? "search-clear-button" : undefined,
      role: "searchbox",
      autoComplete: "off",
      lang: "ko",
      inputMode: "text",
    },
    clearButtonProps: {
      onClick: handleClear,
      "aria-label": "검색어 지우기",
      type: "button",
    },
    hasValue: inputValue.length > 0,
    clear: handleClear,
  };
}

