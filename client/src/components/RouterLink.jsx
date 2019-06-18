import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);
