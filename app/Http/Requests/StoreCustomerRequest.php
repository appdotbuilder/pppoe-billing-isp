<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'required|string',
            'pppoe_username' => 'required|string|max:100|unique:customers,pppoe_username',
            'pppoe_password' => 'required|string|min:6|max:100',
            'service_plan' => 'required|string|max:100',
            'monthly_fee' => 'required|numeric|min:0',
            'bandwidth_download' => 'required|integer|min:1|max:1000',
            'bandwidth_upload' => 'required|integer|min:1|max:1000',
            'status' => 'required|in:active,suspended,terminated',
            'service_start_date' => 'required|date',
            'notes' => 'nullable|string',
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
            'name.required' => 'Customer name is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered.',
            'address.required' => 'Customer address is required.',
            'pppoe_username.required' => 'PPPoE username is required.',
            'pppoe_username.unique' => 'This PPPoE username is already taken.',
            'pppoe_password.required' => 'PPPoE password is required.',
            'pppoe_password.min' => 'PPPoE password must be at least 6 characters.',
            'service_plan.required' => 'Service plan is required.',
            'monthly_fee.required' => 'Monthly fee is required.',
            'monthly_fee.numeric' => 'Monthly fee must be a valid number.',
            'bandwidth_download.required' => 'Download bandwidth is required.',
            'bandwidth_upload.required' => 'Upload bandwidth is required.',
            'service_start_date.required' => 'Service start date is required.',
        ];
    }
}