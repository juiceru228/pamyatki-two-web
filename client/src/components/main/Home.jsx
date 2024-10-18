import React, { useState, useEffect, useRef } from 'react';
import '../../css/Home.css'
import { Helmet } from 'react-helmet';
import { Button, Flex, Text, Image } from "@chakra-ui/react";
import { Link } from 'react-router-dom';

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const fileInput = useRef(null);

  useEffect(() => {
    fetch('https://p2w.pro/api/auth/me/')
      .then(response => response.json())
      .then(data => {
        //console.log(data); // Debug: Log the data
        if (data.loggedIn) {
          setLoggedIn(true);
          setUser(data.user);
        } else {
          setLoggedIn(false);
        }
      })
      .catch(error => {
        //console.error('Error fetching user data:', error);
      });
  }, []);

  const handleAvatarClick = () => {
    fileInput.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    let formData = new FormData();
    formData.append("avatar", file);

    fetch('https://p2w.pro/api/forum/upload-avatar', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      setUser(user => ({ ...user, avatarUrl: data.avatarUrl }));
    });
  };

  return (
    <div>
      <Helmet>
          <link rel="canonical" href="https://p2w.pro/home/" />
      </Helmet>
      <Flex
  direction="column"
  justifyContent="center"
  alignItems="center"
  textAlign="center"
  p={5}
>
  {loggedIn ? (
    <Flex direction="column" alignItems="center">
      <Text mb={3}>Welcome home, {user.username}</Text>
      <Image 
        src={user.avatarUrl || 'https://via.placeholder.com/150'} 
        alt="avatar"
        onClick={handleAvatarClick}
        w="150px"
        h="150px"
        objectFit="cover"
        objectPosition="center"
        borderRadius="5%"
        cursor="pointer"
      />
      <input 
        type="file" 
        onChange={handleFileChange}
        ref={fileInput}
        style={{ display: 'none' }} 
      />
      <Button as={Link} to='/change' colorScheme="teal" size="md" marginTop="10px">Change Pass</Button>
    </Flex>
  ) : (
    <Text mb={3}>Please, login to continue</Text>
  )}
</Flex>
      <footer className='App-footer'>
        <p>© 2024 PAMYATKI TWO WEB. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;