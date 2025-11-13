import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, Heart, AlertTriangle, DollarSign, Plus, Clock, Hospital } from 'lucide-react';
import { MemberAvatar } from '@/components/MemberAvatar';
import { EventTypeBadge } from '@/components/EventTypeBadge';
import { EngagementBadge } from '@/components/EngagementBadge';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [atRiskMembers, setAtRiskMembers] = useState([]);
  const [activeGrief, setActiveGrief] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, atRiskRes, griefRes, upcomingRes, recentRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`),
        axios.get(`${API}/members/at-risk`),
        axios.get(`${API}/dashboard/grief-active`),
        axios.get(`${API}/dashboard/upcoming?days=7`),
        axios.get(`${API}/dashboard/recent-activity?limit=10`)
      ]);
      
      setStats(statsRes.data);
      setAtRiskMembers(atRiskRes.data.slice(0, 5));
      setActiveGrief(griefRes.data.slice(0, 5));
      setUpcomingEvents(upcomingRes.data.slice(0, 8));
      setRecentActivity(recentRes.data);
    } catch (error) {
      toast.error(t('error_messages.failed_to_save'));
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-manrope font-bold text-foreground">{t('dashboard')}</h1>
          <p className="text-muted-foreground mt-1">{t('app_title')}</p>
        </div>
        <Link to="/members">
          <Button className="bg-primary-500 hover:bg-primary-600" data-testid="add-member-button">
            <Plus className="w-4 h-4 mr-2" />
            {t('add_member')}
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow" data-testid="stat-total-members">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('total_members')}</p>
                <p className="text-3xl font-manrope font-bold text-foreground">{stats?.total_members || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow" data-testid="stat-grief-support">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('active_grief_support')}</p>
                <p className="text-3xl font-manrope font-bold text-foreground">{stats?.active_grief_support || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow" data-testid="stat-at-risk">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('members_at_risk')}</p>
                <p className="text-3xl font-manrope font-bold text-foreground">{stats?.members_at_risk || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow" data-testid="stat-financial-aid">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('month_financial_aid')}</p>
                <p className="text-2xl font-manrope font-bold text-foreground">
                  Rp {(stats?.month_financial_aid || 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Priority Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Grief Support Widget */}
        <Card className="border-border shadow-sm" data-testid="grief-support-widget">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-manrope font-semibold flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600" />
              {t('active_grief_support')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeGrief.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">{t('empty_states.no_grief_support')}</p>
            ) : (
              <div className="space-y-3">
                {activeGrief.map((grief) => (
                  <div key={grief.member_id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors" data-testid={`grief-member-${grief.member_id}`}>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{grief.member_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {grief.stages.length} {grief.stages.length === 1 ? 'stage' : 'stages'} pending
                      </p>
                    </div>
                    <Link to={`/members/${grief.member_id}`}>
                      <Button size="sm" variant="outline">{t('view')}</Button>
                    </Link>
                  </div>
                ))}
                {activeGrief.length >= 5 && (
                  <Link to="/members" className="text-sm text-primary-500 hover:underline block text-center mt-2">
                    View all →
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Members at Risk Widget */}
        <Card className="border-border shadow-sm" data-testid="at-risk-widget">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-manrope font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              {t('members_at_risk')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {atRiskMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">All members recently contacted!</p>
            ) : (
              <div className="space-y-3">
                {atRiskMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors" data-testid={`at-risk-member-${member.id}`}>
                    <MemberAvatar member={member} size="sm" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.days_since_last_contact} {t('days_ago')}
                      </p>
                    </div>
                    <EngagementBadge status={member.engagement_status} days={member.days_since_last_contact} />
                  </div>
                ))}
                {atRiskMembers.length >= 5 && (
                  <Link to="/members" className="text-sm text-primary-500 hover:underline block text-center mt-2">
                    View all →
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Events and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="border-border shadow-sm" data-testid="upcoming-events-widget">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-manrope font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent-500" />
              Upcoming Events (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No upcoming events in the next 7 days.</p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors" data-testid={`upcoming-event-${event.id}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <EventTypeBadge type={event.event_type} />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.event_date), 'dd MMM yyyy')}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.member_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="border-border shadow-sm" data-testid="recent-activity-widget">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-manrope font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">{t('empty_states.no_care_events')}</p>
            ) : (
              <div className="space-y-2">
                {recentActivity.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors" data-testid={`recent-event-${event.id}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <EventTypeBadge type={event.event_type} />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.created_at), 'dd MMM, HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.member_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;