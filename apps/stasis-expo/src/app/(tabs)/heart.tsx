import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View, type ColorValue, type GestureResponderEvent, type PointerEvent } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Line, Path, Stop } from 'react-native-svg';

import { Screen } from '@/components/screen';
import { Card, MetricCard, PreviewBadge, ScreenTitle, SectionTitle } from '@/components/ui';
import { heartRate24Hour, hrvTrend, previewSnapshot } from '@/data/preview-data';
import { colors, radius, spacing, typography } from '@/design/tokens';

function MiniBars({ values, color }: { values: number[]; color: ColorValue }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  return (
    <View style={styles.bars}>
      {values.map((value, index) => (
        <View key={`${value}-${index}`} style={styles.barSlot}>
          <View style={[styles.bar, { backgroundColor: color, height: 22 + ((value - min) / Math.max(1, max - min)) * 62 }]} />
          <Text style={styles.dayLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text>
        </View>
      ))}
    </View>
  );
}

function TrendCard({ title, value, unit, caption, values, color, icon }: { title: string; value: number; unit: string; caption: string; values: number[]; color: ColorValue; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <Card>
      <View style={styles.trendHeader}>
        <View style={styles.trendTitleRow}>
          <View style={[styles.trendIcon, { backgroundColor: colors.controlFill }]}><Ionicons color={color} name={icon} size={18} /></View>
          <Text style={styles.trendTitle}>{title}</Text>
        </View>
        <Text style={styles.trendValue}>{value}<Text style={styles.trendUnit}> {unit}</Text></Text>
      </View>
      <MiniBars values={values} color={color} />
      <Text style={styles.caption}>{caption}</Text>
    </Card>
  );
}

const chartWidth = 300;
const chartHeight = 132;
const yMin = 40;
const yMax = 100;
const yTicks = [100, 80, 60, 40];

function chartPoint(value: number, index: number, values: number[]) {
  const x = (index / (values.length - 1)) * chartWidth;
  const y = ((yMax - value) / (yMax - yMin)) * chartHeight;
  return { x, y };
}

function sampleTime(anchor: Date, index: number) {
  const time = new Date(anchor);
  time.setMinutes(0, 0, 0);
  time.setHours(time.getHours() - (heartRate24Hour.length - 1 - index));
  return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function HeartRateDayCard() {
  const anchorTime = useRef(new Date()).current;
  const isScrubbing = useRef(false);
  const [plotWidth, setPlotWidth] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const points = heartRate24Hour.map((value, index) => chartPoint(value, index, heartRate24Hour));
  const linePath = points.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
  const activeIndex = selectedIndex ?? heartRate24Hour.length - 1;
  const activePoint = points[activeIndex];
  const activeValue = heartRate24Hour[activeIndex];
  const activeTime = sampleTime(anchorTime, activeIndex);
  const tooltipLeft = plotWidth > 0
    ? Math.min(plotWidth - 48, Math.max(48, (activePoint.x / chartWidth) * plotWidth))
    : 48;
  const tooltipTop = Math.max(4, activePoint.y - 50);
  const xAxisIndices = [0, 6, 12, 18, 24];

  function selectSample(event: GestureResponderEvent) {
    if (plotWidth <= 0) return;
    const x = Math.max(0, Math.min(plotWidth, event.nativeEvent.locationX));
    setSelectedIndex(Math.round((x / plotWidth) * (heartRate24Hour.length - 1)));
  }

  function selectPointerSample(event: PointerEvent) {
    if (plotWidth <= 0) return;
    const x = Math.max(0, Math.min(plotWidth, event.nativeEvent.offsetX));
    setSelectedIndex(Math.round((x / plotWidth) * (heartRate24Hour.length - 1)));
  }

  return (
    <Card>
      <View style={styles.trendHeader}>
        <View style={styles.trendTitleRow}>
          <View style={[styles.trendIcon, { backgroundColor: colors.controlFill }]}>
            <Ionicons color={colors.coral} name="heart" size={18} />
          </View>
          <View>
            <Text style={styles.trendTitle}>Heart rate</Text>
            <Text style={styles.chartPeriod}>LAST 24 HOURS</Text>
          </View>
        </View>
        <Text style={styles.trendValue}>{activeValue}<Text style={styles.trendUnit}> bpm</Text></Text>
      </View>

      <View accessibilityLabel="Heart rate over the last 24 hours, from midnight to now" style={styles.chartBlock}>
        <View style={styles.yAxisHeader}><Text style={styles.axisTitle}>BPM</Text></View>
        <View style={styles.chartRow}>
          <View style={styles.yAxisLabels}>
            {yTicks.map((tick) => <Text key={tick} style={styles.axisLabel}>{tick}</Text>)}
          </View>
          <View style={styles.plotArea}>
            <View
              accessibilityLabel={`${activeValue} beats per minute at ${activeTime}. Tap or drag to inspect the chart.`}
              accessibilityRole="adjustable"
              onLayout={(event) => setPlotWidth(event.nativeEvent.layout.width)}
              onMoveShouldSetResponder={() => true}
              onPointerDown={(event) => {
                isScrubbing.current = true;
                selectPointerSample(event);
              }}
              onPointerMove={(event) => {
                if (isScrubbing.current) selectPointerSample(event);
              }}
              onPointerUp={() => { isScrubbing.current = false; }}
              onResponderGrant={selectSample}
              onResponderMove={selectSample}
              onStartShouldSetResponder={() => true}
              style={styles.plotCanvas}
            >
              <Svg height={chartHeight} style={styles.chartSvg} viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%">
                <Defs>
                  <SvgLinearGradient id="heartFill" x1="0" x2="0" y1="0" y2="1">
                    <Stop offset="0" stopColor={colors.coral} stopOpacity={0.28} />
                    <Stop offset="1" stopColor={colors.coral} stopOpacity={0.02} />
                  </SvgLinearGradient>
                </Defs>
                {yTicks.map((tick) => {
                  const y = ((yMax - tick) / (yMax - yMin)) * chartHeight;
                  return <Line key={tick} stroke={colors.borderStrong} strokeDasharray="3 6" strokeWidth={1} x1={0} x2={chartWidth} y1={y} y2={y} />;
                })}
                {xAxisIndices.map((hour) => {
                  const x = (hour / 24) * chartWidth;
                  return <Line key={hour} opacity={0.45} stroke={colors.borderStrong} strokeWidth={1} x1={x} x2={x} y1={0} y2={chartHeight} />;
                })}
                <Path d={areaPath} fill="url(#heartFill)" />
                <Path d={linePath} fill="none" stroke={colors.coral} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
                {selectedIndex !== null && <Line stroke={colors.textMuted} strokeDasharray="2 4" strokeWidth={1} x1={activePoint.x} x2={activePoint.x} y1={0} y2={chartHeight} />}
                <Circle cx={activePoint.x} cy={activePoint.y} fill={colors.surfaceSolid} r={selectedIndex === null ? 5 : 6} stroke={colors.coral} strokeWidth={3} />
              </Svg>
              {selectedIndex !== null && (
                <View style={[styles.chartTooltip, { left: tooltipLeft, top: tooltipTop }]}>
                  <Text style={styles.tooltipValue}>{activeValue} BPM</Text>
                  <Text style={styles.tooltipTime}>{activeTime}</Text>
                </View>
              )}
            </View>
            <View style={styles.xAxisLabels}>
              {xAxisIndices.map((index) => <Text key={index} style={styles.axisLabel}>{index === 24 ? 'NOW' : sampleTime(anchorTime, index)}</Text>)}
            </View>
            <Text style={styles.xAxisTitle}>TIME</Text>
          </View>
        </View>
      </View>
      <Text style={styles.caption}>Tap or drag across the line to inspect the exact BPM and sample time.</Text>
    </Card>
  );
}

export default function HeartScreen() {
  return (
    <Screen>
      <ScreenTitle action={<PreviewBadge />}>Heart</ScreenTitle>
      <View style={styles.metricRow}>
        <MetricCard icon="heart-outline" label="Resting HR" value={`${previewSnapshot.restingHeartRate}`} unit="bpm" accent={colors.coral} />
        <MetricCard icon="pulse-outline" label="HRV" value={`${previewSnapshot.hrv}`} unit="ms" accent={colors.mint} />
      </View>
      <SectionTitle>Heart trends</SectionTitle>
      <TrendCard title="Heart rate variability" value={82} unit="ms" caption="Stable around the preview baseline." values={hrvTrend} color={colors.mint} icon="pulse" />
      <HeartRateDayCard />
      <Card style={styles.infoCard}>
        <Ionicons color={colors.cyan} name="information-circle-outline" size={20} />
        <Text style={styles.infoText}>Stasis compares your nightly values with your own rolling baseline—not a population average.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metricRow: { flexDirection: 'row', gap: spacing.sm },
  trendHeader: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  trendTitleRow: { alignItems: 'center', flexDirection: 'row', flexShrink: 1, gap: spacing.sm },
  trendIcon: { alignItems: 'center', borderRadius: radius.sm, height: 36, justifyContent: 'center', width: 36 },
  trendTitle: { color: colors.text, fontSize: 15, fontWeight: '600', flexShrink: 1 },
  trendValue: { color: colors.text, fontSize: 22, fontWeight: '700' },
  trendUnit: { color: colors.textMuted, fontSize: 12, fontWeight: '500' },
  bars: { alignItems: 'flex-end', flexDirection: 'row', gap: 8, height: 112, marginTop: spacing.lg },
  barSlot: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { borderCurve: 'continuous', borderRadius: radius.pill, opacity: 0.86, width: '58%' },
  dayLabel: { color: colors.textFaint, fontSize: 10, fontWeight: '600', marginTop: 6 },
  chartPeriod: { color: colors.textFaint, fontSize: 10, fontWeight: '700', letterSpacing: 0.6, marginTop: 2 },
  chartBlock: { marginTop: spacing.lg },
  yAxisHeader: { height: 16, marginLeft: 2 },
  axisTitle: { color: colors.textFaint, fontSize: 9, fontWeight: '700', letterSpacing: 0.7 },
  chartRow: { flexDirection: 'row' },
  yAxisLabels: { height: chartHeight, justifyContent: 'space-between', paddingBottom: 1, width: 30 },
  plotArea: { flex: 1 },
  plotCanvas: { height: chartHeight, position: 'relative' },
  chartSvg: { pointerEvents: 'none' },
  chartTooltip: { alignItems: 'center', backgroundColor: colors.glassStrong, borderColor: colors.borderStrong, borderRadius: radius.sm, borderWidth: StyleSheet.hairlineWidth, minWidth: 96, paddingHorizontal: 8, paddingVertical: 6, pointerEvents: 'none', position: 'absolute', transform: [{ translateX: -48 }] },
  tooltipValue: { color: colors.text, fontSize: 12, fontWeight: '700' },
  tooltipTime: { color: colors.textMuted, fontSize: 10, fontWeight: '600', marginTop: 1 },
  axisLabel: { color: colors.textFaint, fontSize: 9, fontWeight: '600' },
  xAxisLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
  xAxisTitle: { color: colors.textFaint, fontSize: 9, fontWeight: '700', letterSpacing: 0.7, marginTop: 7, textAlign: 'center' },
  caption: { color: colors.textMuted, ...typography.caption, marginTop: spacing.md },
  infoCard: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  infoText: { color: colors.textMuted, flex: 1, ...typography.caption },
});
