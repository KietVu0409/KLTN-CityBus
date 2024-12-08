import { Box, CircularProgress } from '@mui/material';

const LoadingCircle = () => {
  return (
    <>
      <Box
        color={'black'}
        className="grow"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={'100%'}
        width={'100%'}
        position="absolute"
      >
        <CircularProgress />
      </Box>
    </>
  );
};

export default LoadingCircle;