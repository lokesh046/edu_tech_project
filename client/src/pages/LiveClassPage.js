import React, { useState, useEffect } from 'react'; // <-- THE FIX IS HERE
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DyteUiProvider, DyteMeeting } from '@dytesdk/react-ui-kit';
import { useDyteClient } from '@dytesdk/react-web-core';
import './LiveClassPage.css';

const MeetingComponent = ({ authToken }) => {
  const [meeting, initMeeting] = useDyteClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      initMeeting({
        authToken: authToken,
        defaults: {
          audio: false,
          video: false,
        },
      }).then((mtg) => {
        if (!mtg) return;
        mtg.on('meetingRoomLeft', () => {
          navigate('/home');
        });
      });
    }
  }, [authToken, initMeeting, navigate]);

  if (!meeting) return <div className="loading-container">Initializing meeting...</div>;

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <DyteMeeting meeting={meeting} showSetupScreen={true} />
    </div>
  );
};

function LiveClassPage() {
  const { meetingId } = useParams();
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const join = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          setError('You must be logged in to join a class.');
          setLoading(false);
          return;
        }
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/live-class/join`,
          { meetingId },
          config
        );
        if (data.auth) {
          setAuthToken(data.auth);
        } else {
          setError('Failed to get authentication token for the meeting.');
        }
      } catch (err) {
        console.error(err);
        setError('Could not join the meeting. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    join();
  }, [meetingId]);

  if (loading) return <div className="loading-container">Joining class...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <DyteUiProvider>
      {authToken && <MeetingComponent authToken={authToken} />}
    </DyteUiProvider>
  );
}

export default LiveClassPage;