import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { CircularProgress } from '@mui/material';

import './index.scss';


const UploadImage = (props) => {
  const { onChange, images, icon = false, isLoading, onDelete, onImageRemove } = props;

  const maxNumber = 69;

  return (
    <div>
      <ImageUploading
        multiple={true}
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={['jpg', 'png']}
      >
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
          <div
            className="upload__image-wrapper"
            style={{
              flexDirection: 'row',
              display: 'flex',
            }}
          >
            {/* <button onClick={onImageRemoveAll}>Remove all images</button> */}
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <Button className="close" onClick={() => onImageRemove(index)}>
                  <CancelIcon />
                </Button>

                <img src={image.url || image} alt="" width="100" />
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress className="loading-upload" />
              </div>
            )}
            <div className={imageList.length ? 'view-upload-length' : 'view-upload'}>
              <div
                className="upload-image"
                style={isDragging ? { color: 'red' } : {}}
                onClick={onImageUpload}
                {...dragProps}
              >
                <AddPhotoAlternateOutlinedIcon />
              </div>
              {!imageList?.length && <span className="txt-limit">** kích thước tối đa: 1MB</span>}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

export default UploadImage;
