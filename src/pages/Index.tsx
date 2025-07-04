
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/pagina-inicial');
  }, [navigate]);

  return <div>Redirecionando...</div>;
};

export default Index;
