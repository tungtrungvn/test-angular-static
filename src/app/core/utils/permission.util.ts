const group = (permissions: any[]): any => {
  const groupPermissions = permissions.reduce((group: any, item: any) => {
    const splitPermission = item.split('-');
    const action = splitPermission[0];
    const subject = splitPermission[1];
    group[subject] = [...group[subject] || [], action];
    return group;
  }, {})
  return groupPermissions
};

export const PermissionUltil = {
  group
};
