import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../src/App'

describe('App routing', () => {
  it('renders Dashboard as default admin route', () => {
    render(<App />)
    const elements = screen.getAllByText('Dashboard')
    expect(elements.length).toBeGreaterThan(0)
  })
})
