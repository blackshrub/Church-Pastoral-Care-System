import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const COLORS = [
  'hsl(45, 90%, 65%)',
  'hsl(330, 75%, 70%)',
  'hsl(240, 15%, 45%)',
  'hsl(25, 85%, 62%)',
  'hsl(15, 70%, 58%)',
  'hsl(200, 40%, 50%)',
  'hsl(140, 55%, 48%)',
  'hsl(180, 42%, 45%)'
];

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, DollarSign, Heart, Calendar, Target } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const COLORS = {
  primary: ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'],
  demographic: ['#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'],
  financial: ['#059669', '#dc2626', '#d97706', '#7c3aed', '#0284c7']
};

export const Analytics = () => {
  const { t } = useTranslation();
  const [memberStats, setMemberStats] = useState(null);
  const [eventsByType, setEventsByType] = useState([]);
  const [demographicData, setDemographicData] = useState({});
  const [financialData, setFinancialData] = useState({});
  const [engagementData, setEngagementData] = useState({});
  const [griefData, setGriefData] = useState({});
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);
  
  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [membersRes, eventsRes, griefRes, aidSummaryRes, scheduleRes] = await Promise.all([
        axios.get(`${API}/members`),
        axios.get(`${API}/care-events`),
        axios.get(`${API}/analytics/grief-completion-rate`),
        axios.get(`${API}/financial-aid/summary`),
        axios.get(`${API}/financial-aid-schedules`)
      ]);
      
      const members = membersRes.data;
      const events = eventsRes.data;
      
      // Member Demographics
      const ageGroups = { 'Child (0-12)': 0, 'Teen (13-17)': 0, 'Youth (18-30)': 0, 'Adult (31-60)': 0, 'Senior (60+)': 0 };
      const genderData = { Male: 0, Female: 0, Unknown: 0 };
      const membershipData = { Member: 0, 'Non Member': 0, Visitor: 0, Sympathizer: 0, 'Inactive': 0 };
      const categoryData = { Umum: 0, Youth: 0, Teen: 0, Usinda: 0, Other: 0 };
      const engagementStatus = { active: 0, at_risk: 0, inactive: 0 };
      
      members.forEach(m => {
        // Age groups
        const age = m.age || 0;
        if (age <= 12) ageGroups['Child (0-12)']++;
        else if (age <= 17) ageGroups['Teen (13-17)']++;
        else if (age <= 30) ageGroups['Youth (18-30)']++;
        else if (age <= 60) ageGroups['Adult (31-60)']++;
        else ageGroups['Senior (60+)']++;
        
        // Gender
        if (m.gender === 'M') genderData.Male++;
        else if (m.gender === 'F') genderData.Female++;
        else genderData.Unknown++;
        
        // Membership
        const membership = m.membership_status || 'Unknown';
        if (membershipData.hasOwnProperty(membership)) membershipData[membership]++;
        
        // Category
        const category = m.category || 'Other';
        if (categoryData.hasOwnProperty(category)) categoryData[category]++;
        else categoryData.Other++;
        
        // Engagement
        const status = m.engagement_status || 'inactive';
        engagementStatus[status]++;
      });
      
      // Care Event Analysis
      const eventTypeCount = {};
      const eventsByMonth = {};
      const currentYear = new Date().getFullYear();
      
      events.forEach(e => {
        // Event types
        eventTypeCount[e.event_type] = (eventTypeCount[e.event_type] || 0) + 1;
        
        // Events by month
        const date = new Date(e.event_date);
        if (date.getFullYear() === currentYear) {
          const month = date.toLocaleDateString('en', { month: 'short' });
          eventsByMonth[month] = (eventsByMonth[month] || 0) + 1;
        }
      });
      
      // Financial Analysis
      const financialByType = aidSummaryRes.data.by_type || {};
      const totalFinancialAid = aidSummaryRes.data.total_amount || 0;
      const avgAidByType = {};
      Object.entries(financialByType).forEach(([type, data]) => {
        avgAidByType[type] = data.count > 0 ? Math.round(data.total_amount / data.count) : 0;
      });
      
      // Set all data
      setMemberStats({
        total: members.length,
        withPhotos: members.filter(m => m.photo_url).length,
        avgAge: Math.round(members.reduce((sum, m) => sum + (m.age || 0), 0) / members.length)
      });
      
      setEventsByType(Object.entries(eventTypeCount).map(([type, count]) => ({ 
        name: type.replace('_', ' ').toUpperCase(), 
        value: count,
        percentage: Math.round(count / events.length * 100)
      })));
      
      setDemographicData({
        ageGroups: Object.entries(ageGroups).map(([group, count]) => ({ name: group, value: count })),
        gender: Object.entries(genderData).map(([gender, count]) => ({ name: gender, value: count })),
        membership: Object.entries(membershipData).map(([status, count]) => ({ name: status, value: count })),
        category: Object.entries(categoryData).map(([cat, count]) => ({ name: cat, value: count })),
        engagement: Object.entries(engagementStatus).map(([status, count]) => ({ name: status, value: count }))
      });
      
      setFinancialData({
        totalAid: totalFinancialAid,
        byType: Object.entries(financialByType).map(([type, data]) => ({ 
          name: type.replace('_', ' '),
          amount: data.total_amount,
          count: data.count,
          avg: avgAidByType[type]
        })),
        schedules: scheduleRes.data.length,
        scheduledAmount: scheduleRes.data.reduce((sum, s) => sum + (s.aid_amount || 0), 0)
      });
      
      setEngagementData({
        trends: Object.entries(eventsByMonth).map(([month, count]) => ({ month, events: count }))
      });
      
      setGriefData(griefRes.data);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-96 w-full" /></div>;
  }
  
  const chartData = eventsByType.map(item => ({
    name: t(`event_types.${item.type}`),
    count: item.count
  }));
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-manrope font-bold text-foreground">{t('analytics')}</h1>
        <p className="text-muted-foreground mt-1">Pastoral care insights and trends</p>
      </div>
      
      {/* Grief Completion Stats */}
      {griefCompletion && griefCompletion.total_stages > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Grief Support Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Stages</p>
                <p className="text-2xl font-bold">{griefCompletion.total_stages}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{griefCompletion.completed_stages}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{griefCompletion.pending_stages}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-primary-600">{griefCompletion.completion_rate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Care Events Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Care Events by Type</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">No care events data</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;