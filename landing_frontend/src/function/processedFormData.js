async function handleProcessedFormData(values, imageArray) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
        if (imageArray.includes(key) && value instanceof Blob) {
            formData.append(key, value);
        } else if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
        } else if (value !== null) {
            formData.append(key, String(value));
        }
    });

    return formData;
}

export default handleProcessedFormData