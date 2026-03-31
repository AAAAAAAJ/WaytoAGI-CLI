import React from 'react'
import { Box, Text, useTheme, color } from 'src/ink.js'
import type { HexColor } from '../../ink/styles.js'
import { env } from '../../utils/env.js'
import { useTerminalSize } from '../../hooks/useTerminalSize.js'
import { useMainLoopModel } from '../../hooks/useMainLoopModel.js'
import { getLogoDisplayData, truncatePath } from '../../utils/logoV2Utils.js'
import { renderModelSetting } from '../../utils/model/model.js'
import { resolveThemeSetting } from '../../utils/systemTheme.js'
import { getGlobalConfig } from '../../utils/config.js'
import { OffscreenFreeze } from '../OffscreenFreeze.js'
import { EmergencyTip } from './EmergencyTip.js'
import { WaytoAGIBanner } from './WaytoAGIBanner.js'

// Letter widths: W(10)+a(8)+y(9)+t(9)+o(9)+A(8)+G(9)+I(5) = 67
const BANNER_WIDTH = 67

const TAGLINE = '❯ ✦ AI Community  ·  Empowered by AI  ✦'

// Rainbow colors for each letter of WaytoAGI
const LETTER_COLORS: [string, HexColor][] = [
  ['W', '#FF4444'],
  ['a', '#FF8C00'],
  ['y', '#FFD700'],
  ['t', '#44FF44'],
  ['o', '#00CCFF'],
  ['A', '#4488FF'],
  ['G', '#9944FF'],
  ['I', '#FF44CC'],
]

function buildRainbowBorderTitle(
  version: string,
  userTheme: ReturnType<typeof resolveThemeSetting>,
): string {
  const letters = LETTER_COLORS.map(([char, hex]) =>
    color(hex, userTheme)(char),
  ).join('')
  const ver = color('inactive', userTheme)(` v${version}`)
  return ` ${letters}${ver} `
}

export function WelcomeV2(): React.ReactNode {
  const [theme] = useTheme()
  const { columns } = useTerminalSize()
  const model = useMainLoopModel()
  const modelDisplayName = renderModelSetting(model)
  const { version, cwd, billingType } = getLogoDisplayData()
  const userTheme = resolveThemeSetting(getGlobalConfig().theme)
  const truncatedCwd = truncatePath(cwd, Math.max(BANNER_WIDTH - 4, 20))

  // Apple Terminal: no full-block Unicode support, show simple colored fallback
  if (env.terminal === 'Apple_Terminal') {
    return (
      <Box flexDirection="column" paddingY={1}>
        <Box flexDirection="row">
          {LETTER_COLORS.map(([char, hex]) => (
            <Text key={char} bold color={hex}>{char}</Text>
          ))}
          <Text dimColor> v{version}</Text>
        </Box>
        <Text dimColor>{TAGLINE}</Text>
        <Text dimColor>{modelDisplayName} · {billingType}</Text>
        <Text dimColor>{truncatedCwd}</Text>
      </Box>
    )
  }

  const borderTitle = buildRainbowBorderTitle(version, userTheme)
  const separator = '─'.repeat(BANNER_WIDTH)

  return (
    <OffscreenFreeze>
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="claude"
        borderText={{ content: borderTitle, position: 'top', align: 'start', offset: 1 }}
        paddingX={2}
        paddingY={1}
      >
        {/* ── Rainbow ASCII art ── */}
        <WaytoAGIBanner />

        {/* ── Tagline ── */}
        <Box marginTop={1}>
          <Text dimColor>{TAGLINE}</Text>
        </Box>

        {/* ── Separator ── */}
        <Box marginTop={1} marginBottom={1}>
          <Text dimColor>{separator}</Text>
        </Box>

        {/* ── Model · Billing · Version ── */}
        <Box>
          <Text dimColor>
            {modelDisplayName}
            {' · '}
            {billingType}
            {' · '}
            v{version}
          </Text>
        </Box>

        {/* ── Current directory ── */}
        <Box>
          <Text dimColor>{truncatedCwd}</Text>
        </Box>

        {/* ── Emergency tip (shown when a new tip is available) ── */}
        <EmergencyTip />
      </Box>
    </OffscreenFreeze>
  )
}
