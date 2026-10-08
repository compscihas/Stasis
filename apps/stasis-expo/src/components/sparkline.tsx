import { StyleSheet, View, type ColorValue } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const width = 68;
const height = 28;
const inset = 3;

export function Sparkline({ values, color, label, kind = 'line', expanded = false }: { values: readonly number[]; color: ColorValue; label: string; kind?: 'line' | 'bars'; expanded?: boolean }) {
  if (values.length < 2 || values.some((value) => !Number.isFinite(value))) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const y = (value: number) => range === 0 ? height / 2 : inset + (1 - (value - min) / range) * (height - inset * 2);
  const path = values.map((value, index) => `${index === 0 ? 'M' : 'L'} ${inset + index / (values.length - 1) * (width - inset * 2)} ${y(value)}`).join(' ');
  const slot = (width - inset * 2) / values.length;
  return (
    <View accessibilityRole="image" accessibilityLabel={label} style={[styles.chart, expanded && styles.expanded]}>
      <Svg width={expanded ? '100%' : width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {kind === 'bars'
          ? values.map((value, index) => {
            const barHeight = max > 0 ? Math.max(1, Math.max(0, value) / max * (height - inset * 2)) : 1;
            return <Rect key={index} x={inset + index * slot} y={height - inset - barHeight} width={slot * 0.55} height={barHeight} fill={color} rx={1} />;
          })
          : <Path d={path} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({ chart: { flexShrink: 0, height, width }, expanded: { marginTop: 12, width: '100%' } });
