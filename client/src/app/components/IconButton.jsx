import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

IconButton.propTypes = {
    icon: PropTypes.string.isRequired,
    variant: PropTypes.oneOf([
        undefined,
        'primary', 'outline-primary',
        'secondary', 'outline-secondary',
        'success', 'outline-success',
        'danger', 'outline-danger',
        'warning', 'outline-warning',
        'info', 'outline-info',
        'light', 'outline-light',
        'dark', 'outline-dark',
        'link', 'outline-link'
    ]),
    label: PropTypes.string,
    className: PropTypes.string,
    href: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'lg', undefined])
};

function IconButton({ icon, variant, label, className, href, size, ...props }) {

    let btnSize = '';
    if (size === 'sm') {
        btnSize = 'btn-sm';
    } else if (size === 'lg') {
        btnSize = 'btn-lg';
    }

    const outProps = {
        className: `btn btn-${variant || 'outline-secondary'} ${btnSize} ${className || ''}`.trim(),
        ...props
    };

    if (href) {
        return (
            <a href={href}
                target="_blank"
                rel="noreferrer"
                {...outProps}>
                {label}
                <Icon icon={icon} />
            </a>
        );
    }
    return (
        <button {...outProps}>
            {label}
            <Icon icon={icon} />
        </button>
    );
}

export default IconButton;