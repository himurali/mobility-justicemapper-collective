
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ImpactData {
  category: string;
  value: number;
  color: string;
}

interface ContributionHistory {
  month: string;
  contributions: number;
}

interface ImpactMetricsProps {
  metrics: {
    impactCategories: ImpactData[];
    contributionHistory: ContributionHistory[];
    impactScore: number;
    issuesSolved: number;
    communitiesJoined: number;
    peopleImpacted: number;
  };
}

export const ImpactMetrics: React.FC<ImpactMetricsProps> = ({ metrics }) => {
  const { impactCategories, contributionHistory, impactScore, issuesSolved, communitiesJoined, peopleImpacted } = metrics;
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{impactScore}</div>
            <div className="text-sm text-muted-foreground mt-1">Impact Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">{issuesSolved}</div>
            <div className="text-sm text-muted-foreground mt-1">Issues Solved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{communitiesJoined}</div>
            <div className="text-sm text-muted-foreground mt-1">Communities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">{peopleImpacted.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">People Impacted</div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Contribution History</h3>
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={contributionHistory}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="contributions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Impact by Category</h3>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={impactCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {impactCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Impact Categories</h3>
          <Card>
            <CardContent className="p-4 space-y-4">
              {impactCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span>{category.category}</span>
                    </div>
                    <Badge variant="outline">{category.value} points</Badge>
                  </div>
                  <Progress 
                    value={category.value} 
                    max={Math.max(...impactCategories.map(c => c.value))} 
                    className="h-2" 
                    style={{ backgroundColor: `${category.color}30` }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
