<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id' => 'required|exists:customers,id',
            'billing_period_start' => 'required|date',
            'billing_period_end' => 'required|date|after:billing_period_start',
            'due_date' => 'required|date|after:billing_period_end',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'customer_id.required' => 'Please select a customer.',
            'customer_id.exists' => 'Selected customer does not exist.',
            'billing_period_start.required' => 'Billing period start date is required.',
            'billing_period_end.required' => 'Billing period end date is required.',
            'billing_period_end.after' => 'Billing period end date must be after start date.',
            'due_date.required' => 'Due date is required.',
            'due_date.after' => 'Due date must be after billing period end date.',
            'amount.required' => 'Invoice amount is required.',
            'amount.numeric' => 'Invoice amount must be a valid number.',
        ];
    }
}