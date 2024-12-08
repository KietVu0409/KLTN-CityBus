import { FormControl, FormLabel } from '@mui/material';
import './index.scss';



const FormControlCustom = (props) => {
  const { isMarked = false, label, isDisabled = false, className, classNameLabel, children, ...rest } = props;
  return (
    <FormControl className={className || 'form-control'} {...rest}>
      <FormLabel
        className={`${classNameLabel} ${isDisabled ? 'text-grey-2' : 'text-secondary'}  font-medium mb-10 label`}
      >
        {label}
        {isMarked ? <label className="text-red"> * </label> : ''}
      </FormLabel>
      {children}
    </FormControl>
  );
};

export default FormControlCustom;
