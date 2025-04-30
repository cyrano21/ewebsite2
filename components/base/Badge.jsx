import classNames from 'classnames';
import { React } from 'react';
import { Badge as BsBadge } from 'react-bootstrap';

// Types exportés pour être utilisés ailleurs
export const BadgeVariant = ['phoenix', 'default', 'tag'];
export const BadgeBg = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];

const Badge = ({
  children,
  bg,
  icon,
  className,
  variant = 'default',
  iconPosition = 'start',
  iconFamily = 'feather',
  ...rest
}) => {
  return (
    <BsBadge
      className={classNames(className, {
        [`badge-phoenix badge-phoenix-${bg}`]: variant === 'phoenix',
        'badge-tag': variant === 'tag'
      })}
      bg={['phoenix', 'tag'].includes(variant) ? '' : bg}
      {...rest}
    >
      {variant === 'phoenix' ? (
        <>
          {icon ? (
            <>
              {icon && iconPosition === 'start' && icon}
              <span
                className={classNames({
                  'badge-label': iconFamily === 'feather'
                })}
              >
                {children}
              </span>
              {icon && iconPosition === 'end' && icon}
            </>
          ) : (
            children
          )}
        </>
      ) : (
        children
      )}
    </BsBadge>
  );
};

export default Badge;
