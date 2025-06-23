import { useState } from "react";

export function useForm() {
    const [showForm, setShowForm] = useState(false);

    const handleToggleForm = () => {
        setShowForm(!showForm);
    }

    return {
        showForm,
        handleToggleForm
    }
}