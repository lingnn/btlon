'use client';

import { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface DynamicField {
  key: string;
  label: string;
  type: 'text' | 'file' | 'select' | 'number';
  required?: boolean;
  options?: { label: string; value: string }[];
}

interface DynamicFormRendererProps {
  fields: DynamicField[];
  onSubmit?: (formData: Record<string, any>) => void;
}

export function DynamicFormRenderer({
  fields,
  onSubmit,
}: DynamicFormRendererProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {};
    fields.forEach((field) => {
      initialValues[field.key] = field.type === 'file' ? null : '';
    });
    return initialValues;
  });

  // Xử lý thay đổi input text/number
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldKey: string
  ) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  // Xử lý thay đổi file
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldKey: string
  ) => {
    const file = e.target.files?.[0];
    setFormValues((prev) => ({
      ...prev,
      [fieldKey]: file || null,
    }));
  };

  // Xử lý thay đổi select
  const handleSelectChange = (value: string, fieldKey: string) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  // Xử lý submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Values:', formValues);
    if (onSubmit) {
      onSubmit(formValues);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {/* Input Text */}
            {field.type === 'text' && (
              <Input
                id={field.key}
                type="text"
                placeholder={`Nhập ${field.label.toLowerCase()}`}
                value={formValues[field.key]}
                onChange={(e) => handleInputChange(e, field.key)}
                required={field.required}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            )}

            {/* Input Number */}
            {field.type === 'number' && (
              <Input
                id={field.key}
                type="number"
                placeholder={`Nhập ${field.label.toLowerCase()}`}
                value={formValues[field.key]}
                onChange={(e) => handleInputChange(e, field.key)}
                required={field.required}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            )}

            {/* Input File */}
            {field.type === 'file' && (
              <div className="relative">
                <Input
                  id={field.key}
                  type="file"
                  onChange={(e) => handleFileChange(e, field.key)}
                  required={field.required}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formValues[field.key] && (
                  <p className="mt-2 text-sm text-gray-600">
                    📎 {formValues[field.key].name}
                  </p>
                )}
              </div>
            )}

            {/* Select */}
            {field.type === 'select' && (
              <Select
                value={formValues[field.key]}
                onValueChange={(value) =>
                  handleSelectChange(value, field.key)
                }
              >
                <SelectTrigger
                  id={field.key}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <SelectValue
                    placeholder={`Chọn ${field.label.toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {field.options && field.options.length > 0 ? (
                    field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Không có lựa chọn
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}

        {/* Submit Button */}
        {fields.length > 0 && (
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 ease-in-out active:scale-95 mt-8"
          >
            Gửi
          </button>
        )}
      </form>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Không có trường dữ liệu để hiển thị</p>
        </div>
      )}
    </Card>
  );
}
