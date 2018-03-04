// @flow

import * as React from 'react';
import { toClassName } from '../../utils';

type FileUploadFieldProps = {|
  className?: string,
  formats?: Array<string>,
  image: string,
  imageAlt?: string,
  onImageSelected: (?File) => any,
  onError: string => any,
|};

const ImageUploadField = ({
  className,
  formats,
  image,
  imageAlt,
  onImageSelected,
  onError,
}: FileUploadFieldProps) => {
  let fileInput = null;

  const onImageClicked = () => {
    if (fileInput)
      fileInput.click();
  };

  const onFileChanged = (e) => {
    const file = e.target.files[0];

    if (!file)
      return onImageSelected(null);

    const ext = /\.([^.]*)$/.exec(file.name);

    if (formats && (!ext || formats.indexOf(ext[1]) < 0))
      onError('Invalid image format');
    else if (!file)
      onError('No file selected');
    else
      onImageSelected(file);
  };

  return (
    <div className={toClassName(['image-upload', className])}>

      <input
        style={{display: 'none'}}
        type="file"
        ref={input => fileInput = input}
        onChange={onFileChanged}
      />

      <img src={image} alt={imageAlt || 'upload'} onClick={onImageClicked} />

    </div>
  );
};

export default ImageUploadField;
