import React from 'react';
import { Pie, PieChart, Sector, Tooltip } from 'recharts';
import type { PieSectorDataItem, TooltipIndex } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

// On définit la structure d'un point de donnée
interface ChartDataPoint {
  name: string;
  value: number;
}

// On met à jour les Props du composant
interface GraphStatutProps {
  data: ChartDataPoint[]; // <--- On accepte les données ici
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
}

const RenderActiveShape = (props: PieSectorDataItem) => {
  const {
    cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0,
    startAngle, endAngle, fill, payload, percent = 0, value,
  } = props;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold">
        {payload.name}
      </text>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx} cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
        {`Nombre : ${value}`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function GraphStatut({
  data, // <--- On récupère data
  isAnimationActive = true,
  defaultIndex,
}: GraphStatutProps) {
  return (
    <div className="w-full flex justify-center items-center">
      <PieChart
        width={650} // J'ai un peu réduit pour que ça rentre mieux dans ton 1/3
        height={400}
        margin={{ top: 20, right: 100, bottom: 20, left: 100 }}
      >
        <Pie
          data={data} // <--- On utilise les données passées en props
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="80%"
          fill="#3b82f6" 
          activeShape={RenderActiveShape}
          isAnimationActive={isAnimationActive}
        />
        <Tooltip content={() => null} defaultIndex={defaultIndex} />
        <RechartsDevtools />
      </PieChart>
    </div>
  );
}