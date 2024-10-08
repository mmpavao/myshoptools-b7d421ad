import crudOperations from './crudOperations';
import * as userOperations from './userOperations';
import productOperations from './productOperations';
import fileOperations from './fileOperations';
import meusProdutosOperations from './meusProdutosOperations';
import userProfileOperations from './userProfileOperations';
import dashboardOperations from './dashboardOperations';

const firebaseOperations = {
  ...crudOperations,
  ...userOperations,
  ...productOperations,
  ...fileOperations,
  ...meusProdutosOperations,
  ...userProfileOperations,
  ...dashboardOperations,
  updateUserAvatar: userProfileOperations.updateUserAvatar,
};

export default firebaseOperations;