
import { DropZone, Thumbnail, Text } from '@shopify/polaris';
import { useState } from 'react';

export default function ProfileImageUploader({ setImageUrl }) {
  const [file, setFile] = useState();

  const handleDrop = async (_dropFiles, acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);

    // upload logic here or mock:
    const url = URL.createObjectURL(uploadedFile); // for preview
    setImageUrl(url);

    // API call here to upload
    // await uploadImageToServer(uploadedFile)
  };

  const validImageTypes = ['image/jpeg', 'image/png'];

  return (
    <DropZone accept={validImageTypes} type="image" onDrop={handleDrop}>
      {file ? (
        <DropZone.FileUpload actionHint="Uploaded image shown above" />
      ) : (
        <DropZone.FileUpload actionTitle="Upload profile image" />
      )}
    </DropZone>
  );
}
