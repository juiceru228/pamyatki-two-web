import '../../css/MainNew.css';
import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { Link } from 'react-router-dom';
import { Button, ChakraProvider, Textarea, theme, Box, useColorModeValue } from '@chakra-ui/react'; 
import { Helmet } from 'react-helmet';
const MainPage = () => {
  const [threads, setThreads] = useState([]);
  const [title, setTitle] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const bg = useColorModeValue('#f0f0f0', '#2d2d2d');
  const textColor = useColorModeValue('black', 'white');
  useEffect(() => {
    checkLoggedIn();
    loadThreads();
  }, []);
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}`;
};
  const checkLoggedIn = async () => {
    try {
      const response = await axios.get('/auth/me');
      //console.log('Logged in user:', response.data);
      if (response.data.loggedIn) {
        setLoggedIn(true);
        setUser(response.data.user);
      } else {
        setLoggedIn(false);
        setUser('');
      }
    } catch (error) {
      //console.error('Failed to check logged in status', error);
    }
  };


  const loadThreads = async () => {
    try {
      const response = await axios.get('/forum/threads');
      //console.log('Loaded threads:', response.data);
      setThreads(response.data);
    } catch (error) {
      //console.error('Failed to load threads', error);
    }
  };

  const createThread = async (e) => {
    if (!loggedIn) {
	alert("You are not authorized!");
    }
    e.preventDefault();
    //console.log('Creating thread with title:', title);
    try {
      const response = await axios.post('/forum/threads/new/', { title });
      //console.log('Server response:', response.data);
      if (response.status === 200) {
        //console.log('Created thread:', response.data);
        setTitle('');

        loadThreads();
      }else {
        //console.error('Failed to create thread');
      }
    } catch (error) {
      //console.error('Failed to create thread', error);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await axios.delete(`/forum/threads/${threadId}/delete`);
      //console.log('Server response:', response.data);
      if (response.status === 200) {
        //console.log('Deleted thread:', threadId);

        loadThreads();
      } else {
        console.error('Failed to delete thread');
      }
    } catch (error) {
      console.error('Failed to delete thread', error);
    }
  };

  return (
	<ChakraProvider theme={theme}>
  <div>
    <Helmet>
      <title>P2W</title>
      <link rel="canonical" href="https://p2w.pro/" />
    </Helmet>
    <header className="App-header">
      <h1>Welcome to forum P2W!</h1>
      <p>A community for everyone</p>
    </header>
    <nav>
  <ul className="App-horizontList">
    <li>
      <button
        className='App-button'
        onClick={(e) => {
          const alertBox = document.createElement('div');
          alertBox.className = 'alert-box';
          alertBox.innerHTML = `
            <h2>FAQ</h2>
            <ul>
              <li>
                <b>Q: What is our community?</b>
                <br>
                <span>A: We are a community for everyone, where every man can come together.</span>
              </li>
              <li>
                <b>Q: What is our forum about?</b>
                <br>
                <span>A: Our forum is a platform for people from all walks of life to discuss, share, and learn from each other.</span>
              </li>
              <!-- Add more FAQs here -->
            </ul>

            <button class="alert-ok" style="border: 1px solid #ddd; border-radius: 5px; padding: 5px 10px; float: right;">OK</button>
          `;
          const okButton = alertBox.querySelector('.alert-ok');
          okButton.addEventListener('click', () => {
            alertBox.remove();
          });
          const bodyBgColor = getComputedStyle(document.body).backgroundColor;
          alertBox.style.backgroundColor = bodyBgColor;
          document.body.appendChild(alertBox);
          // Add event listener to remove alert box when clicking outside
          document.addEventListener('click', (event) => {
            if (!alertBox.contains(event.target) && event.target !== e.target) {
              alertBox.remove();
            }
          });
        }}
      >
        FAQ
      </button>
    </li>
    <li>
      <button
        className='App-button'
        onClick={(e) => {
          const alertBox = document.createElement('div');
          alertBox.className = 'alert-box';
          alertBox.innerHTML = `
            <h2>Rules</h2>
            <p>Respect other users, no spamming, no harassment, etc.</p>

            <button class="alert-ok" style="border: 1px solid #ddd; border-radius: 5px; padding: 5px 10px; float: right;">OK</button>
          `;
          const okButton = alertBox.querySelector('.alert-ok');
          okButton.addEventListener('click', () => {
            alertBox.remove();
          });
          const bodyBgColor = getComputedStyle(document.body).backgroundColor;
          alertBox.style.backgroundColor = bodyBgColor;
          document.body.appendChild(alertBox);
          // Add event listener to remove alert box when clicking outside
          document.addEventListener('click', (event) => {
            if (!alertBox.contains(event.target) && event.target !== e.target) {
              alertBox.remove();
            }
          });
        }}
      >
        Rules
      </button>
    </li>
    <li>
      <button
        className='App-button'
        onClick={(e) => {
          const alertBox = document.createElement('div');
          alertBox.className = 'alert-box';
          alertBox.innerHTML = `
            <h2>About Us</h2>
	    <p>We are a community for everyone, where people from all walks of life can come together to discuss, share, and learn from each other</p>
            <p>Our forum is a place where you can engage in meaningful conversations, share your experiences, and learn from others. We believe in fostering a community that is respectful, inclusive, and supportive.</p>
        <p>If you have any questions or concerns, feel free to reach out to us. We're always here to help.</p>
            <button class="alert-ok" style="border: 1px solid #ddd; border-radius: 5px; padding: 5px 10px; float: right;">OK</button>
          `;
          const okButton = alertBox.querySelector('.alert-ok');
          okButton.addEventListener('click', () => {
            alertBox.remove();
          });
          const bodyBgColor = getComputedStyle(document.body).backgroundColor;
          alertBox.style.backgroundColor = bodyBgColor;
          document.body.appendChild(alertBox);
          // Add event listener to remove alert box when clicking outside
          document.addEventListener('click', (event) => {
            if (!alertBox.contains(event.target) && event.target !== e.target) {
              alertBox.remove();
            }
          });
        }}
      >
        About Us
      </button>
    </li>
  </ul>
</nav>

    <main>
      <div  className='App-create-thread-form'>
        <h2 className='App-create-thread-text'>Create a Thread</h2>
        <form onSubmit={createThread} >
          <Textarea
            className="App-create-thread-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Thread Title"
            required
          />
          <Button type="submit" colorScheme="teal" size="md" marginTop="10px">Create Thread</Button>
        </form>
      </div>
     <div >
  <h2 className='App-create-thread-text'>List of Threads</h2>
  
  
  <ul className="thread-page">
    {threads.map(thread => (
      <Box key={threads.id} mb={5} p={3} bg={bg} borderRadius="md" color={textColor}> 
      
      <li key={thread.id} >
      <div className="message-details"> <p className="message-author">{thread.username} {formatDate(thread.created_at)} </p> <p className="message-number">{`Thread Number: ${thread.id}`}  </p></div>
        <h3>
          <span>{thread.title}</span>
        </h3>
        <p>{thread.description}</p>
        <Link className="App-buttonToMessages" to={`/threads/${thread.id}`}>View Messages</Link>
        {loggedIn && (user.username === 'admin' || user.username === 'root') && (
          <button className="App-delete-button" onClick={() => deleteThread(thread.id)}>Delete</button>
        )}
      </li>
      </Box>
    ))}
  </ul>
  
</div>

    </main>
    </div>
</ChakraProvider>

  );
};

export default MainPage;
