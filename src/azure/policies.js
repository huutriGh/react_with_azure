/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_SignUpSignIn',
    forgotPassword: "B2C_1_ResetPassword",
    editProfile: 'B2C_1_EditProfile',
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://PhuHungGroup.b2clogin.com/PhuHungGroup.onmicrosoft.com/B2C_1_SignUpSignIn',
    },
    forgotPassword: {
      authority:
        'https://PhuHungGroup.b2clogin.com/PhuHungGroup.onmicrosoft.com/B2C_1_ResetPassword',
    },
    editProfile: {
      authority:
        'https://PhuHungGroup.b2clogin.com/PhuHungGroup.onmicrosoft.com/B2C_1_EditProfile',
    },
  },
  authorityDomain: 'PhuHungGroup.b2clogin.com',
};

export default b2cPolicies;
