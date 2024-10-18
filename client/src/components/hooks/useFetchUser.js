import { useState, useEffect } from 'react';

const useFetchUser = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Запрос к вашему бэкенду для получения данных пользователя
    fetch("https://p2w.pro/api/auth/login")
      .then(response => response.json())
      .then(data => {
        // Сохраните данные пользователя в контекст 
        setIsFetching(false);
      })
      .catch(error => {
        setError(error);
        setIsFetching(false); 
      });
  }, []);

  return { isFetching, error };
};

export default useFetchUser;