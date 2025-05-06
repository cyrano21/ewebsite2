import classNames from 'classnames';
import React, { PropsWithChildren, ReactElement } from 'react';
import { Badge as BsBadge, BadgeProps as BsBadgeProps } from 'react-bootstrap';

// Types exportés pour être utilisés ailleurs
export const BadgeVariant = ['phoenix', 'default', 'tag'];

// Définition pour compatibilité TypeScript
export const BadgeBgValues = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
export type BadgeBg = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

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
