import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children, hideNav = false }) { //idk
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
    </div>
  );
}
