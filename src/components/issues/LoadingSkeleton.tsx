import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div
      className="table-wrapper"
      role="status"
      aria-label="Loading issues data..."
    >
      <div className="sr-only">Loading issue list, please wait...</div>
      <table className="issue-table" style={{ opacity: 0.8 }}>
        <thead>
          <tr>
            <th style={{ width: '44px', textAlign: 'center' }}>
              <div className="skeleton-box" style={{ width: 18, height: 18 }} />
            </th>
            <th style={{ width: '100px' }}>ID</th>
            <th>Title & Summary</th>
            <th style={{ width: '130px' }}>Status</th>
            <th style={{ width: '110px' }}>Priority</th>
            <th style={{ width: '160px' }}>Assignee</th>
            <th style={{ maxWidth: '180px' }}>Labels</th>
            <th style={{ width: '110px' }}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, idx) => (
            <tr key={idx} className="skeleton-row">
              <td style={{ textAlign: 'center' }}>
                <div className="skeleton-box" style={{ width: 18, height: 18 }} />
              </td>
              <td>
                <div className="skeleton-box" style={{ width: 65, height: 16 }} />
              </td>
              <td>
                <div
                  className="skeleton-box"
                  style={{
                    width: `${60 + (idx % 4) * 10}%`,
                    height: 18,
                    marginBottom: 6,
                    display: 'block',
                  }}
                />
                <div
                  className="skeleton-box"
                  style={{ width: `${80 + (idx % 3) * 6}%`, height: 12 }}
                />
              </td>
              <td>
                <div
                  className="skeleton-box"
                  style={{ width: 85, height: 24, borderRadius: 9999 }}
                />
              </td>
              <td>
                <div
                  className="skeleton-box"
                  style={{ width: 75, height: 24, borderRadius: 9999 }}
                />
              </td>
              <td>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <div
                    className="skeleton-box"
                    style={{ width: 24, height: 24, borderRadius: 9999 }}
                  />
                  <div
                    className="skeleton-box"
                    style={{ width: 90, height: 14 }}
                  />
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <div
                    className="skeleton-box"
                    style={{ width: 50, height: 20, borderRadius: 4 }}
                  />
                  <div
                    className="skeleton-box"
                    style={{ width: 45, height: 20, borderRadius: 4 }}
                  />
                </div>
              </td>
              <td>
                <div className="skeleton-box" style={{ width: 60, height: 14 }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
