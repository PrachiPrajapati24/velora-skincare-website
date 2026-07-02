import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import './AdminActivity.css';

const AdminActivity = () => {
  const { API } = useAdmin();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await API.get('/activity');
        if (res.data.success) {
          setFeed(res.data.feed);
        }
      } catch (err) {
        console.error('Error fetching activity log:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [API]);

  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-spinner"></div>
        <span>Loading activity feed...</span>
      </div>
    );
  }

  return (
    <div className="ad-activity-page">
      <h1 className="ad-section-title">Recent Activity Feed</h1>

      <div className="ad-card ad-activity-card">
        {feed.length > 0 ? (
          <div className="ad-timeline">
            {feed.map((act, index) => (
              <div className="ad-timeline-item" key={index}>
                <div className="ad-timeline-icon" style={{ backgroundColor: act.color + '15', color: act.color }}>
                  {act.icon}
                </div>
                <div className="ad-timeline-content">
                  <p className="ad-timeline-text">{act.text}</p>
                  <span className="ad-timeline-time">
                    {new Date(act.time).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ad-empty-activity">
            <p>No recent activity detected on the website.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivity;
