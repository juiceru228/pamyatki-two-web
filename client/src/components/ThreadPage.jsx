import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from './axios';
import '../css/ThreadPage.css';
import { useMediaQuery } from 'react-responsive';
import { Box, useColorModeValue } from '@chakra-ui/react';
import DragAndDropField from './DragAndDropField'
import { Helmet } from 'react-helmet';
const ThreadPage = () => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [replies, setReplies] = useState({});
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const [showPopup, setShowPopup] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [setUser] = useState(null);
    const bg = useColorModeValue('#f0f0f0', '#2d2d2d');
    const textColor = useColorModeValue('black', 'white');
    const [clipboardFile, setClipboardFile] = useState(null);
    const fileInputRef = useRef(null);
    const [isFileDropped, setIsFileDropped] = useState(false);
    const [highlighted, setHighlighted] = useState(false);
    const textareaRef = useRef(null);
    const textareaRefPop = useRef(null);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(() => Cookies.get('autoRefresh') === 'true');
    const [intervalId, setIntervalId] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const location = useLocation();

    useEffect(() => {
        Cookies.set('autoRefresh', autoRefresh);
    }, [autoRefresh]);
    useEffect(() => {
        const handleScroll = () => {
            // Сохраняем положение прокрутки в cookies
            Cookies.set('scrollPosition', window.scrollY, { expires: 1 });
        };
    
        // Добавляем обработчик события прокрутки к окну
        window.addEventListener('scroll', handleScroll);
    
        // Удаляем обработчик события прокрутки при размонтировании компонента
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    

    useEffect(() => {
        const scrollPosition = Cookies.get('scrollPosition');
        if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition));
        }
    }, []);
    
    
    const handleButtonClick = (index) => {
        index.current.focus();
    };

    /*const saveVolume = (volume) => {
        localStorage.setItem('volume', volume);
       };*/
    const getVolume = () => {
    return localStorage.getItem('volume');
    };
    useEffect(() => {
        const volume = getVolume();
        if (volume) {
           video.volume = volume;
        }
       }, []);

    /*const handleVolumeChange = (volume) => {
    saveVolume(volume);
    video.volume = volume;
    };*/
    const reset = () => {
        setIsFileDropped(false);
        setFileName('');
        setHighlighted(false);
        setFile(null); // assuming setFile is passed as a prop from the parent component
    };

    const handlePaste = async (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (const item of items) {
            if (item.kind === 'file' && item.type.includes('image')) {
                const file = item.getAsFile();
                setClipboardFile(file);
                setFileName(file.name);
                setIsFileDropped(true);
                handleFileDrop([file]);
            }
        }
    };
    const preventDefault = (e) => {
        e.preventDefault();
    };
    
    document.addEventListener('dragover', preventDefault);
    document.addEventListener('dragenter', preventDefault);
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        setHighlighted(false);
        const file = e.dataTransfer.files[0];
        setFileName(file.name);
        setIsFileDropped(true);
        handleFileDrop([file]);
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
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
    const closePopup = () => {
        setShowPopup(false);
    };

    const toDOwn = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }

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
    function spacingCursor(position, index){
        setTimeout(() =>  {
            index.current.selectionStart = position;
            index.current.selectionEnd = position;      
          }, 0);
    }
    

    function addMessageIdToTextArea(id) {
        setShowPopup(true);
        setContent((prevContent) => prevContent + ">>" + id + ' ' + '\r' +'\n');
    }
    
    function addCitationToTextArea(index) {
        setContent((prevContent) => prevContent + ">");
        handleButtonClick(index); 

    }

    function addSpoilerToTextArea(index) {
        const spoilerText = "[spoiler][/spoiler]";
        const position = content.length + 9;
        setContent((prevContent) => prevContent + spoilerText);
        handleButtonClick(index); 
        spacingCursor(position, index);
        
    }
    
    function addBoldToTextArea(index) {
        const boldText = "[b][/b]";
        const position = content.length + 3;
        setContent((prevContent) => prevContent + boldText);
        handleButtonClick(index); 
        spacingCursor(position, index);
      }

    function addOrangeToTextArea(index){
        setContent((prevContent) => prevContent + "#");
        handleButtonClick(index); 
      }
    function addBlueToTextArea(index){
        setContent((prevContent) => prevContent + "//");
        handleButtonClick(index); 
    }

    const parseMessageContent = (content) => {
  const parts = content.split(
    /(>+[^>*\n]+\r|>>\d|#+[^#*\n]+\r|\/\/+[^//*\n]+\r|\[b\].*?\[\/b\]|\[spoiler\].*?\[\/spoiler\])/g
  );

  return parts.map((part, index) => {
    if (part.startsWith('>>')) {
      const replyId = part.split(
        /(>>\s+\d)/
      );
      return (
        <a key={index} href={`#message-${replyId}`} className="message-link">
          {replyId} 
        </a>
      );
    }

    const styles = {
      '>': { color: 'green' },
      '#': { color: 'orange' },
      '//': { color: 'blue' },
    };

    const Spoiler = ({ text }) => {
        return (
            <span>
                <span className="spoiler">{text}</span>
            </span>
        );
    };

    const styleKey = Object.keys(styles).find((key) => part.startsWith(key));

    if (styleKey) {
      return <span key={index} style={styles[styleKey]}>{part}</span>;
    }


    if (part.startsWith('[b]')) { 
        const innerParts = part.slice(3, -4).split(/(>+[^>*]+\n\r?)/);
        return (
          <span key={index} style={{ fontWeight: 'bold' }}>
            {innerParts.map((innerPart, innerIndex) => {
              if (innerPart.startsWith('>')) {
                return <span key={innerIndex} style={{ color: 'green' }}>{innerPart}</span>;
              }
              return <span key={innerIndex}>{innerPart.replace(/\[\/?b\]/g, '')}</span>; 
            })}
          </span>
        );
      }
      if (part.startsWith('[spoiler]')) {
        const spoilerText = part.slice(9, -10);
        return <Spoiler key={index} text={spoilerText} />;
      }
      return part;
    });
  };

    const scrollToMessage = (messageId) => {
        const element = document.getElementById(`message-${messageId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        checkLoggedIn();
        const handleHashChange = () => {
            const { hash } = window.location;
            if (hash.startsWith('#message-')) {
                const messageId = hash.replace('#message-', '');
                scrollToMessage(messageId);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMessages = useCallback(async () => {
        try {
            const response = await axios.get(`/forum/threads/${id}/messages`);
            const loadedMessages = response.data;

            const newReplies = {};
            loadedMessages.forEach((message) => {
                const contentParts = message.content.split(/(>>\d)/);
                contentParts.forEach((part) => {
                    if (part.startsWith('>>')) {
                        const replyId = part.slice(2);
                        if (!newReplies[replyId]) newReplies[replyId] = new Set();
                        newReplies[replyId].add(message.id);
                    }
                });
            });

            setMessages(loadedMessages);
            setReplies(newReplies);
            setTimeout(() => {
                loadedMessages.forEach((message) => {
                    if (message.video_url) {
                        var video = document.getElementById(`video-${message.id}`);
                        if (video) {
                            var savedVolume = localStorage.getItem(`volume-${message.id}`);
                            if (savedVolume) {
                                video.volume = savedVolume;
                            }
                            video.onvolumechange = function() {
                                localStorage.setItem(`volume-${message.id}`, video.volume);
                                updateAllVideosVolume(video.volume);
                            };
                        }
                    }
                });
            }, 100);
        } catch (error) {
            //console.error('Failed to load messages', error);
        }
    }, []);

    useEffect(() => {
        if (location.pathname.startsWith('/threads/') && autoRefresh && !intervalId) {
            const id = setInterval(loadMessages, 15000); // Update every 15 seconds
            setIntervalId(id);
        } else if (!autoRefresh && intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [autoRefresh, intervalId, loadMessages, location]);
    
    useEffect(() => {
        if (location.pathname.startsWith('/threads/') && autoRefresh && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
        if (timeLeft === 0) {
            loadMessages();
            setTimeLeft(15);
        }
    }, [autoRefresh, timeLeft, location]);

    const updateAllVideosVolume = (volume) => {
        messages.forEach((message) => {
            if (message.video_url) {
                var video = document.getElementById(`video-${message.id}`);
                if (video.volume !== volume) {
                    video.volume = volume;
                }
            }
        });
    }
    const handleFileDrop = (files) => {
        const file = files[0];
      
        if (file.type.includes('image')) {
            setImage(file);
        } else if (file.type.includes('video')) {
            setVideo(file);
        } else {
            alert('Only image and video files are allowed.');
        }
        setFile(file);
        setFileName(file.name);
    };
    const createMessage = async (e) => {
        if (!loggedIn) {
            alert("You are not authorized!");
        }
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', content);
        if (clipboardFile) {
            formData.append('image', clipboardFile);
            setClipboardFile(null); 
        } else {
            if (image) formData.append('image', image);
            if (video) formData.append('video', video);
        }
    
        try {
            await axios.post(`/forum/threads/${id}/messages`, formData);
            loadMessages();
            setContent('');
            setImage(null);
            setVideo(null);
            setFile(null);
            setFileName(null);
            setIsFileDropped(false);
            setHighlighted(false);
            setShowPopup(false);
        } catch (error) {
            //console.error('Failed to create message', error);
        }
    };

    

    return (
        <div className="thread-page">
            <Helmet>
                <link rel="canonical" href='https://p2w.pro/threads/${id}/' />
            </Helmet>
            {showPopup && (
            <div className="popup" >
                <textarea
                    ref={textareaRefPop}
                    onPaste={handlePaste}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="message-input-popup"
                    placeholder="Message Content"
                />
                <span className='message-fust-link' title="Add Citation" onClick={() => {addCitationToTextArea(textareaRef);}}>&gt;</span>
                <span className='message-fust-link' title="Add Spoiler" onClick={() => {addSpoilerToTextArea(textareaRef);}}>S</span>
                <span className='message-fust-link' title="Make Text Bold" onClick={() => {addBoldToTextArea(textareaRef);}}>B</span>
                <span className='message-fust-link' title="Make Text Bold" onClick={() => {addOrangeToTextArea(textareaRef);}}>#</span>
                <span className='message-fust-link' title="Make Text Bold" onClick={() => {addBlueToTextArea(textareaRef);}}>//</span>
                <button onClick={closePopup} className="close-button">X</button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file.type.includes('image') || file.type.includes('video')) {
                            if (file.type.includes('image')) {
                                setImage(file);
                            } else if (file.type.includes('video')) {
                                setVideo(file);
                            }
                        } else {
                            alert('Only image and video files are allowed.');
                        }
                    }}
                    className="file-input"
                />
                <form  onSubmit={createMessage} onFileDrop={handleFileDrop} onDragOver={handleDragOver} onClick={handleFileClick} onDrop={handleDrop} setFile={setFile}>
                    <DragAndDropField reset={reset}/>
                </form>
                    <button type="submit" onClick={createMessage}   className="submit-button">Submit Message</button>
            </div>
            )}  
            {!isMobile && (
                <button
                    className="App-scroll-top-button up"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                ></button>
            )}
            <h2 className="page-title">Messages in Thread</h2>
            <ul className="message-list">
                {messages.map((message) => (
                    <Box key={message.id} mb={5} p={3} bg={bg} borderRadius="md" color={textColor}>             
                        <li id={`message-${message.id}`}>
                            <div className="message-details">
                                <p className="message-author">
                                     {message.author} №<span className='message-reply-link' onClick={() => addMessageIdToTextArea(message.id)}>{message.id}</span>  {formatDate(message.created_at)}
                                </p>
                                <p className="message-number">Message Number: {message.message_number}</p>
                            </div>
                            <div className="message-text">
                            <img src={message.avatar_url} alt={`${message.author}'s avatar`} className="message-avatar" />
                            <p className="message-content">{parseMessageContent(message.content, message.id)}</p>
                            </div>
                            {message.image_url && <img src={message.image_url} alt="" className="message-media" />}
                            {message.video_url && <video controls src={message.video_url} className="message-media"  id={`video-${message.id}`}/>}
                            {replies[message.id] && replies[message.id].size > 0 && (
                                <div className="message-replies">
                                    <ul className="replies-list">
                                        {Array.from(replies[message.id]).map((replyId) => (
                                            <li key={replyId} className="reply-item">
                                                <a href={`#message-${replyId}`} className="message-reply-link">
                                                    {'>>'}{replyId}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    </Box>
                ))}
            </ul>
            <div className="create-message">
    <h3 className="form-title">Create a Message</h3>
        <form onSubmit={createMessage}>
            <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Message Content"
                className="message-input"
                onPaste={handlePaste}
            />
            <span className='message-fust-link' title="Add Citation" onClick={() => {addCitationToTextArea(textareaRef);}}>&gt;</span>
            <span className='message-fust-link' title="Add Spoiler" onClick={() => {addSpoilerToTextArea(textareaRef);}}>S</span>
            <span className='message-fust-link' title="Make Text Bold" onClick={() => {addBoldToTextArea(textareaRef);}}>B</span>
            <span className='message-fust-link' title="Make Text Bold" onClick={() => {addOrangeToTextArea(textareaRef);}}>#</span>
            <span className='message-fust-link' title="Make Text Bold" onClick={() => {addBlueToTextArea(textareaRef);}}>//</span>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file.type.includes('image') || file.type.includes('video')) {
                        if (file.type.includes('image')) {
                            setImage(file);
                        } else if (file.type.includes('video')) {
                            setVideo(file);
                        }
                    } else {
                        alert('Only image and video files are allowed.');
                    }
                }}
                className="file-input"
            />
            <form onSubmit={createMessage} onClick={handleFileClick} onDrop={handleDrop} >
            <DragAndDropField setFile={setFile} setFileName={setFileName}/>
            </form>
            <button type="submit" className="submit-button">Submit Message</button>
        </form>
        </div>
            {!isMobile && (
                <button
                    className="App-scroll-down-button down"
                    onClick={toDOwn}
                ></button>
            )}
            <span className="message-reply-link" onClick={loadMessages}>Refresh</span>
            <span>  |  </span>
            <label className="checkbox-container">
            
                <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={() => setAutoRefresh(!autoRefresh)}
                />          
                <span className="checkmark"></span>
                Auto-refresh every {timeLeft} seconds
            </label>
        </div>
    );
};

export default ThreadPage;
