const mapping: Record<string, string> = {
  attendances: 'attendance',
  employees: 'employee',
  organizations: 'organization',
  payrolls: 'payroll',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
