const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['CreateWSConnection']);
roleRights.set(roles[1], [
  'getUsers',
  'manageUsers',
  'getComplexes',
  'manageComplexes',
  'getModules',
  'manageModules',
  'CreateWSConnection',
]);

module.exports = {
  roles,
  roleRights,
};
