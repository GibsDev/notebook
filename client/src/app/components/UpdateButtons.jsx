import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';

UpdateButtons.propTypes = {
    onApply: PropTypes.func,
    onCancel: PropTypes.func
};

function UpdateButtons({ onApply, onCancel }) {

    return <>
        <button className="btn btn-outline-success" onClick={onApply} title="Apply"><Icon icon="bi:check"/></button>
        <button className="btn btn-outline-warning" onClick={onCancel}><Icon icon="ci:undo" /></button>
    </>;
}

export default UpdateButtons;