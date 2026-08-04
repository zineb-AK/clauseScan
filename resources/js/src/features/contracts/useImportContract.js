import { useState } from 'react';
import api from '../../lib/api';

export function useImportContract() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [apiError, setApiError] = useState(null);

    const importContract = async ({ mode, contract, content }) => {
        setIsSubmitting(true);
        setProgress(0);

        const formData = new FormData();

        if (mode === 'pdf') {
            formData.append('contract', contract);
        } else {
            formData.append('content', content);
        }

        try {
            const { data } = await api.post('/contracts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (event) => {
                    if (event.total) {
                        setProgress(Math.round((event.loaded / event.total) * 100));
                    }
                },
            });

            return data;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { importContract, isSubmitting, progress, apiError, setApiError };
}
