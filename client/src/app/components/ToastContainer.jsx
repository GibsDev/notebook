import { ToastContainer, cssTransition } from 'react-toastify';

const fade = cssTransition({
    collapse: false,
    enter: 'animate__fadein',
    exit: 'animate__fadeout'
});

export default function CustomToastContainer() {
    return (
        <ToastContainer
            transition={fade}
            closeOnClick
            position="bottom-center"
            autoClose={3000}
            pauseOnHover />
    );
}