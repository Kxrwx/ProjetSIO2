import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, Cell } from 'recharts';

interface TinyBarChartProps {
  data: { name: string; total: number }[];
}

const TinyBarChart = ({ data }: TinyBarChartProps) => {
  
  // 1. C'EST ICI QUE TU CHOISIS TES COULEURS
  const getBarColor = (priorityName: string) => {
    const name = priorityName.toLowerCase();
    
    if (name.includes('haute') || name.includes('haut')) {
      return '#ef4444'; 
    }
    if (name.includes('modéré')) {
      return '#f59e0b'; 
    }
    if (name.includes('critique')) {
      return '#8e0c08'; 
    }
    
    return '#6366f1'; // Indigo par défaut pour le reste
  };

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={45}>
            {/* 2. ON APPLIQUE LA COULEUR À CHAQUE BARRE ICI */}
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TinyBarChart;