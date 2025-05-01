export type PageBreadcrumbItem = {
  label: string;
  path: string;
  active?: boolean;
};

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const monthsShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const defaultBreadcrumbItems: PageBreadcrumbItem[] = [
  {
    label: 'Page 1',
    path: '#!'
  },
  {
    label: 'Page 2',
    path: '#!'
  },
  {
    label: 'Default',
    path: '#!',
    active: true
  }
];

export const ecomBreadcrumbItems: PageBreadcrumbItem[] = [
  {
    label: 'Fashion',
    path: '#!'
  },
  {
    label: 'Womens Fashion',
    path: '#!'
  },
  {
    label: 'Footwear',
    path: '#!'
  },
  {
    label: 'Hills',
    path: '#!',
    active: true
  }
];
