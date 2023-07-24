interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Owner'],
  customerRoles: [],
  tenantRoles: ['Owner', 'HR Manager', 'Employee', 'Payroll Manager', 'System Administrator'],
  tenantName: 'Organization',
  applicationName: 'Manna HRMS',
  addOns: ['chat', 'notifications', 'file'],
};
