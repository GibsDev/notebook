/**
 * A mobile friendly bootstrap toggle button that keeps track of it's own state
 */

import { useState } from 'react';

const CHECKED_STYLE = {
    backgroundColor: 'var(--bs-secondary)',
    color: 'var(--bs-light)',
    border: '1px solid var(--bs-secondary)'
};

const UNCHECKED_STYLE = {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'var(--bs-secondary)',
    border: '1px solid var(--bs-secondary)'
};

export default function CheckBoxButton(checked, id, child, description) {
    if (typeof child === 'string') {
        child = <span>{child}</span>;
    }
    const [enabled, setEnabled] = useState(checked);

    function onChange(e) {
        setEnabled(e.target.checked);
        e.target.blur();
    }

    const elem = (
        <div title={description}>
            <input type="checkbox"
                className="btn-check"
                id={id}
                checked={enabled}
                autoComplete="off"
                onChange={onChange} />
            <label className="btn"
                style={enabled ? CHECKED_STYLE : UNCHECKED_STYLE}
                htmlFor={id}>{child}</label>
        </div>
    );
    return [enabled, elem];
}