import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, PieChart as PieIcon, BarChart2 } from 'lucide-react';

const ExpenseChart = ({ expenses, timeRange = 'all' }) => {
  const chartData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const monthlyData = {};
    expenses.forEach(expense => {
      const date = expense.date?.seconds
        ? new Date(expense.date.seconds * 1000)
        : new Date(expense.date || Date.now());

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-IN', { month: 'short' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthName, total: 0 };
      }
      monthlyData[monthKey].total += (expense.cost || 0);
    });

    return Object.values(monthlyData);
  }, [expenses]);

  const categoryData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const categoryTotals = {};
    expenses.forEach(expense => {
      const category = expense.category || 'Prescription';
      categoryTotals[category] = (categoryTotals[category] || 0) + (expense.cost || 0);
    });

    return Object.entries(categoryTotals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const COLORS = ['#2563eb', '#0d9488', '#7c3aed', '#f59e0b', '#ec4899', '#06b6d4', '#10b981', '#8b5cf6'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border/80 bg-popover/95 p-3 shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-foreground">{label}</p>
          <p className="text-primary font-extrabold tabular-numbers mt-0.5">
            ₹{Number(payload[0].value).toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!expenses || expenses.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Bar Chart: Spending Timeline */}
      <Card className="lg:col-span-7 border-border/80 shadow-xs">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            Monthly Medical Expenditure (₹)
          </CardTitle>
          <CardDescription className="text-xs">
            Cumulative payments across prescription regimens and diagnostic tests.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart: Category Breakdown */}
      <Card className="lg:col-span-5 border-border/80 shadow-xs">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-secondary" />
            Category Allocation
          </CardTitle>
          <CardDescription className="text-xs">
            Proportional split by healthcare expenditure type.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col items-center">
          <div className="h-48 w-full max-w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="total"
                  nameKey="category"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`₹${Number(value).toLocaleString('en-IN')}`, name]}
                  contentStyle={{
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full flex flex-wrap gap-2 justify-center pt-2">
            {categoryData.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate max-w-[110px] font-medium">{item.category}</span>
                <span className="font-bold text-foreground tabular-numbers">₹{item.total.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseChart;
