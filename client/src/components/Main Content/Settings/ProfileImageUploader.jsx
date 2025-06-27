import { DropZone, Thumbnail } from '@shopify/polaris';
import { useState, useCallback } from 'react';

export default function ProfileImageUploader({ setImageUrl, setFile }) {
  const [filePreview, setFilePreview] = useState(null);

  const handleDrop = useCallback((_dropFiles, acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    setFile(uploadedFile); // Pass image file to parent
    const previewUrl = URL.createObjectURL(uploadedFile);
    setFilePreview(previewUrl); // Local preview inside DropZone
    setImageUrl(previewUrl); // Show in Avatar above
  }, [setFile, setImageUrl]);

  return (
    <DropZone
      accept={['image/jpeg', 'image/png', 'image/svg+xml']}
      type="image"
      allowMultiple={false}
      onDrop={handleDrop}
    >
      <DropZone.FileUpload actionTitle="Upload profile image" />
      {filePreview && (
        <div style={{ marginTop: '1rem' }}>
          <Thumbnail source={filePreview} alt="Uploaded image preview" size="large" />
        </div>
      )}
    </DropZone>
  );
}
