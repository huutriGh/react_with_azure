import { ReactComponent as PhlLogo } from 'assets/img/logo-phl-homepage-update.svg';
import { Link } from 'react-router-dom';
const Logo = () => {
  return (
    <Link to='/'>
      <PhlLogo style={{ height: '50', weight: '200', marginTop: '5' }} />
    </Link>
  );
};

export default Logo;
