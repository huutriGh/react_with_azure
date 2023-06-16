import {
  InteractionRequiredAuthError,
  InteractionStatus,
  InteractionType,
} from '@azure/msal-browser';
// Msal imports
import {
  MsalAuthenticationTemplate,
  useAccount,
  useMsal,
} from '@azure/msal-react';
import { loginRequest } from 'azure/authConfig';
import { useEffect, useState } from 'react';

export const ErrorComponent = ({ error }) => {
  return <div>An Error Occurred: {error.errorCode}</div>;
};
export const Loading = () => {
  return <div>Loading</div>;
};
const ProtectedContent = (props) => {
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [atsResponse, setAtsResponse] = useState(null);
  const { component: Component } = props;

  useEffect(() => {
    if (!atsResponse && account && inProgress === InteractionStatus.None) {
      const request = {
        ...loginRequest,
        account: account,
      };
      instance
        .acquireTokenSilent(request)
        .then((response) => {
          console.log(response);
          setAtsResponse(response);
        })
        .catch((e) => {
          if (e instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect(request);
          }
        });
    }
  }, [account, inProgress, instance, atsResponse]);

  return atsResponse ? <Component /> : null;
};

export default function Protected({ component }) {
  const authRequest = {
    ...loginRequest,
  };

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Popup}
      authenticationRequest={authRequest}
      errorComponent={ErrorComponent}
      loadingComponent={Loading}
    >
      <ProtectedContent component={component} />
    </MsalAuthenticationTemplate>
  );
}
