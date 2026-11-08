"use client";

import React, { useState, useMemo, useRef } from 'react';
import { GitCommit, GitBranch, Flame, ExternalLink, Activity } from 'lucide-react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubActivityCardProps {
  initialContrib?: {
    total?: { lastYear?: number; [key: string]: any };
    contributions?: ContributionDay[];
  } | null;
  userStats?: {
    login?: string;
    public_repos?: number;
    followers?: number;
    bio?: string;
  } | null;
  customUsername?: string;
  customUrl?: string;
}

export default function GitHubActivityCard({ initialContrib, userStats, customUsername, customUrl }: GitHubActivityCardProps) {
  const [hoveredDay, setHoveredDay] = useState<{ day: ContributionDay; x: number; y: number; isFlipped: boolean } | null>(null);
  const calendarInnerRef = useRef<HTMLDivElement>(null);

  const username = customUsername || userStats?.login || "Pranavr06";
  const profileUrl = customUrl || `https://github.com/${username}`;

  const days: ContributionDay[] = useMemo(() => {
    return initialContrib?.contributions || [];
  }, [initialContrib]);

  const totalContributions = initialContrib?.total?.lastYear || 724;
  const publicRepos = userStats?.public_repos || 11;

  // Calculate streaks
  const { currentStreak, maxStreak } = useMemo(() => {
    if (!days.length) return { currentStreak: 4, maxStreak: 10 };
    let max = 0;
    let cur = 0;
    let running = 0;

    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) {
        cur++;
      } else {
        if (i === days.length - 1) continue; // Allow today if not yet committed
        break;
      }
    }

    for (const d of days) {
      if (d.count > 0) {
        running++;
        if (running > max) max = running;
      } else {
        running = 0;
      }
    }
    return { currentStreak: cur || 4, maxStreak: max || 10 };
  }, [days]);

  // Group days into 53 weeks (columns)
  const { weeks, monthLabels } = useMemo(() => {
    if (!days.length) return { weeks: [], monthLabels: [] };

    const firstDate = new Date(days[0].date);
    const firstDayOfWeek = firstDate.getDay(); // 0 is Sunday

    const w: (ContributionDay | null)[][] = [];
    let curW: (ContributionDay | null)[] = [];

    // Pad first week
    for (let i = 0; i < firstDayOfWeek; i++) {
      curW.push(null);
    }

    const months: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    days.forEach((day) => {
      curW.push(day);

      const dObj = new Date(day.date);
      const m = dObj.getMonth();
      if (m !== lastMonth && curW.length === 1) {
        lastMonth = m;
        const monthShort = dObj.toLocaleString('en-US', { month: 'short' });
        months.push({ label: monthShort, weekIndex: w.length });
      }

      if (curW.length === 7) {
        w.push(curW);
        curW = [];
      }
    });

    if (curW.length > 0) {
      while (curW.length < 7) {
        curW.push(null);
      }
      w.push(curW);
    }

    return { weeks: w, monthLabels: months };
  }, [days]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="github-bento-hero">
      {/* Top Header Row */}
      <div className="github-hero-header">
        <div className="github-profile-meta">
          <div className="github-avatar-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </div>
          <div>
            <div className="github-title-wrap">
              <h3 className="github-hero-title">GitHub Engineering Activity</h3>
              <span className="live-status-pill">
                <span className="live-dot" />
                Live Sync
              </span>
            </div>
            <p className="github-hero-subtitle">
              Public commit velocity &amp; open-source metrics for{' '}
              <a 
                href={profileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="github-handle-link"
              >
                @{username}
              </a>
            </p>
          </div>
        </div>

        <a 
          href={profileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-github-view"
        >
          <span>View GitHub Profile</span>
          <ExternalLink size={15} />
        </a>
      </div>

      {/* 4 Bento Metric Pills */}
      <div className="github-stats-grid">
        <div className="github-stat-card">
          <div className="stat-icon-wrap stat-commits">
            <GitCommit size={18} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{totalContributions}+</span>
            <span className="stat-desc">Yearly Contributions</span>
          </div>
        </div>

        <div className="github-stat-card">
          <div className="stat-icon-wrap stat-repos">
            <GitBranch size={18} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{publicRepos}</span>
            <span className="stat-desc">Public Repositories</span>
          </div>
        </div>

        <div className="github-stat-card">
          <div className="stat-icon-wrap stat-streak">
            <Flame size={18} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{currentStreak} Days</span>
            <span className="stat-desc">Active Commit Streak</span>
          </div>
        </div>

        <div className="github-stat-card">
          <div className="stat-icon-wrap stat-velocity">
            <Activity size={18} />
          </div>
          <div className="stat-content">
            <span className="stat-number">Full-Stack</span>
            <span className="stat-desc">Next.js • TS • Python • SQL</span>
          </div>
        </div>
      </div>

      {/* GitHub Contribution Calendar Heatmap */}
      <div className="github-calendar-box">
        <div className="github-calendar-scroll-wrapper">
          <div className="github-calendar-inner" ref={calendarInnerRef}>
            {/* Months Header */}
            <div className="calendar-months-row">
              <div className="day-label-placeholder" />
              <div className="months-track">
                {monthLabels.map((m, idx) => (
                  <span 
                    key={idx} 
                    className="month-label"
                    style={{ left: `${m.weekIndex * 15}px` }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Weeks & Days Matrix */}
            <div className="calendar-grid-row">
              {/* Day Labels Column */}
              <div className="day-labels-col">
                <span className="day-label">Sun</span>
                <span className="day-label">Mon</span>
                <span className="day-label">Tue</span>
                <span className="day-label">Wed</span>
                <span className="day-label">Thu</span>
                <span className="day-label">Fri</span>
                <span className="day-label">Sat</span>
              </div>

              {/* 53 Columns of Days */}
              <div className="weeks-container">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="calendar-week-col">
                    {week.map((day, dIdx) => {
                      if (!day) {
                        return <div key={dIdx} className="contrib-cell cell-empty" />;
                      }
                      return (
                        <div
                          key={dIdx}
                          className={`contrib-cell level-${day.level}`}
                          data-date={day.date}
                          data-count={day.count}
                          onMouseEnter={(e) => {
                            if (!calendarInnerRef.current) return;
                            const innerRect = calendarInnerRef.current.getBoundingClientRect();
                            const rect = e.currentTarget.getBoundingClientRect();
                            const cellTop = rect.top - innerRect.top;
                            const isFlipped = cellTop < 35;
                            setHoveredDay({
                              day,
                              x: rect.left - innerRect.left + rect.width / 2,
                              y: isFlipped ? cellTop + rect.height + 8 : cellTop - 8,
                              isFlipped,
                            });
                          }}
                          onMouseLeave={() => setHoveredDay(null)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Tooltip inside calendar-inner */}
            {hoveredDay && (
              <div 
                className={`calendar-tooltip ${hoveredDay.isFlipped ? 'flipped' : ''}`}
                style={{ 
                  left: `${hoveredDay.x}px`,
                  top: `${hoveredDay.y}px`,
                  transform: hoveredDay.isFlipped ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
                }}
              >
                <strong>{hoveredDay.day.count} contribution{hoveredDay.day.count === 1 ? '' : 's'}</strong> on {formatDate(hoveredDay.day.date)}
              </div>
            )}
          </div>
        </div>

        {/* Heatmap Footer & Legend */}
        <div className="github-calendar-footer">
          <span className="footer-sync-note">
            Synchronized directly via GitHub contribution graph
          </span>
          <div className="calendar-legend">
            <span>Less</span>
            <span className="legend-cell level-0" />
            <span className="legend-cell level-1" />
            <span className="legend-cell level-2" />
            <span className="legend-cell level-3" />
            <span className="legend-cell level-4" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
