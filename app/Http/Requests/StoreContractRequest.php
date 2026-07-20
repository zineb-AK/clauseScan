<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contract' => ['required_without:content', 'file', 'mimes:pdf', 'max:10240', 'prohibits:content'],
            'content' => ['required_without:contract', 'string', 'min:1', 'max:100000', 'prohibits:contract'],
        ];
    }

    public function messages(): array
    {
        return [
            'contract.required_without' => 'Le fichier du contrat est requis.',
            'contract.file' => 'Le contrat doit être un fichier.',
            'contract.mimes' => 'Le contrat doit être au format PDF.',
            'contract.max' => 'Le contrat ne doit pas dépasser 10 Mo.',
            'content.required_without' => 'Le contenu du contrat est requis.',
            'content.string' => 'Le contenu doit être une chaîne de caractères.',
            'content.min' => 'Le contenu ne doit pas être vide.',
            'content.max' => 'Le contenu ne doit pas dépasser 100 000 caractères.',
        ];
    }
}
