import * as React from 'react'
import { Box, Text } from '../../ink.js'

// ANSI Shadow style ASCII art for each letter of "WaytoAGI"
// 8 letters × 6 rows, rainbow colors
const BANNER_LETTERS = [
  {
    key: 'W',
    color: '#FF4444',
    rows: [
      '██╗    ██╗',
      '██║    ██║',
      '██║ █╗ ██║',
      '██║███╗██║',
      '╚███╔███╔╝',
      ' ╚══╝╚══╝ ',
    ],
  },
  {
    key: 'a',
    color: '#FF8C00',
    rows: [
      ' █████╗ ',
      '██╔══██╗',
      '███████║',
      '██╔══██║',
      '██║  ██║',
      '╚═╝  ╚═╝',
    ],
  },
  {
    key: 'y',
    color: '#FFD700',
    rows: [
      '██╗   ██╗',
      '╚██╗ ██╔╝',
      ' ╚████╔╝ ',
      '  ╚██╔╝  ',
      '   ██║   ',
      '   ╚═╝   ',
    ],
  },
  {
    key: 't',
    color: '#44FF44',
    rows: [
      '████████╗',
      '╚══██╔══╝',
      '   ██║   ',
      '   ██║   ',
      '   ██║   ',
      '   ╚═╝   ',
    ],
  },
  {
    key: 'o',
    color: '#00CCFF',
    rows: [
      ' ██████╗ ',
      '██╔═══██╗',
      '██║   ██║',
      '██║   ██║',
      '╚██████╔╝',
      ' ╚═════╝ ',
    ],
  },
  {
    key: 'A',
    color: '#4488FF',
    rows: [
      ' █████╗ ',
      '██╔══██╗',
      '███████║',
      '██╔══██║',
      '██║  ██║',
      '╚═╝  ╚═╝',
    ],
  },
  {
    key: 'G',
    color: '#9944FF',
    rows: [
      ' ██████╗ ',
      '██╔════╝ ',
      '██║  ███╗',
      '██║   ██║',
      '╚██████╔╝',
      ' ╚═════╝ ',
    ],
  },
  {
    key: 'I',
    color: '#FF44CC',
    rows: [
      ' ██╗ ',
      ' ██║ ',
      ' ██║ ',
      ' ██║ ',
      ' ██║ ',
      ' ╚═╝ ',
    ],
  },
]

export function WaytoAGIBanner(): React.ReactNode {
  return (
    <Box flexDirection="row">
      {BANNER_LETTERS.map((letter, idx) => (
        <Box key={idx} flexDirection="column">
          {letter.rows.map((row, rowIdx) => (
            <Text key={rowIdx} color={letter.color}>
              {row}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  )
}
